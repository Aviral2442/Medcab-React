import {Button, Card, CardBody, Col, Container, Form, FormControl, FormGroup, FormLabel, Row} from 'react-bootstrap'
import AppLogo from '@/components/AppLogo'

import user2 from '@/assets/images/users/user-2.jpg'
import {Link} from 'react-router'
import {appName, author, currentYear} from '@/helpers'
import PageMeta from "@/components/PageMeta.tsx";

const Page = () => {
    return (
        <>
            <PageMeta title="Lock Screen"/>

            <div className="auth-box overflow-hidden align-items-center d-flex">
                <Container>
                    <Row className="justify-content-center">
                        <Col xxl={4} md={6} sm={8}>
                            <Card>
                                <CardBody>
                                    <div className="auth-brand mb-4">
                                        <AppLogo/>
                                        <p className="text-muted w-lg-75 mt-3">This screen is locked. Enter your
                                            password to
                                            continue</p>
                                    </div>

                                    <div className="text-center mb-4">
                                        <img src={user2} height={80} width={80}
                                             className="rounded-circle img-thumbnail avatar-xxl mb-2" alt="thumbnail"/>
                                        <span>
                                        <h5 className="my-0 fw-semibold">Maxine Kennedy</h5>
                                        <h6 className="my-0 text-muted">Admin Head</h6>
                                    </span>
                                    </div>

                                    <Form>
                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userPassword">
                                                Password<span className="text-danger">*</span>
                                            </FormLabel>
                                            <FormControl type="password" id="userPassword" placeholder="••••••••"
                                                         required/>
                                        </FormGroup>

                                        <div className="d-grid">
                                            <Button variant="primary" type="submit" className="fw-semibold py-2">
                                                Unlock
                                            </Button>
                                        </div>
                                    </Form>

                                    <p className="text-muted text-center mt-4 mb-0">
                                        Not you? Return to{' '}
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
