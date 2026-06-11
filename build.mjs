// Build "The Ruler and the Remainder" — an academic journal of interactive media arts.
// Renders the corpus (markdown) + the books into a single art-directed static site.
import { marked } from "marked";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const DIST = path.join(ROOT, "dist");
const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);

marked.setOptions({ gfm: true, breaks: false });

const SITE = "The Ruler and the Remainder";

// ---------- helpers ----------------------------------------------------------
const slug = (s) =>
  s.replace(/\.md$/i, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();

function titleOf(md, fallback) {
  const m = md.match(/^\s*#\s+(.+?)\s*$/m);
  if (m) return m[1].replace(/[*_`]/g, "").trim();
  return fallback.replace(/\.md$/i, "").replace(/[_-]+/g, " ").trim();
}

function firstProse(md) {
  for (const raw of md.split("\n")) {
    const l = raw.trim();
    if (!l || l.startsWith("#") || l.startsWith(">") || l.startsWith("|") ||
        l.startsWith("-") || l.startsWith("*") || l.startsWith("```") ||
        l.startsWith("![") || l.startsWith("***") || l.startsWith("---")) continue;
    const clean = l.replace(/[*_`#>]/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1");
    if (clean.length > 40) return clean.slice(0, 200);
  }
  return "";
}

// footnote apparatus: pull [^n] refs + [^n]: defs into a journal footnotes block
function footnotes(md) {
  const defs = {};
  const body = md.replace(/^\[\^([^\]]+)\]:\s*(.+)$/gm, (_, k, v) => { defs[k] = v.trim(); return ""; });
  const used = [];
  const withRefs = body.replace(/\[\^([^\]]+)\]/g, (_, k) => {
    if (defs[k]) {
      if (!used.includes(k)) used.push(k);
      const n = used.indexOf(k) + 1;
      return `<sup class="fn"><a id="r${k}" href="#fn${k}">${n}</a></sup>`;
    }
    // ref with no [^k]: definition (e.g. a separate ## References list) — keep the
    // numeral, no dead anchor.
    return `<sup class="fn">${k}</sup>`;
  });
  let block = "";
  if (used.length && used.some((k) => defs[k])) {
    block = `\n<div class="footnotes"><h4>Apparatus</h4><ol>` +
      used.map((k) => `<li id="fn${k}">${defs[k] ? marked.parseInline(defs[k]) : ""} <a class="mono" href="#r${k}">↩</a></li>`).join("") +
      `</ol></div>`;
  }
  return { withRefs, block };
}

const NAV = `<a href="/#books">Books</a><a href="/#corpus">Corpus</a><a href="/database.html">Index</a><a href="/audit.html">Instrument</a><a href="/method.html">Method</a>`;

function shell({ title, body, bodyClass = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · ${SITE}</title>
<meta name="description" content="${SITE} — an academic journal of interactive media arts. Independent research into how systems read the world into legible categories, and what they leave out. By Ryann Murphy.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="${bodyClass}">
<div id="measure"></div>
<div class="ruler-gutter" aria-hidden="true"></div>
<header class="topbar">
  <a class="home" href="/">The Ruler &amp; the Remainder<small>Independent research · R. Murphy</small></a>
  <nav>${NAV}</nav>
</header>
<main>
${body}
</main>
<footer><div class="colophon">
  <span class="lead">${SITE}</span> — an academic journal of interactive media arts.
  Independent research by Ryann Murphy. The credential is the argument.<br>
  Set in Fraunces, Newsreader, and Space Mono. Text released under
  <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
  Source on <a href="https://github.com/ryannlynnmurphy/narrative-intelligence">GitHub</a>.
</div></footer>
<script>
(function(){
  var m=document.getElementById('measure');
  function prog(){var h=document.documentElement;var s=h.scrollTop||document.body.scrollTop;
    var max=(h.scrollHeight-h.clientHeight)||1;m.style.width=(100*s/max)+'%';}
  document.addEventListener('scroll',prog,{passive:true});prog();
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.08});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  } else { document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');}); }
})();
</script>
</body>
</html>`;
}

function piece({ title, kicker, md, bodyClass = "", backHref = "/#corpus", backLabel = "Index" }) {
  const { withRefs, block } = footnotes(md);
  // strip the leading H1 (we render our own head)
  const noH1 = withRefs.replace(/^\s*#\s+.+?\n/, "");
  const html = marked.parse(noH1);
  return shell({
    title,
    bodyClass,
    body: `<article class="piece ${bodyClass ? "autotheory" : ""}">
  <a class="back" href="${backHref}">← ${backLabel}</a>
  <div class="head reveal">${kicker ? `<div class="kicker">${kicker}</div>` : ""}<h1>${title}</h1>${bodyClass ? `<p class="genre-note">Autotheory — autobiography reasoning as theory and back again.</p>` : ""}</div>
  <div class="prose reveal">${html}${block}</div>
  <div class="foot"><a href="${backHref}">← ${backLabel}</a></div>
</article>`,
  });
}

// ---------- clean ------------------------------------------------------------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, "essays"), { recursive: true });
fs.mkdirSync(path.join(DIST, "books"), { recursive: true });
fs.mkdirSync(path.join(DIST, "pdf"), { recursive: true });

// ---------- BOOKS ------------------------------------------------------------
const BOOKS = [
  {
    slug: "narrative-intelligence",
    title: "Narrative Intelligence",
    kicker: "Book · AI governance",
    src: "book/Narrative_Intelligence_FINAL.md",
    dek: "Architecture is prior to governance. How systems read intent into action — and where the reading outruns what the architecture can guarantee.",
    pdfFrom: ["book/pdf/Narrative_Intelligence_interior_fixed.pdf", "book/pdf/Narrative_Intelligence.pdf"],
    artbook: false,
  },
  {
    slug: "our-relationship",
    title: "Our Relationship",
    kicker: "Autotheory · with Claude",
    src: "book/our_relationship_complete_manuscript.md",
    dek: "Autotheory. A playwright argues with a language model for three months — consciousness, computers, and what happens in the space between. Every word is synthetic data; check the math.",
    artbook: true,
  },
  {
    slug: "radical-optimism",
    title: "Radical Optimism",
    kicker: "Book",
    src: "book/Radical_Optimism_Complete.md",
    dek: "On building as if the good system can win — and what it would take for that to be true rather than hoped.",
    artbook: false,
  },
];

for (const b of BOOKS) {
  if (!exists(path.join(ROOT, b.src))) { b.missing = true; continue; }
  const md = read(path.join(ROOT, b.src));
  fs.writeFileSync(
    path.join(DIST, "books", `${b.slug}.html`),
    piece({ title: b.title, kicker: b.kicker, md, bodyClass: b.artbook ? "artbook" : "", backHref: "/#books", backLabel: "All books" })
  );
  b.href = `/books/${b.slug}.html`;
  if (b.pdfFrom) {
    for (const c of b.pdfFrom) {
      if (exists(path.join(ROOT, c))) { fs.copyFileSync(path.join(ROOT, c), path.join(DIST, "pdf", `${b.slug}.pdf`)); b.pdf = `/pdf/${b.slug}.pdf`; break; }
    }
  }
}

// ---------- CORPUS (research + website) -------------------------------------
const KIND = {
  "legibilism.md": "Pamphlet", "attentionism.md": "Pamphlet", "latentology.md": "Pamphlet",
  "drift-a-dialogue.md": "Dialogue", "Reading_the_Reader_transcript.md": "Dialogue",
  "The CRD Audit Confidence-Reality Divergence as Narrative Intelligence.md": "Method",
  "a-note-on-method-and-distribution.md": "Note",
  "blog-theatre-major.md": "Essay", "cybersecurity-bill-of-rights.md": "Document",
};
const FEATURED = ["legibilism.md", "attentionism.md", "latentology.md"];

const collect = (dir) =>
  exists(path.join(ROOT, dir))
    ? fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.toLowerCase().endsWith(".md")).map((f) => ({ dir, file: f }))
    : [];

const corpus = [...collect("research"), ...collect("website")];
const entries = [];
for (const { dir, file } of corpus) {
  const md = read(path.join(ROOT, dir, file));
  const title = titleOf(md, file);
  const s = slug(file);
  const kind = KIND[file] || "Essay";
  fs.writeFileSync(path.join(DIST, "essays", `${s}.html`), piece({ title, kicker: kind, md }));
  entries.push({ title, slug: s, url: `/essays/${s}.html`, kind, dek: firstProse(md), pamphlet: FEATURED.includes(file) });
}

// method + provenance
const pages = [];
for (const f of ["METHOD.md", "PROVENANCE.md"]) {
  if (!exists(path.join(ROOT, f))) continue;
  const md = read(path.join(ROOT, f));
  const t = titleOf(md, f);
  const s = f.replace(/\.md$/i, "").toLowerCase();
  fs.writeFileSync(path.join(DIST, `${s}.html`), piece({ title: t, kicker: "Apparatus", md, backHref: "/", backLabel: "Cover" }));
  pages.push({ title: t, url: `/${s}.html` });
}

// ---------- DATABASE (searchable index) -------------------------------------
const db = [
  ...BOOKS.filter((b) => b.href).map((b) => ({ title: b.title, url: b.href, kind: "Book", dek: b.dek })),
  ...entries.map((e) => ({ title: e.title, url: e.url, kind: e.kind, dek: e.dek })),
  { title: "The CRD Audit (runnable)", url: "/audit.html", kind: "Instrument", dek: "A deterministic instrument: paste copy, surface where stated confidence outruns architectural reality." },
  ...pages.map((p) => ({ title: p.title, url: p.url, kind: "Apparatus", dek: "" })),
];
fs.writeFileSync(path.join(DIST, "corpus.json"), JSON.stringify(db));

const kinds = [...new Set(db.map((d) => d.kind))];
fs.writeFileSync(path.join(DIST, "database.html"), shell({
  title: "The Index",
  body: `<div class="dbwrap">
  <a class="back" href="/">← Cover</a>
  <div class="head reveal"><div class="kicker">Searchable index</div><h1>The Index</h1></div>
  <input id="q" class="searchbox" placeholder="Search the corpus…" autocomplete="off">
  <div class="filters" id="filters"><button class="active" data-k="all">All</button>${kinds.map((k) => `<button data-k="${k}">${k}</button>`).join("")}</div>
  <p class="dbcount" id="count"></p>
  <div id="rows"></div>
</div>
<script>
const DB=${JSON.stringify(db)};let kf='all';const rows=document.getElementById('rows'),q=document.getElementById('q'),count=document.getElementById('count');
function render(){const term=q.value.trim().toLowerCase();let n=0;
  rows.innerHTML=DB.map(function(d){var hay=(d.title+' '+d.dek+' '+d.kind).toLowerCase();
    var show=(kf==='all'||d.kind===kf)&&(!term||hay.indexOf(term)>-1);if(show)n++;
    return '<div class="dbrow'+(show?'':' hidden')+'"><div class="meta">'+d.kind+'</div><a href="'+d.url+'">'+d.title+'</a>'+(d.dek?'<div class="dek">'+d.dek+'</div>':'')+'</div>';}).join('');
  count.textContent=n+' of '+DB.length+' entries';}
q.addEventListener('input',render);
document.querySelectorAll('#filters button').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('#filters button').forEach(function(x){x.classList.remove('active');});b.classList.add('active');kf=b.dataset.k;render();});});
render();
</script>`,
}));

// ---------- COVER / HOME -----------------------------------------------------
const bookFeatures = BOOKS.filter((b) => b.href).map((b) => `
  <a class="feature reveal" href="${b.href}">
    <div class="kicker">${b.kicker}</div>
    <h3>${b.title}</h3>
    <p>${b.dek}</p>
    <span class="read">Read →${b.pdf ? ` · <span style="border-bottom:1px solid">PDF</span>` : ""}</span>
  </a>`).join("");

const pamphlets = entries.filter((e) => e.pamphlet).map((e) => `
  <a class="item" href="${e.url}"><span class="kicker">Pamphlet</span><h3>${e.title}</h3><p>${e.dek}…</p></a>`).join("");

const corpusPicks = entries.filter((e) => !e.pamphlet && ["Method", "Essay", "Dialogue", "Note"].includes(e.kind)).slice(0, 6)
  .map((e) => `<a class="item" href="${e.url}"><span class="kicker">${e.kind}</span><h3>${e.title}</h3></a>`).join("");

const cover = shell({
  title: "An academic journal of interactive media arts",
  bodyClass: "home",
  body: `
<section class="cover">
  <div class="issueline reveal"><span>Vol. I</span><span class="dot">●</span><span>An academic journal of interactive media arts</span><span class="dot">●</span><span>Independent research</span></div>
  <h1 class="title reveal">The Ruler <span class="amp">&amp;</span> the Remainder</h1>
  <p class="statement reveal">A body of independent research into how systems — machines, institutions, people — read the world into legible categories, and what they leave out. The measure is the ruler. What it cannot account for is the remainder.</p>
  <blockquote class="epi reveal">Every system that survives learns how to read.</blockquote>
  <p class="by reveal">Written and assembled by <a href="/essays/a-note-on-method-and-distribution.html">Ryann Murphy</a>, independent researcher. The credential is the argument — <a href="/method.html">the method is public</a>.</p>
</section>

<div class="contents">
  <section class="dept" id="books">
    <div class="dept-head reveal"><span class="no">01</span><h2>Books</h2><span class="gloss">long-form</span></div>
    <div class="features">${bookFeatures}</div>
  </section>

  <section class="dept" id="pamphlets">
    <div class="dept-head reveal"><span class="no">02</span><h2>Pamphlets</h2><span class="gloss">the vocabulary — legibilism · attentionism · latentology</span></div>
    <div class="items">${pamphlets}</div>
  </section>

  <section class="dept" id="instruments">
    <div class="dept-head reveal"><span class="no">03</span><h2>Instruments</h2><span class="gloss">runnable research tools</span></div>
    <div class="items">
      <a class="item" href="/audit.html"><span class="kicker">Tool · runs in browser</span><h3>The CRD Audit</h3><p>Paste marketing or technical copy; surface where stated confidence outruns architectural reality. Nothing leaves the page.</p></a>
      <a class="item" href="/database.html"><span class="kicker">Tool · searchable</span><h3>The Index</h3><p>Search and filter the whole corpus — books, pamphlets, essays, dialogues, apparatus.</p></a>
    </div>
  </section>

  <section class="dept" id="corpus">
    <div class="dept-head reveal"><span class="no">04</span><h2>The Corpus</h2><span class="gloss">essays · dialogues · method</span></div>
    <div class="items">${corpusPicks}</div>
    <p class="by" style="margin-top:1.4rem"><a href="/database.html">Browse all ${db.length} entries in the index →</a></p>
  </section>

  <section class="dept" id="apparatus">
    <div class="dept-head reveal"><span class="no">05</span><h2>Apparatus</h2><span class="gloss">how to read this</span></div>
    <div class="items">
      ${pages.map((p) => `<a class="item" href="${p.url}"><span class="kicker">Apparatus</span><h3>${p.title}</h3></a>`).join("")}
      <a class="item" href="/essays/a-note-on-method-and-distribution.html"><span class="kicker">Note</span><h3>A Note on Method and Distribution</h3></a>
    </div>
  </section>
</div>`,
});
fs.writeFileSync(path.join(DIST, "index.html"), cover);

// ---------- static assets ----------------------------------------------------
fs.copyFileSync(path.join(ROOT, "styles.css"), path.join(DIST, "styles.css"));
if (exists(path.join(ROOT, "tool", "audit.html"))) fs.copyFileSync(path.join(ROOT, "tool", "audit.html"), path.join(DIST, "audit.html"));
if (exists(path.join(ROOT, "tool", "audit.js"))) fs.copyFileSync(path.join(ROOT, "tool", "audit.js"), path.join(DIST, "audit.js"));

console.log(`Built: ${BOOKS.filter((b) => b.href).length} books, ${entries.length} corpus pieces, ${db.length} index entries.`);
for (const b of BOOKS) if (b.missing) console.log(`  ! missing book source: ${b.src}`);
