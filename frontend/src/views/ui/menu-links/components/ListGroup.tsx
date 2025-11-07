import ComponentCard from '@/components/ComponentCard'
import {Col, ListGroup, ListGroupItem, Row} from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel'
import {
    TbBrandFigma,
    TbBrandGithub,
    TbBrandNotion,
    TbBrandSlack,
    TbBrandStripe,
    TbBrandTrello,
    TbBrandWindows,
    TbCloud,
    TbDeviceDesktopAnalytics,
} from 'react-icons/tb'

const BasicExample = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Basic Example </h5>
            <ListGroup as={'ul'}>
                <ListGroupItem>
                    <TbCloud className="me-1 align-middle fs-xl"/>
                    Dropbox Cloud Storage
                </ListGroupItem>
                <ListGroupItem>
                    <TbBrandSlack className="me-1 align-middle fs-xl"/> Slack Team Collaboration
                </ListGroupItem>
                <ListGroupItem>
                    <TbBrandWindows className="me-1 align-middle fs-xl"/> Microsoft Windows OS
                </ListGroupItem>
                <ListGroupItem>
                    <TbDeviceDesktopAnalytics className="me-1 align-middle fs-xl"/> Zendesk Customer Support
                </ListGroupItem>
                <ListGroupItem>
                    <TbBrandStripe className="me-1 align-middle fs-xl"/> Stripe Payment Integration
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

const ActiveItems = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Active Items </h5>
            <ListGroup as={'ul'}>
                <ListGroupItem active>
                    <TbBrandGithub className="me-1 align-middle fs-xl"/> GitHub Repository
                </ListGroupItem>
                <ListGroupItem>
                    <TbBrandFigma className="me-1 align-middle fs-xl"/> Figma Design Tool
                </ListGroupItem>
                <ListGroupItem>
                    <TbBrandNotion className="me-1 align-middle fs-xl"/> Notion Workspace
                </ListGroupItem>
                <ListGroupItem>
                    <TbBrandTrello className="me-1 align-middle fs-xl"/> Trello Task Manager
                </ListGroupItem>
                <ListGroupItem>
                    <TbCloud className="me-1 align-middle fs-xl"/>
                    DigitalOcean Cloud
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

const DisabledItems = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Disabled Items</h5>
            <ListGroup as={'ul'}>
                <ListGroupItem disabled>
                    <TbCloud className="me-1 align-middle fs-xl"/>
                    Dropbox Cloud Storage
                </ListGroupItem>
                <ListGroupItem>
                    <TbBrandSlack className="me-1 align-middle fs-xl"/> Slack Team Collaboration
                </ListGroupItem>
                <ListGroupItem>
                    <TbBrandWindows className="me-1 align-middle fs-xl"/> Microsoft Windows OS
                </ListGroupItem>
                <ListGroupItem>
                    <TbDeviceDesktopAnalytics className="me-1 align-middle fs-xl"/> Zendesk Customer Support
                </ListGroupItem>
                <ListGroupItem>
                    <TbBrandStripe className="me-1 align-middle fs-xl"/> Stripe Payment Integration
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

const LinksAndButtons = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Links and Buttons</h5>
            <ListGroup>
                <ListGroupItem active action>
                    Stripe Payment Integration
                </ListGroupItem>
                <ListGroupItem action>Dropbox Cloud Service</ListGroupItem>
                <button type="button" className="list-group-item list-group-item-action">
                    Slack Communication
                </button>
                <button type="button" className="list-group-item list-group-item-action">
                    Notion Productivity App
                </button>
                <ListGroupItem action disabled>
                    Zendesk Support Tool
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

const Flush = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Flush</h5>
            <ListGroup variant="flush">
                <ListGroupItem>Slack Collaboration Tool</ListGroupItem>
                <ListGroupItem>Dropbox Cloud Storage</ListGroupItem>
                <ListGroupItem>Notion Workspace Organizer</ListGroupItem>
                <ListGroupItem>Zendesk Customer Support</ListGroupItem>
                <ListGroupItem>Stripe Payment Processor</ListGroupItem>
            </ListGroup>
        </>
    )
}

const Horizontal = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Horizontal</h5>
            <ListGroup horizontal className="mb-3">
                <ListGroupItem>Slack</ListGroupItem>
                <ListGroupItem>Notion</ListGroupItem>
                <ListGroupItem>Dropbox</ListGroupItem>
            </ListGroup>
            <ListGroup horizontal="sm" className="mb-3">
                <ListGroupItem>Figma</ListGroupItem>
                <ListGroupItem>Stripe</ListGroupItem>
                <ListGroupItem>Zendesk</ListGroupItem>
            </ListGroup>
            <ListGroup horizontal="md">
                <ListGroupItem>Trello</ListGroupItem>
                <ListGroupItem>Asana</ListGroupItem>
                <ListGroupItem>ClickUp</ListGroupItem>
            </ListGroup>
        </>
    )
}

const ContextualClasses = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Contextual Classes</h5>
            <ListGroup>
                <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                <ListGroupItem variant="primary">A simple primary list group item</ListGroupItem>
                <ListGroupItem variant="secondary">A simple secondary list group item</ListGroupItem>
                <ListGroupItem variant="success">A simple success list group item</ListGroupItem>
                <ListGroupItem variant="danger">A simple danger list group item</ListGroupItem>
                <ListGroupItem variant="warning">A simple warning list group item</ListGroupItem>
                <ListGroupItem variant="info">A simple info list group item</ListGroupItem>
                <ListGroupItem variant="light">A simple light list group item</ListGroupItem>
                <ListGroupItem variant="dark">A simple dark list group item</ListGroupItem>
            </ListGroup>
        </>
    )
}

const ContextualClassesWithLink = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Contextual Classes with Link </h5>
            <ListGroup>
                <ListGroupItem action>Darius ac facilities in</ListGroupItem>
                <ListGroupItem action variant="primary">
                    A simple primary list group item
                </ListGroupItem>
                <ListGroupItem action variant="secondary">
                    A simple secondary list group item
                </ListGroupItem>
                <ListGroupItem action variant="success">
                    A simple success list group item
                </ListGroupItem>
                <ListGroupItem action variant="danger">
                    A simple danger list group item
                </ListGroupItem>
                <ListGroupItem action variant="warning">
                    A simple warning list group item
                </ListGroupItem>
                <ListGroupItem action variant="info">
                    A simple info list group item
                </ListGroupItem>
                <ListGroupItem action variant="light">
                    A simple light list group item
                </ListGroupItem>
                <ListGroupItem action variant="dark">
                    A simple dark list group item
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

const CustomContent = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Custom Content</h5>
            <ListGroup>
                <ListGroupItem action active>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">List group item heading</h5>
                        <small>3 days ago</small>
                    </div>
                    <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                        varius blandit.</p>
                    <small>Donec id elit non mi porta.</small>
                </ListGroupItem>
                <ListGroupItem action>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">List group item heading</h5>
                        <small className="text-muted">3 days ago</small>
                    </div>
                    <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                        varius blandit.</p>
                    <small className="text-muted">Donec id elit non mi porta.</small>
                </ListGroupItem>
                <ListGroupItem action>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">List group item heading</h5>
                        <small className="text-muted">3 days ago</small>
                    </div>
                    <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                        varius blandit.</p>
                    <small className="text-muted">Donec id elit non mi porta.</small>
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

const WithBadges = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">With Badges </h5>
            <ListGroup>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Gmail Notifications
                    <span className="badge bg-primary rounded-pill">14</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Unprocessed Orders
                    <span className="badge bg-success rounded-pill">2</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Urgent Tickets
                    <span className="badge bg-danger rounded-pill">99+</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Completed Transactions
                    <span className="badge bg-success rounded-pill">20+</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Invoices Awaiting Approval
                    <span className="badge bg-warning rounded-pill">12</span>
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

const CheckboxesAndRadios = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Checkboxes and Radios</h5>
            <ListGroup>
                <ListGroupItem>
                    <FormCheckInput className="me-1" type="checkbox" id="firstCheckbox"/>
                    &nbsp;
                    <FormCheckLabel htmlFor="firstCheckbox">Subscribe to newsletter</FormCheckLabel>
                </ListGroupItem>
                <ListGroupItem>
                    <FormCheckInput className="me-1" type="checkbox" id="secondCheckbox"/>
                    &nbsp;
                    <FormCheckLabel htmlFor="secondCheckbox">Accept terms and conditions</FormCheckLabel>
                </ListGroupItem>
            </ListGroup>
            <ul className="list-group mt-2">
                <ListGroupItem>
                    <FormCheckInput className="me-1" type="radio" name="listGroupRadio" id="firstRadio" defaultChecked/>
                    &nbsp;
                    <FormCheckLabel htmlFor="firstRadio">Notify by Email</FormCheckLabel>
                </ListGroupItem>
                <ListGroupItem>
                    <FormCheckInput className="me-1" type="radio" name="listGroupRadio" id="secondRadio"/>
                    &nbsp;
                    <FormCheckLabel htmlFor="secondRadio">Notify by SMS</FormCheckLabel>
                </ListGroupItem>
            </ul>
        </>
    )
}

const Numbered = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Numbered </h5>
            <ListGroup numbered as={'ol'}>
                <ListGroupItem className="d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Admin Admin</div>
                        Admin Admin
                    </div>
                    <span className="badge bg-primary rounded-pill">865</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Admin React Admin</div>
                        Admin React Admin
                    </div>
                    <span className="badge bg-primary rounded-pill">140</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Angular Version</div>
                        Angular Version
                    </div>
                    <span className="badge bg-primary rounded-pill">85</span>
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

const ListGroupPage = () => {
    return (
        <>
            <ComponentCard title="List Group Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <BasicExample/>
                    </Col>
                    <Col xl={6}>
                        <ActiveItems/>
                    </Col>
                    <Col xl={6}>
                        <DisabledItems/>
                    </Col>
                    <Col xl={6}>
                        <LinksAndButtons/>
                    </Col>
                    <Col xl={6}>
                        <Flush/>
                    </Col>
                    <Col xl={6}>
                        <Horizontal/>
                    </Col>
                    <Col xl={6}>
                        <ContextualClasses/>
                    </Col>
                    <Col xl={6}>
                        <ContextualClassesWithLink/>
                    </Col>
                    <Col xl={6}>
                        <CustomContent/>
                    </Col>
                    <Col xl={6}>
                        <WithBadges/>
                    </Col>
                    <Col xl={6}>
                        <CheckboxesAndRadios/>
                    </Col>
                    <Col xl={6}>
                        <Numbered/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default ListGroupPage
