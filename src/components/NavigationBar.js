import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function NavigationBar() {
  const { logout } = useContext(AuthContext);
  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{ backgroundColor: "#FF8C00", height: "8vh" }}
    >
      <Container>
        <Navbar.Brand href="#home" style={{ color: "#FFF", fontWeight: 500 }}>
          MyCity360
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown
              title="Hi, Anurag"
              id="basic-nav-dropdown"
              style={{ color: "#FFF" }}
            >
              <NavDropdown.Item onClick={() => logout()}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
