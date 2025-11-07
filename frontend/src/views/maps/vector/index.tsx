import {Card, CardBody, CardHeader, CardTitle, Col, Container, Row} from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import {LuMap} from 'react-icons/lu'
import BaseVectorMap from '@/components/BaseVectorMap'
import {getWorldMapOptions} from '@/views/maps/vector/data'
import WorldMapMarkerLine from '@/views/maps/vector/components/WorldMapMarkerLine'
import USAVectorMap from '@/views/maps/vector/components/USAVectorMap'
import CanadaVectorMap from '@/views/maps/vector/components/CanadaVectorMap'
import RussiaVectorMap from '@/views/maps/vector/components/RussiaVectorMap'
import IraqVectorMap from '@/views/maps/vector/components/IraqVectorMap'
import SpainVectorMap from '@/views/maps/vector/components/SpainVectorMap'

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Interactive Vector Maps"
                subtitle="Visualize geographic data with responsive, zoomable vector maps — ideal for dashboards, analytics, and location-based features."
                badge={{
                    title: 'Geographic UI',
                    icon: LuMap,
                }}
            />

            <Row>
                <Col xl={6}>
                    <Card>
                        <CardHeader className="d-block">
                            <CardTitle as="h5" className="mb-1">
                                World Vector Map
                            </CardTitle>
                            <p className="text-muted mb-0">A global map showing countries with interactive markers.</p>
                        </CardHeader>
                        <CardBody>
                            <BaseVectorMap id="world-map" options={getWorldMapOptions()}
                                              style={{height: 360}}/>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardHeader className="d-block">
                            <CardTitle as="h5" className="mb-1">
                                World Vector Live Map
                            </CardTitle>
                            <p className="text-muted mb-0">Live dynamic vector representation of the world with
                                real-time features.</p>
                        </CardHeader>
                        <CardBody>
                            <WorldMapMarkerLine/>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardHeader className="d-block">
                            <CardTitle as="h5" className="mb-1">
                                US Vector Map
                            </CardTitle>
                            <p className="text-muted mb-0">Interactive vector map of the United States with state-level
                                details.</p>
                        </CardHeader>
                        <CardBody>
                            <USAVectorMap/>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardHeader className="d-block">
                            <CardTitle as="h5" className="mb-1">
                                Canada Vector Map
                            </CardTitle>
                            <p className="text-muted mb-0">Displays Canadian provinces and territories with interactive
                                regions.</p>
                        </CardHeader>
                        <CardBody>
                            <CanadaVectorMap/>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardHeader className="d-block">
                            <CardTitle as="h5" className="mb-1">
                                Russia Vector Map
                            </CardTitle>
                            <p className="text-muted mb-0">Interactive map highlighting major regions across Russia.</p>
                        </CardHeader>
                        <CardBody>
                            <RussiaVectorMap/>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardHeader className="d-block">
                            <CardTitle as="h5" className="mb-1">
                                Iraq Vector Map
                            </CardTitle>
                            <p className="text-muted mb-0">Vector visualization of Iraq highlighting provinces and
                                regions.</p>
                        </CardHeader>
                        <CardBody>
                            <IraqVectorMap/>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <CardHeader className="d-block">
                            <CardTitle as="h5" className="mb-1">
                                Spain Vector Map
                            </CardTitle>
                            <p className="text-muted mb-0">Geographical map of Spain with region-based interaction.</p>
                        </CardHeader>
                        <CardBody>
                            <SpainVectorMap/>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Page
