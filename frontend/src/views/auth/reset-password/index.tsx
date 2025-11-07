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
import AppLogo from '@/components/AppLogo'
import {appName, author, currentYear} from '@/helpers'
import {Link} from 'react-router'
import PageMeta from "@/components/PageMeta.tsx";

const Page = () => {
    return (
        <>
            <PageMeta title="Reset Password"/>

            <div className="auth-box overflow-hidden align-items-center d-flex">
                <Container>
                    <Row className="justify-content-center">
                        <Col xxl={4} md={6} sm={8}>
                            <Card>
                                <CardBody>
                                    <div className="auth-brand mb-4">
                                        <AppLogo/>
                                        <p className="text-muted w-lg-75 mt-3">Enter your email address and we'll send
                                            you a
                                            link to reset your password.</p>
                                    </div>

                                    <Form>
                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userEmail">
                                                Email<span className="text-danger">*</span>
                                            </FormLabel>
                                            <FormControl type="email" id="userEmail" placeholder="you@example.com"
                                                         required/>
                                        </FormGroup>

                                        <div className="mb-3">
                                            <FormCheck className="fs-14 mt-0" type="checkbox"
                                                       label="Agree the Terms & Policy"/>
                                        </div>

                                        <div className="d-grid">
                                            <Button variant="primary" type="submit" className="fw-semibold py-2">
                                                Send Request
                                            </Button>
                                        </div>
                                    </Form>

                                    <p className="text-muted text-center mt-4 mb-0">
                                        Return to{' '}
                                        <Link to="/auth/sign-in"
                                              className="text-decoration-underline link-offset-3 fw-semibold">
                                            Sign in
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
