import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Grid() {
  return (
    <Container fluid>
      <Row>
        <Col sm={3} style={{ backgroundColor: "lightgray" }}>
          <div>
            Sidebar
            {/* Place your sidebar component here */}
          </div>
        </Col>
        <Col sm={9}>
          <Row>
            <Col>
              <div>Navigation Bar Place your navigation bar component here</div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                Main Content
                {/* Place your main content component here */}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Grid;
