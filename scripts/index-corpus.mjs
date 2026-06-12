// Build the corpus retrieval index.
//
// The dramaturg (api/argue) teaches from a hand-written summary of the corpus —
// which means it does not actually know any essay it wasn't told about by hand.
// This generator chunks every research essay into retrievable passages so the
// dramaturg can pull the real text into context per turn and ground its answers.
//
// Output: lib/corpus-index.json — an array of { id, file, title, heading, text }.
// Committed to the repo AND regenerated on every build, so it is always present
// when Vercel bundles the serverless function (a static JSON import is traced in).
//
// Pure Node, no dependencies. Run: node scripts/index-corpus.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const exists = (p) => fs.existsSync(p);
const SRC = path.join(ROOT, "research");
const OUT = path.join(ROOT, "lib", "corpus-index.json");

// The three published manuscripts (the canonical sources build.mjs ships) — NOT
// every file in book/, which holds drafts and duplicate variants that would
// pollute retrieval. Keep this list in sync with the BOOKS srcs in build.mjs.
const BOOKS = [
  "book/Narrative_Intelligence_FINAL.md",
  "book/Our_Relationship_Edited.md",
  "book/Radical_Optimism_Complete.md",
];

const MAX_WORDS = 1400; // split sections longer than this into sub-chunks

// strip YAML front-matter, fenced code blocks, and light markdown markup; collapse space
function clean(md) {
  return md
    .replace(/^﻿?\s*---\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n/, "") // front-matter
    .replace(/```[\s\S]*?```/g, " ")                                // code fences
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")                          // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")                        // links → text
    .replace(/[*_>#]+/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const titleOf = (md, fallback) => {
  const m = md.match(/^\s*#\s+(.+?)\s*$/m);
  return m ? m[1].replace(/[*_`]/g, "").trim() : fallback;
};

const wordCount = (s) => (s.match(/\S+/g) || []).length;

// split a long body into ~MAX_WORDS paragraph groups so no chunk is unwieldy
function splitBody(body) {
  if (wordCount(body) <= MAX_WORDS) return [body];
  const paras = body.split(/\n{2,}/);
  const out = [];
  let buf = "", n = 0;
  for (const p of paras) {
    const w = wordCount(p);
    if (n + w > MAX_WORDS && buf) { out.push(buf.trim()); buf = ""; n = 0; }
    buf += (buf ? "\n\n" : "") + p; n += w;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

// targets: every research essay, then the three canonical book manuscripts
const targets = [
  ...fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).sort()
    .map((f) => ({ abs: path.join(SRC, f), file: f, kind: "essay" })),
  ...BOOKS.filter((b) => exists(path.join(ROOT, b)))
    .map((b) => ({ abs: path.join(ROOT, b), file: b, kind: "book" })),
];
const chunks = [];
let id = 0;

for (const t of targets) {
  const f = t.file;
  const raw = fs.readFileSync(t.abs, "utf8");
  const title = titleOf(raw, path.basename(f).replace(/\.md$/, "").replace(/[_-]+/g, " "));
  const md = clean(raw);

  // split into sections on H2/H3 headings; everything before the first heading
  // is the intro section under the title itself
  const lines = md.split("\n");
  const sections = [];
  let heading = "", buf = [];
  const flush = () => { const text = buf.join("\n").trim(); if (text) sections.push({ heading, text }); buf = []; };
  for (const line of lines) {
    const h = line.match(/^(?:Chapter\s+\d+:|Part\s+[IVX]+:)?\s*(.+)$/);
    // a heading line in the *cleaned* text lost its #, so detect via the raw structure instead:
    buf.push(line);
  }
  // re-derive headings from the RAW markdown (cleaned text dropped the # markers)
  const rawNoFront = raw.replace(/^﻿?\s*---\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n/, "").replace(/```[\s\S]*?```/g, " ");
  sections.length = 0; heading = ""; buf = [];
  for (const line of rawNoFront.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (m) { flush(); heading = m[2].replace(/[*_`]/g, "").trim(); }
    else buf.push(line);
  }
  flush();

  for (const sec of sections) {
    const cleanedText = clean(sec.text);
    if (wordCount(cleanedText) < 12) continue; // skip stubs
    for (const piece of splitBody(cleanedText)) {
      chunks.push({ id: id++, file: f, kind: t.kind, title, heading: sec.heading || title, text: piece });
    }
  }
}

// Embed every chunk at build time so the dramaturg can do real semantic search
// over the whole research corpus (not just keyword). Needs VOYAGE_API_KEY in the
// build env (Vercel exposes production env vars at build). Without it, chunks
// ship embedding-less and retrieval falls back to keyword — the build still
// succeeds. Floats are rounded to keep the bundled index reasonable.
const { embed } = await import(path.join(ROOT, "lib", "embed.js"));
if (process.env.VOYAGE_API_KEY) {
  const BATCH = 64;
  let embedded = 0;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const group = chunks.slice(i, i + BATCH);
    let vecs = null;
    try { vecs = await embed(group.map((c) => c.text), "document"); } catch { /* keep going */ }
    if (vecs) group.forEach((c, j) => { if (vecs[j]) { c.e = vecs[j].map((x) => Math.round(x * 1e6) / 1e6); embedded++; } });
    else console.warn(`  embed batch @${i} failed — those chunks stay keyword-only`);
  }
  console.log(`Embedded ${embedded}/${chunks.length} chunks via Voyage (semantic search enabled)`);
} else {
  console.log("No VOYAGE_API_KEY at build — corpus index is keyword-only (set it on Vercel for semantic search)");
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(chunks));
const bytes = fs.statSync(OUT).size;
const essays = targets.filter((t) => t.kind === "essay").length;
const books = targets.filter((t) => t.kind === "book").length;
console.log(`Indexed ${essays} essays + ${books} books → ${chunks.length} chunks (${(bytes / 1024).toFixed(0)} KB) → lib/corpus-index.json`);
