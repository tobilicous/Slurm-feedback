import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to register user.");
        }
        return res.json();
      })
      .then((data) => {
        if (data.message === "User registered successfully!") {
          alert("Signup successful! Redirecting...");
          navigate("/vote");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div className="signup-container">
      <h1>Sign Up for Voting</h1>
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button onClick={handleSignup}>Start</button>
    </div>
  );
};

export default Signup;
