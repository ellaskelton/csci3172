/**
 * Music Discovery API – Express app wrapped with serverless-http for Netlify.
 * MusicBrainz proxy (no API keys required).
 */
import express from "express";
import serverless from "serverless-http";

const api = express();
const router = express.Router();

const MUSICBRAINZ_BASE = "https://musicbrainz.org/ws/2";

async function searchArtists(query, limit = 10) {
  const url = new URL("/artist", MUSICBRAINZ_BASE);
  url.searchParams.set("query", query);
  url.searchParams.set("fmt", "json");
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "csci3172-lab5-music-discovery/1.0 (student@example.com)",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MusicBrainz API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

router.get("/health", (req, res) => {
  res.json({ message: "Server is reachable.", ok: true });
});

router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter: q" });
  }
  try {
    const data = await searchArtists(q, Number(req.query.limit) || 10);
    const items = (data.artists || []).map((a) => ({
      id: a.id,
      name: a.name,
      disambiguation: a.disambiguation || "",
      country: a.country || (a.area && a.area.name) || "",
    }));
    res.json({ items, total: items.length });
  } catch (err) {
    res.status(502).json({ error: err.message || "Server error" });
  }
});

router.get("/related", async (req, res) => {
  const name = (req.query.name || "").trim();
  if (!name) {
    return res.status(400).json({ error: "Missing query parameter: name" });
  }
  try {
    const data = await searchArtists(name, Number(req.query.limit) || 10);
    const items = (data.artists || []).map((a) => ({
      id: a.id,
      name: a.name,
      disambiguation: a.disambiguation || "",
      country: a.country || (a.area && a.area.name) || "",
    }));
    res.json(items);
  } catch (err) {
    res.status(502).json({ error: err.message || "Server error" });
  }
});

api.use("/api", router);
api.use("/.netlify/functions/api", router);

export const handler = serverless(api);
export { api };
