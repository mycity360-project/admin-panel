import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoutes from "./components/PrivateRoutes";
import AuthProvider from "./context/AuthContext";
import { LocalStorage } from "./shared/lib";
import Category from "./pages/Category";
import AllAds from "./pages/AllAds";
import Area from "./pages/Area";
import Banners from "./pages/Banners";
import Location from "./pages/Location";
import State from "./pages/State";
import Service from "./pages/Service";
import UserList from "./pages/UserList";
import "./App.css";

function App() {
  const token = LocalStorage.getData("token");
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/home/category" element={<Category />} />
            <Route exact path="home/all-ads" element={<AllAds />} />
            <Route exact path="/home/user-list" element={<UserList />} />
            <Route exact path="/home/banners" element={<Banners />} />
            <Route exact path="/home/location" element={<Location />} />
            <Route exact path="/home/state" element={<State />} />
            <Route exact path="/home/area" element={<Area />} />
            <Route exact path="/home/service" element={<Service />} />
          </Route>
          <Route exact path="/login" element={<Login />} />
          {/* <Route path="/" element={<Login />} /> */}

          <Route
            path="*"
            element={token ? <Navigate to="/home" /> : <Login />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
