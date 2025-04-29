import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, Send } from "@mui/icons-material";
import styles from "./ChatSection.module.css"; // Import CSS

const ChatSection = () => {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [input, setInput] = useState(""); // Text input state
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Send Message (Text or Voice)
  const sendMessage = () => {
    if (input.trim() || transcript.trim()) {
      setMessages([...messages, { text: input || transcript, sender: "user" }]);
      setInput("");
      resetTranscript();
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => setInput(e.target.value);

  return (
    <div className={styles.chatContainer}>
      {/* Chat Messages Display */}
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Chat Input & Voice Button */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          className={styles.chatInput}
        />
        
        {/* Voice Button */}
        <button className={styles.micButton} onClick={SpeechRecognition.startListening}>
          <Mic color={listening ? "error" : "primary"} />
        </button>

        {/* Send Button */}
        <button className={styles.sendButton} onClick={sendMessage}>
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
