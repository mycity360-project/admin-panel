import React, { useContext } from "react";
import { LocalStorage } from "../shared/lib";
import { Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const { logout } = useContext(AuthContext);
  const Navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    Navigate("/login");
  };

  return (
    <div>
      <p>{LocalStorage.getData("token")}</p>
      <p>{LocalStorage.getData("userID")}</p>
      <p>{LocalStorage.getData("userInfo")}</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
