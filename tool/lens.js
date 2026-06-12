// The Lens — paste anything, read it through your corpus. Posts to /api/lens.
// DOM-built rendering (no innerHTML on model text). Light markdown: ## headings,
// [tier] tokens → badges, (Citations) → emphasized, paragraphs.

(function () {
  "use strict";
  var textEl = document.getElementById("text");
  var go = document.getElementById("go");
  var out = document.getElementById("reading");
  var chipsEl = document.getElementById("chips");

  var EXAMPLES = [
    "100% protection against prompt injection — finally.",
    "AI will replace junior developers within 18 months.",
    "Our platform democratizes intelligence for everyone, everywhere.",
    "The data center is the new oil field.",
  ];
  EXAMPLES.forEach(function (ex) {
    var c = document.createElement("span"); c.className = "chip"; c.textContent = ex;
    c.addEventListener("click", function () { textEl.value = ex; run(); });
    chipsEl.appendChild(c);
  });

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  // render a line of prose with [tier] badges and (Citations) emphasized
  function renderInline(container, line) {
    var re = /\[(established|exploratory|speculative)\]|\(([^)]{2,60})\)/gi;
    var last = 0, m;
    while ((m = re.exec(line))) {
      if (m.index > last) container.appendChild(document.createTextNode(line.slice(last, m.index)));
      if (m[1]) { var t = m[1].toLowerCase(); container.appendChild(el("span", "tier " + t, t)); }
      else { container.appendChild(el("span", "cite", "(" + m[2] + ")")); }
      last = re.lastIndex;
    }
    if (last < line.length) container.appendChild(document.createTextNode(line.slice(last)));
  }

  function render(reading, sources, mode) {
    out.textContent = "";
    out.classList.remove("hidden");
    var src = el("div", "src");
    if (sources && sources.length) {
      src.appendChild(el("span", null, "grounded in your corpus — "));
      var b = el("b", null, sources.join(" · ")); src.appendChild(b);
      src.appendChild(el("span", null, "  ·  " + (mode || "keyword") + " retrieval"));
    } else {
      src.appendChild(el("span", null, "your corpus is silent on this — a general reading"));
    }
    out.appendChild(src);

    reading.split("\n").forEach(function (raw) {
      var line = raw.replace(/\s+$/, "");
      if (!line) return;
      var h = line.match(/^#{1,4}\s+(.+)$/);
      if (h) { out.appendChild(el("h3", null, h[1].replace(/[*`]/g, ""))); return; }
      var p = el("p");
      renderInline(p, line.replace(/^[-*]\s+/, "• ").replace(/\*\*/g, "").replace(/[*`]/g, ""));
      out.appendChild(p);
    });
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function run() {
    var text = (textEl.value || "").trim();
    if (!text) { textEl.focus(); return; }
    go.disabled = true; var label = go.textContent; go.textContent = "focusing…";
    out.classList.remove("hidden"); out.textContent = ""; out.appendChild(el("div", "thinking", "reading it through your research…"));
    fetch("/api/lens", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: text }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        go.disabled = false; go.textContent = label;
        if (!res.ok) { out.textContent = ""; out.appendChild(el("div", "err", res.d.error || "the lens didn't focus. try again.")); return; }
        render(res.d.reading, res.d.sources, res.d.mode);
      })
      .catch(function () { go.disabled = false; go.textContent = label; out.textContent = ""; out.appendChild(el("div", "err", "couldn't reach the lens. try again.")); });
  }

  go.addEventListener("click", run);
  textEl.addEventListener("keydown", function (e) { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); run(); } });
})();
