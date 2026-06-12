// Backfill embeddings for corpus chunks that don't have one yet — e.g. anything
// ingested before VOYAGE_API_KEY was set. Bounded per call; call repeatedly
// until { remaining: 0 }. Also confirms the pgvector schema bootstrapped on Neon
// ({ schema: true }) and whether the embedding key is configured ({ hasKey }).
//
// GET → { schema, hasKey, embedded, remaining }

import { backfillEmbeddings, bumpRateLimit } from "../lib/db.js";

export const maxDuration = 60;

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}
const hourBucket = (d) => d.toISOString().slice(0, 13);

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const n = await bumpRateLimit(`reading:backfill:${clientIp(req)}:${hourBucket(new Date())}`);
    if (n !== null && n > 60) { res.status(429).json({ error: "give the backfill a moment." }); return; }
  } catch { /* proceed */ }
  try {
    const limit = parseInt(req.query?.limit, 10) || 64;
    res.status(200).json(await backfillEmbeddings({ limit }));
  } catch (err) {
    console.error("backfill failed:", err.message || err);
    res.status(502).json({ error: "backfill didn't complete. try again." });
  }
}
