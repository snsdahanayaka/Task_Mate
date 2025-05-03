// src/components/MoodDetector.js
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const moodToTaskMap = {
  happy: "Tackle a challenging task!",
  sad: "Try a simple, uplifting task or take a break.",
  angry: "Take a deep breath and do a calming task.",
  surprised: "Explore something new or creative!",
  fearful: "Do a familiar, easy task to build confidence.",
  disgusted: "Do a quick clean-up or organize your space.",
  neutral: "Pick any task you like!",
};

const MoodDetector = ({ onMoodChange }) => {
  const videoRef = useRef();
  const [mood, setMood] = useState("");
  const [webcamError, setWebcamError] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Model loading error:", err);
        setWebcamError("Failed to load face detection models. Ensure models exist in public/models.");
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    let stream;
    if (modelsLoaded) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          setWebcamError("Could not access webcam: " + err.message);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [modelsLoaded]);

  useEffect(() => {
    let interval;
    if (modelsLoaded && !webcamError) {
      interval = setInterval(async () => {
        if (videoRef.current && !videoRef.current.paused) {
          const detections = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();
          if (detections?.expressions) {
            const sorted = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
            const topMood = sorted[0][0];
            setMood(topMood);
            if (onMoodChange) onMoodChange(topMood);
          }
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [modelsLoaded, webcamError, onMoodChange]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Detecting Mood</h2>
      {webcamError ? (
        <div style={{ color: "red" }}>{webcamError}</div>
      ) : (
        <video ref={videoRef} autoPlay muted width={320} height={240} style={{ borderRadius: 8, background: "#222" }} />
      )}
      <div style={{ marginTop: 10, fontSize: 18 }}>
        Mood: {mood || (webcamError ? "-" : "Detecting...")}
      </div>
    </div>
  );
};

export default MoodDetector;
