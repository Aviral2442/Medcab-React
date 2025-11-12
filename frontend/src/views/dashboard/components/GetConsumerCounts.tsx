import {Card, CardBody, CardFooter} from 'react-bootstrap'
import {LuCpu} from 'react-icons/lu'
import {TbArrowUp} from 'react-icons/tb'
import {tokenUsageChart} from '@/views/dashboard/data'
import CustomChartJS from '@/components/CustomChartJS.tsx'
import {Filler, LineController, LineElement, PointElement} from 'chart.js'
import CountUp from "react-countup";
import axios from "axios"
import React from 'react'

const TokenUsage = () => {

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    const [consumers, setConsumers] = React.useState({
        total_consumers_today: '0',
        total_consumers_yesterday: '0'
    })

    const fetchConsumerCounts = async () => {
        try{
            const res = await axios.get(`${baseURL}/dashboard/get_consumer_counts`)
            // console.log("API Response of CONSUMERS: ",res.data?.jsonData?.consumerCounts)
            setConsumers(res.data?.jsonData?.consumerCounts)
        } catch (error){
            console.error("Error fetching CONSUMERS: ", error)
        }
    }
    React.useEffect(() => {
        fetchConsumerCounts();
    }, [])


    const {total_consumers_today, total_consumers_yesterday} = consumers;
    let diff = parseFloat(total_consumers_today) - parseInt(total_consumers_yesterday);

    const totalPercentage = Math.abs(diff);
    // console.log("Total Percentage: ", totalPercentage);

    let upDownStatusToday = '';
    if (diff >= 0){
        upDownStatusToday = 'up';
    }
    else{
        upDownStatusToday = 'down';
    }


    let arrowIconT: React.ReactNode, arrowIconY: React.ReactNode;
    if (upDownStatusToday === 'up'){
        arrowIconT = <TbArrowUp className="text-success ms-1"/>
        arrowIconY = <TbArrowUp className="text-danger ms-1" style={{transform: 'rotate(180deg)'}}/>
    }
    else{
        arrowIconT = <TbArrowUp className="text-danger ms-1" style={{transform: 'rotate(180deg)'}}/>
        arrowIconY = <TbArrowUp className="text-success ms-1"/>
    }


    return (
        <Card className="card" style={{ maxHeight: '230px' }}>
            <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="text-uppercase">Consumer's</h5>
                    </div>
                    <div>
                        <LuCpu className="text-muted fs-24 svg-sw-10"/>
                    </div>
                </div>

                <div className="mb-3">
                    <CustomChartJS type="line" getOptions={tokenUsageChart}
                                   plugins={[LineController, LineElement, PointElement, Filler]} height={16}/>
                </div>

                <div className="d-flex justify-content-between">
                    <div>
                        <span className="text-muted">Today</span>
                        <div className="fw-semibold">
                            <span>
                              <CountUp end={parseInt(total_consumers_today)} duration={2} enableScrollSpy scrollSpyOnce/>
                            </span>
                            {arrowIconT}
                        </div>
                    </div>
                    <div className="text-end">
                        <span className="text-muted">Yesterday</span>
                        <div className="fw-semibold">
                            <span>
                              <CountUp end={parseInt(total_consumers_yesterday)} duration={2} enableScrollSpy scrollSpyOnce/>
                            </span>
                            {arrowIconY}
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="text-muted text-center">
                Consumer {upDownStatusToday} <strong>{totalPercentage}%</strong> from yesterday
            </CardFooter>
        </Card>
    )
}

export default TokenUsage
