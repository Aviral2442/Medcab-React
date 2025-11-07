import {Col, Row} from 'react-bootstrap'
import CustomChartJS from '@/components/CustomChartJS.tsx'
import {
    getBasicBarChart,
    getBorderRadiusBarChart,
    getFloatingBarChart,
    getHorizontalBarChart,
    getStackedBarChart,
    getStackedGroupedBarChart,
    getVerticalBarChart,
} from '@/views/charts/data'
import ComponentCard from '@/components/ComponentCard'
import {BarController, BarElement} from 'chart.js'

const Page = () => {
    return (
        <>
            <h4 className="mb-3 fw-bold">Bar Charts</h4>

            <Row>
                <Col xl={6}>
                    <ComponentCard title="Basic Bar">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="bar" getOptions={getBasicBarChart}
                                           plugins={[BarController, BarElement]} style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Border Radius">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="bar" getOptions={getBorderRadiusBarChart}
                                           plugins={[BarController, BarElement]} style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Floating">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="bar" getOptions={getFloatingBarChart}
                                           plugins={[BarController, BarElement]} style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Horizontal">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="bar" getOptions={getHorizontalBarChart}
                                           plugins={[BarController, BarElement]} style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Stacked">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="bar" getOptions={getStackedBarChart}
                                           plugins={[BarController, BarElement]} style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Stacked with Groups">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="bar" getOptions={getStackedGroupedBarChart}
                                           plugins={[BarController, BarElement]} style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>

                <Col xl={6}>
                    <ComponentCard title="Vertical">
                        <div className="mt-3" style={{height: '300px'}}>
                            <CustomChartJS type="bar" getOptions={getVerticalBarChart}
                                           plugins={[BarController, BarElement]} style={{maxHeight: '300px'}}/>
                        </div>
                    </ComponentCard>
                </Col>
            </Row>
        </>
    )
}

export default Page
