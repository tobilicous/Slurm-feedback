import React, { useState, useEffect } from "react";
import "../styles/Admin.css";

const Admin = () => {
  const [report, setReport] = useState({ votes: [], average_ratings: {} });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/admin/report")
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch((error) => console.error("Error fetching report:", error));
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <h2>Votes</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Video 1 ID</th>
            <th>Video 2 ID</th>
            <th>Video 1 Rating</th>
            <th>Video 2 Rating</th>
            <th>Preferred Video ID</th>
          </tr>
        </thead>
        <tbody>
          {report.votes.map((vote, index) => (
            <tr key={index}>
              <td>{vote.user_id}</td>
              <td>{vote.video1_id}</td>
              <td>{vote.video2_id}</td>
              <td>{vote.video1_rating}</td>
              <td>{vote.video2_rating}</td>
              <td>{vote.preferred_video_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Average Ratings</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Video ID</th>
            <th>Average Rating</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(report.average_ratings).map(([videoId, avgRating]) => (
            <tr key={videoId}>
              <td>{videoId}</td>
              <td>{avgRating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
