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
import {useState} from 'react'
import OTPInput from '@/components/OTPInput'
import PasswordInputWithStrength from '@/components/PasswordInputWithStrength'
import PageMeta from "@/components/PageMeta.tsx";

const Page = () => {
    const [code, setCode] = useState<string[]>(Array(6).fill(''))
    const [password, setPassword] = useState('')

    return (
        <>
            <PageMeta title="New Password"/>

            <div className="auth-box overflow-hidden align-items-center d-flex">
                <Container>
                    <Row className="justify-content-center">
                        <Col xxl={4} md={6} sm={8}>
                            <Card>
                                <CardBody>
                                    <div className="auth-brand mb-4">
                                        <AppLogo/>
                                        <p className="text-muted mt-3">
                                            We've emailed you a 6-digit verification code. Please enter it below to
                                            confirm
                                            your email address
                                        </p>
                                    </div>

                                    <Form>
                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userEmail">
                                                Email<span className="text-danger">*</span>
                                            </FormLabel>
                                            <FormControl type="email" id="userEmail" placeholder="you@example.com"
                                                         required/>
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <OTPInput code={code} setCode={setCode} label="Enter your 6-digit code"/>
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

                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userNewPassword">
                                                Confirm New Password <span className="text-danger">*</span>
                                            </FormLabel>
                                            <FormControl type="password" id="userNewPassword" placeholder="••••••••"
                                                         required/>
                                        </FormGroup>

                                        <div className="mb-3">
                                            <FormCheck className="fs-14" type="checkbox"
                                                       label="Agree the Terms & Policy"/>
                                        </div>

                                        <div className="d-grid">
                                            <Button variant="primary" type="submit" className="fw-semibold py-2">
                                                Update Password
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
