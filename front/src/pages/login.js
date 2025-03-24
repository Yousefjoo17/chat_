import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:5041/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Username: username, passwordHash: password }),
            });

            const data = await response.json();
            
            if (response.ok && data.token) {
                localStorage.setItem("token", data.token); // Store token
                localStorage.setItem("username", username); // Store username
                setToken(data.token);
                setUsername(username); // Pass username to state
                navigate("/home"); // Redirect to Home Page
            } else {
                setMessage(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage("Error connecting to the server.");
        }
    };

    // Inline styles
    const styles = {
        container: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "#3b82f6",
        },
        box: {
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "1rem",
            padding: "2rem",
            width: "24rem",
            transition: "all 0.3s",
        },
        title: {
            fontSize: "1.875rem",
            fontWeight: "600",
            color: "#1e293b",
            marginBottom: "1.5rem",
            textAlign: "center",
        },
        message: {
            color: "#ef4444",
            fontSize: "0.875rem",
            textAlign: "center",
            marginBottom: "1rem",
        },
        inputGroup: {
            marginBottom: "1rem",
            width: "100%",
        },
        label: {
            display: "block",
            color: "#374151",
            fontSize: "0.875rem",
            fontWeight: "500",
        },
        input: {
            width: "100%",
            marginTop: "0.5rem",
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            textAlign: "center",
            outline: "none",
        },
        inputFocus: {
            borderColor: "#3b82f6",
            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
        },
        button: {
            width: "100%",
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            transition: "all 0.3s",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
        },
        buttonHover: {
            backgroundColor: "#2563eb",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            transform: "scale(1.05)",
        },
        signupText: {
            color: "#4b5563",
            fontSize: "0.875rem",
            textAlign: "center",
            marginTop: "1rem",
        },
        signupLink: {
            color: "#3b82f6",
            cursor: "pointer",
        },
        signupLinkHover: {
            textDecoration: "underline",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>Welcome Back</h2>
                
                {message && <p style={styles.message}>{message}</p>}
                
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Username</label>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleLogin}
                    style={styles.button}
                >
                    Login
                </button>

                <p style={styles.signupText}>
                    Don't have an account? 
                    <span 
                        style={styles.signupLink} 
                        onClick={() => navigate("/register")} // Navigate to register page
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;