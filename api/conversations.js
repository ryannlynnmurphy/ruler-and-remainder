// The Studio's conversation store — save / list / get. A Vercel serverless
// function backing the workstation at /studio.html.
//
// GET            → list recent conversations (metadata only, no message bodies)
// GET ?id=<uuid> → one full conversation (with messages)
// POST           → upsert a conversation { id?, title, mode, messages, starred }
//
// Best-effort and rate-limited, same posture as the public ledger: no database
// configured → empty list / graceful no-op rather than an error. No auth yet
// (see runtime/studio/README.md) — a public/single-user scratch space for now.

import { saveConversation, listConversations, getConversation, bumpRateLimit } from "../lib/db.js";

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
    const id = req.query?.id;
    try {
      if (id) {
        const row = await getConversation(id);
        res.status(200).json({ conversation: row || null });
      } else {
        const rows = await listConversations({ limit: req.query?.limit });
        res.status(200).json({ conversations: rows });
      }
    } catch {
      res.status(200).json(id ? { conversation: null } : { conversations: [] });
    }
    return;
  }

  if (req.method === "POST") {
    // rate limit (best-effort)
    try {
      const ip = clientIp(req);
      const n = await bumpRateLimit(`studio:conv:${ip}:${hourBucket(new Date())}`);
      if (n !== null && n > PER_IP_PER_HOUR) {
        res.status(429).json({ error: "you've saved a lot this hour — give it a moment." });
        return;
      }
    } catch { /* proceed */ }

    let body;
    try { body = await readJsonBody(req); }
    catch { res.status(400).json({ error: "couldn't read the request." }); return; }

    try {
      const saved = await saveConversation({
        id: body.id || null,
        title: body.title,
        mode: body.mode,
        messages: body.messages,
        starred: body.starred,
      });
      if (!saved) { res.status(503).json({ error: "the archive isn't configured yet." }); return; }
      res.status(200).json({ id: saved.id, updated_at: saved.updated_at });
    } catch (err) {
      console.error("conversations save failed:", err.message || err);
      res.status(502).json({ error: "couldn't save that. try again in a moment." });
    }
    return;
  }

  res.status(405).json({ error: "method not allowed" });
}
