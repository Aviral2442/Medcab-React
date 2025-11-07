import ComponentCard from '@/components/ComponentCard'
import Spinner from '@/components/Spinner'
import {Col, Row} from 'react-bootstrap'

const colorVariants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']

const BorderedSpinners = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Border Spinner</h5>
            <Spinner className="m-2"/>
        </>
    )
}

const ColorsSpinners = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Colors</h5>
            {colorVariants.slice(0, 10).map((color, idx) => {
                return <Spinner key={idx} className="m-2" color={color}/>
            })}
        </>
    )
}

const AlignmentSpinner = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Alignment</h5>
            <div className="d-flex justify-content-center">
                <Spinner/>
            </div>
        </>
    )
}

const ButtonsSpinner = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Buttons Spinner</h5>
            <Row className="g-3">
                <Col lg={6}>
                    <div className="d-flex flex-wrap gap-2">
                        <button className="btn btn-primary btn-icon" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                            <span className="visually-hidden">Loading...</span>
                        </button>
                        <button className="btn btn-primary btn-icon rounded-circle" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                            <span className="visually-hidden">Loading...</span>
                        </button>
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                            <span className="visually-hidden">Loading...</span>
                        </button>
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"/>
                            Loading...
                        </button>
                    </div>
                </Col>
                <Col lg={6}>
                    <div className="d-flex flex-wrap gap-2">
                        <button className="btn btn-primary btn-icon" type="button" disabled>
                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/>
                            <span className="visually-hidden">Loading...</span>
                        </button>
                        <button className="btn btn-primary btn-icon rounded-circle" type="button" disabled>
                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/>
                            <span className="visually-hidden">Loading...</span>
                        </button>
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/>
                            <span className="visually-hidden">Loading...</span>
                        </button>
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-grow spinner-grow-sm me-2" role="status" aria-hidden="true"/>
                            Loading...
                        </button>
                    </div>
                </Col>
            </Row>
        </>
    )
}

const GrowingSpinners = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Growing Spinner</h5>
            <Spinner type="grow" className="m-2"/>
        </>
    )
}

const ColorGrowingSpinners = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Color Growing Spinner</h5>
            {colorVariants.slice(0, 10).map((color, idx) => {
                return <Spinner key={idx} className="m-2" type="grow" color={color}/>
            })}
        </>
    )
}

const SpinnersSizes = () => {
    const sizes: ('lg' | 'md' | 'sm')[] = ['lg', 'md', 'sm']
    return (
        <>
            <h5 className="mb-2 pb-1">Size</h5>
            <Row>
                {(sizes || []).map((size, idx) => {
                    return (
                        <Col lg={6} key={idx}>
                            <Spinner className="text-primary m-2" color="primary" size={size}/>
                            <Spinner color="secondary" className="text-secondary m-2" type="grow" size={size}/>
                        </Col>
                    )
                })}
                <Col lg={6}>
                    <Spinner className="spinner-border-sm m-2"></Spinner>
                    <Spinner type="grow" className="spinner-grow-sm m-2"></Spinner>
                </Col>
            </Row>
        </>
    )
}

const Spinners = () => {
    return (
        <>
            <ComponentCard title="Spinners Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <BorderedSpinners/>
                    </Col>
                    <Col xl={6}>
                        <ColorsSpinners/>
                    </Col>
                    <Col xl={6}>
                        <AlignmentSpinner/>
                    </Col>
                    <Col xl={6}>
                        <ButtonsSpinner/>
                    </Col>
                    <Col xl={6}>
                        <GrowingSpinners/>
                    </Col>
                    <Col xl={6}>
                        <ColorGrowingSpinners/>
                    </Col>
                    <Col xl={6}>
                        <SpinnersSizes/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Spinners
