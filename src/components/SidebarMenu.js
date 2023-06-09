import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { theme } from "../shared/constants";

const SidebarMenu = ({ activeMenuItem }) => {
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    activeMenuItem && setActiveItem(activeMenuItem);
  }, []);

  const handleMenuItemClick = (menuItem) => {
    setActiveItem(menuItem);
  };
  
  return (
    <div style={{ display: "flex", height: "100vh", minHeight: "400px" }}>
      <Sidebar backgroundColor={theme.secondary_color} width="201px">
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
              };
            },
          }}
        >
          {/* <MenuItem
            active={activeItem === "home"}
            // onClick={() => handleMenuItemClick("home")}
            component={<Link to="/home" />}
          >
            HomePage
          </MenuItem> */}
          <MenuItem>All Ads</MenuItem>
          <MenuItem>User List</MenuItem>
          <MenuItem>Banners</MenuItem>
          <MenuItem>State</MenuItem>
          <MenuItem>Location</MenuItem>
          <MenuItem>Area</MenuItem>
          <MenuItem>Service</MenuItem>
          <MenuItem
            active={activeItem === "category"}
            // onClick={() => handleMenuItemClick("category")}
            component={<Link to="/home/category" />}
          >
            Category
          </MenuItem>
          <MenuItem>SubCategory</MenuItem>
          <MenuItem>Question Mapping</MenuItem>


        </Menu>
      </Sidebar>
    </div>
  );
};
export default SidebarMenu;
