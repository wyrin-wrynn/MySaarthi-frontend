// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import VideoPage from "./pages/VideoPage";
import HomePage from "./pages/HomePage"; // Import HomePage
import VideoEditorPage from "./pages/VideoEditorPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Use Layout as the wrapper for nested routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="video" element={<VideoPage />} />
          <Route path="video-editor/:id" element={<VideoEditorPage />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
