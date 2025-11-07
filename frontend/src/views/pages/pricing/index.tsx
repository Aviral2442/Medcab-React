import {Card, CardBody, CardFooter, Col, Container, Row} from 'react-bootstrap'
import {LuCreditCard} from 'react-icons/lu'
import PageTitle from '@/components/PageTitle'
import {pricingPlans, type PricingPlanType} from '@/views/pages/pricing/data'
import {TbCheck, TbX} from 'react-icons/tb'

const PricingPlanCard = ({plan}: { plan: PricingPlanType }) => {
    return (
        <Card className="h-100 my-4 my-lg-0 rounded-4 position-relative">
            <CardBody className="rounded-top-4 px-lg-4 p-5 pb-2 text-center">
                <div className="text-center">
                    <h3 className="fw-bold mb-1">{plan.name}</h3>
                    <p className="text-muted mb-0">{plan.description}</p>
                </div>

                <div className="my-4">
                    <h1 className="display-6 fw-bold mb-0">{plan.price}</h1>
                    <small className="d-block text-muted fs-base">{plan.priceNote}</small>
                    <small className="d-block text-muted">{plan.usage}</small>
                </div>

                <ul className="list-unstyled text-start fs-sm mb-0">
                    {plan.features.map((item, index) => (
                        <li className="mb-2" key={index}>
                            {item.included ? <TbCheck className="text-success me-2"/> :
                                <TbX className="text-danger me-2"/>}
                            {item.label}
                        </li>
                    ))}
                </ul>
            </CardBody>

            <CardFooter className="bg-transparent rounded-bottom-4 px-5 py-4">
                <a href="" className={`btn btn-${plan.buttonVariant} w-100 py-2 fw-semibold rounded-pill`}>
                    {plan.buttonLabel}
                </a>
            </CardFooter>

            {plan.badge && (
                <span
                    className={`position-absolute top-0 start-50 translate-middle-x badge bg-${plan.badge.color} text-${plan.badge.textColor} rounded-pill px-3 py-1 mt-3`}>
          {plan.badge.text}
        </span>
            )}
        </Card>
    )
}

const Page = () => {
    return (
        <Container fluid>
            <PageTitle
                title="Simple, Transparent Pricing"
                subtitle="Choose a plan that fits your needs. Scalable options for individuals, teams, and enterprises with no hidden fees."
                badge={{
                    title: 'Flexible Plans',
                    icon: LuCreditCard,
                }}
            />

            <Row className="mb-4">
                {pricingPlans.map((plan, idx) => (
                    <Col xl={3} md={6} key={idx}>
                        <PricingPlanCard plan={plan}/>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Page
