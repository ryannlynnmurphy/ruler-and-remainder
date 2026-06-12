// Michael — the instrument speaks. ElevenLabs text-to-speech, so a Lens reading
// (or any text) can be heard, not just read. Returns audio/mpeg.
//
// POST { text } -> audio/mpeg  (or JSON error)
// Env: ELEVENLABS_API_KEY (required), ELEVENLABS_VOICE_ID (defaults to Michael).
// Key-gated: with no key, returns 503 and the UI hides the speak control.

import { bumpRateLimit } from "../lib/db.js";

export const maxDuration = 60;

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "ljX1ZrXuDIIRVcmiVSyR"; // Michael
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5";
const MAX_CHARS = 5000;
const PER_IP_PER_HOUR = 60;

// Strip the reading's markdown so Michael speaks clean prose: headings become
// sentences, tier brackets and emphasis/citation punctuation are dropped.
function speakable(md) {
  return String(md)
    .replace(/^#{1,4}\s*(.+)$/gm, "$1.")        // ## Heading → "Heading."
    .replace(/\[(established|exploratory|speculative)\]/gi, "($1)")
    .replace(/[*_`>#]/g, "")
    .replace(/\s*\n\s*\n\s*/g, ". ")             // paragraph breaks → pauses
    .replace(/\s*\n\s*/g, " ")
    .replace(/\.\s*\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, MAX_CHARS);
}

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
  if (req.method !== "POST") { res.status(405).json({ error: "method not allowed" }); return; }
  if (!process.env.ELEVENLABS_API_KEY) { res.status(503).json({ error: "voice isn't configured yet." }); return; }

  try {
    const n = await bumpRateLimit(`voice:${clientIp(req)}:${hourBucket(new Date())}`);
    if (n !== null && n > PER_IP_PER_HOUR) { res.status(429).json({ error: "michael needs a breather — try again soon." }); return; }
  } catch { /* proceed */ }

  let body;
  try { body = await readJsonBody(req); }
  catch { res.status(400).json({ error: "couldn't read the request." }); return; }

  const text = speakable(body.text || "");
  if (!text) { res.status(400).json({ error: "nothing to say — send some text." }); return; }

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "content-type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
      }),
    });
    if (!r.ok) {
      let msg = `${r.status}`;
      try { const e = await r.json(); msg = e?.detail?.message || e?.detail || msg; } catch {}
      console.error("elevenlabs:", msg);
      res.status(502).json({ error: "michael couldn't speak that time. try again." });
      return;
    }
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("content-type", "audio/mpeg");
    res.setHeader("cache-control", "no-store");
    res.status(200).send(buf);
  } catch (err) {
    console.error("voice failed:", err.message || err);
    res.status(502).json({ error: "voice didn't reach michael. try again." });
  }
}
