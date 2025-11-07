import {Col, Container, Row} from 'react-bootstrap'
import {LuShieldCheck} from 'react-icons/lu'
import PageTitle from '@/components/PageTitle'
import {
    ReactHookForm,
    ReactHookFormWithYup,
    ReactHookFormWithZod
} from '@/views/forms/validation/components/ReactHookForm'
import {
    ReactBootstrapValidation,
    ReactBootstrapValidationWithTooltip
} from '@/views/forms/validation/components/ReactBootstrap'

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Form Validation"
                subtitle="Ensure data accuracy and user input quality with built-in and custom validation techniques using Bootstrap and JavaScript."
                badge={{
                    title: 'Validation Rules',
                    icon: LuShieldCheck,
                }}
            />

            <Row>
                <Col lg={12}>
                    <ReactHookForm/>

                    <ReactHookFormWithYup/>

                    <ReactHookFormWithZod/>

                    <ReactBootstrapValidation/>

                    <ReactBootstrapValidationWithTooltip/>
                </Col>
            </Row>
        </Container>
    )
}

export default Page
