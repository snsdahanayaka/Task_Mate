const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    text: String,
    date: String,
    time: String,
    status: {
        type: String,
        enum: ["upcoming", "missed", "completed"],
        default: "upcoming",
    },
});

module.exports = mongoose.model("Reminder", reminderSchema);