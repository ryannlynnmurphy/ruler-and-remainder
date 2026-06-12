// Neon (serverless Postgres) — the backend's only stateful dependency.
// Holds two things, per the design: the public ledger of reality-checks, and
// the infrastructure tables (per-IP rate-limit counters + a news-feed cache).
//
// Everything here is best-effort: if DATABASE_URL is unset or the database is
// unreachable, callers fall back gracefully rather than taking the instrument
// down. The reality check still runs; it just isn't logged or rate-limited.

import { neon } from "@neondatabase/serverless";

let _sql = null;
export function db() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) return null; // no database configured — callers degrade gracefully
  _sql = neon(url);
  return _sql;
}

// Idempotent schema bootstrap. Runs once per cold start; the IF NOT EXISTS
// guards make it safe to call on every request.
let _schemaReady = null;
export function ensureSchema() {
  if (_schemaReady) return _schemaReady;
  const sql = db();
  if (!sql) return Promise.resolve(false);
  _schemaReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS checks (
        id          BIGSERIAL PRIMARY KEY,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        model       TEXT        NOT NULL,
        story       TEXT        NOT NULL,
        verdict     TEXT        NOT NULL,
        source      TEXT,
        published   BOOLEAN     NOT NULL DEFAULT TRUE
      )`;
    await sql`
      CREATE INDEX IF NOT EXISTS checks_published_created_idx
        ON checks (published, created_at DESC)`;
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        bucket       TEXT PRIMARY KEY,
        count        INTEGER     NOT NULL DEFAULT 0,
        window_start TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS feed_cache (
        key        TEXT PRIMARY KEY,
        payload    JSONB       NOT NULL,
        fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    return true;
  })().catch((e) => {
    _schemaReady = null; // let the next request retry the bootstrap
    throw e;
  });
  return _schemaReady;
}

// ---- the public ledger ----------------------------------------------------

export async function recordCheck({ model, story, verdict, source, published }) {
  const sql = db();
  if (!sql) return null;
  await ensureSchema();
  const rows = await sql`
    INSERT INTO checks (model, story, verdict, source, published)
    VALUES (${model}, ${story}, ${verdict}, ${source ?? null}, ${published !== false})
    RETURNING id, created_at`;
  return rows[0] ?? null;
}

export async function listChecks({ limit = 24, before = null } = {}) {
  const sql = db();
  if (!sql) return [];
  await ensureSchema();
  const cap = Math.min(Math.max(parseInt(limit, 10) || 24, 1), 50);
  const rows = before
    ? await sql`
        SELECT id, created_at, model, story, verdict, source
        FROM checks
        WHERE published = TRUE AND id < ${before}
        ORDER BY id DESC LIMIT ${cap}`
    : await sql`
        SELECT id, created_at, model, story, verdict, source
        FROM checks
        WHERE published = TRUE
        ORDER BY id DESC LIMIT ${cap}`;
  return rows;
}

// ---- rate limiting --------------------------------------------------------

// Atomic time-bucketed counter. Returns the post-increment count for the
// bucket, or null if there's no database (caller treats null as "allow").
export async function bumpRateLimit(bucket) {
  const sql = db();
  if (!sql) return null;
  await ensureSchema();
  const rows = await sql`
    INSERT INTO rate_limits (bucket, count, window_start)
    VALUES (${bucket}, 1, now())
    ON CONFLICT (bucket)
      DO UPDATE SET count = rate_limits.count + 1
    RETURNING count`;
  return rows[0]?.count ?? null;
}

// ---- feed cache -----------------------------------------------------------

export async function getFeedCache(key, maxAgeMs) {
  const sql = db();
  if (!sql) return null;
  try {
    await ensureSchema();
    const rows = await sql`SELECT payload, fetched_at FROM feed_cache WHERE key = ${key}`;
    if (!rows[0]) return null;
    const age = Date.now() - new Date(rows[0].fetched_at).getTime();
    if (age > maxAgeMs) return null;
    return rows[0].payload;
  } catch {
    return null;
  }
}

export async function setFeedCache(key, payload) {
  const sql = db();
  if (!sql) return;
  try {
    await ensureSchema();
    const json = JSON.stringify(payload);
    await sql`
      INSERT INTO feed_cache (key, payload, fetched_at)
      VALUES (${key}, ${json}::jsonb, now())
      ON CONFLICT (key)
        DO UPDATE SET payload = ${json}::jsonb, fetched_at = now()`;
  } catch {
    /* cache is best-effort */
  }
}

// ---- the Studio: persistence floor -----------------------------------------
// The agentic workstation's living archive: conversations the user keeps, and
// the artifacts (distillations) they choose to keep from them. Deliberately a
// SEPARATE schema bootstrap from ensureSchema() above — a Studio failure must
// never take down the ledger / feed / reality check. All best-effort, same as
// the rest of this file: no database → callers degrade gracefully.

let _studioReady = null;
export function ensureStudioSchema() {
  if (_studioReady) return _studioReady;
  const sql = db();
  if (!sql) return Promise.resolve(false);
  _studioReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        title       TEXT        NOT NULL DEFAULT 'untitled',
        mode        TEXT        NOT NULL DEFAULT 'build',
        messages    JSONB       NOT NULL DEFAULT '[]'::jsonb,
        starred     BOOLEAN     NOT NULL DEFAULT FALSE
      )`;
    await sql`
      CREATE INDEX IF NOT EXISTS conversations_updated_idx
        ON conversations (updated_at DESC)`;
    await sql`
      CREATE TABLE IF NOT EXISTS artifacts (
        id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
        title                  TEXT        NOT NULL DEFAULT 'untitled',
        kind                   TEXT        NOT NULL DEFAULT 'argument',
        tier                   TEXT        NOT NULL DEFAULT 'exploratory',
        body                   TEXT        NOT NULL,
        source_conversation_id UUID,
        status                 TEXT        NOT NULL DEFAULT 'draft'
      )`;
    await sql`
      CREATE INDEX IF NOT EXISTS artifacts_created_idx
        ON artifacts (created_at DESC)`;
    return true;
  })().catch((e) => {
    _studioReady = null; // let the next request retry the bootstrap
    throw e;
  });
  return _studioReady;
}

const KIND = new Set(["argument", "finding", "verdict", "map", "brief"]);
const TIER = new Set(["established", "exploratory", "speculative"]);
const clampText = (s, n) => (typeof s === "string" ? s : "").slice(0, n);

// ---- conversations ----------------------------------------------------------

// Upsert a conversation. With an id, updates it (and bumps updated_at); without,
// inserts a new one. Returns { id, updated_at } or null if there's no database.
export async function saveConversation({ id = null, title, mode, messages, starred } = {}) {
  const sql = db();
  if (!sql) return null;
  await ensureStudioSchema();
  const t = clampText(title || "untitled", 200);
  const m = mode === "teach" ? "teach" : "build";
  const json = JSON.stringify(Array.isArray(messages) ? messages : []);
  const star = starred === true;
  if (id) {
    const rows = await sql`
      UPDATE conversations
         SET title = ${t}, mode = ${m}, messages = ${json}::jsonb,
             starred = ${star}, updated_at = now()
       WHERE id = ${id}
      RETURNING id, updated_at`;
    if (rows[0]) return rows[0];
  }
  const rows = await sql`
    INSERT INTO conversations (title, mode, messages, starred)
    VALUES (${t}, ${m}, ${json}::jsonb, ${star})
    RETURNING id, updated_at`;
  return rows[0] ?? null;
}

export async function listConversations({ limit = 30 } = {}) {
  const sql = db();
  if (!sql) return [];
  await ensureStudioSchema();
  const cap = Math.min(Math.max(parseInt(limit, 10) || 30, 1), 100);
  return await sql`
    SELECT id, created_at, updated_at, title, mode, starred,
           jsonb_array_length(messages) AS turns
    FROM conversations
    ORDER BY updated_at DESC LIMIT ${cap}`;
}

export async function getConversation(id) {
  const sql = db();
  if (!sql || !id) return null;
  await ensureStudioSchema();
  const rows = await sql`
    SELECT id, created_at, updated_at, title, mode, starred, messages
    FROM conversations WHERE id = ${id}`;
  return rows[0] ?? null;
}

// ---- artifacts (the keep-worthy unit) --------------------------------------

export async function saveArtifact({ title, kind, tier, body, sourceConversationId = null } = {}) {
  const sql = db();
  if (!sql) return null;
  await ensureStudioSchema();
  const b = clampText(body, 12000);
  if (!b.trim()) return null;
  const k = KIND.has(kind) ? kind : "argument";
  const t = TIER.has(tier) ? tier : "exploratory";
  const ttl = clampText(title || "untitled", 200);
  const rows = await sql`
    INSERT INTO artifacts (title, kind, tier, body, source_conversation_id)
    VALUES (${ttl}, ${k}, ${t}, ${b}, ${sourceConversationId})
    RETURNING id, created_at`;
  return rows[0] ?? null;
}

export async function listArtifacts({ limit = 50 } = {}) {
  const sql = db();
  if (!sql) return [];
  await ensureStudioSchema();
  const cap = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
  return await sql`
    SELECT id, created_at, title, kind, tier, body, source_conversation_id, status
    FROM artifacts
    ORDER BY created_at DESC LIMIT ${cap}`;
}
