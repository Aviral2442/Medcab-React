import small1 from '@/assets/images/stock/small-1.jpg'
import small10 from '@/assets/images/stock/small-10.jpg'
import small2 from '@/assets/images/stock/small-2.jpg'
import small3 from '@/assets/images/stock/small-3.jpg'
import small8 from '@/assets/images/stock/small-8.jpg'
import small9 from '@/assets/images/stock/small-9.jpg'
import ComponentCard from '@/components/ComponentCard'
import {Carousel, CarouselItem, Col, Row} from 'react-bootstrap'

const SlidesOnly = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Slides Only</h5>
            <Carousel controls={false} indicators={false} id="carouselExampleSlidesOnly" className="carousel slide"
                      data-bs-ride="carousel">
                <CarouselItem className="active">
                    <img className="d-block img-fluid" src={small1} alt="First slide"/>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small2} alt="Second slide"/>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small3} alt="Third slide"/>
                </CarouselItem>
            </Carousel>
        </>
    )
}

const SlidesWithControls = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">With Controls</h5>
            <Carousel indicators={false} id="carouselExampleControls" className="slide " data-bs-ride="carousel">
                <CarouselItem className="active">
                    <img className="d-block img-fluid" src={small1} alt="First slide"/>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small2} alt="Second slide"/>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small3} alt="Third slide"/>
                </CarouselItem>
            </Carousel>
        </>
    )
}

const SlidesWithIndicators = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">With Indicators</h5>
            <Carousel controls={true} indicators={true} id="carouselExampleControls">
                <CarouselItem className="active">
                    <img className="d-block img-fluid" src={small1} alt="First slide"/>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small2} alt="Second slide"/>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small3} alt="Third slide"/>
                </CarouselItem>
            </Carousel>
        </>
    )
}

const SlidesWithCaptions = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">With Indicators</h5>
            <Carousel indicators={true} id="carouselExampleControls" className="slide ">
                <CarouselItem className="active">
                    <img className="d-block img-fluid" src={small1} alt="First slide"/>
                    <div className="carousel-caption d-none d-md-block">
                        <h3 className="text-white">First slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small2} alt="Second slide"/>
                    <div className="carousel-caption d-none d-md-block">
                        <h3 className="text-white">Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small3} alt="Third slide"/>
                    <div className="carousel-caption d-none d-md-block">
                        <h3 className="text-white">Third slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </CarouselItem>
            </Carousel>
        </>
    )
}

const CrossFade = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Crossfade</h5>
            <Carousel indicators={false} id="carouselExampleFade" className="slide carousel-fade">
                <CarouselItem className="active">
                    <img className="d-block img-fluid" src={small1} alt="First slide"/>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small2} alt="Second slide"/>
                </CarouselItem>
                <CarouselItem>
                    <img className="d-block img-fluid" src={small3} alt="Third slide"/>
                </CarouselItem>
            </Carousel>
        </>
    )
}

const IndividualInterval = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Individual Interval</h5>
            <Carousel indicators={false} id="carouselExampleInterval" className="slide ">
                <CarouselItem className="active" data-bs-interval={1000}>
                    <img className="img-fluid d-block w-100" src={small1} alt="First slide"/>
                </CarouselItem>
                <CarouselItem data-bs-interval={2000}>
                    <img className="img-fluid d-block w-100" src={small2} alt="Second slide"/>
                </CarouselItem>
                <CarouselItem>
                    <img className="img-fluid d-block w-100" src={small3} alt="Third slide"/>
                </CarouselItem>
            </Carousel>
        </>
    )
}

const DarkVariant = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Dark Variant</h5>
            <Carousel id="carouselExampleDark" data-bs-theme="dark" className="carousel-dark slide">
                <CarouselItem className="active" data-bs-interval={1000}>
                    <img className="img-fluid" src={small8} alt="Images"/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first slide.</p>
                    </div>
                </CarouselItem>
                <CarouselItem data-bs-interval={2000}>
                    <img className="img-fluid" src={small9} alt="Images"/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Second slide label</h5>
                        <p>Some representative placeholder content for the second slide.</p>
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <img className="img-fluid" src={small10} alt="Images"/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Third slide label</h5>
                        <p>Some representative placeholder content for the third slide.</p>
                    </div>
                </CarouselItem>
            </Carousel>
        </>
    )
}

const CarouselPage = () => {
    return (
        <>
            <ComponentCard title="Carousel Variations" isCollapsible>
                <Row className="g-4">
                    <Col lg={6}>
                        <SlidesOnly/>
                    </Col>
                    <Col lg={6}>
                        <SlidesWithControls/>
                    </Col>
                    <Col lg={6}>
                        <SlidesWithIndicators/>
                    </Col>
                    <Col lg={6}>
                        <SlidesWithCaptions/>
                    </Col>
                    <Col lg={6}>
                        <CrossFade/>
                    </Col>
                    <Col lg={6}>
                        <IndividualInterval/>
                    </Col>
                    <Col lg={6}>
                        <DarkVariant/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default CarouselPage
