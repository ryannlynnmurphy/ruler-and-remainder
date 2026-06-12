// The workshop — the Studio dramaturg as a lab instrument. You point a MODE at
// specific documents you've selected from the corpus, and it runs a calibrated,
// cited, tiered task: walk through one, synthesize many, scaffold a deliverable,
// or critique. Retrieval is by selection (you choose the docs), not search — the
// precision of an instrument.
//
// POST { mode, itemIds[], target?, instruction? } -> { output, mode, items }

import { getCorpusItem, bumpRateLimit } from "../lib/db.js";

export const maxDuration = 60;

const PER_IP_PER_HOUR = 40;
const PER_ITEM_CHARS = 9000;     // cap each doc so a book doesn't blow the context
const HEAVY = new Set(["synthesis", "plan"]); // use the stronger model

const PREAMBLE = `You are the dramaturg operating as a research instrument — calibrated, not conversational. Ground STRICTLY in the provided DOCUMENTS. Cite by title (and section heading where useful), e.g. (Legibilism — The Discipline). Tier every nontrivial claim [established] / [exploratory] / [speculative], and never let the tiers certify each other. Separate what the documents SAY from what you INFER. If the documents do not support something, say so plainly — never invent. No hype, no preamble, no AI clichés (no "delve", "tapestry", "landscape"). Your output is a lab artifact: clean, headed markdown a person could paste into a doc.`;

const MODES = {
  walkthrough: {
    min: 1, max: 1, label: "Scene Walkthrough",
    body: `MODE: SCENE WALKTHROUGH. Walk through the single document as a scene in the research:
## the stake
The central question or claim the document is built around. What is it for?
## the claims & evidence
Each main claim, and the evidence the document gives for it — cite the section.
## assumptions & limits
What it assumes, what it doesn't establish, what it leaves out.
## next questions
3–5 questions a researcher should hold after reading it.`,
  },
  synthesis: {
    min: 2, max: 8, label: "Cross-Scene Synthesis",
    body: `MODE: CROSS-SCENE SYNTHESIS across the documents:
## each in a line
Each document's central claim, one line, cited by title.
## where they agree
The load-bearing agreements.
## where they pull apart
Tensions and contradictions — name the documents that conflict and on what.
## different ground
Where they rely on different assumptions, methods, or evidence.
## the gaps
What none of them resolves — the open questions the set raises together.`,
  },
  plan: {
    min: 1, max: 8, label: "Plan Scaffold",
    body: `MODE: PLAN SCAFFOLD. Draft a first-pass {TARGET}, grounded ONLY in the selected documents. Mark it clearly as a draft scaffold, not final text.
## objective
1–2 sentences: what this artifact is for.
## structure
3–7 sections. For each: its purpose, the key points, and 1–3 supporting citations.
## what's missing
A checklist of evidence the corpus does NOT yet contain that would make this stronger.`,
  },
  critique: {
    min: 1, max: 6, label: "Adversarial Critique",
    body: `MODE: ADVERSARIAL CRITIQUE. Make the argument harder to dismiss by attacking it honestly. Be ruthless toward the argument, never the author.
## where it's weak
The weakest claims, the overreach, fake profundity, places where vibe substitutes for evidence, where the argument hides. Name and cite each.
## what would disprove it
For the central claim: what evidence or counter-argument would actually undercut it?
## the strongest version
Rebuild it — the most defensible form of the argument, with what it would need to hold.`,
  },
};

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}
const hourBucket = (d) => d.toISOString().slice(0, 13);

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  if (req.method !== "POST") { res.status(405).json({ error: "method not allowed" }); return; }
  if (!process.env.ANTHROPIC_API_KEY) { res.status(503).json({ error: "the workshop isn't configured yet." }); return; }

  try {
    const n = await bumpRateLimit(`workshop:${clientIp(req)}:${hourBucket(new Date())}`);
    if (n !== null && n > PER_IP_PER_HOUR) { res.status(429).json({ error: "you've run a lot of passes this hour — let it rest." }); return; }
  } catch { /* proceed */ }

  let body;
  try { body = await readJsonBody(req); }
  catch { res.status(400).json({ error: "couldn't read the request." }); return; }

  const spec = MODES[body.mode];
  if (!spec) { res.status(400).json({ error: "unknown mode." }); return; }
  const ids = Array.isArray(body.itemIds) ? body.itemIds.slice(0, spec.max) : [];
  if (ids.length < spec.min) {
    res.status(400).json({ error: `${spec.label} needs ${spec.min === spec.max ? spec.min : "at least " + spec.min} document${spec.min === 1 && spec.max === 1 ? "" : "s"} selected.` });
    return;
  }

  // load the selected documents (retrieval by selection)
  let items = [];
  try { items = (await Promise.all(ids.map((id) => getCorpusItem(id)))).filter(Boolean); }
  catch { /* fall through */ }
  if (!items.length) { res.status(400).json({ error: "couldn't load the selected documents." }); return; }

  const docs = items.map((it, i) => {
    const claims = Array.isArray(it.claims) && it.claims.length ? `\nclaims: ${it.claims.map((c) => `“${c}”`).join("; ")}` : "";
    const bodyText = (it.body || "").slice(0, PER_ITEM_CHARS);
    const trunc = (it.body || "").length > PER_ITEM_CHARS ? "\n[…document truncated for length…]" : "";
    return `### DOCUMENT ${i + 1}: "${it.title}" [${it.authorship}/${it.kind}]\n${it.summary ? "summary: " + it.summary : ""}${claims}\n\n${bodyText}${trunc}`;
  }).join("\n\n---\n\n");

  const target = (body.target || "research memo").toString().slice(0, 80);
  const modeBody = spec.body.replace("{TARGET}", target);
  const extra = body.instruction ? `\n\nThe researcher adds: ${String(body.instruction).slice(0, 600)}` : "";
  const system = `${PREAMBLE}\n\n${modeBody}\n\nEnd every output with:\n## check\nOne line: the biggest risk in this output, and what the researcher should verify against the documents or the world.`;

  const model = HEAVY.has(body.mode) ? "claude-opus-4-8" : "claude-sonnet-4-6";
  const userMsg = `DOCUMENTS (${items.length}):\n\n${docs}${extra}`;

  try {
    const base = { model, max_tokens: 2600, system, messages: [{ role: "user", content: userMsg }] };
    if (model === "claude-opus-4-8") base.thinking = { type: "adaptive" };
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(base),
    });
    if (!r.ok) {
      let msg = `${r.status}`; try { const e = await r.json(); msg = e?.error?.message || msg; } catch {}
      console.error("workshop upstream:", msg);
      res.status(502).json({ error: "the pass didn't complete. try again." });
      return;
    }
    const data = await r.json();
    const output = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    res.status(200).json({ output: output || "the pass returned nothing.", mode: body.mode, model, items: items.map((i) => i.title) });
  } catch (err) {
    console.error("workshop failed:", err.message || err);
    res.status(502).json({ error: "the pass didn't complete. try again in a moment." });
  }
}
