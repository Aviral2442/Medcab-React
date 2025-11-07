import {Container} from 'react-bootstrap'
import {LuMousePointerClick} from 'react-icons/lu'
import PageTitle from "@/components/PageTitle.tsx";
import Collapses from './components/Collapse'
import Modals from './components/Modals'
import Notifications from './components/Notifications'
import OffcanvasPage from './components/Offcanvas'
import Popovers from './components/Popovers'
import Tabs from './components/Tabs'
import Tooltips from './components/Tooltips'

const Page = () => {
    return (
        <>
            <Container fluid>

                <PageTitle title="Interactive Components"
                           subtitle="Enhance user experience with dynamic Bootstrap elements like modals, collapses, tabs,
                            tooltips, and more."
                           badge={{
                               title: 'JS Powered UI',
                               icon: LuMousePointerClick
                           }}

                />

                <Collapses/>
                <Modals/>
                <Notifications/>
                <OffcanvasPage/>
                <Popovers/>
                <Tabs/>
                <Tooltips/>
            </Container>
        </>
    )
}

export default Page
