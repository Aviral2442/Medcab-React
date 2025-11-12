import {Card, CardBody, CardFooter, Col, Row} from 'react-bootstrap'
import { LuCalendar, LuClock, LuTimer, LuWallet} from 'react-icons/lu'
import CustomChartJS from '@/components/CustomChartJS.tsx'
import {activeUsersChart} from '@/views/dashboard/data'
import {Filler, LineController, LineElement, PointElement} from 'chart.js'
import CountUp from "react-countup";
import axios from 'axios'
import React from 'react'

const RequestStatistics = () => {

    const basePath = (import.meta as any).env?.VITE_PATH ?? "";
    const [statsData, setStatsData] = React.useState<any>(null);

    const fetchStatsData = async () => {
        try{
            const res = await axios.get(`${basePath}/dashboard/get_consumer_today_yesterday_counts`)
            console.log(res.data)
            setStatsData(res.data)
        } catch (error) {
            console.error('Fetching Stats Data Error: ', error)
        }
    }

    React.useEffect(() => {
        fetchStatsData();
    }, [])

    return (
        <Card>
            <CardBody>
                <Row className="align-items-center">
                    <Col xl={3} md={6}>
                        <div className="text-center">
                            <p className="mb-4">
                                <LuWallet/> Vendor Wallets
                            </p>
                            <h2 className="fw-bold mb-0">
                            <span>
                              <CountUp end={807621} duration={2} enableScrollSpy scrollSpyOnce/>
                            </span>
                            </h2>
                            <p className="text-muted">Total Amount in last 30 days</p>
                            <p className="mb-0 mt-4">
                                <LuCalendar/> Data from May
                            </p>
                        </div>
                    </Col>

                    <Col xl={3} md={6} className="order-xl-last">
                        <div className="text-center">
                            <p className="mb-4">
                                <LuTimer/> Overall
                            </p>
                            <h2 className="fw-bold mb-0">452,652 </h2>
                            <p className="text-muted">Total Amount In Wallet</p>
                            <p className="mb-0 mt-4">
                                <LuClock/> Last Transaction On: 12.06.2025
                            </p>
                        </div>
                    </Col>

                    <Col xl={6}>
                        <div className="w-100" style={{height: '240px'}}>
                            <CustomChartJS type="line" getOptions={activeUsersChart}
                                           plugins={[LineController, LineElement, PointElement, Filler]}/>
                        </div>
                    </Col>
                </Row>
            </CardBody>

            <CardFooter>
                <div className="d-flex align-items-center text-muted justify-content-center">
                    <div>Last update: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</div>
                    {/* <div>You received 2 new AI feedback reports</div> */}
                </div>
            </CardFooter>
        </Card>
    )
}

export default RequestStatistics
