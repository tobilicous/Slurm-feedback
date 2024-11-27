import React, { useState, useEffect } from "react";
import "./components/Admins.css";

const Admin = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    // Fetch the admin report from the backend
    fetch("http://localhost:5000/admin/report")
      .then((res) => res.json())
      .then((data) => setReport(data));
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Votes</th>
            <th>Average Rating</th>
          </tr>
        </thead>
        <tbody>
          {report.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.votes.map(
                  (vote) =>
                    `Pair (${vote.video1_id}, ${vote.video2_id}): Preferred ${vote.preferred_video_id}, Ratings [${vote.video1_rating}, ${vote.video2_rating}]`
                ).join("; ")}
              </td>
              <td>{user.averageRating.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
