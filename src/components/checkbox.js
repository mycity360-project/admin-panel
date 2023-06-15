import { Container, Row, Col, Form } from "react-bootstrap";

export const Checkbox = ({ value, isDisabled }) => {
  return (
    <Container>
      <Row>
        <Col md={6}>
          <Form>
            <Form.Check
              type="checkbox"
              aria-label="Price"
              checked={value}
              disabled={isDisabled}
            />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
