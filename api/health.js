// Local-node health for the workstation's auto / local-only toggle.
// Reports whether a local Ollama node is CONFIGURED (OLLAMA_URL set) and
// REACHABLE right now. The dot in the top bar reads this so it tells the truth
// about availability instead of guessing.

export const maxDuration = 10;

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  res.setHeader("cache-control", "no-store");

  const base = (process.env.OLLAMA_URL || "").replace(/\/+$/, "");
  const model = process.env.OLLAMA_MODEL || "qwen2.5";
  const configured = Boolean(base);

  let reachable = false;
  if (configured) {
    try {
      const r = await fetch(`${base}/api/tags`, { signal: AbortSignal.timeout(1500) });
      reachable = r.ok;
    } catch {
      reachable = false; // unreachable or timed out — honest "configured but offline"
    }
  }

  res.status(200).json({ configured, reachable, model });
}
