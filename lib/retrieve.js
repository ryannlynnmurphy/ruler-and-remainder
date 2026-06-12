// Corpus retrieval — the grounding the dramaturg was missing.
//
// Keyword scoring over the prebuilt index (lib/corpus-index.json): no embeddings,
// no extra API call, deterministic and free. For a query like "the theory of
// levity" it returns the passages that actually discuss it, so the dramaturg can
// answer from the real text instead of a hand-written summary.
//
// Static JSON import so Vercel's file tracer bundles the index into the function.

import INDEX from "./corpus-index.json" with { type: "json" };
import { embed } from "./embed.js";

const STOP = new Set(("the a an and or but if then else of to in on at by for with from as is are was were be been being this that these those it its it's i you he she they we who whom whose what which when where why how do does did not no nyes so than too very can will just about into over under more most some any all each our your their his her my me us them out up down off can't cannot don't" ).split(/\s+/));

function terms(s) {
  return (String(s).toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [])
    .map((w) => w.replace(/'s$/, ""))
    .filter((w) => w.length >= 3 && !STOP.has(w));
}

// term frequency for a chunk, with title+heading weighted heavily (a query that
// names an essay's title should surface that essay)
function chunkScore(chunk, qset, qcount) {
  const titleT = terms(chunk.title + " " + chunk.heading);
  const bodyT = terms(chunk.text);
  let score = 0;
  const titleHas = new Set(titleT);
  for (const q of qset) {
    let tf = 0;
    for (const w of bodyT) if (w === q) tf++;
    if (tf) score += 1 + Math.log(tf);          // body match, dampened
    if (titleHas.has(q)) score += 6;            // strong boost for title/heading
  }
  // small bonus for covering more distinct query terms (relevance breadth)
  const covered = [...qset].filter((q) => titleHas.has(q) || bodyT.includes(q)).length;
  score += covered * (qcount > 0 ? 1.2 : 0);
  return score;
}

// Return the top-k most relevant passages for a query, each trimmed to a budget.
const trim = (t, n) => (t.length > n ? t.slice(0, n).trimEnd() + "…" : t);
const shape = (c, score, n) => ({ title: c.title, heading: c.heading, file: c.file, text: trim(c.text, n), score: Math.round(score * 1000) / 1000 });

// Cosine top-k over chunks that carry a build-time embedding (`c.e`). Returns
// null when the index has no embeddings at all — the signal to fall back to
// keyword. Voyage vectors are ~unit-norm; we compute full cosine to be safe.
function cosineTopK(qvec, k, perChunkChars) {
  let qn = 0; for (const x of qvec) qn += x * x; qn = Math.sqrt(qn) || 1;
  const scored = [];
  for (const c of INDEX) {
    const e = c.e;
    if (!e || e.length !== qvec.length) continue;
    let dot = 0, cn = 0;
    for (let i = 0; i < e.length; i++) { dot += qvec[i] * e[i]; cn += e[i] * e[i]; }
    scored.push({ c, s: dot / (qn * (Math.sqrt(cn) || 1)) });
  }
  if (!scored.length) return null; // no embeddings in this index → keyword
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, k).map(({ c, s }) => shape(c, s, perChunkChars));
}

// Keyword scoring fallback (the original path).
function keywordTopK(query, k, perChunkChars) {
  const qterms = terms(query);
  if (!qterms.length) return [];
  const qset = new Set(qterms);
  const scored = [];
  for (const c of INDEX) {
    const s = chunkScore(c, qset, qterms.length);
    if (s > 0) scored.push({ c, s });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, k).map(({ c, s }) => shape(c, s, perChunkChars));
}

// Semantic-first retrieval over the fixed research corpus. Embeds the query and
// does cosine over build-time chunk embeddings; falls back to keyword when
// embeddings or the Voyage key are unavailable. Returns { hits, mode }.
export async function retrieve(query, { k = 5, perChunkChars = 1500 } = {}) {
  if (!String(query || "").trim()) return { hits: [], mode: "keyword" };
  try {
    const qv = await embed(query, "query");
    if (qv && qv[0]) {
      const v = cosineTopK(qv[0], k, perChunkChars);
      if (v && v.length) return { hits: v, mode: "semantic" };
    }
  } catch { /* fall through */ }
  return { hits: keywordTopK(query, k, perChunkChars), mode: "keyword" };
}

// Render retrieved passages into a grounding block appended to the system prompt.
// Returns { block, sources, mode } — block is "" when nothing relevant was found.
export async function groundingBlock(query, opts) {
  const { hits, mode } = await retrieve(query, opts);
  if (!hits.length) return { block: "", sources: [], mode };
  const sources = [...new Set(hits.map((h) => h.title))];
  const passages = hits
    .map((h, i) => `[${i + 1}] From "${h.title}"${h.heading && h.heading !== h.title ? ` — ${h.heading}` : ""}:\n${h.text}`)
    .join("\n\n");
  const block = `

RELEVANT CORPUS PASSAGES (retrieved for this turn — this is the actual text of the research, not a summary). Ground your answer in these: quote and cite by title where you use them. If they genuinely do not cover what was asked, say so plainly and tier your answer — do not invent corpus content.

${passages}`;
  return { block, sources, mode };
}
