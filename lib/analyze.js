// The Reading Machine's "read" step. When a document enters the corpus, Claude
// produces a corpus analysis card: a summary, tags, and the arguable claims the
// document is built around. Structured JSON out, raw fetch (no SDK, house style).
//
// Best-effort: any failure returns empty analysis so ingestion still stores the
// document — a doc with no card beats a failed upload.

const ANALYZE_SYSTEM = `You analyze a document entering a research corpus. Return ONLY a JSON object, no prose, no code fence:
{
  "summary": "2-4 sentences. What this document argues or contains. Concrete nouns, named agents, active verbs. No 'this document explores/delves into/navigates' — say what it actually claims.",
  "tags": ["6-12 lowercase concept tags — the ideas, frameworks, fields, and projects this touches"],
  "claims": ["the arguable statements the document is built around — each a single declarative sentence the author appears to be defending, not a topic. 0-8 of them. Empty array if the document makes no real claims (raw notes, transcripts)."]
}
Rules: preserve the author's voice and intensity in the summary; do not flatten into corporate blandness. Tags are nouns/concepts, not sentences. A claim is something one could disagree with.`;

const MODEL = "claude-haiku-4-5"; // analysis is extraction, not reasoning — cheap is right

export async function analyzeDocument(title, text) {
  const empty = { summary: null, tags: [], claims: [] };
  if (!process.env.ANTHROPIC_API_KEY) return empty;
  const body = (text || "").slice(0, 24000); // cap input; summaries don't need the whole book
  const user = `TITLE: ${title || "untitled"}\n\nDOCUMENT:\n${body}`;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: ANALYZE_SYSTEM,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!r.ok) return empty;
    const data = await r.json();
    const txt = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) return empty;
    const obj = JSON.parse(m[0]);
    return {
      summary: typeof obj.summary === "string" ? obj.summary : null,
      tags: Array.isArray(obj.tags) ? obj.tags.filter((t) => typeof t === "string").map((t) => t.toLowerCase().trim()).slice(0, 12) : [],
      claims: Array.isArray(obj.claims) ? obj.claims.filter((c) => typeof c === "string").map((c) => c.trim()).slice(0, 8) : [],
    };
  } catch {
    return empty;
  }
}
