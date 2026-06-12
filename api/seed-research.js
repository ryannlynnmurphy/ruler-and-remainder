// Seed the fixed research corpus (28 essays + 3 books) INTO the living corpus,
// so the research AI literally "has all my research" — searchable semantically
// alongside anything the user adds. Reconstructs each document from the bundled
// keyword index, stores it as a first-class corpus item (authorship: human,
// source: research:<file>), text-only — the paced /api/embed-backfill embeds the
// chunks afterward (the embedding key is rate-limited, so embedding is paced).
//
// Idempotent + resumable: each call seeds up to `limit` not-yet-seeded docs and
// returns { seeded, total, remaining }. Drive it until remaining is 0.
//
// GET ?limit=2

import INDEX from "../lib/corpus-index.json" with { type: "json" };
import { saveCorpusItem, seededResearchSources } from "../lib/db.js";

export const maxDuration = 60;

// group the index's chunks back into whole documents, preserving order
function researchDocs() {
  const map = new Map();
  for (const c of INDEX) {
    if (!map.has(c.file)) map.set(c.file, { file: c.file, title: c.title, kind: c.kind === "book" ? "book" : "essay", parts: [] });
    map.get(c.file).parts.push(c.text);
  }
  return [...map.values()].map((d) => ({ file: d.file, title: d.title, kind: d.kind, body: d.parts.join("\n\n") }));
}

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const all = researchDocs();
    const seeded = new Set(await seededResearchSources());
    const todo = all.filter((d) => !seeded.has("research:" + d.file));
    const limit = Math.min(Math.max(parseInt(req.query?.limit, 10) || 2, 1), 4);
    const done = [];
    for (const d of todo.slice(0, limit)) {
      const r = await saveCorpusItem({
        title: d.title, kind: d.kind, authorship: "human", status: "source",
        source: "research:" + d.file, body: d.body, skipEmbed: true,
      });
      if (r) done.push(d.title);
    }
    res.status(200).json({ seeded: done, total: all.length, remaining: todo.length - done.length });
  } catch (err) {
    console.error("seed-research failed:", err.message || err);
    res.status(502).json({ error: "seed failed. try again." });
  }
}
