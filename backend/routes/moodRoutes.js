const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");

// Save mood
router.post("/", async (req, res) => {
  try {
    const { mood } = req.body;
    const newMood = new Mood({ mood });
    await newMood.save();
    res.status(201).json({ message: "Mood saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save mood" });
  }
});

// Get latest mood
router.get("/latest", async (req, res) => {
  try {
    const latestMood = await Mood.findOne().sort({ timestamp: -1 });
    res.status(200).json(latestMood);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mood" });
  }
});

module.exports = router;
