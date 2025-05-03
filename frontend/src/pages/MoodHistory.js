import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './MoodHistory.css';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons from react-icons

const MoodHistory = () => {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(8); // Number of entries per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/mood/entries');
        setEntries(response.data);
      } catch (err) {
        console.error('Error fetching mood history:', err);
      }
    };
    fetchEntries();
  }, []);

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Do you want to delete this entry?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/mood/entries/${id}`);
        setEntries(entries.filter((entry) => entry._id !== id));
        alert('Entry deleted successfully!');
      } catch (err) {
        console.error('Error deleting entry:', err);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-mood/${id}`);
  };

  return (
    <div className="mood-history-container">
      <Sidebar />
      <div className="mood-history-content">
        <h1>Mood History</h1>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Mood</th>
              <th>Rating</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((entry) => (
              <tr key={entry._id}>
                <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                <td>{entry.mood}</td>
                <td>{entry.rating}</td>
                <td>{entry.description}</td>
                <td>
                  <button onClick={() => handleUpdate(entry._id)} className="icon-btn">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(entry._id)} className="icon-btn">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(entries.length / entriesPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="button-container">
          <button onClick={() => navigate('/mood-charts')} className="view-charts-btn">
            View Mood Charts
          </button>
          <button onClick={() => navigate('/generate-report')} className="generate-report-btn">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodHistory;