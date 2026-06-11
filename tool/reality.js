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
        const card = document.createElement("button");
        card.className = "feeditem";
        card.innerHTML =
          `<span class="src">${it.image ? `<img src="${it.image}" alt="" loading="lazy">` : ""}${esc(it.source || it.domain || "news")}</span>` +
          `<h4>${esc(it.title)}</h4>` +
          `<span class="when">${when(it.date)}</span>`;
        card.addEventListener("click", () => {
          selectedSource = it.source || it.domain || null;
          storyEl.value = it.title + (it.summary ? "\n\n" + it.summary : "") + (selectedSource ? `\n\n(source: ${selectedSource})` : "");
          storyEl.scrollIntoView({ behavior: "smooth", block: "center" });
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
  runBtn.addEventListener("click", async () => {
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
      out.innerHTML =
        `<div class="reality">${mdToHtml(data.text)}</div>` +
        `<p class="discipline">this is a model's read, not a verdict. it surfaces where confidence outruns reality and which rights are in play — you still check the math. ${note}</p>`;
      if (data.published) loadLedger();
    } catch (err) {
      out.innerHTML = `<div class="verdict v-fires"><strong>could not reach the instrument</strong><span>${esc(String(err))}</span></div><p class="empty">network error — try again in a moment.</p>`;
    } finally {
      runBtn.disabled = false; runBtn.textContent = "run the reality check";
    }
  });
});
