import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {http} from "./shared/lib";
import {env} from "./shared/constants";
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const response = await http.post(
        "user/login/",
        {
          email,
          password,
        },
        {
          headers: {
            clientid: env.CLIENT_ID,
          },
        }
      );

      const {access_token: token} = response.data;
      localStorage.setItem("token", token);
      setToken(token);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (token) {
    return (
      <Container>
        <h1>Admin Panel</h1>
        <Button variant="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Login</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default App;
