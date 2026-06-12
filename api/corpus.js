// The Reading Machine's corpus endpoint — the living research archive.
//
// GET                → list corpus items (cards: title/kind/summary/tags/claims)
// GET ?id=<uuid>     → one full item (with body)
// GET ?search=<q>    → keyword retrieval over corpus chunks (for grounding)
// POST               → ingest a document {title, text, kind, authorship, status,
//                      project, source}. Stores it, chunks it, and runs the
//                      analysis card (summary/tags/claims) before returning.
//
// Provenance is explicit and never silent: authorship (human|ai|co) is required
// honesty — AI-generated work is first-class but marked. Best-effort + rate-
// limited, same posture as the rest of the backend.

import {
  saveCorpusItem, listCorpusItems, getCorpusItem, searchCorpusChunks,
  vectorSearchChunks, backfillEmbeddings, seededResearchSources, bumpRateLimit,
} from "../lib/db.js";
import { analyzeDocument } from "../lib/analyze.js";
import { embed } from "../lib/embed.js";
import INDEX from "../lib/corpus-index.json" with { type: "json" };

// research docs reconstructed from the bundled index (for the seed action)
function researchDocs() {
  const map = new Map();
  for (const c of INDEX) {
    if (!map.has(c.file)) map.set(c.file, { file: c.file, title: c.title, kind: c.kind === "book" ? "book" : "essay", parts: [] });
    map.get(c.file).parts.push(c.text);
  }
  return [...map.values()].map((d) => ({ file: d.file, title: d.title, kind: d.kind, body: d.parts.join("\n\n") }));
}

// Semantic-first retrieval: embed the query and do cosine search over pgvector;
// fall back to keyword when embeddings are unavailable (no key) or nothing
// matched. Returns { results, mode } so the UI can show which ran.
async function retrieve(query) {
  try {
    const qv = await embed(query, "query");
    if (qv && qv[0]) {
      const v = await vectorSearchChunks(qv[0], { k: 6 });
      if (v && v.length) return { results: v, mode: "semantic" };
    }
  } catch { /* fall through to keyword */ }
  return { results: await searchCorpusChunks(query, { k: 6 }), mode: "keyword" };
}

export const maxDuration = 60;

const PER_IP_PER_HOUR = 120;
const MAX_CHARS = 200000;

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}
const hourBucket = (d) => d.toISOString().slice(0, 13);

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");

  if (req.method === "GET") {
    const { id, search, backfill, seed } = req.query || {};
    try {
      if (backfill) {
        res.status(200).json(await backfillEmbeddings({ limit: req.query?.limit }));
      } else if (seed) {
        // resumable research → corpus seed (text-only; backfill embeds afterward)
        const all = researchDocs();
        const seeded = new Set(await seededResearchSources());
        const todo = all.filter((d) => !seeded.has("research:" + d.file));
        const lim = Math.min(Math.max(parseInt(req.query?.limit, 10) || 2, 1), 4);
        const done = [];
        for (const d of todo.slice(0, lim)) {
          const r = await saveCorpusItem({ title: d.title, kind: d.kind, authorship: "human", status: "source", source: "research:" + d.file, body: d.body, skipEmbed: true });
          if (r) done.push(d.title);
        }
        res.status(200).json({ seeded: done, total: all.length, remaining: todo.length - done.length });
      } else if (id) {
        res.status(200).json({ item: (await getCorpusItem(id)) || null });
      } else if (search) {
        res.status(200).json(await retrieve(search));
      } else {
        res.status(200).json({ items: await listCorpusItems({ limit: req.query?.limit, project: req.query?.project || null }) });
      }
    } catch {
      res.status(200).json(id ? { item: null } : search ? { results: [] } : { items: [] });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const ip = clientIp(req);
      const n = await bumpRateLimit(`reading:corpus:${ip}:${hourBucket(new Date())}`);
      if (n !== null && n > PER_IP_PER_HOUR) {
        res.status(429).json({ error: "you've added a lot this hour — give it a moment." });
        return;
      }
    } catch { /* proceed */ }

    let body;
    try { body = await readJsonBody(req); }
    catch { res.status(400).json({ error: "couldn't read the request." }); return; }

    const text = typeof body.text === "string" ? body.text.slice(0, MAX_CHARS) : "";
    if (!text.trim()) { res.status(400).json({ error: "a corpus item needs text." }); return; }

    try {
      // the "read" step — analyze before storing so the card lands with the doc
      const analysis = await analyzeDocument(body.title, text);
      const saved = await saveCorpusItem({
        title: body.title,
        kind: body.kind,
        authorship: body.authorship,
        status: body.status,
        project: body.project || null,
        source: body.source || null,
        body: text,
        analysis,
      });
      if (!saved) { res.status(503).json({ error: "the corpus isn't configured yet." }); return; }
      res.status(200).json({ id: saved.id, created_at: saved.created_at, chunks: saved.chunks, analysis });
    } catch (err) {
      console.error("corpus ingest failed:", err.message || err);
      res.status(502).json({ error: "couldn't add that to the corpus. try again in a moment." });
    }
    return;
  }

  res.status(405).json({ error: "method not allowed" });
}
