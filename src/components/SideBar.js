import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { items } from "../shared/constants/sidebarItems";
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  return (
    <div style={{ height: "92vh", marginTop: 50 }}>
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col
            md={2}
            className="bg-dark text-light d-flex flex-column"
            style={{ paddingTop: 10 }}
          >
            {/* Sidebar content */}

            <ul>
              {items.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </Col>
          <Col md={9} className="d-flex flex-column">
            {/* Main content */}
            <div className="flex-grow-1">
              <h1>Main Content</h1>
              <p>This is the main content area.</p>
              {activeItem && <p>Selected: {activeItem}</p>}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sidebar;
