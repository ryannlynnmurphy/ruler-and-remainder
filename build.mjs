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
const SITE_URL = "https://ruler-and-remainder.vercel.app";
const DEFAULT_DESC = "Independent research into how systems read the world into legible categories, and who pays for what stays invisible. Books, pamphlets, and a runnable audit by Ryann Murphy.";

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

function shell({ title, body, bodyClass = "", desc = "", route = "" }) {
  const d = (desc || DEFAULT_DESC).replace(/\s+/g, " ").trim();
  const url = SITE_URL + route;
  return `<!doctype html>
<html lang="en">
<head>
<script>document.documentElement.className+=' js';</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · ${SITE}</title>
<meta name="description" content="${xmlEsc(d)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE}">
<meta property="og:title" content="${xmlEsc(title)} · ${SITE}">
<meta property="og:description" content="${xmlEsc(d)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/og.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${xmlEsc(title)} · ${SITE}">
<meta name="twitter:description" content="${xmlEsc(d)}">
<meta name="theme-color" content="#e2300c">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<div id="measure" aria-hidden="true"></div>
<div class="ruler-gutter" aria-hidden="true"></div>
<header class="topbar">
  <a class="home" href="/">The Ruler &amp; the Remainder<small>Independent research · R. Murphy</small></a>
  <nav aria-label="Primary">${NAV}</nav>
</header>
<main id="main">
${body}
</main>
<footer><div class="colophon">
  <span class="lead">${SITE}</span> — an academic journal of interactive media arts.
  Independent research by Ryann Murphy. The credential is the argument.<br>
  Set in Bodoni Moda, Newsreader, and Space Mono. Text released under
  <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
  Source on <a href="https://github.com/ryannlynnmurphy/ruler-and-remainder">GitHub</a>.
</div></footer>
<script>
(function(){
  var m=document.getElementById('measure');
  function prog(){var h=document.documentElement;var s=h.scrollTop||document.body.scrollTop;
    var max=(h.scrollHeight-h.clientHeight)||1;m.style.width=(100*s/max)+'%';}
  document.addEventListener('scroll',prog,{passive:true});prog();
  var els=document.querySelectorAll('.reveal');
  if(window.IntersectionObserver && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el){io.observe(el);});
    // safety: content must never stay hidden, whatever the observer does
    setTimeout(function(){els.forEach(function(el){el.classList.add('in');});},1800);
  } else { els.forEach(function(el){el.classList.add('in');}); }
})();
</script>
</body>
</html>`;
}

function piece({ title, kicker, md, bodyClass = "", backHref = "/#corpus", backLabel = "Index", lead = "", desc = "", route = "" }) {
  const { withRefs, block } = footnotes(md);
  // strip the leading H1 (we render our own head)
  const noH1 = withRefs.replace(/^\s*#\s+.+?\n/, "");
  const html = marked.parse(noH1);
  return shell({
    title,
    bodyClass,
    desc: desc || firstProse(md),
    route,
    body: `<article class="piece ${bodyClass ? "autotheory" : ""}">
  <a class="back" href="${backHref}">← ${backLabel}</a>
  <header class="head reveal">${kicker ? `<div class="kicker">${kicker}</div>` : ""}<h1>${title}</h1>${bodyClass ? `<p class="genre-note">Autotheory — autobiography reasoning as theory and back again.</p>` : ""}</header>
  ${lead}
  <div class="prose reveal">${html}${block}</div>
  <div class="foot"><a href="${backHref}">← ${backLabel}</a></div>
</article>`,
  });
}

// ---------- EPUB generation (dependency-free) --------------------------------
let CRC_TABLE;
function crc32(buf) {
  if (!CRC_TABLE) {
    CRC_TABLE = [];
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; CRC_TABLE[n] = c >>> 0; }
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function zipStore(entries) {
  const local = [], central = []; let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8");
    const data = Buffer.isBuffer(e.data) ? e.data : Buffer.from(e.data, "utf8");
    const crc = crc32(data);
    const h = Buffer.alloc(30);
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0, 6);
    h.writeUInt16LE(0, 8); h.writeUInt16LE(0, 10); h.writeUInt16LE(23755, 12); // 2026-06-11
    h.writeUInt32LE(crc, 14); h.writeUInt32LE(data.length, 18); h.writeUInt32LE(data.length, 22);
    h.writeUInt16LE(name.length, 26); h.writeUInt16LE(0, 28);
    local.push(h, name, data);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6);
    c.writeUInt16LE(0, 8); c.writeUInt16LE(0, 10); c.writeUInt16LE(0, 12); c.writeUInt16LE(23755, 14);
    c.writeUInt32LE(crc, 16); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(data.length, 24);
    c.writeUInt16LE(name.length, 28); c.writeUInt16LE(0, 30); c.writeUInt16LE(0, 32);
    c.writeUInt16LE(0, 34); c.writeUInt16LE(0, 36); c.writeUInt32LE(0, 38); c.writeUInt32LE(offset, 42);
    central.push(c, name);
    offset += h.length + name.length + data.length;
  }
  const cdStart = offset; let cdSize = 0; for (const b of central) cdSize += b.length;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(0, 4); eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8); eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdSize, 12); eocd.writeUInt32LE(cdStart, 16); eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...local, ...central, eocd]);
}

const xmlEsc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function epubCss() {
  return `body{font-family:Georgia,'Times New Roman',serif;line-height:1.6;margin:5% 6%;color:#0e0d0a;}
h1,h2,h3{font-family:'Helvetica Neue',Arial,sans-serif;line-height:1.1;letter-spacing:-0.01em;}
h1{font-size:1.7em;font-weight:800;margin:2.4em 0 0.6em;padding-top:1em;border-top:2px solid #0e0d0a;}
h2{font-size:1.3em;font-weight:700;margin:1.8em 0 0.5em;}
h3{font-size:1.05em;font-weight:700;color:#6c6557;}
p{margin:0 0 1em;} a{color:#e2300c;}
blockquote{margin:1.4em 0;padding-left:1em;border-left:3px solid #e2300c;font-style:italic;color:#34302a;}
hr{border:none;text-align:center;margin:2em 0;} hr:after{content:"✶";color:#e2300c;}
code{font-family:monospace;font-size:0.85em;background:#ece6d7;padding:0 0.2em;}
pre{font-family:monospace;font-size:0.8em;background:#0e0d0a;color:#efe9d8;padding:1em;overflow-x:auto;}
pre code{background:none;}
table{width:100%;border-collapse:collapse;font-size:0.9em;margin:1.4em 0;}
th,td{text-align:left;padding:0.4em 0.5em;border-bottom:1px solid #cfc7b1;}
sup{color:#e2300c;font-size:0.7em;}
.kick{font-family:monospace;font-size:0.8em;letter-spacing:0.1em;text-transform:uppercase;color:#e2300c;}`;
}
function svgCover(b) {
  const words = b.title.split(/\s+/);
  const lines = words.map((w, i) => `<text x="58" y="${360 + i * 92}" font-family="Georgia,serif" font-weight="bold" font-size="84" fill="${i === words.length - 1 ? "#e2300c" : "#0e0d0a"}">${xmlEsc(w)}</text>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="700" height="933" viewBox="0 0 700 933">
<rect width="700" height="933" fill="#f4f0e6"/>
<rect x="0" y="0" width="700" height="16" fill="#e2300c"/>
<text x="58" y="130" font-family="Georgia,serif" font-size="24" letter-spacing="3" fill="#0e0d0a">THE RULER &amp; THE REMAINDER</text>
<text x="58" y="160" font-family="monospace" font-size="15" letter-spacing="3" fill="#6c6557">VOL. I — INDEPENDENT RESEARCH</text>
${lines}
<text x="58" y="${360 + words.length * 92 + 30}" font-family="monospace" font-size="16" letter-spacing="2" fill="#6c6557">${xmlEsc(b.kicker.toUpperCase())}</text>
<text x="58" y="880" font-family="monospace" font-size="22" letter-spacing="3" fill="#0e0d0a">RYANN MURPHY</text>
</svg>`;
}
function xhtml(title, body) {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><meta charset="utf-8"/><title>${xmlEsc(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>${body}</body></html>`;
}
function makeEpub(b, md) {
  // render body, inject heading ids, collect a nav
  let html = marked.parse(md);
  const headings = [];
  let i = 0;
  html = html.replace(/<(h[1-3])>([\s\S]*?)<\/\1>/g, (m, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const id = "h" + i++ + "-" + slug(text).slice(0, 36);
    headings.push({ level: +tag[1], text, id });
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  // XHTML well-formedness for strict readers
  html = html.replace(/<br>/g, "<br/>").replace(/<hr>/g, "<hr/>").replace(/<img([^>]*?)>/g, "<img$1/>");

  const ID = `https://ruler-and-remainder.vercel.app/books/${b.slug}`;
  const navItems = headings.filter((h) => h.level <= 2).map((h) => `<li><a href="book.xhtml#${h.id}">${xmlEsc(h.text)}</a></li>`).join("\n");
  const nav = xhtml("Contents", `<nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${navItems}</ol></nav>`);
  const coverDoc = xhtml(b.title, `<div style="text-align:center;margin:0;padding:0"><img src="cover.svg" alt="${xmlEsc(b.title)} — Ryann Murphy" style="max-width:100%;height:auto"/></div>`);
  const content = xhtml(b.title, `<p class="kick">${xmlEsc(b.kicker)}</p>\n${html}`);
  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">${ID}</dc:identifier>
<dc:title>${xmlEsc(b.title)}</dc:title>
<dc:creator>Ryann Murphy</dc:creator>
<dc:language>en</dc:language>
<dc:publisher>The Ruler and the Remainder</dc:publisher>
<dc:rights>CC BY 4.0</dc:rights>
<meta property="dcterms:modified">2026-06-11T00:00:00Z</meta>
<meta name="cover" content="cover-img"/>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="css" href="style.css" media-type="text/css"/>
<item id="cover-img" href="cover.svg" media-type="image/svg+xml" properties="cover-image"/>
<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>
<item id="content" href="book.xhtml" media-type="application/xhtml+xml"/>
</manifest>
<spine>
<itemref idref="cover"/>
<itemref idref="content"/>
</spine>
</package>`;
  const container = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`;
  return zipStore([
    { name: "mimetype", data: "application/epub+zip" },
    { name: "META-INF/container.xml", data: container },
    { name: "OEBPS/content.opf", data: opf },
    { name: "OEBPS/nav.xhtml", data: nav },
    { name: "OEBPS/style.css", data: epubCss() },
    { name: "OEBPS/cover.svg", data: svgCover(b) },
    { name: "OEBPS/cover.xhtml", data: coverDoc },
    { name: "OEBPS/book.xhtml", data: content },
  ]);
}

// ---------- clean ------------------------------------------------------------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, "essays"), { recursive: true });
fs.mkdirSync(path.join(DIST, "books"), { recursive: true });
fs.mkdirSync(path.join(DIST, "pdf"), { recursive: true });
fs.mkdirSync(path.join(DIST, "epub"), { recursive: true });

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
  b.href = `/books/${b.slug}.html`;
  // EPUB (real downloadable e-book, generated from the source)
  fs.writeFileSync(path.join(DIST, "epub", `${b.slug}.epub`), makeEpub(b, md));
  b.epub = `/epub/${b.slug}.epub`;
  // PDF if a source exists
  if (b.pdfFrom) {
    for (const c of b.pdfFrom) {
      if (exists(path.join(ROOT, c))) { fs.copyFileSync(path.join(ROOT, c), path.join(DIST, "pdf", `${b.slug}.pdf`)); b.pdf = `/pdf/${b.slug}.pdf`; break; }
    }
  }
  const lead = `<p class="downloads">Read below, or take it with you — <a href="${b.epub}">↓ EPUB</a>${b.pdf ? ` · <a href="${b.pdf}">↓ PDF</a>` : ""}</p>`;
  fs.writeFileSync(
    path.join(DIST, "books", `${b.slug}.html`),
    piece({ title: b.title, kicker: b.kicker, md, bodyClass: b.artbook ? "artbook" : "", backHref: "/#books", backLabel: "All books", lead, desc: b.dek, route: b.href })
  );
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
  fs.writeFileSync(path.join(DIST, "essays", `${s}.html`), piece({ title, kicker: kind, md, route: `/essays/${s}.html` }));
  entries.push({ title, slug: s, url: `/essays/${s}.html`, kind, dek: firstProse(md), pamphlet: FEATURED.includes(file) });
}

// method + provenance
const pages = [];
for (const f of ["METHOD.md", "PROVENANCE.md"]) {
  if (!exists(path.join(ROOT, f))) continue;
  const md = read(path.join(ROOT, f));
  const t = titleOf(md, f);
  const s = f.replace(/\.md$/i, "").toLowerCase();
  fs.writeFileSync(path.join(DIST, `${s}.html`), piece({ title: t, kicker: "Apparatus", md, backHref: "/", backLabel: "Cover", route: `/${s}.html` }));
  pages.push({ title: t, url: `/${s}.html` });
}

// ---------- ARTIFACTS (binary research documents — decks, dossiers, briefs) -
fs.mkdirSync(path.join(DIST, "files"), { recursive: true });
const artifacts = [];
if (exists(path.join(ROOT, "research"))) {
  for (const f of fs.readdirSync(path.join(ROOT, "research")).filter((f) => /\.(pdf|pptx|key)$/i.test(f)).sort()) {
    fs.copyFileSync(path.join(ROOT, "research", f), path.join(DIST, "files", f));
    const ext = f.split(".").pop().toUpperCase();
    const name = f.replace(/\.[^.]+$/, "").replace(/_/g, " ").replace(/\s+\d+\s+Slides$/i, "").trim();
    artifacts.push({ title: `${name} · ${ext}`, url: `/files/${f}`, kind: "Artifact", dek: "Downloadable research document — part of the Anteriority development set." });
  }
}

// ---------- DATABASE (searchable index) -------------------------------------
const db = [
  ...BOOKS.filter((b) => b.href).map((b) => ({ title: b.title, url: b.href, kind: "Book", dek: b.dek })),
  ...entries.map((e) => ({ title: e.title, url: e.url, kind: e.kind, dek: e.dek })),
  { title: "The CRD Audit (runnable)", url: "/audit.html", kind: "Instrument", dek: "A deterministic instrument: paste copy and architecture, surface where stated confidence outruns reality." },
  ...artifacts,
  ...pages.map((p) => ({ title: p.title, url: p.url, kind: "Apparatus", dek: "" })),
];
fs.writeFileSync(path.join(DIST, "corpus.json"), JSON.stringify(db));

const kinds = [...new Set(db.map((d) => d.kind))];
fs.writeFileSync(path.join(DIST, "database.html"), shell({
  title: "The Index",
  route: "/database.html",
  desc: "Search and filter the whole corpus — books, pamphlets, essays, dialogues, instruments, and apparatus.",
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
    <span class="read">Read →${b.epub ? " · EPUB" : ""}${b.pdf ? " · PDF" : ""}</span>
  </a>`).join("");

const pamphlets = entries.filter((e) => e.pamphlet).map((e) => `
  <a class="item" href="${e.url}"><span class="kicker">Pamphlet</span><h3>${e.title}</h3><p>${e.dek}…</p></a>`).join("");

const corpusPicks = entries.filter((e) => !e.pamphlet && ["Method", "Essay", "Dialogue", "Note"].includes(e.kind)).slice(0, 6)
  .map((e) => `<a class="item" href="${e.url}"><span class="kicker">${e.kind}</span><h3>${e.title}</h3></a>`).join("");

const cover = shell({
  title: "An academic journal of interactive media arts",
  bodyClass: "home",
  route: "/",
  desc: "How systems read the world into legible categories — and who pays for what stays invisible. Independent research, books, and a runnable audit by Ryann Murphy.",
  body: `
<section class="cover">
  <div class="issueline reveal"><span>Vol. I</span><span class="dot">●</span><span>An academic journal of interactive media arts</span><span class="dot">●</span><span>Independent research</span></div>
  <h1 class="title reveal">The<br>Ruler <span class="amp">&amp;</span><br>the <span class="block" aria-hidden="true">▟</span> Remainder</h1>
  <p class="statement reveal">How systems read the world into legible categories — and who pays for what stays invisible. The measure is the ruler. What it cannot hold is the remainder.</p>
  <div class="manifesto reveal">Independent research.<br><span class="r">No lab signs these pages.</span><br>The credential is the argument.</div>
  <p class="enter reveal"><a href="#books">↓ Enter ↓</a></p>
</section>

<div class="contents">
  <section class="dept" id="books">
    <div class="dept-head reveal"><span class="no" aria-hidden="true">01</span><h2>Books</h2><span class="gloss">long-form</span></div>
    <div class="features">${bookFeatures}</div>
  </section>

  <section class="dept" id="pamphlets">
    <div class="dept-head reveal"><span class="no" aria-hidden="true">02</span><h2>Pamphlets</h2><span class="gloss">the vocabulary — legibilism · attentionism · latentology</span></div>
    <div class="items">${pamphlets}</div>
  </section>

  <section class="dept" id="instruments">
    <div class="dept-head reveal"><span class="no" aria-hidden="true">03</span><h2>Instruments</h2><span class="gloss">runnable research tools</span></div>
    <div class="items">
      <a class="item" href="/audit.html"><span class="kicker">Tool · runs in browser</span><h3>The CRD Audit</h3><p>Paste marketing or technical copy; surface where stated confidence outruns architectural reality. Nothing leaves the page.</p></a>
      <a class="item" href="/database.html"><span class="kicker">Tool · searchable</span><h3>The Index</h3><p>Search and filter the whole corpus — books, pamphlets, essays, dialogues, apparatus.</p></a>
    </div>
  </section>

  <section class="dept" id="corpus">
    <div class="dept-head reveal"><span class="no" aria-hidden="true">04</span><h2>The Corpus</h2><span class="gloss">essays · dialogues · method</span></div>
    <div class="items">${corpusPicks}</div>
    <p class="by" style="margin-top:1.4rem"><a href="/database.html">Browse all ${db.length} entries in the index →</a></p>
  </section>

  <section class="dept" id="apparatus">
    <div class="dept-head reveal"><span class="no" aria-hidden="true">05</span><h2>Apparatus</h2><span class="gloss">how to read this</span></div>
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

// favicon — the measure mark
fs.writeFileSync(path.join(DIST, "favicon.svg"),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#f4f0e6"/><rect width="32" height="6" fill="#e2300c"/><text x="16" y="26" font-family="Georgia,serif" font-weight="bold" font-size="22" text-anchor="middle" fill="#0e0d0a">R</text></svg>`);

// social card (1200×630) — fierce editorial
fs.writeFileSync(path.join(DIST, "og.svg"),
`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f4f0e6"/>
<rect width="1200" height="20" fill="#e2300c"/>
<text x="80" y="150" font-family="monospace" font-size="26" letter-spacing="6" fill="#6c6557">VOL. I — AN ACADEMIC JOURNAL OF INTERACTIVE MEDIA ARTS</text>
<text x="76" y="300" font-family="Georgia,serif" font-weight="bold" font-size="120" fill="#0e0d0a">The Ruler</text>
<text x="76" y="430" font-family="Georgia,serif" font-weight="bold" font-size="120" fill="#0e0d0a">&amp; the <tspan fill="#e2300c">Remainder</tspan></text>
<text x="80" y="540" font-family="monospace" font-size="28" letter-spacing="3" fill="#0e0d0a">INDEPENDENT RESEARCH · RYANN MURPHY</text>
</svg>`);

// sitemap + robots
const routes = ["/", "/database.html", "/audit.html",
  ...BOOKS.filter((b) => b.href).map((b) => b.href),
  ...entries.map((e) => e.url), ...pages.map((p) => p.url)];
fs.writeFileSync(path.join(DIST, "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `<url><loc>${SITE_URL}${r}</loc></url>`).join("\n") + `\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Built: ${BOOKS.filter((b) => b.href).length} books, ${entries.length} corpus pieces, ${artifacts.length} artifacts, ${db.length} index entries.`);
for (const b of BOOKS) if (b.missing) console.log(`  ! missing book source: ${b.src}`);
