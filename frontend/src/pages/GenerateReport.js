import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './GenerateReport.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const GenerateReport = () => {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState([]);

  // Fetch mood data from the backend
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mood/entries');
        const data = await response.json();
        setMoodData(data);
      } catch (err) {
        console.error('Error fetching mood data:', err);
      }
    };
    fetchMoodData();
  }, []);

  // Process mood data for charts
  const processMoodData = () => {
    const labels = moodData.map((entry) => new Date(entry.createdAt).toLocaleDateString());
    const moodValues = moodData.map((entry) => {
      switch (entry.mood) {
        case 'Happy':
          return 1;
        case 'Sad':
          return 2;
        case 'Stressed':
          return 3;
        case 'Angry':
          return 4;
        default:
          return 0;
      }
    });

    const moodCounts = moodData.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return { labels, moodValues, moodCounts };
  };

  const { labels, moodValues, moodCounts } = processMoodData();

  // Line Chart Data
  const lineChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Mood Over Time',
        data: moodValues,
        borderColor: '#33c7d8',
        backgroundColor: 'rgba(51, 199, 216, 0.2)',
        fill: true,
      },
    ],
  };

  // Line Chart Options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Mood',
        },
        ticks: {
          callback: (value) => {
            switch (value) {
              case 1:
                return 'Happy';
              case 2:
                return 'Sad';
              case 3:
                return 'Stressed';
              case 4:
                return 'Angry';
              default:
                return '';
            }
          },
        },
      },
    },
  };

  // Pie Chart Data
  const pieChartData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        data: Object.values(moodCounts),
        backgroundColor: ['#b3ecf1', '#80e5ff', '#4dd2ff', '#1ab2ff'], // Light colors for pie chart
        hoverBackgroundColor: ['#b3ecf1', '#80e5ff', '#4dd2ff', '#1ab2ff'],
      },
    ],
  };

  // Function to generate and download the PDF report
  const generatePDF = () => {
    const input = document.getElementById('report-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height

      // Add the title to the PDF
      pdf.setFontSize(22); // Set font size for the title
      pdf.setFont('helvetica', 'bold'); // Set font style
      pdf.setTextColor(33, 150, 243); // Set title color (blue)
      pdf.text('Mood Tracker Report Generation', 10, 20); // Add title at (10mm, 20mm)

      // Add the captured content below the title
      pdf.addImage(imgData, 'PNG', 10, 30, imgWidth - 20, imgHeight - 20); // Add image to PDF with margins

      pdf.save('mood-report.pdf'); // Download the PDF
    });
  };

  return (
    <div className="generate-report-container">
      <Sidebar />
      <div className="generate-report-content">
        <h1>Generate Report</h1>
        <div id="report-content">
          {/* Mood Charts Section */}
          <div className="mood-charts">
            <h2>Mood Charts</h2>
            <div id="mood-chart">
              {/* Line Chart */}
              <div className="chart-container">
                <h3>Mood Over Time</h3>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>

              {/* Pie Chart */}
              <div className="chart-container">
                <h3>Overall Mood Distribution</h3>
                <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Mood History Section */}
          <div className="mood-history">
            <h2>Mood History</h2>
            <div id="mood-history">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Mood</th>
                    <th>Rating</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {moodData.map((entry) => (
                    <tr key={entry._id}>
                      <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td>{entry.mood}</td>
                      <td>{entry.rating}</td>
                      <td>{entry.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons-container">
          <button onClick={() => navigate('/mood-history')} className="back-to-history-btn">
            Back to Mood History
          </button>
          <button onClick={generatePDF} className="generate-report-btn">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;