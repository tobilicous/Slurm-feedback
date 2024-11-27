import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup.js";
import VideoPair from "./components/VideoPair.js";
import Admin from "./components/Admin.js";
import AdminUpload from "./components/AdminUpload.js";

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
