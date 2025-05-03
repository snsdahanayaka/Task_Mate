const express = require("express");
const Reminder = require("../models/Reminder");

const router = express.Router();

router.post("/add", async(req, res) => {
    try {
        const { text, date, time } = req.body;
        if (!text || !date || !time) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newReminder = new Reminder({ text, date, time });
        const savedReminder = await newReminder.save();
        res.status(201).json({ success: true, reminder: savedReminder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/view", async(req, res) => {
    try {
        const reminders = await Reminder.find();
        const now = new Date();

        const updatedReminders = await Promise.all(
            reminders.map(async(reminder) => {
                const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
                if (reminder.status !== "completed") {
                    reminder.status = reminderDateTime < now ? "missed" : "upcoming";
                    await reminder.save();
                }
                return reminder;
            })
        );

        res.status(200).json({ success: true, reminders: updatedReminders });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve reminders" });
    }
});

router.put("/update/:id", async(req, res) => {
    try {
        const updatedReminder = await Reminder.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        if (!updatedReminder) {
            return res
                .status(404)
                .json({ success: false, message: "Reminder not found" });
        }
        res.status(200).json({ success: true, updatedReminder });
    } catch (error) {
        res.status(500).json({ error: "Failed to update reminder" });
    }
});

router.delete("/delete/:id", async(req, res) => {
    try {
        const deleted = await Reminder.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res
                .status(404)
                .json({ success: false, message: "Reminder not found" });
        }
        res.status(200).json({ success: true, message: "Reminder deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete reminder" });
    }
});

router.get("/summary/:month", async(req, res) => {
    try {
        const month = req.params.month; // e.g., "2025-05"
        const reminders = await Reminder.find({ date: { $regex: `^${month}` } });
        const now = new Date();
        const summary = { missed: 0, upcoming: 0, completed: 0 };

        reminders.forEach((r) => {
            const dt = new Date(`${r.date}T${r.time}`);
            if (r.status === "completed") summary.completed++;
            else if (dt < now) summary.missed++;
            else summary.upcoming++;
        });

        res.status(200).json({ success: true, summary });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch monthly summary" });
    }
});

module.exports = router;