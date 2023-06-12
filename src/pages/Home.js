import React from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { MainContent } from "../components/MainContent";
import Grid from "../components/Grid";
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
