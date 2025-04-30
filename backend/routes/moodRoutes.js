const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");
const auth = require("../middleware/auth");

// Save mood with detection
router.post("/", auth, async (req, res) => {
  try {
    const { mood, detectedMood, emoji, energyLevel } = req.body;
    const newMood = new Mood({
      mood,
      detectedMood,
      emoji,
      energyLevel,
      userId: req.user.id
    });
    await newMood.save();
    res.status(201).json({ message: "Mood saved successfully!", mood: newMood });
  } catch (error) {
    res.status(500).json({ error: "Failed to save mood" });
  }
});

// Get latest mood for user
router.get("/latest", auth, async (req, res) => {
  try {
    const latestMood = await Mood.findOne({ userId: req.user.id }).sort({ timestamp: -1 });
    res.status(200).json(latestMood);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mood" });
  }
});

// Get mood history for user
router.get("/history", auth, async (req, res) => {
  try {
    const moodHistory = await Mood.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(10);
    res.status(200).json(moodHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mood history" });
  }
});

module.exports = router;
