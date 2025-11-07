import {Col, Row} from 'react-bootstrap'
import ComponentCard from '@/components/ComponentCard'
import CustomChartJS from '@/components/CustomChartJS.tsx'
import {
    ArcElement,
    BarController,
    BarElement,
    BubbleController,
    DoughnutController,
    LineController,
    LineElement,
    PieController,
    PointElement,
    PolarAreaController,
    RadialLinearScale,
    ScatterController,
} from 'chart.js'
import {
    getBubbleChart,
    getComboBarLineChart,
    getDoughnutChart,
    getMultiPieChart,
    getPieChart,
    getPolarAreaChart,
    getScatterChart,
    getStackedBarLineChart,
} from '@/views/charts/data'

const Page = () => {
    return (
        <>
            <h4 className="mb-3 fw-bold">Other Charts</h4>

            <Row>
                <Col xl={6}>
                    <ComponentCard title="Bubble">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="bubble" getOptions={getBubbleChart}
                                           plugins={[BubbleController, PointElement]} style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Combo Bar & Line">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS
                                type="bar"
                                getOptions={getComboBarLineChart}
                                plugins={[BarController, LineController, PointElement, LineElement, BarElement]}
                                style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Stacked Bar & Line">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS
                                type="bar"
                                getOptions={getStackedBarLineChart}
                                plugins={[BarController, LineController, PointElement, LineElement, BarElement]}
                                style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Doughnut">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="doughnut" getOptions={getDoughnutChart}
                                           plugins={[DoughnutController, PointElement, ArcElement]}
                                           style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Pie">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="pie" getOptions={getPieChart}
                                           plugins={[PieController, PointElement, ArcElement]}
                                           style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Multi Series Pie">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="pie" getOptions={getMultiPieChart}
                                           plugins={[PieController, PointElement, ArcElement]}
                                           style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Polar Area">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="polarArea" getOptions={getPolarAreaChart}
                                           plugins={[PolarAreaController, RadialLinearScale, ArcElement]}
                                           style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Scatter">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="scatter" getOptions={getScatterChart}
                                           plugins={[ScatterController, PointElement]} style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>
            </Row>
        </>
    )
}

export default Page
