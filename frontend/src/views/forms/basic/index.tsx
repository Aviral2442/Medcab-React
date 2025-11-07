import {Col, Container, Row} from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import {LuClipboardList} from 'react-icons/lu'
import InputTextFieldType from '@/views/forms/basic/components/InputTextFieldType'
import InputType from '@/views/forms/basic/components/InputType'
import InputGroups from '@/views/forms/basic/components/InputGroups'
import FloatingLabels from '@/views/forms/basic/components/FloatingLabels'
import InputSizes from '@/views/forms/basic/components/InputSizes'
import ChecksRadiosSwitches from '@/views/forms/basic/components/ChecksRadiosSwitches'

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Basic Form Elements"
                subtitle="Build functional forms with input fields, checkboxes, radios, selects, and other essential form controls."
                badge={{
                    title: 'Form Basics',
                    icon: LuClipboardList,
                }}
            />

            <Row>
                <Col xl={12}>
                    <InputTextFieldType/>

                    <InputType/>

                    <InputGroups/>

                    <FloatingLabels/>

                    <InputSizes/>

                    <ChecksRadiosSwitches/>
                </Col>
            </Row>
        </Container>
    )
}

export default Page
