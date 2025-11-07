import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormControl,
    Offcanvas,
    OverlayTrigger,
    Row,
    Tooltip
} from 'react-bootstrap'
import SideBar from '@/views/ai/ton-ai/components/SideBar'
import {useState} from 'react'
import {
    TbBrain,
    TbLink,
    TbMenu2,
    TbMicrophone,
    TbPaperclip,
    TbPhotoUp,
    TbRobot,
    TbSend,
    TbTextRecognition
} from 'react-icons/tb'
import {LuSparkles} from 'react-icons/lu'
import type {IconType} from 'react-icons'
import PageMeta from "@/components/PageMeta.tsx";

type FeatureType = {
    icon: IconType
    title: string
}

const features: FeatureType[] = [
    {
        icon: TbBrain,
        title: 'Generate AI-powered insights from customer reviews',
    },
    {
        icon: TbRobot,
        title: 'Create chatbot responses for common support questions',
    },
    {
        icon: TbTextRecognition,
        title: 'Summarize lengthy documents using AI',
    },
]

const FeatureCard = ({feature}: { feature: FeatureType }) => {
    return (
        <Card className="card-hovered rounded-3">
            <CardBody>
                <div
                    className="avatar-lg mb-2 rounded-circle text-bg-light d-flex align-items-center justify-content-center">
                    <feature.icon className="fs-xxl"/>
                </div>
                <p className="mb-0 text-muted">{feature.title}</p>
            </CardBody>
        </Card>
    )
}

const Page = () => {
    const [show, setShow] = useState(false)

    const toggleShow = () => setShow(!show)

    return (
        <>
            <PageMeta title="Ton AI - A Simple Simple AI Tools"/>

            <Container fluid>
                <div className="outlook-box mt-4">
                    <Offcanvas show={show} onHide={toggleShow} responsive="lg"
                               className="outlook-left-menu rounded-start-4">
                        <SideBar/>
                    </Offcanvas>

                    <Card className="mb-0 rounded-0 flex-grow-1" style={{minHeight: 'calc(100vh - 168px)'}}>
                        <CardHeader className="d-lg-none d-flex">
                            <button className="btn btn-sm btn-default btn-icon" onClick={toggleShow}>
                                <TbMenu2 className="fs-lg"/>
                            </button>
                        </CardHeader>

                        <CardBody className="d-flex flex-column justify-content-between align-items-center h-100">
                            <Row className="justify-content-center">
                                <Col xl={8}>
                                    <div className="mt-3">
                                        <div className="avatar avatar-sm rounded-circle mx-auto text-bg-dark">
                    <span className="avatar-title">
                      <LuSparkles className="fs-md"/>
                    </span>
                                        </div>
                                        <h3 className="mb-4 mt-2 text-center">How can I help, Maxine 👋?</h3>

                                        <div className="py-4">
                                            <Row className="g-2">
                                                {features.map((feature, idx) => (
                                                    <Col md={4} key={idx}>
                                                        <FeatureCard feature={feature}/>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <div className="w-100 text-center">
                                <CardBody>
                                    <FormControl as="textarea" rows={4} placeholder="Enter message"/>
                                    <div className="d-flex gap-1 mt-2 align-items-center">
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Attach files</Tooltip>}>
                                            <button type="button" className="btn btn-sm btn-icon btn-default">
                                                <TbPaperclip className="fs-sm"/>
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Insert link</Tooltip>}>
                                            <button type="button" className="btn btn-sm btn-icon btn-default">
                                                <TbLink className="fs-sm"/>
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Insert photo</Tooltip>}>
                                            <button type="button" className="btn btn-sm btn-icon btn-default">
                                                <TbPhotoUp className="fs-sm"/>
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Voice</Tooltip>}>
                                            <button type="button" className="btn btn-sm btn-icon btn-default">
                                                <TbMicrophone className="fs-sm"/>
                                            </button>
                                        </OverlayTrigger>
                                        <Button variant="primary" size="sm" type="button" className="ms-auto">
                                            <TbSend className="fs-sm me-1"/> Send
                                        </Button>
                                    </div>
                                </CardBody>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </Container>
        </>
    )
}

export default Page
