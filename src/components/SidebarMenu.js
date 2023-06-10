import React from "react";
import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { theme } from "../shared/constants";

const SidebarMenu = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        minHeight: "400px",
      }}
    >
      <Sidebar
        backgroundColor={theme.secondary_color}
        width="251px"
        fixed="left"
      >
        <Menu
          menuItemStyles={{
            button: ({ active, disabled }) => {
              return {
                color: active ? "#FF8C00" : "#FFF",
                backgroundColor: active ? "#444" : undefined,
                "&:hover": {
                  backgroundColor: "#666",
                  color: "#FF8C00",
                },
                justifyContent: "center",
              };
            },
          }}
        >
          <MenuItem
            active={window.location.pathname === "/home/all-ads"}
            component={<Link to="home/all-ads" />}
          >
            All Ads
          </MenuItem>
          <MenuItem
            active={window.location.pathname === "home/user-list"}
            component={<Link to="/home/user-list" />}
          >
            User List
          </MenuItem>
          <MenuItem
            active={window.location.pathname === "home/banners"}
            component={<Link to="/home/banners" />}
          >
            Banners
          </MenuItem>
          <MenuItem
            active={window.location.pathname === "home/state"}
            component={<Link to="/home/state" />}
          >
            State
          </MenuItem>
          <MenuItem
            active={window.location.pathname === "home/location"}
            component={<Link to="/home/location" />}
          >
            Location
          </MenuItem>
          <MenuItem
            active={window.location.pathname === "home/area"}
            component={<Link to="/home/area" />}
          >
            Area
          </MenuItem>
          <MenuItem
            active={window.location.pathname === "home/service"}
            component={<Link to="/home/service" />}
          >
            Service
          </MenuItem>
          <MenuItem
            active={window.location.pathname === "/home/category"}
            component={<Link to="/home/category" />}
          >
            Category
          </MenuItem>
          <MenuItem
            active={window.location.pathname === "/home/sub-category"}
            component={<Link to="/home/sub-category" />}
          >
            SubCategory
          </MenuItem>
          <MenuItem>Question Mapping</MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};
export default SidebarMenu;
