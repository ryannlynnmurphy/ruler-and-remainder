// The Studio's artifact store — the keep-worthy unit. A Vercel serverless
// function backing the workstation at /studio.html.
//
// GET  → list recent artifacts (newest first)
// POST → save an artifact { title, kind, tier, body, sourceConversationId? }
//        The artifact is the distillation, not the transcript. Propose-only by
//        design: this only ever fires from an explicit user "keep this" click.
//
// Best-effort and rate-limited, same posture as the public ledger. No auth yet
// (see runtime/studio/README.md).

import { saveArtifact, listArtifacts, bumpRateLimit } from "../lib/db.js";

const PER_IP_PER_HOUR = 120;

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

  if (req.method === "GET") {
    try {
      const rows = await listArtifacts({ limit: req.query?.limit });
      res.status(200).json({ artifacts: rows });
    } catch {
      res.status(200).json({ artifacts: [] });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const ip = clientIp(req);
      const n = await bumpRateLimit(`studio:art:${ip}:${hourBucket(new Date())}`);
      if (n !== null && n > PER_IP_PER_HOUR) {
        res.status(429).json({ error: "you've kept a lot this hour — give it a moment." });
        return;
      }
    } catch { /* proceed */ }

    let body;
    try { body = await readJsonBody(req); }
    catch { res.status(400).json({ error: "couldn't read the request." }); return; }

    if (!body.body || !String(body.body).trim()) {
      res.status(400).json({ error: "an artifact needs a body — what are you keeping?" });
      return;
    }

    try {
      const saved = await saveArtifact({
        title: body.title,
        kind: body.kind,
        tier: body.tier,
        body: body.body,
        sourceConversationId: body.sourceConversationId || null,
      });
      if (!saved) { res.status(503).json({ error: "the archive isn't configured yet." }); return; }
      res.status(200).json({ id: saved.id, created_at: saved.created_at });
    } catch (err) {
      console.error("artifacts save failed:", err.message || err);
      res.status(502).json({ error: "couldn't keep that. try again in a moment." });
    }
    return;
  }

  res.status(405).json({ error: "method not allowed" });
}
