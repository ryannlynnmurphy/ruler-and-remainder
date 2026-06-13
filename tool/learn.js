// The Walk — a web-app game. Duolingo for the whole corpus: one idea per screen,
// made legible (not dumbed down), the dramaturg as the guide. The final screen
// hands you to the live dramaturg (brain: /api/argue — not modified here).

const $ = (id) => document.getElementById(id);
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function fmt(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>"); }
function modelLabel(m) { return !m ? "" : m.includes("haiku") ? "haiku" : m.includes("opus") ? "opus" : m.includes("sonnet") ? "sonnet" : m; }
// legibility: say plainly why a turn went where it did. the router is the method
// made visible — light turns stay quiet so the note never clutters small talk.
function routeWhy(r) {
  if (!r || !r.tier) return "";
  if (r.tier === "browser") return "answered in your browser — nothing left this page";
  if (r.tier === "local") return "answered on the local model — no cloud call";
  if (r.by === "local-fallback") return "the local model couldn't take it — escalated to the cloud";
  if (r.by === "explicit") return "you chose this model";
  const dev = r.by === "client" ? " (routed on your device)" : "";
  if (r.tier === "heavy") return "routed up to the strongest model — this called for hard reasoning" + dev;
  if (r.tier === "medium") return "routed to the middle model — a real question worth reasoning about" + dev;
  if (r.tier === "light" && dev) return "kept light — a simple turn, decided on your device";
  return "";
}
// receipts: the corpus passages and web pages the answer actually stood on.
function sourcesBlock(s) {
  if (!s) return "";
  const corpus = (s.corpus || []).map((t) => `<li><a href="/corpus" target="_blank" rel="noopener">${esc(t)}</a><span class="src-k">corpus</span></li>`);
  const web = (s.web || []).map((w) => `<li><a href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.title || w.url)}</a><span class="src-k">web</span></li>`);
  const items = corpus.concat(web).join("");
  if (!items) return "";
  const n = (s.corpus ? s.corpus.length : 0) + (s.web ? s.web.length : 0);
  return `<details class="sources"><summary>sources · ${n}</summary><ul>${items}</ul></details>`;
}
function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "", listType = null, inQuote = false;
  const inline = (t) => esc(t)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // links Dorothy writes when she web_searches — open out, never trap the reader in the iframe
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\[(established|exploratory|speculative|unverifiable)\]/gi, '<span class="tierflag t-$1">$1</span>');
  const closeList = () => { if (listType) { html += `</${listType}>`; listType = null; } };
  const closeQuote = () => { if (inQuote) { html += "</blockquote>"; inQuote = false; } };
  for (const raw of lines) {
    const l = raw.trim();
    let m;
    if (!l) { closeList(); closeQuote(); continue; }
    if (l.startsWith("## ")) { closeList(); closeQuote(); html += `<h3>${inline(l.slice(3))}</h3>`; }
    else if (l.startsWith("> ")) { closeList(); if (!inQuote) { html += "<blockquote>"; inQuote = true; } html += `<p>${inline(l.slice(2))}</p>`; }
    else if ((m = l.match(/^(\d+)\.\s+(.*)/))) { closeQuote(); if (listType !== "ol") { closeList(); html += "<ol>"; listType = "ol"; } html += `<li>${inline(m[2])}</li>`; }
    else if (l.startsWith("- ") || l.startsWith("• ") || l.startsWith("— ")) { closeQuote(); if (listType !== "ul") { closeList(); html += "<ul>"; listType = "ul"; } html += `<li>${inline(l.slice(2))}</li>`; }
    else { closeList(); closeQuote(); html += `<p>${inline(l)}</p>`; }
  }
  closeList(); closeQuote();
  return html;
}

const UNITS = [
  { n: "01", title: "what this actually is", screens: [
    { big: "let's be real for a second.", body: ["everybody out here is selling you AI like it's either pure magic or the end of the world.", "it's neither. it's a machine that read almost the whole internet and learned to guess what comes next.", "that's the trick. the rest of this is about what to *do* with it."] },
    { big: "what's it good for? real things.", body: ["the work you used to need a team, a budget, or a degree to touch — writing, building, researching, arguing it all the way out.", "used right, it puts that in *anybody's* hands.", "that part is real and it is enormous, and i will not let anybody shame you out of using it."] },
    { big: "now the part the salesmen skip.", body: ["it is confidently, gorgeously **wrong** — all the time, with a straight face.", "and it was built by a few rich companies, trained on everybody's work, to serve whoever signs the check.", "some folks it serves beautifully. some folks it does not see at all."] },
    { big: "and that gap is the whole point.", body: ["whoever's holding the tool decides what counts. that's the **ruler**.", "what the ruler can't measure doesn't disappear — it's the **remainder**, and it always lands on *somebody*.", "so this has exactly one job: teach you to use the tool without ending up as the remainder."] },
  ] },
  { n: "02", title: "rung one — vibe coding", screens: [
    { big: "you can build things now. for real.", body: ["not the old way — years of memorizing code in a dark little room.", "you tell the machine what you want, in plain words, and you steer it till it works.", "that's **vibe coding**. i built this whole thing that way, and i'll teach you how."] },
    { big: "the catch — and there's always a catch.", body: ["it will hand you something broken and swear up and down it's perfect.", "vibe coding is *not* 'the machine does it for me.' it's you, hands on the wheel — testing, correcting, refusing the first wrong thing it gives you.", "the skill was never the typing. the skill is not getting played."] },
  ] },
  { n: "03", title: "rung two — vibe research", screens: [
    { big: "now point that same move at ideas.", body: ["not building — *thinking*. crossing between fields — money, power, history, how the thing really works — faster than any one degree was ever going to let you.", "that's **vibe research**. it's how a regular person gets dangerous."] },
    { big: "but it'll tell you exactly what you want to hear.", body: ["a machine trained to please you will flatter you straight into believing nonsense.", "so vibe research is *not* 'ask it and trust it.' it's: take what it told you back out into the real world, and **check**.", "curiosity — with receipts."] },
  ] },
  { n: "04", title: "masters level — machine arguing", screens: [
    { big: "here's the one most people never reach.", body: ["you quit asking the machine for answers like it's some oracle.", "you **argue** with it. you push, it pushes back, you both get sharper — until something *true* falls out the bottom.", "that's **machine arguing**. that's the masters degree, and it's the whole game."] },
    { big: "and arguing runs on one rule.", body: ["people sound more sure than they've earned the right to be. machines are worse.", "the distance between how sure a thing *sounds* and how sure it has any *right* to be — that, right there, is where every lie you've ever been sold was hiding."] },
    { k: "tiers", big: "so you put a label on every claim.", body: [] },
    { big: "and never let a vibe wear a fact's good coat.", body: ["'unbreakable.' '100% secure.' 'it just *gets* you.'", "that's a red painted up to pass for a green. catch that one swap, and the whole spell breaks.", "do this enough times and nobody can sell you anything again."] },
  ] },
  { n: "05", title: "now it's you", screens: [
    { big: "so that's the ladder.", body: ["build with it. think with it. argue with it.", "and don't you *ever* mistake a confident machine for an honest one."] },
    { big: "and there are three books.", book: true, body: ["**Narrative Intelligence** — the stories we tell about what AI *is* quietly become the rules the rest of us live under.", "**Our Relationship** — three months of thinking with a machine, treated as data, not a diary.", "**Radical Optimism** — a better future isn't a thing you wish for. it's a thing you *build*. here's the blueprint."] },
    { k: "final", big: "now. start arguing.", body: ["bring me a question, a headline you don't trust, or something you're pretty sure you believe.", "i'll find what's true in it, make it specific, show you exactly where it overreaches, and hand it back sharper than you brought it.", "that's machine arguing. and the pen stays right there in your hand."] },
  ] },
];

// flatten the units into one continuous run of screens (no chapter-card
// interstitials — the walk is kept short; the voice and the ladder are intact)
const screens = [];
UNITS.forEach((u) => {
  u.screens.forEach((s) => screens.push(Object.assign({ unit: u.n }, s)));
});

const OPENING = `you made it through — so let's do the real thing. bring me a claim, a worry, a headline you don't trust, and i'll run it: find what's true, make it specific, show you where it overreaches, hand it back sharper. start wherever you want.`;
// the empty-state example questions — outcome-shaped, in Dorothy's voice
const EXAMPLES = [
  "Explain what AI is actually good at — like I'm new to this.",
  "Where does AI lie, and how do I catch it before it costs me?",
  "What's a context window, and why does AI forget what I said?",
  "What's happening in AI news this week? Search the web.",
];

// the dramaturg's tools. most render right here in the conversation (send/fill);
// the last two open a deeper page for when you explicitly want that surface.
const TOOLS = [
  { label: "today's AI news", news: true },
  { label: "read a headline through the corpus", fill: "read this through the corpus and tier it: " },
  { label: "argue a claim i believe", fill: "here's something i'm pretty sure i believe — argue it with me: " },
  { label: "CRD audit — confidence vs reality ↗", nav: "/audit.html" },
  { label: "reality check — anti-hype ↗", nav: "/reality.html" },
  { label: "the index — search the corpus ↗", nav: "/database.html" },
  { label: "the lens — focused reading ↗", nav: "/lens.html" },
  { label: "the studio — work with documents ↗", nav: "/studio.html" },
];

function bootLearn() {
  const stage = $("stage"), cont = $("cont"), back = $("back"), pbar = $("pbar"), mascot = $("mascot");
  const pandora = document.body.classList.contains("pandora");
  let idx = 0;
  // Three ways in:
  //  body.pandora — unified Pandora shell on dramaturg.html: walk + chat, no redirect.
  //  ?chat=1      — legacy iframe embed: chat only.
  //  ?walk=1      — replay: always start the walk from the top.
  //  default      — index.html: walk once, then dramaturg.
  let chatOnly = false, replay = false;
  try {
    chatOnly = pandora || /[?&]chat=1\b/.test(location.search);
    replay = /[?&]walk=1\b/.test(location.search);
  } catch {}
  if (pandora) {
    document.body.classList.add("chatonly");
    if (replay) idx = 0;
    else {
      try {
        if (localStorage.getItem("rr_walk_complete")) {
          idx = screens.length - 1;
          if (window.Pandora) { Pandora.unlock("chat", false); Pandora.checkUsage({ walkComplete: true, messages: countUserMessages() }); }
        }
      } catch {}
    }
  } else if (chatOnly) {
    document.body.classList.add("chatonly");
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    idx = screens.length - 1;
  } else if (replay) { idx = 0; }
  else { try { if (localStorage.getItem("rr_walk_complete")) { location.replace("/dramaturg.html"); return; } } catch {} }
  let chatMessages = null; // persists across re-renders of the final screen
  let nidSeq = 0;          // stable ids for tool panels (e.g. the news feed) across redraws
  let sessionId = null;    // the current conversation's id (saved history)
  let redrawChat = () => {}; // set to the live chat's draw() once it mounts

  // --- conversation history, in localStorage (shared with the workspace shell) ---
  const SKEY = "rr_sessions";
  const readSessions = () => { try { return JSON.parse(localStorage.getItem(SKEY) || "[]"); } catch { return []; } };
  const writeSessions = (a) => { try { localStorage.setItem(SKEY, JSON.stringify(a.slice(0, 24))); } catch {} };
  const newId = () => "s" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
  const notifyShell = () => {
    try { window.dispatchEvent(new Event("rr-sessions")); } catch {}
    try { if (window.parent !== window) window.parent.postMessage({ type: "rr-sessions" }, "*"); } catch {}
  };
  function countUserMessages() {
    let n = 0;
    try {
      const ss = readSessions();
      for (const s of ss) for (const m of s.messages || []) if (m.role === "user") n++;
    } catch {}
    return n;
  }
  function syncPandoraUsage() {
    if (!window.Pandora) return;
    Pandora.checkUsage({ walkComplete: !!localStorage.getItem("rr_walk_complete"), messages: countUserMessages() });
  }
  function wsEmit(type, detail) {
    try { window.dispatchEvent(new CustomEvent("rr-workstation", { detail: { type, ...(detail || {}) } })); } catch {}
  }
  function updatePandoraPanels(lastUser, lastAsst) {
    if (!window.Pandora) return;
    const list = document.getElementById("source-list");
    if (list && lastAsst && lastAsst.sources) {
      const corpus = lastAsst.sources.corpus || [];
      const web = lastAsst.sources.web || [];
      const items = corpus.map((t) => `<li><a href="/corpus">${esc(t)}</a><span class="src-tag">corpus</span></li>`)
        .concat(web.map((w) => `<li><a href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.title || w.url)}</a><span class="src-tag">web</span></li>`));
      if (items.length) { list.innerHTML = items.join(""); Pandora.unlock("retrieval", false); }
    }
  }
  function persistChat() {
    if (!sessionId || !chatMessages) return;
    const msgs = chatMessages.filter((m) => !m.pending).map((m) => (m.image ? { ...m, image: null } : m)); // don't bloat storage with base64
    const firstUser = msgs.find((m) => m.role === "user");
    if (!firstUser) return; // nothing worth saving until they've spoken
    const rest = readSessions().filter((s) => s.id !== sessionId);
    rest.unshift({ id: sessionId, title: (firstUser.content || "conversation").slice(0, 64), updatedAt: Date.now(), messages: msgs });
    writeSessions(rest); notifyShell(); syncPandoraUsage();
  }
  function newChat() { sessionId = newId(); chatMessages = [{ role: "assistant", content: OPENING }]; redrawChat(); notifyShell(); }
  function loadChat(id) { const s = readSessions().find((x) => x.id === id); if (!s) return; sessionId = id; chatMessages = (s.messages || []).slice(); redrawChat(); }
  // the workspace shell drives history: new chat / open a past one
  window.addEventListener("message", (e) => {
    const d = e.data || {};
    if (d.type === "rr-new") newChat();
    else if (d.type === "rr-load" && d.id) loadChat(d.id);
    else if (d.type === "rr-deleted" && d.id === sessionId) newChat();
  });
  window.addEventListener("rr-shell", (e) => {
    const d = e.detail || {};
    if (d.type === "rr-new") newChat();
    else if (d.type === "rr-load" && d.id) loadChat(d.id);
    else if (d.type === "rr-deleted" && d.id === sessionId) newChat();
  });

  function tile(cls, name, desc) {
    return `<div class="tile ${cls}"><span class="dot"></span><b>${name}</b><p>${desc}</p></div>`;
  }

  function render() {
    const s = screens[idx];
    let html;
    if (s.k === "unit") {
      html = `<div class="screen unit-screen"><div class="unit-no">${esc(s.n)}</div><h2 class="unit-title">${esc(s.title)}</h2></div>`;
    } else if (s.k === "tiers") {
      html = `<div class="screen"><h1 class="big">${fmt(s.big)}</h1>` +
        `<p class="line sub">three colors. never mix them up.</p>` +
        `<div class="tiers">` +
        tile("g", "green", "you can check it. right now.") +
        tile("y", "yellow", "maybe. nobody has tested it yet.") +
        tile("r", "red", "honestly? just a vibe.") +
        `</div></div>`;
    } else if (s.k === "final") {
      if (!document.body.classList.contains("chatonly")) {
        try { localStorage.setItem("rr_walk_complete", "1"); } catch {}
        location.href = "/dramaturg.html";
        return;
      }
      if (pandora) {
        try { localStorage.setItem("rr_walk_complete", "1"); } catch {}
        if (window.Pandora) Pandora.unlock("chat");
        const walkEl = document.getElementById("walk-chamber");
        if (walkEl) walkEl.classList.add("is-sealed");
        if (cont) cont.style.display = "none";
        if (pbar) pbar.style.width = "100%";
        mountChat();
        return;
      }
      html = `<div class="screen final-screen"><h1 class="big">${fmt(s.big)}</h1>` +
        s.body.map((l) => `<p class="line">${fmt(l)}</p>`).join("") +
        `<div id="greet" class="greet" hidden></div>` +
        `<div id="log" class="log" role="log" aria-live="polite"></div><div id="chips" class="chips"></div>` +
        `<div class="toolsrow"><button id="toolsbtn" class="toolsbtn" type="button" aria-expanded="false">⊕ tools</button><div id="toolspanel" class="toolspanel" hidden></div></div>` +
        `<div id="attach" class="attach" hidden></div>` +
        `<div class="sayrow"><button id="clip" class="clip" type="button" aria-label="attach an image" title="attach an image">+ image</button><textarea id="say" rows="2" aria-label="message to dorothy" placeholder="bring the dramaturg a claim, a worry, a headline…"></textarea><button id="send" class="run" aria-label="send">send</button><input id="file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden></div>` +
        `</div>`;
    } else {
      html = `<div class="screen"><h1 class="big${s.book ? " book" : ""}">${fmt(s.big)}</h1>` +
        s.body.map((l) => `<p class="line">${fmt(l)}</p>`).join("") + `</div>`;
    }
    if (!stage) return;
    stage.innerHTML = html;

    // staggered reveal
    if (stage) {
      [...stage.querySelectorAll(".big, .line, .unit-no, .unit-title, .tile")].forEach((el, i) => {
        el.style.animationDelay = i * 85 + "ms";
        el.classList.add("rin");
      });
    }
    if (mascot) { mascot.classList.remove("talk"); void mascot.offsetWidth; mascot.classList.add("talk"); }

    const rp = $("replay");
    if (rp) rp.addEventListener("click", (e) => { e.preventDefault(); idx = 0; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });

    if (pbar) pbar.style.width = (100 * idx / (screens.length - 1)) + "%";
    if (back) back.style.visibility = idx === 0 ? "hidden" : "visible";
    if (s.k === "final") {
      if (cont) cont.style.display = "none";
      try { localStorage.setItem("rr_walk_complete", "1"); } catch {}
      mountChat();
    }
    else {
      if (cont) {
        cont.style.display = "";
        const next = screens[idx + 1];
        cont.textContent = idx === 0 ? "begin" : (next && next.k === "unit" ? "next unit →" : "continue");
      }
    }
  }

  function go(d) {
    const n = idx + d;
    if (n < 0 || n >= screens.length) return;
    idx = n; render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (cont) cont.addEventListener("click", () => go(1));
  if (back) back.addEventListener("click", () => go(-1));
  document.addEventListener("keydown", (e) => {
    if (document.activeElement && document.activeElement.id === "say") return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  });

  // ---- the live dramaturg, on the final screen ----
  let chatMounted = false;
  function mountChat() {
    const log = $("log"), sayEl = $("say"), sendBtn = $("send"), chips = $("chips");
    if (!log || chatMounted) return;
    chatMounted = true;
    if (!chatMessages) chatMessages = [{ role: "assistant", content: OPENING }];
    if (!sessionId) sessionId = newId();

    function newsCard(it, nid, i) {
      const img = it.image ? `<div class="nc-img" style="background-image:url('${esc(it.image)}')"></div>` : "";
      const read = it.reading_pending
        ? `<p class="thinking">reading the real story…</p>`
        : it.reading ? `<div class="reality nc-read">${mdToHtml(it.reading)}</div>` : "";
      const btn = (it.reading || it.reading_pending) ? ""
        : `<button class="nc-btn" type="button" data-msg="${nid}" data-news="${i}">read the real story</button>`;
      const link = it.link ? `<a class="nc-link" href="${esc(it.link)}" target="_blank" rel="noopener">the article ↗</a>` : "";
      return `<div class="newscard">${img}<div class="nc-body">` +
        (it.source ? `<span class="nc-src">${esc(it.source)}</span>` : "") +
        `<h4 class="nc-title">${esc(it.title)}</h4>` +
        (it.summary ? `<p class="nc-sum">${esc(it.summary)}</p>` : "") +
        `<div class="nc-actions">${btn}${link}</div>${read}</div></div>`;
    }

    function bubble(m, i) {
      if (m.role === "user") return `<div class="turn you"><span class="who">you</span>${m.image && m.image.url ? `<img class="uimg" src="${esc(m.image.url)}" alt="attached image">` : ""}<div class="ubody">${esc(m.content)}</div></div>`;
      if (m.role === "system") return `<div class="turn system"><span class="who">${esc(m.agent || "system")}</span><div class="sysbody${m.tool ? " tool" : ""}">${esc(m.content)}</div></div>`;
      if (m.kind === "news") {
        let inner;
        if (m.pending) inner = `<p class="thinking">pulling today's ai news…</p>`;
        else if (m.error) inner = `<div class="reality"><p>${esc(m.error)}</p></div>`;
        else if (!m.items || !m.items.length) inner = `<div class="reality"><p>no ai news came back just now — try again in a minute.</p></div>`;
        else inner = `<div class="newsfeed">${m.items.map((it, i) => newsCard(it, m.nid, i)).join("")}</div>`;
        return `<div class="turn dram"><span class="who">dorothy · today's ai news</span>${inner}</div>`;
      }
      const tag = m.model ? ` <span class="bymodel">· ${modelLabel(m.model)}</span>` : "";
      let inner = "";
      if (m.thinking) inner += `<details class="thinkblock"${m.streaming ? " open" : ""}><summary>thinking</summary><div class="thinktext">${esc(m.thinking)}</div></details>`;
      if (m.content) inner += `<div class="reality">${mdToHtml(m.content)}</div>`;
      else if (!m.thinking && (m.pending || m.streaming)) inner += `<p class="thinking">thinking…</p>`;
      // once a real answer has settled (m.model is set on API turns, not on the canned
      // welcome or slash notices): copy it, see why it routed where it did, check its sources
      if (m.content && m.model && !m.streaming && !m.pending) {
        const why = routeWhy(m.routed);
        inner += `<div class="ansbar"><button class="ans-act" type="button" data-copy="${i}">copy</button>` +
          (why ? `<span class="routed">${esc(why)}</span>` : "") + `</div>` + sourcesBlock(m.sources);
      }
      return `<div class="turn dram"><span class="who">dorothy${tag}</span>${inner}</div>`;
    }
    // The conversation develops inside a fixed brick; we never auto-scroll the
    // user (no jump-to-bottom). On send we bring the new turn to the top once,
    // then leave the scroll to them — like Claude.
    let aborter = null;        // set while a turn streams; lets the send button double as "stop"
    let greetFreshState = null;
    // Claude-like empty state: a calm, time-aware hello with a short rotating
    // welcome, shown only while no one has spoken yet. Collapses once the chat starts.
    function renderGreeting() {
      const g = $("greet"); if (!g) return;
      const fresh = !chatMessages.some((m) => m.role === "user");
      if (fresh === greetFreshState) return;       // only rebuild on a real transition
      greetFreshState = fresh;
      if (!fresh) { g.hidden = true; document.body.classList.remove("fresh"); return; }
      g.hidden = false; document.body.classList.add("fresh");
      const returning = readSessions().some((s) => s.id !== sessionId);
      g.innerHTML =
        `<div class="ws-welcome">` +
        `<p class="ws-welcome-kicker">${returning ? "welcome back" : "the dramaturg"}</p>` +
        `<h2 class="ws-welcome-title">Ask for an outcome.</h2>` +
        `<p class="ws-welcome-sub">Bring a claim, a worry, or a headline you don't trust. I'll find what's true, tier every part of it, and hand it back sharper — with the receipts.</p>` +
        `<ul class="ws-examples">` +
        EXAMPLES.map((q, i) => `<li><button type="button" class="ws-example" data-q="${esc(q)}"><span class="ws-example-n">0${i + 1}</span><span class="ws-example-q">${esc(q)}</span></button></li>`).join("") +
        `</ul></div>`;
      g.querySelectorAll(".ws-example").forEach((btn) => {
        btn.addEventListener("click", () => { sayEl.value = btn.getAttribute("data-q"); send(); });
      });
    }
    const draw = () => {
      chatMessages.forEach((m) => {
        if (m.content && window.Pandora) m.content = Pandora.parseUnlockTags(m.content);
      });
      log.innerHTML = chatMessages.map((m, i) => bubble(m, i)).join("");
      renderGreeting();
      const users = chatMessages.filter((m) => m.role === "user");
      const assts = chatMessages.filter((m) => m.role === "assistant" && m.content && !m.pending);
      updatePandoraPanels(users[users.length - 1], assts[assts.length - 1]);
    };
    redrawChat = draw;
    const scrollIntoTop = (sel) => {
      requestAnimationFrame(() => {
        const els = log.querySelectorAll(sel);
        const last = els[els.length - 1];
        if (last) last.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    };
    draw();
    syncPandoraUsage();
    // the AI-news tool: pull a live feed into this same space as a scrollable
    // panel; each story opens its tiered "real story" read inline (via /api/reality).
    async function loadNews() {
      const msg = { role: "assistant", kind: "news", nid: ++nidSeq, items: null, pending: true };
      chatMessages.push(msg); chips.style.display = "none"; draw(); scrollIntoTop(".turn");
      try {
        const res = await fetch("/api/feed");
        const data = await res.json().catch(() => ({}));
        msg.items = (data.items || []).slice(0, 8).map((it) => ({
          title: it.title, source: it.source || it.domain || "", image: it.image || "",
          link: it.link || "", summary: it.summary || "", reading: null, reading_pending: false,
        }));
        if (!msg.items.length) msg.error = "no ai news came back just now — try again in a minute.";
      } catch (e) { msg.error = "couldn't reach the news feed — try again in a moment."; }
      msg.pending = false; draw(); persistChat();
    }

    async function runReality(it) {
      if (it.reading || it.reading_pending) return;
      it.reading_pending = true; draw();
      try {
        const res = await fetch("/api/reality", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ story: it.title + (it.summary ? "\n\n" + it.summary : ""), source: it.source, publish: false }),
        });
        const data = await res.json().catch(() => ({}));
        it.reading = res.ok ? (data.text || "the reader came back empty.") : (data.error || "couldn't read this one.");
      } catch (e) { it.reading = "couldn't reach the reader — try again."; }
      it.reading_pending = false; draw(); persistChat();
    }

    // one delegated handler on the log (survives redraws): copy an answer, or the news cards
    log.addEventListener("click", (e) => {
      const cp = e.target.closest(".ans-act[data-copy]");
      if (cp) {
        const m = chatMessages[+cp.getAttribute("data-copy")];
        if (m && m.content && navigator.clipboard) {
          navigator.clipboard.writeText(m.content)
            .then(() => { cp.textContent = "copied"; setTimeout(() => { cp.textContent = "copy"; }, 1400); })
            .catch(() => {});
        }
        return;
      }
      const btn = e.target.closest(".nc-btn[data-news]");
      if (!btn) return;
      const msg = chatMessages.find((x) => x.kind === "news" && String(x.nid) === btn.getAttribute("data-msg"));
      const it = msg && msg.items && msg.items[+btn.getAttribute("data-news")];
      if (it) runReality(it);
    });

    window.addEventListener("rr-stop", () => { if (aborter) aborter.abort(); });
    // the send button doubles as "stop" mid-stream; Enter sends, Shift+Enter newlines
    const autoGrow = () => { sayEl.style.height = "auto"; sayEl.style.height = Math.min(sayEl.scrollHeight, 168) + "px"; };
    function onComposerBtn() { if (aborter) aborter.abort(); else send(); }
    sendBtn.onclick = onComposerBtn;
    sayEl.addEventListener("input", autoGrow);
    sayEl.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
      else if (e.key === "Escape" && aborter) { e.preventDefault(); aborter.abort(); } // Escape stops a stream, like Claude
    };

    // multimodal: attach one image; it rides along with the next turn for a vision read
    const fileEl = $("file"), clipEl = $("clip"), attachEl = $("attach");
    let pendingImage = null; // { media_type, data, url }
    const renderAttach = () => {
      if (!attachEl) return;
      attachEl.hidden = !pendingImage;
      attachEl.innerHTML = pendingImage
        ? `<span class="thumb"><img src="${pendingImage.url}" alt="attached image"><button class="thumb-x" type="button" aria-label="remove image">×</button></span>`
        : "";
    };
    const loadImageFile = (f) => {
      if (!f || !/^image\/(png|jpe?g|webp|gif)$/.test(f.type) || f.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => { const url = String(reader.result), comma = url.indexOf(","); pendingImage = { media_type: f.type, data: url.slice(comma + 1), url }; renderAttach(); };
      reader.readAsDataURL(f);
    };
    if (clipEl && fileEl) {
      clipEl.addEventListener("click", () => fileEl.click());
      fileEl.addEventListener("change", () => { loadImageFile(fileEl.files && fileEl.files[0]); fileEl.value = ""; });
    }
    if (attachEl) attachEl.addEventListener("click", (e) => { if (e.target.closest(".thumb-x")) { pendingImage = null; renderAttach(); } });
    // paste an image straight into the composer, like Claude
    sayEl.addEventListener("paste", (e) => {
      const items = (e.clipboardData && e.clipboardData.items) || [];
      for (const it of items) {
        if (it.type && it.type.indexOf("image/") === 0) { const f = it.getAsFile(); if (f) { loadImageFile(f); e.preventDefault(); } break; }
      }
    });

    // tools: one reveal of everything the dramaturg can do. Most run in this same
    // space (the conversation develops below); a couple open a deeper page.
    const toolsBtn = $("toolsbtn"), toolsPanel = $("toolspanel");
    if (toolsBtn && toolsPanel) {
      const setTools = (open) => {
        toolsPanel.hidden = !open;
        toolsBtn.setAttribute("aria-expanded", open ? "true" : "false");
      };
      toolsPanel.innerHTML = "";
      TOOLS.forEach((t) => {
        const b = document.createElement("button");
        b.className = "chip tool"; b.type = "button"; b.textContent = t.label;
        b.addEventListener("click", () => {
          setTools(false);
          if (t.news) { loadNews(); return; }
          if (t.nav) { try { (window.top || window).location.href = t.nav; } catch (e) { location.href = t.nav; } return; }
          if (t.send) { sayEl.value = t.send; send(); }
          else if (t.fill) { sayEl.value = t.fill; sayEl.focus(); }
        });
        toolsPanel.appendChild(b);
      });
      setTools(false); // closed by default
      toolsBtn.addEventListener("click", (e) => { e.stopPropagation(); setTools(toolsPanel.hidden); });
      // click anywhere outside (or Escape) closes the dock
      document.addEventListener("click", (e) => {
        if (!toolsPanel.hidden && !toolsPanel.contains(e.target) && e.target !== toolsBtn) setTools(false);
      });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !toolsPanel.hidden) setTools(false); });
    }

    async function send() {
      let text = sayEl.value.trim();
      if ((!text && !pendingImage) || aborter) return;
      if (!text && pendingImage) text = "read this image — tell me what you see, and tier what you can.";
      // routing: the chat is the one interface, but /lens or /studio opens the
      // deeper standalone tool when someone explicitly wants it.
      const slash = text.match(/^\/(lens|studio|chat)\b\s*([\s\S]*)$/i);
      if (slash) {
        const mode = slash[1].toLowerCase(), rest = (slash[2] || "").trim();
        sayEl.value = ""; chips.style.display = "none";
        if (mode === "chat") { chatMessages.push({ role: "assistant", content: "we're already talking — go on." }); draw(); return; }
        chatMessages.push({ role: "assistant", content: `→ opening the **${mode}**…` }); draw();
        const url = mode === "lens" ? ("/lens.html" + (rest ? "?q=" + encodeURIComponent(rest) : "")) : "/studio.html";
        try { (window.top || window).location.href = url; } catch (e) { location.href = url; }
        return;
      }
      aborter = new AbortController();                   // lock FIRST (re-entry race) — also enables "stop"
      sendBtn.textContent = "stop"; sendBtn.classList.add("stopping");
      const img = pendingImage; pendingImage = null; renderAttach();
      sayEl.value = ""; autoGrow(); chips.style.display = "none";
      chatMessages.push({ role: "user", content: text, image: img ? { url: img.url } : null });
      wsEmit("mission", { text });
      syncPandoraUsage();
      if (window.Workstation) Workstation.setMission(text);
      wsEmit("run-start");
      const pend = { role: "assistant", content: "", thinking: "", pending: true, streaming: true };
      chatMessages.push(pend);
      draw();
      scrollIntoTop(".turn.you"); // bring their message to the top once; then leave the scroll to them

      // coalesce redraws to one per frame so a fast stream stays smooth
      let queued = false;
      const flush = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; draw(); }); };
      const history = chatMessages.filter((m) => m !== pend && !m.pending && m.kind !== "news" && typeof m.content === "string")
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch("/api/argue", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history, stream: true, image: img ? { media_type: img.media_type, data: img.data } : undefined }), signal: aborter.signal,
        });
        if (!res.ok || !res.body) {
          let err = "something went wrong — try again.";
          try { const d = await res.json(); if (d && d.error) err = d.error; } catch {}
          pend.content = err;
        } else {
          const reader = res.body.getReader(), dec = new TextDecoder();
          let buf = "", streamErr = null;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            let sep;
            while ((sep = buf.indexOf("\n\n")) >= 0) {
              const chunk = buf.slice(0, sep); buf = buf.slice(sep + 2);
              let ev = "message", dataStr = "";
              for (const line of chunk.split("\n")) {
                const l = line.trimStart();
                if (l.startsWith("event:")) ev = l.slice(6).trim();
                else if (l.startsWith("data:")) dataStr += l.slice(5).trim();
              }
              if (!dataStr) continue;
              let d; try { d = JSON.parse(dataStr); } catch { continue; }
              if (ev === "thinking") { pend.thinking += d.delta || ""; flush(); }
              else if (ev === "text") {
                let delta = d.delta || "";
                if (window.Pandora) delta = Pandora.parseUnlockTags(delta);
                pend.content += delta;
                pend.pending = false;
                flush();
              }
              else if (ev === "meta") {
                if (d.model) pend.model = d.model;
                if (d.routed) pend.routed = d.routed;
                wsEmit("run-route", { routed: d.routed, model: d.model, search: !!(d.routed && d.routed.search) });
              }
              else if (ev === "sources") { pend.sources = d; wsEmit("run-sources", { sources: d }); }
              else if (ev === "done") { if (d.model) pend.model = d.model; }
              else if (ev === "error") { streamErr = d.message || "the machine hit an error."; }
            }
          }
          if (streamErr && !pend.content) pend.content = streamErr;
          if (!pend.content && !pend.thinking) pend.content = "the machine returned nothing readable. try again.";
        }
      } catch (err) {
        if (err && err.name === "AbortError") {
          if (!pend.content && !pend.thinking) pend.content = "_(stopped)_";
          wsEmit("run-stop");
        } else {
          if (!pend.content) pend.content = "couldn't reach the dramaturg. try again in a moment.";
          wsEmit("run-error", { message: pend.content });
        }
      } finally {
        pend.pending = false; pend.streaming = false;
        aborter = null; sendBtn.textContent = "send"; sendBtn.classList.remove("stopping"); draw(); persistChat();
        if (pend.content && pend.content !== "_(stopped)_") {
          wsEmit("run-complete", { routed: pend.routed, model: pend.model, sources: pend.sources, turns: chatMessages.filter((m) => !m.pending).length });
        }
        sayEl.focus();
      }
    }
  }

  if (pandora && idx >= screens.length - 1) {
    mountChat();
  } else if (stage) {
    render();
  }
}

// Scripts load at end of <body>, so DOMContentLoaded may have already fired.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootLearn);
} else {
  bootLearn();
}
