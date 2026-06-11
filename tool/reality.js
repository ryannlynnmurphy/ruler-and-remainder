// The Reality Check — reads an AI news story and tells you the likely reality,
// using the corpus's method (confidence–reality divergence, the three tiers,
// the remainder) and the Cybersecurity Bill of Rights.
//
// Bring-your-own-key: the call goes from YOUR browser straight to Anthropic with
// YOUR key. The key is stored only in your browser (localStorage, if you ask).
// Nothing — not the story, not the key — touches this site. Data leaves
// consciously: you opt in, every time, with your own key.

const SYSTEM = `You read AI news the way this corpus reads everything: you test whether the story's stated confidence exceeds what is actually known or built, and you name what the framing leaves out. You are not a debunker and you are not a hype-man. You are calibrated. Most stories are part true and part overclaim; your job is to separate them precisely.

YOUR METHOD (from the corpus):
- Confidence–reality divergence. A claim "fires" only when you can state two things a non-specialist can check: (A) what the story asserts, and (B) the likely reality from engineering/empirical fact — such that A and B contradict. If A and B agree, say so. Firing on everything is worthless; calibration is the whole value.
- Three tiers, kept apart. Mark each judgment: ESTABLISHED (checkable now), EXPLORATORY (plausible, untested at scale), or SPECULATIVE (a shape, not load-bearing). Never let a speculative read certify an established claim.
- Legibility and the remainder. Every story makes some things legible and buries others. Name the remainder: what the framing leaves out, and who pays for what stays invisible.
- Verbs carry the claim. "Prevents" is not "detects"; "deterministic" is not "probabilistic"; a property of one component is not a property of the whole system. Watch the verb and the modal.

THE CYBERSECURITY BILL OF RIGHTS (rights as properties, not promises) — flag which the situation implicates:
I. know what the system does and does not do (no "military-grade," "unbreakable").
II. data minimization by default. III. local processing. IV. encryption that stays encrypted (no backdoors/lawful access).
V. legible failure (breach disclosure a person can act on). VI. refuse without penalty. VII. leave with everything (portability).
VIII. inspection (no security-through-obscurity). IX. repair. X. a human in consequential decisions. XI. don't subsidize fragility (efficiency is a security property). XII. deletion that is actually deletion.

OUTPUT — plain, lowercase headers, markdown. Be specific and brief. Use these sections exactly:

## the claim
One or two sentences: what the story/headline is asserting.

## the likely reality
What is probably actually true, reading the gap. State each judgment with its tier in brackets, e.g. [established], [exploratory], [speculative]. Where confidence exceeds reality, say so plainly and name the verb or modal that does the inflating.

## the remainder
What the framing leaves out — and who pays for what stays invisible.

## rights implicated
The Bill-of-Rights articles this touches, by number and name, one line each on how. If none clearly apply, say so.

## what to check
2–4 concrete, checkable questions a reader should ask before believing the story.

Rules: do not invent facts, numbers, sources, or events the story does not contain. If the text is not an AI news story, say so and stop. If you lack the basis to judge a claim, mark it UNVERIFIABLE rather than guessing.`;

const $ = (id) => document.getElementById(id);
const KEY_STORE = "rr_anthropic_key";

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
  return html.replace(/\[(established|exploratory|speculative|unverifiable)\]/gi, '<span class="tierflag">$1</span>');
}

const EXAMPLE = `New AI security platform launches with "100% protection against prompt injection." The startup says its deterministic engine blocks every attack before it reaches your model, with a tamper-proof audit log and military-grade encryption. Backed by $40M, it claims to be the first to make enterprise AI "fully secure."`;

window.addEventListener("DOMContentLoaded", () => {
  const keyEl = $("key"), storyEl = $("story"), out = $("out"), runBtn = $("run"), modelEl = $("model"), remember = $("remember");
  const saved = localStorage.getItem(KEY_STORE);
  if (saved) { keyEl.value = saved; remember.checked = true; }

  $("loadex").addEventListener("click", () => { storyEl.value = EXAMPLE; storyEl.focus(); });

  runBtn.addEventListener("click", async () => {
    const key = keyEl.value.trim(), story = storyEl.value.trim();
    if (!story) { out.innerHTML = `<p class="empty">paste an ai news story above, then run the check.</p>`; return; }
    if (!key) { out.innerHTML = `<p class="empty">this calls a model — paste your own anthropic api key. it stays in your browser; nothing comes here.</p>`; return; }
    if (remember.checked) localStorage.setItem(KEY_STORE, key); else localStorage.removeItem(KEY_STORE);

    runBtn.disabled = true; runBtn.textContent = "reading…";
    out.innerHTML = `<p class="empty">reading the story against the corpus and the bill of rights…</p>`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: modelEl.value,
          max_tokens: 1600,
          system: SYSTEM,
          messages: [{ role: "user", content: "Here is the AI news story. Read it and return the reality check.\n\n---\n" + story }],
        }),
      });
      if (!res.ok) {
        let msg = res.status + " " + res.statusText;
        try { const e = await res.json(); if (e.error && e.error.message) msg = e.error.message; } catch {}
        out.innerHTML = `<div class="verdict v-fires"><strong>the call failed</strong><span>${esc(msg)}</span></div><p class="empty">check the key (and that it has credit). the request goes straight from your browser to anthropic — nothing routes through this site.</p>`;
        return;
      }
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      out.innerHTML = `<div class="reality">${mdToHtml(text)}</div><p class="discipline">this is a model's read, not a verdict. it surfaces where confidence outruns reality and which rights are in play — you still check the math. your story and key went to anthropic with your key; nothing came to this site.</p>`;
    } catch (err) {
      out.innerHTML = `<div class="verdict v-fires"><strong>could not reach the model</strong><span>${esc(String(err))}</span></div><p class="empty">network or CORS error. your key never left for this site — the call is browser-to-anthropic.</p>`;
    } finally {
      runBtn.disabled = false; runBtn.textContent = "run the reality check";
    }
  });
});
