// Corpus retrieval — the grounding the dramaturg was missing.
//
// Keyword scoring over the prebuilt index (lib/corpus-index.json): no embeddings,
// no extra API call, deterministic and free. For a query like "the theory of
// levity" it returns the passages that actually discuss it, so the dramaturg can
// answer from the real text instead of a hand-written summary.
//
// Static JSON import so Vercel's file tracer bundles the index into the function.

import INDEX from "./corpus-index.json" with { type: "json" };

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
// [{ title, heading, file, text, score }], highest first. Empty if nothing scores.
export function retrieve(query, { k = 5, perChunkChars = 1500 } = {}) {
  const qterms = terms(query);
  if (!qterms.length) return [];
  const qset = new Set(qterms);
  const scored = [];
  for (const c of INDEX) {
    const s = chunkScore(c, qset, qterms.length);
    if (s > 0) scored.push({ c, s });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, k).map(({ c, s }) => ({
    title: c.title,
    heading: c.heading,
    file: c.file,
    text: c.text.length > perChunkChars ? c.text.slice(0, perChunkChars).trimEnd() + "…" : c.text,
    score: Math.round(s * 100) / 100,
  }));
}

// Render retrieved passages into a grounding block appended to the system prompt.
// Returns { block, sources } — block is "" when nothing relevant was found.
export function groundingBlock(query, opts) {
  const hits = retrieve(query, opts);
  if (!hits.length) return { block: "", sources: [] };
  const sources = [...new Set(hits.map((h) => h.title))];
  const passages = hits
    .map((h, i) => `[${i + 1}] From "${h.title}"${h.heading && h.heading !== h.title ? ` — ${h.heading}` : ""}:\n${h.text}`)
    .join("\n\n");
  const block = `

RELEVANT CORPUS PASSAGES (retrieved for this turn — this is the actual text of the research, not a summary). Ground your answer in these: quote and cite by title where you use them. If they genuinely do not cover what was asked, say so plainly and tier your answer — do not invent corpus content.

${passages}`;
  return { block, sources };
}
