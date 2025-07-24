const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "67612e0515e83e8f77e88f3611477b5e";
const USERNAME = "Kuxoii";

// Allow all origins for wide compatibility (can be restricted if needed)
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, User-Agent");
  next();
});

app.get("/now-playing", async (req, res) => {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Last.fm API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    let tracks = data?.recenttracks?.track;

    // Normalize track to always be an array
    if (tracks && !Array.isArray(tracks)) {
      tracks = [tracks];
      data.recenttracks.track = tracks;
    }

    res.json(data);
  } catch (err) {
    console.error("🚨 Failed to fetch now playing track:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
