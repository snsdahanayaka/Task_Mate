import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './MoodCharts.css';

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

const MoodCharts = () => {
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
    const labels = moodData.map((entry) => {
      const date = new Date(entry.createdAt);
      const formattedDate = date.toLocaleDateString(); // Date
      const formattedTime = date.toLocaleTimeString(); // Time
      return `${formattedDate}\n${formattedTime}`; // Display date in the first row, time in the second row
    });

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

    // Calculate percentages for pie chart
    const totalEntries = moodData.length;
    const moodPercentages = Object.keys(moodCounts).map((mood) => ({
      mood,
      percentage: ((moodCounts[mood] / totalEntries) * 100).toFixed(2),
    }));

    return { labels, moodValues, moodPercentages };
  };

  const { labels, moodValues, moodPercentages } = processMoodData();

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
          text: 'Date and Time',
        },
        ticks: {
          callback: (value, index, values) => {
            const label = values[index].label;
            if (typeof label === 'string') {
              const [date, time] = label.split('\n'); // Split date and time
              return `${date}\n${time}`;
            }
            return label;
          },
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
    labels: moodPercentages.map((item) => `${item.mood} (${item.percentage}%)`),
    datasets: [
      {
        data: moodPercentages.map((item) => item.percentage),
        backgroundColor: ['#b3ecf1', '#80e5ff', '#4dd2ff', '#1ab2ff'],
        hoverBackgroundColor: ['#b3ecf1', '#80e5ff', '#4dd2ff', '#1ab2ff'],
      },
    ],
  };

  // Insights Section
  const getInsights = () => {
    const stressedEntries = moodData.filter((entry) => entry.mood === 'Stressed');
    const weekdayStress = stressedEntries.filter((entry) => {
      const day = new Date(entry.createdAt).getDay();
      return day >= 1 && day <= 5;
    }).length;

    return `You feel stressed mostly on weekdays (${weekdayStress} out of ${stressedEntries.length} times).`;
  };

  return (
    <div className="mood-charts-container">
      <Sidebar />
      <div className="mood-charts-content">
        <h1>Mood Charts</h1>

        {/* Line Chart */}
        <div className="chart-container">
          <h2>Mood Over Time</h2>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        {/* Pie Chart */}
        <div className="chart-container">
          <h2>Overall Mood Distribution</h2>
          <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Insights Section */}
        <div className="insights-section">
          <h2>Insights</h2>
          <p>{getInsights()}</p>
        </div>

        {/* Back to Mood History Button */}
        <button onClick={() => navigate('/mood-history')} className="back-to-history-btn">
          Back to Mood History
        </button>
      </div>
    </div>
  );
};

export default MoodCharts;