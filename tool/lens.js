// The Lens — the centerpiece. A production-grade conversational research
// instrument: bring anything from the world, read it through your corpus, keep
// the thread, save readings back into the corpus, hear them in Michael's voice.
//
// Brain: /api/lens (multi-turn, grounded). Log: /api/conversations (mode "lens").
// Artifacts: /api/corpus. Voice: /api/voice. DOM-built — no innerHTML on model text.

(function () {
  "use strict";
  var thread = document.getElementById("thread");
  var textEl = document.getElementById("text");
  var go = document.getElementById("go");
  var logEl = document.getElementById("log");
  var side = document.getElementById("side");

  var EXAMPLES = [
    "100% protection against prompt injection — finally.",
    "AI will replace junior developers within 18 months.",
    "Our platform democratizes intelligence for everyone, everywhere.",
    "The data center is the new oil field.",
  ];

  var state = { convId: null, messages: [] }; // messages: {role:'user'|'assistant', content, sources?, mode?}
  var audio = null;

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function post(url, payload) {
    return fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); });
  }

  // ---- editorial rendering: paragraphs from blank-line blocks (joins wrapped lines) ----
  function renderInline(container, line) {
    var re = /\[(established|exploratory|speculative)\]|\(([^)]{2,70})\)/gi, last = 0, m;
    while ((m = re.exec(line))) {
      if (m.index > last) container.appendChild(document.createTextNode(line.slice(last, m.index)));
      if (m[1]) container.appendChild(el("span", "tier " + m[1].toLowerCase(), m[1].toLowerCase()));
      else { var c = el("span", "cite", "(" + m[2] + ")"); container.appendChild(c); }
      last = re.lastIndex;
    }
    if (last < line.length) container.appendChild(document.createTextNode(line.slice(last)));
  }
  function renderReading(container, text) {
    var blocks = String(text).replace(/\r/g, "").split(/\n{2,}/);
    blocks.forEach(function (block) {
      var lines = block.split("\n").map(function (l) { return l.replace(/\s+$/, ""); }).filter(Boolean);
      if (!lines.length) return;
      var h0 = lines[0].match(/^#{1,4}\s+(.+)$/);
      if (h0 && lines.length === 1) { container.appendChild(el("h4", null, h0[1].replace(/[*`]/g, ""))); return; }
      if (lines.every(function (l) { return /^[-*•]\s+/.test(l); })) {
        lines.forEach(function (l) { var p = el("p"); p.style.margin = "0 0 0.35rem"; renderInline(p, "• " + l.replace(/^[-*•]\s+/, "").replace(/\*\*/g, "").replace(/[*`]/g, "")); container.appendChild(p); });
        return;
      }
      var start = 0;
      if (h0) { container.appendChild(el("h4", null, h0[1].replace(/[*`]/g, ""))); start = 1; }
      var rest = lines.slice(start);
      if (rest.length) { var p = el("p"); renderInline(p, rest.join(" ").replace(/\*\*/g, "").replace(/[*`]/g, "")); container.appendChild(p); }
    });
  }

  // ---- thread ----
  function render() {
    thread.textContent = "";
    if (!state.messages.length) { renderEmpty(); return; }
    var inner = el("div", "inner");
    state.messages.forEach(function (m) {
      if (m.role === "user") {
        var t = el("div", "turn user");
        t.appendChild(el("div", "who", "you brought"));
        t.appendChild(el("div", "bubble", m.content));
        inner.appendChild(t);
      } else {
        var r = el("div", "turn read");
        r.appendChild(el("div", "who", m.pending ? "the lens" : "the lens · reading"));
        if (m.pending) { r.appendChild(el("div", "thinking", "reading it through your research…")); inner.appendChild(r); return; }
        if (m.error) { r.appendChild(el("div", "err", m.content)); inner.appendChild(r); return; }
        if (m.sources && m.sources.length) {
          var s = el("div", "srcline"); s.appendChild(el("span", null, "grounded in — ")); s.appendChild(el("b", null, m.sources.join(" · "))); s.appendChild(el("span", null, "  ·  " + (m.mode || "keyword"))); r.appendChild(s);
        }
        var body = el("div", "reading"); renderReading(body, m.content); r.appendChild(body);
        r.appendChild(actions(m));
        inner.appendChild(r);
      }
    });
    thread.appendChild(inner);
    thread.scrollTop = thread.scrollHeight;
  }
  function renderEmpty() {
    var inner = el("div", "inner");
    var es = el("div", "empty-state");
    var h = el("h1"); h.appendChild(document.createTextNode("read it through ")); h.appendChild(el("span", "v", "your own research.")); es.appendChild(h);
    es.appendChild(el("p", null, "bring anything from the world — a headline, a hype claim, a paragraph. the lens reads it against your corpus: what it says, what it hides, and what your own work says about it. cited, tiered, and yours to keep."));
    var chips = el("div", "chips");
    EXAMPLES.forEach(function (ex) { var c = el("button", "chip", ex); c.type = "button"; c.addEventListener("click", function () { textEl.value = ex; send(); }); chips.appendChild(c); });
    es.appendChild(chips); inner.appendChild(es); thread.appendChild(inner);
  }

  function actions(m) {
    var wrap = el("div", "acts");
    var hear = el("button", "act", "▶ hear it · michael"); hear.type = "button";
    hear.addEventListener("click", function () { speak(hear, m.content); });
    var keep = el("button", "act", "+ add to corpus"); keep.type = "button";
    keep.addEventListener("click", function () { addToCorpus(keep, m); });
    wrap.appendChild(hear); wrap.appendChild(keep);
    return wrap;
  }

  function speak(btn, text) {
    if (audio && !audio.paused) { audio.pause(); audio.currentTime = 0; btn.textContent = "▶ hear it · michael"; return; }
    btn.disabled = true; btn.textContent = "michael is reading…";
    fetch("/api/voice", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: text }) })
      .then(function (r) { if (!r.ok) return r.json().then(function (e) { throw new Error(e.error || "voice failed"); }); return r.blob(); })
      .then(function (blob) { btn.disabled = false; btn.textContent = "⏸ stop"; audio = new Audio(URL.createObjectURL(blob)); audio.onended = function () { btn.textContent = "▶ hear it · michael"; }; audio.play(); })
      .catch(function () { btn.disabled = false; btn.textContent = "▶ hear it · michael"; });
  }

  function addToCorpus(btn, m) {
    var prevUser = "";
    var idx = state.messages.indexOf(m);
    for (var j = idx - 1; j >= 0; j--) { if (state.messages[j].role === "user") { prevUser = state.messages[j].content; break; } }
    var title = (prevUser || m.content).split("\n")[0].replace(/[#*`>]/g, "").slice(0, 80).trim() || "a reading";
    btn.disabled = true; btn.textContent = "adding…";
    post("/api/corpus", { title: "Reading: " + title, text: m.content, kind: "output", authorship: "ai", status: "output", source: "lens" })
      .then(function (res) { btn.textContent = res.ok ? "✓ in corpus" : "couldn't add"; })
      .catch(function () { btn.disabled = false; btn.textContent = "+ add to corpus"; });
  }

  // ---- send a turn ----
  function send() {
    var text = (textEl.value || "").trim();
    if (!text) return;
    textEl.value = ""; textEl.style.height = "auto";
    state.messages.push({ role: "user", content: text });
    state.messages.push({ role: "assistant", content: "", pending: true });
    render();
    var payload = state.messages.filter(function (m) { return !m.pending; }).map(function (m) { return { role: m.role, content: m.content }; });
    post("/api/lens", { messages: payload })
      .then(function (res) {
        state.messages = state.messages.filter(function (m) { return !m.pending; });
        if (!res.ok) { state.messages.push({ role: "assistant", content: res.d.error || "the lens didn't focus. try again.", error: true }); render(); return; }
        state.messages.push({ role: "assistant", content: res.d.reading, sources: res.d.sources, mode: res.d.mode });
        render(); saveConv();
      })
      .catch(function () { state.messages = state.messages.filter(function (m) { return !m.pending; }); state.messages.push({ role: "assistant", content: "couldn't reach the lens. try again.", error: true }); render(); });
  }

  // ---- conversation log (persisted, mode 'lens') ----
  function titleOf() {
    var first = state.messages.find(function (m) { return m.role === "user"; });
    return first ? first.content.split("\n")[0].slice(0, 70) : "untitled reading";
  }
  function saveConv() {
    post("/api/conversations", { id: state.convId, title: titleOf(), mode: "lens", messages: state.messages.filter(function (m) { return !m.pending && !m.error; }) })
      .then(function (res) { if (res.ok && res.d.id) { state.convId = res.d.id; loadLog(); } })
      .catch(function () {});
  }
  function loadLog() {
    fetch("/api/conversations").then(function (r) { return r.json(); }).then(function (d) {
      var items = (d.conversations || []).filter(function (c) { return c.mode === "lens"; });
      logEl.textContent = ""; logEl.appendChild(el("div", "lh", "readings"));
      if (!items.length) { logEl.appendChild(el("div", "empty", "no readings yet.")); return; }
      items.forEach(function (cv) {
        var b = el("button", "item" + (cv.id === state.convId ? " on" : ""), cv.title || "untitled");
        b.type = "button"; b.appendChild(el("small", null, (cv.turns || 0) + " turns"));
        b.addEventListener("click", function () { openConv(cv.id); side.classList.remove("open"); });
        logEl.appendChild(b);
      });
    }).catch(function () {});
  }
  function openConv(id) {
    fetch("/api/conversations?id=" + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (d) {
      var cv = d.conversation; if (!cv) return;
      state.convId = cv.id; state.messages = Array.isArray(cv.messages) ? cv.messages : [];
      render(); loadLog();
    }).catch(function () {});
  }
  function newReading() { state.convId = null; state.messages = []; render(); loadLog(); textEl.focus(); }

  // ---- wire ----
  go.addEventListener("click", send);
  textEl.addEventListener("keydown", function (e) { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); send(); } });
  textEl.addEventListener("input", function () { textEl.style.height = "auto"; textEl.style.height = Math.min(textEl.scrollHeight, 144) + "px"; });
  document.getElementById("new").addEventListener("click", newReading);
  document.getElementById("menutoggle").addEventListener("click", function () { side.classList.toggle("open"); });

  render();
  loadLog();
})();
