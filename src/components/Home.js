import React, { useContext } from "react";
import { LocalStorage } from "../shared/lib";
import { Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Sidebar from "./SideBar";
export default function Home() {
  const { logout } = useContext(AuthContext);
  const Navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    Navigate("/login");
  };

  return (
    <div>
      <NavigationBar />
      <Sidebar />
      {/* <Button onClick={handleLogout}>Logout</Button> */}
    </div>
  );
}
