import ComponentCard from '@/components/ComponentCard'
import {Col, Row} from 'react-bootstrap'

const BasicBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Basic Badges</h5>
            <span className="badge me-1 badge-default">Default</span>
            <span className="badge me-1 text-bg-primary">Primary</span>
            <span className="badge me-1 text-bg-secondary">Secondary</span>
            <span className="badge me-1 text-bg-success">Success</span>
            <span className="badge me-1 text-bg-danger">Danger</span>
            <span className="badge me-1 text-bg-warning">Warning</span>
            <span className="badge me-1 text-bg-info">Info</span>
            <span className="badge me-1 text-bg-light">Light</span>
            <span className="badge me-1 text-bg-dark">Dark</span>
        </>
    )
}

const BasicPillBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Basic Pill Badges</h5>
            <span className="badge me-1 rounded-pill badge-default">Default</span>
            <span className="badge me-1 rounded-pill text-bg-primary">Primary</span>
            <span className="badge me-1 rounded-pill text-bg-secondary">Secondary</span>
        </>
    )
}

const OutlineBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Outline Badges</h5>
            <span className="badge me-1 badge-outline-primary">Primary</span>
            <span className="badge me-1 badge-outline-secondary">Secondary</span>
            <span className="badge me-1 badge-outline-success">Success</span>
        </>
    )
}

const OutlinePillBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Outline Pill Badges</h5>
            <span className="badge me-1 badge-outline-primary rounded-pill">Primary</span>
            <span className="badge me-1 badge-outline-secondary rounded-pill">Secondary</span>
            <span className="badge me-1 badge-outline-success rounded-pill">Success</span>
        </>
    )
}

const LightenBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Lighten Badges</h5>
            <span className="badge me-1 badge-soft-primary">Primary</span>
            <span className="badge me-1 badge-soft-secondary">Secondary</span>
            <span className="badge me-1 badge-soft-success">Success</span>
        </>
    )
}

const LightenPillBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Lighten Pill Badges</h5>
            <span className="badge me-1 badge-soft-primary rounded-pill">Primary</span>
            <span className="badge me-1 badge-soft-secondary rounded-pill">Secondary</span>
            <span className="badge me-1 badge-soft-success rounded-pill">Success</span>
        </>
    )
}

const LabelBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Label Badges</h5>
            <span className="badge me-1 badge-label badge-default">Default</span>
            <span className="badge me-1 badge-label text-bg-primary">Primary</span>
            <span className="badge me-1 badge-label text-bg-secondary">Secondary</span>
        </>
    )
}

const SquareBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Square Badges</h5>
            <span className="badge me-1 badge-square badge-default">0</span>
            <span className="badge me-1 badge-square text-bg-primary">1</span>
            <span className="badge me-1 badge-square text-bg-secondary">2</span>
            <span className="badge me-1 badge-square text-bg-success">3</span>
        </>
    )
}

const CircleBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Circle Badges</h5>
            <span className="badge me-1 badge-circle badge-default">0</span>
            <span className="badge me-1 badge-circle text-bg-primary">1</span>
            <span className="badge me-1 badge-circle text-bg-secondary">2</span>
            <span className="badge me-1 badge-circle text-bg-success">3</span>
        </>
    )
}

const Positioned = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Positioned</h5>
            <div className="d-flex flex-wrap gap-3">
                <button type="button" className="btn btn-primary position-relative">
                    Inbox
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            99+
            <span className="visually-hidden">unread messages</span>
          </span>
                </button>
                <button type="button" className="btn btn-primary position-relative">
                    Profile
                    <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
                </button>
                <button type="button" className="btn btn-primary">
                    Notifications <span className="badge text-bg-light ms-1">4</span>
                </button>
            </div>
        </>
    )
}

const HeadingsWithBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Headings with Badges</h5>
            <div>
                <h1>
                    h1.Example heading <span className="badge text-bg-primary">New</span>
                </h1>
                <h2>
                    h2.Example heading <span className="badge text-bg-primary">New</span>
                </h2>
                <h3>
                    h3.Example heading <span className="badge text-bg-primary">New</span>
                </h3>
                <h4>
                    h4.Example heading <span className="badge text-bg-primary">New</span>
                </h4>
                <h5>
                    h5.Example heading <span className="badge text-bg-primary">New</span>
                </h5>
                <h6>
                    h6.Example heading <span className="badge text-bg-primary">New</span>
                </h6>
            </div>
        </>
    )
}

const Badge = () => {
    return (
        <>
            <ComponentCard title="Badge Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <BasicBadges/>
                    </Col>
                    <Col xl={6}>
                        <BasicPillBadges/>
                    </Col>
                    <Col xl={6}>
                        <OutlineBadges/>
                    </Col>
                    <Col xl={6}>
                        <OutlinePillBadges/>
                    </Col>
                    <Col xl={6}>
                        <LightenBadges/>
                    </Col>
                    <Col xl={6}>
                        <LightenPillBadges/>
                    </Col>
                    <Col xl={6}>
                        <LabelBadges/>
                    </Col>
                    <Col xl={6}>
                        <SquareBadges/>
                    </Col>
                    <Col xl={6}>
                        <CircleBadges/>
                    </Col>
                    <Col xl={6}>
                        <Positioned/>
                    </Col>
                    <Col xl={6}>
                        <HeadingsWithBadges/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Badge
