import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Sidebar = () => {
  return (
    <div style={{ height: "100vh" }}>
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col md={3} className="bg-dark text-light d-flex flex-column">
            {/* Sidebar content */}
            <h3>My Sidebar</h3>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </Col>
          <Col md={9} className="d-flex flex-column">
            {/* Main content */}
            <div className="flex-grow-1">
              <h1>Main Content</h1>
              <p>This is the main content area.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sidebar;
