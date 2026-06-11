// The public ledger — recent reality-checks, newest first. A Vercel serverless
// function backing the "recently checked" rail on /reality.html.
//
// Read-only. Returns only checks the reader chose to publish. Stories are
// trimmed to a preview so the ledger reads as a record, not a data dump.

import { listChecks } from "../lib/db.js";

function preview(s, n) {
  if (!s) return "";
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  res.setHeader("cache-control", "s-maxage=60, stale-while-revalidate=300");

  const limit = parseInt(req.query?.limit, 10) || 24;
  const before = req.query?.before ? parseInt(req.query.before, 10) : null;

  try {
    const rows = await listChecks({ limit, before: Number.isFinite(before) ? before : null });
    const items = rows.map((r) => ({
      id: Number(r.id),
      at: r.created_at,
      model: r.model,
      source: r.source || null,
      story: preview(r.story, 180),
      verdict: preview(r.verdict, 320),
    }));
    res.status(200).json({ items, next: items.length ? items[items.length - 1].id : null });
  } catch (err) {
    // No DB configured / unreachable — return an empty ledger rather than erroring.
    res.status(200).json({ items: [], next: null });
  }
}
