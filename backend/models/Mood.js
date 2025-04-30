const mongoose = require("mongoose");

const MoodSchema = new mongoose.Schema({
  mood: { type: String, required: true },
  detectedMood: { type: String },
  emoji: { type: String },
  energyLevel: { type: String },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("Mood", MoodSchema);
