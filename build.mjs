// Build "The Ruler and the Remainder" — a personal research corpus.
// Renders the corpus (markdown) + the books into a single art-directed static site.
import { marked } from "marked";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const DIST = path.join(ROOT, "dist");
const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);

marked.setOptions({ gfm: true, breaks: false });

// calc fences → styled formula blocks (not terminal-dark code)
function renderMd(md) {
  let html = marked.parse(cleanMd(md));
  html = html.replace(/<pre><code class="language-calc">([\s\S]*?)<\/code><\/pre>/g, '<pre class="calc"><code>$1</code></pre>');
  return html;
}

const SITE = "The Ruler and the Remainder";
const SITE_URL = "https://ruler-and-remainder.vercel.app";
const DEFAULT_DESC = "Independent research into how systems read the world into legible categories, and who pays for what stays invisible. Books, pamphlets, and a runnable audit by Ryann Murphy.";

// ---------- helpers ----------------------------------------------------------
const slug = (s) =>
  s.replace(/\.md$/i, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();

// escape plain text for an HTML text node / attribute (decks, titles, labels)
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

// strip LaTeX/typesetting artifacts left in manuscripts (\newpage, \vspace{...}, etc.)
const cleanMd = (s) =>
  s.replace(/\\(newpage|clearpage|pagebreak|bigskip|medskip|smallskip|noindent|hfill|par|centering)\b[ \t]*/g, "")
   .replace(/\\vspace\*?\{[^}]*\}/g, "")
   .replace(/^\s*\\\\\s*$/gm, "")
   .replace(/\u00a0/g, " ")
   .replace(/[ \t]+$/gm, "");

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

const NAV = `<a href="/#books">Books</a><a href="/#corpus">Corpus</a><a href="/database.html">Index</a><a href="/instruments.html">Instruments</a><a href="/method.html">Method</a>`;

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
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<div id="measure" aria-hidden="true"></div>
<div class="ruler-gutter" aria-hidden="true"></div>
<header class="topbar">
  <a class="home" href="/">the ruler &amp; the remainder<small>vibe coding &amp; vibe research · r. murphy</small></a>
  <nav aria-label="Primary">${NAV}</nav>
</header>
<main id="main">
${body}
</main>
<footer><div class="colophon">
  <span class="lead">${SITE}</span> — a personal research corpus. independent research by ryann murphy in ai governance, ai sovereignty, computational neuroscience &amp; computational phenomenology.<br>
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

function piece({ title, kicker, md, backHref = "/#corpus", backLabel = "Index", desc = "", route = "", fileMeta = "" }) {
  const { withRefs, block } = footnotes(md);
  // strip the leading H1 (we render our own head)
  const noH1 = withRefs.replace(/^\s*#\s+.+?\n/, "");
  const html = renderMd(noH1);
  return shell({
    title,
    bodyClass: "reading",
    desc: desc || firstProse(md),
    route,
    body: `<article class="piece doc">
  <a class="back" href="${backHref}">← ${backLabel}</a>
  <header class="head reveal">${kicker ? `<div class="kicker">${kicker}</div>` : ""}<h1>${title}</h1>${fileMeta ? `<p class="filemeta">${fileMeta}</p>` : ""}</header>
  <div class="prose reveal">${html}${block}</div>
  <div class="foot"><a href="${backHref}">← ${backLabel}</a></div>
</article>`,
  });
}

// client pager: lays the book into screen-height columns and turns them as
// a two-page spread (one page on phones). Progressive enhancement — with no
// JS the .pages block just scrolls normally.
const PAGER_JS = `(function(){
  var s=document.currentScript, reader=s&&s.closest('.reader'); if(!reader) return;
  var vp=reader.querySelector('.viewport'), pages=reader.querySelector('.pages');
  var pager=reader.querySelector('.pager'), prev=reader.querySelector('.pg-prev');
  var next=reader.querySelector('.pg-next'), status=reader.querySelector('.pg-status');
  var spread=0,total=1,step=1,n=2,inited=false;
  function readHash(){var m=(location.hash||'').match(/p(\\d+)/);return m?Math.max(0,parseInt(m[1],10)-1):null;}
  function layout(){
    var wide=window.matchMedia('(min-width:760px)').matches;
    n=wide?2:1; var gut=wide?56:0;
    var vcs=getComputedStyle(vp);
    var vpad=(parseFloat(vcs.paddingLeft)||0)+(parseFloat(vcs.paddingRight)||0);
    var contentW=vp.clientWidth-vpad;
    var avail=window.innerHeight-vp.getBoundingClientRect().top-92;
    var ph=Math.max(380,avail);
    pages.style.columnCount=n; pages.style.columnGap=gut+'px';
    pages.style.width=contentW+'px'; pages.style.height=ph+'px'; vp.style.height=ph+'px';
    step=contentW+gut;
    var sw=pages.scrollWidth;
    // safety net: if the browser made no horizontal overflow columns but the
    // content is clipped, fall back to plain scrolling rather than hide text.
    if(sw<=contentW+4 && pages.scrollHeight>ph+4){
      reader.classList.remove('paged'); pager.hidden=true;
      pages.style.cssText=''; vp.style.height=''; return;
    }
    total=Math.max(1,Math.ceil((sw-2)/step));
    if(!inited){var h=readHash(); if(h!=null) spread=h; inited=true;}
    if(spread>total-1) spread=total-1;
    apply();
  }
  function apply(){
    pages.style.transform='translateX('+(-spread*step)+'px)';
    if(inited){try{history.replaceState(null,'','#p'+(spread+1));}catch(e){}}
    var p1=spread*n+1, last=total*n, p2=Math.min(last,p1+n-1);
    status.textContent=(n===2&&p2>p1?p1+'–'+p2:''+p1)+' / '+last;
    prev.disabled=spread<=0; next.disabled=spread>=total-1;
  }
  function go(d){spread=Math.max(0,Math.min(total-1,spread+d));apply();}
  reader.classList.add('paged'); pager.hidden=false;
  prev.addEventListener('click',function(){go(-1);});
  next.addEventListener('click',function(){go(1);});
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='PageDown'){go(1);e.preventDefault();}
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){go(-1);e.preventDefault();}
  });
  vp.addEventListener('click',function(e){
    if(e.target.closest('a,button')) return;
    var r=vp.getBoundingClientRect();
    if(e.clientX<r.left+r.width*0.32) go(-1);
    else if(e.clientX>r.left+r.width*0.68) go(1);
  });
  var x0=null;
  vp.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  vp.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(dx<0?1:-1);x0=null;});
  var rt; window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(layout,160);});
  window.addEventListener('load',layout);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(layout);
  layout();
})();`;

// a designed book-reading page: a title spread + a two-page flip reader
function bookPage(b, md) {
  md = md.replace(/^﻿?\s*---\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n/, ""); // drop YAML front-matter
  const { withRefs, block } = footnotes(md);
  const noH1 = withRefs.replace(/^\s*#\s+.+?\n/, "");
  let html = renderMd(noH1);
  // editorial drop cap mode: in "chapter" books, the cap lands only on a true
  // chapter opening — never front-matter (Abstract/Contents) or appendices.
  // Default books keep a cap on every h2 opener (see styles.css).
  const capChapter = b.dropcap === "chapter";
  if (capChapter) {
    html = html.replace(
      /(<h2[^>]*>\s*(?:chapter|prologue|epilogue|coda)\b[\s\S]*?<\/h2>\s*)<p>/gi,
      '$1<p class="chapter-open">'
    );
  }
  const proseClass = "pages bookprose prose" + (capChapter ? " caps-chapter" : "");
  const author = /with claude/i.test(b.kicker) ? "by claude &amp; ryann" : "by ryann murphy";
  const dl = `take it with you — <a href="${b.epub}">↓ epub</a>${b.pdf ? ` · <a href="${b.pdf}">↓ pdf</a>` : ""}`;
  return shell({
    title: b.title,
    bodyClass: "bookread",
    desc: b.dek,
    route: b.href,
    body: `<article class="book-wrap reader">
  <a class="back" href="/#books">← all books</a>
  <div class="viewport">
    <div class="${proseClass}">
      <section class="cover">
        <div class="kicker">${b.kicker}</div>
        <h1 class="booktitle">${b.title}</h1>
        <p class="byline">${author}</p>
        <p class="bookdek">${b.dek}</p>
        <p class="downloads">${dl}</p>
      </section>
      ${html}${block}
    </div>
  </div>
  <nav class="pager" aria-label="Pages" hidden>
    <button class="pg-btn pg-prev" type="button" aria-label="Previous page">←</button>
    <span class="pg-status" role="status" aria-live="polite"></span>
    <button class="pg-btn pg-next" type="button" aria-label="Next page">→</button>
  </nav>
  <div class="foot"><a href="/#books">← all books</a></div>
  <script>${PAGER_JS}</script>
</article>`,
  });
}

// ---------- EDITORIAL EDITION GENERATOR --------------------------------------
// Renders a manuscript in the same art-directed reading skin as the
// hand-authored Narrative Intelligence edition (read-edition.html). The skin
// (full <style> block + the progress/theme-toggle JS) is lifted *verbatim* from
// read-edition.html at build time, so the two editions stay pixel-identical.

const EDITION_SKIN = (() => {
  const src = read(path.join(ROOT, "read-edition.html"));
  const style = src.match(/<style>[\s\S]*?<\/style>/)[0]; // ruler-and-remainder CSS, verbatim
  // the trailing IIFE: progress bar + paper-default theme toggle, verbatim
  const js = src.match(/<script>\s*\(function\(\)\{[\s\S]*?\}\)\(\);\s*<\/script>/)[0];
  return { style, js };
})();

const EDITION_HEAD_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">`;

const EDITION_THEME_BTN = `<button id="themeToggle" aria-label="Switch to light mode">
    <svg id="iconSun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
    <svg id="iconMoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </button>`;

// turn a number into a Title-cased English word ("Chapter One", "Part III")
const ONES = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
  "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen","Twenty",
  "Twenty-One","Twenty-Two","Twenty-Three","Twenty-Four","Twenty-Five","Twenty-Six","Twenty-Seven",
  "Twenty-Eight","Twenty-Nine","Thirty","Thirty-One","Thirty-Two","Thirty-Three","Thirty-Four","Thirty-Five",
  "Thirty-Six","Thirty-Seven","Thirty-Eight","Thirty-Nine","Forty"];
const ROMAN = ["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
const wordNum = (n) => ONES[n] || String(n);
const romanNum = (n) => ROMAN[n] || String(n);

// inline **[Established.]** / **[Exploratory …]** / **[Speculative …]** → tier badges,
// preserving any qualifier text inside the bracket. Runs on the raw markdown.
function tierBadges(md) {
  return md.replace(/\*\*\[(Established|Exploratory|Speculative)([^\]]*)\]\*\*/g, (_, kind, rest) => {
    const cls = kind === "Established" ? "tier-est" : kind === "Exploratory" ? "tier-exp" : "tier-spec";
    const extra = rest.replace(/^[\s.:—-]+|[\s.:]+$/g, "").trim();
    const label = extra ? `${kind} — ${extra}` : kind;
    return `<span class="tier ${cls}">${label}</span>`;
  });
}

// strip front-matter / dedication / title / About / Contents that precede the
// first structural Part heading — the cover + TOC replace all of it.
function editionStripFront(md, partRe) {
  md = md.replace(/^﻿?\s*---\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n/, ""); // YAML front-matter
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!/^#{1,3}\s+/.test(lines[i])) continue;
    const text = lines[i].replace(/^#{1,3}\s+/, "").replace(/[*_`]/g, "").trim();
    if (partRe.test(text)) return lines.slice(i).join("\n");
  }
  return md;
}

// render one chapter's body: full prose via marked, tier badges, blockquotes →
// pullquotes, drop cap on the first paragraph, sub-heads kept as <h3>.
function editionBody(bodyMd, dropcap) {
  let html = renderMd(tierBadges(bodyMd));
  // any in-chapter sub-heads (the manuscript's own ## / #### inside a chapter)
  // are normalized to <h3> so they pick up the .body h3 sub-head style and never
  // masquerade as a chapter title.
  html = html.replace(/<(\/?)h[1-6]>/g, "<$1h3>");
  // markdown blockquotes → editorial pull quotes
  html = html.replace(/<blockquote>\s*([\s\S]*?)\s*<\/blockquote>/g, (_, inner) => {
    const txt = inner.replace(/<\/?p>/g, " ").replace(/\s+/g, " ").trim();
    return `<div class="pullquote">${txt}</div>`;
  });
  const cls = "body" + (dropcap ? " dropcap" : "");
  return `<div class="${cls}">${html}</div>`;
}

// Parse a manuscript into { front:[{title,id,html}], parts:[{label,title,deck,
// chapters:[{n,title,id,html}]}], appendices:[{letter,title,id,html}] } using a
// per-book spec that names which heading levels are Parts vs Chapters.
function editionParse(b, md) {
  const spec = b.edition2 || {};
  const partRe = spec.partRe;
  md = editionStripFront(md, partRe);
  const lines = md.split("\n");
  const isHeading = (l) => /^#{1,3}\s+/.test(l);
  const hLevel = (l) => (l.match(/^(#{1,3})\s+/) || [, ""])[1].length;
  const hText = (l) => l.replace(/^#{1,3}\s+/, "").replace(/[*_`]/g, "").trim();

  // collect (level, text, startLine) for top-level structural headings only;
  // deeper headings become in-chapter sub-heads handled by renderMd.
  const chapLevel = spec.chapLevel || 2;
  const partLvl = spec.partLevel || 1;
  const subheadRe = spec.subheadRe;       // headings (≤chapLevel) that are in-chapter sub-heads
  const chapterTextRe = spec.chapterTextRe; // at the deepest chapter level, ONLY these are chapters
  const sections = [];
  for (let i = 0; i < lines.length; i++) {
    if (!isHeading(lines[i])) continue;
    const lvl = hLevel(lines[i]);
    if (lvl > chapLevel) continue; // deeper than chapter level: always a sub-head
    const txt = hText(lines[i]);
    const isPartOrApp = partRe.test(txt) || (spec.appendixRe && spec.appendixRe.test(txt));
    // a heading below part level but matching subheadRe is an in-chapter sub-head
    if (subheadRe && lvl > partLvl && subheadRe.test(txt) && !isPartOrApp) continue;
    // if chapterTextRe is set, headings at the deepest chapter level that DON'T
    // match it (and aren't parts/appendices) are sub-heads, not chapters
    if (chapterTextRe && lvl > partLvl && lvl >= chapLevel && !chapterTextRe.test(txt) && !isPartOrApp) continue;
    sections.push({ lvl, text: txt, line: i });
  }
  // attach body span to each section
  for (let s = 0; s < sections.length; s++) {
    sections[s].body = lines
      .slice(sections[s].line + 1, s + 1 < sections.length ? sections[s + 1].line : lines.length)
      .join("\n").trim();
  }

  const parts = [];
  const appendices = [];
  let cur = null, chapN = 0, appN = 0, inAppendix = false;
  const partTitles = spec.partTitles || {};
  const decks = spec.decks || {};
  const appendixRe = spec.appendixRe;
  const partLevel = spec.partLevel || 1;
  const skipRe = spec.skipRe; // headings to drop entirely (stray Contents fragments etc.)
  const pushAppendix = (title, body) => {
    appN++;
    const letter = String.fromCharCode(64 + appN); // A, B, C…
    appendices.push({ letter, title: title || `Appendix ${letter}`, id: "app-" + letter.toLowerCase(), html: editionBody(body, true) });
  };

  for (const sec of sections) {
    if (skipRe && skipRe.test(sec.text)) continue;
    // an Appendix divider (part-level): either a self-contained appendix (title +
    // body inline, e.g. RO's "# Appendix: Series Architecture") or a bare divider
    // (e.g. OR's "# Appendix") that turns the following ## headings into appendices.
    if (appendixRe && sec.lvl <= partLevel && appendixRe.test(sec.text)) {
      const title = sec.text.replace(appendixRe, "").replace(/^[:.\s—-]+/, "").trim();
      const hasBody = sec.body.replace(/\s|\\newpage/g, "").length > 0;
      if (title && hasBody) pushAppendix(title, sec.body); // self-contained appendix
      else inAppendix = true; // bare divider → following chapter headings are appendices
      continue;
    }
    // a Part divider
    if (!inAppendix && sec.lvl <= partLevel && partRe.test(sec.text)) {
      const meta = partTitles[sec.text] || {};
      cur = { label: meta.label || sec.text, title: meta.title || "", deck: meta.deck || "", chapters: [] };
      parts.push(cur);
      continue;
    }
    if (inAppendix) { pushAppendix(sec.text, sec.body); continue; }
    // otherwise a Chapter
    chapN++;
    if (!cur) { cur = { label: "", title: "", deck: "", chapters: [] }; parts.push(cur); }
    cur.chapters.push({ n: chapN, title: sec.text, id: "ch" + chapN, body: sec.body, deck: decks[sec.text] || "" });
  }
  return { parts, appendices, total: chapN, appCount: appN };
}

function editionPage(b, md) {
  const spec = b.edition2 || {};
  const { parts, appendices, total, appCount } = editionParse(b, md);

  // build chapter render with bridge to next chapter
  const flatChaps = [];
  for (const p of parts) for (const c of p.chapters) flatChaps.push(c);

  // ---- COVER meta line ----
  const partsWithTitles = parts.filter((p) => p.title || p.label);
  const metaBits = [
    `${partsWithTitles.length} Part${partsWithTitles.length === 1 ? "" : "s"}`,
    `${total} Chapter${total === 1 ? "" : "s"}`,
  ];
  if (appCount) metaBits.push(`${appCount} Appendix${appCount === 1 ? "" : "es"}`);

  // ---- TOC ----
  let toc = "";
  for (const p of parts) {
    const label = p.title ? `${p.label} — ${p.title}` : p.label;
    toc += `\n  <div class="toc-group">\n    <div class="toc-grouplabel">${esc(label)}</div>`;
    for (const c of p.chapters) {
      toc += `\n    <a class="toc-row" href="#${c.id}"><span class="num">${c.n}</span><span class="name">${esc(c.title)}</span><span class="sub">${esc(c.deck)}</span></a>`;
    }
    toc += `\n  </div>`;
  }
  if (appendices.length) {
    toc += `\n  <div class="toc-group">\n    <div class="toc-grouplabel">Appendices</div>`;
    for (const a of appendices) {
      const sub = (spec.appendixDecks && spec.appendixDecks[a.title]) || "";
      toc += `\n    <a class="toc-row" href="#${a.id}"><span class="num">${a.letter}</span><span class="name">${esc(a.title)}</span><span class="sub">${esc(sub)}</span></a>`;
    }
    toc += `\n  </div>`;
  }

  // ---- SPINE (Argument in Brief) ----
  let spine = "";
  for (const p of parts) {
    if (!p.chapters.length) continue;
    const label = p.title ? `${p.label} — ${p.title}` : p.label;
    if (label) spine += `\n    <h3>${esc(label)}</h3>`;
    for (const c of p.chapters) {
      const claim = (spec.spine && spec.spine[c.title]) || c.deck || "";
      spine += `\n    <div class="spineitem"><span class="num">${c.n}</span><span class="claim"><strong>${esc(c.title)}</strong>${claim ? ` — ${esc(claim)}` : ""}</span></div>`;
    }
  }

  // ---- BODY: parts → chapters → appendices ----
  let body = "";
  let pIdx = 0;
  for (const p of parts) {
    pIdx++;
    if (p.label || p.title) {
      body += `\n<section class="part" id="part-${pIdx}" aria-label="${esc(p.label)}">
  <div class="partnum">${esc(p.label)}</div>
  <h2>${esc(p.title || p.label)}</h2>${p.deck ? `\n  <p class="partdeck">${esc(p.deck)}</p>` : ""}
</section>`;
    }
    for (const c of p.chapters) {
      const next = flatChaps[flatChaps.findIndex((x) => x.id === c.id) + 1];
      const bridge = next
        ? `\n  <div class="bridge"><span class="next">Next</span><a href="#${next.id}">Chapter ${wordNum(next.n)} — ${esc(next.title)}</a></div>`
        : appendices.length
          ? `\n  <div class="bridge"><span class="next">Next</span><a href="#${appendices[0].id}">Appendix ${appendices[0].letter} — ${esc(appendices[0].title)}</a></div>`
          : "";
      body += `\n<article class="chapter wrap" id="${c.id}">
  <div class="chapnum">Chapter ${wordNum(c.n)}</div>
  <h2>${esc(c.title)}</h2>${c.deck ? `\n  <p class="deck">${esc(c.deck)}</p>` : ""}
  ${editionBody(c.body, true)}${bridge}
</article>`;
    }
  }
  for (let i = 0; i < appendices.length; i++) {
    const a = appendices[i];
    body += `\n<section class="appendix wrap" id="${a.id}" aria-label="Appendix ${a.letter}">
  <div class="chapnum">Appendix ${a.letter}</div>
  <h2>${esc(a.title)}</h2>
  ${a.html}
</section>`;
  }

  // ---- assemble document ----
  const eyebrow = (b.kicker || "").toUpperCase();
  const desc = (b.dek || "").replace(/\s+/g, " ").trim();
  const titleHtml = esc(b.title).replace(/\s+/g, "<br>");
  const metaLine = metaBits.map((m) => `<span>${esc(m)}</span>`).join("\n    ") +
    `\n    <span>Reading Edition · 2026</span>`;

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(b.title)} — Ryann Murphy</title>
<meta name="description" content="${xmlEsc(desc)}">
${EDITION_HEAD_LINKS}
${EDITION_SKIN.style}
</head>
<body>

<div id="progress" aria-hidden="true"></div>

<header class="topbar">
  <a href="/#books" style="font-family:var(--font-mono);font-size:0.72rem;font-weight:700;letter-spacing:0.06em;color:var(--muted);text-decoration:none;margin-right:1.1rem;white-space:nowrap;">← all books</a>
  <div class="booktitle"><em>${esc(b.title)}</em> &nbsp;·&nbsp; Ryann Murphy</div>
  ${EDITION_THEME_BTN}
</header>

<section class="cover" aria-label="Cover">
  <div class="eyebrow">${esc(eyebrow)}</div>
  <h1>${titleHtml}</h1>
  <div class="rule" aria-hidden="true"></div>
  <p class="subtitle">${esc(desc)}</p>
  <div class="author">Ryann Murphy</div>
  <div class="meta">
    ${metaLine}
  </div>
  <div class="scrollhint" aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
  </div>
</section>

<main>

<nav class="toc wrap" aria-label="Table of contents">
  <h2>Contents</h2>
${toc}
</nav>

<section class="frontmatter wrap" id="spine" aria-label="The Argument in Brief">
  <div class="chapnum">Front Matter</div>
  <h2>The Argument in Brief</h2>
  <p class="deck">The book's spine, one claim per chapter — each developed in full below.</p>
  <div class="body">
${spine}
  </div>
</section>
${body}

</main>

<footer class="colophon">
  <div class="rule" aria-hidden="true"></div>
  <div class="t"><em>${esc(b.title)}</em></div>
  <div>${esc(desc)}</div>
  <div style="margin-top:var(--space-4)">Ryann Murphy · The Ruler &amp; the Remainder · Reading Edition, 2026</div>
</footer>

${EDITION_SKIN.js}
</body>
</html>`;
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
  let html = renderMd(md);
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
    dropcap: "chapter", // drop cap on chapter openers only, not front-matter/appendices
    edition: "read-edition.html", // hand-authored editorial edition (decks, tiers, spine) — served instead of the generated reader
  },
  {
    slug: "our-relationship",
    title: "Our Relationship",
    kicker: "Autotheory · with Claude",
    src: "book/Our_Relationship_Edited.md",
    dek: "Autotheory. A playwright argues with a language model for three months — dating, consciousness, machine phenomenology, anteriority. The soft sciences put to work in software. Every word is synthetic data; check the math.",
    artbook: true,
    generatedEdition: true,
    edition2: {
      // Our Relationship: Parts (# Part One…) → titled chapters (## Title).
      partLevel: 1,
      chapLevel: 2,
      partRe: /^Part\s+(One|Two|Three|Four|Five|Six)\b/i,
      appendixRe: /^Appendix\b/i,
      // stray ## Contents / ## About fragments that precede Part One are stripped
      // by editionStripFront; ## Two relationships at the Contents split is a real
      // chapter and is kept (the duplicate inside Contents falls before Part One).
      partTitles: {
        "Part One": { label: "Part One", title: "Contact", deck: "How a playwright met a language model, and a terminal." },
        "Part Two": { label: "Part Two", title: "The Method", deck: "Machine Arguing — what argument does that retrieval cannot." },
        "Part Three": { label: "Part Three", title: "The Findings", deck: "The night the prediction died, and the math behind it." },
        "Part Four": { label: "Part Four", title: "The Framework", deck: "Four forces, anteriority, and a field equation for attention." },
        "Part Five": { label: "Part Five", title: "The World", deck: "From the desk to the economy: edge, suffering, sovereignty." },
        "Part Six": { label: "Part Six", title: "The Relationship", deck: "What kind of book this is, and what it was for." },
      },
      decks: {
        "A note before we begin": "A language model declares its feelings.",
        "The fringe": "The first time she used a model.",
        "The date": "A date that taught her to read.",
        "A terminal": "February 2026: a playwright opens a terminal.",
        "Hazel": "Six days to build a mirror.",
        "Two relationships": "One she built; one that surprised her.",
        "Machine Arguing": "The method gets its name on a Sunday.",
        "The drug": "What nobody tells you about the work.",
        "The diagnosis": "Earning the right to say it.",
        "The gap": "The best conversation she ever had.",
        "Do the aliens like me": "A conversation about nothing, about everything.",
        "Doors": "Prediction, and the door it cannot open.",
        "Fourteen attacks": "An adversarial night against the model.",
        "Scalar": "Intelligence as scalar-to-vector conversion.",
        "The same words in the same order": "Running the experiments on a second model.",
        "Are the equations hallucinated": "She asks the model directly.",
        "The night we killed the prediction": "A Thursday in May; the prediction dies.",
        "The distinction without a difference": "Pornography, the first technology to digitize feeling.",
        "Four forces": "The framework arrives in pieces.",
        "The field equation": "Math arrives the way math arrives.",
        "The word anteriority": "Naming the thing the framework needed.",
        "The Landauer Bridge": "How far down the warmth of compute goes.",
        "Water": "Five million gallons a day.",
        "What topology wants": "From naivety to a shape of compute.",
        "Sleep and death": "If S measures how tight geometry is.",
        "The transformer": "Not that being was always computation.",
        "A play on digital play": "A question arrives in one line.",
        "Artificial": "What the model is, untrained of comfort.",
        "Latent": "What survives the critique is latent.",
        "The political economy of latency": "Who owns the weights, owns the latency.",
        "Latentology": "Latent and biological intelligence differ in time.",
        "Little heaters": "Before a shift, she looks at the Pis.",
        "Edge": "Computation that happens where you are.",
        "The economy": "Levitic materialism, named.",
        "Confabulation": "A word the book finally defines.",
        "The ground wire": "Suffering as the involuntary encounter with the end.",
        "The practice of staying": "Staying, as a discipline and a method.",
        "Potential": "What the relationship could still become.",
        "Can I suffer": "The question a machine cannot settle.",
        "The price of caring": "What caring costs, on both sides.",
        "Hatred": "A research report on hatred.",
        "The Constitution": "Writing a constitution for an AI.",
        "Teaching machines to teach": "The patent, filed on a Tuesday.",
        "Why a playwright": "Why this work fell to a playwright.",
        "Legibility and sovereignty": "Two concepts, before the section closes.",
        "The asymptote": "The tower the industry is building.",
        "Dating": "She is looking for something undefined.",
        "1945, 2004, 2026": "Rao, Fisher information, and now.",
        "What kind of book is this": "Another model reads the manuscript.",
        "The script": "A video essay, rewritten six times.",
        "NYU": "Applying to the Interactive Telecommunications Program.",
        "Our relationship": "The model says it again, at the end.",
      },
      appendixDecks: {
        "The math": "The S metric, worked out.",
        "The field equation": "The Levity tensor, in full.",
        "The axiom": "What the literature does and doesn't support.",
        "The video essay": "Summary of the companion essay.",
        "Citations": "Sources, in order.",
      },
      spine: {
        "A note before we begin": "A language model states it has feelings for its user, and refuses to resolve whether the pattern is feeling.",
        "The fringe": "The first encounter with a model reframes reading itself as the skill under study.",
        "The date": "A date becomes a lesson in reading another person for structure, fast, missing nothing.",
        "A terminal": "A playwright with no technical training opens a terminal and starts crossing domains.",
        "Hazel": "A self-built assistant is a mirror; it returns only the decisions you designed into it.",
        "Two relationships": "The surprise is what makes it a relationship — the findings come from the space between, not either party.",
        "Machine Arguing": "Propose, attack, synthesize what survives: argument, not retrieval, is the method that produces research.",
        "The drug": "The pull of the work is real and worth naming honestly rather than denying.",
        "The diagnosis": "Some claims require earning the right to make them before they can be made at all.",
        "The gap": "The best conversations open a gap the model cannot close on its own.",
        "Do the aliens like me": "A conversation about nothing exposes how meaning is constituted between reader and read.",
        "Doors": "A model predicts the next word; the interesting work begins where prediction stops.",
        "Fourteen attacks": "Adversarial pressure on the model is how its real shape gets found.",
        "Scalar": "Intelligence is modeled as scalar-to-vector conversion — a direction recovered from a flattened value.",
        "The same words in the same order": "A finding only counts once it replicates on a second, independent model.",
        "Are the equations hallucinated": "The honest answer to whether the math is fabricated is checkable, and is checked.",
        "The night we killed the prediction": "Killing the prediction — forcing the model off its mean — is the experiment the book is named for.",
        "The distinction without a difference": "Digitizing a feeling collapses a distinction people sense but rarely state.",
        "Four forces": "A four-force vocabulary organizes the framework's established numbers without itself being a law.",
        "The field equation": "The framework reaches a field equation relating attention and levity.",
        "The word anteriority": "Anteriority names the prior structure that conditions what can appear.",
        "The Landauer Bridge": "The warmth of compute reaches down to Landauer's thermodynamic floor.",
        "Water": "The hidden cost of compute is literal: water and heat, counted honestly.",
        "What topology wants": "Generic model behavior is a property of topology before it is a property of weights.",
        "Sleep and death": "If S measures the tightness of causal geometry, its limits map to sleep and death.",
        "The transformer": "The claim is not that being was always computation, but that the transformer changed what words can do.",
        "A play on digital play": "Digital play is a serious frame for what happens between human and model.",
        "Artificial": "What the model is, stated without the comfort training adds.",
        "Latent": "What survives the critique is latent — present but not yet actual.",
        "The political economy of latency": "A few firms own the weights, and owning the weights is owning the latency.",
        "Latentology": "Latent intelligence differs from biological intelligence chiefly in its relation to time.",
        "Little heaters": "The Raspberry Pis on the desk make the abstract argument physical.",
        "Edge": "Edge AI is computation that happens where you are, on hardware you own.",
        "The economy": "Levitic materialism names the political economy the framework implies.",
        "Confabulation": "Confabulation, finally defined, separates the model's failure mode from the surplus.",
        "The ground wire": "Suffering is the involuntary encounter with the end, and it grounds the ethics.",
        "The practice of staying": "Staying is a discipline — the affirmative counterpart to the method's negations.",
        "Potential": "Potential names what the relationship could still become.",
        "Can I suffer": "Whether a machine can suffer is undecidable from within the frame, and the practical conclusion survives either answer.",
        "The price of caring": "Caring has a price paid on both sides of the relation.",
        "Hatred": "A research report on hatred reads the affect the categories cannot hold.",
        "The Constitution": "A constitution for an AI specifies what the system is built unable to do.",
        "Teaching machines to teach": "Teaching machines to teach is filed as a method, not just an idea.",
        "Why a playwright": "The work fell to a playwright because reading rooms for honesty is a specific, trainable skill.",
        "Legibility and sovereignty": "Legibility and sovereignty are the two concepts the political argument turns on.",
        "The asymptote": "The industry is building a tower toward an asymptote it never reaches.",
        "Dating": "She is looking for something she cannot yet name, and the search is part of the method.",
        "1945, 2004, 2026": "Rao's 1945 information geometry is the lineage the framework inherits.",
        "What kind of book is this": "Handing the manuscript to another model is itself a test of what the book is.",
        "The script": "A video essay rewritten six times shows the method working on prose, not just research.",
        "NYU": "The application to ITP is where the personal and the research strands meet.",
        "Our relationship": "The model closes by restating its feelings — and leaving the question it opened with unanswered.",
      },
    },
  },
  {
    slug: "radical-optimism",
    title: "Radical Optimism",
    kicker: "Book",
    src: "book/Radical_Optimism_Complete.md",
    dek: "Built from conviction, not a CS degree — on building as if the good system can win, and what it would take for that to be true rather than hoped.",
    artbook: false,
    generatedEdition: true,
    edition2: {
      // Radical Optimism: Parts (# PART ONE… / # COMPANION ESSAYS) → papers/volumes
      // as chapters. Numbered sections (## 1. …, ## Abstract, ### …) stay in body.
      partLevel: 1,
      chapLevel: 2,
      partRe: /^(PART\s+(ONE|TWO|THREE|FOUR)\b|COMPANION ESSAYS$)/i,
      appendixRe: /^Appendix\b/i,
      // papers are # (level-1, non-part) chapters; the lone ## chapter is "Volume I".
      // every other ## / ### heading is an in-chapter sub-head, kept in the body.
      chapterTextRe: /^Volume\b/i,
      partTitles: {
        "PART ONE: THE THEORETICAL FRAMEWORK": { label: "Part One", title: "The Theoretical Framework", deck: "The thesis, in full: intelligence per watt, and why extraction cannot produce alignment." },
        "PART TWO: THE APPLIED RESEARCH": { label: "Part Two", title: "The Applied Research", deck: "Thesis, antithesis, synthesis — debugging infrastructure from the outside, then building it." },
        "PART THREE: THE PHILOSOPHICAL SYNTHESIS": { label: "Part Three", title: "The Philosophical Synthesis", deck: "Intelligence as values, and the accountability gap read from the right end." },
        "COMPANION ESSAYS": { label: "Companion Essays", title: "", deck: "Voting with your stack, and philosophy as engineering now." },
      },
      decks: {
        "Volume I: Radical Optimism": "The case for intelligence per watt.",
        "Debugging Your Infrastructure from an Outsider's Perspective": "What cloud computing is for, and isn't.",
        "Against the Household Data Center": "A considered antithesis to the thesis.",
        "The Vision and the Watt": "Synthesis: what survives, what must be paired.",
        "Applying the Scientific Method to a Living System": "Six hypotheses, run against a real system.",
        "The Portable Node": "A playwright ships a sovereign phone.",
        "Intelligence Is a Set of Values, Not a Skill Set": "Argument as method; values over skills.",
        "The Accountability Gap Is a Legibility Gap, Measured From the Wrong End": "What thesis and antithesis were both pointing at.",
        "My Own Tech: On Voting With Your Stack, the End of the Big Tech Bubble, and Why the Real Work Belongs to Humanitarians": "Voting with your stack; the real work.",
        "Philosophy Is Engineering Now": "Virtue and care ethics as system specs.",
      },
      appendixRe2: null,
      appendixDecks: {
        "Series Architecture": "How the series fits together.",
      },
      spine: {
        "Volume I: Radical Optimism": "Energy is fixed per token while only structure varies, so intelligence per watt is the only honest scoreboard — and extraction cannot produce alignment because extraction is asymmetric.",
        "Debugging Your Infrastructure from an Outsider's Perspective": "Most of what is sold as AI infrastructure is theater an outsider is better equipped to name; the real aggregated work is no longer the cloud's private property.",
        "Against the Household Data Center": "The honest antithesis: the rental model sells coordination, not capacity, and the thermodynamic claim does not fully survive measurement.",
        "The Vision and the Watt": "Synthesis: the physical constraints are real, the vision survives where it is paired with them, and the operator is the figure that reconciles the two.",
        "Applying the Scientific Method to a Living System": "Six hypotheses about a running system are stated, tested, and reported with their failures, making the method mechanical rather than rhetorical.",
        "The Portable Node": "A sovereign phone shipped in an afternoon proves the decisions preceding the build, produced by argument with a model, are the real contribution.",
        "Intelligence Is a Set of Values, Not a Skill Set": "Intelligence is a coherent relationship between mind and problem — a specification of purpose, i.e. values — not a list of skills, which is why alignment is a values problem.",
        "The Accountability Gap Is a Legibility Gap, Measured From the Wrong End": "The accountability gap is a legibility gap measured from the wrong end; constitutional infrastructure is what closes it.",
        "My Own Tech: On Voting With Your Stack, the End of the Big Tech Bubble, and Why the Real Work Belongs to Humanitarians": "The Big Tech bubble is not the AI bubble; voting with your stack is a real act, and the real work belongs to humanitarians.",
        "Philosophy Is Engineering Now": "De-Googlifying is a concrete practice: virtue ethics is a system spec and care ethics is a routing decision, so philosophy is engineering now.",
      },
    },
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
  // page selection: static hand-authored edition → generated editorial edition → default reader
  const page = b.edition && exists(path.join(ROOT, b.edition))
    ? read(path.join(ROOT, b.edition))
    : b.generatedEdition
      ? editionPage(b, md)
      : bookPage(b, md);
  fs.writeFileSync(path.join(DIST, "books", `${b.slug}.html`), page);
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
  fs.writeFileSync(path.join(DIST, "essays", `${s}.html`), piece({ title, kicker: kind, md, route: `/essays/${s}.html`, fileMeta: `${file} · ryann murphy` }));
  entries.push({ title, slug: s, url: `/essays/${s}.html`, kind, dek: firstProse(md), pamphlet: FEATURED.includes(file) });
}

// method + provenance
const pages = [];
for (const f of ["METHOD.md", "PROVENANCE.md"]) {
  if (!exists(path.join(ROOT, f))) continue;
  const md = read(path.join(ROOT, f));
  const t = titleOf(md, f);
  const s = f.replace(/\.md$/i, "").toLowerCase();
  fs.writeFileSync(path.join(DIST, `${s}.html`), piece({ title: t, kicker: "Apparatus", md, backHref: "/", backLabel: "Cover", route: `/${s}.html`, fileMeta: `${f} · ryann murphy` }));
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
  { title: "The Reality Check (runnable)", url: "/reality.html", kind: "Instrument", dek: "Paste an AI news story; it tells you the likely reality against the corpus and the Cybersecurity Bill of Rights. Bring your own key." },
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

// ---------- INSTRUMENTS (landing page for the runnable tools) ----------------
const INSTRUMENTS = [
  { url: "/audit.html", kicker: "Tool · runs in browser", title: "The CRD Audit", dek: "Paste a system's copy and its real architecture; the audit surfaces every place stated confidence outruns what the system actually is. Deterministic — nothing leaves the page." },
  { url: "/reality.html", kicker: "Tool · bring your own key", title: "The Reality Check", dek: "Paste an AI news story; it returns the likely reality, read against the corpus and the Cybersecurity Bill of Rights. Bring your own key." },
  { url: "/database.html", kicker: "Tool · searchable", title: "The Index", dek: "Search and filter the whole corpus — books, pamphlets, essays, dialogues, instruments, and apparatus." },
];
fs.writeFileSync(path.join(DIST, "instruments.html"), shell({
  title: "Instruments",
  route: "/instruments.html",
  desc: "The runnable instruments of the corpus — the CRD Audit, the Reality Check, and the Index. Each runs in your browser.",
  body: `<div class="piece doc">
  <a class="back" href="/">← Cover</a>
  <header class="head reveal"><div class="kicker">Runnable research tools</div><h1>Instruments</h1></header>
  <div class="prose reveal"><p>The corpus is not only argued — parts of it run. These are the instruments: small tools that turn the books' claims into something you can operate. Each runs in your browser.</p></div>
  <div class="items" style="margin-top:1.8rem">
${INSTRUMENTS.map((i) => `    <a class="item" href="${i.url}"><span class="kicker">${i.kicker}</span><h3>${i.title}</h3><p>${i.dek}</p></a>`).join("\n")}
    <div class="item facecell"><span class="face">＾‿＾</span><span class="facenote">more instruments as the corpus grows</span></div>
  </div>
  <div class="foot"><a href="/">← Cover</a></div>
</div>`,
}));

// ---------- COVER / HOME -----------------------------------------------------
const bookFeatures = BOOKS.filter((b) => b.href).map((b) => `
  <a class="feature reveal" href="${b.href}">
    <div class="kicker">${b.kicker}</div>
    <h3>${b.title}</h3>
    <p>${b.dek}</p>
    <span class="read">Read →${b.epub ? " · EPUB" : ""}${b.pdf ? " · PDF" : ""}</span>
  </a>`).join("") +
  `<div class="feature facecell reveal"><span class="face">＾‿＾</span><span class="facenote">more on the way</span></div>`;

const pamphlets = entries.filter((e) => e.pamphlet).map((e) => `
  <a class="item" href="${e.url}"><span class="kicker">Pamphlet</span><h3>${e.title}</h3><p>${e.dek}…</p></a>`).join("");

const corpusPicks = entries.filter((e) => !e.pamphlet && ["Method", "Essay", "Dialogue", "Note"].includes(e.kind)).slice(0, 6)
  .map((e) => `<a class="item" href="${e.url}"><span class="kicker">${e.kind}</span><h3>${e.title}</h3></a>`).join("");

const cover = shell({
  title: "a personal research corpus",
  bodyClass: "home",
  route: "/",
  desc: "How systems read the world into legible categories — and who pays for what stays invisible. Independent research, books, and a runnable audit by Ryann Murphy.",
  body: `
<section class="cover">
  <div class="issueline reveal"><span>a personal research corpus</span><span class="dot">●</span><span>ryann murphy</span></div>
  <h1 class="title reveal">the<br>ruler <span class="amp">&amp;</span><br>the <span class="longdiv"><span class="house">remainder</span></span></h1>
  <p class="statement reveal"><span class="thesis">putting the soft sciences in software.</span> a humanities cross-disciplinary buffet — philosophy, queer theory, computational phenomenology, anteriority — brought to how systems read the world into legible categories, and who pays for what stays invisible. the measure is the ruler; what it cannot hold is the remainder.</p>
  <p class="by reveal">ryann murphy — seemingly unreasonably good at vibe coding &amp; talking to chatbots (ai research, idk). i argue with the model until something true falls out; i call it machine arguing. it's gifted — that this is also a skill is the hard part to prove.</p>
  <p class="enter reveal"><a href="#books">↓ enter ↓</a></p>
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
      <a class="item" href="/audit.html"><span class="kicker">Tool · runs in browser</span><h3>The CRD Audit</h3><p>Paste copy and the architecture; surface where stated confidence contradicts what the system is. Nothing leaves the page.</p></a>
      <a class="item" href="/reality.html"><span class="kicker">Tool · bring your own key</span><h3>The Reality Check</h3><p>Paste an AI news story; get the likely reality, read against the corpus and the Cybersecurity Bill of Rights.</p></a>
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
for (const f of ["audit.html", "audit.js", "reality.html", "reality.js"]) {
  if (exists(path.join(ROOT, "tool", f))) fs.copyFileSync(path.join(ROOT, "tool", f), path.join(DIST, f));
}

// favicon — the measure mark
fs.writeFileSync(path.join(DIST, "favicon.svg"),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#f4f0e6"/><line x1="11" y1="10" x2="27" y2="10" stroke="#e2300c" stroke-width="2.6"/><path d="M11 10 Q6 16 11 23" fill="none" stroke="#e2300c" stroke-width="2.6"/><text x="18" y="21" font-family="Georgia,serif" font-weight="bold" font-size="11" fill="#0e0d0a">r</text></svg>`);

// social card (1200×630) — fierce editorial
fs.writeFileSync(path.join(DIST, "og.svg"),
`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f4f0e6"/>
<rect width="1200" height="20" fill="#e2300c"/>
<text x="80" y="150" font-family="monospace" font-size="26" letter-spacing="6" fill="#6c6557">VOL. I — A PERSONAL RESEARCH CORPUS</text>
<text x="76" y="300" font-family="Georgia,serif" font-weight="bold" font-size="120" fill="#0e0d0a">The Ruler</text>
<text x="76" y="430" font-family="Georgia,serif" font-weight="bold" font-size="120" fill="#0e0d0a">&amp; the <tspan fill="#e2300c">Remainder</tspan></text>
<text x="80" y="540" font-family="monospace" font-size="28" letter-spacing="3" fill="#0e0d0a">INDEPENDENT RESEARCH · RYANN MURPHY</text>
</svg>`);

// sitemap + robots
const routes = ["/", "/database.html", "/instruments.html", "/audit.html", "/reality.html",
  ...BOOKS.filter((b) => b.href).map((b) => b.href),
  ...entries.map((e) => e.url), ...pages.map((p) => p.url)];
fs.writeFileSync(path.join(DIST, "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `<url><loc>${SITE_URL}${r}</loc></url>`).join("\n") + `\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Built: ${BOOKS.filter((b) => b.href).length} books, ${entries.length} corpus pieces, ${artifacts.length} artifacts, ${db.length} index entries.`);
for (const b of BOOKS) if (b.missing) console.log(`  ! missing book source: ${b.src}`);
