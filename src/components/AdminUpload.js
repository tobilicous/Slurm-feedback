import React, { useState } from "react";
import "../styles/AdminUpload.css";

const AdminUpload = () => {
  const [formData, setFormData] = useState({ title: "", url: "" });
  const [message, setMessage] = useState("");

  const handleUpload = () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      setMessage("Both fields are required.");
      return;
    }

    fetch("http://localhost:5001/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Video uploaded successfully!") {
          setMessage("Video uploaded successfully!");
          setFormData({ title: "", url: "" }); // Reset form fields
        } else {
          setMessage(data.message || "Failed to upload video.");
        }
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
        setMessage("An error occurred. Please try again.");
      });
  };

  return (
    <div className="admin-upload-container">
      <h1>Admin: Upload Videos</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        className="admin-upload-form"
      >
        <input
          type="text"
          placeholder="Video Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="admin-upload-input"
        />
        <input
          type="text"
          placeholder="Video URL"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="admin-upload-input"
        />
        <button type="submit" className="admin-upload-button">
          Upload Video
        </button>
      </form>
      {message && <p className="admin-upload-message">{message}</p>}
    </div>
  );
};

export default AdminUpload;
