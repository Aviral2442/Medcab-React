import {Container} from 'react-bootstrap'
import {LuNavigation} from 'react-icons/lu'
import PageTitle from "@/components/PageTitle.tsx";
import BreadcrumbPage from './components/Breadcrumb'
import Dropdowns from './components/Dropdowns'
import Links from './components/Links'
import ListGroupPage from './components/ListGroup'
import Paginations from './components/Paginations'

const Page = () => {
    return (
        <>
            <Container fluid>

                <PageTitle title="Menus & Navigation Links"
                           subtitle="Design intuitive navigation with menus, dropdowns, navbars, and link variations to guide
                            user flow effectively."
                           badge={{
                               title: 'Site Structure',
                               icon: LuNavigation
                           }}

                />

                <BreadcrumbPage/>
                <Dropdowns/>
                <Links/>
                <ListGroupPage/>
                <Paginations/>
            </Container>
        </>
    )
}

export default Page
