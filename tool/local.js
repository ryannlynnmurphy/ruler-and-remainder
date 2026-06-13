// L0, in the browser — Dorothy's local tier, running in the visitor's own machine.
//
// The server already routes a FrugalGPT cascade (haiku → sonnet → opus) and can
// fall to an Ollama tier when Dorothy runs next to one. But a visitor on Vercel
// has no path to that Ollama. This is the missing piece: a tiny model compiled to
// WebGPU (WebLLM), cached in IndexedDB after first load, that runs ENTIRELY in the
// page. Zero infrastructure beyond what the user already has open.
//
// Voice is locked, so this layer never tries to BE Dorothy. It does two honest jobs:
//   1. answers the genuinely trivial turns ("hi", "thanks") — those never leave the
//      page at all: no network, no cost, instant, private by topology.
//   2. routes every other turn on-device (the cheap classify step), so the cloud
//      router call is skipped and the decision is made before anything is sent.
// The substantive answer still comes from cloud Dorothy, so her register holds.
//
// Best-effort throughout: no WebGPU, a failed compile, a bad classify — any miss
// returns null and the caller falls straight through to /api/argue, none the wiser.

// A ~1GB 4-bit model: strong enough to classify and to say one warm sentence,
// small enough to load on a normal laptop. Cached in IndexedDB after first fetch.
const MODEL = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
const WEBLLM_URL = "https://esm.run/@mlc.ai/web-llm";

let enginePromise = null;
let unavailable = false;

// WebGPU is the floor. No adapter → this whole layer stays dark and the cloud
// cascade handles everything exactly as before.
export function supported() {
  return typeof navigator !== "undefined" && !!navigator.gpu;
}

// Lazily import WebLLM and bring the model up. onProgress(report) fires during the
// one-time download/compile (report.progress 0..1, report.text a human line).
async function engine(onProgress) {
  if (unavailable || !supported()) { unavailable = true; return null; }
  if (!enginePromise) {
    enginePromise = (async () => {
      const webllm = await import(/* @vite-ignore */ WEBLLM_URL);
      return await webllm.CreateMLCEngine(MODEL, { initProgressCallback: onProgress });
    })().catch(() => { unavailable = true; enginePromise = null; return null; });
  }
  return enginePromise;
}

// Kick the download/compile ahead of the first real turn, reporting progress.
export async function warm(onProgress) { return engine(onProgress); }

export function isUnavailable() { return unavailable; }

// --- Tier-0 heuristics, mirrored from api/argue.js so client and server agree on
// what "trivial" and "needs fresh facts" mean. Keep these in sync with the server. ---
const TRIVIAL = /^(hi+|hey+|hello|yo|sup|thx|thanks|thank you|ok|okay|k|cool|nice|great|got it|gotcha|lol|lmao|wow|huh|yes|no|yeah|nah|sure)[\s.!?]*$/;
export function looksTrivial(msg) {
  const t = (msg || "").toLowerCase().trim();
  if (t.length <= 12) return true;
  return TRIVIAL.test(t);
}
const FRESH = /\b(today|tonight|yesterday|tomorrow|this (?:week|month|year)|right now|currently|latest|newest|recent(?:ly)?|breaking|headline|news|as of|in 202\d|price|stock|weather|score|who(?:'s| is) the|what'?s new|just (?:announced|released))\b/i;
export function needsFreshFacts(t) { return FRESH.test(t || ""); }

// The quick-reply layer is NOT Dorothy. Constrain it hard so a tiny model can't
// invent a grand voice and drift the lock: one short, plain, warm line, no more.
const TRIVIAL_SYSTEM =
  "You are the instant quick-reply layer for a teaching assistant named Dorothy. " +
  "The user said something tiny and social (a greeting, a thanks, a yes/no). " +
  "Answer in ONE short, warm, plain sentence. No metaphors, no lecture, no lists, " +
  "no follow-up questions longer than a few words. Never explain yourself.";

// Router system — IDENTICAL to api/argue.js ROUTER_SYSTEM, so an on-device route
// and a cloud route mean the same thing.
const ROUTER_SYSTEM =
  'You are a fast router for a reasoning assistant. Read the user\'s latest message ' +
  'and decide (a) how much reasoning it needs and (b) whether a good answer turns on ' +
  'current, checkable facts from the web. Output ONLY a compact JSON object and nothing ' +
  'else: {"tier":"light|medium|heavy","search":true|false}. light = social, trivial, or ' +
  'a simple lookup. medium = a real claim or question worth reasoning about. heavy = a ' +
  'hard, multi-step, philosophical, or rigor-demanding argument. search = true only when ' +
  'the answer depends on current or verifiable facts.';

// Answer a trivial turn fully on-device. Streams pieces through onToken(delta).
// `history` is the [{role,content}] conversation. Returns the full text, or null
// on any miss (caller then escalates to the cloud).
export async function answerTrivial(history, onToken) {
  const eng = await engine();
  if (!eng) return null;
  try {
    const messages = [{ role: "system", content: TRIVIAL_SYSTEM }, ...history.slice(-6)];
    const chunks = await eng.chat.completions.create({ messages, stream: true, temperature: 0.5, max_tokens: 120 });
    let full = "";
    for await (const c of chunks) {
      const tk = (c.choices && c.choices[0] && c.choices[0].delta && c.choices[0].delta.content) || "";
      if (tk) { full += tk; try { onToken(tk); } catch {} }
    }
    full = full.trim();
    return full || null;
  } catch { return null; }
}

// Classify a non-trivial turn on-device → { tier, search }. Returns null on any
// failure, so the server falls back to its own router. Never throws.
export async function route(userMsg) {
  const eng = await engine();
  if (!eng) return null;
  try {
    const r = await eng.chat.completions.create({
      messages: [{ role: "system", content: ROUTER_SYSTEM }, { role: "user", content: (userMsg || "").slice(0, 1200) }],
      temperature: 0.1, max_tokens: 40,
    });
    const txt = (r.choices && r.choices[0] && r.choices[0].message && r.choices[0].message.content) || "";
    const m = txt.match(/\{[\s\S]*\}/);
    const obj = m ? JSON.parse(m[0]) : {};
    const tier = ["light", "medium", "heavy"].includes(obj.tier) ? obj.tier : "medium";
    return { tier, search: obj.search === true };
  } catch { return null; }
}
