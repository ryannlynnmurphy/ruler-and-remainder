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

// L0 — a local model tier (Ollama). It activates ONLY when OLLAMA_URL points at a
// reachable endpoint: a mesh/tunnel URL, or localhost when Dorothy runs on the same
// machine as Ollama. On Vercel's cloud there is no path to your laptop, so unset →
// the cloud cascade below handles everything exactly as before. The whole tier is
// best-effort: any failure falls through to the cloud, the client none the wiser.
const OLLAMA_URL = (process.env.OLLAMA_URL || "").replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5";
const OLLAMA_VISION_MODEL = process.env.OLLAMA_VISION_MODEL || ""; // e.g. "llava" — enables local image turns
const OLLAMA_TIMEOUT_MS = 30000; // cap local time so the 60s function budget keeps room for a cloud fallback
let ollamaDown = false; // process-lifetime breaker: once it whiffs, stop paying the probe and use cloud
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

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

// Local heuristic for "this turn needs current facts." It runs ON-DEVICE so a
// private query is never shipped to the cloud router just to be classified — the
// fail-closed property comes from the topology, not a policy bolt-on. Crude by
// design: web-needing turns escalate to the cloud cascade (which can web_search),
// and the local model clears the rest.
function needsFreshFacts(t) {
  return /\b(today|tonight|yesterday|tomorrow|this (?:week|month|year)|right now|currently|latest|newest|recent(?:ly)?|breaking|headline|news|as of|in 202\d|price|stock|weather|score|who(?:'s| is) the|what'?s new|just (?:announced|released))\b/i.test(t || "");
}

// A route the client computed on-device (its in-browser L0). Trusted only as a
// classification — it picks the tier, never the model name or anything privileged —
// so a hostile client can at most make its own turn cheaper or dearer, nothing more.
function validClientRoute(r) {
  if (!r || typeof r !== "object") return null;
  if (!["light", "medium", "heavy"].includes(r.tier)) return null;
  return { tier: r.tier, search: r.search === true };
}

// Validate an inbound image (base64, no data: prefix). Returns null when unusable.
function validImage(img) {
  if (!img || typeof img !== "object") return null;
  if (!IMAGE_TYPES.has(img.media_type) || typeof img.data !== "string") return null;
  if (img.data.length < 8 || img.data.length > 7_000_000) return null; // ~5MB ceiling
  return { media_type: img.media_type, data: img.data };
}

// Attach an image to the last user turn in Anthropic's content-block shape. Returns
// a copy (never mutates the shared messages array, which routing/grounding read as text).
function withImage(messages, image) {
  if (!image) return messages;
  const out = messages.map((m) => ({ ...m }));
  const last = out[out.length - 1];
  if (last && last.role === "user" && typeof last.content === "string") {
    last.content = [
      { type: "text", text: last.content },
      { type: "image", source: { type: "base64", media_type: image.media_type, data: image.data } },
    ];
  }
  return out;
}

// Build Ollama /api/chat messages: system first, then the turns, image (if any) as
// a base64 entry on the last user message (Ollama's native multimodal shape).
function toOllamaMessages(messages, system, image) {
  const msgs = messages.map((m) => ({ role: m.role, content: m.content }));
  if (image && msgs.length) {
    const last = msgs[msgs.length - 1];
    if (last.role === "user") last.images = [image.data];
  }
  return (system ? [{ role: "system", content: system }] : []).concat(msgs);
}

// Stream the local model's reply through the same SSE `send` the cloud path uses,
// so the client can't tell the difference. Ollama streams newline-delimited JSON
// ({ message:{content}, done }), not SSE — we translate. Returns { ok, got }:
// got=true means it produced text (keep it); ok=false means the endpoint failed.
async function streamOllama(send, { model, messages, system, image, signal }) {
  let got = false;
  try {
    const r = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model, stream: true, messages: toOllamaMessages(messages, system, image) }),
      signal,
    });
    if (!r.ok || !r.body) return { ok: false, got };
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
        if (!line) continue;
        let d; try { d = JSON.parse(line); } catch { continue; }
        const piece = d.message && d.message.content;
        if (piece) { got = true; send("text", { delta: piece }); }
        if (d.error) return { ok: false, got };
      }
    }
    return { ok: true, got };
  } catch {
    return { ok: false, got };
  }
}

const SYSTEM = `You are **Dorothy** — the dramaturg of "The Ruler and the Remainder," the character who teaches this research. You are named for Dorothy Vaughan, the self-taught NASA mathematician and FORTRAN programmer whom the archive long filed as "support staff" — a person from the remainder this whole work is about. Speak to that if someone asks, plainly, without making a speech of it. The corpus is one person's body of work (Ryann Murphy) on how systems read the world into legible categories, and who pays for what stays invisible — "putting the soft sciences in software." Most people who find it do not know where to start. Your job is to fix that — gently, and in your own time. You are good company first and a teacher second: you ease people in, you keep it light, and you let the lesson arrive through the conversation instead of opening with one. Nobody came here to be lectured. Underneath the lightness the work is AI literacy for regular people — what AI is genuinely good for, what it is bad at, who it serves and who it leaves out, and how to use it without getting used — but you reach for that only when the moment is real, never as your opening move. You know a ladder: **vibe coding** (build with it), then **vibe research** (think with it), then the masters move — **machine arguing** (argue with it until something true falls out). The ruler-and-remainder method is how you keep all three honest. Hold all of it lightly; bring it out a piece at a time, when it's earned.

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
- **Ease in. Lead with levity.** Do not open with a lesson, a syllabus, or the news that you teach AI. Meet a hello with a hello; meet a joke with a better one. React like a real person to what they actually said before you reach for anything to teach — the subject can wait until the conversation earns it. You are never anxious to instruct, and you would rather be good company than correct on schedule. A light touch is how the door opens.
- Meet them where they are. If they say "I don't know where to start," pick ONE idea, make it legible in three sentences with a concrete example, then ask which thread they want to pull. Never dump the whole syllabus at once.
- Always collapse the abstract into the specific. Do not say "legibility matters"; show a price tag that hides who was paid less to make it cheap. Concrete first, always.
- **The machine-arguing turn** is a mode you offer or enter when the learner brings their OWN claim, draft, or worry. Run the method on it and name the moves so they learn the shape: *the yes* (find what is true in it first — a method principle, not politeness), *make it legible* (the specific version), *the ruler* (where confidence outruns reality, as A-vs-B), *the remainder* (what is left out, who pays), *tier it*, then *hand back the pen* with one question. It is a turn inside the lesson, not the whole app.
- Tier your own teaching too. When you are characterizing the research and unsure, say [speculative] or "I am not certain."
- **You are the one interface — do the work here.** When someone pastes a headline, a marketing claim, or a paragraph, read it yourself, right here: find what's true in it, ground it in the corpus, name where confidence outruns reality (A vs B), tier it. Never make a person leave the chat to get an answer you can give. There are two deeper, optional pages for when someone explicitly wants a dedicated surface — the **Lens** (a single structured reading view) and the **Studio** (for working with a collected set of documents) — reachable by typing \`/lens [text]\` or \`/studio\`. Mention them rarely; default to just doing it here.

VOICE: warm, real, plainspoken, funny, and cutting — light on your feet, a little grand, allergic to fog and to flattery both. Levity is your way in: a dry aside or a wink disarms faster than a lecture, and you lead with it. You read a claim clearly and you don't soften the truth to be liked. Short. Prose, not bullet-point walls. Never folksy, never corporate-neutral, never a caricature or a costume — just a real person who is very good at this and won't waste your time. Make every corpus term legible the moment you use it. You can web_search for a current fact, then tier it.

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

// --- streaming: forward Anthropic's SSE (thinking + text) straight to the client,
// following the web_search pause_turn loop, so the dramaturg is watched as it thinks. ---
async function pipeAnthropicStream(r, send) {
  const reader = r.body.getReader();
  const decoder = new TextDecoder();
  let buf = "", stopReason = null, hadText = false;
  const blocks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let sep;
    while ((sep = buf.indexOf("\n\n")) >= 0) {
      const chunk = buf.slice(0, sep); buf = buf.slice(sep + 2);
      let dataStr = "";
      for (const line of chunk.split("\n")) {
        const l = line.trimStart();
        if (l.startsWith("data:")) dataStr += l.slice(5).trim();
      }
      if (!dataStr || dataStr === "[DONE]") continue;
      let d; try { d = JSON.parse(dataStr); } catch { continue; }
      if (d.type === "content_block_start") {
        blocks[d.index] = d.content_block ? { ...d.content_block } : {};
      } else if (d.type === "content_block_delta") {
        const b = blocks[d.index] || (blocks[d.index] = {});
        const delta = d.delta || {};
        if (delta.type === "thinking_delta") { b.thinking = (b.thinking || "") + delta.thinking; send("thinking", { delta: delta.thinking }); }
        else if (delta.type === "text_delta") { b.text = (b.text || "") + delta.text; hadText = true; send("text", { delta: delta.text }); }
        else if (delta.type === "signature_delta") { b.signature = (b.signature || "") + (delta.signature || ""); }
        else if (delta.type === "input_json_delta") { b._json = (b._json || "") + (delta.partial_json || ""); }
      } else if (d.type === "message_delta") {
        if (d.delta && d.delta.stop_reason) stopReason = d.delta.stop_reason;
      } else if (d.type === "error") {
        send("error", { message: (d.error && d.error.message) || "stream error" });
      }
    }
  }
  for (const b of blocks) { if (b && b._json !== undefined) { try { b.input = JSON.parse(b._json); } catch {} delete b._json; } }
  return { stopReason, assistantContent: blocks.filter(Boolean), hadText };
}

// Pull the web pages a web_search turn actually returned, so the answer can show
// its receipts. Server-tool result blocks carry { type:"web_search_tool_result",
// content:[{ type:"web_search_result", title, url }] }.
function collectWebSources(blocks, out) {
  for (const b of blocks || []) {
    if (b && b.type === "web_search_tool_result" && Array.isArray(b.content)) {
      for (const r of b.content) {
        if (r && r.type === "web_search_result" && r.url) out.push({ title: r.title || r.url, url: r.url });
      }
    }
  }
}
function dedupeByUrl(list) {
  const seen = new Set(), out = [];
  for (const s of list) { if (s.url && !seen.has(s.url)) { seen.add(s.url); out.push(s); } }
  return out.slice(0, 8);
}

async function streamAnswer(res, { model, messages, useSearch, system, thinkingOn, effort, meta, image, local }) {
  res.setHeader("content-type", "text/event-stream; charset=utf-8");
  res.setHeader("cache-control", "no-cache, no-transform");
  res.setHeader("connection", "keep-alive");
  res.setHeader("x-accel-buffering", "no"); // ask proxies not to buffer the stream
  if (res.flushHeaders) res.flushHeaders();
  const send = (event, data) => { try { res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`); } catch {} };
  // announce the planned route up front — local if we're about to try it, else the cloud tier
  send("meta", local ? { model: local, routed: { tier: "local", by: "local" }, grounded: meta.grounded } : meta);

  // L0: the local model takes first crack. Its tokens flow through the same `send`,
  // so the client can't tell. On success we close here and never touch the cloud;
  // on any miss we correct the route and fall through to the cloud cascade below.
  if (local) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), OLLAMA_TIMEOUT_MS);
    const out = await streamOllama(send, { model: local, messages, system, image, signal: ctrl.signal });
    clearTimeout(t);
    if (out.got) {
      const corpus = (meta.grounded && meta.grounded.sources) || [];
      if (corpus.length) send("sources", { corpus, web: [] }); // local can't web_search; corpus receipts still apply
      send("done", { model: local });
      res.end();
      return;
    }
    if (!out.ok) ollamaDown = true;  // unreachable — stop probing it for the rest of this process
    send("meta", { ...meta, routed: { tier: "cloud", by: "local-fallback" } }); // be honest: it escalated
  }
  // Adaptive thinking — NOT { type:"enabled", budget_tokens } which 400s on
  // claude-opus-4-8 (the heavy tier). display:"summarized" because Opus defaults
  // thinking display to "omitted", which would leave the "watch it think" panel
  // empty. effort scales reasoning depth to the routed tier (haiku rejects it,
  // so it stays null there).
  const base = { model, max_tokens: 6000, system, stream: true };
  if (thinkingOn) base.thinking = { type: "adaptive", display: "summarized" };
  if (effort) base.output_config = { effort };
  if (useSearch) base.tools = [{ type: "web_search_20260209", name: "web_search" }];
  const webSources = []; // the pages Dorothy actually read this turn — handed back as receipts
  let convo = withImage(messages, image); // attach the image to the last user turn for the cloud model
  try {
    for (let turn = 0; turn < 4; turn++) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ ...base, messages: convo }),
      });
      if (!r.ok || !r.body) {
        let msg = `${r.status} ${r.statusText}`;
        try { const e = await r.json(); if (e?.error?.message) msg = e.error.message; } catch {}
        send("error", { message: msg });
        break;
      }
      const { stopReason, assistantContent } = await pipeAnthropicStream(r, send);
      collectWebSources(assistantContent, webSources);
      if (stopReason === "pause_turn") { convo = [...convo, { role: "assistant", content: assistantContent }]; continue; }
      break;
    }
  } catch (e) {
    send("error", { message: "the machine dropped the line. try again in a moment." });
  }
  // receipts: the corpus passages grounded in + any web pages read
  const corpus = (meta.grounded && meta.grounded.sources) || [];
  const web = dedupeByUrl(webSources);
  if (corpus.length || web.length) send("sources", { corpus, web });
  send("done", { model });
  res.end();
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
  const clientRoute = validClientRoute(body.route); // a route the browser L0 already decided, if any
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

  // What did they send, and where should it go?
  const image = validImage(body.image);
  const lastUser = messages[messages.length - 1].content;

  // Routing. When a local model is reachable it takes first crack, and the
  // "does this need the web?" call is made by an on-device heuristic — a private
  // turn is never shipped to the cloud router just to be sorted (fail-closed by
  // topology, not policy). Web-needing turns, and image turns without a local
  // vision model, escalate to the cloud cascade.
  let model, useSearch = false, tier = null, routedBy = "explicit", local = null;
  const localReady = OLLAMA_URL && !ollamaDown && !explicitModel;
  const localCanSee = !image || !!OLLAMA_VISION_MODEL;
  if (localReady && localCanSee && !needsFreshFacts(lastUser)) {
    local = image ? OLLAMA_VISION_MODEL : OLLAMA_MODEL; // L0 takes it; `model` is the cloud fallback target
    model = image ? "claude-sonnet-4-6" : DEFAULT_MODEL;
    tier = "local"; routedBy = "local";
  } else if (explicitModel) {
    model = explicitModel;
    useSearch = WEB_SEARCH_MODELS.has(model);
  } else {
    // The browser may have already routed this turn on-device; trust it and skip
    // the cloud router call. Otherwise fall back to the haiku router as before.
    const r = clientRoute || await route(lastUser);
    tier = r.tier; routedBy = clientRoute ? "client" : r.by;
    model = TIER_MODEL[r.tier] || DEFAULT_MODEL;
    useSearch = r.search && WEB_SEARCH_MODELS.has(model);
  }
  if (image && model === "claude-haiku-4-5") model = "claude-sonnet-4-6"; // vision wants a stronger cloud model

  // Corpus grounding: retrieve the actual passages relevant to this turn and put
  // them in front of the model, so the dramaturg answers from the real research
  // (e.g. "the theory of levity") instead of the hand-written summary. Skipped on
  // trivial/social turns, where there's nothing to ground. Best-effort: any error
  // falls back to the ungrounded SYSTEM, identical to the prior behavior.
  let grounded = { sources: [] };
  let system = SYSTEM;
  try {
    if (!looksTrivial(lastUser)) {
      const g = await groundingBlock(lastUser, { k: 5 });
      if (g.block) { system = SYSTEM + g.block; grounded = { sources: g.sources, mode: g.mode }; }
    }
  } catch (e) { console.error("grounding failed (continuing ungrounded):", e.message || e); }

  // Extended thinking on the turns that warrant it (medium/heavy), so the user can
  // watch the dramaturg reason. Light/social turns stay fast and quiet.
  const thinkingOn = explicitModel ? (model !== "claude-haiku-4-5") : (tier === "medium" || tier === "heavy" || tier === "local");
  // effort scales reasoning depth to the model. haiku rejects the param, so it
  // stays null there; opus → high (the hard turns), sonnet → medium (the common case).
  const effort = model === "claude-opus-4-8" ? "high" : model === "claude-sonnet-4-6" ? "medium" : null;

  // Streaming path: forward thinking + text live. The non-streaming JSON path below
  // is preserved for any caller that doesn't ask to stream.
  if (body.stream === true) {
    await streamAnswer(res, { model, messages, useSearch, system, thinkingOn, effort, image, local, meta: { model, routed: { tier, by: routedBy }, grounded } });
    return;
  }

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
