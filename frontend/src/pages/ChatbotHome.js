import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import styles from "./ChatbotHome.module.css";

const ChatbotHome = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (userInput.trim() === "") return;

        const userMessage = { text: userInput, sender: "user" };
        const botResponse = getBotResponse(userInput);
        const botMessage = { text: botResponse, sender: "bot" };

        setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
        setUserInput("");
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
        <div className={styles.chatbotHome}>
            <h1 className={styles.welcomeText}>Welcome to Chatbot</h1>
            <p className={styles.assistantText}>Your personal assistant is ready to help you!</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <DotLottieReact
                    src="https://lottie.host/f32d3399-43ac-43c3-a6f8-cb0af0836dcf/KucxLPFxxb.lottie"
                    loop
                    autoplay
                    style={{ width: '300px', height: '300px' }}
                />
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ textAlign: message.sender === "user" ? "right" : "left" }}>
                        <strong>{message.sender === "user" ? "You" : "Bot"}:</strong> {message.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatbotHome;