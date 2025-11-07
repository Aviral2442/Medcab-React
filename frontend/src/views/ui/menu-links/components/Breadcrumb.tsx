import ComponentCard from '@/components/ComponentCard'
import {Breadcrumb, BreadcrumbItem, Col, Row} from 'react-bootstrap'
import {TbChevronRight, TbSmartHome} from 'react-icons/tb'

const Basic = () => {
    return (
        <>
            <h5 className="pb-1 mb-2">Basic</h5>
            <Breadcrumb className="mb-2 py-2">
                <BreadcrumbItem active aria-current="page">
                    Home
                </BreadcrumbItem>
            </Breadcrumb>
            <Breadcrumb className="mb-2 py-2">
                <BreadcrumbItem className="m-0">Home</BreadcrumbItem>
                <div className="mx-1" style={{height: 24}}>
                    <TbChevronRight height={16} width={16}/>
                </div>
                <BreadcrumbItem active aria-current="page">
                    Library
                </BreadcrumbItem>
            </Breadcrumb>
            <Breadcrumb className="mb-0 py-2">
                <BreadcrumbItem className="m-0">Home</BreadcrumbItem>
                <div className="mx-1" style={{height: 24}}>
                    <TbChevronRight height={16} width={16}/>
                </div>
                <BreadcrumbItem className="m-0">Library</BreadcrumbItem>
                <div className="mx-1" style={{height: 24}}>
                    <TbChevronRight height={16} width={16}/>
                </div>
                <BreadcrumbItem active aria-current="page">
                    Data
                </BreadcrumbItem>
            </Breadcrumb>
        </>
    )
}

const WithIcons = () => {
    return (
        <>
            <h5 className="pb-1 mb-2">With Icons</h5>
            <Breadcrumb className="bg-light bg-opacity-50 p-2 mb-2">
                <BreadcrumbItem active aria-current="page">
                    <TbSmartHome className="fs-16 me-1"/>
                    Home
                </BreadcrumbItem>
            </Breadcrumb>
            <Breadcrumb className="bg-light bg-opacity-50 p-2 mb-2">
                <BreadcrumbItem>
                    <TbSmartHome className="fs-16 me-1"/>
                    Home
                </BreadcrumbItem>
                <div className="mx-1" style={{height: 20}}>
                    <TbChevronRight height={16} width={16}/>
                </div>
                <BreadcrumbItem active aria-current="page">
                    Library
                </BreadcrumbItem>
            </Breadcrumb>
            <Breadcrumb className="bg-light bg-opacity-50 p-2 mb-0">
                <BreadcrumbItem>
                    <TbSmartHome className="fs-16 me-1"/>
                    Home
                </BreadcrumbItem>
                <div className="mx-1" style={{height: 20}}>
                    <TbChevronRight height={16} width={16}/>
                </div>
                <BreadcrumbItem>Library</BreadcrumbItem>
                <div className="mx-1" style={{height: 20}}>
                    <TbChevronRight height={16} width={16}/>
                </div>
                <BreadcrumbItem active aria-current="page">
                    Data
                </BreadcrumbItem>
                <div className="mx-1" style={{height: 20}}>
                    <TbChevronRight height={16} width={16}/>
                </div>
            </Breadcrumb>
        </>
    )
}

const BreadcrumbPage = () => {
    return (
        <>
            <ComponentCard title="Breadcrumb Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <Basic/>
                    </Col>
                    <Col xl={6}>
                        <WithIcons/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default BreadcrumbPage
