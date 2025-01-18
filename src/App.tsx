import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/LoginPage.tsx";
import HomePage from "./components/home/HomePage.tsx";
import AppBar from "./components/AppBar/AppBar.tsx";
import ProfilePage from "./components/profile/ProfilePage.tsx";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login at "/" */}
        <Route path="/" element={<LoginPage />} />

        {/* Everything else uses AppBar */}
        <Route
          path="*"
          element={
            <>
              <AppBar />
              <Routes>
                {/* Match /home */}
                <Route path="home" element={<HomePage />} />
                {/* Future: match /profile */}
                <Route path="profile" element={<ProfilePage />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
