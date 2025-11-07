import {Button, Card, CardBody, Col, Container, Form, FormGroup, Row} from 'react-bootstrap'
import AppLogo from '@/components/AppLogo'
import OTPInput from '@/components/OTPInput'
import {useState} from 'react'
import {Link} from 'react-router'
import {appName, author, currentYear} from '@/helpers'
import PageMeta from "@/components/PageMeta.tsx";

const Page = () => {
    const [code, setCode] = useState<string[]>(Array(6).fill(''))

    return (
        <>
            <PageMeta title="Two Factor Authentication"/>

            <div className="auth-box overflow-hidden align-items-center d-flex">
                <Container>
                    <Row className="justify-content-center">
                        <Col xxl={4} md={6} sm={8}>
                            <Card>
                                <CardBody>
                                    <div className="auth-brand mb-4">
                                        <AppLogo/>
                                        <p className="text-muted w-lg-75 mt-3">We've emailed you a 6-digit verification
                                            code
                                            we sent to</p>
                                    </div>

                                    <div className="text-center mb-4">
                                        <div className="fw-bold fs-4">+ (12) ******6789</div>
                                    </div>

                                    <Form>
                                        <FormGroup className="mb-3">
                                            <OTPInput code={code} setCode={setCode} label="Enter your 6-digit code"/>
                                        </FormGroup>

                                        <div className="d-grid">
                                            <Button variant="primary" type="submit" className="fw-semibold py-2">
                                                Confirm
                                            </Button>
                                        </div>
                                    </Form>

                                    <p className="mt-4 text-muted text-center mb-4">
                                        Don’t have a code?{' '}
                                        <a href="#" className="text-decoration-underline link-offset-2 fw-semibold">
                                            Resend
                                        </a>{' '}
                                        or{' '}
                                        <a href="#" className="text-decoration-underline link-offset-2 fw-semibold">
                                            Call Us
                                        </a>
                                    </p>
                                    <p className="text-muted text-center mb-0">
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
