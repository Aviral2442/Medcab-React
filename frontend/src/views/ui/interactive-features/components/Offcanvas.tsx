import ComponentCard from '@/components/ComponentCard'
import useToggle from '@/hooks/useToggle'
import {Button, Col, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Row} from 'react-bootstrap'
import {type BackdropOption, backdropOptions, type PlacementOption, placementOptions} from '../data'

const DefaultOffcanvas = () => {
    const {isTrue, toggle} = useToggle()
    return (
        <>
            <h5 className="mb-2 pb-1">Offcanvas </h5>
            <div className="d-flex flex-wrap gap-2">
                <Button variant="primary" onClick={toggle} data-bs-toggle="offcanvas" href="#offcanvasExample"
                        role="button" aria-controls="offcanvasExample">
                    Link with href
                </Button>
            </div>
            <Offcanvas
                show={isTrue}
                onHide={toggle}
                className="offcanvas-start"
                tabIndex={-1}
                id="offcanvasExample"
                aria-labelledby="offcanvasExampleLabel">
                <OffcanvasHeader closeButton>
                    <OffcanvasTitle as={'h5'} id="offcanvasExampleLabel">
                        Offcanvas
                    </OffcanvasTitle>
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div>Some text as placeholder. In real life you can have the elements you have chosen. Like, text,
                        images, lists, etc.
                    </div>
                    <h5 className="mt-3">List</h5>
                    <ul className="ps-3">
                        <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                        <li>Neque porro quisquam est, qui dolorem</li>
                        <li>Quis autem vel eum iure qui in ea</li>
                    </ul>
                    <ul className="ps-3">
                        <li>At vero eos et accusamus et iusto odio dignissimos</li>
                        <li>Et harum quidem rerum facilis</li>
                        <li>Temporibus autem quibusdam et aut officiis</li>
                    </ul>
                </OffcanvasBody>
            </Offcanvas>
        </>
    )
}

const OffcanvasBackdrop = () => {
    const OffCanvasWithBackdrop = ({name, ...props}: BackdropOption) => {
        const {isTrue, toggle} = useToggle()
        return (
            <>
                <Button onClick={toggle} className="mt-2 me-1 mt-md-0">
                    {name}
                </Button>
                &nbsp;
                <Offcanvas placement="start" show={isTrue} onHide={toggle} {...props}>
                    <OffcanvasHeader closeButton>
                        <OffcanvasTitle as="h5" className="mt-0" id="offcanvasScrollingLabel">
                            {name}
                        </OffcanvasTitle>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <div>Some text as placeholder. In real life you can have the elements you have chosen. Like,
                            text, images, lists, etc.
                        </div>
                        <h5 className="mt-3">List</h5>
                        <ul className="ps-3">
                            <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                            <li>Neque porro quisquam est, qui dolorem</li>
                            <li>Quis autem vel eum iure qui in ea</li>
                        </ul>
                        <ul className="ps-3">
                            <li>At vero eos et accusamus et iusto odio dignissimos</li>
                            <li>Et harum quidem rerum facilis</li>
                            <li>Temporibus autem quibusdam et aut officiis</li>
                        </ul>
                    </OffcanvasBody>
                </Offcanvas>
            </>
        )
    }
    return (
        <>
            <h5 className="mb-2 pb-1">Offcanvas Backdrop </h5>
            {backdropOptions.map((offcanvas, idx) => (
                <OffCanvasWithBackdrop {...offcanvas} key={idx}/>
            ))}
        </>
    )
}

const OffcanvasPlacement = () => {
    const OffcanvasPlacement = ({name, ...props}: PlacementOption) => {
        const {isTrue, toggle} = useToggle()
        return (
            <>
                <Button onClick={toggle} className="mt-2 mt-md-0">
                    Toggle {name} offcanvas
                </Button>
                <Offcanvas show={isTrue} onHide={toggle} {...props}>
                    <OffcanvasHeader closeButton>
                        <OffcanvasTitle as={'h5'} className="mt-0">
                            Offcanvas {name}
                        </OffcanvasTitle>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <div>Some text as placeholder. In real life you can have the elements you have chosen. Like,
                            text, images, lists, etc.
                        </div>
                        <h5 className="mt-3">List</h5>
                        <ul className="ps-3">
                            <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                            <li>Neque porro quisquam est, qui dolorem</li>
                            <li>Quis autem vel eum iure qui in ea</li>
                        </ul>
                    </OffcanvasBody>
                </Offcanvas>
            </>
        )
    }
    return (
        <>
            <h5 className="mb-2 pb-1">Offcanvas Placement</h5>
            <div>
                <div className="d-flex flex-wrap gap-2">
                    {placementOptions.map((props, idx) => (
                        <OffcanvasPlacement {...props} key={idx}/>
                    ))}
                </div>
            </div>
        </>
    )
}

const DarkOffcanvas = () => {
    const {isTrue, toggle} = useToggle()
    return (
        <>
            <h5 className="mb-2 pb-1">Dark Offcanvas</h5>
            <Button
                variant="primary"
                onClick={toggle}
                className="mt-2 mt-md-0"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasDark"
                aria-controls="offcanvasDark">
                Dark offcanvas
            </Button>
            <Offcanvas
                show={isTrue}
                onHide={toggle}
                className="offcanvas-start text-bg-dark"
                tabIndex={-1}
                id="offcanvasDark"
                aria-labelledby="offcanvasDarkLabel">
                <OffcanvasHeader>
                    <h5 id="offcanvasDarkLabel">Dark Offcanvas</h5>
                    <Button className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"/>
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div>Some text as placeholder. In real life you can have the elements you have chosen. Like, text,
                        images, lists, etc.
                    </div>
                    <h5 className="mt-3">List</h5>
                    <ul className="ps-3">
                        <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                        <li>Neque porro quisquam est, qui dolorem</li>
                        <li>Quis autem vel eum iure qui in ea</li>
                    </ul>
                </OffcanvasBody>
            </Offcanvas>
        </>
    )
}

const OffcanvasPage = () => {
    return (
        <>
            <ComponentCard title="Offcanvas Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <DefaultOffcanvas/>
                    </Col>
                    <Col xl={6}>
                        <OffcanvasBackdrop/>
                    </Col>
                    <Col xl={6}>
                        <OffcanvasPlacement/>
                    </Col>
                    <Col xl={6}>
                        <DarkOffcanvas/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default OffcanvasPage
