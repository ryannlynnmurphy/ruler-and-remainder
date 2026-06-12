// Learn the research — the teaching app. The dramaturg (a character whose craft
// is making abstract ideas legible) teaches the corpus in conversation, and can
// run a machine-arguing turn when you bring your own claim. Brain: /api/argue.

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

// The dramaturg's opening — display only; the model re-grounds from its own brief.
const OPENING = `i'm the dramaturg. i teach this research, and most of it is one idea: every system reads the world into neat categories, and something always gets left out. the **ruler** is the neat version; the **remainder** is what won't fit — and who pays for staying invisible.

you don't need to know anything to begin. pull a thread below, or bring me something of your own — a claim, a worry, a half-formed thought — and we'll argue it into something specific.`;

const CHIPS = [
  "what is this research actually about?",
  "teach me ‘legibilism’",
  "what does ‘the remainder’ mean?",
  "i have a claim i want to test",
];

let messages = []; // { role, content, pending? }

window.addEventListener("DOMContentLoaded", () => {
  const log = $("log"), sayEl = $("say"), sendBtn = $("send"), chips = $("chips");

  function bubble(m) {
    if (m.role === "user") {
      return `<div class="turn you"><span class="who">you</span><div class="ubody">${esc(m.content)}</div></div>`;
    }
    const body = m.pending ? `<p class="thinking">thinking…</p>` : `<div class="reality">${mdToHtml(m.content)}</div>`;
    return `<div class="turn dram"><span class="who">the dramaturg</span>${body}</div>`;
  }
  function render() { log.innerHTML = messages.map(bubble).join(""); log.scrollTop = log.scrollHeight; }

  messages.push({ role: "assistant", content: OPENING });
  render();

  CHIPS.forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = c;
    b.addEventListener("click", () => { sayEl.value = c; send(); });
    chips.appendChild(b);
  });

  sendBtn.addEventListener("click", send);
  sayEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); }
  });

  async function send() {
    const text = sayEl.value.trim();
    if (!text || sendBtn.disabled) return;
    sayEl.value = "";
    chips.style.display = "none";
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
      messages.pop(); // drop the pending bubble
      messages.push({
        role: "assistant",
        content: res.ok ? data.text : (data.error || "something went wrong — try that again."),
      });
    } catch (err) {
      messages.pop();
      messages.push({ role: "assistant", content: "couldn't reach the dramaturg. try again in a moment." });
    } finally {
      sendBtn.disabled = false; sendBtn.textContent = "send";
      render();
      sayEl.focus();
    }
  }
});
