const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "67612e0515e83e8f77e88f3611477b5e";
const USERNAME = "Kuxoii";

// ✅ Hardened CORS config for mobile compatibility
app.use(cors({
  origin: ["https://kuxoii.com", "http://kuxoii.com"],
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "Accept"],
  credentials: false
}));

// ✅ Enable preflight for mobile clients if needed
app.options("/now-playing", cors());

app.get("/now-playing", async (req, res) => {
  try {
    const fetch = await import("node-fetch").then(mod => mod.default);

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
