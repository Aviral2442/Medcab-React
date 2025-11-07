import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Col,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormControl,
    FormSelect,
    OverlayTrigger,
    Pagination,
    Row,
    Tooltip,
} from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import {LuLayers, LuMapPin, LuNotebookText, LuSearch, LuUserCheck} from 'react-icons/lu'
import {contacts, type ContactType} from '@/views/apps/directory/data'
import {TbArrowNarrowRight, TbBan, TbDotsVertical, TbEdit, TbShare, TbStar, TbTrash} from 'react-icons/tb'
import {Link} from 'react-router'

const ContactCard = ({contact}: { contact: ContactType }) => {
    return (
        <Card className="card-hovered">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="me-3 position-relative">
                        <img src={contact.avatar} alt="avatar" className="rounded-circle" width={72} height={72}/>

                        <span role="button"
                              className="position-absolute bottom-0 end-0 badge bg-primary rounded-circle p-1 shadow-sm">
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>{contact.rating}</Tooltip>}>
                              <TbStar className="text-white"/>
                            </OverlayTrigger>
                        </span>
                    </div>
                    <div>
                        <h5 className="mb-1 d-flex align-items-center">
                            <Link to="" className="link-reset fw-medium fs-md">
                                {contact.name}
                            </Link>
                            <img src={contact.country.flag} alt={contact.country.name} className="ms-2 rounded-circle"
                                 height={16} width={16}/>
                        </h5>
                        <p className="text-muted mb-1">{contact.jobTitle}</p>
                        {contact.verified &&
                            <span className="badge bg-success-subtle text-success fw-medium">VERIFIED</span>}
                    </div>
                    <div className="ms-auto">
                        <Dropdown align="end">
                            <DropdownToggle as="a" className="btn btn-icon btn-ghost-light text-muted drop-arrow-none">
                                <TbDotsVertical className="fs-xl"/>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <TbShare className="me-2 fs-15"/>
                                    Share
                                </DropdownItem>
                                <DropdownItem>
                                    <TbEdit className="me-2 fs-15"/>
                                    Edit
                                </DropdownItem>
                                <DropdownItem>
                                    <TbBan className="me-2 fs-15"/>
                                    Block
                                </DropdownItem>
                                <DropdownItem className="text-danger">
                                    <TbTrash className="me-2 fs-15"/>
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <p className="text-muted mb-2">{contact.about}</p>

                <Link to="" className="icon-link icon-link-hover link-reset fw-medium">
                    View Profile <TbArrowNarrowRight className="fs-16"/>
                </Link>
            </CardBody>
            <CardFooter>
                <Row className="text-center">
                    <Col cols={4}>
                        <div className="text-muted fs-xs mb-1">CAMPAIGNS</div>
                        <div className="fw-bold">{contact.campaigns}</div>
                    </Col>
                    <Col cols={4}>
                        <div className="text-muted fs-xs mb-1">CONTACTS</div>
                        <div className="fw-bold">{contact.contacts}</div>
                    </Col>
                    <Col cols={4}>
                        <div className="text-muted fs-xs mb-1">ENGAGEMENT</div>
                        <div className="fw-bold">{contact.engagement}%</div>
                    </Col>
                </Row>
            </CardFooter>
        </Card>
    )
}

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Contact Directory App"
                subtitle="Effortlessly manage and browse contacts with a clean, searchable interface. Ideal for teams, organizations, and internal directories."
                badge={{
                    title: 'People & Teams',
                    icon: LuNotebookText,
                }}
            />

            <Row className="mb-3">
                <Col lg={12}>
                    <Form className="rounded border p-3">
                        <Row className="gap-3">
                            <Col lg={4}>
                                <div className="app-search">
                                    <FormControl type="text" placeholder="Search contact name..."/>
                                    <LuSearch className="app-search-icon text-muted"/>
                                </div>
                            </Col>
                            <Col>
                                <div className="d-flex justify-content-end flex-wrap align-items-center gap-2">
                                    <div className="app-search">
                                        <FormSelect className="form-control my-1 my-md-0">
                                            <option>Designation</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Developer">Developer</option>
                                            <option value="Designer">Designer</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Support">Support</option>
                                        </FormSelect>
                                        <LuUserCheck className="app-search-icon text-muted"/>
                                    </div>

                                    <div className="app-search">
                                        <FormSelect className="form-control my-1 my-md-0">
                                            <option>Location</option>
                                            <option value="USA">USA</option>
                                            <option value="UK">UK</option>
                                            <option value="Germany">Germany</option>
                                            <option value="India">India</option>
                                            <option value="Canada">Canada</option>
                                        </FormSelect>
                                        <LuMapPin className="app-search-icon text-muted"/>
                                    </div>

                                    <div className="app-search">
                                        <FormSelect className="form-control my-1 my-md-0">
                                            <option>Department</option>
                                            <option value="UI/UX">UI/UX</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="HR">HR</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Finance">Finance</option>
                                        </FormSelect>
                                        <LuLayers className="app-search-icon text-muted"/>
                                    </div>

                                    <Button variant="primary" type="submit">
                                        Apply
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>

            <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1">
                {contacts.map((contact, idx) => (
                    <Col key={idx}>
                        <ContactCard contact={contact}/>
                    </Col>
                ))}
            </Row>

            <Pagination className="pagination-rounded pagination-boxed justify-content-center">
                <Pagination.Prev disabled>
                    <span aria-hidden="true">«</span>
                </Pagination.Prev>
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Item>{4}</Pagination.Item>
                <Pagination.Item>{5}</Pagination.Item>
                <Pagination.Next>
                    <span aria-hidden="true">»</span>
                </Pagination.Next>
            </Pagination>
        </Container>
    )
}

export default Page
