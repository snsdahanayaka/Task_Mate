import React, { useEffect, useState } from "react";
import "../styles/summary.css";
import jsPDF from "jspdf";

const ReminderSummary = () => {
  const [missedReminders, setMissedReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [completedReminders, setCompletedReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions for formatting
  const formatTimeWithAMPM = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.includes(":")
      ? timeString.split(":")
      : [timeString.slice(0, 2), timeString.slice(2)];
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    return dateString;
  };

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5000/reminders/view");
        const data = await res.json();

        if (data.success) {
          const now = new Date();
          const missed = [];
          const upcoming = [];
          const completed = [];

          data.reminders.forEach((r) => {
            const reminderDateTime = new Date(
              `${r.date}T${
                r.time.includes(":")
                  ? r.time
                  : r.time.slice(0, 2) + ":" + r.time.slice(2)
              }`
            );
            if (r.status === "completed") {
              completed.push(r);
            } else if (reminderDateTime < now) {
              missed.push(r);
            } else {
              upcoming.push(r);
            }
          });

          setMissedReminders(missed);
          setUpcomingReminders(upcoming);
          setCompletedReminders(completed);
        }
      } catch (err) {
        console.error("Failed to load reminders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const downloadPDFReport = () => {
    const doc = new jsPDF();
    let y = 20; // Vertical position tracker

    // Set document properties
    doc.setProperties({
      title: "Reminder Summary Report",
      subject: "Summary of all reminders",
      author: "Reminder Management System",
    });

    // Add header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text("REMINDER SUMMARY REPORT", 105, y, { align: "center" });
    y += 10;

    // Add generation date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, y, {
      align: "center",
    });
    y += 15;

    // Define sections
    const sections = [
      {
        title: "Missed Reminders",
        list: missedReminders,
        color: [198, 40, 40],
        icon: "❌",
      },
      {
        title: "Upcoming Reminders",
        list: upcomingReminders,
        color: [30, 136, 229],
        icon: "⏳",
      },
      {
        title: "Completed Reminders",
        list: completedReminders,
        color: [56, 142, 60],
        icon: "✅",
      },
    ];

    // Generate each section
    sections.forEach((section) => {
      // Section header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(section.color[0], section.color[1], section.color[2]);
      doc.text(
        `${section.icon} ${section.title} (${section.list.length})`,
        14,
        y
      );
      y += 8;

      // Add light background
      doc.setFillColor(
        section.color[0],
        section.color[1],
        section.color[2],
        0.1
      );
      doc.rect(10, y - 2, 190, 8, "F");

      // Column headers
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Reminder", 15, y + 5);
      doc.text("Date", 100, y + 5);
      doc.text("Time", 150, y + 5);
      y += 12;

      if (section.list.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("No reminders in this category", 15, y);
        y += 10;
      } else {
        section.list.forEach((reminder) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);

          // Reminder text with word wrap
          const splitText = doc.splitTextToSize(reminder.text, 80);
          doc.text(splitText, 15, y);

          // Date and time
          doc.text(formatDateDisplay(reminder.date), 100, y);
          doc.text(formatTimeWithAMPM(reminder.time), 150, y);

          // Adjust vertical position
          const rowHeight = Math.max(7, splitText.length * 7);
          y += rowHeight;

          // Add separator line
          doc.setDrawColor(220, 220, 220);
          doc.line(15, y - 2, 195, y - 2);
          y += 5;

          // Add new page if needed
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
      }
      y += 10;
    });

    // Add footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by Reminder Management System", 105, 285, {
      align: "center",
    });

    // Save the PDF
    doc.save("Reminder_Summary_Report.pdf");
  };

  if (isLoading) {
    return (
      <div className="summary-container">
        <h1 className="summary-heading">📝 Reminder Summary Report</h1>
        <div className="loading-message">Loading reminders...</div>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <h1 className="summary-heading">📝 Reminder Summary Report</h1>

      <div className="summary-cards">
        <div className="summary-card missed">
          <h3>❌ Missed Reminders ({missedReminders.length})</h3>
          {missedReminders.length === 0 ? (
            <p className="no-reminders">No missed reminders</p>
          ) : (
            <ul className="reminder-list">
              {missedReminders.map((r, i) => (
                <li key={i} className="reminder-item">
                  <span className="reminder-text">{r.text}</span>
                  <span className="reminder-datetime">
                    {formatDateDisplay(r.date)} at {formatTimeWithAMPM(r.time)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="summary-card upcoming">
          <h3>⏳ Upcoming Reminders ({upcomingReminders.length})</h3>
          {upcomingReminders.length === 0 ? (
            <p className="no-reminders">No upcoming reminders</p>
          ) : (
            <ul className="reminder-list">
              {upcomingReminders.map((r, i) => (
                <li key={i} className="reminder-item">
                  <span className="reminder-text">{r.text}</span>
                  <span className="reminder-datetime">
                    {formatDateDisplay(r.date)} at {formatTimeWithAMPM(r.time)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="summary-card completed">
          <h3>✅ Completed Reminders ({completedReminders.length})</h3>
          {completedReminders.length === 0 ? (
            <p className="no-reminders">No completed reminders</p>
          ) : (
            <ul className="reminder-list">
              {completedReminders.map((r, i) => (
                <li key={i} className="reminder-item">
                  <span className="reminder-text">{r.text}</span>
                  <span className="reminder-datetime">
                    {formatDateDisplay(r.date)} at {formatTimeWithAMPM(r.time)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="summary-actions">
        <button onClick={downloadPDFReport} className="download-btn">
          📄 Download Full Summary Report (PDF)
        </button>
      </div>
    </div>
  );
};

export default ReminderSummary;
