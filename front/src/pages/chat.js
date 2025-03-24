import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

function ChatPage({ token }) {
    const { username } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState("");
    const currentUser = localStorage.getItem("username");

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const shouldAutoScroll = useRef(true);

    // Mark a message as seen
    const markAsSeen = useCallback(async (messageId) => {
        try {
            const response = await fetch(`http://localhost:5041/messages/${messageId}/seen`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to mark as seen.");

            // Update the message state to reflect the seen status
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, isSeen: true } : msg
                )
            );
        } catch (error) {
            console.error("Error marking message as seen:", error);
        }
    }, [token]);

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        if (!currentUser) return;

        try {
            const response = await fetch(`http://localhost:5041/messages/${currentUser}/${username}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch messages.");

            const data = await response.json();
            setMessages(data);

            // Mark messages as seen when they are fetched and if they are unread
            data.forEach((message) => {
                if (!message.isSeen && message.receiverUsername === currentUser) {
                    markAsSeen(message.id);
                }
            });
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Failed to load messages.");
        }
    }, [currentUser, username, token, markAsSeen]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Polling every 3 seconds
        return () => clearInterval(interval);
    }, [fetchMessages]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (shouldAutoScroll.current && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        shouldAutoScroll.current = scrollTop + clientHeight >= scrollHeight - 10; // Close to bottom
    };

    const sendMessage = async () => {
        if (!currentUser || !newMessage.trim()) {
            setError("Message cannot be empty.");
            return;
        }

        const messagePayload = {
            senderUsername: currentUser,
            receiverUsername: username,
            content: newMessage,
        };

        try {
            const response = await fetch("http://localhost:5041/messages/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(messagePayload),
            });

            if (!response.ok) throw new Error("Failed to send message.");

            setNewMessage("");
            fetchMessages();
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Failed to send message.");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Chat with {username}</h1>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            {/* Messages container */}
            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                style={{
                    flexGrow: 1,
                    overflowY: "auto",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            padding: "10px",
                            margin: "5px 0",
                            backgroundColor: message.senderUsername === currentUser ? "#e6f0ff" : "#f0f0f0",
                            borderRadius: "10px",
                            alignSelf: message.senderUsername === currentUser ? "flex-end" : "flex-start",
                            maxWidth: "60%",
                            position: "relative",
                        }}
                    >
                        <strong>{message.senderUsername}:</strong> {message.content}
                        <br />
                        <small>{new Date(message.timestamp).toLocaleString()}</small>

                        {/* Display 'Seen' if the message is seen and the current user is the sender */}
                        {message.isSeen && message.senderUsername === currentUser && (
                            <span
                                style={{
                                    position: "absolute",
                                    bottom: "0px",
                                    right: "0px",
                                    fontSize: "10px",
                                    color: "#007bff",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{ marginRight: "5px" }}>✔️</span> {/* Double check mark */}
                            </span>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Message input box */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    borderTop: "1px solid #ccc",
                    backgroundColor: "#fff",
                }}
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        flex: 1,
                    }}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: "10px 20px",
                        borderRadius: "5px",
                        border: "none",
                        backgroundColor: "#007bff",
                        color: "white",
                        cursor: "pointer",
                        marginLeft: "10px",
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatPage;
