import {Col, Container, Row} from 'react-bootstrap'
import TotalCancelOngoingBooking from '@/views/dashboard/components/TotalCancelOngoingBookingCounts'
import TotalActiveOtherStatusVendor from '@/views/dashboard/components/TotalActiveOtherStatusVendorCounts'
import Latest5BookingTransactionList from '@/views/dashboard/components/Latest5BookingTransactionList'
import GetConsumerCounts from '@/views/dashboard/components/GetConsumerCounts'
import RequestStatistics from '@/views/dashboard/components/RequestStatistics'
import LatestNewOngoingBookingLists from '@/views/dashboard/components/LatestNewOngoingBookingLists'
import TotalBookingCount from '@/views/dashboard/components/TotalBookingCount'
import Latest5VendorTransactionList from '@/views/dashboard/components/Latest5VendorTransactionList'

const Page = () => {
    return (
        <Container fluid className='mt-3'>
            {/* <PageTitle
                title="The Ultimate Admin & Dashboard Theme"
                subtitle="A premium collection of elegant, accessible components and a powerful codebase. Built for modern frameworks. Developer Friendly. Production Ready."
                badge={{
                    title: 'Medium and Large Business',
                    icon: LuSparkles,
                }}
            /> */}

            <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1">
                <Col>
                    <TotalBookingCount/>
                </Col>

                <Col>
                    <TotalActiveOtherStatusVendor/>
                </Col>  

                <Col>
                    <TotalCancelOngoingBooking/>
                </Col>

                <Col>
                    <GetConsumerCounts/>
                </Col>
            </Row>

            <Row>
                <Col cols={12}>
                    <RequestStatistics/>
                </Col>
            </Row>

            <Row>
                <Col xxl={6}>
                    <LatestNewOngoingBookingLists/>
                </Col>

                <Col xxl={6}>
                    <Latest5BookingTransactionList/>

                    <Latest5VendorTransactionList/>
                </Col>
            </Row>
        </Container>
    )
}

export default Page
