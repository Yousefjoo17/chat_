import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage({ token }) {
    const [usernames, setUsernames] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const username = localStorage.getItem("username"); // Get current user

    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const response = await fetch(`http://localhost:5041/users/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch usernames");
                }

                const data = await response.json();
                setUsernames(data);
            } catch (error) {
                console.error("Error fetching usernames:", error);
                setError("Failed to load usernames. Please try again later.");
            }
        };

        if (username) {
            fetchUsernames();
        }
    }, [token, username]);

    // Styles
    const styles = {
        homePage: {
            backgroundColor: "#e6f0ff",
            minHeight: "100vh",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
        },
        title: {
            fontSize: "2rem",
            color: "#333",
            textAlign: "center",
            marginBottom: "20px",
        },
        errorMessage: {
            color: "red",
            textAlign: "center",
            marginBottom: "20px",
        },
        usernameList: {
            listStyle: "none",
            padding: "0",
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            justifyContent: "center",
        },
        usernameItem: {
            backgroundColor: "#ffffff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            width: "200px",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
        },
        chatIcon: {
            color: "#007bff", // Blue color
            fontSize: "1.5rem",
            cursor: "pointer",
            transition: "transform 0.2s",
        },
        chatIconHover: {
            transform: "scale(1.2)",
        },
    };

    return (
        <div style={styles.homePage}>
            <h1 style={styles.title}>Welcome</h1>
            {error && <p style={styles.errorMessage}>{error}</p>}
            <h2 style={styles.title}>Contact with our famous users</h2>
            <ul style={styles.usernameList}>
                {usernames.map((username, index) => (
                    <li key={index} style={styles.usernameItem}>
                        {username}
                        <span
                            style={styles.chatIcon}
                            onClick={() => navigate(`/chat/${username}`)}
                            onMouseEnter={(e) => (e.target.style.transform = styles.chatIconHover.transform)}
                            onMouseLeave={(e) => (e.target.style.transform = "none")}
                        >
                            💬
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HomePage;
