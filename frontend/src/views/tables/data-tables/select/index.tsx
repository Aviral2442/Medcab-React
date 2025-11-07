import ComponentCard from '@/components/ComponentCard'
import {Col, Container, Row} from 'react-bootstrap'

import DT from 'datatables.net-bs5'
import DataTable from 'datatables.net-react'
import 'datatables.net-select'

import ReactDOMServer from 'react-dom/server'
import {TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight} from 'react-icons/tb'

import {columns, tableData} from '@/views/tables/data-tables/data.ts'
import PageTitle from "@/components/PageTitle.tsx";
import {LuSquareCheck} from "react-icons/lu";

const SingleItemSelect = () => {
    DataTable.use(DT)
    return (
        <ComponentCard title="Single Item Select">
            <DataTable
                data={tableData.body}
                columns={columns}
                options={{
                    responsive: true,
                    select: {style: 'single'},
                    pageLength: 7,
                    lengthMenu: [7, 10, 25, 50, -1],
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

const MultiItemSelection = () => {
    DataTable.use(DT)
    return (
        <ComponentCard title="Multi Item Selection">
            <DataTable
                data={tableData.body}
                columns={columns}
                options={{
                    responsive: true,
                    select: {style: 'multi'},
                    pageLength: 7,
                    lengthMenu: [7, 10, 25, 50, -1],
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

const CellSelection = () => {
    DataTable.use(DT)
    return (
        <ComponentCard title="Cell Selection">
            <DataTable
                data={tableData.body}
                columns={columns}
                options={{
                    responsive: true,
                    select: {style: 'os', items: 'cell'},
                    pageLength: 7,
                    lengthMenu: [7, 10, 25, 50, -1],
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

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Selectable DataTables"
                subtitle="Add row selection features to your tables using DataTables Select extension — perfect for bulk actions and item management."
                badge={{title: 'Row Selection', icon: LuSquareCheck}}
            />

            <Row className="justify-content-center">
                <Col cols={12}>
                    <SingleItemSelect/>

                    <MultiItemSelection/>

                    <CellSelection/>
                </Col>
            </Row>
        </Container>
    )
}

export default Page
