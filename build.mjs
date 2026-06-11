// Build the static site for Narrative Intelligence.
// Reads the corpus (markdown) + the book (HTML/PDF) and emits a styled site to dist/.
import { marked } from "marked";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const DIST = path.join(ROOT, "dist");

marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });

// ---------- helpers ----------
const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);
const slug = (name) =>
  name
    .replace(/\.md$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

function titleOf(md, fallback) {
  const m = md.match(/^\s*#\s+(.+?)\s*$/m);
  if (m) return m[1].replace(/[*_`]/g, "").trim();
  return fallback
    .replace(/\.md$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstProse(md) {
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;
    if (l.startsWith("#")) continue;
    if (l.startsWith(">")) continue;
    if (l.startsWith("|") || l.startsWith("-") || l.startsWith("*")) continue;
    if (l.startsWith("```") || l.startsWith("![")) continue;
    const clean = l.replace(/[*_`#>]/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1");
    if (clean.length > 40) return clean.slice(0, 220);
  }
  return "";
}

function page({ title, body, cls = "", crumb = true }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Narrative Intelligence</title>
<meta name="description" content="Narrative Intelligence — a research corpus and book by Ryann Murphy.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="${cls}">
${crumb ? `<header class="topbar"><a class="home" href="/">Narrative Intelligence</a><nav><a href="/book.html">The Book</a><a href="/method.html">Method</a><a href="/#corpus">The Corpus</a></nav></header>` : ""}
<main>
${body}
</main>
<footer>
<p>A research corpus and book by Ryann Murphy. Text released under
<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
</footer>
</body>
</html>`;
}

function essayPage(title, md) {
  const html = marked.parse(md);
  return page({
    title,
    cls: "reading",
    body: `<article class="essay"><a class="back" href="/#corpus">← The Corpus</a>\n${html}\n<a class="back foot" href="/#corpus">← Back to the corpus</a></article>`,
  });
}

// ---------- clean dist ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.mkdirSync(path.join(DIST, "essays"), { recursive: true });

// ---------- gather corpus ----------
const collect = (dir) =>
  exists(path.join(ROOT, dir))
    ? fs
        .readdirSync(path.join(ROOT, dir))
        .filter((f) => f.toLowerCase().endsWith(".md"))
        .map((f) => ({ dir, file: f }))
    : [];

const corpus = [...collect("research"), ...collect("website")];

// curated ordering: pamphlets and anchors first, then the rest
const FEATURED = [
  "legibilism.md",
  "attentionism.md",
  "latentology.md",
  "The CRD Audit Confidence-Reality Divergence as Narrative Intelligence.md",
  "the_framework.md",
  "the_landauer_bridge.md",
];
const rank = (f) => {
  const i = FEATURED.indexOf(f);
  return i === -1 ? 999 : i;
};
corpus.sort((a, b) => rank(a.file) - rank(b.file) || a.file.localeCompare(b.file));

const entries = [];
for (const { dir, file } of corpus) {
  const md = read(path.join(ROOT, dir, file));
  const title = titleOf(md, file);
  const s = slug(file);
  const dek = firstProse(md);
  fs.writeFileSync(path.join(DIST, "essays", `${s}.html`), essayPage(title, md));
  entries.push({ title, slug: s, dek, featured: rank(file) !== 999, dir });
}

// ---------- method + provenance pages ----------
for (const f of ["METHOD.md", "PROVENANCE.md"]) {
  if (exists(path.join(ROOT, f))) {
    const md = read(path.join(ROOT, f));
    const t = titleOf(md, f);
    fs.writeFileSync(
      path.join(DIST, `${f.replace(/\.md$/i, "").toLowerCase()}.html`),
      essayPage(t, md)
    );
  }
}

// ---------- the book ----------
let bookHref = null;
if (exists(path.join(ROOT, "book", "narrative-intelligence.html"))) {
  fs.copyFileSync(
    path.join(ROOT, "book", "narrative-intelligence.html"),
    path.join(DIST, "book.html")
  );
  bookHref = "/book.html";
}
// book PDF (best available)
fs.mkdirSync(path.join(DIST, "pdf"), { recursive: true });
let bookPdf = null;
for (const cand of [
  "Narrative_Intelligence_interior_fixed.pdf",
  "Narrative_Intelligence.pdf",
  "Narrative_Intelligence-1.pdf",
]) {
  const p = path.join(ROOT, "book", "pdf", cand);
  if (exists(p)) {
    fs.copyFileSync(p, path.join(DIST, "pdf", "Narrative_Intelligence.pdf"));
    bookPdf = "/pdf/Narrative_Intelligence.pdf";
    break;
  }
}

// ---------- index ----------
const intro = (() => {
  const md = read(path.join(ROOT, "README.md"));
  const m = md.match(/A research corpus[^]*?Reading that gap is the whole project\./);
  return m ? m[0].replace(/\n/g, " ").replace(/\s+/g, " ") : "";
})();

const featuredCards = entries
  .filter((e) => e.featured)
  .map(
    (e) =>
      `<a class="card" href="/essays/${e.slug}.html"><h3>${e.title}</h3>${
        e.dek ? `<p>${e.dek}…</p>` : ""
      }</a>`
  )
  .join("\n");

const restList = entries
  .filter((e) => !e.featured)
  .map((e) => `<li><a href="/essays/${e.slug}.html">${e.title}</a></li>`)
  .join("\n");

const index = page({
  title: "A research corpus and book",
  crumb: false,
  cls: "home",
  body: `
<section class="hero">
  <a class="home masthead" href="/">Narrative Intelligence</a>
  <p class="standfirst">A research corpus and book by Ryann Murphy — the study of
  how systems read the world into legible categories, what they cannot see, and
  who pays for what stays invisible.</p>
  <blockquote class="epigraph">Every system that survives learns how to read.</blockquote>
  <nav class="herolinks">
    ${bookHref ? `<a class="primary" href="${bookHref}">Read the book</a>` : ""}
    <a href="#corpus">The corpus</a>
    <a href="/method.html">The method</a>
  </nav>
</section>

<section class="intro">
  <p>${intro}</p>
  <p>It is published openly so that anyone can read it, argue with it, and build on it.</p>
</section>

<section class="book">
  <div class="rule"><span>The Book</span></div>
  <div class="bookcard">
    <h2>Narrative Intelligence</h2>
    <p>The full book, multi-chapter — performance training and software read as the
    same problem: the gap between what a system claims and what it structurally does.</p>
    <p class="actions">
      ${bookHref ? `<a class="primary" href="${bookHref}">Open the reading edition</a>` : ""}
      ${bookPdf ? `<a href="${bookPdf}">Download PDF</a>` : ""}
    </p>
  </div>
</section>

<section id="corpus" class="corpus">
  <div class="rule"><span>The Corpus</span></div>
  <p class="tiernote">Every essay carries its tier — <strong>established</strong>,
  <strong>exploratory</strong>, or <strong>speculative</strong>, kept rigorously
  apart. The discipline is in <a href="/method.html">the method</a>.</p>
  <div class="cards">
    ${featuredCards}
  </div>
  <div class="rule sub"><span>More from the corpus</span></div>
  <ul class="more">
    ${restList}
  </ul>
</section>
`,
});

fs.writeFileSync(path.join(DIST, "index.html"), index);

// ---------- static assets ----------
fs.copyFileSync(path.join(ROOT, "styles.css"), path.join(DIST, "styles.css"));

console.log(
  `Built dist/ — ${entries.length} essays, book=${!!bookHref}, pdf=${!!bookPdf}`
);
