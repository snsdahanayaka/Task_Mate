const handleSendMessage = (event) => {
    event.preventDefault();
    if (userInput.trim() === "") return;

    const userMessage = { text: userInput, sender: "user" };
    const botResponse = getBotResponse(userInput);
    const botMessage = { text: botResponse, sender: "bot" };

    setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    setUserInput("");
};