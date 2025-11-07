import ComponentCard from '@/components/ComponentCard'
import {Col, Row} from 'react-bootstrap'

const ResponsiveEmbedVideo219 = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Responsive embed video 21:9 </h5>
            <div className="ratio ratio-21x9">
                <iframe src="https://www.youtube.com/embed/TZe5UqlUg0c?rel=0"
                        title="7 Best AI Tools You NEED to Try in 2025" allowFullScreen/>
            </div>
        </>
    )
}

const ResponsiveEmbedVideo11 = () => {
    return (
        <>
            <div className="mt-4">
                <h5 className="mb-2 pb-1">Responsive embed video 1:1</h5>
                <div className="ratio ratio-1x1">
                    <iframe src="https://www.youtube.com/embed/TZe5UqlUg0c?rel=0"
                            title="7 Best AI Tools You NEED to Try in 2025" allowFullScreen/>
                </div>
            </div>
        </>
    )
}

const ResponsiveEmbedVideo169 = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Responsive embed video 16:9 </h5>
            <div className="ratio ratio-16x9">
                <iframe src="https://www.youtube.com/embed/TZe5UqlUg0c?rel=0"
                        title="7 Best AI Tools You NEED to Try in 2025" allowFullScreen/>
            </div>
        </>
    )
}

const ResponsiveEmbedVideo43 = () => {
    return (
        <>
            <div className="mt-4">
                <h5 className="mb-2 pb-1">Responsive embed video 4:3</h5>
                <div className="ratio ratio-4x3">
                    <iframe src="https://www.youtube.com/embed/TZe5UqlUg0c?rel=0"
                            title="7 Best AI Tools You NEED to Try in 2025" allowFullScreen/>
                </div>
            </div>
        </>
    )
}

const Video = () => {
    return (
        <>
            <ComponentCard title="Videos Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <ResponsiveEmbedVideo219/>
                        <ResponsiveEmbedVideo11/>
                    </Col>
                    <Col xl={6}>
                        <ResponsiveEmbedVideo169/>
                        <ResponsiveEmbedVideo43/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Video
