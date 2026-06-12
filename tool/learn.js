// The Walk — a web-app game. Duolingo for the whole corpus: one idea per screen,
// made legible (not dumbed down), the dramaturg as the guide. The final screen
// hands you to the live dramaturg (brain: /api/argue — not modified here).

const $ = (id) => document.getElementById(id);
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function fmt(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>"); }
function modelLabel(m) { return !m ? "" : m.includes("haiku") ? "haiku" : m.includes("opus") ? "opus" : m.includes("sonnet") ? "sonnet" : m; }
function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "", inList = false;
  const inline = (t) => esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(established|exploratory|speculative|unverifiable)\]/gi, '<span class="tierflag t-$1">$1</span>');
  for (let raw of lines) {
    const l = raw.trim();
    if (!l) { if (inList) { html += "</ul>"; inList = false; } continue; }
    if (l.startsWith("## ")) { if (inList) { html += "</ul>"; inList = false; } html += `<h3>${inline(l.slice(3))}</h3>`; }
    else if (l.startsWith("- ") || l.startsWith("• ") || l.startsWith("— ")) { if (!inList) { html += "<ul>"; inList = true; } html += `<li>${inline(l.slice(2))}</li>`; }
    else { if (inList) { html += "</ul>"; inList = false; } html += `<p>${inline(l)}</p>`; }
  }
  if (inList) html += "</ul>";
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
    { big: "Narrative Intelligence", book: true, body: ["the stories we tell about what AI *is* quietly become the rules the rest of us have to live under.", "this book reads those stories before they harden into law."] },
    { big: "Our Relationship", book: true, body: ["can you study something as slippery as *thinking with a machine* — and do it rigorously?", "this one treats three months of conversation as data, not a diary, and finds the structure underneath the feeling."] },
    { big: "Radical Optimism", book: true, body: ["a better future is not a thing you sit around wishing for.", "it's a thing you *build*, on purpose, with the right blueprint. here's the blueprint."] },
    { k: "final", big: "now. start arguing.", body: ["bring me a question, a headline you don't trust, or something you're pretty sure you believe.", "i'll find what's true in it, make it specific, show you exactly where it overreaches, and hand it back sharper than you brought it.", "that's machine arguing. and the pen stays right there in your hand."] },
  ] },
];

// flatten: a unit-intro screen before each unit's content
const screens = [];
UNITS.forEach((u) => {
  screens.push({ k: "unit", n: u.n, title: u.title });
  u.screens.forEach((s) => screens.push(Object.assign({ unit: u.n }, s)));
});

const OPENING = `you made it through — so let's do the real thing. bring me a claim, a worry, a headline you don't trust, and i'll run it: find what's true, make it specific, show you where it overreaches, hand it back sharper. start wherever you want.`;
const CHIPS = ["so ai is bad for the environment…", "ai is going to take my job…", "they say this new ai basically thinks like us…"];

// the dramaturg's tools. most render right here in the conversation (send/fill);
// the last two open a deeper page for when you explicitly want that surface.
const TOOLS = [
  { label: "today's AI news — the real story", news: true },
  { label: "read a headline through the corpus", fill: "read this through the corpus and tier it: " },
  { label: "argue something i believe", fill: "here's something i'm pretty sure i believe — argue it with me: " },
  { label: "the lens — a focused reading ↗", nav: "/lens.html" },
  { label: "the studio — work with documents ↗", nav: "/studio.html" },
];

window.addEventListener("DOMContentLoaded", () => {
  const stage = $("stage"), cont = $("cont"), back = $("back"), pbar = $("pbar"), mascot = $("mascot");
  let idx = 0;
  // Three ways in:
  //  ?chat=1  — hosted as the Chat mode inside the workspace: show the live
  //             dramaturg chat right here, never the walk, never redirect.
  //  ?walk=1  — replay: always start the walk from the top.
  //  default  — first time, walk it; once finished, the home of the work is the
  //             workspace, so a returning visitor goes straight there.
  let chatOnly = false, replay = false;
  try {
    chatOnly = /[?&]chat=1\b/.test(location.search);
    replay = /[?&]walk=1\b/.test(location.search);
  } catch {}
  if (chatOnly) { document.body.classList.add("chatonly"); document.documentElement.style.height = "100%"; document.body.style.height = "100%"; idx = screens.length - 1; }
  else if (replay) { idx = 0; }
  else { try { if (localStorage.getItem("rr_walk_complete")) { location.replace("/dramaturg.html"); return; } } catch {} }
  let chatMessages = null; // persists across re-renders of the final screen
  let nidSeq = 0;          // stable ids for tool panels (e.g. the news feed) across redraws

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
      // Finishing the walk lands you in the full workspace. The inline chat only
      // renders when this page is hosted as the workspace's Chat mode (chatonly).
      if (!document.body.classList.contains("chatonly")) {
        try { localStorage.setItem("rr_walk_complete", "1"); } catch {}
        location.href = "/dramaturg.html";
        return;
      }
      html = `<div class="screen final-screen"><h1 class="big">${fmt(s.big)}</h1>` +
        s.body.map((l) => `<p class="line">${fmt(l)}</p>`).join("") +
        `<div id="log" class="log"></div><div id="chips" class="chips"></div>` +
        `<div class="toolsrow"><button id="toolsbtn" class="toolsbtn" type="button" aria-expanded="false">⊕ tools</button><div id="toolspanel" class="toolspanel" hidden></div></div>` +
        `<div class="sayrow"><textarea id="say" rows="2" placeholder="bring the dramaturg a claim, a worry, a headline…"></textarea><button id="send" class="run">send</button></div>` +
        `</div>`;
    } else {
      html = `<div class="screen"><h1 class="big${s.book ? " book" : ""}">${fmt(s.big)}</h1>` +
        s.body.map((l) => `<p class="line">${fmt(l)}</p>`).join("") + `</div>`;
    }
    stage.innerHTML = html;

    // staggered reveal
    [...stage.querySelectorAll(".big, .line, .unit-no, .unit-title, .tile")].forEach((el, i) => {
      el.style.animationDelay = i * 85 + "ms";
      el.classList.add("rin");
    });
    // the mascot reacts
    mascot.classList.remove("talk"); void mascot.offsetWidth; mascot.classList.add("talk");

    const rp = $("replay");
    if (rp) rp.addEventListener("click", (e) => { e.preventDefault(); idx = 0; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });

    pbar.style.width = (100 * idx / (screens.length - 1)) + "%";
    back.style.visibility = idx === 0 ? "hidden" : "visible";
    if (s.k === "final") {
      cont.style.display = "none";
      try { localStorage.setItem("rr_walk_complete", "1"); } catch {}
      mountChat();
    }
    else {
      cont.style.display = "";
      const next = screens[idx + 1];
      cont.textContent = idx === 0 ? "begin" : (next && next.k === "unit" ? "next unit →" : "continue");
    }
  }

  function go(d) {
    const n = idx + d;
    if (n < 0 || n >= screens.length) return;
    idx = n; render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  cont.addEventListener("click", () => go(1));
  back.addEventListener("click", () => go(-1));
  document.addEventListener("keydown", (e) => {
    if (document.activeElement && document.activeElement.id === "say") return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  });

  // ---- the live dramaturg, on the final screen ----
  function mountChat() {
    const log = $("log"), sayEl = $("say"), sendBtn = $("send"), chips = $("chips");
    if (!log) return;
    if (!chatMessages) chatMessages = [{ role: "assistant", content: OPENING }];

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

    function bubble(m) {
      if (m.role === "user") return `<div class="turn you"><span class="who">you</span><div class="ubody">${esc(m.content)}</div></div>`;
      if (m.kind === "news") {
        let inner;
        if (m.pending) inner = `<p class="thinking">pulling today's ai news…</p>`;
        else if (m.error) inner = `<div class="reality"><p>${esc(m.error)}</p></div>`;
        else if (!m.items || !m.items.length) inner = `<div class="reality"><p>no ai news came back just now — try again in a minute.</p></div>`;
        else inner = `<div class="newsfeed">${m.items.map((it, i) => newsCard(it, m.nid, i)).join("")}</div>`;
        return `<div class="turn dram"><span class="who">the dramaturg · today's ai news</span>${inner}</div>`;
      }
      const body = m.pending ? `<p class="thinking">thinking…</p>` : `<div class="reality">${mdToHtml(m.content)}</div>`;
      const tag = m.model ? ` <span class="bymodel">· ${modelLabel(m.model)}</span>` : "";
      return `<div class="turn dram"><span class="who">the dramaturg${tag}</span>${body}</div>`;
    }
    // The conversation develops inside a fixed brick; we never auto-scroll the
    // user (no jump-to-bottom). On send we bring the new turn to the top once,
    // then leave the scroll to them — like Claude.
    const draw = () => { log.innerHTML = chatMessages.map(bubble).join(""); };
    const scrollIntoTop = (sel) => {
      requestAnimationFrame(() => {
        const els = log.querySelectorAll(sel);
        const last = els[els.length - 1];
        if (last) last.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    };
    draw();
    if (chatMessages.length <= 1) {
      CHIPS.forEach((c) => {
        const b = document.createElement("button");
        b.className = "chip"; b.textContent = c;
        b.addEventListener("click", () => { sayEl.value = c; send(); });
        chips.appendChild(b);
      });
    }
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
      msg.pending = false; draw();
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
      it.reading_pending = false; draw();
    }

    // one delegated handler on the log (survives redraws) for the news cards
    log.addEventListener("click", (e) => {
      const btn = e.target.closest(".nc-btn[data-news]");
      if (!btn) return;
      const msg = chatMessages.find((x) => x.kind === "news" && String(x.nid) === btn.getAttribute("data-msg"));
      const it = msg && msg.items && msg.items[+btn.getAttribute("data-news")];
      if (it) runReality(it);
    });

    sendBtn.onclick = send;
    sayEl.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

    // tools: one reveal of everything the dramaturg can do. Most run in this same
    // space (the conversation develops below); a couple open a deeper page.
    const toolsBtn = $("toolsbtn"), toolsPanel = $("toolspanel");
    if (toolsBtn && toolsPanel) {
      toolsPanel.innerHTML = "";
      TOOLS.forEach((t) => {
        const b = document.createElement("button");
        b.className = "chip tool"; b.type = "button"; b.textContent = t.label;
        b.addEventListener("click", () => {
          toolsPanel.hidden = true; toolsBtn.setAttribute("aria-expanded", "false");
          if (t.news) { loadNews(); return; }
          if (t.nav) { try { (window.top || window).location.href = t.nav; } catch (e) { location.href = t.nav; } return; }
          if (t.send) { sayEl.value = t.send; send(); }
          else if (t.fill) { sayEl.value = t.fill; sayEl.focus(); }
        });
        toolsPanel.appendChild(b);
      });
      toolsBtn.addEventListener("click", () => {
        const open = toolsPanel.hidden;
        toolsPanel.hidden = !open;
        toolsBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    async function send() {
      const text = sayEl.value.trim();
      if (!text || sendBtn.disabled) return;
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
      sendBtn.disabled = true; sendBtn.textContent = "…"; // guard FIRST, before any push (re-entry race)
      sayEl.value = ""; chips.style.display = "none";
      chatMessages.push({ role: "user", content: text });
      chatMessages.push({ role: "assistant", content: "", pending: true });
      draw();
      scrollIntoTop(".turn.you"); // bring their message to the top once; then leave the scroll to them
      try {
        const res = await fetch("/api/argue", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: chatMessages.filter((m) => !m.pending) }),
        });
        const data = await res.json().catch(() => ({}));
        chatMessages.pop();
        chatMessages.push({ role: "assistant", content: res.ok ? data.text : (data.error || "something went wrong — try again."), model: res.ok ? data.model : null });
      } catch (err) {
        chatMessages.pop();
        chatMessages.push({ role: "assistant", content: "couldn't reach the dramaturg. try again in a moment." });
      } finally {
        sendBtn.disabled = false; sendBtn.textContent = "send"; draw(); sayEl.focus();
      }
    }
  }

  render();
});
