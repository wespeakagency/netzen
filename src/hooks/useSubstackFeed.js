import { useEffect, useState } from "react";

export const SUBSTACK_URL = "https://netzen.substack.com";

const RSS2JSON_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_URL + "/feed")}`;
const CACHE_KEY = "netzen_substack_feed_v1";
const CACHE_TTL_MS = 60 * 60 * 1000;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

function stripHtml(html) {
  if (typeof document === "undefined") return html;
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || "").trim();
}

function normalizeItems(items) {
  return items.map((it) => ({
    guid: it.guid || it.link,
    title: it.title,
    link: it.link,
    pubDate: it.pubDate,
    thumbnail: it.thumbnail || it.enclosure?.link || null,
    excerpt: stripHtml(it.description || "").slice(0, 180)
  }));
}

export function useSubstackFeed({ limit = 6 } = {}) {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;

    const cached = readCache();
    if (cached) {
      const sliced = cached.slice(0, limit);
      setPosts(sliced);
      setStatus(sliced.length === 0 ? "empty" : "ok");
      return () => { alive = false; };
    }

    fetch(RSS2JSON_API)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data.status !== "ok") throw new Error("Feed inválido");
        const normalized = normalizeItems(data.items || []);
        writeCache(normalized);
        const sliced = normalized.slice(0, limit);
        setPosts(sliced);
        setStatus(sliced.length === 0 ? "empty" : "ok");
      })
      .catch(() => {
        if (!alive) return;
        setStatus("error");
      });

    return () => { alive = false; };
  }, [limit]);

  return { posts, status };
}
