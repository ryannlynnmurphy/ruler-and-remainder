// Workstation shell for Dorothy's workspace. Reflects only real state:
// the live mission, how a turn routed, the sources it stood on, and errors.

(function (global) {
  function $(id) { return document.getElementById(id); }

  // The only alert that fires is a real failure from the stream; everything
  // else clears it. No fabricated "waiting on approval" states.
  function setRunState(state) {
    const bar = $("ws-alert");
    if (bar) {
      if (state === "error") {
        bar.hidden = false;
        bar.textContent = "that turn failed — try again or simplify the request.";
        bar.dataset.tone = "error";
      } else {
        bar.hidden = true;
      }
    }
    document.body.dataset.run = state;
  }

  function setMission(text) {
    const title = $("mission-title");
    const obj = $("mission-objective");
    if (title) title.textContent = text ? text.slice(0, 72) + (text.length > 72 ? "…" : "") : "new inquiry";
    if (obj) obj.textContent = text || "ask for an outcome — Dorothy will tier what's real.";
  }

  function setRoute(routed, model) {
    const el = $("route-note");
    if (!el) return;
    if (!routed && !model) { el.textContent = ""; return; }
    const tier = routed?.tier || "";
    const by = routed?.by || "";
    el.textContent = [tier && `tier · ${tier}`, model, by && `via ${by}`].filter(Boolean).join(" · ");
  }

  function setEvidence(sources) {
    const ev = $("inspector-evidence");
    const nCorpus = sources?.corpus?.length || 0;
    const nWeb = sources?.web?.length || 0;
    const total = nCorpus + nWeb;
    if (ev) {
      if (!total) ev.innerHTML = `<p class="insp-copy muted">sources appear here once Dorothy grounds an answer in the corpus or the web.</p>`;
      else {
        const items = (sources.corpus || []).map((t) => `<li><a href="/corpus">${escapeHtml(t)}</a><span class="src-tag">corpus</span></li>`)
          .concat((sources.web || []).map((w) => `<li><a href="${escapeHtml(w.url)}" target="_blank" rel="noopener">${escapeHtml(w.title || w.url)}</a><span class="src-tag">web</span></li>`));
        ev.innerHTML = `<ul class="source-list">${items.join("")}</ul>`;
      }
    }
    const rail = $("source-list");
    if (rail && total) {
      rail.innerHTML = ev?.querySelector(".source-list")?.innerHTML || "";
      if (global.Pandora) Pandora.unlock("retrieval", false);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function onWorkstationEvent(e) {
    const d = e.detail || {};
    switch (d.type) {
      case "run-start":
        setRunState("executing");
        break;
      case "run-route":
        setRoute(d.routed, d.model);
        break;
      case "run-sources":
        setEvidence(d.sources);
        break;
      case "run-complete":
        setRunState("idle");
        if (d.routed || d.model) setRoute(d.routed, d.model);
        if (d.sources) setEvidence(d.sources);
        break;
      case "run-error":
        setRunState("error");
        break;
      case "run-stop":
        setRunState("idle");
        break;
      case "mission":
        setMission(d.text);
        break;
      default:
        break;
    }
  }

  function initGlobalStop() {
    $("global-stop")?.addEventListener("click", () => {
      global.dispatchEvent(new CustomEvent("rr-stop"));
    });
  }

  function init() {
    setRunState("idle");
    initGlobalStop();
    global.addEventListener("rr-workstation", onWorkstationEvent);
    if (global.Pandora?.isOpen("retrieval")) {
      document.getElementById("workspace")?.classList.add("has-inspector");
    }
    global.addEventListener("pandora:unlock", (e) => {
      if (e.detail?.layer === "retrieval") {
        document.getElementById("workspace")?.classList.add("has-inspector");
      }
    });
  }

  function emit(type, detail) {
    global.dispatchEvent(new CustomEvent("rr-workstation", { detail: { type, ...detail } }));
  }

  global.Workstation = { emit, setMission };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
