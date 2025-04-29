const express = require("express");
const Reminder = require("../models/Reminder");

const router = express.Router();

// Add a new reminder
router.post("/add", async(req, res) => {
    try {
        const { text, date, time } = req.body;

        // Check if required fields are missing
        if (!text || !date || !time) {
            return res
                .status(400)
                .json({ error: "All fields (text, date, time) are required" });
        }

        const newReminder = new Reminder({ text, date, time });
        const savedReminder = await newReminder.save();

        res.status(201).json({
            success: true,
            message: "Reminder created successfully",
            reminder: savedReminder,
        });
    } catch (error) {
        console.error("Error adding reminder:", error);
        res.status(500).json({ error: error.message });
    }
});