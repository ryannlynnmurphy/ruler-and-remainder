// The Studio — the Reading Machine. The recursive research loop:
// upload → read → generate → save → analyze → reread.
//
// Brain: /api/argue (the dramaturg, unmodified). Persistence: /api/conversations,
// /api/artifacts. Corpus: /api/corpus (ingest/list/get/search) + /api/reflect.
// Chat grounds in the user's corpus by retrieving chunks and prepending them to
// the turn (no edit to /api/argue). Propose-only: nothing is saved without a click.
//
// All DOM is built with createElement/textContent — model + user text never
// passes through innerHTML.

(function () {
  "use strict";

  var OPENING =
    "this is the studio — the reading machine. add documents to the corpus on the " +
    "right (sources, notes, drafts), then argue with them: i ground every answer in " +
    "what you've collected and cite it. when something worth keeping falls out, keep " +
    "it as an artifact or save it back into the corpus. then ask me to reread.";

  var KINDS = ["argument", "finding", "verdict", "map", "brief"];
  var TIERS = ["established", "exploratory", "speculative"];
  var DOC_KINDS = ["note", "essay", "draft", "transcript", "report", "prompt", "source"];
  var AUTHORS = ["human", "co", "ai"];

  var state = { convId: null, messages: [{ role: "assistant", content: OPENING }] };
  var studioMode = "argue";
  var selection = new Set();
  var MODE_LABEL = { walkthrough: "scene walkthrough", synthesis: "synthesis", plan: "plan scaffold", critique: "critique" };

  var $ = function (id) { return document.getElementById(id); };
  var thread = $("thread"), sayEl = $("say"), statusEl = $("status");
  var modal = $("modal"), sheet = $("sheet");

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function status(msg) {
    statusEl.textContent = msg ? "· " + msg : "";
    if (msg) setTimeout(function () { if (statusEl.textContent === "· " + msg) statusEl.textContent = ""; }, 4500);
  }
  // light markdown for workshop/dramaturg artifacts: ## → h4, [tier] → badge, (cite) emphasized
  function renderInlineTiers(container, line) {
    var re = /\[(established|exploratory|speculative)\]|\(([^)]{2,70})\)/gi, last = 0, m;
    while ((m = re.exec(line))) {
      if (m.index > last) container.appendChild(document.createTextNode(line.slice(last, m.index)));
      if (m[1]) container.appendChild(el("span", "tier " + m[1].toLowerCase(), m[1].toLowerCase()));
      else { var c = el("span", null, "(" + m[2] + ")"); c.style.cssText = "color:var(--verm);font-style:italic;"; container.appendChild(c); }
      last = re.lastIndex;
    }
    if (last < line.length) container.appendChild(document.createTextNode(line.slice(last)));
  }
  function renderProse(container, text) {
    // paragraphs from blank-line blocks; wrapped lines joined (no staggered indents)
    String(text).replace(/\r/g, "").split(/\n{2,}/).forEach(function (block) {
      var lines = block.split("\n").map(function (l) { return l.replace(/\s+$/, ""); }).filter(Boolean);
      if (!lines.length) return;
      var h0 = lines[0].match(/^#{1,4}\s+(.+)$/);
      if (h0 && lines.length === 1) { container.appendChild(el("h4", null, h0[1].replace(/[*`]/g, ""))); return; }
      if (lines.every(function (l) { return /^[-*•]\s+/.test(l); })) {
        lines.forEach(function (l) { var p = el("p"); p.style.cssText = "margin:0 0 0.35rem;line-height:1.5;"; renderInlineTiers(p, "• " + l.replace(/^[-*•]\s+/, "").replace(/\*\*/g, "").replace(/[*`]/g, "")); container.appendChild(p); });
        return;
      }
      var start = 0;
      if (h0) { container.appendChild(el("h4", null, h0[1].replace(/[*`]/g, ""))); start = 1; }
      var rest = lines.slice(start);
      if (rest.length) { var p = el("p"); p.style.cssText = "margin:0 0 0.6rem;line-height:1.5;"; renderInlineTiers(p, rest.join(" ").replace(/\*\*/g, "").replace(/[*`]/g, "")); container.appendChild(p); }
    });
  }

  function label(t) { return el("label", null, t); }
  function select(opts, def) {
    var s = document.createElement("select");
    opts.forEach(function (o) { var op = document.createElement("option"); op.value = o; op.textContent = o; if (o === def) op.selected = true; s.appendChild(op); });
    return s;
  }

  // ---- modal -----------------------------------------------------------------
  function openModal(build) {
    sheet.textContent = "";
    var x = el("button", "x", "✕ close"); x.type = "button"; x.addEventListener("click", closeModal);
    sheet.appendChild(x);
    build(sheet);
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  // render a markdown-ish report safely (## headings → bold, rest as text)
  function renderReport(container, text) {
    var box = el("div", "report");
    text.split("\n").forEach(function (line) {
      var h = line.match(/^#{1,4}\s+(.+)$/);
      if (h) { var hd = el("div"); hd.style.cssText = "font-family:'Space Grotesk',sans-serif;font-weight:700;margin:0.9rem 0 0.2rem;"; hd.textContent = h[1]; box.appendChild(hd); }
      else { box.appendChild(document.createTextNode(line)); box.appendChild(document.createElement("br")); }
    });
    container.appendChild(box);
  }

  // ---- render the conversation ----------------------------------------------
  function render() {
    thread.textContent = "";
    state.messages.forEach(function (m, i) {
      var isUser = m.role === "user";
      var wrap = el("div", "msg " + (isUser ? "user" : "dram") + (m.pending ? " pending" : ""));
      wrap.appendChild(el("div", "who", isUser ? "you" : "the dramaturg"));
      if (m.isWorkshop && m.content) {
        if (m.wsmeta) wrap.appendChild(el("div", "wsmeta", m.wsmeta));
        var pb = el("div", "body"); renderProse(pb, m.content); wrap.appendChild(pb);
      } else {
        wrap.appendChild(el("div", "body", m.display != null ? m.display : (m.content || (m.pending ? "thinking…" : ""))));
      }
      if (m.grounded && m.grounded.length) wrap.appendChild(el("div", "meta", "grounded in: " + m.grounded.join(" · ") + (m.groundMode ? " · " + m.groundMode + " search" : "")));
      if (m.model) wrap.appendChild(el("div", "meta", "the dramaturg · " + m.model));
      if (!isUser && !m.pending && m.content && i > 0) {
        var keep = el("button", "btn keep", "keep this"); keep.type = "button";
        keep.addEventListener("click", function () { openKeep(wrap, m, i); });
        var toCorpus = el("button", "btn keep", "→ corpus"); toCorpus.type = "button";
        toCorpus.style.marginLeft = "0.4rem";
        toCorpus.addEventListener("click", function () { saveToCorpus(m, i); });
        wrap.appendChild(keep); wrap.appendChild(toCorpus);
      }
      thread.appendChild(wrap);
    });
    thread.scrollTop = thread.scrollHeight;
  }

  // ---- keep as artifact (propose-only) --------------------------------------
  function openKeep(wrap, msg, idx) {
    if (wrap.querySelector(".keepform")) return;
    var prevUser = "";
    for (var j = idx - 1; j >= 0; j--) { if (state.messages[j].role === "user") { prevUser = state.messages[j].content; break; } }
    var suggested = (prevUser || msg.content).split("\n")[0].replace(/[#*`>]/g, "").slice(0, 80).trim() || "untitled";
    var form = el("div", "keepform");
    form.appendChild(label("title"));
    var title = el("input"); title.type = "text"; title.value = suggested; form.appendChild(title);
    var row = el("div", "row");
    var kw = el("div"); kw.appendChild(label("kind")); var kind = select(KINDS, "argument"); kw.appendChild(kind); row.appendChild(kw);
    var tw = el("div"); tw.appendChild(label("tier")); var tier = select(TIERS, "exploratory"); tw.appendChild(tier); row.appendChild(tw);
    form.appendChild(row);
    form.appendChild(label("the distillation — what you're keeping"));
    var bodyTa = el("textarea"); bodyTa.value = msg.content; form.appendChild(bodyTa);
    var actions = el("div", "actions");
    var keep = el("button", "btn verm", "keep it"); keep.type = "button";
    var cancel = el("button", "btn", "cancel"); cancel.type = "button";
    actions.appendChild(keep); actions.appendChild(cancel); form.appendChild(actions);
    wrap.appendChild(form);
    cancel.addEventListener("click", function () { form.remove(); });
    keep.addEventListener("click", function () {
      keep.disabled = true; keep.textContent = "keeping…";
      post("/api/artifacts", { title: title.value, kind: kind.value, tier: tier.value, body: bodyTa.value, sourceConversationId: state.convId })
        .then(function (res) {
          if (!res.ok) { keep.disabled = false; keep.textContent = "keep it"; status(res.d.error || "couldn't keep that."); return; }
          form.remove(); status("kept as artifact."); loadArtifacts();
        }).catch(function () { keep.disabled = false; keep.textContent = "keep it"; status("couldn't reach the archive."); });
    });
  }

  // ---- save an output back into the corpus (provenance: ai) -----------------
  function saveToCorpus(msg, idx) {
    var prevUser = "";
    for (var j = idx - 1; j >= 0; j--) { if (state.messages[j].role === "user") { prevUser = state.messages[j].content; break; } }
    var suggested = (prevUser || msg.content).split("\n")[0].replace(/[#*`>]/g, "").slice(0, 80).trim() || "dramaturg output";
    openModal(function (s) {
      s.appendChild(el("h3", null, "save to corpus"));
      s.appendChild(el("p", "note", "ai-authored output, marked as such. it becomes a first-class corpus item — analyzed, searchable, and part of the next reread."));
      s.appendChild(label("title"));
      var title = el("input"); title.type = "text"; title.value = suggested; s.appendChild(title);
      s.appendChild(label("project (optional)"));
      var proj = el("input"); proj.type = "text"; proj.placeholder = "e.g. recursive research corpus"; s.appendChild(proj);
      s.appendChild(label("the text"));
      var body = el("textarea"); body.value = msg.content; s.appendChild(body);
      var actions = el("div", "actions");
      var save = el("button", "btn verm", "save to corpus"); save.type = "button";
      var cancel = el("button", "btn", "cancel"); cancel.type = "button";
      actions.appendChild(save); actions.appendChild(cancel); s.appendChild(actions);
      cancel.addEventListener("click", closeModal);
      save.addEventListener("click", function () {
        save.disabled = true; save.textContent = "analyzing…";
        post("/api/corpus", { title: title.value, text: body.value, kind: "output", authorship: "ai", status: "output", project: proj.value || null })
          .then(function (res) {
            if (!res.ok) { save.disabled = false; save.textContent = "save to corpus"; status(res.d.error || "couldn't save."); return; }
            closeModal(); status("saved to corpus + analyzed."); loadCorpus();
          }).catch(function () { save.disabled = false; save.textContent = "save to corpus"; status("couldn't reach the corpus."); });
      });
    });
  }

  // ---- add a document to the corpus -----------------------------------------
  function openAddDoc() {
    openModal(function (s) {
      s.appendChild(el("h3", null, "add to the corpus"));
      s.appendChild(el("p", "note", "paste a document — a source, a note, a draft, a transcript. it's stored, chunked, and read (summary, tags, claims) on the way in."));
      s.appendChild(label("title"));
      var title = el("input"); title.type = "text"; title.placeholder = "what is this?"; s.appendChild(title);
      var row = el("div", "row");
      var kw = el("div"); kw.appendChild(label("kind")); var kind = select(DOC_KINDS, "note"); kw.appendChild(kind); row.appendChild(kw);
      var aw = el("div"); aw.appendChild(label("authorship")); var auth = select(AUTHORS, "human"); aw.appendChild(auth); row.appendChild(aw);
      s.appendChild(row);
      s.appendChild(label("project (optional)"));
      var proj = el("input"); proj.type = "text"; proj.placeholder = "e.g. recursive research corpus"; s.appendChild(proj);
      s.appendChild(label("text — markdown, transcript, notes"));
      var body = el("textarea"); body.style.minHeight = "12rem"; s.appendChild(body);
      var actions = el("div", "actions");
      var add = el("button", "btn verm", "add + read"); add.type = "button";
      var cancel = el("button", "btn", "cancel"); cancel.type = "button";
      actions.appendChild(add); actions.appendChild(cancel); s.appendChild(actions);
      cancel.addEventListener("click", closeModal);
      add.addEventListener("click", function () {
        if (!body.value.trim()) { status("a corpus item needs text."); return; }
        add.disabled = true; add.textContent = "reading…";
        post("/api/corpus", { title: title.value, text: body.value, kind: kind.value, authorship: auth.value, project: proj.value || null })
          .then(function (res) {
            if (!res.ok) { add.disabled = false; add.textContent = "add + read"; status(res.d.error || "couldn't add."); return; }
            closeModal(); status("added + read."); loadCorpus();
          }).catch(function () { add.disabled = false; add.textContent = "add + read"; status("couldn't reach the corpus."); });
      });
    });
  }

  // ---- view a corpus item ----------------------------------------------------
  function viewItem(id) {
    fetch("/api/corpus?id=" + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (d) {
      var it = d && d.item; if (!it) { status("couldn't load that item."); return; }
      openModal(function (s) {
        s.appendChild(el("h3", null, it.title));
        s.appendChild(el("div", "s", it.authorship + " · " + it.kind + (it.project ? " · " + it.project : "")));
        if (it.summary) { s.appendChild(label("summary")); s.appendChild(el("p", null, it.summary)); }
        if (Array.isArray(it.tags) && it.tags.length) {
          s.appendChild(label("tags")); var chips = el("div", "chips");
          it.tags.forEach(function (t) { chips.appendChild(el("span", null, t)); }); s.appendChild(chips);
        }
        if (Array.isArray(it.claims) && it.claims.length) {
          s.appendChild(label("claims")); var ul = el("ul", "claims");
          it.claims.forEach(function (c) { ul.appendChild(el("li", null, c)); }); s.appendChild(ul);
        }
        s.appendChild(label("full text"));
        s.appendChild(el("div", "docbody", it.body));
      });
    }).catch(function () { status("couldn't load that item."); });
  }

  // ---- reflection (the reread) ----------------------------------------------
  function reflect() {
    openModal(function (s) {
      s.appendChild(el("h3", null, "corpus reflection"));
      var p = el("p", "note", "reading the whole corpus…"); s.appendChild(p);
      fetch("/api/reflect").then(function (r) { return r.json(); }).then(function (d) {
        p.remove();
        if (d.error) { s.appendChild(el("p", null, d.error)); return; }
        s.appendChild(el("div", "s", (d.count || 0) + " items read"));
        renderReport(s, d.report || "nothing to report.");
      }).catch(function () { p.textContent = "the reading didn't complete. try again."; });
    });
  }

  // ---- send a turn, grounded in the corpus ----------------------------------
  function send() {
    var text = (sayEl.value || "").trim();
    if (!text) return;
    sayEl.value = ""; sayEl.style.height = "auto";
    state.messages.push({ role: "user", content: text });
    state.messages.push({ role: "assistant", content: "", pending: true });
    render();

    // ground in the user's corpus first (no edit to /api/argue): retrieve, then
    // prepend the passages to THIS turn's content. display stays the clean text.
    fetch("/api/corpus?search=" + encodeURIComponent(text))
      .then(function (r) { return r.json(); }).catch(function () { return { results: [] }; })
      .then(function (sr) {
        var results = (sr && sr.results) || [];
        var mode = (sr && sr.mode) || "";
        var sources = [];
        var sent = text;
        if (results.length) {
          sources = results.map(function (x) { return x.title; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
          var passages = results.map(function (x, i) {
            return "[" + (i + 1) + "] from \"" + x.title + "\"" + (x.heading ? " — " + x.heading : "") + ":\n" + x.text;
          }).join("\n\n");
          sent = "PASSAGES FROM MY CORPUS (ground your answer in these and cite them by title; if they don't cover it, say so):\n\n" +
            passages + "\n\n---\n\nMY MESSAGE: " + text;
        }
        // the user turn we SEND carries the grounding; what we DISPLAY stays clean
        var turn = state.messages[state.messages.length - 2];
        turn.content = sent; turn.display = text;
        return post("/api/argue", { messages: state.messages.filter(function (m) { return !m.pending; }) })
          .then(function (res) {
            state.messages = state.messages.filter(function (m) { return !m.pending; });
            state.messages.push({
              role: "assistant",
              content: res.ok ? res.d.text : (res.d.error || "something went wrong — try again."),
              model: res.ok ? res.d.model : null,
              grounded: sources,
              groundMode: mode,
            });
            render();
            if (res.ok) saveConv();
          });
      })
      .catch(function () {
        state.messages = state.messages.filter(function (m) { return !m.pending; });
        state.messages.push({ role: "assistant", content: "couldn't reach the dramaturg. try again in a moment." });
        render();
      });
  }

  // ---- sessions -------------------------------------------------------------
  function saveConv() {
    var btn = $("save-conv"); btn.disabled = true; var l = btn.textContent; btn.textContent = "saving…";
    post("/api/conversations", { id: state.convId, title: $("conv-title").value || "untitled session", mode: "build", messages: state.messages.filter(function (m) { return !m.pending; }) })
      .then(function (res) {
        btn.disabled = false; btn.textContent = l;
        if (!res.ok) { status(res.d.error || "couldn't save."); return; }
        state.convId = res.d.id; status("session saved."); loadConversations();
      }).catch(function () { btn.disabled = false; btn.textContent = l; status("couldn't reach the archive."); });
  }
  function newConv() { state.convId = null; state.messages = [{ role: "assistant", content: OPENING }]; $("conv-title").value = "untitled session"; render(); }

  // ---- rails ----------------------------------------------------------------
  function loadCorpus() {
    fetch("/api/corpus").then(function (r) { return r.json(); }).then(function (d) {
      var box = $("corpus"); box.textContent = "";
      var items = (d && d.items) || [];
      if (!items.length) { box.appendChild(el("p", "empty", "empty corpus. add a document and the reading begins.")); return; }
      items.forEach(function (it) {
        var c = el("div", "card");
        var head = el("div", "s");
        var a = el("span", "auth " + it.authorship, it.authorship); head.appendChild(a);
        head.appendChild(document.createTextNode(it.kind));
        c.appendChild(el("div", "t", it.title));
        c.appendChild(head);
        c.title = it.summary || "";
        if (selection.has(it.id)) c.classList.add("sel");
        c.addEventListener("click", function () {
          if (studioMode === "argue") { viewItem(it.id); return; }
          if (selection.has(it.id)) { selection.delete(it.id); c.classList.remove("sel"); }
          else { selection.add(it.id); c.classList.add("sel"); }
          updateRunmsg();
        });
        box.appendChild(c);
      });
    }).catch(function () {});
  }
  function loadArtifacts() {
    fetch("/api/artifacts").then(function (r) { return r.json(); }).then(function (d) {
      var box = $("artifacts"); box.textContent = "";
      var items = (d && d.artifacts) || [];
      if (!items.length) { box.appendChild(el("p", "empty", "nothing kept yet.")); return; }
      items.forEach(function (a) {
        var c = el("div", "card");
        c.appendChild(el("div", "t", a.title));
        var s = el("div", "s"); s.appendChild(el("span", "tier " + a.tier, a.tier));
        s.appendChild(document.createTextNode("  " + a.kind)); c.appendChild(s);
        c.title = (a.body || "").slice(0, 600);
        box.appendChild(c);
      });
    }).catch(function () {});
  }
  function loadConversations() {
    fetch("/api/conversations").then(function (r) { return r.json(); }).then(function (d) {
      var box = $("conversations"); box.textContent = "";
      var items = ((d && d.conversations) || []).filter(function (c) { return c.mode !== "lens"; });
      if (!items.length) { box.appendChild(el("p", "empty", "no saved sessions yet.")); return; }
      items.forEach(function (cv) {
        var c = el("div", "card");
        c.appendChild(el("div", "t", cv.title));
        c.appendChild(el("div", "s", (cv.turns || 0) + " turns" + (cv.starred ? " · ★" : "")));
        c.addEventListener("click", function () { openConv(cv.id); });
        box.appendChild(c);
      });
    }).catch(function () {});
  }
  function openConv(id) {
    fetch("/api/conversations?id=" + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (d) {
      var cv = d && d.conversation; if (!cv) { status("couldn't load that session."); return; }
      state.convId = cv.id; $("conv-title").value = cv.title || "untitled session";
      var msgs = Array.isArray(cv.messages) ? cv.messages : [];
      state.messages = msgs.length ? msgs : [{ role: "assistant", content: OPENING }];
      render();
      var s = $("side"); if (s) s.classList.remove("open");
    }).catch(function () { status("couldn't load that session."); });
  }

  // ---- helpers --------------------------------------------------------------
  function post(url, payload) {
    return fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); });
  }

  // ---- workflow modes -------------------------------------------------------
  function updateRunmsg() {
    var n = selection.size;
    var need = studioMode === "synthesis" ? "documents (2+)" : "a document";
    $("runmsg").textContent = n ? (n + " selected — run " + (MODE_LABEL[studioMode] || studioMode)) : ("select " + need + " from the corpus →");
  }
  function setMode(mode, chip) {
    studioMode = mode;
    var chips = document.querySelectorAll(".modechip");
    for (var i = 0; i < chips.length; i++) chips[i].classList.toggle("active", chips[i] === chip);
    selection.clear();
    var sels = document.querySelectorAll("#corpus .card.sel");
    for (var j = 0; j < sels.length; j++) sels[j].classList.remove("sel");
    $("runbar").classList.toggle("on", mode !== "argue");
    $("run-target").style.display = mode === "plan" ? "" : "none";
    updateRunmsg();
  }
  function runMode() {
    if (studioMode === "argue") return;
    var ids = [];
    selection.forEach(function (id) { ids.push(id); });
    if (!ids.length) { status("select at least one document from the corpus."); return; }
    var btn = $("run-mode"); btn.disabled = true; var l = btn.textContent; btn.textContent = "running…";
    state.messages.push({ role: "assistant", content: "", pending: true }); render();
    post("/api/workshop", { mode: studioMode, itemIds: ids, target: ($("run-target").value || "research memo") })
      .then(function (res) {
        state.messages = state.messages.filter(function (m) { return !m.pending; });
        btn.disabled = false; btn.textContent = l;
        if (!res.ok) { status(res.d.error || "the pass failed."); render(); return; }
        state.messages.push({
          role: "assistant", content: res.d.output, isWorkshop: true, model: res.d.model,
          wsmeta: (MODE_LABEL[studioMode] || studioMode) + " · " + (res.d.items || []).join(", "),
        });
        render(); saveConv();
      })
      .catch(function () { state.messages = state.messages.filter(function (m) { return !m.pending; }); btn.disabled = false; btn.textContent = l; status("couldn't reach the workshop."); render(); });
  }

  // ---- wire up --------------------------------------------------------------
  $("send").addEventListener("click", send);
  sayEl.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
  sayEl.addEventListener("input", function () { sayEl.style.height = "auto"; sayEl.style.height = Math.min(sayEl.scrollHeight, 144) + "px"; });
  $("save-conv").addEventListener("click", saveConv);
  $("new-conv").addEventListener("click", newConv);
  $("add-doc").addEventListener("click", openAddDoc);
  $("reflect-btn").addEventListener("click", reflect);
  (function () {
    var chips = document.querySelectorAll(".modechip");
    for (var i = 0; i < chips.length; i++) {
      (function (chip) { chip.addEventListener("click", function () { setMode(chip.getAttribute("data-mode"), chip); }); })(chips[i]);
    }
    $("run-mode").addEventListener("click", runMode);
  })();
  // mobile drawers
  var sideEl = $("side"), railEl = $("rail");
  var ts = $("toggle-side"), tr = $("toggle-rail");
  if (ts) ts.addEventListener("click", function () { sideEl.classList.toggle("open"); railEl.classList.remove("open"); });
  if (tr) tr.addEventListener("click", function () { railEl.classList.toggle("open"); sideEl.classList.remove("open"); });

  render();
  loadCorpus();
  loadArtifacts();
  loadConversations();
})();
