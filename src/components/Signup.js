import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const handleSignup = () => {
    console.log("Signup button clicked");
    if (formData.name.trim() && formData.email.trim()) {
      console.log("Submitting form with:", formData);
      fetch("http://127.0.0.1:5000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          console.log("Response status:", res.status);
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Response data:", data);
          if (data.message === "User registered successfully!") {
            alert("Signup successful! Redirecting...");
            navigate("/vote");
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to connect to the server.");
        });
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="signup-container">
      <h1>Welcome to the SLURM LAB Acceptable Contact Trajectories Form </h1>
      <p>Please enter your details to get started:</p>
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        className="signup-input"
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        className="signup-input"
      />
      <button onClick={handleSignup} className="signup-button">
        Start
      </button>
    </div>
  );
};

export default Signup;