import React from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { MainContent } from "../components/MainContent";

export default function Home() {
  return (
    <div>
      <NavigationBar />
      <div className="d-flex">
        <SidebarMenu />
        <MainContent />
      </div>
    </div>
  );
}
