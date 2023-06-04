import { Outlet, Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const PrivateRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
