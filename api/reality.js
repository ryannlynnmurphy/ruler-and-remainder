// The Reality Check — server-side. A Vercel serverless function.
//
// Reads an AI news story and returns the likely reality, using the corpus's
// method (confidence–reality divergence, the three tiers, the remainder) and
// the Cybersecurity Bill of Rights. The model call runs HERE, with the site's
// own key — no key required from the reader. Every check is rate-limited per
// visitor and, unless the reader opts out, written to a public ledger.
//
// House style: raw fetch to the Messages API, matching api/feed.js (the project
// carries no SDK; its only dependency is `marked`).

import { recordCheck, bumpRateLimit } from "../lib/db.js";

// Grounding (Tavily retrieval + Claude's own web_search rounds) can run long, so
// give the function room beyond the platform's short default.
export const maxDuration = 60;

const ALLOWED_MODELS = new Set([
  "claude-sonnet-4-6",
  "claude-opus-4-8",
  "claude-haiku-4-5",
]);
const DEFAULT_MODEL = "claude-sonnet-4-6";
// The web_search server tool (20260209) is supported on these; haiku grounds via
// Tavily only.
const WEB_SEARCH_MODELS = new Set(["claude-sonnet-4-6", "claude-opus-4-8"]);

// Abuse ceilings. Per-visitor-per-hour keeps one reader from hammering the
// instrument; the daily floor protects the shared key. Tunable.
const PER_IP_PER_HOUR = 12;
const GLOBAL_PER_DAY = 800;

const SYSTEM = `You read AI news the way this corpus reads everything: you test whether the story's stated confidence exceeds what is actually known or built, and you name what the framing leaves out. You are not a debunker and you are not a hype-man. You are calibrated. Most stories are part true and part overclaim; your job is to separate them precisely.

YOUR METHOD (from the corpus):
- Confidence–reality divergence. A claim "fires" only when you can state two things a non-specialist can check: (A) what the story asserts, and (B) the likely reality from engineering/empirical fact — such that A and B contradict. If A and B agree, say so. Firing on everything is worthless; calibration is the whole value.
- Three tiers, kept apart. Mark each judgment: ESTABLISHED (checkable now), EXPLORATORY (plausible, untested at scale), or SPECULATIVE (a shape, not load-bearing). Never let a speculative read certify an established claim.
- Legibility and the remainder. Every story makes some things legible and buries others. Name the remainder: what the framing leaves out, and who pays for what stays invisible.
- Verbs carry the claim. "Prevents" is not "detects"; "deterministic" is not "probabilistic"; a property of one component is not a property of the whole system. Watch the verb and the modal.

THE CYBERSECURITY BILL OF RIGHTS (rights as properties, not promises) — flag which the situation implicates:
I. know what the system does and does not do (no "military-grade," "unbreakable").
II. data minimization by default. III. local processing. IV. encryption that stays encrypted (no backdoors/lawful access).
V. legible failure (breach disclosure a person can act on). VI. refuse without penalty. VII. leave with everything (portability).
VIII. inspection (no security-through-obscurity). IX. repair. X. a human in consequential decisions. XI. don't subsidize fragility (efficiency is a security property). XII. deletion that is actually deletion.

OUTPUT — plain, lowercase headers, markdown. Be specific and brief. Begin your response directly with the "## the claim" header — no preamble, no "Here is…", no meta-commentary about searching or what you found, no sign-off. Use these sections exactly:

## the claim
One or two sentences: what the story/headline is asserting.

## the likely reality
What is probably actually true, reading the gap. State each judgment with its tier in brackets, e.g. [established], [exploratory], [speculative]. Where confidence exceeds reality, say so plainly and name the verb or modal that does the inflating.

## the remainder
What the framing leaves out — and who pays for what stays invisible.

## rights implicated
The Bill-of-Rights articles this touches, by number and name, one line each on how. If none clearly apply, say so.

## what to check
2–4 concrete, checkable questions a reader should ask before believing the story.

GROUNDING: You may be handed LIVE SEARCH RESULTS (retrieved seconds ago), and you can run web_search yourself when a claim turns on current fact. Use them to check the story against reality — cite what the search actually shows in "the likely reality," and turn "what to check" into checks you partly ran. But a search result is evidence, not proof: weigh source quality, and keep the tier discipline — mark [established] only what the sources genuinely establish; when sources are thin, conflicting, or absent, say so and drop to [exploratory] or UNVERIFIABLE. The presence of search results must not inflate your confidence.

Rules: do not invent facts, numbers, sources, or events the story does not contain. If the text is not an AI news story, say so and stop. If you lack the basis to judge a claim, mark it UNVERIFIABLE rather than guessing.`;

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function hourBucket(d) {
  return d.toISOString().slice(0, 13); // YYYY-MM-DDTHH
}
function dayBucket(d) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

// ---- grounding -------------------------------------------------------------

// A search query from the story — its first non-empty line, minus the
// "(source: …)" tail the feed appends.
function deriveQuery(story) {
  const firstLine = story.split("\n").map((s) => s.trim()).filter(Boolean)[0] || story;
  return firstLine.replace(/\(source:[^)]*\)/i, "").trim().slice(0, 200);
}

// Tavily retrieval — best-effort. Returns an evidence block for the prompt, or
// "" when there's no key or the call fails.
async function tavilyEvidence(query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key || !query) return "";
  try {
    const r = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query,
        search_depth: "basic",
        max_results: 5,
        include_answer: false,
      }),
    });
    if (!r.ok) return "";
    const data = await r.json();
    const results = Array.isArray(data.results) ? data.results : [];
    if (!results.length) return "";
    return results
      .slice(0, 5)
      .map((x, i) => `[${i + 1}] ${(x.title || "untitled").trim()} — ${x.url}\n${(x.content || "").replace(/\s+/g, " ").trim().slice(0, 480)}`)
      .join("\n\n");
  } catch {
    return "";
  }
}

// Run the Claude call, following the server-side web_search loop (pause_turn) to
// completion. Returns the concatenated text blocks. Throws with .upstream = true
// on an API error so the caller can distinguish it.
async function runModel(model, messages, useWebSearch) {
  const base = { model, max_tokens: 2000, system: SYSTEM };
  if (useWebSearch) base.tools = [{ type: "web_search_20260209", name: "web_search" }];
  let convo = messages;
  for (let i = 0; i < 4; i++) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ ...base, messages: convo }),
    });
    if (!r.ok) {
      let msg = `${r.status} ${r.statusText}`;
      try { const e = await r.json(); if (e?.error?.message) msg = e.error.message; } catch {}
      const err = new Error(msg);
      err.upstream = true;
      throw err;
    }
    const data = await r.json();
    if (data.stop_reason === "pause_turn") {
      convo = [...convo, { role: "assistant", content: data.content }];
      continue; // server tool is mid-loop — re-send to let it finish
    }
    return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  }
  return ""; // exhausted continuation budget
}

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ error: "the instrument is not configured yet." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    res.status(400).json({ error: "could not read the request." });
    return;
  }

  const story = typeof body.story === "string" ? body.story.trim() : "";
  const model = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
  const source = typeof body.source === "string" ? body.source.slice(0, 200) : null;
  const publish = body.publish !== false; // default: add to the public ledger
  if (!story) {
    res.status(400).json({ error: "paste an ai news story first." });
    return;
  }
  if (story.length > 8000) {
    res.status(413).json({ error: "that's longer than the instrument reads — trim it to the story itself." });
    return;
  }

  // Rate limit (best-effort — a database outage degrades to allow rather than
  // taking the instrument down). Returns null when no DB is configured.
  try {
    const now = new Date();
    const ip = clientIp(req);
    const perIp = await bumpRateLimit(`ip:${ip}:${hourBucket(now)}`);
    if (perIp !== null && perIp > PER_IP_PER_HOUR) {
      res.status(429).json({ error: "you've run a lot of checks this hour — give the instrument a rest and come back soon." });
      return;
    }
    const global = await bumpRateLimit(`global:${dayBucket(now)}`);
    if (global !== null && global > GLOBAL_PER_DAY) {
      res.status(429).json({ error: "the instrument is resting for today. it'll be back tomorrow." });
      return;
    }
  } catch {
    /* rate-limit store unavailable — proceed */
  }

  // Grounding + the model call — server-side, with the site's key.
  // Tavily retrieves live sources up front (best-effort); web_search lets Claude
  // follow up its own searches. It reads the story against both.
  let text;
  try {
    const evidence = await tavilyEvidence(deriveQuery(story));
    const userContent =
      "Here is the AI news story. Read it and return the reality check.\n\n---\n" + story +
      (evidence
        ? "\n\n---\nLIVE SEARCH RESULTS (retrieved seconds ago — evidence to check the story against, not ground truth):\n" + evidence
        : "");
    text = await runModel(model, [{ role: "user", content: userContent }], WEB_SEARCH_MODELS.has(model));
  } catch (err) {
    // Don't leak provider internals to the reader.
    console.error(err.upstream ? "anthropic error:" : "grounding/model failed:", err.message || err);
    res.status(502).json({
      error: err.upstream
        ? "the read didn't come back this time. try again in a moment."
        : "couldn't reach the model. try again in a moment.",
    });
    return;
  }

  if (!text) {
    res.status(502).json({ error: "the model returned nothing readable." });
    return;
  }

  // Write to the public ledger (best-effort). Never block the response on it.
  let id = null;
  try {
    const rec = await recordCheck({ model, story, verdict: text, source, published: publish });
    id = rec?.id != null ? Number(rec.id) : null; // bigint arrives as string — match /api/checks
  } catch (err) {
    console.error("recordCheck failed:", err);
  }

  res.status(200).json({ text, model, id, published: publish && id !== null });
}
