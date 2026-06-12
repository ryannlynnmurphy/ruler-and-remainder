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
    { big: "let's be real for a second.", body: ["everybody out here is selling you AI like it's either pure magic or the end of the world.", "it's neither, baby. it's a machine that read damn near the whole internet and learned to guess what comes next.", "that's the trick. the rest of this is about what to *do* with it."] },
    { big: "what's it good for? real things.", body: ["the work you used to need a team, a budget, or a degree to touch — writing, building, researching, arguing it all the way out.", "used right, it puts that in *anybody's* hands.", "that part is real and it is enormous, and i will not let anybody shame you out of using it."] },
    { big: "now the part the salesmen skip.", body: ["it is confidently, gorgeously **wrong** — all the time, with a straight face.", "and it was built by a few rich companies, trained on everybody's work, to serve whoever signs the check.", "some folks it serves beautifully. some folks it does not see at all."] },
    { big: "and that gap is the whole point.", body: ["whoever's holding the tool decides what counts. that's the **ruler**.", "what the ruler can't measure doesn't disappear — it's the **remainder**, and honey, it always lands on *somebody*.", "so this has exactly one job: teach you to use the tool without ending up as the remainder."] },
  ] },
  { n: "02", title: "rung one — vibe coding", screens: [
    { big: "you can build things now. for real.", body: ["not the old way — years of memorizing code in a dark little room.", "you tell the machine what you want, in plain words, and you steer it till it works.", "that's **vibe coding**. i built this whole thing that way, and i'll teach you how."] },
    { big: "the catch — and there's always a catch.", body: ["it will hand you something broke as hell and swear on its life it's perfect.", "vibe coding is *not* 'the machine does it for me.' it's you, hands on the wheel — testing, correcting, refusing the first wrong thing it gives you.", "the skill was never the typing. the skill is not getting played."] },
  ] },
  { n: "03", title: "rung two — vibe research", screens: [
    { big: "now point that same move at ideas.", body: ["not building — *thinking*. crossing between fields — money, power, history, how the thing really works — faster than any one degree was ever going to let you.", "that's **vibe research**. it's how a regular person gets dangerous."] },
    { big: "but it'll tell you exactly what you want to hear.", body: ["a machine trained to please you will flatter you straight into believing nonsense.", "so vibe research is *not* 'ask it and trust it.' it's: take what it told you back out into the real world, and **check**.", "curiosity — with receipts."] },
  ] },
  { n: "04", title: "masters level — machine arguing", screens: [
    { big: "here's the one most people never reach.", body: ["you quit asking the machine for answers like it's some oracle.", "you **argue** with it. you push, it pushes back, you both get sharper — until something *true* falls out the bottom.", "that's **machine arguing**. that's the masters degree, and it's the whole game."] },
    { big: "and arguing runs on one rule.", body: ["people sound surer than they've earned the right to be. machines do it worse.", "the distance between how sure a thing *sounds* and how sure it has any *right* to be — that, right there, is where every lie you've ever been sold was hiding."] },
    { k: "tiers", big: "so you put a label on every claim.", body: [] },
    { big: "and never let a vibe wear a fact's good coat.", body: ["'unbreakable.' '100% secure.' 'it just *gets* you.'", "that's a red painted up to pass for a green. catch that one swap, and the whole spell breaks.", "do this enough times and nobody can sell you a damn thing again."] },
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

const OPENING = `you made it through — so let's do the real thing. bring me a claim, a worry, a headline you don't trust, and i'll run it: find what's true, make it specific, show you where it overreaches, hand it back sharper. start wherever you want, baby.`;
const CHIPS = ["so ai is bad for the environment…", "ai is going to take my job…", "they say this new ai basically thinks like us…"];

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
  if (chatOnly) { document.body.classList.add("chatonly"); idx = screens.length - 1; }
  else if (replay) { idx = 0; }
  else { try { if (localStorage.getItem("rr_walk_complete")) { location.replace("/dramaturg.html"); return; } } catch {} }
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
      // routing: /lens or /studio hands off to that tool in the workspace shell.
      const slash = text.match(/^\/(lens|studio|chat)\b\s*([\s\S]*)$/i);
      if (slash && window.parent !== window) {
        const mode = slash[1].toLowerCase(), rest = (slash[2] || "").trim();
        sayEl.value = ""; chips.style.display = "none";
        chatMessages.push({ role: "assistant", content: mode === "chat"
          ? "we're already talking, baby — go on." : `→ opening the **${mode}**${rest ? " with that" : ""}.` });
        draw();
        if (mode !== "chat") { try { window.parent.postMessage({ type: "rr-route", mode, text: rest }, "*"); } catch (e) {} }
        return;
      }
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
