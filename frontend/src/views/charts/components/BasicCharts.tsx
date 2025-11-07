import {Col, Row} from 'react-bootstrap'
import ComponentCard from '@/components/ComponentCard'
import CustomChartJS from '@/components/CustomChartJS.tsx'
import {Filler, LineController, LineElement, PointElement, RadarController, RadialLinearScale} from 'chart.js'
import {
    getBasicAreaChart,
    getBoundedAreaChart,
    getDifferentDatasetChart,
    getDrawTimeChart,
    getRadarChart,
    getStackedAreaChart,
} from '@/views/charts/data'

const Page = () => {
    return (
        <Row>
            <Col xl={6}>
                <ComponentCard title="Basic Area">
                    <div className="mt-3" style={{height: '300px'}}>
                        <CustomChartJS type="line" getOptions={getBasicAreaChart} plugins={[LineController]}
                                       style={{maxHeight: '300px'}}/>
                    </div>
                </ComponentCard>
            </Col>

            <Col xl={6}>
                <ComponentCard title="Different Dataset">
                    <div className="mt-3" style={{height: '300px'}}>
                        <CustomChartJS type="line" getOptions={getDifferentDatasetChart} plugins={[LineController]}
                                       style={{maxHeight: '300px'}}/>
                    </div>
                </ComponentCard>
            </Col>

            <Col xl={6}>
                <ComponentCard title="Stacked">
                    <div className="mt-3" style={{height: '300px'}}>
                        <CustomChartJS type="line" getOptions={getStackedAreaChart} plugins={[LineController]}
                                       style={{maxHeight: '300px'}}/>
                    </div>
                </ComponentCard>
            </Col>

            <Col xl={6}>
                <ComponentCard title="Boundaries">
                    <div className="mt-3" style={{height: '300px'}}>
                        <CustomChartJS type="line" getOptions={getBoundedAreaChart} plugins={[LineController]}
                                       style={{maxHeight: '300px'}}/>
                    </div>
                </ComponentCard>
            </Col>

            <Col xl={6}>
                <ComponentCard title="Draw Time">
                    <div className="mt-3" style={{height: '300px'}}>
                        <CustomChartJS type="line" getOptions={getDrawTimeChart} plugins={[LineController]}
                                       style={{maxHeight: '300px'}}/>
                    </div>
                </ComponentCard>
            </Col>

            <Col xl={6}>
                <ComponentCard title="Radar">
                    <div className="mt-3" style={{height: '300px'}}>
                        <CustomChartJS
                            type="radar"
                            getOptions={getRadarChart}
                            plugins={[RadarController, RadialLinearScale, LineElement, PointElement, Filler]}
                            style={{maxHeight: '300px'}}/>
                    </div>
                </ComponentCard>
            </Col>
        </Row>
    )
}

export default Page
