import small3 from '@/assets/images/stock/small-3.jpg'
import small4 from '@/assets/images/stock/small-4.jpg'
import small5 from '@/assets/images/stock/small-5.jpg'
import small6 from '@/assets/images/stock/small-6.jpg'
import ComponentCard from '@/components/ComponentCard'
import {Link} from 'react-router'
import {Card, CardBody, CardFooter, CardGroup, CardHeader, CardText, CardTitle, Col, Row} from 'react-bootstrap'

type CardGroupType = {
    id: number
    title: string
    text: string
    subtext: string
}

const Basic = () => {
    return (
        <>
            <Card>
                <CardBody>
                    <CardText>
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                        Some quick example text to build on the
                        card title and make up.
                    </CardText>
                    <Link to="" className="btn btn-sm btn-primary">
                        Button
                    </Link>
                </CardBody>
            </Card>
        </>
    )
}

const BasicCardWithTitle = () => {
    return (
        <Card>
            <CardBody>
                <CardTitle as={'h5'} className="mb-2">
                    Basic Card with Title
                </CardTitle>
                <CardText>
                    Some quick example text to build on the card title and make up the bulk of the card's content. Some
                    quick example text to build on the card
                    title and make up.
                </CardText>
                <Link to="" className="btn btn-sm btn-primary">
                    Button
                </Link>
            </CardBody>
        </Card>
    )
}

const CardWithBackgroundColor = () => {
    return (
        <Card className="text-bg-primary border-0">
            <CardBody>
                <CardTitle as={'h5'} className="mb-2">
                    Card with Background Color
                </CardTitle>
                <CardText>
                    Some quick example text to build on the card title and make up the bulk of the card's content. Some
                    quick example text to build on the card
                    title and make up.
                </CardText>
                <Link to="" className="btn btn-sm btn-light">
                    Button
                </Link>
            </CardBody>
        </Card>
    )
}

const CardWithBackgroundGradient = () => {
    return (
        <Card className="card text-bg-secondary bg-gradient border-0">
            <CardBody>
                <CardTitle as={'h5'} className="mb-2">
                    Card with Background Color + Gradient
                </CardTitle>
                <CardText>
                    Some quick example text to build on the card title and make up the bulk of the card's content. Some
                    quick example text to build on the card
                    title and make up.
                </CardText>
                <Link to="" className="btn btn-sm btn-light">
                    Button
                </Link>
            </CardBody>
        </Card>
    )
}

const CardWithHeader = () => {
    return (
        <ComponentCard title="Card with Header">
            <CardTitle as={'h5'} className="mb-2">
                Special title treatment
            </CardTitle>
            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
            <Link to="" className="btn btn-sm btn-primary">
                Go somewhere
            </Link>
        </ComponentCard>
    )
}

const CardWithSubHeader = () => {
    return (
        <Card>
            <CardHeader className="d-block">
                <CardTitle as={'h5'} className="mb-1">
                    Card with Sub Header
                </CardTitle>
                <h6 className="card-subtitle text-body-secondary">Card subtitle</h6>
            </CardHeader>
            <CardBody>
                <blockquote className="card-bodyquote mb-0">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                    <footer className="mb-0">
                        Someone famous in <cite title="Source Title">Source Title</cite>
                    </footer>
                </blockquote>
            </CardBody>
        </Card>
    )
}

const FeaturedCardTitle = () => {
    return (
        <Card>
            <CardHeader className="bg-light-subtle">Featured Card Title</CardHeader>
            <CardBody>
                <Link to="" className="btn btn-sm btn-primary">
                    Go somewhere
                </Link>
            </CardBody>
            <CardFooter className="border-top border-light text-muted">2 days ago</CardFooter>
        </Card>
    )
}

const CardWithActionTools = () => {
    return (
        <ComponentCard title="Card with Action Tools">
            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
            <Link to="" className="btn btn-sm btn-primary">
                Go somewhere
            </Link>
        </ComponentCard>
    )
}

const CardWithActionToolsBgColor = () => {
    return (
        <Card className="text-bg-primary border-0">
            <CardHeader>
                <CardTitle as={'h5'}>Card with Action Tools &amp; Background Colors</CardTitle>
            </CardHeader>
            <CardBody>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <Link to="" className="btn btn-sm btn-light">
                    Go somewhere
                </Link>
            </CardBody>
        </Card>
    )
}

const CardWithColoredBorder = () => {
    return (
        <Card>
            <CardBody className="border-primary">
                <CardTitle as={'h5'} className="mb-2">
                    Card with Colored Border
                </CardTitle>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <Link to="" className="btn btn-primary btn-sm">
                    Button
                </Link>
            </CardBody>
        </Card>
    )
}

const CardWithSimpleBorder = () => {
    return (
        <Card className="border-primary border border-dashed">
            <CardBody>
                <CardTitle as={'h5'} className="mb-2">
                    Card with Simple Border
                </CardTitle>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <Link to="" className="btn btn-primary btn-sm">
                    Button
                </Link>
            </CardBody>
        </Card>
    )
}

const CardWithDoubleBorder = () => {
    return (
        <Card className="border-primary border-2">
            <CardBody>
                <CardTitle as={'h5'} className="mb-2 text-primary">
                    Card with Double Border
                </CardTitle>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <Link to="" className="btn btn-primary btn-sm">
                    Button
                </Link>
            </CardBody>
        </Card>
    )
}

const CardWithStretchedLink = () => {
    return (
        <Card>
            <img src={small3} className="card-img-top img-fluid" alt="..." width={343} height={214}/>
            <CardBody>
                <CardTitle as={'h5'} className="mb-2">
                    Card with stretched link
                </CardTitle>
                <Link to="#" className="btn btn-primary mt-2 stretched-link">
                    Go somewhere
                </Link>
            </CardBody>
        </Card>
    )
}

const CardWithStretchedLink2 = () => {
    return (
        <Card>
            <img src={small4} className="card-img-top img-fluid" alt="..." width={343} height={214}/>
            <CardBody>
                <CardTitle as={'h5'} className="mb-2">
                    <Link to="#" className="text-primary stretched-link">
                        Card with stretched link
                    </Link>
                </CardTitle>
                <CardText>Some quick example text to build on the card up the bulk of the card's content.</CardText>
            </CardBody>
        </Card>
    )
}

const CardWithStretchedLink3 = () => {
    return (
        <Card>
            <img src={small5} className="card-img-top img-fluid" alt="..." width={343} height={214}/>
            <CardBody>
                <CardTitle as={'h5'} className="mb-2">
                    Card with stretched link
                </CardTitle>
                <Link to="#" className="btn btn-primary mt-2 stretched-link">
                    Go somewhere
                </Link>
            </CardBody>
        </Card>
    )
}

const CardWithStretchedLink4 = () => {
    return (
        <Card>
            <img src={small6} className="card-img-top img-fluid" alt="..." width={343} height={214}/>
            <CardBody>
                <CardTitle as={'h5'} className="mb-2">
                    <Link to="#" className="text-primary stretched-link">
                        Card with stretched link
                    </Link>
                </CardTitle>
                <CardText>Some quick example text to build on the card up the bulk of the card's content.</CardText>
            </CardBody>
        </Card>
    )
}

const CardTitle4 = ({item}: { item: CardGroupType }) => {
    return (
        <Card>
            <CardBody>
                <CardTitle className="mb-2" as={'h5'}>
                    {item.title}
                </CardTitle>
                <CardText>{item.text}</CardText>
            </CardBody>
            <CardFooter>
                <span className="text-body-secondary">{item.subtext}</span>
            </CardFooter>
        </Card>
    )
}

const Cards = () => {
    const CardGroupDetails: CardGroupType[] = [
        {
            id: 1,
            title: 'Card title',
            text: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            subtext: 'Last updated 3 mins ago',
        },
        {
            id: 2,
            title: 'Card title',
            text: 'This card has supporting text below as a natural lead-in to additional content.',
            subtext: 'Last updated 3 mins ago',
        },
        {
            id: 3,
            title: 'Card title',
            text: 'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.',
            subtext: 'Last updated 3 mins ago',
        },
    ]
    return (
        <>
            <ComponentCard title="Cards Variations" isCollapsible>
                <Row className="g-4">
                    <Col sm={6} lg={3}>
                        <Basic/>
                    </Col>
                    <Col sm={6} lg={3}>
                        <BasicCardWithTitle/>
                    </Col>
                    <Col sm={6} lg={3}>
                        <CardWithBackgroundColor/>
                    </Col>
                    <Col sm={6} lg={3}>
                        <CardWithBackgroundGradient/>
                    </Col>
                </Row>
                <Row className="g-4">
                    <Col md={4}>
                        <CardWithHeader/>
                    </Col>
                    <Col md={4}>
                        <CardWithSubHeader/>
                    </Col>
                    <Col md={4}>
                        <FeaturedCardTitle/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h5 className="mb-2 pb-1">Advanced Card</h5>
                    </Col>
                </Row>
                <Row className="g-4">
                    <Col md={4}>
                        <CardWithActionTools/>
                    </Col>
                    <Col md={4}>
                        <CardWithActionToolsBgColor/>
                    </Col>
                    <Col md={4}>
                        <CardWithActionTools/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h5 className="mb-2 pb-1">Bordered Card</h5>
                    </Col>
                </Row>
                <Row className="g-4">
                    <Col md={4}>
                        <CardWithColoredBorder/>
                    </Col>
                    <Col md={4}>
                        <CardWithSimpleBorder/>
                    </Col>
                    <Col md={4}>
                        <CardWithDoubleBorder/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h5 className="mb-2 pb-1">Stretched Link</h5>
                    </Col>
                </Row>
                <Row className="g-4">
                    <Col sm={6} lg={3}>
                        <CardWithStretchedLink/>
                    </Col>
                    <Col sm={6} lg={3}>
                        <CardWithStretchedLink2/>
                    </Col>
                    <Col sm={6} lg={3}>
                        <CardWithStretchedLink3/>
                    </Col>
                    <Col sm={6} lg={3}>
                        <CardWithStretchedLink4/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h5 className="mb-2 pb=1">Card Group</h5>
                    </Col>
                </Row>
                <CardGroup className="mb-3">
                    {CardGroupDetails.map((item, idx) => (
                        <CardTitle4 item={item} key={idx}/>
                    ))}
                </CardGroup>
            </ComponentCard>
        </>
    )
}

export default Cards
