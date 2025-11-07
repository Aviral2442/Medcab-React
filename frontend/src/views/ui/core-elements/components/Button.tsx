import ComponentCard from '@/components/ComponentCard'
import {Button, Col, Row} from 'react-bootstrap'
import {TbCreditCard, TbStar} from 'react-icons/tb'

const DefaultButtons = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Default Buttons</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button variant="default">Default</Button>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="info">Info</Button>
                    <Button variant="light">Light</Button>
                    <Button variant="dark">Dark</Button>
                </div>
            </Col>
        </>
    )
}

const RoundedButtons = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Rounded Buttons</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button variant="primary" className="rounded-pill">
                        Primary
                    </Button>
                    <Button variant="secondary" className="rounded-pill">
                        Secondary
                    </Button>
                    <Button variant="success" className="rounded-pill">
                        Success
                    </Button>
                </div>
            </Col>
        </>
    )
}

const OutlineButtons = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Outline Buttons</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button variant="outline-primary">Primary</Button>
                    <Button variant="outline-success">Success</Button>
                </div>
            </Col>
        </>
    )
}

const SoftButtons = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Soft Buttons</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button className="btn-soft-primary">Primary</Button>
                    <Button className="btn-soft-warning">Warning</Button>
                </div>
            </Col>
        </>
    )
}

const GhostButtons = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Ghost Buttons</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button className="btn-ghost-danger">Danger</Button>
                    <Button className="btn-ghost-info">Info</Button>
                </div>
            </Col>
        </>
    )
}

const ButtonSizes = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Button Sizes</h5>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <Button variant="primary" size="sm">
                        Small
                    </Button>
                    <Button variant="primary">Default</Button>
                    <Button variant="primary" size="lg">
                        Large
                    </Button>
                </div>
            </Col>
        </>
    )
}

const DisabledButtons = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Disabled Buttons</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button variant="dark" disabled>
                        Disabled
                    </Button>
                </div>
            </Col>
        </>
    )
}

const BlockButtons = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Block Buttons</h5>
                <div className="d-grid gap-2 mb-2">
                    <Button variant="primary" size="lg">
                        Block Button
                    </Button>
                </div>
            </Col>
        </>
    )
}

const ToggleButton = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Toggle Buttons</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button variant="primary" data-bs-toggle="button">
                        Toggle
                    </Button>
                    <Button variant="primary" active data-bs-toggle="button" aria-pressed="true">
                        Active
                    </Button>
                </div>
            </Col>
        </>
    )
}

const ButtonTags = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Button Tags</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                    <a className="btn btn-primary" href="#">
                        Link
                    </a>
                    <Button variant="primary">Button</Button>
                    <input className="btn btn-primary" type="submit" defaultValue="Submit"/>
                </div>
            </Col>
        </>
    )
}

const IconButtons = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Icon Buttons</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button variant="primary" className="btn-icon">
                        <TbStar/>
                    </Button>
                    <Button variant="outline-info" className="btn-icon">
                        <TbCreditCard/>
                    </Button>
                </div>
            </Col>
        </>
    )
}

const ButtonGroups = () => {
    return (
        <>
            <Col xl={6}>
                <h5 className="mb-2 pb-1">Button Groups</h5>
                <div className="btn-group">
                    <Button variant="light">Left</Button>
                    <Button variant="light">Middle</Button>
                    <Button variant="light">Right</Button>
                </div>
            </Col>
        </>
    )
}

const ButtonPage = () => {
    return (
        <>
            <ComponentCard title="Buttons" isCollapsible>
                <Row className="g-4">
                    <DefaultButtons/>
                    <RoundedButtons/>
                    <OutlineButtons/>
                    <SoftButtons/>
                    <GhostButtons/>
                    <ButtonSizes/>
                    <DisabledButtons/>
                    <BlockButtons/>
                    <ToggleButton/>
                    <ButtonTags/>
                    <IconButtons/>
                    <ButtonGroups/>
                </Row>
            </ComponentCard>
        </>
    )
}

export default ButtonPage
