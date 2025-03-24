import React, { useEffect, useState } from "react";

function Profile() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch("http://localhost:5041/hello")
            .then((response) => response.text()) // Get response as plain text
            .then((data) => setMessage(data)) // Set state with data
            .catch((error) => {
                console.error("Error fetching data:", error);
                setMessage("Error fetching data");
            });
    }, []);

    return (
        <div className="Profile">
            <h2>Profile Page</h2>
            <h3>{message}</h3>
        </div>
    );
}

export default Profile;
