import {Button, Card, CardBody, Col, Container, Row, Table} from 'react-bootstrap'
import {LuReceiptText} from 'react-icons/lu'
import PageTitle from '@/components/PageTitle'
import AppLogo from '@/components/AppLogo'
import {appName, currency} from '@/helpers'

import qrCode from '@/assets/images/qr.png'
import sign from '@/assets/images/sign.png'
import {TbDownload, TbPrinter, TbSend} from 'react-icons/tb'

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Invoice Details"
                subtitle="View and manage billing information, transaction summaries, and downloadable invoice records."
                badge={{
                    title: 'Billing & Payments',
                    icon: LuReceiptText,
                }}
            />

            <Row>
                <Col xl={9}>
                    <Card>
                        <CardBody className="px-4">
                            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                                <div className="auth-brand mb-0">
                                    <AppLogo/>
                                </div>
                                <div className="text-end">
                                    <span
                                        className="badge bg-success-subtle text-success mb-2 fs-xs px-2 py-1">Paid</span>
                                    <h4 className="fw-bold text-dark m-0">Invoice #TNL-0125789</h4>
                                </div>
                            </div>

                            <Row>
                                <Col cols={4}>
                                    <h6 className="text-uppercase text-muted mb-2">From</h6>
                                    <p className="mb-1 fw-semibold">Eleanor Hayes</p>
                                    <p className="text-muted mb-1">
                                        512 Willow St,
                                        <br/>
                                        Denver, CO - 80203
                                    </p>
                                    <p className="text-muted mb-0">Phone: 303-892-3344</p>
                                    <div className="mt-4">
                                        <h6 className="text-uppercase text-muted">Invoice Date</h6>
                                        <p className="mb-0 fw-medium">01 Jun 2025</p>
                                    </div>
                                </Col>

                                <Col cols={4}>
                                    <h6 className="text-uppercase text-muted mb-2">To</h6>
                                    <p className="mb-1 fw-semibold">Benjamin Hart</p>
                                    <p className="text-muted mb-1">
                                        99 Hillside Blvd,
                                        <br/>
                                        San Mateo, CA - 94401
                                    </p>
                                    <p className="text-muted mb-0">Phone: 650-328-9002</p>
                                    <div className="mt-4">
                                        <h6 className="text-uppercase text-muted">Due Date</h6>
                                        <p className="mb-0 fw-medium">10 Jun 2025</p>
                                    </div>
                                </Col>

                                <Col cols={4} className="text-end">
                                    <img src={qrCode} alt="Barcode" className="img-fluid" height={80} width={80}
                                         style={{maxHeight: '80px'}}/>
                                </Col>
                            </Row>

                            <Table responsive bordered className="table-nowrap text-center align-middle mt-4">
                                <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                                <tr className="text-uppercase fs-xxs">
                                    <th style={{width: '50px'}}>#</th>
                                    <th className="text-start">Service</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th className="text-end">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>01</td>
                                    <td className="text-start">
                                        <strong>Website Redesign</strong>
                                        <div className="text-muted">(Landing page + blog + pricing)</div>
                                    </td>
                                    <td>1</td>
                                    <td>{currency}1,000.00</td>
                                    <td className="text-end">{currency}1,000.00</td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td className="text-start">
                                        <strong>Content Creation</strong>
                                        <div className="text-muted">(5 blog posts)</div>
                                    </td>
                                    <td>5</td>
                                    <td>{currency}60.00</td>
                                    <td className="text-end">{currency}300.00</td>
                                </tr>
                                <tr>
                                    <td>03</td>
                                    <td className="text-start">
                                        <strong>Maintenance Plan</strong>
                                        <div className="text-muted">(Monthly hosting & support)</div>
                                    </td>
                                    <td>1</td>
                                    <td>{currency}150.00</td>
                                    <td className="text-end">{currency}150.00</td>
                                </tr>
                                </tbody>
                            </Table>

                            <div className="d-flex justify-content-end">
                                <table className="table w-auto table-borderless text-end">
                                    <tbody>
                                    <tr>
                                        <td className="fw-medium">Subtotal</td>
                                        <td>{currency}1,450.00</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Shipping</td>
                                        <td>{currency}20.00</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Discount (10%)</td>
                                        <td className="text-danger">- {currency}145.00</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Tax (8%)</td>
                                        <td>{currency}104.00</td>
                                    </tr>
                                    <tr className="border-top pt-2 fs-5 fw-bold">
                                        <td>Total</td>
                                        <td>{currency}1,429.00</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-lg-4 mt-2 bg-light bg-opacity-50 rounded px-3 py-2">
                                <p className="mb-0 text-muted">
                                    <strong>Note:</strong> Payment processed successfully. For future invoices,
                                    contact{' '}
                                    <a href="mailto:billing@simple.io" className="fw-medium">
                                        billing@simple.io
                                    </a>
                                    .
                                </p>
                            </div>

                            <div className="mt-4">
                                <p className="fw-semibold mb-3">Thank you for choosing {appName}!</p>
                                <img src={sign} alt="Signature" height={32} width={152.95}/>
                                <p className="text-muted fs-xxs fst-italic">Authorized Signature</p>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={3} className="d-print-none">
                    <Card className="card-top-sticky">
                        <CardBody>
                            <div className="justify-content-center d-flex flex-column gap-2">
                                <Button variant="primary">
                                    <TbPrinter className="me-1"/> Print
                                </Button>
                                <Button variant="info">
                                    <TbDownload className="me-1"/> Download
                                </Button>
                                <Button variant="danger">
                                    <TbSend className="me-1"/> Send
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Page
