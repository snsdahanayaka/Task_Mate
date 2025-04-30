const MoodEntry = require('../models/MoodEntry');

// Create a new mood entry
exports.createMoodEntry = async (req, res) => {
  try {
    const { mood, rating, description, weatherCondition, emotionTriggers, sleepQuality } = req.body;

    // Validate required fields
    if (!mood || !rating) {
      return res.status(400).json({ error: 'Mood and rating are required fields.' });
    }

    // Create a new mood entry
    const newEntry = new MoodEntry({
      userId: req.user.id, // Assuming user authentication is implemented
      mood,
      rating,
      description,
      weatherCondition,
      emotionTriggers,
      sleepQuality,
    });

    // Save the entry to the database
    await newEntry.save();

    // Send a success response
    res.status(201).json({ message: 'Mood entry saved successfully!', entry: newEntry });
  } catch (err) {
    console.error('Error saving mood entry:', err);
    res.status(500).json({ error: 'Failed to save mood entry.', details: err.message });
  }
};

// Get all mood entries for a user
exports.getMoodHistory = async (req, res) => {
  try {
    const entries = await MoodEntry.find({ userId: req.user.id }).sort({ createdAt: -1 }); // Sort by latest first
    res.status(200).json(entries);
  } catch (err) {
    console.error('Error fetching mood entries:', err);
    res.status(500).json({ error: 'Failed to fetch mood entries.', details: err.message });
  }
};

// Get a single mood entry by ID
exports.getMoodEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await MoodEntry.findById(id);

    if (!entry) {
      return res.status(404).json({ error: 'Mood entry not found.' });
    }

    res.status(200).json(entry);
  } catch (err) {
    console.error('Error fetching mood entry:', err);
    res.status(500).json({ error: 'Failed to fetch mood entry.', details: err.message });
  }
};

// Update a mood entry (within 24 hours)
exports.updateMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await MoodEntry.findById(id);

    if (!entry) {
      return res.status(404).json({ error: 'Mood entry not found.' });
    }

    // Check if the entry is older than 24 hours
    const timeDiff = Date.now() - entry.createdAt;
    if (timeDiff > 24 * 60 * 60 * 1000) {
      return res.status(400).json({ error: 'Cannot update entry after 24 hours.' });
    }

    // Validate mood and rating if provided in the request body
    if (req.body.mood) {
      const validMoods = ['Happy', 'Sad', 'Stressed', 'Angry'];
      if (!validMoods.includes(req.body.mood)) {
        return res.status(400).json({ error: 'Invalid mood selection.' });
      }
    }

    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 10)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 10.' });
    }

    // Update the entry
    const updatedEntry = await MoodEntry.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Mood entry updated successfully!', entry: updatedEntry });
  } catch (err) {
    console.error('Error updating mood entry:', err);
    res.status(500).json({ error: 'Failed to update mood entry.', details: err.message });
  }
};

// Delete a mood entry
exports.deleteMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await MoodEntry.findByIdAndDelete(id);

    if (!entry) {
      return res.status(404).json({ error: 'Mood entry not found.' });
    }

    res.status(200).json({ message: 'Mood entry deleted successfully!' });
  } catch (err) {
    console.error('Error deleting mood entry:', err);
    res.status(500).json({ error: 'Failed to delete mood entry.', details: err.message });
  }
};