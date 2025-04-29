import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "../styles/dashboard.css"; // Ensure this CSS file exists

const ChatbotAnimation = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (userMessage.trim() === "") return;

    const userMsg = { text: userMessage, sender: "user" };
    const botResponse = getBotResponse(userMessage);
    const botMsg = { text: botResponse, sender: "bot" };

    setMessages((prevMessages) => [...prevMessages, userMsg, botMsg]);
    setUserMessage("");
  };

  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello there!";
    } else if (lowerCaseMessage.includes("how are you")) {
      return "I'm doing well, thank you!";
    } else if (lowerCaseMessage.includes("bye") || lowerCaseMessage.includes("goodbye")) {
      return "Goodbye!";
    } else {
      return "I'm not sure I understand.";
    }
  };

  return (
    <div className="chatbot-container">
      <DotLottieReact
        src="https://lottie.host/a6e8b71c-1895-4c62-833b-0a8b112954ce/7SX5ONwqQ8.lottie"
        loop
        autoplay
        style={{ width: "120px", height: "120px" }}
        onClick={toggleChat}
      />
      <button className="chatbot-button" onClick={toggleChat}>
        I'm Chatbuddy
      </button>

      {isChatOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <span>Chat with Chatbuddy</span>
            <button className="close-chat" onClick={toggleChat}>X</button>
          </div>
          <div className="chat-content">
            <div className="messages" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                  <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <form className="chat-input-container" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
                className="chat-input"
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotAnimation;