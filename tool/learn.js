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
  { n: "01", title: "the big idea", screens: [
    { big: "everything gets measured.", body: ["a person. a price. a risk. a kid in a classroom.", "and whoever holds the ruler decides what counts."] },
    { big: "a ruler only sees what it was built to see.", body: ["and *someone* built it — for a reason, with a budget, on a deadline.", "what didn't make the cut isn't an accident. it's a decision."] },
    { big: "what it skips doesn't vanish.", body: ["it's called the **remainder**.", "and it always lands on somebody."] },
    { big: "here's what that looks like.", body: ["a test measures one kind of smart: how fast you fill in the right bubble.", "the kid who builds things, or draws, or thinks slow and deep — the test can't see any of it, so it files them under *behind*.", "they spend years paying for a picture a machine drew of them in an afternoon."] },
    { big: "so the whole thing asks three questions.", body: ["who built the ruler?", "what can't it see?", "and who pays for the remainder?"] },
  ] },
  { n: "02", title: "the words", screens: [
    { big: "every system hides something.", body: ["a cheap price hides who got paid less to make it cheap.", "**legibilism** has one demand: make the hiding visible."] },
    { big: "make power readable.", body: ["not to a regulator, not to an expert — to the people stuck living inside it.", "the subscription that hides what you own. the feed that hides why you're seeing this. name the hiding, and you can fight it."] },
    { big: "but — readable to who?", body: ["a secret everyone *could* see and nobody looks at is still a secret.", "**attentionism**: attention — noticing before the moment passes — is the rarest thing there is."] },
    { big: "switched off, or only sleeping?", body: ["some things look dead but are only *dormant* — waiting to be read.", "**latentology** is telling the difference between what's gone and what's just unread — hardest when you can't tell if a thing has a mind, or only looks like it does."] },
  ] },
  { n: "03", title: "the method", screens: [
    { big: "people always sound more sure than they are.", body: ["in ads. in headlines. in your group chat.", "the space between how sure they *sound* and how sure they've earned the right to be — that's where the lie lives."] },
    { k: "tiers", big: "so you label every claim.", body: [] },
    { big: "and you never let red dress up as green.", body: ["a vibe sold as a fact is how every overclaim works — 'unbreakable,' '100% secure,' 'it just gets you.'", "catch the swap, and the spell breaks."] },
    { big: "how do you find what's true?", body: ["you argue with the machine until something true falls out — you push, it pushes back, you both get more specific.", "it's called **machine arguing**, and you've been doing a tiny version this whole walk."] },
  ] },
  { n: "04", title: "the books", screens: [
    { big: "Narrative Intelligence", book: true, body: ["the stories we tell about what AI *is* quietly become the rules we all live under.", "this book reads the stories before they harden."] },
    { big: "Our Relationship", book: true, body: ["can you study something as slippery as *thinking with a machine* — rigorously?", "this one treats three months of conversation as data, not a diary, and argues the feeling underneath has a structure you can actually check."] },
    { big: "Radical Optimism", book: true, body: ["a better future isn't something you wish for.", "it's something you build on purpose, with the right architecture. this is the blueprint."] },
  ] },
  { n: "05", title: "now you", screens: [
    { big: "you've got the whole frame now.", body: ["a five-year-old could follow it. you did.", "that was the point — not to make it *simple*, to make it *legible*."] },
    { k: "final", big: "start asking. start arguing.", body: ["bring me a question, a headline you don't trust, or something you actually believe.", "i'll find what's true in it, make it specific, measure where it overreaches, and hand it back sharper.", "that's machine arguing — and you keep the pen."] },
  ] },
];

// flatten: a unit-intro screen before each unit's content
const screens = [];
UNITS.forEach((u) => {
  screens.push({ k: "unit", n: u.n, title: u.title });
  u.screens.forEach((s) => screens.push(Object.assign({ unit: u.n }, s)));
});

const OPENING = `you finished the walk — so let's do the real thing. bring me a claim, a worry, a headline you don't trust, and i'll run it: find what's true, make it specific, measure where it overreaches, hand it back. start anywhere.`;
const CHIPS = ["so ai is bad for the environment…", "ai is going to take my job…", "they say this new ai basically thinks like us…"];

window.addEventListener("DOMContentLoaded", () => {
  const stage = $("stage"), cont = $("cont"), back = $("back"), pbar = $("pbar"), mascot = $("mascot");
  let idx = 0;
  // The Duolingo part dissipates once you've finished it: on return, skip straight
  // to the live dramaturg (the last screen). "replay the walk" brings it back.
  // ?chat=1 (used when hosted as the Chat mode of the unified workspace) always
  // jumps straight to the live dramaturg — no walk.
  try {
    const chatOnly = /[?&]chat=1\b/.test(location.search);
    if (chatOnly) { document.body.classList.add("chatonly"); idx = screens.length - 1; }
    else if (localStorage.getItem("rr_walk_complete")) idx = screens.length - 1;
  } catch {}
  let chatMessages = null; // persists across re-renders of the final screen

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
      html = `<div class="screen final-screen"><h1 class="big">${fmt(s.big)}</h1>` +
        s.body.map((l) => `<p class="line">${fmt(l)}</p>`).join("") +
        `<div id="log" class="log"></div><div id="chips" class="chips"></div>` +
        `<div class="sayrow"><textarea id="say" rows="2" placeholder="bring the dramaturg a claim, a worry, a headline…"></textarea><button id="send" class="run">send</button></div>` +
        (document.body.classList.contains("chatonly")
          ? ""
          : `<p class="finlinks"><a href="/dramaturg.html#lens">open the full workspace ↗</a> · <a href="/corpus">read the corpus ↗</a> · <a href="#" id="replay">↺ replay the walk</a></p>`) +
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

    function bubble(m) {
      if (m.role === "user") return `<div class="turn you"><span class="who">you</span><div class="ubody">${esc(m.content)}</div></div>`;
      const body = m.pending ? `<p class="thinking">thinking…</p>` : `<div class="reality">${mdToHtml(m.content)}</div>`;
      const tag = m.model ? ` <span class="bymodel">· ${modelLabel(m.model)}</span>` : "";
      return `<div class="turn dram"><span class="who">the dramaturg${tag}</span>${body}</div>`;
    }
    const draw = () => { log.innerHTML = chatMessages.map(bubble).join(""); log.scrollTop = log.scrollHeight; };
    draw();
    if (chatMessages.length <= 1) {
      CHIPS.forEach((c) => {
        const b = document.createElement("button");
        b.className = "chip"; b.textContent = c;
        b.addEventListener("click", () => { sayEl.value = c; send(); });
        chips.appendChild(b);
      });
    }
    sendBtn.onclick = send;
    sayEl.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

    async function send() {
      const text = sayEl.value.trim();
      if (!text || sendBtn.disabled) return;
      sendBtn.disabled = true; sendBtn.textContent = "…"; // guard FIRST, before any push (re-entry race)
      sayEl.value = ""; chips.style.display = "none";
      chatMessages.push({ role: "user", content: text });
      chatMessages.push({ role: "assistant", content: "", pending: true });
      draw();
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
