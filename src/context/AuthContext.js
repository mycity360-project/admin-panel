import { React, createContext, useEffect, useState } from "react";
import { http } from "../shared/lib";
import { env } from "../shared/constants";
import { LocalStorage } from "../shared/lib/localStorage";
export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [token, setToken] = useState(LocalStorage.getData("token") || "");
  // const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  const onTokenAvailable = async (token, userid) => {
    let user = await http.get(`user/${userid}/`, {
      headers: {
        clientid: env.CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    if (user.role === "Admin") {
      LocalStorage.setData("token", token);
      LocalStorage.setData("userInfo", JSON.stringify(user));
      LocalStorage.setData("userID", JSON.stringify(userid));
      // setUserInfo(user);
      setToken(token);
      setIsAuthenticated(true);
    } else {
      throw new Error("User role is not admin.");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await http.post(
        "user/login/",
        {
          email,
          password,
        },
        {
          headers: {
            clientid: env.CLIENT_ID,
          },
        }
      );

      const { access_token: token } = response;
      const userid = token ? response.user_id : "";

      if (token) {
        await onTokenAvailable(token, userid);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    LocalStorage.clearLocalStorage();
    setToken("");
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider value={{ token, isAuthenticated ,login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
