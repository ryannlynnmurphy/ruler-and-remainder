// Pandora's Box — progressive disclosure for Dorothy's workspace.
// One chamber unlocks the next. Unlocks are sticky (high-water mark).

(function (global) {
  const STORAGE = "rr_pandora_layers.v1";
  const EVENT = "pandora:unlock";

  /** @typedef {"walk" | "chat" | "prompting" | "context" | "retrieval" | "tools" | "corpus"} Layer */
  /** @type {Layer[]} */
  const ORDER = ["walk", "chat", "prompting", "context", "retrieval", "tools", "corpus"];

  const LABELS = {
    walk: "the walk",
    chat: "ask",
    prompting: "shape",
    context: "remember",
    retrieval: "ground",
    tools: "act",
    corpus: "archive",
  };

  const HINTS = {
    prompting: "small changes in wording change the result.",
    context: "the machine has limits on what it can hold.",
    retrieval: "answers can stand on sources, not guesswork.",
    tools: "some tasks need tools, not just language.",
    corpus: "the research the dramaturg reads from.",
  };

  function readSticky() {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  }

  function writeSticky(sticky) {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(sticky));
    } catch {}
  }

  function rank(layer) {
    const i = ORDER.indexOf(layer);
    return i === -1 ? -1 : i;
  }

  /** @type {Record<Layer, boolean>} */
  let sticky = readSticky();

  function isOpen(layer) {
    return !!sticky[layer];
  }

  function unlock(layer, opts) {
    if (!ORDER.includes(layer)) return false;
    if (sticky[layer]) return false;
    sticky[layer] = true;
    writeSticky(sticky);
    applyDOM(layer, opts);
    global.dispatchEvent(new CustomEvent(EVENT, { detail: { layer } }));
    return true;
  }

  function applyDOM(layer, opts) {
    const root = document.querySelector(".pandora");
    if (!root) return;
    root.dataset.layer = currentLayer();

    document.querySelectorAll("[data-unlock]").forEach((el) => {
      const key = el.getAttribute("data-unlock");
      if (isOpen(key)) {
        el.classList.add("is-open");
        el.removeAttribute("hidden");
        if (key === "retrieval") document.getElementById("workspace")?.classList.add("has-inspector");
      }
    });

    const toast = document.getElementById("unlock-toast");
    if (toast && opts !== false) {
      toast.textContent = `chamber opened · ${LABELS[layer] || layer}`;
      toast.classList.add("is-visible");
      clearTimeout(applyDOM._t);
      applyDOM._t = setTimeout(() => toast.classList.remove("is-visible"), 3200);
    }

    if (layer === "walk" || layer === "chat") {
      const walk = document.getElementById("walk-chamber");
      const workspace = document.getElementById("workspace");
      if (walk && workspace && isOpen("chat")) {
        walk.classList.add("is-sealed");
        workspace.hidden = false;
        requestAnimationFrame(() => workspace.classList.add("is-open"));
      }
    }
  }

  function currentLayer() {
    for (let i = ORDER.length - 1; i >= 0; i--) {
      if (sticky[ORDER[i]]) return ORDER[i];
    }
    return "walk";
  }

  /** Usage-based ladder — tune thresholds here. */
  function checkUsage(usage) {
    const u = usage || {};
    if (u.walkComplete && !isOpen("chat")) unlock("chat");
    if (u.messages >= 1 && !isOpen("retrieval")) unlock("retrieval");
    if (u.messages >= 2 && !isOpen("prompting")) unlock("prompting");
    if (u.messages >= 3 && !isOpen("context")) unlock("context");
    if (u.messages >= 4 && !isOpen("tools")) unlock("tools");
    if (u.messages >= 1 && !isOpen("corpus")) unlock("corpus");
  }

  function parseUnlockTags(text) {
    if (!text) return text;
    return text.replace(/\[UNLOCK_LAYER:\s*([a-z]+)\s*\]/gi, (_, name) => {
      const layer = name.toLowerCase();
      if (ORDER.includes(layer)) unlock(layer);
      return "";
    });
  }

  function init() {
    if (!isOpen("chat") && localStorage.getItem("rr_walk_complete")) {
      sticky.chat = true;
      writeSticky(sticky);
    }
    ORDER.forEach((layer) => {
      if (sticky[layer]) applyDOM(layer, false);
    });
    applyDOM(currentLayer(), false);
  }

  global.Pandora = {
    ORDER,
    LABELS,
    HINTS,
    isOpen,
    unlock,
    checkUsage,
    parseUnlockTags,
    init,
    currentLayer,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
