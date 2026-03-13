/**
 * Music Discovery API – Express app wrapped with serverless-http for Netlify.
 * Spotify Web API proxy; credentials via SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.
 */
import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();

const api = express();
const router = express.Router();

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET");
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function spotifyRequest(path, token, params = {}) {
  const url = new URL(SPOTIFY_API_BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// Health check (no API key needed)
router.get("/health", (req, res) => {
  res.json({ message: "Server is reachable.", ok: true });
});

// Artist search
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter: q" });
  }
  try {
    const token = await getSpotifyToken();
    const data = await spotifyRequest("/search", token, {
      q,
      type: "artist",
      limit: String(Number(req.query.limit) || 10),
    });
    res.json(data.artists || { items: [], total: 0 });
  } catch (err) {
    res.status(502).json({ error: err.message || "Server error" });
  }
});

// Related artists
router.get("/related", async (req, res) => {
  const id = (req.query.id || "").trim();
  if (!id) {
    return res.status(400).json({ error: "Missing query parameter: id (artist ID)" });
  }
  try {
    const token = await getSpotifyToken();
    const data = await spotifyRequest(
      `/artists/${encodeURIComponent(id)}/related-artists`,
      token
    );
    res.json(data.artists || []);
  } catch (err) {
    res.status(502).json({ error: err.message || "Server error" });
  }
});

// Single artist (optional)
router.get("/artist", async (req, res) => {
  const id = (req.query.id || "").trim();
  if (!id) {
    return res.status(400).json({ error: "Missing query parameter: id (artist ID)" });
  }
  try {
    const token = await getSpotifyToken();
    const data = await spotifyRequest(`/artists/${encodeURIComponent(id)}`, token);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message || "Server error" });
  }
});

// Mount so both /api/* (netlify dev) and /.netlify/functions/api/* (production redirect) work
api.use("/api", router);
api.use("/.netlify/functions/api", router);

export const handler = serverless(api);
export { api };
