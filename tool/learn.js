// Learn the research — a screen-by-screen walk. Each idea is a full screen; you
// advance and it collapses into the next, the dramaturg taking you through. The
// final screen hands you to the live dramaturg (brain: /api/argue).

const $ = (id) => document.getElementById(id);

function esc(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "", inList = false;
  const inline = (t) => esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
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

const OPENING = `you made it through the walk — so let's do the real thing. bring me a claim, a worry, a headline, a half-formed thought, and i'll run it: find what's true in it, make it specific, measure where it overreaches, and hand it back to you sharper. start anywhere.`;
const CHIPS = [
  "is AI actually going to take my job?",
  "test a claim i keep seeing online",
  "help me make a vague idea specific",
];

window.addEventListener("DOMContentLoaded", () => {
  const walk = $("walk");
  const beats = [...walk.querySelectorAll(".beat")];
  let idx = 0, typingInChat = false;

  // progress ruler — a tick per screen, filling as you pass
  const rail = document.createElement("div");
  rail.className = "walkrail";
  rail.setAttribute("aria-hidden", "true");
  beats.forEach((b, i) => {
    const t = document.createElement("button");
    t.className = "rtick";
    const label = b.querySelector(".beat-tick");
    t.title = label ? label.textContent.trim() : `screen ${i}`;
    t.addEventListener("click", () => goto(i));
    rail.appendChild(t);
  });
  walk.parentNode.insertBefore(rail, walk);
  const syncRail = () => [...rail.children].forEach((t, i) => {
    t.classList.toggle("passed", i < idx);
    t.classList.toggle("now", i === idx);
  });

  function goto(i) {
    if (i === idx || i < 0 || i >= beats.length) return;
    const cur = beats[idx];
    cur.classList.add("collapsing");
    window.setTimeout(() => {
      cur.classList.remove("active", "collapsing");
      idx = i;
      beats[idx].classList.add("active");
      syncRail();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (beats[idx].classList.contains("finalbeat")) initChat();
    }, 300);
  }
  const advance = () => { if (idx < beats.length - 1) goto(idx + 1); };

  beats.forEach((b) => {
    const g = b.querySelector(".goon");
    if (g) g.addEventListener("click", advance);
  });

  document.addEventListener("keydown", (e) => {
    if (typingInChat && document.activeElement && document.activeElement.id === "say") return;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || (e.key === "Enter" && idx < beats.length - 1)) {
      e.preventDefault(); advance();
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault(); if (idx > 0) goto(idx - 1);
    }
  });

  beats[0].classList.add("active");
  syncRail();

  // ---- the live dramaturg, on the final screen ----
  let chatInit = false;
  let messages = [];
  function initChat() {
    if (chatInit) return;
    chatInit = true; typingInChat = true;
    const log = $("log"), sayEl = $("say"), sendBtn = $("send"), chips = $("chips");

    function bubble(m) {
      if (m.role === "user") return `<div class="turn you"><span class="who">you</span><div class="ubody">${esc(m.content)}</div></div>`;
      const body = m.pending ? `<p class="thinking">thinking…</p>` : `<div class="reality">${mdToHtml(m.content)}</div>`;
      return `<div class="turn dram"><span class="who">the dramaturg</span>${body}</div>`;
    }
    const render = () => { log.innerHTML = messages.map(bubble).join(""); log.scrollTop = log.scrollHeight; };

    messages.push({ role: "assistant", content: OPENING });
    render();
    CHIPS.forEach((c) => {
      const b = document.createElement("button");
      b.className = "chip"; b.textContent = c;
      b.addEventListener("click", () => { sayEl.value = c; send(); });
      chips.appendChild(b);
    });
    sendBtn.addEventListener("click", send);
    sayEl.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } });

    async function send() {
      const text = sayEl.value.trim();
      if (!text || sendBtn.disabled) return;
      sayEl.value = ""; chips.style.display = "none";
      messages.push({ role: "user", content: text });
      messages.push({ role: "assistant", content: "", pending: true });
      render();
      sendBtn.disabled = true; sendBtn.textContent = "…";
      try {
        const res = await fetch("/api/argue", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: messages.filter((m) => !m.pending) }),
        });
        const data = await res.json().catch(() => ({}));
        messages.pop();
        messages.push({ role: "assistant", content: res.ok ? data.text : (data.error || "something went wrong — try that again.") });
      } catch (err) {
        messages.pop();
        messages.push({ role: "assistant", content: "couldn't reach the dramaturg. try again in a moment." });
      } finally {
        sendBtn.disabled = false; sendBtn.textContent = "send";
        render(); sayEl.focus();
      }
    }
  }
});
