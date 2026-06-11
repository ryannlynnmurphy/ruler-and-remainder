// Live AI news feed — a Vercel serverless function.
// Pulls public Google News RSS (no API key, no cost) and returns clean JSON.
// The reality-check tool fetches /api/feed and lets you pick a story.

const QUERIES = [
  "artificial intelligence",
  "AI safety OR AI security OR AI regulation",
];

function pick(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
}
function decode(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

async function fetchQuery(q) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q + " when:10d")}&hl=en-US&gl=US&ceid=US:en`;
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (reality-check feed)" } });
  if (!r.ok) return [];
  const xml = await r.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const b = m[1];
    const titleRaw = pick(b, "title");
    const srcM = b.match(/<source[^>]*url="([^"]+)"[^>]*>([\s\S]*?)<\/source>/i);
    const domain = srcM ? srcM[1].replace(/^https?:\/\//, "").replace(/\/.*$/, "") : "";
    const source = decode(srcM ? srcM[2] : (titleRaw.includes(" - ") ? titleRaw.split(" - ").pop() : ""));
    return {
      title: decode(titleRaw.replace(/ - [^-]+$/, "")),
      source,
      domain,
      image: domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : "",
      link: pick(b, "link"),
      date: pick(b, "pubDate"),
      summary: decode(pick(b, "description")).slice(0, 280),
    };
  });
}

export default async function handler(req, res) {
  try {
    const batches = await Promise.all(QUERIES.map((q) => fetchQuery(q).catch(() => [])));
    const seen = new Set();
    let items = batches.flat().filter((it) => {
      if (!it.title || seen.has(it.title)) return false;
      seen.add(it.title);
      return true;
    });
    items.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
    items = items.slice(0, 24);
    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", "s-maxage=900, stale-while-revalidate=3600");
    res.status(200).json({ items, fetched: items.length });
  } catch (e) {
    res.status(200).json({ items: [], error: String(e) });
  }
}
