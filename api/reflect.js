// The Reading Machine's "reread" step — the recursive reflection.
//
// GET → reads the corpus as a whole (every item's card: title, summary, claims,
// tags, authorship) and produces a Corpus Reflection: what the thinking is
// arguing, where it's evolving, what's contradictory, what's unresolved, and
// what to write next. This is the basic self-reading report (§9 MVP); the full
// self-reading engine (style drift, agent-failure, claim-evolution) comes later.
//
// Reads cards, not full bodies, so it scales as the corpus grows.

import { listCorpusItems, bumpRateLimit } from "../lib/db.js";

export const maxDuration = 60;

const REFLECT_SYSTEM = `You are reading a researcher's whole corpus at once — not to summarize each piece, but to see the body of work think. You are given a list of items, each with title, authorship (human/ai/co), summary, and claims.

Produce a CORPUS REFLECTION in markdown with these sections:

## what the corpus is arguing
The through-line. The 2-4 load-bearing claims the whole body is building toward. Name them.

## where it's evolving
What's getting sharper, what's recent, what direction the thinking is moving.

## tensions & contradictions
Where items pull against each other, or a claim in one undercuts another. Be specific — name the items.

## what's unresolved
Open loops. Claims asserted but not yet defended. Questions the corpus raises but hasn't answered.

## what to write next
2-3 concrete next pieces the corpus is ready to produce, each as a real title + one line on what it would do.

Rules: cite items by title. Distinguish what the corpus SAYS from what you INFER. Do not flatten the researcher's voice into corporate blandness. No "delve", "tapestry", "landscape", "rich and multifaceted". Concrete nouns, named items, real stakes. If the corpus is too small to reflect on, say so plainly and stop.`;

const MODEL = "claude-sonnet-4-6";

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}
const hourBucket = (d) => d.toISOString().slice(0, 13);

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  if (req.method !== "GET") { res.status(405).json({ error: "method not allowed" }); return; }
  if (!process.env.ANTHROPIC_API_KEY) { res.status(503).json({ error: "the machine isn't configured yet." }); return; }

  try {
    const ip = clientIp(req);
    const n = await bumpRateLimit(`reading:reflect:${ip}:${hourBucket(new Date())}`);
    if (n !== null && n > 20) { res.status(429).json({ error: "reflection is expensive — let the corpus breathe and come back soon." }); return; }
  } catch { /* proceed */ }

  let items;
  try { items = await listCorpusItems({ limit: 120, project: req.query?.project || null }); }
  catch { items = []; }

  if (!items || items.length < 2) {
    res.status(200).json({ report: "The corpus is too small to reflect on yet. Add a few documents — sources, notes, drafts — and the reading can begin.", count: items ? items.length : 0 });
    return;
  }

  const manifest = items.map((it, i) => {
    const tags = Array.isArray(it.tags) ? it.tags.join(", ") : "";
    const claims = Array.isArray(it.claims) && it.claims.length ? "\n   claims: " + it.claims.map((c) => `“${c}”`).join("; ") : "";
    return `${i + 1}. "${it.title}" [${it.authorship}/${it.kind}]\n   ${it.summary || "(no summary)"}${tags ? `\n   tags: ${tags}` : ""}${claims}`;
  }).join("\n\n");

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2400,
        system: REFLECT_SYSTEM,
        messages: [{ role: "user", content: `The corpus has ${items.length} items:\n\n${manifest}` }],
      }),
    });
    if (!r.ok) { res.status(502).json({ error: "the reading didn't complete. try again in a moment." }); return; }
    const data = await r.json();
    const report = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    res.status(200).json({ report: report || "the reading returned nothing.", count: items.length });
  } catch (err) {
    console.error("reflect failed:", err.message || err);
    res.status(502).json({ error: "the reading didn't complete. try again in a moment." });
  }
}
