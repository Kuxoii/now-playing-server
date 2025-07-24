const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "67612e0515e83e8f77e88f3611477b5e";
const USERNAME = "Kuxoii";

// ✅ Mobile-safe CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow null origin (e.g., mobile apps, Safari privacy mode)
    if (!origin || /kuxoii\.com$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ✅ Preflight handler
app.options("/now-playing", cors(corsOptions));

app.get("/now-playing", async (req, res) => {
  try {
    const fetch = await import("node-fetch").then(mod => mod.default);
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;
    const response = await fetch(url);
    const data = await response.json();

    // Explicit mobile-safe headers
    res.set({
      "Access-Control-Allow-Origin": req.headers.origin || "*",
      "Vary": "Origin"
    });

    res.json(data);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
