import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "/Users/tobiadesanya/Slurm-feedback/src/components/Signup.js";
import VideoPair from "/Users/tobiadesanya/Slurm-feedback/src/components/VideoPair.js";
import Admin from "/Users/tobiadesanya/Slurm-feedback/src/components/Admin.js";
import AdminUpload from "/Users/tobiadesanya/Slurm-feedback/src/components/AdminUpload.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/vote" element={<VideoPair />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
