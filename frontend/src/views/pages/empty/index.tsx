import {Container} from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import {LuBookOpen} from 'react-icons/lu'

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Blank Starter Page"
                subtitle="A clean slate to kickstart your custom page development. Use this template to build anything from scratch."
                badge={{
                    title: 'Start Fresh',
                    icon: LuBookOpen,
                }}
            />

            {/* add your content here */}
        </Container>
    )
}

export default Page
