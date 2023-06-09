import React, {useState, useContext, useEffect} from "react";
import {Container, Form, Button, Row, Col} from "react-bootstrap";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login, isAuthenticated} = useContext(AuthContext);
  const Navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      Navigate("/home");
    }
  }, [Navigate, isAuthenticated]);

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await login(email, password);
    Navigate("/home");
  };

  return (
    <Container>
      <Row>
        <Col md={{span: 6, offset: 3}}>
          <h1 className="text-center">Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="formEmail">
              <Form.Label column sm={2}>
                Email
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPassword">
              <Form.Label column sm={2}>
                Password
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Col>
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;