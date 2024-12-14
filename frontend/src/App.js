// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import KeywordGeneration from './components/KeywordGeneration';
import KeywordStrategyBuilder from './components/KeywordStrategyBuilder';
import Signup from "./components/Signup";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
// import ForgotPassword from "./components/ForgotPassword";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<LandingPage />} />
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
