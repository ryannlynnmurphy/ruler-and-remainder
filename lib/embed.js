// Embeddings — Voyage AI (Anthropic's recommended embeddings partner; Anthropic
// ships no embeddings model of its own). Raw fetch, house style.
//
// Best-effort and key-gated: with no VOYAGE_API_KEY, embed() returns null and
// every caller falls back to keyword retrieval. So the Reading Machine works
// the moment the key is added, and degrades cleanly without it.
//
// voyage-4 series → 1024-dim by default (256/512/1024/2048 selectable). The
// pgvector column is fixed at EMBED_DIM, so keep them in sync.

export const EMBED_DIM = 1024;
const MODEL = process.env.VOYAGE_MODEL || "voyage-4-lite";

// Embed one string or a batch. input_type ∈ "document" | "query" — Voyage tunes
// the vector for the role, which materially improves retrieval. Returns an array
// of float vectors aligned to the input order, or null if unavailable/failed.
export async function embed(texts, inputType = "document") {
  if (!process.env.VOYAGE_API_KEY) return null;
  const list = Array.isArray(texts) ? texts : [texts];
  if (!list.length) return [];
  try {
    const r = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        input: list.map((t) => String(t).slice(0, 32000)),
        input_type: inputType === "query" ? "query" : "document",
        output_dimension: EMBED_DIM,
      }),
    });
    if (!r.ok) { console.error("voyage embed:", r.status, r.statusText); return null; }
    const data = await r.json();
    const out = (data.data || [])
      .slice()
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);
    return out.length === list.length ? out : null;
  } catch (e) {
    console.error("voyage embed failed:", e.message || e);
    return null;
  }
}

// pgvector literal: '[0.1,0.2,...]' — cast ::vector in SQL.
export const vecLiteral = (v) => "[" + v.join(",") + "]";
