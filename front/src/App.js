import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";  // Import the Register page
import Profile from "./pages/profile";
import HomePage from "./pages/home";
import ChatPage from "./pages/chat";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />  {/* Register Route */}

                {/* Protected Routes */}
                <Route path="/profile" element={token ? <Profile token={token} /> : <Navigate to="/" />} />
                <Route path="/home" element={token ? <HomePage token={token} /> : <Navigate to="/" />} />
                <Route path="/chat/:username" element={token ? <ChatPage token={token} /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
