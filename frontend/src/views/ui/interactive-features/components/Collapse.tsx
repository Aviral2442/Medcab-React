import ComponentCard from '@/components/ComponentCard'
import useToggle from '@/hooks/useToggle'
import {Button, Card, CardBody, Col, Collapse, Row} from 'react-bootstrap'

const DefaultCollapse = () => {
    const {isTrue, toggle} = useToggle()
    return (
        <>
            <h5 className="mb-2 pb-1">Collapse </h5>
            <p>
                <Button variant="primary" onClick={toggle}>
                    Link with href
                </Button>
            </p>
            <Collapse in={isTrue}>
                <div>
                    <Card className="card-body mb-0">
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
                        Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                    </Card>
                </div>
            </Collapse>
        </>
    )
}

const MultipleTargets = () => {
    const {isTrue: isOpenFirst, toggle: toggleFirst} = useToggle(false)
    const {isTrue: isOpenSecond, toggle: toggleSecond} = useToggle(false)
    const toggleBoth = () => {
        toggleFirst()
        toggleSecond()
    }
    return (
        <>
            <h5 className="mb-2 pb-1">Multiple Targets </h5>
            <div className="d-flex flex-wrap gap-2 mb-3">
                <Button variant="primary" onClick={toggleFirst}>
                    Toggle first element
                </Button>
                <Button variant="primary" onClick={toggleSecond}>
                    Toggle second element
                </Button>
                <Button variant="primary" onClick={toggleBoth}>
                    Toggle both elements
                </Button>
            </div>
            <Row>
                <Col>
                    <Collapse className="multi-collapse" in={isOpenFirst}>
                        <div>
                            <Card className="mb-0">
                                <CardBody>
                                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                                    richardson ad squid. Nihil anim keffiyeh helvetica, craft
                                    beer labore wes anderson cred nesciunt sapiente ea proident.
                                </CardBody>
                            </Card>
                        </div>
                    </Collapse>
                </Col>
                <Col>
                    <Collapse className="multi-collapse" in={isOpenSecond}>
                        <div>
                            <Card className="mb-0">
                                <CardBody>
                                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                                    richardson ad squid. Nihil anim keffiyeh helvetica, craft
                                    beer labore wes anderson cred nesciunt sapiente ea proident.
                                </CardBody>
                            </Card>
                        </div>
                    </Collapse>
                </Col>
            </Row>
        </>
    )
}

const CollapseHorizontal = () => {
    const {isTrue, toggle} = useToggle()
    return (
        <>
            <h5 className="mb-2 pb-1">Collapse Horizontal </h5>
            <p>
                <Button variant="primary" className="" onClick={toggle}>
                    Toggle width collapse
                </Button>
            </p>
            <div style={{height: 100}}>
                <Collapse dimension="width" in={isTrue}>
                    <div>
                        <Card className="card-body mb-0" style={{width: 300}}>
                            This is some placeholder content for a horizontal collapse. It's hidden by default and shown
                            when triggered.
                        </Card>
                    </div>
                </Collapse>
            </div>
        </>
    )
}

const Collapses = () => {
    return (
        <>
            <ComponentCard title="Collapse Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <DefaultCollapse/>
                    </Col>
                    <Col xl={6}>
                        <CollapseHorizontal/>
                    </Col>
                    <Col xl={6}>
                        <MultipleTargets/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Collapses
