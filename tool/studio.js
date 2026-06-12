// The Studio — the agentic research workstation.
//
// Brain: /api/argue (the dramaturg — NOT modified here). Persistence:
// /api/conversations + /api/artifacts. Propose-only: the dramaturg proposes,
// the user keeps. Nothing is saved without an explicit click.
//
// All DOM is built with createElement/textContent — model + user text is never
// passed through innerHTML (keeps the XSS surface closed).

(function () {
  "use strict";

  var OPENING =
    "this is the studio — the workroom, not the walk. bring a claim, a draft, " +
    "or a worry and we'll argue it into shape: say yes, find the ruler, name the " +
    "remainder, tier it. when something worth keeping falls out, keep it — it " +
    "becomes an artifact in your archive.";

  var KINDS = ["argument", "finding", "verdict", "map", "brief"];
  var TIERS = ["established", "exploratory", "speculative"];

  var state = {
    convId: null,
    messages: [{ role: "assistant", content: OPENING }],
  };

  var $ = function (id) { return document.getElementById(id); };
  var thread = $("thread"), sayEl = $("say"), statusEl = $("status");

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function status(msg) {
    statusEl.textContent = msg ? "· " + msg : "";
    if (msg) setTimeout(function () { if (statusEl.textContent === "· " + msg) statusEl.textContent = ""; }, 4000);
  }

  // ---- render the conversation ---------------------------------------------
  function render() {
    thread.textContent = "";
    state.messages.forEach(function (m, i) {
      var who = m.role === "user" ? "user" : "dram";
      var wrap = el("div", "msg " + (who === "user" ? "user" : "dram") + (m.pending ? " pending" : ""));
      wrap.appendChild(el("div", "who", who === "user" ? "you" : "the dramaturg"));
      wrap.appendChild(el("div", "body", m.content || (m.pending ? "thinking…" : "")));
      if (m.model) wrap.appendChild(el("div", "meta", "the dramaturg · " + m.model));
      // keep-this lives on settled dramaturg messages only
      if (who === "dram" && !m.pending && m.content && i > 0) {
        var keepBtn = el("button", "btn keep", "keep this");
        keepBtn.type = "button";
        keepBtn.addEventListener("click", function () { openKeep(wrap, m, i); });
        wrap.appendChild(keepBtn);
      }
      thread.appendChild(wrap);
    });
    thread.scrollTop = thread.scrollHeight;
  }

  // ---- propose-only keep form ----------------------------------------------
  function openKeep(wrap, msg, idx) {
    if (wrap.querySelector(".keepform")) return; // already open
    var prevUser = "";
    for (var j = idx - 1; j >= 0; j--) { if (state.messages[j].role === "user") { prevUser = state.messages[j].content; break; } }
    var suggested = (prevUser || msg.content).split("\n")[0].replace(/[#*`>]/g, "").slice(0, 80).trim() || "untitled";

    var form = el("div", "keepform");
    form.appendChild(label("title"));
    var title = el("input"); title.type = "text"; title.value = suggested; form.appendChild(title);

    var row = el("div", "row");
    var kindWrap = el("div"); kindWrap.appendChild(label("kind"));
    var kind = select(KINDS, "argument"); kindWrap.appendChild(kind); row.appendChild(kindWrap);
    var tierWrap = el("div"); tierWrap.appendChild(label("tier"));
    var tier = select(TIERS, "exploratory"); tierWrap.appendChild(tier); row.appendChild(tierWrap);
    form.appendChild(row);

    form.appendChild(label("the distillation — what you're keeping (edit it down to the claim)"));
    var bodyTa = el("textarea"); bodyTa.value = msg.content; form.appendChild(bodyTa);

    var actions = el("div", "actions");
    var keep = el("button", "btn verm", "keep it"); keep.type = "button";
    var cancel = el("button", "btn", "cancel"); cancel.type = "button";
    actions.appendChild(keep); actions.appendChild(cancel);
    form.appendChild(actions);
    wrap.appendChild(form);

    cancel.addEventListener("click", function () { form.remove(); });
    keep.addEventListener("click", function () {
      keep.disabled = true; keep.textContent = "keeping…";
      fetch("/api/artifacts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.value, kind: kind.value, tier: tier.value,
          body: bodyTa.value, sourceConversationId: state.convId,
        }),
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) { keep.disabled = false; keep.textContent = "keep it"; status(res.d.error || "couldn't keep that."); return; }
          form.remove();
          status("kept.");
          loadArtifacts();
        })
        .catch(function () { keep.disabled = false; keep.textContent = "keep it"; status("couldn't reach the archive."); });
    });
  }
  function label(t) { return el("label", null, t); }
  function select(opts, def) {
    var s = document.createElement("select");
    opts.forEach(function (o) { var op = document.createElement("option"); op.value = o; op.textContent = o; if (o === def) op.selected = true; s.appendChild(op); });
    return s;
  }

  // ---- send a turn ----------------------------------------------------------
  function send() {
    var text = (sayEl.value || "").trim();
    if (!text) return;
    sayEl.value = "";
    state.messages.push({ role: "user", content: text });
    state.messages.push({ role: "assistant", content: "", pending: true });
    render();
    fetch("/api/argue", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: state.messages.filter(function (m) { return !m.pending; }) }),
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        state.messages = state.messages.filter(function (m) { return !m.pending; });
        state.messages.push({
          role: "assistant",
          content: res.ok ? res.d.text : (res.d.error || "something went wrong — try again."),
          model: res.ok ? res.d.model : null,
        });
        render();
      })
      .catch(function () {
        state.messages = state.messages.filter(function (m) { return !m.pending; });
        state.messages.push({ role: "assistant", content: "couldn't reach the dramaturg. try again in a moment." });
        render();
      });
  }

  // ---- save / new session ---------------------------------------------------
  function saveConv() {
    var btn = $("save-conv");
    btn.disabled = true; var label0 = btn.textContent; btn.textContent = "saving…";
    fetch("/api/conversations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: state.convId,
        title: $("conv-title").value || "untitled session",
        mode: "build",
        messages: state.messages.filter(function (m) { return !m.pending; }),
      }),
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        btn.disabled = false; btn.textContent = label0;
        if (!res.ok) { status(res.d.error || "couldn't save."); return; }
        state.convId = res.d.id;
        status("session saved.");
        loadConversations();
      })
      .catch(function () { btn.disabled = false; btn.textContent = label0; status("couldn't reach the archive."); });
  }
  function newConv() {
    state.convId = null;
    state.messages = [{ role: "assistant", content: OPENING }];
    $("conv-title").value = "untitled session";
    render();
  }

  // ---- the rail -------------------------------------------------------------
  function loadArtifacts() {
    fetch("/api/artifacts").then(function (r) { return r.json(); }).then(function (d) {
      var box = $("artifacts"); box.textContent = "";
      var items = (d && d.artifacts) || [];
      if (!items.length) { box.appendChild(emptyP("nothing kept yet. argue something true, then keep it.")); return; }
      items.forEach(function (a) {
        var c = el("div", "card");
        c.appendChild(el("div", "t", a.title));
        var s = el("div", "s");
        var badge = el("span", "tier " + a.tier, a.tier);
        s.appendChild(badge);
        s.appendChild(document.createTextNode("  " + a.kind));
        c.appendChild(s);
        c.title = (a.body || "").slice(0, 600);
        box.appendChild(c);
      });
    }).catch(function () {});
  }
  function loadConversations() {
    fetch("/api/conversations").then(function (r) { return r.json(); }).then(function (d) {
      var box = $("conversations"); box.textContent = "";
      var items = (d && d.conversations) || [];
      if (!items.length) { box.appendChild(emptyP("no saved sessions yet.")); return; }
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
      var cv = d && d.conversation;
      if (!cv) { status("couldn't load that session."); return; }
      state.convId = cv.id;
      $("conv-title").value = cv.title || "untitled session";
      var msgs = Array.isArray(cv.messages) ? cv.messages : [];
      state.messages = msgs.length ? msgs : [{ role: "assistant", content: OPENING }];
      render();
    }).catch(function () { status("couldn't load that session."); });
  }
  function emptyP(t) { return el("p", "empty", t); }

  // ---- wire up --------------------------------------------------------------
  $("send").addEventListener("click", send);
  sayEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sayEl.addEventListener("input", function () {
    sayEl.style.height = "auto"; sayEl.style.height = Math.min(sayEl.scrollHeight, 144) + "px";
  });
  $("save-conv").addEventListener("click", saveConv);
  $("new-conv").addEventListener("click", newConv);

  render();
  loadArtifacts();
  loadConversations();
})();
