import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import axios from "axios";
import AppLogo from "@/components/AppLogo";
import { appName, author, currentYear } from "@/helpers";
import PageMeta from "@/components/PageMeta.tsx";

const Page = () => {

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!role) {
      setError("Please select a role before signing in.");
      return;
    }
    console.log("Submitting login with:", { role, email, password });
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/auth/login`, {
        role,
        email,
        password,
      });

      console.log("Login Success:", res.data);

      localStorage.setItem("token", res.data.token);

      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Login Failed:", err);
      setError(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Sign In" />
      <div className="auth-box overflow-hidden align-items-center d-flex">
        <Container>
          <Row className="justify-content-center">
            <Col xxl={4} md={6} sm={8}>
              <Card>
                <CardBody>
                  <div className="auth-brand mb-4">
                    <AppLogo />
                    {/* <p className="text-muted w-lg-75 mt-3">
                      Let’s get you signed in. Enter your email and password to
                      continue.
                    </p> */}
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="userRole">
                        Select Role <span className="text-danger">*</span>
                      </FormLabel>
                      <Form.Select
                        id="userRole"
                        size="sm"
                        className="form-control"
                         value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        <option value="">Choose your role</option>
                        <option value="1">Admin</option>
                        <option value="2">Telecaller</option>
                        <option value="3">Accounts</option>
                        <option value="4">Blog User</option>
                      </Form.Select>
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="userEmail">
                        Email <span className="text-danger">*</span>
                      </FormLabel>
                      <FormControl
                        type="email"
                        id="userEmail"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="userPassword">
                        Password <span className="text-danger">*</span>
                      </FormLabel>
                      <FormControl
                        type="password"
                        id="userPassword"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </FormGroup>

                    {error && <p className="text-danger">{error}</p>}

                    {/* <div className="d-flex justify-content-between align-items-center mb-3">
                      <FormCheck
                        className="fs-14"
                        type="checkbox"
                        label="Keep me signed in"
                      />
                      <Link
                        to="/auth/reset-password"
                        className="text-decoration-underline link-offset-3 text-muted"
                      >
                        Forgot Password?
                      </Link>
                    </div> */}

                    <div className="d-grid">
                      <Button
                        variant="primary"
                        type="submit"
                        className="fw-semibold py-2"
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                    </div>
                  </Form>

                  {/* <p className="text-muted text-center mt-4 mb-0">
                    New here?{" "}
                    <Link
                      to="/auth/sign-up"
                      className="text-decoration-underline link-offset-3 fw-semibold"
                    >
                      Create an account
                    </Link>
                  </p> */}
                </CardBody>
              </Card>
              <p className="text-center text-muted mt-4 mb-0">
                © {currentYear} {appName} — by{" "}
                <span className="fw-semibold">{author}</span>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Page;
