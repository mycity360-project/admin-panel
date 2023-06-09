import React from "react";
import {Link} from "react-router-dom";
import {Sidebar, Menu, MenuItem} from "react-pro-sidebar";
import {theme} from "../shared/constants";

const SidebarMenu = () => {
  return (
    <div style={{display: "flex", height: "100%", minHeight: "1000px"}}>
      <Sidebar backgroundColor={theme.secondary_color}>
        <Menu>
          <MenuItem component={<Link to="/home" />}> HomePage</MenuItem>
          <MenuItem component={<Link to="/home/category" />}>
            {" "}
            Category
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};
export default SidebarMenu;
