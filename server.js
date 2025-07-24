const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "67612e0515e83e8f77e88f3611477b5e";
const USERNAME = "Kuxoii";

// ✅ Mobile-safe, domain-restrictive CORS config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || /(^|\.)kuxoii\.com$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "User-Agent"],
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("/now-playing", cors(corsOptions)); // Preflight support

app.get("/now-playing", async (req, res) => {
  try {
    const fetch = await import("node-fetch").then(mod => mod.default);
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Upstream Last.fm error: HTTP ${response.status}`);
    }

    const data = await response.json();

    // ✅ Explicitly set mobile-friendly CORS headers
    res.set({
      "Access-Control-Allow-Origin": req.headers.origin || "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept, User-Agent",
      "Vary": "Origin"
    });

    res.json(data);
  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
