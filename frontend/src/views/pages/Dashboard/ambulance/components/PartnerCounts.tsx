import {Card, CardBody, CardFooter, ProgressBar} from 'react-bootstrap'
import {LuUsers} from 'react-icons/lu'
import CountUp from "react-countup";
import React from 'react'
import axios from 'axios';

const ActiveUsers = () => {

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    const [partners, setpartners] = React.useState({
        today_new_partners: 0,
        active_partners: 0,
        other_status_partners: 0,
        total_partners: 0
    })
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchpartnerCounst = async () => {
        try{
            setIsLoading(true)
            const res = await axios.get(`${baseURL}/ambulance/ambulance_partners_count`)
            // console.log("API Response of partnerS: ",res.data?.jsonData?.partnerCounts)
            setpartners(res.data?.jsonData?.total_partner_count || {})
        } catch (error){
            console.error("Error fetching partnerS: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchpartnerCounst();
    }, [])

    const { today_new_partners, active_partners, other_status_partners, total_partners } = partners;

    if (isLoading) {
        return (
            <Card className="card-h-100">
                <CardBody>
                    <div className="text-center">Loading...</div>
                </CardBody>
            </Card>
        )
    }

    return (
                <Card className="card-h-100">
            <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 className="text-uppercase mb-2 fw-500">Partner</h5>
                        <h3 className="mb-0 fw-normal">
                        <span>
                          <CountUp end={total_partners} duration={2} enableScrollSpy scrollSpyOnce/>
                        </span>
                        </h3>
                        <p className="text-muted mb-1">Total Partners in Collection</p>
                    </div>
                    <div>
                        <LuUsers className="text-muted fs-24 svg-sw-10"/>
                    </div>
                </div>

                <ProgressBar now={(active_partners/total_partners) * 100} className="progress-lg mb-1"/>

                <div className="d-flex justify-content-between">
                    <div>
                        <span className="text-muted">Active Partners</span>
                        <h5 className="mb-0">{active_partners}</h5>
                    </div>
                    <div className="text-end">
                        <span className="text-muted">Other Partners</span>
                        <h5 className="mb-0">{other_status_partners}</h5>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="text-muted text-center">{today_new_partners} new partners joined today</CardFooter>
        </Card>
    )
}

export default ActiveUsers