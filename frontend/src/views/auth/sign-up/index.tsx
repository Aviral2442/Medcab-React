import AppLogo from '@/components/AppLogo'
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    FormCheck,
    FormControl,
    FormGroup,
    FormLabel,
    Row
} from 'react-bootstrap'
import {appName, author, currentYear} from '@/helpers'
import {Link} from 'react-router'
import PasswordInputWithStrength from '@/components/PasswordInputWithStrength'
import {useState} from 'react'
import PageMeta from "@/components/PageMeta.tsx";

const Page = () => {
    const [password, setPassword] = useState('')

    return (
        <>
            <PageMeta title="Sign Up"/>

            <div className="auth-box overflow-hidden align-items-center d-flex">
                <Container>
                    <Row className="justify-content-center">
                        <Col xxl={4} md={6} sm={8}>
                            <Card>
                                <CardBody>
                                    <div className="auth-brand mb-4">
                                        <AppLogo/>
                                        <p className="text-muted w-lg-75 mt-3">Let’s get you started. Create your
                                            account by
                                            entering your details below.</p>
                                    </div>

                                    <Form>
                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userName">
                                                Name <span className="text-danger">*</span>
                                            </FormLabel>
                                            <FormControl type="text" id="userName" placeholder="Damian D." required/>
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userEmail">
                                                Email <span className="text-danger">*</span>
                                            </FormLabel>
                                            <FormControl type="email" id="userEmail" placeholder="you@example.com"
                                                         required/>
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <PasswordInputWithStrength
                                                id="password"
                                                label="Password"
                                                name="password"
                                                password={password}
                                                setPassword={setPassword}
                                                placeholder="••••••••"
                                            />
                                        </FormGroup>

                                        <div className="mb-3">
                                            <FormCheck className="fs-14 mt-0" type="checkbox"
                                                       label="Agree the Terms & Policy"/>
                                        </div>

                                        <div className="d-grid">
                                            <Button variant="primary" type="submit" className="fw-semibold py-2">
                                                Create Account
                                            </Button>
                                        </div>
                                    </Form>

                                    <p className="text-muted text-center mt-4 mb-0">
                                        Already have an account?{' '}
                                        <Link to="/auth/sign-in"
                                              className="text-decoration-underline link-offset-3 fw-semibold">
                                            Login
                                        </Link>
                                    </p>
                                </CardBody>
                            </Card>
                            <p className="text-center text-muted mt-4 mb-0">
                                © {currentYear} {appName} — by <span className="fw-semibold">{author}</span>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Page
