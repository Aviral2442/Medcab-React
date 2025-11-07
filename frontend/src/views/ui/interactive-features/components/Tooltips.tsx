import ComponentCard from '@/components/ComponentCard'
import {Button, Col, OverlayTrigger, Row, Tooltip} from 'react-bootstrap'

const colorVariants = ['primary', 'danger', 'info', 'success', 'secondary', 'warning', 'dark']

const BasicTooltips = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Basic</h5>
            <p className="mb-0">
                Powerful admin features like&nbsp;
                <OverlayTrigger placement="top"
                                overlay={<Tooltip className="danger-tooltip">Manage your dashboard easily</Tooltip>}>
                    <a href="#" className="fw-medium" data-bs-title="Manage your dashboard easily">
                        custom dashboards
                    </a>
                </OverlayTrigger>
                &nbsp; and UI components help you build scalable web applications efficiently. This template includes
                pre-built pages, clean layouts, and
                reusable code blocks to boost your development workflow. From user management to analytics and settings,
                everything is modular and
                developer-friendly. Create modern admin panels with&nbsp;
                <OverlayTrigger placement="top"
                                overlay={<Tooltip className="danger-tooltip">Built with Bootstrap 5</Tooltip>}>
                    <a href="#" className="fw-medium" data-bs-title="Built with Bootstrap 5">
                        responsive design
                    </a>
                </OverlayTrigger>
                &nbsp; and seamless UX. Get started quickly with a professional-grade&nbsp;
                <OverlayTrigger placement="top"
                                overlay={<Tooltip className="danger-tooltip">Tailored for developers</Tooltip>}>
                    <a href="#" className="fw-medium" data-bs-title="Tailored for developers">
                        UI toolkit
                    </a>
                </OverlayTrigger>
                &nbsp; and supercharge your app with&nbsp;
                <OverlayTrigger placement="top"
                                overlay={<Tooltip className="danger-tooltip">Includes charts, tables, forms and
                                    more</Tooltip>}>
                    <a href="#" className="fw-medium" data-bs-title="Includes charts, tables, forms and more">
                        powerful components
                    </a>
                </OverlayTrigger>
                &nbsp; and flexible layouts.
            </p>
        </>
    )
}

const DisabledElements = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Disabled Elements</h5>
            <OverlayTrigger placement="top" overlay={<Tooltip>Disabled tooltip</Tooltip>}>
        <span className="d-inline-block" tabIndex={0} data-bs-title="Disabled tooltip">
          <Button variant="primary" className="pe-none" disabled>
            Disabled button
          </Button>
        </span>
            </OverlayTrigger>
        </>
    )
}

const HoverElements = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Hover Elements </h5>
            <OverlayTrigger placement="top" overlay={<Tooltip>Tooltip appears on hover only</Tooltip>}>
                <Button variant="primary" data-bs-trigger="hover">
                    Hover to See Info
                </Button>
            </OverlayTrigger>
        </>
    )
}

const FourDirections = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Four Directions</h5>
            <div className="d-flex flex-wrap gap-2">
                <OverlayTrigger overlay={<Tooltip className="primary-tooltip">Tooltip on top</Tooltip>}>
                    <Button variant="primary" data-bs-placement="top">
                        Tooltip ontop
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom"
                                overlay={<Tooltip className="danger-tooltip">Tooltip on bottom</Tooltip>}>
                    <Button variant="primary" data-bs-placement="bottom">
                        Tooltip on bottom
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="left"
                                overlay={<Tooltip className="danger-tooltip">Tooltip on left</Tooltip>}>
                    <Button variant="primary" data-bs-placement="left">
                        Tooltip on left
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="right"
                                overlay={<Tooltip className="danger-tooltip">Tooltip on right</Tooltip>}>
                    <Button variant="primary" data-bs-placement="right" data-bs-title="Tooltip on right">
                        Tooltip on right
                    </Button>
                </OverlayTrigger>
            </div>
        </>
    )
}

const HTMLTags = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">HTML Tags</h5>
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip className="danger-tooltip">
                        <em>New</em> <u>Tooltip</u> <b>with</b> <i>HTML</i> <br/>
                        Custom message here!
                    </Tooltip>
                }>
                <Button
                    variant="primary"
                    data-bs-toggle="tooltip"
                    data-bs-html="true"
                    data-bs-title="<em>New</em> <u>Tooltip</u> <b>with</b> <i>HTML</i> <br/>Custom message here!">
                    Tooltip with HTML
                </Button>
            </OverlayTrigger>
        </>
    )
}

const ColorTooltips = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Color Tooltips</h5>
            <div className="d-flex flex-wrap gap-2">
                {colorVariants.map((color, idx) => {
                    return (
                        <OverlayTrigger
                            placement="top"
                            key={idx}
                            overlay={<Tooltip className={`tooltip-${color}`}>This top tooltip {color} is themed via CSS
                                variables.</Tooltip>}>
                            <Button variant={color}>{color} tooltip</Button>
                        </OverlayTrigger>
                    )
                })}
            </div>
        </>
    )
}

const Tooltips = () => {
    return (
        <>
            <ComponentCard title="Tooltips Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <BasicTooltips/>
                    </Col>
                    <Col xl={6}>
                        <DisabledElements/>
                    </Col>
                    <Col xl={6}>
                        <HoverElements/>
                    </Col>
                    <Col xl={6}>
                        <FourDirections/>
                    </Col>
                    <Col xl={6}>
                        <HTMLTags/>
                    </Col>
                    <Col xl={6}>
                        <ColorTooltips/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Tooltips
