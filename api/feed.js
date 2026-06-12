// Live AI news feed — a Vercel serverless function.
// Primary source: Tavily news search — real publisher URLs, so each card can
// carry the article's own image (og:image) and a working "read the article"
// link. Falls back to Google News RSS when there's no Tavily key. Results are
// cached in Neon for a few minutes; the cache is best-effort.

import { getFeedCache, setFeedCache } from "../lib/db.js";

export const maxDuration = 30; // og:image enrichment fans out across many fetches

const CACHE_KEY = "ai-news-v2"; // v2: real images + real links (shape changed)
const CACHE_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

// ---- og:image enrichment ---------------------------------------------------

async function ogImage(url) {
  try {
    const r = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(4500),
    });
    if (!r.ok) return "";
    const html = (await r.text()).slice(0, 200000); // og tags live in <head>
    const m =
      html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    let img = m ? m[1].trim() : "";
    if (img.startsWith("//")) img = "https:" + img;
    else if (img.startsWith("/")) { try { img = new URL(img, r.url).href; } catch {} }
    return /^https?:\/\//.test(img) ? img : "";
  } catch {
    return "";
  }
}

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

// ---- Tavily news (primary) -------------------------------------------------

async function tavilyNews() {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return null;
  const queries = ["artificial intelligence", "AI safety OR AI regulation OR AI policy"];
  const all = [];
  for (const query of queries) {
    try {
      const r = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          api_key: key,
          query,
          topic: "news",
          days: 10,
          max_results: 10,
          include_answer: false,
        }),
      });
      if (!r.ok) continue;
      const d = await r.json();
      for (const it of d.results || []) all.push(it);
    } catch { /* skip this query */ }
  }
  if (!all.length) return null;

  const seen = new Set();
  const uniq = all.filter((it) => it.url && !seen.has(it.url) && seen.add(it.url));
  uniq.sort((a, b) => (Date.parse(b.published_date || 0) || 0) - (Date.parse(a.published_date || 0) || 0));
  const top = uniq.slice(0, 16);

  const images = await Promise.allSettled(top.map((it) => ogImage(it.url)));
  return top.map((it, i) => {
    const domain = domainOf(it.url);
    return {
      title: (it.title || "").trim(),
      source: domain,
      domain,
      image: images[i].status === "fulfilled" ? images[i].value : "",
      link: it.url,
      date: it.published_date || "",
      summary: (it.content || "").replace(/\s+/g, " ").trim().slice(0, 280),
    };
  });
}

// ---- Google News RSS (fallback, no key) ------------------------------------

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
async function googleQuery(q) {
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
      image: "", // Google News redirect links don't expose real article images
      link: pick(b, "link"),
      date: pick(b, "pubDate"),
      summary: decode(pick(b, "description")).slice(0, 280),
    };
  });
}
async function googleNewsFallback() {
  const batches = await Promise.all(
    ["artificial intelligence", "AI safety OR AI security OR AI regulation"].map((q) =>
      googleQuery(q).catch(() => [])
    )
  );
  const seen = new Set();
  const items = batches.flat().filter((it) => it.title && !seen.has(it.title) && seen.add(it.title));
  items.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  return items.slice(0, 16);
}

export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  res.setHeader("cache-control", "s-maxage=900, stale-while-revalidate=3600");

  const cached = await getFeedCache(CACHE_KEY, CACHE_MAX_AGE_MS);
  if (cached?.items?.length) {
    res.status(200).json({ items: cached.items, fetched: cached.items.length, cached: true });
    return;
  }

  try {
    let items = await tavilyNews();
    if (!items || !items.length) items = await googleNewsFallback();
    items = (items || []).filter((it) => it.title).slice(0, 16);
    if (items.length) await setFeedCache(CACHE_KEY, { items });
    res.status(200).json({ items, fetched: items.length });
  } catch (e) {
    res.status(200).json({ items: [], error: String(e) });
  }
}
