import {Container} from 'react-bootstrap'
import {LuLoaderCircle} from 'react-icons/lu'
import PageTitle from "@/components/PageTitle.tsx";
import CarouselPage from './components/Carousel'
import Placeholders from './components/Placeholders'
import Progress from './components/Progress'
import Spinners from './components/Spinners'

const Page = () => {
    return (
        <>
            <Container fluid>

                <PageTitle title="Visual Feedback"
                           subtitle="Display loading states, progress indicators, carousels, and other UI elements that inform
                            users of ongoing processes."
                           badge={{
                               title: 'User Cues',
                               icon: LuLoaderCircle
                           }}

                />

                <Progress/>
                <Spinners/>
                <CarouselPage/>
                <Placeholders/>
            </Container>
        </>
    )
}

export default Page
