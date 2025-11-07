import ComponentCard from '@/components/ComponentCard'
import {
    Button,
    Col,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormCheck,
    FormControl,
    FormLabel,
    Row,
} from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel'
import {LuSquareChevronDown} from 'react-icons/lu'
import {TbChevronDown} from 'react-icons/tb'

type MenuItemType = {
    name: string
    variant: string
}

const colorVariants: MenuItemType[] = [
    {name: 'Primary', variant: 'btn-primary'},
    {name: 'Soft Btn', variant: 'btn-light'},
]

const SingleButtonDropdowns = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Single Button Dropdowns </h5>
            <Row>
                <Col xs="auto">
                    <Dropdown>
                        <DropdownToggle as={'button'} className="btn btn-light">
                            Choose Option
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem href="#">Profile Settings</DropdownItem>
                            <DropdownItem href="#">Notifications</DropdownItem>
                            <DropdownItem href="#">Logout</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
                <Col xs="auto">
                    <Dropdown>
                        <DropdownToggle as={'button'} className="btn btn-primary">
                            Quick Actions
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem href="#">Create New</DropdownItem>
                            <DropdownItem href="#">Upload File</DropdownItem>
                            <DropdownItem href="#">View Reports</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>
        </>
    )
}

const MenuAlignment = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Menu Alignment </h5>
            <Dropdown>
                <DropdownToggle variant="light">Right-aligned menu</DropdownToggle>
                <DropdownMenu align={'end'}>
                    <DropdownItem href="#">Action</DropdownItem>
                    <DropdownItem href="#">Another action</DropdownItem>
                    <DropdownItem href="#">Something else here</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

const CustomDropdownArrow = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Custom Dropdown Arrow </h5>
            <Row>
                <Col xs="auto">
                    <Dropdown>
                        <DropdownToggle variant="primary" className="drop-arrow-none">
                            Without Arrow
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem href="#">Download Report</DropdownItem>
                            <DropdownItem href="#">View Analytics</DropdownItem>
                            <DropdownItem href="#">Export Data</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
                <Col xs="auto">
                    <Dropdown>
                        <DropdownToggle variant="outline-primary" className="drop-arrow-none">
                            Tabler Icon <TbChevronDown className="align-middle ms-1"/>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem href="#">Edit Profile</DropdownItem>
                            <DropdownItem href="#">Account Settings</DropdownItem>
                            <DropdownItem href="#">Sign Out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
                <Col xs="auto">
                    <Dropdown>
                        <DropdownToggle variant="primary" className="drop-arrow-none">
                            Lucide Icon <LuSquareChevronDown className="avatar-xxs ms-2"/>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem href="#">New Project</DropdownItem>
                            <DropdownItem href="#">Manage Team</DropdownItem>
                            <DropdownItem href="#">Billing Info</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>
        </>
    )
}

const SplitButtonDropdowns = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Split Button Dropdowns </h5>
            <div className="d-flex flex-wrap gap-2">
                {colorVariants.map((item, idx) => {
                    return (
                        <Dropdown className="btn-group" key={idx}>
                            <Button className={`btn ${item.variant}`}>{item.name}</Button>
                            <DropdownToggle split className={`btn ${item.variant} drop-arrow-none`}>
                                <TbChevronDown className="align-middle"/>
                            </DropdownToggle>
                            &nbsp;
                            <DropdownMenu>
                                <DropdownItem>Action</DropdownItem>
                                <DropdownItem>Another action</DropdownItem>
                                <DropdownItem>Something else here</DropdownItem>
                                <DropdownDivider/>
                                <DropdownItem>Separated link</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )
                })}
            </div>
        </>
    )
}

const DropupVariation = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Dropup Variation </h5>
            <div className="d-flex flex-wrap gap-2">
                <Dropdown drop="up" className="btn-group dropup">
                    <DropdownToggle variant="light">Dropup</DropdownToggle>
                    &nbsp;
                    <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                        <DropdownDivider/>
                        <DropdownItem>Separated link</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown drop="up" className="btn-group dropup">
                    <Button variant="light">Split dropup</Button>
                    <DropdownToggle variant="light" split>
                        <span className="visually-hidden">Toggle Dropdown</span>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                        <DropdownDivider/>
                        <DropdownItem>Separated link</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}

const DropstartVariation = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Dropstart Variation</h5>
            <div className="d-flex flex-wrap gap-2">
                <Dropdown drop="start">
                    <DropdownToggle className="btn-secondary">Dropstart</DropdownToggle>
                    &nbsp;
                    <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                        <DropdownDivider/>
                        <DropdownItem>Separated link</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown drop="start" className="btn-group">
                    <DropdownToggle className="btn btn-secondary" split variant="secondary">
                        <span className="visually-hidden">Toggle Dropdown</span>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                        <DropdownDivider/>
                        <DropdownItem>Separated link</DropdownItem>
                    </DropdownMenu>
                    <Button variant="secondary">Split Dropstart</Button>
                </Dropdown>
            </div>
        </>
    )
}

const DropendVariation = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Dropend Variation </h5>
            <div className="d-flex flex-wrap gap-2">
                <Dropdown drop="end">
                    <DropdownToggle variant="primary">Dropend</DropdownToggle>
                    &nbsp;
                    <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                        <DropdownDivider/>
                        <DropdownItem>Separated link</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown drop="end" className="btn-group">
                    <Button variant="primary">Split Dropend</Button>
                    <DropdownToggle variant="primary" split>
                        <span className="visually-hidden">Toggle Dropright</span>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                        <DropdownDivider/>
                        <DropdownItem>Separated link</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}

const ActiveItem = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Active Item </h5>
            <Dropdown className="btn-group">
                <DropdownToggle variant="secondary">Active Item</DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>Regular link</DropdownItem>
                    <DropdownItem active>Active link</DropdownItem>
                    <DropdownItem>Another link</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

const DisabledItem = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Disabled Item </h5>
            <Dropdown className="btn-group">
                <DropdownToggle variant="primary">Disabled</DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>Regular link</DropdownItem>
                    <DropdownItem disabled>Disabled link</DropdownItem>
                    <DropdownItem>Another link</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

const Headers = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Headers </h5>
            <Dropdown className="btn-group">
                <DropdownToggle variant="secondary">Header</DropdownToggle>
                <DropdownMenu>
                    <DropdownHeader as={'h6'}>Dropdown header</DropdownHeader>
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another action</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

const DarkDropdowns = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Dark Dropdowns </h5>
            <Dropdown>
                <DropdownToggle variant="dark">Dark Dropdown</DropdownToggle>
                <DropdownMenu data-bs-theme="dark">
                    <DropdownItem active>Action</DropdownItem>
                    <DropdownItem href="">Another action</DropdownItem>
                    <DropdownItem href="">Something else here</DropdownItem>
                    <DropdownDivider/>
                    <DropdownItem href="">Separated link</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

const CenteredDropdowns = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Centered Dropdowns </h5>
            <div className="hstack gap-2">
                <Dropdown drop="down-centered">
                    <DropdownToggle variant="secondary">Centered dropdown</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Action two</DropdownItem>
                        <DropdownItem>Action three</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown drop="up-centered">
                    <DropdownToggle variant="secondary">Centered dropup</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Action two</DropdownItem>
                        <DropdownItem>Action three</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}

const DropdownOptions = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Dropdown Options</h5>
            <div className="d-flex flex-wrap gap-2">
                <Dropdown drop="end" className="btn-group">
                    <DropdownToggle variant="secondary">Offset</DropdownToggle>
                    &nbsp;
                    <DropdownMenu>
                        <DropdownItem>Profile Settings</DropdownItem>
                        <DropdownItem>Privacy Settings</DropdownItem>
                        <DropdownItem>Notification Preferences</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown drop="end" className="btn-group">
                    <Button variant="secondary">Reference</Button>
                    <DropdownToggle split variant="secondary">
                        <span className="visually-hidden">Toggle Dropdown</span>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Manage Subscription</DropdownItem>
                        <DropdownItem>Account Preferences</DropdownItem>
                        <DropdownItem>Help & Support</DropdownItem>
                        <DropdownDivider/>
                        <DropdownItem>Log Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}

const AutoCloseBehavior = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Auto Close Behavior</h5>
            <div className="hstack gap-2">
                <Dropdown autoClose className="btn-group">
                    <DropdownToggle variant="secondary">Default dropdown</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Menu item</DropdownItem>
                        <DropdownItem>Menu item</DropdownItem>
                        <DropdownItem>Menu item</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown autoClose="outside" className="btn-group">
                    <DropdownToggle variant="secondary">Clickable inside</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Menu item</DropdownItem>
                        <DropdownItem>Menu item</DropdownItem>
                        <DropdownItem>Menu item</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown autoClose="inside" className="btn-group">
                    <DropdownToggle variant="secondary">Clickable outside</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Menu item</DropdownItem>
                        <DropdownItem>Menu item</DropdownItem>
                        <DropdownItem>Menu item</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown autoClose="inside" className="btn-group">
                    <DropdownToggle variant="secondary">Manual close</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Menu item</DropdownItem>
                        <DropdownItem>Menu item</DropdownItem>
                        <DropdownItem>Menu item</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}

const Text = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Text</h5>
            <Dropdown className="btn-group">
                <DropdownToggle variant="primary">Text Dropdown</DropdownToggle>
                <DropdownMenu className="p-3 text-muted" style={{maxWidth: 200}}>
                    <p>Some example text that's free-flowing within the dropdown menu.</p>
                    <p className="mb-0">And this is more example text.</p>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

const FormsDropdown = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Forms </h5>
            <Dropdown>
                <DropdownToggle variant="secondary">Form</DropdownToggle>
                <DropdownMenu>
                    <Form className="px-4 py-3">
                        <div className="mb-3">
                            <FormLabel htmlFor="exampleDropdownFormEmail1">Email address</FormLabel>
                            <FormControl type="email" id="exampleDropdownFormEmail1" placeholder="email@example.com"/>
                        </div>
                        <div className="mb-3">
                            <FormLabel htmlFor="exampleDropdownFormPassword1">Password</FormLabel>
                            <FormControl type="password" id="exampleDropdownFormPassword1" placeholder="Password"/>
                        </div>
                        <div className="mb-2">
                            <FormCheck>
                                <FormCheckInput type="checkbox" id="dropdownCheck"/>
                                <FormCheckLabel htmlFor="dropdownCheck">Remember me</FormCheckLabel>
                            </FormCheck>
                        </div>
                        <Button variant="primary" type="submit">
                            Sign in
                        </Button>
                    </Form>
                    <DropdownDivider/>
                    <DropdownItem>New around here? Sign up</DropdownItem>
                    <DropdownItem>Forgot password?</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

const Dropdowns = () => {
    return (
        <>
            <ComponentCard title="Dropdowns Variations" isCollapsible>
                <Row>
                    <Col xl={6}>
                        <SingleButtonDropdowns/>
                    </Col>
                    <Col xl={6}>
                        <MenuAlignment/>
                    </Col>
                    <Row className="mt-4">
                        <Col xl={6}>
                            <CustomDropdownArrow/>
                        </Col>
                        <Col xl={6}>
                            <SplitButtonDropdowns/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col xl={6}>
                            <DropupVariation/>
                        </Col>
                        <Col xl={6}>
                            <DropstartVariation/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col xl={6}>
                            <DropendVariation/>
                        </Col>
                        <Col xl={6}>
                            <ActiveItem/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col xl={6}>
                            <DisabledItem/>
                        </Col>
                        <Col xl={6}>
                            <Headers/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col xl={6}>
                            <DarkDropdowns/>
                        </Col>
                        <Col xl={6}>
                            <CenteredDropdowns/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col xl={6}>
                            <DropdownOptions/>
                        </Col>
                        <Col xl={6}>
                            <AutoCloseBehavior/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col xl={6}>
                            <Text/>
                        </Col>
                        <Col xl={6}>
                            <FormsDropdown/>
                        </Col>
                    </Row>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Dropdowns
