// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KeywordGeneration from './components/KeywordGeneration';
import KeywordStrategyBuilder from './components/KeywordStrategyBuilder';
import Signup from "./components/Signup";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/keyword-generation" element={<KeywordGeneration />} />
        <Route
          path="/keyword-strategy-builder"
          element={<KeywordStrategyBuilder />}
        />
      </Routes>
    </Router>
  );
}

export default App;
