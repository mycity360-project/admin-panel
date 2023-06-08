import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoutes from "./components/PrivateRoutes";
import AuthProvider from "./context/AuthContext";
import { LocalStorage } from "./shared/lib";
import Category from "./pages/Category";

function App() {
  const token = LocalStorage.getData("token");
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/home/category" element={<Category />} />
          </Route>
          <Route exact path="/login" element={<Login />} />
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="*" element={token ? <Home /> : <Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
