import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calenderstyles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReminderManagement() {
  const [reminder, setReminder] = useState("");
  const [reminders, setReminders] = useState([]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today;
  const maxDate = new Date(2025, 11, 31);

  const addReminder = async () => {
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (date < today) {
      setError("You cannot select past dates.");
      return;
    }
    if (!time) {
      setError("Please select a time.");
      return;
    }
    if (!reminder.trim()) {
      setError("Reminder text cannot be empty.");
      return;
    }

    setError("");

    const newReminder = {
      text: reminder,
      date: date.toDateString(),
      time: time,
    };

    try {
      const response = await fetch("http://localhost:5000/reminders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReminder),
      });

      const data = await response.json();

      if (response.ok) {
        setReminders((prev) => [...prev, data.reminder]);
        setReminder("");
        setTime("");
        toast.success("✅ Reminder added successfully!");
      } else {
        toast.error(data.error || "❌ Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("❌ Failed to connect to the server.");
    }
  };

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch("http://localhost:5000/reminders/view");
        const data = await res.json();
        if (res.ok) {
          setReminders(data.reminders);
        } else {
          console.error("Failed to load reminders.");
        }
      } catch (err) {
        console.error("Error loading reminders:", err);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="container">
     
      <h2 className="title">Reminder Management</h2>

      <div className="calendar-container">
        <Calendar
          onChange={setDate}
          value={date}
          minDate={minDate}
          maxDate={maxDate}
          className="custom-calendar"
        />

        <div className="reminder-form">
          <label className="form-label">Select Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter Reminder"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}

          <div className="button-container">
            <button
              type="submit"
              className="set-reminder"
              onClick={addReminder}
            >
              Set Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        toastClassName="custom-toast"
      />
    </div>
  );
}
