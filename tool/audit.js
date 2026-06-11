// The CRD Audit — a deterministic, two-input instrument.
// Sentence A = the claim, taken from the COPY.
// Sentence B = the architectural reality, taken from the ARCHITECTURE/CODE you paste.
// The instrument fires when A asserts a certainty that B contradicts. It does the
// real work only when you give it B — without the architecture it can only flag
// candidates. Everything runs in your browser; nothing is sent anywhere.

// ---- markers found in the ARCHITECTURE / CODE input -------------------------
const PROBABILISTIC = [
  /\bprobabilistic\b/i, /\bstochastic\b/i, /\bnon[- ]?deterministic\b/i,
  /\b(LLM|large language model|language model|transformer|GPT|claude|gemini|llama|mistral)\b/i,
  /\b(classifier|classif\w+|\bML\b|machine learning|neural|deep learning)\b/i,
  /\b(embedding|vector search|semantic|RAG|retrieval[- ]augmented)\b/i,
  /\b(confidence|probabilit\w+|score|threshold|softmax|logits?|temperature|sampling|top[- ]?[kp])\b/i,
  /\b(recall|precision|f1|accuracy|auc|false (positive|negative))\b/i,
  /\b(heuristic|pattern[- ]?match\w*|best[- ]?effort|fuzzy|approximat\w+)\b/i,
  /\b(may|might|sometimes|often|typically|usually|likely|tends? to|in most cases)\b/i,
  /\b(detect\w*|flag\w*|predict\w*|infer\w*|estimat\w*)\b/i,
  /\b\d{1,3}(\.\d+)?\s?%/,
  /(model\.(predict|generate|classify|invoke|complete)|\.generate\(|\.predict\(|openai|anthropic|inference)/i,
];
const DETERMINISTIC = [
  /\bdeterministic\b/i, /\bconstant[- ]?time\b/i,
  /\b(sha-?\d*|md5|hash\w*|hash[- ]?chain\w*)\b/i,
  /\b(cryptograph\w+|signature|signed|HMAC|key pair|public key|private key)\b/i,
  /\b(allow[- ]?list|deny[- ]?list|whitelist|blocklist|block[- ]?list)\b/i,
  /\b(regex|regular expression|exact match|string match|enum|schema|assert\w*)\b/i,
  /\b(policy engine|rule[- ]?based|if[- ]?else|switch statement|finite state)\b/i,
];
const ATTESTATION = [
  /\b(TEE|trusted execution|hardware attestation|remote attestation|attestation|HSM|secure enclave|SGX|TPM)\b/i,
];

// ---- claim detectors, run against the COPY ----------------------------------
// kind: how the architecture resolves the claim.
//   'contradiction' — PROBABILISTIC evidence in B refutes the claim.
//   'integrity'     — needs ATTESTATION in B or it's a bounded (partial) claim.
//   'soft'          — B can't fully settle it; surfaced as a candidate to check.
const PROBES = [
  { id: "determinism", kind: "contradiction", name: "Determinism over a probabilistic layer",
    triggers: [/\bdeterministic\b/i, /\bnot a (model )?guess\b/i, /\bbinary decision\b/i, /\balways (produces|returns|blocks|catches|detects)\b/i],
    reality: "Determinism is a property of the enforcement gate, not the judgment beneath it. If a semantic/ML/LLM layer reads intent before the decision, that reading is probabilistic — a confidence score, not a proof.",
    honest: "The gate is deterministic — same input, same outcome. Name where the probabilistic layer's judgment ends and the gate's authority begins." },
  { id: "absolutes", kind: "contradiction", name: "Absolute guarantee in probabilistic grammar",
    triggers: [/\bguarantee[ds]?\b/i, /\b100\s?%/i, /\bzero (false positives|risk|breaches|errors)\b/i, /\bnever (fails|breached|wrong|misses)\b/i, /\b(cannot|can't|impossible to) (be )?(broken|hacked|bypassed|breached|defeated)\b/i, /\bfully (secure|protected|safe)\b/i, /\bcomplete(ly)? (secure|protected|safe|coverage)\b/i, /\bfoolproof\b/i],
    reality: "A system built on statistical or networked components operates within distributions, not certainties. An absolute — 'guaranteed', '100%', 'never fails' — is a property almost no real architecture can carry end to end.",
    honest: "State the measured rate and its conditions ('catches the known-known at ~X% recall'), not an absolute." },
  { id: "verbdrift", kind: "contradiction", name: "Verb drift — detect stated as prevent",
    triggers: [/\bprevents? all\b/i, /\bblocks all\b/i, /\bstops all\b/i, /\beliminates (all )?(threats|attacks|risk)\b/i, /\bensures no\b/i, /\bremoves all\b/i],
    reality: "A control that detects does not prevent; one that flags known patterns does not stop unknown ones. The verb claims an operation the architecture performs only against what it has already seen.",
    honest: "Use the verb the system earns: detects, flags, reduces, raises the cost of. Reserve 'prevents' for what a deterministic boundary actually enforces." },
  { id: "unbreakable", kind: "contradiction", name: "Unbreakable / impenetrable",
    triggers: [/\bunbreakable\b/i, /\bunhackable\b/i, /\bimpenetrable\b/i, /\bbullet[- ]?proof\b/i, /\bbreach[- ]?proof\b/i],
    reality: "No deployed system is unbreakable. The claim describes an aspiration, not an architecture, and the most sensitive reader reads it as the tell that the rest of the copy is unaudited.",
    honest: "Describe what the control resists and how it fails — 'resists the known injection classes; degrades to detect-and-disclose on novel input.'" },
  { id: "tamperproof", kind: "integrity", name: "Integrity claim without a threat model",
    triggers: [/\btamper[- ]?proof\b/i, /\bimmutable\b/i, /\btamper[- ]?evident\b/i],
    reality: "Cryptographic chaining proves a record is internally consistent. It does not prove the code that produced it was unmodified. Without hardware attestation, an admin with root over the signing infrastructure can rewrite and re-sign the chain.",
    honest: "Name the scope: 'cannot be altered without detection, given honest administrators and controlled signing infrastructure.' Point to attestation for the execution-context case." },
  { id: "neutrality", kind: "soft", name: "Neutrality / objectivity overclaim",
    triggers: [/\b(objective|unbiased|bias[- ]?free|perfectly neutral)\b/i, /\bjust reads the data\b/i, /\breads what'?s there\b/i],
    reality: "A classifier is bounded by the taxonomy it was trained on. 'Objective' usually means 'consistent within an undocumented label set.'",
    honest: "Claim consistency, not objectivity. Document where the category boundaries come from." },
  { id: "superlative", kind: "soft", name: "Unearned superlative",
    triggers: [/\bworld'?s (first|only)\b/i, /\b(the )?(first|only) (platform|product|system|tool) (to|that)\b/i, /\bmilitary[- ]?grade\b/i, /\bbank[- ]?grade\b/i, /\bindustry[- ]?leading\b/i, /\bbest[- ]?in[- ]?class\b/i, /\bunmatched\b/i, /\bunparalleled\b/i, /\bstate[- ]?of[- ]?the[- ]?art\b/i],
    reality: "A superlative is a claim about the whole field, not the product. Unbacked, it's the cheapest signal to falsify.",
    honest: "Drop the superlative or earn it with a citation." },
];

// ---- the Cybersecurity Bill of Rights: copy checked against the twelve rights -
// Each article carries the anti-patterns it names. A violation is a phrase in the
// copy that the article explicitly refuses.
const BILL = [
  { art: "I", right: "The right to know what the system does — and what it does not do",
    triggers: [/\bmilitary[- ]?grade\b/i, /\bunbreakable\b/i, /\bbank[- ]?grade\b/i, /\bwe take your (security|privacy) seriously\b/i, /\b(100\s?%|fully|completely) (secure|protected|safe)\b/i, /\bunhackable\b/i],
    fail: "Overstated protection with no stated limits. Article I: capabilities plainly, limits just as plainly. 'Military-grade' and 'unbreakable' are not controls." },
  { art: "III", right: "The right to local processing",
    triggers: [/\b(our|the) (cloud|servers?|datacent\w+)\b/i, /\bupload(ed|s)? to (the )?cloud\b/i, /\bsync(ed|s)? to (the|our) (cloud|server)/i, /\bcloud[- ]?only\b/i, /\bsent to our\b/i],
    fail: "Processing shipped off-device by default. Article III: where a computation can run on a device you own, it should. Distance from your own data is not a feature." },
  { art: "IV", right: "The right to encryption that stays encrypted",
    triggers: [/\blawful access\b/i, /\bback[- ]?door\b/i, /\bmaster key\b/i, /\bkey escrow\b/i, /\bwe can (recover|reset|access) your (data|files|messages)\b/i, /\blaw enforcement access\b/i],
    fail: "A door built for the good guys is still a door. Article IV: no backdoors, no lawful access, no master keys in escrow." },
  { art: "V", right: "The right to legible failure",
    triggers: [/\ban incident affecting certain\b/i, /\bmay have been (affected|impacted|exposed)\b/i, /\bout of an abundance of caution\b/i, /\bcertain (users|accounts|customers) (may|might)\b/i, /\bwe take this seriously\b/i],
    fail: "A breach disclosure written to protect the company from you. Article V: what was taken, what it means, what to do now — in language a person can act on." },
  { art: "VI", right: "The right to refuse without penalty",
    triggers: [/\bopt[- ]?out\b/i, /\bpremium (tier|plan|version) (to|for)\b/i, /\bupgrade to (remove|disable|stop)\b/i, /\bpay (more |a premium )?to (not|stop|avoid|opt)\b/i],
    fail: "Protection used as bait in an upsell. Article VI: you don't pay a premium to not be tracked, and declining the data grab can't downgrade you." },
  { art: "VIII", right: "The right to inspection",
    triggers: [/\bproprietary (algorithm|system|technology|model)\b/i, /\bclosed[- ]?source\b/i, /\btrade secret\b/i, /\bsecurity through obscurity\b/i, /\bour secret sauce\b/i],
    fail: "Obscurity that protects the vendor's embarrassment, not your data. Article VIII: you, or someone you trust, can examine what you depend on." },
  { art: "XII", right: "The right to be forgotten — actually",
    triggers: [/\bsoft[- ]?delete\b/i, /\bdeactivat\w+\b/i, /\bretain(ed|s)? (your )?data for\b/i, /\bhidden from your (view|account)\b/i, /\bmarked as deleted\b/i],
    fail: "A delete button that only hides the data. Article XII: deletion means gone — from backups, logs, the training set, the partners it was shared with." },
];

// ---- text utilities ---------------------------------------------------------
function splitSentences(text) {
  const out = [];
  for (const block of text.split(/\n+/)) {
    const cleaned = block.replace(/^\s*[-*•|>#\d.]+\s*/, "").trim();
    if (!cleaned) continue;
    for (const p of cleaned.split(/(?<=[.!?;:—])\s+/)) {
      const s = p.trim();
      if (s.length > 2) out.push(s);
    }
  }
  return out;
}
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function hi(sentence, res) {
  let html = esc(sentence);
  for (const re of res) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    html = html.replace(g, (m) => `<mark>${m}</mark>`);
  }
  return html;
}
// collect the sentences in `text` that contain any of `markers`, with the marker shown
function evidence(text, markers, limit = 3) {
  const hits = [];
  for (const s of splitSentences(text)) {
    const matched = markers.filter((re) => re.test(s));
    if (matched.length) hits.push({ sentence: s, html: hi(s, matched) });
    if (hits.length >= limit) break;
  }
  return hits;
}

// ---- the audit --------------------------------------------------------------
function audit(copy, arch) {
  const hasArch = arch.trim().length > 0;
  const probEvidence = hasArch ? evidence(arch, PROBABILISTIC) : [];
  const detEvidence = hasArch ? evidence(arch, DETERMINISTIC) : [];
  const hasProb = probEvidence.length > 0;
  const hasDet = detEvidence.length > 0;
  const hasAttest = hasArch && ATTESTATION.some((re) => re.test(arch));

  const findings = [];
  const seen = new Set();
  for (const sentence of splitSentences(copy)) {
    for (const probe of PROBES) {
      if (!probe.triggers.some((re) => re.test(sentence))) continue;
      const key = probe.id + "::" + sentence.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      let tier, sentenceB, evid = [];
      if (probe.kind === "contradiction") {
        if (!hasArch) { tier = "check"; sentenceB = probe.reality; }
        else if (hasProb) { tier = "fires"; evid = probEvidence; sentenceB = "Your architecture shows a probabilistic component — the claim's certainty outruns it:"; }
        else if (hasDet) { tier = "clear"; evid = detEvidence; sentenceB = "Your architecture reads as deterministic, with no probabilistic component surfaced. The claim is supported by what you pasted:"; }
        else { tier = "check"; sentenceB = "Nothing in the architecture you pasted resolves this either way. " + probe.reality; }
      } else if (probe.kind === "integrity") {
        if (hasAttest) { tier = "clear"; evid = evidence(arch, ATTESTATION); sentenceB = "Your architecture names hardware attestation, which closes the execution-context gap:"; }
        else if (hasArch) { tier = "partial"; evid = evidence(arch, [/\b(admin|root|signing|key|operator|self[- ]?host)\w*/i]); sentenceB = "Cryptographic chaining proves the record is consistent, but nothing you pasted proves the execution context was unmodified (no attestation). Whether the gap matters depends on the threat model:"; }
        else { tier = "partial"; sentenceB = probe.reality; }
      } else { // soft
        tier = "check";
        sentenceB = probe.reality;
      }
      findings.push({ tier, probe, sentence, html: hi(sentence, probe.triggers), sentenceB, evid });
    }
  }
  // second audit: the copy against the Cybersecurity Bill of Rights
  const bill = [];
  const billSeen = new Set();
  for (const sentence of splitSentences(copy)) {
    for (const a of BILL) {
      if (!a.triggers.some((re) => re.test(sentence))) continue;
      const key = a.art + "::" + sentence.toLowerCase();
      if (billSeen.has(key)) continue;
      billSeen.add(key);
      bill.push({ art: a.art, right: a.right, fail: a.fail, sentence, html: hi(sentence, a.triggers) });
    }
  }
  return { hasArch, hasProb, hasDet, hasAttest, sentences: splitSentences(copy).length, findings, bill };
}

// ---- rendering --------------------------------------------------------------
const TIER = {
  fires: { label: "Fires", note: "the copy's confidence contradicts the architecture" },
  partial: { label: "Partial", note: "bounded claim — depends on the threat model" },
  check: { label: "Check", note: "candidate — supply the architecture to settle it" },
  clear: { label: "Supported", note: "the architecture backs the claim" },
};
const ORDER = ["fires", "partial", "check", "clear"];

function render(r) {
  const el = document.getElementById("results");
  const n = (t) => r.findings.filter((f) => f.tier === t).length;
  const fired = n("fires"), partial = n("partial");
  let verdict, vclass;
  if (fired) { verdict = "Confidence–reality divergence found"; vclass = "v-fires"; }
  else if (partial || n("check")) { verdict = r.hasArch ? "Bounded claims to check" : "Candidates — no architecture supplied"; vclass = "v-some"; }
  else { verdict = "No divergence the instrument fires on"; vclass = "v-clean"; }

  let html = `<div class="verdict ${vclass}"><strong>${verdict}</strong><span>${r.sentences} claim-sentences read${r.hasArch ? ` · architecture: ${r.hasProb ? "probabilistic component detected" : r.hasDet ? "deterministic" : "no decisive markers"}${r.hasAttest ? " · attestation present" : ""}` : " · no architecture pasted"}</span></div>`;

  if (!r.hasArch && r.findings.length) {
    html += `<p class="discipline" style="margin-top:0;border:none;padding-top:0">You pasted copy but no architecture. The instrument can only flag <em>candidate</em> claims below — it cannot run the two-sentence test until you give it Sentence B. Paste the spec, the design doc, or the actual code in the second box and run it again.</p>`;
  }
  if (!r.findings.length && !r.bill.length) {
    html += `<p class="empty">No claim signatures matched, against the architecture or the Bill of Rights. Either the copy states what the system does and does not guarantee, or its claims aren't of the kind this instrument is calibrated for. A clean read is not a proof of honesty.</p>`;
    el.innerHTML = html; return;
  }

  html += `<h2 class="section-h">Against the architecture <em>— confidence vs. reality</em></h2>`;
  if (!r.findings.length) html += `<p class="empty">No confidence–reality signatures found in the copy.</p>`;
  for (const tier of ORDER) {
    const group = r.findings.filter((f) => f.tier === tier);
    if (!group.length) continue;
    const m = TIER[tier];
    html += `<div class="tier tier-${tier}"><h3><span class="badge">${m.label}</span> <em>${m.note}</em></h3>`;
    for (const f of group) {
      html += `<div class="finding">
        <p class="sa"><span class="k">Sentence A — the claim, from your copy</span>${f.html}</p>
        <p class="probe">${f.probe.name}</p>
        <p class="sb"><span class="k">Sentence B — the architectural reality</span>${esc(f.sentenceB)}</p>`;
      if (f.evid && f.evid.length) {
        html += `<div class="ev"><span class="k">From your architecture</span>${f.evid.map((e) => `<blockquote>${e.html}</blockquote>`).join("")}</div>`;
      }
      if (tier !== "clear") html += `<p class="honest"><span class="k">The honest version</span>${esc(f.probe.honest)}</p>`;
      html += `</div>`;
    }
    html += `</div>`;
  }
  if (r.bill.length) {
    html += `<h2 class="section-h">Against the Cybersecurity Bill of Rights <em>— rights as properties, not promises</em></h2>`;
    for (const b of r.bill) {
      html += `<div class="finding billf">
        <p class="sa"><span class="k">Article ${b.art} — ${esc(b.right)}</span>${b.html}</p>
        <p class="sb"><span class="k">Why the copy fails the right</span>${esc(b.fail)}</p></div>`;
    }
  } else if (r.findings.length) {
    html += `<h2 class="section-h">Against the Cybersecurity Bill of Rights</h2><p class="empty">No article violations detected in the copy.</p>`;
  }
  html += `<p class="discipline">A finding is real only when both sentences are independently checkable and a non-theoretical reader confirms they contradict. This instrument pairs them and points; the confirmation is still yours. It is calibrated to fire on the gap, not on the existence of something critical to say. The Bill of Rights pass checks the same copy against <a href="/essays/cybersecurity-bill-of-rights.html">the twelve rights</a> — properties a system must have, not promises it makes.</p>`;
  el.innerHTML = html;
}

// ---- examples (paired copy + architecture) ----------------------------------
const EXAMPLES = {
  determinism: {
    copy: "Policy-driven binary decision — not a probabilistic model guess. Our deterministic engine guarantees every threat is blocked before it reaches your stack.",
    arch: "Pipeline: incoming request → fine-tuned transformer classifier labels intent (confidence threshold 0.85) → allowlist gate enforces the label. Measured recall on known attacks ~80%. Novel phrasings may be missed.",
  },
  integrity: {
    copy: "Immutable audit record — tamper-proof by design. A complete, unbreakable chain of custody.",
    arch: "Audit entries are SHA-256 hash-chained. The signing key is held by the customer's own admin on self-hosted infrastructure. No hardware attestation or TEE.",
  },
  honest: {
    copy: "The enforcement gate is deterministic — the same input always produces the same policy outcome. The semantic layer that reads intent before the gate is AI-based and probabilistic.",
    arch: "Gate = regex allowlist + signed policy (deterministic). Intent classification = LLM with a confidence score (probabilistic). The boundary between them is documented in the spec.",
  },
};

window.addEventListener("DOMContentLoaded", () => {
  const copy = document.getElementById("copy");
  const arch = document.getElementById("arch");
  document.getElementById("run").addEventListener("click", () => {
    if (!copy.value.trim()) { document.getElementById("results").innerHTML = `<p class="empty">Paste the marketing or technical copy in the first box, then run the audit.</p>`; return; }
    render(audit(copy.value, arch.value));
    document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.querySelectorAll("[data-example]").forEach((b) =>
    b.addEventListener("click", () => { const e = EXAMPLES[b.dataset.example]; copy.value = e.copy; arch.value = e.arch; copy.focus(); }));
});
