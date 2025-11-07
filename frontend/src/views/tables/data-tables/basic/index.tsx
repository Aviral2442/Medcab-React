import {Col, Container, Row} from 'react-bootstrap'
import ComponentCard from '@/components/ComponentCard'
import PageTitle from "@/components/PageTitle.tsx";
import {LuColumns3} from "react-icons/lu";

import DT from 'datatables.net-bs5'
import DataTable from 'datatables.net-react'
import 'datatables.net-responsive'

import ReactDOMServer from 'react-dom/server'
import {TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight} from 'react-icons/tb'

import {columns, tableData} from '@/views/tables/data-tables/data.ts'

const BasicTable = () => {
    DataTable.use(DT)
    return (
        <ComponentCard title="Basic DataTable">
            <DataTable
                data={tableData.body}
                columns={columns}
                options={{
                    responsive: true,
                    language: {
                        paginate: {
                            first: ReactDOMServer.renderToStaticMarkup(<TbChevronsLeft className="fs-lg"/>),
                            previous: ReactDOMServer.renderToStaticMarkup(<TbChevronLeft className="fs-lg"/>),
                            next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight className="fs-lg"/>),
                            last: ReactDOMServer.renderToStaticMarkup(<TbChevronsRight className="fs-lg"/>),
                        },
                    },
                }}
                className="table table-striped dt-responsive align-middle mb-0">
                <thead className="thead-sm text-uppercase fs-xxs">
                <tr>
                    {tableData.header.map((label, idx) => (
                        <th key={idx}>{label}</th>
                    ))}
                </tr>
                </thead>
            </DataTable>
        </ComponentCard>
    )
}

const ComplexHeaderTable = () => {
    DataTable.use(DT)
    return (
        <ComponentCard title="Complex Header">
            <DataTable
                data={tableData.body}
                columns={columns}
                options={{
                    responsive: true,
                    language: {
                        paginate: {
                            first: ReactDOMServer.renderToStaticMarkup(<TbChevronsLeft className="fs-lg"/>),
                            previous: ReactDOMServer.renderToStaticMarkup(<TbChevronLeft className="fs-lg"/>),
                            next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight className="fs-lg"/>),
                            last: ReactDOMServer.renderToStaticMarkup(<TbChevronsRight className="fs-lg"/>),
                        },
                    },
                }}
                className="table table-striped dt-responsive align-middle mb-0">
                <thead className="thead-sm text-uppercase fs-xxs">
                <tr>
                    <th colSpan={2}>Company Info</th>
                    <th colSpan={2}>Rate</th>
                    <th colSpan={2}>More</th>
                    <th colSpan={2}>Other</th>
                </tr>
                <tr>
                    {tableData.header.map((label, idx) => (
                        <th key={idx}>{label}</th>
                    ))}
                </tr>
                </thead>
            </DataTable>
        </ComponentCard>
    )
}

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Basic DataTables"
                subtitle="Enhance your tables with sorting, searching, and pagination using the powerful jQuery DataTables plugin."
                badge={{title: 'Dynamic Tables', icon: LuColumns3}}
            />

            <Row className="justify-content-center">
                <Col cols={12}>
                    <BasicTable/>

                    <ComplexHeaderTable/>
                </Col>
            </Row>
        </Container>
    )
}

export default Page
