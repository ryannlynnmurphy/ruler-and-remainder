// Neon (serverless Postgres) — the backend's only stateful dependency.
// Holds two things, per the design: the public ledger of reality-checks, and
// the infrastructure tables (per-IP rate-limit counters + a news-feed cache).
//
// Everything here is best-effort: if DATABASE_URL is unset or the database is
// unreachable, callers fall back gracefully rather than taking the instrument
// down. The reality check still runs; it just isn't logged or rate-limited.

import { neon } from "@neondatabase/serverless";
import { embed, EMBED_DIM, vecLiteral } from "./embed.js";

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

// ---- the Reading Machine: a living research corpus -------------------------
// The recursive loop: upload → read → generate → save → analyze → reread. A
// corpus item is a first-class research object (uploaded source, written note,
// or AI-generated output), each carrying its own analysis (summary, tags,
// claims). reading_chunks back keyword retrieval for grounding. SEPARATE schema
// bootstrap, same defensive posture as the Studio tables. Provenance is explicit:
// authorship ∈ human | ai | co, status ∈ source | draft | output | reflection.

let _readingReady = null;
export function ensureReadingSchema() {
  if (_readingReady) return _readingReady;
  const sql = db();
  if (!sql) return Promise.resolve(false);
  _readingReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS corpus_items (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        title       TEXT        NOT NULL DEFAULT 'untitled',
        kind        TEXT        NOT NULL DEFAULT 'note',
        authorship  TEXT        NOT NULL DEFAULT 'human',
        status      TEXT        NOT NULL DEFAULT 'source',
        project     TEXT,
        source      TEXT,
        body        TEXT        NOT NULL,
        summary     TEXT,
        tags        JSONB       NOT NULL DEFAULT '[]'::jsonb,
        claims      JSONB       NOT NULL DEFAULT '[]'::jsonb
      )`;
    await sql`
      CREATE INDEX IF NOT EXISTS corpus_items_updated_idx
        ON corpus_items (updated_at DESC)`;
    await sql`
      CREATE TABLE IF NOT EXISTS reading_chunks (
        id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        item_id  UUID NOT NULL REFERENCES corpus_items(id) ON DELETE CASCADE,
        idx      INTEGER NOT NULL DEFAULT 0,
        heading  TEXT,
        text     TEXT NOT NULL
      )`;
    await sql`
      CREATE INDEX IF NOT EXISTS reading_chunks_item_idx
        ON reading_chunks (item_id)`;
    return true;
  })().catch((e) => {
    _readingReady = null;
    throw e;
  });
  return _readingReady;
}

const ITEM_KIND = new Set(["note", "essay", "book", "draft", "transcript", "report", "prompt", "output", "reflection", "source"]);
const AUTHORSHIP = new Set(["human", "ai", "co"]);
const STATUS = new Set(["source", "draft", "output", "reflection", "final"]);

// Insert a corpus item plus its chunks, in one place. analysis = {summary, tags, claims}.
export async function saveCorpusItem({ title, kind, authorship, status, project, source, body, analysis = {}, skipEmbed = false } = {}) {
  const sql = db();
  if (!sql) return null;
  await ensureReadingSchema();
  const text = clampText(body, 200000);
  if (!text.trim()) return null;
  const k = ITEM_KIND.has(kind) ? kind : "note";
  const a = AUTHORSHIP.has(authorship) ? authorship : "human";
  const st = STATUS.has(status) ? status : (a === "ai" ? "output" : "source");
  const ttl = clampText(title || "untitled", 200);
  const summary = analysis.summary ? clampText(analysis.summary, 4000) : null;
  const tags = JSON.stringify(Array.isArray(analysis.tags) ? analysis.tags.slice(0, 24) : []);
  const claims = JSON.stringify(Array.isArray(analysis.claims) ? analysis.claims.slice(0, 24) : []);
  const rows = await sql`
    INSERT INTO corpus_items (title, kind, authorship, status, project, source, body, summary, tags, claims)
    VALUES (${ttl}, ${k}, ${a}, ${st}, ${project ?? null}, ${source ?? null}, ${text},
            ${summary}, ${tags}::jsonb, ${claims}::jsonb)
    RETURNING id, created_at`;
  const item = rows[0];
  if (!item) return null;
  // chunk and store for retrieval; embed each chunk if Voyage + pgvector are
  // available (one batched call), else store text-only and rely on keyword.
  const chunks = chunkText(text);
  let vectors = null;
  try {
    if (!skipEmbed && await ensureVectorColumn()) vectors = await embed(chunks.map((c) => c.text), "document");
    else if (skipEmbed) await ensureVectorColumn(); // ensure the column exists; embed later via backfill
  } catch { /* embedding is best-effort */ }
  for (let i = 0; i < chunks.length; i++) {
    const vec = vectors && vectors[i] ? vecLiteral(vectors[i]) : null;
    if (vec) {
      await sql`
        INSERT INTO reading_chunks (item_id, idx, heading, text, embedding)
        VALUES (${item.id}, ${i}, ${chunks[i].heading ?? null}, ${chunks[i].text}, ${vec}::vector)`;
    } else {
      await sql`
        INSERT INTO reading_chunks (item_id, idx, heading, text)
        VALUES (${item.id}, ${i}, ${chunks[i].heading ?? null}, ${chunks[i].text})`;
    }
  }
  return { id: item.id, created_at: item.created_at, chunks: chunks.length, embedded: !!vectors };
}

// Which research documents have already been seeded into the corpus (source =
// 'research:<file>'). Used to make the seed idempotent + resumable.
export async function seededResearchSources() {
  const sql = db();
  if (!sql) return [];
  await ensureReadingSchema();
  const rows = await sql`SELECT DISTINCT source FROM corpus_items WHERE source LIKE 'research:%'`;
  return rows.map((r) => r.source);
}

export async function listCorpusItems({ limit = 100, project = null } = {}) {
  const sql = db();
  if (!sql) return [];
  await ensureReadingSchema();
  const cap = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 200);
  return project
    ? await sql`
        SELECT id, created_at, updated_at, title, kind, authorship, status, project, summary, tags, claims
        FROM corpus_items WHERE project = ${project}
        ORDER BY updated_at DESC LIMIT ${cap}`
    : await sql`
        SELECT id, created_at, updated_at, title, kind, authorship, status, project, summary, tags, claims
        FROM corpus_items
        ORDER BY updated_at DESC LIMIT ${cap}`;
}

export async function getCorpusItem(id) {
  const sql = db();
  if (!sql || !id) return null;
  await ensureReadingSchema();
  const rows = await sql`
    SELECT id, created_at, updated_at, title, kind, authorship, status, project, source, body, summary, tags, claims
    FROM corpus_items WHERE id = ${id}`;
  return rows[0] ?? null;
}

// Keyword retrieval over the user's uploaded corpus (distinct from the fixed
// research index in lib/retrieve.js). Returns scored chunks with their item.
export async function searchCorpusChunks(query, { k = 6 } = {}) {
  const sql = db();
  if (!sql) return [];
  await ensureReadingSchema();
  const terms = (String(query).toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [])
    .map((w) => w.replace(/'s$/, "")).filter((w) => w.length >= 3);
  if (!terms.length) return [];
  const rows = await sql`
    SELECT c.id, c.item_id, c.heading, c.text, i.title, i.kind, i.authorship
    FROM reading_chunks c JOIN corpus_items i ON i.id = c.item_id`;
  const scored = [];
  for (const r of rows) {
    const hay = (r.title + " " + (r.heading || "") + " " + r.text).toLowerCase();
    const titleHay = (r.title + " " + (r.heading || "")).toLowerCase();
    let s = 0;
    for (const t of terms) {
      const inBody = hay.split(t).length - 1;
      if (inBody) s += 1 + Math.log(inBody);
      if (titleHay.includes(t)) s += 4;
    }
    if (s > 0) scored.push({ ...r, score: Math.round(s * 100) / 100 });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

// ---- pgvector: real semantic search ---------------------------------------
// SEPARATE, best-effort bootstrap from ensureReadingSchema. If the vector
// extension/column can't be created (no pgvector, no permission), this returns
// false and every caller falls back to keyword retrieval — the corpus, reads,
// and ingestion all keep working. Idempotent; memoized after first success.

let _vectorReady = null;
export function ensureVectorColumn() {
  if (_vectorReady) return _vectorReady;
  const sql = db();
  if (!sql) return Promise.resolve(false);
  _vectorReady = (async () => {
    await ensureReadingSchema();
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
    // literal dimension (must equal EMBED_DIM=1024) — tagged templates can't
    // parameterize a column type, and the Neon driver has no .unsafe()
    await sql`ALTER TABLE reading_chunks ADD COLUMN IF NOT EXISTS embedding vector(1024)`;
    // the index is an optimization; tolerate an older pgvector without hnsw
    try {
      await sql`
        CREATE INDEX IF NOT EXISTS reading_chunks_embedding_idx
          ON reading_chunks USING hnsw (embedding vector_cosine_ops)`;
    } catch (e) { console.error("hnsw index skipped:", e.message || e); }
    return true;
  })().catch((e) => {
    _vectorReady = null; // retry next time
    console.error("pgvector unavailable (falling back to keyword):", e.message || e);
    return false;
  });
  return _vectorReady;
}

// Cosine-distance search over embedded chunks. Returns scored chunks (score =
// cosine similarity, 1=identical), or null to signal "vectors unavailable —
// fall back to keyword". An empty array means vectors are available but nothing
// matched (or nothing's embedded yet) — callers also fall back in that case.
export async function vectorSearchChunks(queryVec, { k = 6 } = {}) {
  const sql = db();
  if (!sql || !Array.isArray(queryVec) || !queryVec.length) return null;
  if (!(await ensureVectorColumn())) return null;
  const lit = vecLiteral(queryVec);
  const rows = await sql`
    SELECT c.id, c.item_id, c.heading, c.text, i.title, i.kind, i.authorship,
           1 - (c.embedding <=> ${lit}::vector) AS score
    FROM reading_chunks c JOIN corpus_items i ON i.id = c.item_id
    WHERE c.embedding IS NOT NULL
    ORDER BY c.embedding <=> ${lit}::vector
    LIMIT ${Math.min(Math.max(parseInt(k, 10) || 6, 1), 20)}`;
  return rows.map((r) => ({ ...r, score: Math.round(Number(r.score) * 1000) / 1000 }));
}

// Semantic-first retrieval over the whole user corpus (which now includes all
// the seeded research): embed the query, cosine over pgvector, fall back to
// keyword. Shared by the corpus search and the Lens. Returns { results, mode }.
export async function corpusRetrieve(query, { k = 6 } = {}) {
  try {
    const qv = await embed(query, "query");
    if (qv && qv[0]) {
      const v = await vectorSearchChunks(qv[0], { k });
      if (v && v.length) return { results: v, mode: "semantic" };
    }
  } catch { /* fall through */ }
  return { results: await searchCorpusChunks(query, { k }), mode: "keyword" };
}

// Embed chunks that don't yet have a vector (e.g. ingested before the key was
// set). Bounded per call; report schema/key status so a caller can drive it to
// completion and a smoke test can confirm pgvector bootstrapped on real Neon.
export async function backfillEmbeddings({ limit = 64 } = {}) {
  const sql = db();
  if (!sql) return { schema: false, hasKey: !!process.env.VOYAGE_API_KEY, embedded: 0, remaining: null };
  const schema = await ensureVectorColumn();
  if (!schema) return { schema: false, hasKey: !!process.env.VOYAGE_API_KEY, embedded: 0, remaining: null };
  const remCount = async () => (await sql`SELECT count(*)::int AS c FROM reading_chunks WHERE embedding IS NULL`)[0]?.c ?? 0;
  if (!process.env.VOYAGE_API_KEY) return { schema: true, hasKey: false, embedded: 0, remaining: await remCount() };
  const cap = Math.min(Math.max(parseInt(limit, 10) || 64, 1), 128);
  const rows = await sql`SELECT id, text FROM reading_chunks WHERE embedding IS NULL LIMIT ${cap}`;
  if (!rows.length) return { schema: true, hasKey: true, embedded: 0, remaining: 0 };
  const vecs = await embed(rows.map((r) => r.text), "document");
  if (!vecs) return { schema: true, hasKey: true, embedded: 0, remaining: await remCount(), error: "embed failed" };
  let n = 0;
  for (let i = 0; i < rows.length; i++) {
    if (vecs[i]) { await sql`UPDATE reading_chunks SET embedding = ${vecLiteral(vecs[i])}::vector WHERE id = ${rows[i].id}`; n++; }
  }
  return { schema: true, hasKey: true, embedded: n, remaining: await remCount() };
}

// Lightweight chunker shared by ingestion: split on blank lines into ~220-word
// pieces, carrying the nearest preceding markdown heading.
function chunkText(text) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/);
  const out = [];
  let buf = [], words = 0, heading = null;
  const flush = () => {
    const t = buf.join("\n\n").trim();
    if (t) out.push({ heading, text: t.slice(0, 4000) });
    buf = []; words = 0;
  };
  for (const b of blocks) {
    const h = b.match(/^#{1,4}\s+(.+)$/);
    if (h) { flush(); heading = h[1].replace(/[*_`#]/g, "").trim().slice(0, 160); continue; }
    const w = (b.match(/\S+/g) || []).length;
    if (words + w > 220 && buf.length) flush();
    buf.push(b); words += w;
  }
  flush();
  return out.length ? out : [{ heading: null, text: text.slice(0, 4000) }];
}
