import ComponentCard from '@/components/ComponentCard'
import {Button, Col, ProgressBar, Row} from 'react-bootstrap'

const Example = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Examples </h5>
            <ProgressBar className="mb-2" now={0}/>
            <ProgressBar className="mb-2" now={25}/>
            <ProgressBar className="mb-2" now={50}/>
            <ProgressBar className="mb-2" now={75}/>
            <ProgressBar className="progress" now={100}/>
        </>
    )
}

const HeightProgressBar = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Height </h5>
            <ProgressBar now={25} variant="danger" className="mb-2" style={{height: 1}}/>
            <ProgressBar now={25} variant="primary" className="mb-2" style={{height: 3}}/>
            <ProgressBar now={25} variant="success" className="mb-2 progress-sm"/>
            <ProgressBar now={50} variant="info" className="mb-2 progress-md"/>
            <ProgressBar now={75} variant="warning" className="progress-lg mb-2"/>
            <ProgressBar now={38} variant="success" className="progress-xl"/>
        </>
    )
}

const MultipleBars = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Multiple Bars </h5>
            <ProgressBar className="progress">
                <ProgressBar now={15}></ProgressBar>
                <ProgressBar now={30} variant="success" className="bg-success"/>
                <ProgressBar now={20} variant="info" className="bg-info"/>
            </ProgressBar>
        </>
    )
}

const AnimatedStripes = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Animated stripes </h5>
            <ProgressBar now={75} animated className="progress"/>
        </>
    )
}

const LabelsBar = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Labels </h5>
            <ProgressBar now={25} className="mb-3" label="25%"/>
            <ProgressBar now={10} className="text-dark overflow-visible"
                         label="Long label text for the progress bar, set to a dark color"/>
        </>
    )
}

const BackgroundBar = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Backgrounds </h5>
            <ProgressBar now={25} variant="success" className="mb-2"/>
            <ProgressBar now={50} variant="info" className="mb-2"/>
            <ProgressBar now={75} variant="warning" className="mb-2"/>
            <ProgressBar now={100} variant="danger" className="mb-2"/>
            <ProgressBar now={65} variant="dark" className="mb-2"/>
            <ProgressBar now={50} variant="secondary"/>
        </>
    )
}

const StripedBar = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Striped </h5>
            <ProgressBar now={10} striped className="mb-2"/>
            <ProgressBar now={25} striped variant="success" className="mb-2"/>
            <ProgressBar now={50} striped variant="info" className="mb-2"/>
            <ProgressBar now={75} striped variant="warning" className="mb-2"/>
            <ProgressBar now={100} striped variant="danger" className="mb-2"/>
        </>
    )
}

const StepsProgressBar = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Steps </h5>
            <div className="position-relative m-4">
                <ProgressBar now={50} style={{height: 2}} className="bg-light"/>
                <Button variant="primary"
                        className="position-absolute top-0 start-0 translate-middle btn-icon rounded-pill">
                    1
                </Button>
                <Button variant="primary"
                        className="position-absolute top-0 start-50 translate-middle btn-icon rounded-pill">
                    2
                </Button>
                <Button variant="light"
                        className="position-absolute top-0 start-100 translate-middle btn-icon rounded-pill">
                    3
                </Button>
            </div>
        </>
    )
}

const Progress = () => {
    return (
        <>
            <ComponentCard title="Progress Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <Example/>
                    </Col>
                    <Col xl={6}>
                        <HeightProgressBar/>
                    </Col>
                    <Col xl={6}>
                        <MultipleBars/>
                    </Col>
                    <Col xl={6}>
                        <AnimatedStripes/>
                    </Col>
                    <Col xl={6}>
                        <LabelsBar/>
                    </Col>
                    <Col xl={6}>
                        <BackgroundBar/>
                    </Col>
                    <Col xl={6}>
                        <StripedBar/>
                    </Col>
                    <Col xl={6}>
                        <StepsProgressBar/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Progress
