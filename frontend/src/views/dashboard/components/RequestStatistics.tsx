import {Card, CardBody, CardFooter, Col, Row} from 'react-bootstrap'
import { LuCalendar, LuClock, LuTimer, LuWallet} from 'react-icons/lu'
import CustomChartJS from '@/components/CustomChartJS.tsx'
import {Filler, LineController, LineElement, PointElement} from 'chart.js'
import CountUp from "react-countup";
import axios from 'axios'
import React from 'react'
import { getColor } from '@/helpers/chart'
import type { ChartJSOptionsType } from '@/types'

const RequestStatistics = () => {
    interface StatsData {
        labels: string[];
        today: number[];
        yesterday: number[];
        total_amount_last_30_days: number;
        overall_wallet_amount: number;
        last_transaction_unix_time: string;
    }

    const basePath = (import.meta as any).env?.VITE_PATH ?? "";
    const [statsData, setStatsData] = React.useState<StatsData>({
        labels: ['0–3h', '3–6h', '6–9h', '9–12h', '12–15h', '15–18h', '18–21h', '21–24h'],
        today: [0, 0, 0, 0, 0, 0, 0, 0],
        yesterday: [0, 0, 0, 0, 0, 0, 0, 0],
        total_amount_last_30_days: 0,
        overall_wallet_amount: 0,
        last_transaction_unix_time: "",
    });


    const fetchStatsData = async () => {
        try{
            const res = await axios.get(`${basePath}/dashboard/get_vendor_today_yesterday_counts`)
            console.log(res.data)
            setStatsData(res.data?.jsonData)
        } catch (error) {
            console.error('Fetching Stats Data Error: ', error)
        }
    }

    React.useEffect(() => {
        fetchStatsData();
    }, [])

    const date = new Date();
    const monthName = date.toLocaleString('default', { month: 'long' });

    const convertDate = (unixTime: string) => {
        if (!unixTime) return 'N/A';
        const date = new Date(parseInt(unixTime) * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    // Create dynamic chart options as a function
    const getChartOptions = React.useCallback((): ChartJSOptionsType => ({
        data: {
            labels: statsData.labels,
            datasets: [
                {
                    label: 'Vendors (Today)',
                    data: statsData.today,
                    fill: true,
                    borderColor: getColor('chart-primary'),
                    backgroundColor: getColor('chart-primary-rgb', 0.2),
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 1,
                },
                {
                    label: 'Vendors (Yesterday)',
                    data: statsData.yesterday,
                    fill: true,
                    borderColor: getColor('chart-gray'),
                    backgroundColor: getColor('chart-gray-rgb', 0.2),
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    enabled: true,
                },
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0,
                    },
                },
            },
        },
    }), [statsData.today, statsData.yesterday, statsData.labels]);


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
                              <CountUp end={statsData.total_amount_last_30_days} duration={2} enableScrollSpy scrollSpyOnce/>
                            </span>
                            </h2>
                            <p className="text-muted">Total Amount in last 30 days</p>
                            <p className="mb-0 mt-4">
                                <LuCalendar/> Data from {monthName}
                            </p>
                        </div>
                    </Col>

                    <Col xl={3} md={6} className="order-xl-last">
                        <div className="text-center">
                            <p className="mb-4">
                                <LuTimer/> Overall
                            </p>
                            <h2 className="fw-bold mb-0">{statsData.overall_wallet_amount} </h2>
                            <p className="text-muted">Total Amount In Wallet</p>
                            <p className="mb-0 mt-4">
                                <LuClock/> Last Transaction On: {convertDate(statsData.last_transaction_unix_time)}
                            </p>
                        </div>
                    </Col>

                    <Col xl={6}>
                        <div className="w-100" style={{height: '240px'}}>
                            <CustomChartJS 
                                type="line" 
                                getOptions={getChartOptions}
                                plugins={[LineController, LineElement, PointElement, Filler]}
                            />
                        </div>
                    </Col>
                </Row>
            </CardBody>

            <CardFooter>
                <div className="d-flex align-items-center text-muted justify-content-center">
                    <div>Last update: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default RequestStatistics
