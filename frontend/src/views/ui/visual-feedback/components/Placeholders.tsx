import ComponentCard from '@/components/ComponentCard'
import {Button, Card, CardBody, CardTitle, Col, Placeholder, Row} from 'react-bootstrap'
import small1 from '@/assets/images/stock/small-1.jpg'

const DefaultPlaceholders = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Examples </h5>
            <Row>
                <Col md={6}>
                    <Card className="border shadow-none mb-md-0">
                        <img src={small1} className="card-img-top img-fluid" alt="..." width={348} height={217}/>
                        <CardBody>
                            <CardTitle as={'h5'} className="mb-2">
                                Card title
                            </CardTitle>
                            <p className="card-text">Some quick example text to build on the card title and make up the
                                bulk of the card&apos;s content.</p>
                            <Button variant="primary">Go somewhere</Button>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="border shadow-none mb-0" aria-hidden="true">
                        <svg
                            className="card-img-top"
                            width="100%"
                            style={{aspectRatio: '16 / 10'}}
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            aria-label="Placeholder"
                            preserveAspectRatio="xMidYMid slice"
                            viewBox="0 0 16 10">
                            <title>Placeholder</title>
                            <rect width={16} height={10} fill="#b1b2f8"/>
                        </svg>
                        <CardBody>
                            <CardTitle as={'h5'} className="mb-2 placeholder-glow">
                                <Placeholder className="placeholder col-6">&nbsp;</Placeholder>
                            </CardTitle>
                            <p className="card-text placeholder-glow">
                                <Placeholder className="col-7"/>
                                &nbsp;
                                <Placeholder className="col-4"/>
                                <Placeholder className="col-4"/>
                                &nbsp;
                                <Placeholder className="col-6"/>
                                <Placeholder className="col-3"/>
                            </p>
                            <Button variant="primary" className="disabled placeholder col-6" aria-disabled="true">
                                <span className="invisible">Read Only</span>
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

const ColorPlaceholders = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Color </h5>
            <Placeholder className="col-12"/>
            <Placeholder className="col-12 bg-primary"/>
            <Placeholder className="col-12 bg-secondary"/>
            <Placeholder className="col-12 bg-success"/>
            <Placeholder className="col-12 bg-danger"/>
            <Placeholder className="col-12 bg-warning"/>
            <Placeholder className="col-12 bg-info"/>
            <Placeholder className="col-12 bg-light"/>
            <Placeholder className="col-12 bg-dark"/>
        </>
    )
}

const WidthPlaceholders = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Width </h5>
            <Placeholder className="col-6"/>
            <Placeholder className="w-75"/>
            <br/>
            <Placeholder style={{width: '25%'}}/>
            &nbsp;
            <Placeholder style={{width: '10%'}}/>
        </>
    )
}

const SizingPlaceholders = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Sizing</h5>
            <Placeholder size="lg" className="col-12"/>
            <Placeholder className="col-12"/>
            <Placeholder size="sm" className="col-12"/>
            <Placeholder size="xs" className="col-12"/>
        </>
    )
}

const WorksPlaceholder = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">How it works</h5>
            <p aria-hidden="true">
                <Placeholder className="col-6"/>
            </p>
            <Button variant="primary" disabled className="placeholder col-4"/>
        </>
    )
}

const AnimationPlaceholder = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Animation</h5>
            <p className="placeholder-glow">
                <Placeholder className="col-12"/>
            </p>
            <p className="placeholder-wave mb-0">
                <Placeholder className="col-12"/>
            </p>
        </>
    )
}

const Placeholders = () => {
    return (
        <>
            <ComponentCard title="Placeholders" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <DefaultPlaceholders/>
                    </Col>
                    <Col xl={6}>
                        <ColorPlaceholders/>
                    </Col>
                    <Col xl={6}>
                        <WidthPlaceholders/>
                    </Col>
                    <Col xl={6}>
                        <SizingPlaceholders/>
                    </Col>
                    <Col xl={6}>
                        <WorksPlaceholder/>
                    </Col>
                    <Col xl={6}>
                        <AnimationPlaceholder/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Placeholders
