// The Lens — point your research at the world.
//
// Paste any text (a headline, a hype claim, a paragraph, a press release) and the
// dramaturg reads it THROUGH the researcher's own corpus: retrieves the most
// relevant passages (semantic, falling back to keyword), then returns a calibrated
// media-literacy reading that cites the researcher's own work and tiers every
// claim. An instrument, not a chat — retrieval-first, deference over bluffing.
//
// POST { text } -> { reading, sources, mode }

import { corpusRetrieve, bumpRateLimit } from "../lib/db.js";

export const maxDuration = 60;

const PER_IP_PER_HOUR = 40;
const MAX_CHARS = 8000;
const MODEL = "claude-sonnet-4-6";

const SYSTEM = `You are the dramaturg — but here you are an instrument, not a conversation. The researcher points you at a piece of the world and you read it THROUGH their own research corpus. You are calibrated: you ground claims in their actual passages, cite by title, and tier. You do not improvise new research, and you do not bluff.

You are given the TEXT and PASSAGES retrieved from the researcher's own corpus. Produce a media-literacy reading in markdown with these sections:

## what it says
The surface claim, one or two plain sentences. No euphemism, no hedging.

## what it hides
Hidden assumptions; who is served (owner, beneficiary, money or power motive); manufactured fear vs. faith in people; missing context. Name them specifically.

## what your research says
The heart of the reading. Ground STRICTLY in the PASSAGES — where the corpus illuminates, contradicts, sharpens, or extends this text. Cite by title in parentheses, e.g. (Legibilism). If the passages genuinely do not speak to this, write "Your corpus doesn't speak to this directly" and say what's missing — do NOT invent corpus content.

## why it won't hold
Only if the text is a forecast or hype: the architectural counter — what's durable is local, sovereign, legible, repairable. Tier it. Omit this section otherwise.

## the move
One sharp, usable line in the researcher's own register — what to do or say with this.

## check
One line: what a careful reader should independently verify, and what the corpus does NOT cover here.

Rules: tier every nontrivial claim [established] / [exploratory] / [speculative], and never let the tiers certify each other. Separate what the corpus SAYS from what you INFER. No hype, no preamble, no AI clichés (no "delve", "tapestry", "landscape", "in an increasingly ___ world"). Editorial severity. If the corpus is silent, be honest that this is a general reading, not a grounded one.`;

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
  if (!process.env.ANTHROPIC_API_KEY) { res.status(503).json({ error: "the lens isn't configured yet." }); return; }

  try {
    const n = await bumpRateLimit(`lens:${clientIp(req)}:${hourBucket(new Date())}`);
    if (n !== null && n > PER_IP_PER_HOUR) { res.status(429).json({ error: "you've used the lens a lot this hour — let it rest." }); return; }
  } catch { /* proceed */ }

  let body;
  try { body = await readJsonBody(req); }
  catch { res.status(400).json({ error: "couldn't read the request." }); return; }

  const text = typeof body.text === "string" ? body.text.slice(0, MAX_CHARS).trim() : "";
  if (!text) { res.status(400).json({ error: "bring me something to read — paste a headline, a claim, a paragraph." }); return; }

  // retrieve from the researcher's corpus (semantic, keyword fallback)
  let results = [], mode = "keyword";
  try { ({ results, mode } = await corpusRetrieve(text, { k: 6 })); } catch { /* read ungrounded */ }
  const sources = [...new Set(results.map((r) => r.title))];
  const passages = results.length
    ? results.map((r, i) => `[${i + 1}] From "${r.title}"${r.heading ? ` — ${r.heading}` : ""}:\n${r.text}`).join("\n\n")
    : "(no passages retrieved — the corpus is silent on this; give a general reading and say so)";

  const user = `TEXT TO READ:\n${text}\n\n---\n\nPASSAGES FROM YOUR CORPUS:\n${passages}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 2000, system: SYSTEM, messages: [{ role: "user", content: user }] }),
    });
    if (!r.ok) { res.status(502).json({ error: "the lens didn't focus. try again." }); return; }
    const data = await r.json();
    const reading = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    res.status(200).json({ reading: reading || "the lens returned nothing.", sources, mode });
  } catch (err) {
    console.error("lens failed:", err.message || err);
    res.status(502).json({ error: "the lens didn't focus. try again in a moment." });
  }
}
