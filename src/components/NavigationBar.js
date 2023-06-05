import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const NavigationBar = () => {
  return (
    <Navbar style={{ backgroundColor: "#FF8C00" }} variant="dark" expand="lg">
      <Navbar.Brand href="#home" style={{ color: "#FFF" }}>
        My Website
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown
            title="Profile"
            id="basic-nav-dropdown"
            style={{ color: "#FFF" }}
            className="order-lg-last"
          >
            <NavDropdown.Item href="#profile">My Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
