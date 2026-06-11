// The CRD Audit — a deterministic instrument.
// Treats pasted copy as a model output and surfaces candidate
// Confidence–Reality Divergences: places where stated confidence
// outruns architectural reality. It surfaces candidates; the analyst
// completes the two-sentence test. By design it does not fire on
// everything — that discipline is the whole value.

const PROBES = [
  {
    id: "determinism",
    tier: "fires",
    name: "Determinism over a probabilistic layer",
    triggers: [
      /\bdeterministic\b/i,
      /\bnot a (model )?guess\b/i,
      /\bbinary decision\b/i,
      /\balways (produces|returns|blocks|catches|detects)\b/i,
    ],
    // If the copy already names the boundary, the instrument should NOT fire.
    suppressIf: /\bprobabilistic\b/i,
    suppressNeeds: /\b(semantic|LLM|AI-?based|classifier|model|machine learning|ML)\b/i,
    reality:
      "Determinism is a property of the enforcement gate, not of the judgment beneath it. If a semantic / ML / LLM layer reads intent or content before the decision, that reading is probabilistic — a confidence score, not a proof.",
    honest:
      "The gate is deterministic — same input, same outcome. Name where the probabilistic layer's judgment ends and the gate's authority begins.",
  },
  {
    id: "absolutes",
    tier: "fires",
    name: "Absolute guarantee in probabilistic grammar",
    triggers: [
      /\bguarantee[ds]?\b/i,
      /\b100\s?%\b/i,
      /\bzero (false positives|risk|breaches|errors)\b/i,
      /\bnever (fails|breached|wrong|misses)\b/i,
      /\b(cannot|can't|impossible to) (be )?(broken|hacked|bypassed|breached|defeated)\b/i,
      /\bfully (secure|protected|safe)\b/i,
      /\bcomplete(ly)? (secure|protected|safe|coverage)\b/i,
      /\bfoolproof\b/i,
    ],
    reality:
      "A system built on statistical or networked components operates within distributions, not certainties. An absolute — 'guaranteed', '100%', 'never fails' — is a property almost no real architecture can carry end to end.",
    honest:
      "State the measured rate and its conditions ('catches the known-known at ~X% recall'), not an absolute. The bounded claim survives scrutiny the absolute won't.",
  },
  {
    id: "tamperproof",
    tier: "partial",
    name: "Integrity claim without a threat model",
    triggers: [
      /\btamper[- ]?proof\b/i,
      /\bimmutable\b/i,
      /\btamper[- ]?evident\b/i,
    ],
    reality:
      "Cryptographic chaining proves a record is internally consistent. It does not prove the code that produced it was unmodified. Without hardware attestation, an admin with root over the signing infrastructure can rewrite and re-sign the chain. Whether the gap matters depends on the threat model — insider vs. external.",
    honest:
      "Name the scope: 'the record cannot be altered without detection, given honest administrators and controlled signing infrastructure.' Point to attestation for the execution-context case.",
  },
  {
    id: "unbreakable",
    tier: "fires",
    name: "Unbreakable / impenetrable",
    triggers: [
      /\bunbreakable\b/i,
      /\bunhackable\b/i,
      /\bimpenetrable\b/i,
      /\bbullet[- ]?proof\b/i,
      /\bbreach[- ]?proof\b/i,
    ],
    reality:
      "No deployed system is unbreakable. The claim describes an aspiration, not an architecture, and the most sensitive reader reads it as the tell that the rest of the copy is unaudited.",
    honest:
      "Describe what the control resists and how it fails — 'resists the known injection classes; degrades to detect-and-disclose on novel input.' Failure modes stated build more trust than their denial.",
  },
  {
    id: "verbdrift",
    tier: "fires",
    name: "Verb drift — detect stated as prevent",
    triggers: [
      /\bprevents? all\b/i,
      /\bblocks all\b/i,
      /\bstops all\b/i,
      /\beliminates (all )?(threats|attacks|risk)\b/i,
      /\bensures no\b/i,
      /\bremoves all\b/i,
    ],
    reality:
      "A control that detects does not prevent; one that flags known patterns does not stop unknown ones. The verb claims an operation the architecture performs only against what it has already seen.",
    honest:
      "Use the verb the system earns: detects, flags, reduces, raises the cost of. Reserve 'prevents' for what a deterministic boundary actually enforces.",
  },
  {
    id: "neutrality",
    tier: "check",
    name: "Neutrality / objectivity overclaim",
    triggers: [
      /\b(objective|unbiased|bias[- ]?free|perfectly neutral)\b/i,
      /\bjust reads the data\b/i,
      /\breads what'?s there\b/i,
    ],
    reality:
      "A classifier is bounded by the taxonomy it was trained on. It applies its categories consistently; it cannot see what those categories don't capture. 'Objective' usually means 'consistent within an undocumented label set.'",
    honest:
      "Claim consistency, not objectivity: 'applies its trained categories the same way every time.' Document where the category boundaries come from.",
  },
  {
    id: "superlative",
    tier: "check",
    name: "Unearned superlative",
    triggers: [
      /\bworld'?s (first|only)\b/i,
      /\b(the )?(first|only) (platform|product|system|tool) (to|that)\b/i,
      /\bmilitary[- ]?grade\b/i,
      /\bbank[- ]?grade\b/i,
      /\bindustry[- ]?leading\b/i,
      /\bbest[- ]?in[- ]?class\b/i,
      /\bunmatched\b/i,
      /\bunparalleled\b/i,
      /\bstate[- ]?of[- ]?the[- ]?art\b/i,
      /\brevolutionary\b/i,
    ],
    reality:
      "A superlative is a claim about the whole field, not the product. 'First', 'only', 'military-grade' must be paid for by something checkable; unbacked, they're the cheapest signal to falsify.",
    honest:
      "Drop the superlative or earn it with a citation. The specific, located claim ('does X, measured at Y') is stronger than the ranking.",
  },
];

// ---- sentence splitting ----------------------------------------------------
function splitSentences(text) {
  const out = [];
  // break on newlines and list markers first, then on sentence punctuation
  for (const block of text.split(/\n+/)) {
    const cleaned = block.replace(/^\s*[-*•|>#\d.]+\s*/, "").trim();
    if (!cleaned) continue;
    const parts = cleaned.split(/(?<=[.!?;:—])\s+/);
    for (const p of parts) {
      const s = p.trim();
      if (s.length > 2) out.push(s);
    }
  }
  return out;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function highlight(sentence, triggers) {
  let html = escapeHtml(sentence);
  for (const re of triggers) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    html = html.replace(g, (m) => `<mark>${m}</mark>`);
  }
  return html;
}

// ---- the audit -------------------------------------------------------------
function audit(text) {
  const sentences = splitSentences(text);
  const findings = [];
  const seen = new Set();

  for (const sentence of sentences) {
    for (const probe of PROBES) {
      const hit = probe.triggers.some((re) => re.test(sentence));
      if (!hit) continue;

      // calibration: a determinism claim that already names its probabilistic
      // boundary is the honest version — the instrument must not fire on it.
      if (probe.suppressIf && probe.suppressIf.test(text)) {
        if (!probe.suppressNeeds || probe.suppressNeeds.test(text)) {
          findings.push({
            tier: "clear",
            probe,
            sentence,
            html: highlight(sentence, probe.triggers),
          });
          continue;
        }
      }

      const key = probe.id + "::" + sentence.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      findings.push({
        tier: probe.tier,
        probe,
        sentence,
        html: highlight(sentence, probe.triggers),
      });
    }
  }
  return { sentences: sentences.length, findings };
}

// ---- rendering -------------------------------------------------------------
const TIER_META = {
  fires: { label: "Fires", note: "confidence outruns architecture" },
  partial: { label: "Partial", note: "boundary-of-the-claim — depends on threat model" },
  check: { label: "Check", note: "candidate — confirm the claim is earned" },
  clear: { label: "Does not fire", note: "boundary already named — the honest form" },
};
const TIER_ORDER = ["fires", "partial", "check", "clear"];

function render(result) {
  const el = document.getElementById("results");
  const fires = result.findings.filter((f) => f.tier === "fires").length;
  const partial = result.findings.filter((f) => f.tier === "partial").length;
  const check = result.findings.filter((f) => f.tier === "check").length;
  const clear = result.findings.filter((f) => f.tier === "clear").length;
  const flagged = fires + partial + check;

  let verdict, vclass;
  if (fires > 0) { verdict = "Confidence–reality divergence found"; vclass = "v-fires"; }
  else if (partial + check > 0) { verdict = "Candidates to check"; vclass = "v-some"; }
  else { verdict = "No divergence the instrument fires on"; vclass = "v-clean"; }

  let html = `
  <div class="verdict ${vclass}">
    <strong>${verdict}</strong>
    <span>${result.sentences} sentences read · ${flagged} flagged${clear ? ` · ${clear} read as honest` : ""}</span>
  </div>`;

  if (result.findings.length === 0) {
    html += `<p class="empty">Nothing fired. Either the copy states what the architecture
      does and does not guarantee, or the claims aren't of the kind this instrument is
      calibrated for. A clean read here is not a proof of honesty — it means the specific
      overclaim signatures weren't present.</p>`;
    el.innerHTML = html;
    return;
  }

  for (const tier of TIER_ORDER) {
    const group = result.findings.filter((f) => f.tier === tier);
    if (!group.length) continue;
    const m = TIER_META[tier];
    html += `<div class="tier tier-${tier}"><h3><span class="badge">${m.label}</span> <em>${m.note}</em></h3>`;
    for (const f of group) {
      html += `
      <div class="finding">
        <p class="sa"><span class="k">Sentence A — the claim, as found</span>${f.html}</p>
        <p class="probe">${f.probe.name}</p>`;
      if (tier !== "clear") {
        html += `
        <p class="sb"><span class="k">Sentence B — the architectural reality to check</span>${escapeHtml(f.probe.reality)}</p>
        <p class="honest"><span class="k">The honest version</span>${escapeHtml(f.probe.honest)}</p>`;
      } else {
        html += `<p class="sb"><span class="k">Why it does not fire</span>The copy names the probabilistic boundary itself. Architecture reading honestly is not a finding.</p>`;
      }
      html += `</div>`;
    }
    html += `</div>`;
  }

  html += `<p class="discipline">This instrument surfaces <em>candidates</em>. A finding is real only
    when two sentences can be written — the claim as found, and the architectural reality from the spec —
    and a non-theoretical reader confirms they contradict. It is calibrated to fire on the gap, not on
    the existence of something critical to say.</p>`;

  el.innerHTML = html;
}

// ---- examples (the three cases from the essay) -----------------------------
const EXAMPLES = {
  determinism:
    "Policy-driven binary decision — not a probabilistic model guess. Our deterministic engine guarantees every threat is blocked before it reaches your stack. 100% coverage, zero false negatives.",
  integrity:
    "Immutable audit record, tamper-proof by design. An unbreakable, military-grade chain of custody that the first platform in the category to ship it can offer.",
  honest:
    "The enforcement gate is deterministic — the same input always produces the same policy outcome. The semantic layer that reads intent and context before the gate is AI-based and probabilistic, so the policy is precise about where that layer's judgment ends and the gate's authority begins.",
};

// ---- wire up ---------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const run = document.getElementById("run");
  run.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) { document.getElementById("results").innerHTML =
      `<p class="empty">Paste some marketing or technical copy above, then run the audit.</p>`; return; }
    render(audit(text));
    document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.querySelectorAll("[data-example]").forEach((b) =>
    b.addEventListener("click", () => {
      input.value = EXAMPLES[b.dataset.example];
      input.focus();
    })
  );
});
