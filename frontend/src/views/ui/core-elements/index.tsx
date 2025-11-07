import {Container} from 'react-bootstrap'
import {LuLayoutGrid} from 'react-icons/lu'
import Accordions from './components/Accordion'
import Alerts from './components/Alerts'
import Avatar from './components/Avatar'
import Badge from './components/Badge'
import ButtonPage from './components/Button'
import Cards from './components/Cards'
import Typography from './components/Typography'
import Video from './components/Video'
import PageTitle from "@/components/PageTitle.tsx";

const Page = () => {
    return (
        <>
            <Container fluid>

                <PageTitle title="Core UI Elements"
                           subtitle="Explore essential components like buttons, alerts, images, badges, and more to build
                            consistent, responsive interfaces."
                           badge={{
                               title: 'UI Essentials',
                               icon: LuLayoutGrid
                           }}

                />

                <ButtonPage/>
                <Avatar/>
                <Badge/>
                <Accordions/>
                <Alerts/>
                <Cards/>
                <Video/>
                <Typography/>
            </Container>
        </>
    )
}

export default Page
