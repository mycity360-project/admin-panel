import React from "react";
import { LocalStorage } from "../shared/lib";
export default function Home() {
  return (
    <div>
      <p>{LocalStorage.getData("token")}</p>
      <p>{LocalStorage.getData("userID")}</p>
      <p>{LocalStorage.getData("userInfo")}</p>
    </div>
  );
}
