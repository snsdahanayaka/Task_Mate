import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import happyImage from "../assets/happy.jpeg";
import sadImage from "../assets/sad.jpeg";
import angryImage from "../assets/angry.jpeg";
import stressImage from "../assets/stress.jpeg";

// Emoji mapping for moods
const moodEmojis = {
  Happy: "😊",
  Sad: "😢",
  Angry: "😠",
  Stress: "😓",
};


const moods = [
  { name: "Happy", image: happyImage },
  { name: "Sad", image: sadImage },
  { name: "Angry", image: angryImage },
  { name: "Stress", image: stressImage },
];

const Container = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const MoodOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const MoodButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
`;

const MoodImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

const MoodText = styled.p`
  margin: 5px 0 0;
  font-size: 16px;
  color: #333;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 30px;
`;

const MoodSelection = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const detectedMood = localStorage.getItem('selectedMood');
    if (detectedMood) {
      // Normalize mood to capitalize first letter
      const normalizedMood = detectedMood.charAt(0).toUpperCase() + detectedMood.slice(1).toLowerCase();
      setSelectedMood(normalizedMood);
    }
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem("selectedMood", mood);
  };

  const handleMoodSubmit = () => {
    if (!selectedMood) {
      alert("Please select a mood!");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <Container>
      <h2>Select Your Mood</h2>
      <MoodOptions>
        {moods.map((mood) => (
          <MoodButton key={mood.name} onClick={() => handleMoodSelect(mood.name)}>
            <MoodImage src={mood.image} alt={mood.name} />
            {/* Show emoji next to the image */}
            <div style={{ fontSize: '2rem', margin: '8px 0' }}>{moodEmojis[mood.name]}</div>
            <MoodText>{mood.name}</MoodText>
          </MoodButton>
        ))}
      </MoodOptions>

      {selectedMood && (
        <div>
          {/* Show emoji for selected mood */}
          <div style={{ fontSize: '3rem', margin: '10px 0' }}>
            {moodEmojis && moodEmojis[selectedMood]}
          </div>
          <h3>You selected: {selectedMood}</h3>
          <SubmitButton onClick={handleMoodSubmit}>Submit Mood</SubmitButton>
        </div>
      )}
    </Container>
  );
};

export default MoodSelection;