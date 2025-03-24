import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("red"); // Default to red for errors
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch("http://localhost:5041/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, passwordHash: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Registration successful! You can now log in.");
                setMessageColor("green");
                setTimeout(() => navigate("/"), 1000); // Redirect to login page
            } else {
                setMessage(data.message || "Fill all fields and use a unique username.");
                setMessageColor("red");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("Error connecting to the server.");
            setMessageColor("red");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.heading}>Create an Account</h2>

                {message && <p style={{ ...styles.message, color: messageColor }}>{message}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button onClick={handleRegister} style={styles.button}>Register</button>

                <p style={styles.loginText}>
                    Already have an account?{" "}
                    <span onClick={() => navigate("/")} style={styles.loginLink}>Login</span>
                </p>
            </div>
        </div>
    );
}

// CSS-in-JS styles
const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#3b82f6",
    },
    formContainer: {
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "24rem",
        textAlign: "center",
    },
    heading: {
        color: "#1e293b",
        marginBottom: "1.5rem",
    },
    message: {
        textAlign: "center",
        fontSize: "0.875rem",
        marginBottom: "1rem",
    },
    input: {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid #d1d5db",
        marginBottom: "1rem",
        textAlign: "center",
    },
    button: {
        width: "100%",
        backgroundColor: "#3b82f6",
        color: "white",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
    },
    loginText: {
        fontSize: "0.875rem",
        marginTop: "1rem",
        color: "#4b5563",
    },
    loginLink: {
        color: "#3b82f6",
        cursor: "pointer",
        textDecoration: "underline",
    },
};

export default Register;
