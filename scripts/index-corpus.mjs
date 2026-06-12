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
const SRC = path.join(ROOT, "research");
const OUT = path.join(ROOT, "lib", "corpus-index.json");

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

const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).sort();
const chunks = [];
let id = 0;

for (const f of files) {
  const raw = fs.readFileSync(path.join(SRC, f), "utf8");
  const title = titleOf(raw, f.replace(/\.md$/, "").replace(/[_-]+/g, " "));
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
      chunks.push({ id: id++, file: f, title, heading: sec.heading || title, text: piece });
    }
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(chunks));
const bytes = fs.statSync(OUT).size;
console.log(`Indexed ${files.length} essays → ${chunks.length} chunks (${(bytes / 1024).toFixed(0)} KB) → lib/corpus-index.json`);
