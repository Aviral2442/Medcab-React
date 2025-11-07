import ComponentCard from '@/components/ComponentCard'
import {Alert, Col, Row} from 'react-bootstrap'
import {TbAlarmAverage} from 'react-icons/tb'

const DefaultAlert = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Default Alert</h5>
            <Alert variant="primary">This is a primary alert—something important you should know!</Alert>
            <Alert variant="secondary">This is a secondary alert—some additional context.</Alert>
            <Alert variant="success">Success! Your operation was completed successfully.</Alert>
            <Alert variant="danger">Error! Something went wrong—please try again.</Alert>
            <Alert variant="warning">Warning! Please double-check your inputs.</Alert>
            <Alert variant="info">Info: Here's something you might find useful.</Alert>
            <Alert variant="light">Light alert—just a subtle notification.</Alert>
            <Alert variant="dark" className="mb-0">
                Dark alert—use for general-purpose messages.
            </Alert>
        </>
    )
}

const DismissingAlert = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Dismissing Alert with Solid Colors</h5>
            <Alert variant="primary" dismissible className="text-bg-primary">
                <div>Heads up! This is a primary alert with important information.</div>
            </Alert>
            <Alert variant="secondary" dismissible className="text-bg-secondary">
                <div>Notice: This is a secondary alert with supporting details.</div>
            </Alert>
            <h5 className="mb-2 pb-1">Link Color</h5>
            <div className="alert alert-primary">
                Need more info? Check out
                <a href="#" className="alert-link">
                    this primary link
                </a>
                for important details.
            </div>
            <div className="alert alert-secondary">
                Here's a secondary message with
                <a href="#" className="alert-link">
                    a helpful link
                </a>
                for additional context.
            </div>
            <h5 className="mb-2 pb-1">Additional Content </h5>
            <div className="alert alert-secondary p-3 d-flex mb-0">
                <TbAlarmAverage className="fs-1 me-2"/>
                <div>
                    <h4 className="alert-heading">Heads up!</h4>
                    <p>This alert message gives additional information with a longer message to show content spacing
                        within an alert.</p>
                    <hr className="border-secondary border-opacity-25"/>
                    <p className="mb-0">Apply spacing classes wisely to maintain structure and clarity.</p>
                </div>
            </div>
        </>
    )
}

const Alerts = () => {
    return (
        <>
            <ComponentCard title="Alerts Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <DefaultAlert/>
                    </Col>
                    <Col xl={6}>
                        <DismissingAlert/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Alerts
