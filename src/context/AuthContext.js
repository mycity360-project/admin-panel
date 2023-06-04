import { React, createContext, useState } from "react";

import { http } from "../shared/lib/axios";
import { env } from "../shared/constants/env";
import { LocalStorage } from "../shared/lib/localStorage";
export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [token, setToken] = useState(LocalStorage.getData("token") || "");
  const [userInfo, setUserInfo] = useState(null);

  const onTokenAvailable = async (token, userid) => {
    let user = await http.get(`user/${userid}/`, {
      headers: {
        clientid: env.CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    setUserInfo(user);
    LocalStorage.setItem("token", token);
    LocalStorage.setItem("userInfo", JSON.stringify(user));
    LocalStorage.setItem("userID", JSON.stringify(userid));
    setToken(token);
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

      const { access_token: token } = response.data;
      const userid = token ? response.data.user_id : "";

      if (token) {
        await onTokenAvailable(token, userid);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    LocalStorage.clear();
    setToken("");
  };
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
