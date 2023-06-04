import React, { useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { env } from "./shared/constants";
import { LocalStorage } from "./shared/lib";
import Login from "./components/Login";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <PrivateRoute
            path="/dashboard"
            component={Home}
            isAuthenticated={false}
          />
          {/* Other public and protected routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
