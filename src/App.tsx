import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/LoginPage.tsx";
import HomePage from "./components/home/HomePage.tsx";
import AppBar from "./components/AppBar/AppBar.tsx";
import ProfilePage from "./components/profile/ProfilePage.tsx";
import RegisterPage from "./components/register/RegisterPage.tsx";
import { Snackbar, Alert } from "@mui/material";
import { useAppContext } from "./contexts/AppContext.ts";
import { ThemeProvider } from "@mui/material/styles";
import OAuthRedirectHandler from "./components/login/OAuthRedirectHandler.tsx";
import theme from "./theme.ts";
import SustainabilityPage from "./components/sustainability/SustainabilityPage.tsx";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login at "/" */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/oauth-callback" element={<OAuthRedirectHandler />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes with AppBar */}
        <Route
          path="*"
          element={
            <>
              <AppBar />
              <Routes>
                <Route
                  path="home"
                  element={
                      <HomePage />
                  }
                />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="sustainability" element={<SustainabilityPage />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  const { snackbar, setSnackbar } = useAppContext();

  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
