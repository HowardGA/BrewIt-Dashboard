import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/index";
import History from "./scenes/history/index";
import Login from "./Login";
import Register from "./register";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { DurationProvider } from "./context/DurationContext";
import { UserProvider } from './context/UserContext';
import Navbar from "./scenes/global/Topbar";  // Update with the correct path


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);  // Convert token presence to boolean
  }, []);

  return (
    <UserProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DurationProvider>
            <div className="app">

              <main className="content">
              {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}

                <Routes>
                
                  {isLoggedIn ? (
                    <>
                      <Route path="/dashboard/:phone" element={<Dashboard />} />
                      <Route path="/history/:phone" element={<History />} />
                    </>
                  ) : (
                    <>
                      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="*" element={<Navigate to="/login" />} />
                    </>
                  )}
                </Routes>
              </main>
            </div>
          </DurationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </UserProvider>
  );
}

export default App;
