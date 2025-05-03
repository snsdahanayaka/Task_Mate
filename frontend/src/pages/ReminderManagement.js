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
  const [errors, setErrors] = useState({
    date: "",
    time: "",
    reminder: "",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today;
  const maxDate = new Date(2025, 11, 31);

  const addReminder = async () => {
    // Reset errors
    setErrors({
      date: "",
      time: "",
      reminder: "",
    });

    let isValid = true;
    const errorMessages = [];

    if (!date || date < today) {
      errorMessages.push("Please select a valid future date");
      isValid = false;
    }
    if (!time) {
      errorMessages.push("Please select a time");
      isValid = false;
    }
    if (!reminder.trim()) {
      errorMessages.push("Reminder text cannot be empty");
      isValid = false;
    }

    if (!isValid) {
      // Show all validation errors in one toast message
      toast.error(
        <div>
          {errorMessages.map((msg, index) => (
            <div key={index}>• {msg}</div>
          ))}
        </div>,
        {
          autoClose: 3000,
        }
      );
      return;
    }

    const newReminder = {
      text: reminder,
      date: date.toISOString().split("T")[0],
      time: time,
    };

    try {
      const response = await fetch("http://localhost:5000/reminders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReminder),
      });

      const data = await response.json();
      if (response.ok) {
        setReminders((prev) => [...prev, data.reminder]);
        setReminder("");
        setTime("");
        toast.success("Reminder added successfully!", {
          autoClose: 2000,
        });
      } else {
        toast.error(data.error || "Failed to add reminder", {
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to connect to the server", {
        autoClose: 2000,
      });
    }
  };

  // ... rest of your component code remains the same ...
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
        {errors.date && (
          <p className="error-message" style={{ color: "red" }}>
            {errors.date}
          </p>
        )}

        <div className="reminder-form">
          <label className="form-label">Select Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          {errors.time && (
            <p className="error-message" style={{ color: "red" }}>
              {errors.time}
            </p>
          )}

          <input
            type="text"
            placeholder="Enter Reminder"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
          {errors.reminder && (
            <p className="error-message" style={{ color: "red" }}>
              {errors.reminder}
            </p>
          )}

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

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        toastStyle={{
          fontSize: "14px",
          padding: "12px 16px",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}
