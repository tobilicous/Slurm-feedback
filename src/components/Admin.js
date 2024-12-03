import React, { useState, useEffect } from "react";
import "../styles/Admin.css";

const Admin = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/admin/report")
      .then((res) => res.json())
      .then((data) => setReport(data.aggregated || []))
      .catch((error) => console.error("Error fetching report:", error));
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Report</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Video Pair</th>
            <th>Video 1 Votes</th>
            <th>Video 2 Votes</th>
            <th>Total Votes</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(report).map((key) => {
            const pair = report[key];
            return (
              <tr key={key}>
                <td>{`${pair.video1_id} vs ${pair.video2_id}`}</td>
                <td>{pair.video1_votes}</td>
                <td>{pair.video2_votes}</td>
                <td>{pair.total_votes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
