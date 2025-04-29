import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/reminderlist.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReminderList() {
  const [reminders, setReminders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [confirmingReminderId, setConfirmingReminderId] = useState(null);

  const BASE_URL = "http://localhost:5000/reminders";

  const fetchReminders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/view`);
      if (response.data.success) {
        setReminders(response.data.reminders);
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const deleteReminder = async () => {
    try {
      await axios.delete(`${BASE_URL}/delete/${confirmingReminderId}`);
      setReminders(reminders.filter((r) => r._id !== confirmingReminderId));
      toast.success("🗑️ Reminder deleted successfully!");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("❌ Failed to delete reminder.");
    } finally {
      setConfirmingReminderId(null);
    }
  };

  const startEditing = (reminder) => {
    setEditingReminder({ ...reminder });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingReminder((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${BASE_URL}/update/${editingReminder._id}`,
        editingReminder
      );
      setIsEditing(false);
      setEditingReminder(null);
      fetchReminders();
      toast.success("✅ Reminder updated successfully!");
    } catch (error) {
      console.error("Error saving edited reminder:", error);
      toast.error("❌ Failed to update reminder.");
    }
  };

  return (
    <div id="reminder-list-container">
      {/* Blur both list and sidebar when editing or deleting */}
      <div className={isEditing || confirmingReminderId ? "blurred" : ""}>
        <div id="reminder-card">
          <h2 id="reminder-title">Your Reminders</h2>
          {reminders.length === 0 && <p>No Reminders Set</p>}
          <ul id="reminder-list">
            {reminders.map((item) => (
              <li key={item._id} className="reminder-item">
                <div className="reminder-content">
                  <strong>{item.date}</strong> at {item.time} - {item.text}
                </div>
                <div className="actions">
                  <FaEdit
                    className="edit-icon"
                    onClick={() => startEditing(item)}
                  />
                  <FaTrash
                    className="delete-icon"
                    onClick={() => setConfirmingReminderId(item._id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="edit-modal">
          <div className="edit-card">
            <h3>Edit Reminder</h3>
            <input
              type="text"
              name="text"
              value={editingReminder.text}
              onChange={handleEditChange}
              placeholder="Reminder Text"
            />
            <input
              type="date"
              name="date"
              value={editingReminder.date}
              onChange={handleEditChange}
            />
            <input
              type="time"
              name="time"
              value={editingReminder.time}
              onChange={handleEditChange}
            />
            <div className="edit-buttons">
              <button onClick={saveEdit}>Save</button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingReminder(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmingReminderId && (
        <div className="edit-modal">
          <div className="edit-card">
            <h3>Delete this reminder?</h3>
            <div className="edit-buttons">
              <button onClick={deleteReminder}>Yes</button>
              <button onClick={() => setConfirmingReminderId(null)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        toastClassName="custom-toast"
      />
    </div>
  );
}
