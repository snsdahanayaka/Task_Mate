const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve images statically

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define storage for Multer (File Upload)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

// Mood Schema
const MoodSchema = new mongoose.Schema({
  mood: String,
  image: String, // Path to uploaded image
});
const Mood = mongoose.model("Mood", MoodSchema);

// Route to store mood data
app.post("/api/mood", upload.single("image"), async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ message: "Mood text is required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newMood = new Mood({ mood, image: imagePath });
    await newMood.save();
    res.status(201).json({ message: "Mood saved successfully", mood: newMood });
  } catch (error) {
    res.status(500).json({ message: "Error saving mood", error: error.message });
  }
});

// Route to fetch the latest mood
app.get("/api/mood", async (req, res) => {
  try {
    const latestMood = await Mood.findOne().sort({ _id: -1 });
    res.status(200).json(latestMood);
  } catch (error) {
    res.status(500).json({ message: "Error fetching mood", error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
