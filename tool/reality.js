// The Reality Check — reads an AI news story and tells you the likely reality,
// using the corpus's method (confidence–reality divergence, the three tiers,
// the remainder) and the Cybersecurity Bill of Rights.
//
// The reading runs server-side at /api/reality — no key from the reader. The
// method (the system prompt) lives on the server now, not here. Each check is
// rate-limited and, unless the reader opts out, written to a public ledger
// surfaced below via /api/checks. Data leaves consciously: running a check is
// the opt-in, every time.

const $ = (id) => document.getElementById(id);

// ---- tiny markdown renderer (headings, bold, bullets, paragraphs) -----------
function esc(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "", inList = false;
  const inline = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(established|exploratory|speculative|unverifiable)\]/gi, '<span class="tierflag t-$1">$1</span>');
  for (let raw of lines) {
    const l = raw.trim();
    if (!l) { if (inList) { html += "</ul>"; inList = false; } continue; }
    if (l.startsWith("## ")) { if (inList) { html += "</ul>"; inList = false; } html += `<h3>${inline(l.slice(3))}</h3>`; }
    else if (l.startsWith("- ") || l.startsWith("• ")) { if (!inList) { html += "<ul>"; inList = true; } html += `<li>${inline(l.slice(2))}</li>`; }
    else { if (inList) { html += "</ul>"; inList = false; } html += `<p>${inline(l)}</p>`; }
  }
  if (inList) html += "</ul>";
  return html;
}

function when(d) {
  const t = Date.parse(d); if (!t) return "";
  const h = Math.round((Date.now() - t) / 36e5);
  if (h < 1) return "just now"; if (h < 24) return h + "h ago";
  const dd = Math.round(h / 24); return dd + "d ago";
}

// ---- composed marks: the long-division grammar, one per card ---------------
// Deterministic from a seed (a source, a story) so the same subject always
// draws the same mark. Built only from the corpus's own elements — the divisor
// bar + bracket (the ruler's red), a measured tick row, and the remainder (the
// teal leftover). No photographs, no slop; a composed plate per card.
function hashSeed(s) {
  let h = 2166136261 >>> 0;
  s = String(s || "r");
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function markSVG(seed) {
  const rnd = prng(hashSeed(seed));
  const W = 120, H = 64;
  const ink = "#0e0d0a", measure = "#e2300c", remainder = "#2f4a47", faint = "#a9a18b";
  const initial = (String(seed || "r").match(/[a-z]/i) || ["r"])[0].toLowerCase();

  const bx = 22, by = 18 + Math.round(rnd() * 6);     // long-division bracket origin
  const barW = 60 + Math.round(rnd() * 16);           // dividend bar length
  const depth = 5 + Math.round(rnd() * 5);            // bracket curve depth

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`;
  // the divisor bar + the bracket curve hugging under it — the ÷ of the favicon
  s += `<line x1="${bx}" y1="${by}" x2="${bx + barW}" y2="${by}" stroke="${measure}" stroke-width="2.4"/>`;
  s += `<path d="M${bx} ${by} Q${bx - depth} ${by + 13} ${bx} ${by + 26}" fill="none" stroke="${measure}" stroke-width="2.4"/>`;
  // the dividend's initial, serif, like the favicon's r
  s += `<text x="${bx + 9}" y="${by + 20}" font-family="Newsreader,Georgia,serif" font-weight="700" font-size="20" fill="${ink}">${esc(initial)}</text>`;
  // the quotient — a few small marks above the bar
  const q = 2 + Math.floor(rnd() * 3);
  for (let i = 0; i < q; i++) {
    const qx = bx + 8 + i * (10 + Math.round(rnd() * 6));
    s += `<line x1="${qx}" y1="${by - 9}" x2="${qx}" y2="${by - 4}" stroke="${remainder}" stroke-width="1.6"/>`;
  }
  // the ruler — a measured tick row along the bottom
  const ticks = 9 + Math.floor(rnd() * 7);
  const x0 = 12, x1 = W - 16, gap = (x1 - x0) / ticks, baseY = H - 8;
  for (let i = 0; i <= ticks; i++) {
    const tx = (x0 + i * gap).toFixed(1);
    const tall = i % 4 === 0;
    s += `<line x1="${tx}" y1="${baseY}" x2="${tx}" y2="${(baseY - (tall ? 8 : 4)).toFixed(1)}" stroke="${tall ? ink : faint}" stroke-width="${tall ? 1.4 : 1}"/>`;
  }
  // the remainder — the teal leftover the ruler can't divide cleanly
  const rem = (x0 + (ticks - 1 - Math.floor(rnd() * 2)) * gap).toFixed(1);
  s += `<rect x="${rem}" y="${baseY - 4}" width="5" height="5" fill="${remainder}"/>`;
  s += `</svg>`;
  return s;
}

const EXAMPLE = `New AI security platform launches with "100% protection against prompt injection." The startup says its deterministic engine blocks every attack before it reaches your model, with a tamper-proof audit log and military-grade encryption. Backed by $40M, it claims to be the first to make enterprise AI "fully secure."`;

window.addEventListener("DOMContentLoaded", () => {
  const storyEl = $("story"), out = $("out"), runBtn = $("run"), modelEl = $("model"), publishEl = $("publish");

  // The source of the currently-loaded story (so the ledger can credit it).
  let selectedSource = null;

  $("loadex").addEventListener("click", () => {
    storyEl.value = EXAMPLE; selectedSource = null;
    storyEl.scrollIntoView({ behavior: "smooth", block: "center" }); storyEl.focus();
  });
  storyEl.addEventListener("input", () => { selectedSource = null; });

  // ---- live AI news feed (from /api/feed) ----
  async function loadFeed() {
    const feed = $("feed");
    feed.innerHTML = `<p class="empty" style="grid-column:1/-1">loading the feed…</p>`;
    try {
      const r = await fetch("/api/feed");
      const data = await r.json();
      const items = data.items || [];
      if (!items.length) { feed.innerHTML = `<p class="empty" style="grid-column:1/-1">no stories right now — paste your own below.</p>`; return; }
      feed.innerHTML = "";
      items.forEach((it) => {
        const card = document.createElement("article");
        card.className = "feeditem";
        const mark = markSVG(it.source || it.domain || it.title);
        const media = it.image ? `<img src="${esc(it.image)}" alt="" loading="lazy">` : mark;
        card.innerHTML =
          `<div class="cardmark">${media}</div>` +
          `<span class="src">${esc(it.source || it.domain || "news")}</span>` +
          `<h4>${esc(it.title)}</h4>` +
          `<span class="when">${when(it.date)}</span>` +
          `<div class="cardbtns">` +
            `<button class="mini runmini">run the reality check</button>` +
            (it.link ? `<a class="mini" href="${esc(it.link)}" target="_blank" rel="noopener noreferrer">read the article ↗</a>` : "") +
          `</div>`;
        // a broken/blocked article image falls back to the composed mark
        const img = card.querySelector(".cardmark img");
        if (img) img.addEventListener("error", () => { card.querySelector(".cardmark").innerHTML = mark; });
        // "run the reality check" — load this story and run it
        card.querySelector(".runmini").addEventListener("click", () => {
          selectedSource = it.source || it.domain || null;
          storyEl.value = it.title + (it.summary ? "\n\n" + it.summary : "") + (selectedSource ? `\n\n(source: ${selectedSource})` : "");
          runCheck();
          out.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        feed.appendChild(card);
      });
    } catch (e) {
      feed.innerHTML = `<p class="empty" style="grid-column:1/-1">couldn't load the feed (${esc(String(e))}). paste your own story below.</p>`;
    }
  }
  $("reload").addEventListener("click", loadFeed);
  loadFeed();

  // ---- the public ledger (from /api/checks) ----
  async function loadLedger() {
    const list = $("ledgerlist");
    list.innerHTML = `<p class="empty" style="grid-column:1/-1">loading the ledger…</p>`;
    try {
      const r = await fetch("/api/checks?limit=24");
      const data = await r.json();
      const items = data.items || [];
      if (!items.length) {
        list.innerHTML = `<p class="empty" style="grid-column:1/-1">no checks on the ledger yet — run the first one.</p>`;
        return;
      }
      list.innerHTML = "";
      items.forEach((it) => {
        const card = document.createElement("article");
        card.className = "ledgeritem";
        card.innerHTML =
          `<div class="cardmark">${markSVG(it.source || it.story || String(it.id))}</div>` +
          `<div class="lmeta"><span class="lsrc">${esc(it.source || "pasted")}</span><span class="when">${when(it.at)}</span></div>` +
          `<p class="lstory">${esc(it.story)}</p>` +
          `<p class="lverdict">${esc(it.verdict)}</p>`;
        list.appendChild(card);
      });
    } catch (e) {
      list.innerHTML = `<p class="empty" style="grid-column:1/-1">couldn't load the ledger right now.</p>`;
    }
  }
  $("reloadledger").addEventListener("click", loadLedger);
  loadLedger();

  // ---- run the check (server-side at /api/reality) ----
  runBtn.addEventListener("click", runCheck);
  async function runCheck() {
    const story = storyEl.value.trim();
    if (!story) { out.innerHTML = `<p class="empty">paste an ai news story above, then run the check.</p>`; return; }

    runBtn.disabled = true; runBtn.textContent = "reading…";
    out.innerHTML = `<p class="empty">reading the story against the corpus and the bill of rights…</p>`;
    try {
      const res = await fetch("/api/reality", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          story,
          model: modelEl.value,
          source: selectedSource,
          publish: publishEl.checked,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.error || `${res.status} ${res.statusText}`;
        out.innerHTML = `<div class="verdict v-fires"><strong>not this time</strong><span>${esc(msg)}</span></div>`;
        return;
      }
      const note = data.published
        ? "this reading is on the public ledger below."
        : "you kept this reading off the ledger; it was not stored.";
      const g = data.grounding || {};
      const gbits = [];
      if (g.sources) gbits.push(`grounded in ${g.sources} live source${g.sources > 1 ? "s" : ""}`);
      if (g.searched) gbits.push("cross-checked with a web search");
      const gnote = gbits.length ? gbits.join(" · ") + ". " : "";
      out.innerHTML =
        `<div class="cardmark verdictmark">${markSVG(story.slice(0, 80))}</div>` +
        `<div class="reality">${mdToHtml(data.text)}</div>` +
        `<p class="discipline">this is a model's read, not a verdict. it surfaces where confidence outruns reality and which rights are in play — you still check the math. ${gnote}${note}</p>`;
      if (data.published) loadLedger();
    } catch (err) {
      out.innerHTML = `<div class="verdict v-fires"><strong>could not reach the instrument</strong><span>${esc(String(err))}</span></div><p class="empty">network error — try again in a moment.</p>`;
    } finally {
      runBtn.disabled = false; runBtn.textContent = "run the reality check";
    }
  }
});
