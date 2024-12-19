const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File paths
const DATA_DIR = "data";
const USERS_FILE = path.join(DATA_DIR, "users.json");
const VIDEOS_FILE = path.join(DATA_DIR, "videos.json");
const VOTES_FILE = path.join(DATA_DIR, "votes.json");

// Helper functions to load and save JSON
const loadJson = async (filePath) => {
  try {
    if (await fs.pathExists(filePath)) {
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error(`Error loading JSON from ${filePath}:`, err);
    return [];
  }
};

const saveJson = async (filePath, data) => {
  try {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(data, null, 4));
  } catch (err) {
    console.error(`Error saving JSON to ${filePath}:`, err);
  }
};

// Serve React app (if integrated)
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// API Endpoints

// User Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Missing 'name' or 'email' field" });
    }

    console.log("Received signup data:", req.body);

    const users = await loadJson(USERS_FILE);

    if (users.some((user) => user.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = { name, email, votes: [] };
    users.push(newUser);

    await saveJson(USERS_FILE, users);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health Check
app.get("/health", (req, res) => {
  res.send("OK");
});

// Admin Upload a Video
app.post("/admin/upload", async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Missing 'title' or 'url' field" });
    }

    console.log("Received video upload data:", req.body);

    const videos = await loadJson(VIDEOS_FILE);
    const newVideo = { id: videos.length + 1, title, url };

    videos.push(newVideo);

    await saveJson(VIDEOS_FILE, videos);
    res.status(201).json({ message: "Video uploaded successfully!" });
  } catch (err) {
    console.error("Error during video upload:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Videos
app.get("/videos", async (req, res) => {
  try {
    const videos = await loadJson(VIDEOS_FILE);
    res.status(200).json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Record a Vote
app.post("/vote", async (req, res) => {
  try {
    const { video1_id, video2_id, preferred_video_id } = req.body;

    if (!video1_id || !video2_id || !preferred_video_id) {
      return res.status(400).json({ error: "Missing required vote fields" });
    }

    console.log("Received vote data:", req.body);

    const votes = await loadJson(VOTES_FILE);
    votes.push(req.body);

    await saveJson(VOTES_FILE, votes);
    res.status(201).json({ message: "Vote recorded successfully!" });
  } catch (err) {
    console.error("Error during voting:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin Report for Voting Results
app.get("/admin/report", async (req, res) => {
  try {
    const votes = await loadJson(VOTES_FILE);
    const videoPreferences = {};

    votes.forEach((vote) => {
      const pairKey = `${vote.video1_id}-${vote.video2_id}`;
      if (!videoPreferences[pairKey]) {
        videoPreferences[pairKey] = {
          video1_id: vote.video1_id,
          video2_id: vote.video2_id,
          video1_votes: 0,
          video2_votes: 0,
          total_votes: 0,
        };
      }

      if (vote.preferred_video_id === vote.video1_id) {
        videoPreferences[pairKey].video1_votes += 1;
      } else if (vote.preferred_video_id === vote.video2_id) {
        videoPreferences[pairKey].video2_votes += 1;
      }

      videoPreferences[pairKey].total_votes += 1;
    });

    res.status(200).json({ aggregated: videoPreferences });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the Server
app.listen(PORT, async () => {
  await fs.ensureDir(DATA_DIR); // Ensure data directory exists
  console.log(`Server is running on http://localhost:${PORT}`);
});
