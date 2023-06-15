import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PrivateRoutes from "./components/PrivateRoutes";
import AuthProvider from "./context/AuthContext";
import { LocalStorage } from "./shared/lib";
import {
  Category,
  AllAds,
  Area,
  Banners,
  Location,
  State,
  Service,
  UserList,
  SubCategory,
  Questions,
  Login,
} from "./pages";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const token = LocalStorage.getData("token");
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            {/* <Route exact path="/home" element={<Home />} /> */}
            <Route exact path="/home/category" element={<Category />} />
            <Route exact path="home" element={<AllAds />} />
            <Route exact path="/home/user-list" element={<UserList />} />
            <Route exact path="/home/banners" element={<Banners />} />
            <Route exact path="/home/location" element={<Location />} />
            <Route exact path="/home/state" element={<State />} />
            <Route exact path="/home/area" element={<Area />} />
            <Route exact path="/home/service" element={<Service />} />
            <Route exact path="/home/sub-category" element={<SubCategory />} />
            <Route exact path="/home/questions" element={<Questions />} />
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
