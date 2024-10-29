import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ClassSelector from "./components/ClassSelector";
import AdminUpload from "./components/AdminUpload.js";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClassSelector />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
