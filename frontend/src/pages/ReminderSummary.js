import React, { useEffect, useState } from "react";
import "../styles/summary.css";

const ReminderSummary = () => {
  const [missedReminders, setMissedReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [completedReminders, setCompletedReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch("http://localhost:5000/reminders/view"); // Match your backend port
        const data = await res.json();

        if (data.success) {
          const missed = data.reminders.filter((r) => r.status === "missed");
          const upcoming = data.reminders.filter(
            (r) => r.status === "upcoming"
          );
          const completed = data.reminders.filter(
            (r) => r.status === "completed"
          );

          setMissedReminders(missed);
          setUpcomingReminders(upcoming);
          setCompletedReminders(completed);
        }
      } catch (err) {
        console.error("Failed to load reminders:", err);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="summary-cards">
      <div className="summary-card missed">
        <h3>Missed Reminders</h3>
        {missedReminders.length === 0 ? (
          <p>No reminders</p>
        ) : (
          missedReminders.map((r, i) => (
            <p key={i}>
              {r.text} — {r.date} {r.time}
            </p>
          ))
        )}
      </div>

      <div className="summary-card upcoming">
        <h3>Upcoming Reminders</h3>
        {upcomingReminders.length === 0 ? (
          <p>No reminders</p>
        ) : (
          upcomingReminders.map((r, i) => (
            <p key={i}>
              {r.text} — {r.date} {r.time}
            </p>
          ))
        )}
      </div>

      <div className="summary-card completed">
        <h3>Completed Reminders</h3>
        {completedReminders.length === 0 ? (
          <p>No reminders</p>
        ) : (
          completedReminders.map((r, i) => (
            <p key={i}>
              {r.text} — {r.date} {r.time}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default ReminderSummary;
