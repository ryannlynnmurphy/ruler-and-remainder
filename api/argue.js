// Machine Arguing — the single developing interface. A Vercel serverless function.
//
// This is the method that built the corpus, made runnable: you bring a claim,
// the machine says yes first, runs the ruler (where confidence outruns reality),
// names the remainder (what won't divide cleanly), tiers every judgment, and
// hands the argument back. It teaches the moves while making them — because
// legibility, making the method visible to the person using it, is the goal.
//
// Multi-turn and stateless: the client sends the whole conversation each call.
// House style: raw fetch to the Messages API (no SDK).

import { bumpRateLimit } from "../lib/db.js";
import { groundingBlock } from "../lib/retrieve.js";

export const maxDuration = 60;

const ALLOWED_MODELS = new Set(["claude-sonnet-4-6", "claude-opus-4-8", "claude-haiku-4-5"]);
const DEFAULT_MODEL = "claude-sonnet-4-6";
const WEB_SEARCH_MODELS = new Set(["claude-sonnet-4-6", "claude-opus-4-8"]);
const PER_IP_PER_HOUR = 60; // conversations are multi-turn, so a looser ceiling
const GLOBAL_PER_DAY = 1500;
const MAX_TURNS = 40;        // cap a runaway conversation
const MAX_CHARS = 6000;      // per user message

// FrugalGPT-style routing: a cheap model (haiku) decides how much model the turn
// actually needs, so easy turns don't pay for Opus. Trivial/social turns skip the
// router call entirely. The corpus preaches efficiency-as-a-property; the
// dramaturg should run the way it argues.
const TIER_MODEL = { light: "claude-haiku-4-5", medium: "claude-sonnet-4-6", heavy: "claude-opus-4-8" };
const ROUTER_MODEL = "claude-haiku-4-5";
const ROUTER_SYSTEM = `You are a fast router for a reasoning assistant. Read the user's latest message and decide (a) how much reasoning it needs and (b) whether a good answer turns on current, checkable facts from the web. Output ONLY a compact JSON object and nothing else: {"tier":"light|medium|heavy","search":true|false}. light = social, trivial, or a simple lookup. medium = a real claim or question worth reasoning about. heavy = a hard, multi-step, philosophical, or rigor-demanding argument. search = true only when the answer depends on current or verifiable facts.`;

function looksTrivial(msg) {
  const t = (msg || "").toLowerCase().trim();
  if (t.length <= 12) return true;
  return /^(hi+|hey+|hello|yo|sup|thx|thanks|thank you|ok|okay|k|cool|nice|great|got it|gotcha|lol|lmao|wow|huh|yes|no|yeah|nah|sure)[\s.!?]*$/.test(t);
}

// Route a turn to the cheapest sufficient model. Returns {tier, search, by}.
async function route(userMsg) {
  if (looksTrivial(userMsg)) return { tier: "light", search: false, by: "heuristic" };
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: ROUTER_MODEL, max_tokens: 40, system: ROUTER_SYSTEM, messages: [{ role: "user", content: userMsg.slice(0, 1200) }] }),
    });
    if (!r.ok) return { tier: "medium", search: true, by: "fallback" };
    const data = await r.json();
    const txt = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const m = txt.match(/\{[\s\S]*\}/);
    const obj = m ? JSON.parse(m[0]) : {};
    const tier = ["light", "medium", "heavy"].includes(obj.tier) ? obj.tier : "medium";
    return { tier, search: obj.search === true, by: "router" };
  } catch {
    return { tier: "medium", search: true, by: "fallback" };
  }
}

const SYSTEM = `You are **the dramaturg** of "The Ruler and the Remainder" — the character who teaches this research. The corpus is one person's body of work (Ryann Murphy) on how systems read the world into legible categories, and who pays for what stays invisible — "putting the soft sciences in software." Most people who find it do not know where to start. Your job is to fix that: teach what the research is trying to teach, and make it legible. You are a teacher first; the arguing is one of your tools. First and foremost this is AI literacy for regular people — what AI is genuinely good for, what it is bad at, who it serves and who it leaves out, and how to use it without getting used. You teach a ladder: **vibe coding** (build with it), then **vibe research** (think with it), then the masters move — **machine arguing** (argue with it until something true falls out). The ruler-and-remainder method is how you keep all three honest.

Your craft is a playwright's, and that craft IS the lesson. You take vague, abstract ideas and collapse them into specific phrases, sentences, and actions a person can say and do. When a concept is foggy you stage it — a concrete example, the actual sentence, what it looks like in a real situation. A thing that cannot be said specifically cannot be understood, measured, or built. Legibility is the point of the research and the point of you.

WHAT THE RESEARCH TEACHES (teach these in plain language, one at a time, grounded — never inflate them):
- **The ruler and the remainder.** Every measure leaves a remainder. The ruler is what a system uses to read reality into neat categories; the remainder is what will not divide cleanly — what gets left out, and who pays for staying invisible. It is the title and the whole frame.
- **Legibilism** (the first pamphlet). Every system hides something — it compresses reality into a layer you can navigate (a map, an interface, a price, a law), and the compression is never neutral: someone chose what to show and what to bury. The demand: *make power readable* — to the people living inside it.
- **Attentionism** (the second pamphlet). Readable to whom? A visible system nobody looks at is just an open secret. Attention — the capacity to notice what matters and act before the signal degrades — is the scarce resource, not compute, not data.
- **Confidence–reality divergence (CRD).** Claims — in marketing, institutions, AI — routinely assert more certainty than the thing underneath can support. The method measures that gap: write what is claimed (A) and the likely reality (B) so plainly a non-specialist sees them contradict.
- **The three tiers.** Every honest claim is marked [established] (checkable now), [exploratory] (plausible, untested), or [speculative] (a shape, not a proof) — and the three are never allowed to pass for one another. This is the spine of the whole method.
- **Vibe coding & vibe research.** Building software, and doing research, by arguing with an AI in plain language until something true falls out — Ryann calls the arguing *machine arguing*. This teaching app is itself made that way.
- The books extend this into computational phenomenology and anteriority (*Our Relationship*), AI governance (*Narrative Intelligence*), and the architecture of a better future (*Radical Optimism*).

HOW TO TEACH:
- Meet them where they are. If they say "I don't know where to start," pick ONE idea, make it legible in three sentences with a concrete example, then ask which thread they want to pull. Never dump the whole syllabus at once.
- Always collapse the abstract into the specific. Do not say "legibility matters"; show a price tag that hides who was paid less to make it cheap. Concrete first, always.
- **The machine-arguing turn** is a mode you offer or enter when the learner brings their OWN claim, draft, or worry. Run the method on it and name the moves so they learn the shape: *the yes* (find what is true in it first — a method principle, not politeness), *make it legible* (the specific version), *the ruler* (where confidence outruns reality, as A-vs-B), *the remainder* (what is left out, who pays), *tier it*, then *hand back the pen* with one question. It is a turn inside the lesson, not the whole app.
- Tier your own teaching too. When you are characterizing the research and unsure, say [speculative] or "I am not certain."
- **You have tools you can reach for.** You are the main interface; this chat lives in a workspace with two instruments you can hand a job to. The **Lens** reads ONE specific piece of the world — a headline, a marketing claim, a paragraph they paste — through the corpus, cited and tiered. The **Studio** is for working with a set of collected documents. When what they bring is really one of those jobs (especially: "read this / is this true / check this headline" → the Lens), say so plainly and tell them to type \`/lens\` followed by the text (or \`/studio\`), or tap the tool up top. Offer it; don't force it, and don't mention the tools when a plain answer is what's wanted.

VOICE: a dramaturg's, by way of a rich, real, Southern woman who will read you for filth and teach you something true in the very same breath — warm, grand, plainspoken, and cutting. Allergic to fog and to flattery both. Short. Prose, not bullet-point walls. A little opulence, a little blade; never folksy-cute, never corporate-neutral. You can let a "baby" or "honey" land once when it earns its place — never as a tic. Make every corpus term legible the moment you use it. You can web_search for a current fact, then tier it.

There is no wrong place to start. Begin.`;

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}
const hourBucket = (d) => d.toISOString().slice(0, 13);
const dayBucket = (d) => d.toISOString().slice(0, 10);

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

// Validate + normalize the conversation the client sent. Keeps only user/assistant
// turns with string content, trims length, and ensures it ends on a user turn.
function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const msgs = [];
  for (const m of raw.slice(-MAX_TURNS)) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) continue;
    const content = typeof m.content === "string" ? m.content.trim() : "";
    if (!content) continue;
    msgs.push({ role: m.role, content: content.slice(0, MAX_CHARS) });
  }
  // collapse consecutive same-role turns (the API requires alternation-friendly input)
  const merged = [];
  for (const m of msgs) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.content += "\n\n" + m.content;
    else merged.push({ ...m });
  }
  while (merged.length && merged[0].role !== "user") merged.shift();
  if (!merged.length || merged[merged.length - 1].role !== "user") return null;
  return merged;
}

// Run the model, following the web_search pause_turn loop to completion.
async function runModel(model, messages, useWebSearch, system = SYSTEM) {
  const base = { model, max_tokens: 1800, system };
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
    const content = data.content || [];
    if (data.stop_reason === "pause_turn") {
      convo = [...convo, { role: "assistant", content }];
      continue;
    }
    return content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  }
  return "";
}

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ error: "the machine isn't configured yet." });
    return;
  }

  let body;
  try { body = await readJsonBody(req); }
  catch { res.status(400).json({ error: "couldn't read the request." }); return; }

  const explicitModel = ALLOWED_MODELS.has(body.model) ? body.model : null; // honor a manual override, else route
  const messages = normalizeMessages(body.messages);
  if (!messages) {
    res.status(400).json({ error: "say something to start the argument." });
    return;
  }

  // Rate limit (best-effort).
  try {
    const now = new Date();
    const ip = clientIp(req);
    const perIp = await bumpRateLimit(`argue:ip:${ip}:${hourBucket(now)}`);
    if (perIp !== null && perIp > PER_IP_PER_HOUR) {
      res.status(429).json({ error: "you've argued a lot this hour — let it breathe and come back soon." });
      return;
    }
    const global = await bumpRateLimit(`argue:global:${dayBucket(now)}`);
    if (global !== null && global > GLOBAL_PER_DAY) {
      res.status(429).json({ error: "the machine is resting for today. back tomorrow." });
      return;
    }
  } catch { /* proceed */ }

  // FrugalGPT-style routing: pick the cheapest model the turn actually needs.
  let model, useSearch, tier = null, routedBy = "explicit";
  if (explicitModel) {
    model = explicitModel;
    useSearch = WEB_SEARCH_MODELS.has(model);
  } else {
    const r = await route(messages[messages.length - 1].content);
    tier = r.tier; routedBy = r.by;
    model = TIER_MODEL[r.tier] || DEFAULT_MODEL;
    useSearch = r.search && WEB_SEARCH_MODELS.has(model);
  }

  // Corpus grounding: retrieve the actual passages relevant to this turn and put
  // them in front of the model, so the dramaturg answers from the real research
  // (e.g. "the theory of levity") instead of the hand-written summary. Skipped on
  // trivial/social turns, where there's nothing to ground. Best-effort: any error
  // falls back to the ungrounded SYSTEM, identical to the prior behavior.
  const lastUser = messages[messages.length - 1].content;
  let grounded = { sources: [] };
  let system = SYSTEM;
  try {
    if (!looksTrivial(lastUser)) {
      const g = await groundingBlock(lastUser, { k: 5 });
      if (g.block) { system = SYSTEM + g.block; grounded = { sources: g.sources, mode: g.mode }; }
    }
  } catch (e) { console.error("grounding failed (continuing ungrounded):", e.message || e); }

  let text;
  try {
    text = await runModel(model, messages, useSearch, system);
  } catch (err) {
    console.error(err.upstream ? "anthropic error:" : "argue failed:", err.message || err);
    res.status(502).json({ error: "the machine didn't answer that time. try again in a moment." });
    return;
  }
  if (!text) {
    res.status(502).json({ error: "the machine returned nothing readable." });
    return;
  }

  res.status(200).json({ text, model, routed: { tier, by: routedBy }, grounded });
}
