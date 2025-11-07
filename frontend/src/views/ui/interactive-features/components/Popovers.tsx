import ComponentCard from '@/components/ComponentCard'
import {Button, Col, type OverlayProps, OverlayTrigger, Popover, PopoverBody, PopoverHeader, Row} from 'react-bootstrap'

interface PopoverDirection {
    placement: OverlayProps['placement']
}

const SimplePopover = () => {
    const basicPopover = (
        <Popover id="popover-basic">
            <PopoverHeader as="h3">Need Help?</PopoverHeader>
            <PopoverBody>Click here to get support from our team. We're here 24/7 to assist you.</PopoverBody>
        </Popover>
    )
    return (
        <>
            <h5 className="mb-2 pb-1">Simple Popover</h5>
            <OverlayTrigger trigger={'click'} placement="right" overlay={basicPopover}>
                <Button
                    variant="primary"
                    data-bs-toggle="popover"
                    title="Popover title"
                    data-bs-content="Click here to get support from our team. We're here 24/7 to assist you.">
                    Get Support Info
                </Button>
            </OverlayTrigger>
        </>
    )
}

const DismissOnPopover = () => {
    const dismissiblePopover = (
        <Popover>
            <PopoverHeader as="h3">Dismissible popover</PopoverHeader>
            <PopoverBody>And here&apos;s some amazing content. It&apos;s very engaging. Right?</PopoverBody>
        </Popover>
    )
    return (
        <>
            <h5 className="mb-2 pb-1">Dismiss on Next Click </h5>
            <OverlayTrigger trigger="focus" placement="right" overlay={dismissiblePopover}>
                <Button
                    variant="primary"
                    tabIndex={0}
                    data-bs-toggle="popover"
                    data-bs-trigger="focus"
                    data-bs-content="Get quick tips and tricks to improve your workflow instantly."
                    title="Quick Tips">
                    Show Tips
                </Button>
            </OverlayTrigger>
        </>
    )
}

const HoverPopovers = () => {
    const hoverPopover = (
        <Popover>
            <PopoverHeader as="h3">Ohh Wow !</PopoverHeader>
            <PopoverBody>And here&apos;s some amazing content. It&apos;s very engaging. Right?</PopoverBody>
        </Popover>
    )
    return (
        <>
            <h5 className="mb-2 pb-1">Hover</h5>
            <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={hoverPopover}>
                <Button
                    variant="dark"
                    tabIndex={0}
                    data-bs-toggle="popover"
                    data-bs-trigger="hover"
                    data-bs-content="And here's some amazing content. It's very engaging. Right?"
                    title="Ohh Wow !">
                    Please Hover Me
                </Button>
            </OverlayTrigger>
        </>
    )
}

const FourDirections = () => {
    const directions: PopoverDirection[] = [{placement: 'top'}, {placement: 'bottom'}, {placement: 'right'}, {placement: 'left'}]
    return (
        <>
            <h5 className="mb-2 pb-1">Four Directions</h5>
            <div className="d-flex flex-wrap gap-2">
                {(directions || []).map((direction, idx) => (
                    <OverlayTrigger
                        trigger="click"
                        key={idx}
                        placement={direction.placement}
                        overlay={
                            <Popover id={`popover-positioned-${direction.placement}`}>
                                <PopoverBody>This popover appears above the button. Great for tips or
                                    info.</PopoverBody>
                            </Popover>
                        }>
                        <Button variant="primary">Popover on {direction.placement}</Button>
                    </OverlayTrigger>
                ))}
            </div>
        </>
    )
}

const CustomPopovers = () => {
    const customPopover = (variant: string) => (
        <Popover className={`popover-${variant}`}>
            <PopoverHeader as="h3">Primary Popover</PopoverHeader>
            <PopoverBody>This popover is themed via CSS variables.</PopoverBody>
        </Popover>
    )

    return (
        <>
            <h5 className="mb-2 pb-1">Custom Popovers </h5>
            <div className="d-flex flex-wrap gap-2">
                <OverlayTrigger trigger="click" placement="right" overlay={customPopover('primary')}>
                    <Button variant="primary">Primary popover</Button>
                </OverlayTrigger>
                <OverlayTrigger trigger="click" placement="right" overlay={customPopover('success')}>
                    <Button variant="success">Success popover</Button>
                </OverlayTrigger>
                <OverlayTrigger trigger="click" placement="right" overlay={customPopover('danger')}>
                    <Button variant="danger">Danger popover</Button>
                </OverlayTrigger>
                <OverlayTrigger trigger="click" placement="right" overlay={customPopover('info')}>
                    <Button variant="info">Info popover</Button>
                </OverlayTrigger>
                <OverlayTrigger trigger="click" placement="right" overlay={customPopover('dark')}>
                    <Button variant="dark">Dark popover</Button>
                </OverlayTrigger>
                <OverlayTrigger trigger="click" placement="right" overlay={customPopover('secondary')}>
                    <Button variant="secondary">Secondary popover</Button>
                </OverlayTrigger>
            </div>
        </>
    )
}

const DisabledPopover = () => {
    const disabledPopover = (
        <Popover>
            <PopoverBody>This button is disabled, but the popover still works.</PopoverBody>
        </Popover>
    )
    return (
        <>
            <h5 className="mb-2 pb-1">Disabled Elements</h5>
            <OverlayTrigger placement="top" overlay={disabledPopover}>
        <span className="d-inline-block">
          <Button disabled style={{pointerEvents: 'none'}}>
            Disabled Button
          </Button>
        </span>
            </OverlayTrigger>
        </>
    )
}

const Popovers = () => {
    return (
        <>
            <ComponentCard title="Popovers Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <SimplePopover/>
                    </Col>
                    <Col xl={6}>
                        <DismissOnPopover/>
                    </Col>
                    <Col xl={6}>
                        <HoverPopovers/>
                    </Col>
                    <Col xl={6}>
                        <FourDirections/>
                    </Col>
                    <Col xl={6}>
                        <CustomPopovers/>
                    </Col>
                    <Col xl={6}>
                        <DisabledPopover/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Popovers
