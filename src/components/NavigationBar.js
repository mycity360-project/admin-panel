import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import {AuthContext} from "../context/AuthContext";
import {useContext} from "react";
import {theme} from "../shared/constants";

function NavigationBar() {
  const {logout, userInfo} = useContext(AuthContext);
  return (
    <Navbar expand="lg" fixed="top" style={{backgroundColor: theme.color}}>
      <Container>
        <Navbar.Brand className="font-weight-bold text-white">
          Admin Panel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title="Settings" id="basic-nav-dropdown">
              <NavDropdown.Item>Hi {userInfo.first_name}</NavDropdown.Item>
              <NavDropdown.Divider />
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
