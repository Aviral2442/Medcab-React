import {Card, CardBody, CardTitle, Col, Container, Row} from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import {LiaEdit} from 'react-icons/lia'
import {useMemo, useState} from 'react'
import CustomQuill from "@/components/CustomQuill.tsx";

const SnowEditor = () => {
    const modules = useMemo(
        () => ({
            toolbar: [
                [{font: []}],
                ['bold', 'italic', 'underline', 'strike'],
                [{color: []}, {background: []}],
                [{script: 'super'}, {script: 'sub'}],
                [{header: [false, 1, 2, 3, 4, 5, 6]}],
                ['blockquote', 'code-block'],
                [{list: 'ordered'}, {list: 'bullet'}, {indent: '-1'}, {indent: '+1'}],
                [{align: []}],
                ['link', 'image', 'video'],
                ['clean'],
            ],
        }),
        [],
    )
    const [value, setValue] = useState<string>(
        `<div>
      <h3>A powerful and responsive admin dashboard template built on Bootstrap.</h3>
      <p>
        <br />
      </p>
      <ul>
        <li>Fully responsive layout with a sleek and modern design.</li>
        <li>Multiple pre-built pages such as login, registration, dashboard, charts, tables, and more.</li>
        <li>Includes various components like modals, alerts, navigation menus, etc.</li>
        <li>Easy to customize and extend to suit your project’s needs.</li>
        <li>Built with Bootstrap 5x, ensuring compatibility with a wide range of devices.</li>
      </ul>
      <p>
        <br />
      </p>
      <p>Simple Admin is the perfect choice for your next admin project. Get started today and create a stunning interface for your application.</p>
    </div>`,
    )

    return (
        <>
            <CardTitle as="h5" className="mb-2">
                Snow Editor
            </CardTitle>
            <p className="text-muted">Snow is a clean, flat toolbar theme.</p>

            <CustomQuill key="snow" theme="snow" modules={modules} value={value} onChange={setValue}/>
        </>
    )
}

const BubbleEditor = () => {
    const [value, setValue] = useState<string>(
        `<div>
      <h3>A powerful and responsive admin dashboard template built on Bootstrap.</h3>
      <p>
        <br />
      </p>
      <ul>
        <li>Fully responsive layout with a sleek and modern design.</li>
        <li>Multiple pre-built pages such as login, registration, dashboard, charts, tables, and more.</li>
        <li>Includes various components like modals, alerts, navigation menus, etc.</li>
        <li>Easy to customize and extend to suit your project’s needs.</li>
        <li>Built with Bootstrap 5x, ensuring compatibility with a wide range of devices.</li>
      </ul>
      <p>
        <br />
      </p>
      <p>Simple Admin is the perfect choice for your next admin project. Get started today and create a stunning interface for your application.</p>
    </div>`,
    )
    return (
        <>
            <CardTitle as="h5" className="mb-2">
                Bubble Editor
            </CardTitle>
            <p className="text-muted">Bubble is a simple tooltip based theme.</p>

            <CustomQuill key="bubble" theme="bubble" value={value} onChange={setValue}/>
        </>
    )
}

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Rich Text Editor"
                subtitle="Create and edit beautifully formatted content with Quill.js — a modern WYSIWYG editor with extensible features."
                badge={{
                    title: 'React Quill New Editor',
                    icon: LiaEdit,
                }}
            />

            <Row>
                <Col cols={12}>
                    <Card>
                        <CardBody>
                            <SnowEditor/>
                        </CardBody>

                        <div className="border-top border-dashed"></div>

                        <CardBody>
                            <BubbleEditor/>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Page
