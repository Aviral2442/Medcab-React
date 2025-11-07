import ComponentCard from '@/components/ComponentCard'
import useModal from '@/hooks/useModal'
import useToggle from '@/hooks/useToggle'
import {useState} from 'react'
import {
    Button,
    Col,
    Form,
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    Row
} from 'react-bootstrap'

const BootstrapModals = () => {
    const {isTrue: isStandardOpen, toggle: toggleStandard} = useToggle()
    const {
        isOpen,
        size,
        className,
        scroll,
        toggleModal,
        openModalWithSize,
        openModalWithClass,
        openModalWithScroll
    } = useModal()
    return (
        <>
            <h5 className="mb-2 pb-1">Bootstrap Modals </h5>
            <div className="d-flex flex-wrap gap-2">
                <Button variant="primary" onClick={toggleStandard}>
                    Standard Modal
                </Button>
                <Button variant="primary" onClick={() => openModalWithSize('lg')}>
                    Large Modal
                </Button>
                <Button variant="primary" onClick={() => openModalWithSize('sm')}>
                    Small Modal
                </Button>
                <Button variant="primary" onClick={() => openModalWithClass('modal-full-width')}>
                    Full Width Modal
                </Button>
                <Button variant="primary" onClick={openModalWithScroll}>
                    Scrollable Modal
                </Button>
            </div>
            <Modal show={isStandardOpen} onHide={toggleStandard}>
                <ModalHeader onHide={toggleStandard} closeButton>
                    <ModalTitle as="h4">Modal Heading</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <h5>Text in a modal</h5>
                    <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                    <hr/>
                    <h5>Overflowing text to show scroll behavior</h5>
                    <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
                        egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.
                    </p>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel
                        augue laoreet rutrum faucibus dolor auctor.
                    </p>
                    <p className="mb-0">
                        Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque
                        nisl consectetur et. Donec sed odio dui.
                        Donec ullamcorper nulla non metus auctor fringilla.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onClick={toggleStandard}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={toggleStandard}>
                        Save changes
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal className="fade" show={isOpen} onHide={toggleModal} dialogClassName={className} size={size}
                   scrollable={scroll}>
                <ModalHeader onHide={toggleModal} closeButton>
                    <ModalTitle as={'h4'}>Large Model</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    ...
                    {scroll && (
                        <>
                            <p>
                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                in, egestas eget quam. Morbi leo risus, porta
                                ac consectetur ac, vestibulum at eros.
                            </p>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                lacus vel augue laoreet rutrum faucibus dolor
                                auctor.
                            </p>
                            <p>
                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                in, egestas eget quam. Morbi leo risus, porta
                                ac consectetur ac, vestibulum at eros.
                            </p>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                lacus vel augue laoreet rutrum faucibus dolor
                                auctor.
                            </p>
                            <p>
                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                scelerisque nisl consectetur et. Donec sed odio dui.
                                Donec ullamcorper nulla non metus auctor fringilla.
                            </p>
                            <p>
                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                in, egestas eget quam. Morbi leo risus, porta
                                ac consectetur ac, vestibulum at eros.
                            </p>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                lacus vel augue laoreet rutrum faucibus dolor
                                auctor.
                            </p>
                            <p>
                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                scelerisque nisl consectetur et. Donec sed odio dui.
                                Donec ullamcorper nulla non metus auctor fringilla.
                            </p>
                            <p>
                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                in, egestas eget quam. Morbi leo risus, porta
                                ac consectetur ac, vestibulum at eros.
                            </p>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                lacus vel augue laoreet rutrum faucibus dolor
                                auctor.
                            </p>
                            <p>
                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                scelerisque nisl consectetur et. Donec sed odio dui.
                                Donec ullamcorper nulla non metus auctor fringilla.
                            </p>
                            <p>
                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                in, egestas eget quam. Morbi leo risus, porta
                                ac consectetur ac, vestibulum at eros.
                            </p>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                lacus vel augue laoreet rutrum faucibus dolor
                                auctor.
                            </p>
                            <p>
                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                scelerisque nisl consectetur et. Donec sed odio dui.
                                Donec ullamcorper nulla non metus auctor fringilla.
                            </p>
                            <p>
                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                in, egestas eget quam. Morbi leo risus, porta
                                ac consectetur ac, vestibulum at eros.
                            </p>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                lacus vel augue laoreet rutrum faucibus dolor
                                auctor.
                            </p>
                            <p>
                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                scelerisque nisl consectetur et. Donec sed odio dui.
                                Donec ullamcorper nulla non metus auctor fringilla.
                            </p>
                            <p>
                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                in, egestas eget quam. Morbi leo risus, porta
                                ac consectetur ac, vestibulum at eros.
                            </p>
                        </>
                    )}
                </ModalBody>
                {scroll && (
                    <ModalFooter>
                        <Button variant="light" onClick={toggleModal}>
                            Close
                        </Button>
                        <Button onClick={toggleModal}>Save changes</Button>
                    </ModalFooter>
                )}
            </Modal>
        </>
    )
}

const ModalPositions = () => {
    const {isOpen, className, toggleModal, openModalWithClass} = useModal()
    return (
        <>
            <h5 className="mb-2 pb-1">Modal Position </h5>
            <div className="d-flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => openModalWithClass('modal-top')}>
                    Top Modal
                </Button>
                <Button variant="primary" onClick={() => openModalWithClass('modal-bottom')}>
                    Bottom Modal
                </Button>
                <Button variant="primary" onClick={() => openModalWithClass('modal-dialog-centered')}>
                    Center modal
                </Button>
            </div>
            <Modal show={isOpen} onHide={toggleModal} dialogClassName={className}>
                {className != 'modal-right' && (
                    <ModalHeader onHide={toggleModal} closeButton>
                        <ModalTitle as={'h4'}>Modal Heading</ModalTitle>
                    </ModalHeader>
                )}
                <ModalBody>
                    {className === 'modal-right' ? (
                        <div className="text-center">
                            <h4 className="mt-0">Text in a modal</h4>
                            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                            <Button variant="danger" type="button" size="sm" onClick={toggleModal}
                                    data-bs-dismiss="modal">
                                Close
                            </Button>
                        </div>
                    ) : (
                        <>
                            <h5>Text in a modal</h5>
                            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                        </>
                    )}
                </ModalBody>
                {className != 'modal-right' && (
                    <ModalFooter>
                        <Button variant="light" onClick={toggleModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={toggleModal}>
                            Save changes
                        </Button>
                    </ModalFooter>
                )}
            </Modal>
        </>
    )
}

const MultipleModal = () => {
    const {isTrue: isOpen, toggle: toggleModal} = useToggle()
    const {isTrue: isNextOpen, toggle: toggleNextModal} = useToggle()
    return (
        <>
            <h5 className="mb-2 pb-1">Multiple Modal </h5>
            <Modal show={isOpen} onHide={toggleModal}>
                <ModalHeader closeButton>
                    <ModalTitle as={'h4'} id="multiple-oneModalLabel">
                        Modal Heading
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <h5 className="mt-0">Text in a modal</h5>
                    <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="primary"
                        onClick={() => {
                            toggleModal()
                            toggleNextModal()
                        }}>
                        Next
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal className="fade" show={isNextOpen} onHide={toggleNextModal}>
                <ModalHeader closeButton>
                    <ModalTitle as={'h4'} id="multiple-twoModalLabel">
                        Modal Heading
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <h5 className="mt-0">Text in a modal</h5>
                    <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={toggleNextModal}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
            <div className="d-flex flex-wrap gap-2">
                <Button variant="primary" onClick={toggleModal}>
                    Multiple Modal
                </Button>
            </div>
        </>
    )
}

const ToggleBetweenModals = () => {
    const {isTrue: isOpen, toggle: toggleModal} = useToggle()
    const {isTrue: isNextOpen, toggle: toggleNextModal} = useToggle()
    return (
        <>
            <h5 className="mb-2 pb-1">Toggle Between Modals </h5>
            <Modal className="fade" show={isOpen} onHide={toggleModal} centered>
                <ModalHeader closeButton>
                    <ModalTitle as={'h5'}>Modal 1</ModalTitle>
                </ModalHeader>
                <ModalBody>Show a second modal and hide this one with the button below.</ModalBody>
                <ModalFooter>
                    <Button
                        variant="primary"
                        onClick={() => {
                            toggleModal()
                            toggleNextModal()
                        }}>
                        Open second modal
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal className="fade" show={isNextOpen} onHide={toggleNextModal} centered>
                <ModalHeader closeButton>
                    <ModalTitle as={'h5'}>Modal 2</ModalTitle>
                </ModalHeader>
                <ModalBody>Hide this modal and show the first with the button below.</ModalBody>
                <ModalFooter>
                    <Button
                        variant="primary"
                        onClick={() => {
                            toggleModal()
                            toggleNextModal()
                        }}>
                        Back to first
                    </Button>
                </ModalFooter>
            </Modal>
            <Button variant="primary" onClick={toggleModal}>
                Open First Modal
            </Button>
        </>
    )
}

const FullscreenModal = () => {
    const sizes: string[] = ['sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down']
    const [fullscreen, setFullscreen] = useState<undefined | string>(undefined)
    const [show, setShow] = useState(false)
    const handleShow = (breakpoint: string) => {
        setFullscreen(breakpoint)
        setShow(true)
    }
    return (
        <>
            <h5 className="mb-2 pb-1">Fullscreen Modal </h5>
            <div className="d-flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => setShow(true)}>
                    Fullscreen Modal
                </Button>
                {(sizes || []).map((size, idx) => (
                    <Button key={idx} onClick={() => handleShow(size)}>
                        Full Screen
                        {typeof size === 'string' && ` Below ${size.split('-')[0]}`}
                    </Button>
                ))}
            </div>
            <Modal show={show} fullscreen={fullscreen ?? true} onHide={() => setShow(false)}>
                <ModalHeader closeButton>
                    <ModalTitle>Modal</ModalTitle>
                </ModalHeader>
                <ModalBody>...</ModalBody>
                <ModalFooter>
                    <Button variant="light" className="waves-effect" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => setShow(false)}>
                        Save Changes
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

const StaticBackdropModal = () => {
    const {isTrue: isOpen, toggle: toggleModal} = useToggle()
    return (
        <>
            <h5 className="mb-2 pb-1">Static Backdrop </h5>
            <div className="d-flex flex-wrap gap-2">
                <Button variant="primary" onClick={toggleModal}>
                    Static Backdrop
                </Button>
            </div>
            <Modal className="fade" show={isOpen} onHide={toggleModal} backdrop="static" keyboard={false}>
                <ModalHeader closeButton>
                    <ModalTitle as="h5">Modal title</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <p className="m-0">I will not close if you click outside me. Don&apos;t even try to press escape
                        key.</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={toggleModal}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

const VaryingModalContent = () => {
    const [recipient, setReceipt] = useState<string>('')
    const {isOpen, toggleModal, className, openModalWithSize} = useModal()

    return (
        <>
            <h5 className="mb-2 pb-1">Varying Modal Content</h5>
            <div className="hstack gap-2 flex-wrap">
                <Button
                    variant="primary"
                    onClick={() => {
                        openModalWithSize('lg')
                        setReceipt('@mdo')
                    }}>
                    Open modal for @mdo
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        openModalWithSize('lg')
                        setReceipt('@fat')
                    }}>
                    Open modal for @fat
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        openModalWithSize('lg')
                        setReceipt('@getbootstrap')
                    }}>
                    Open modal for @getbootstrap
                </Button>
            </div>
            <Modal className="fade" tabIndex={-1} show={isOpen} onHide={toggleModal} dialogClassName={className}>
                <ModalHeader onHide={toggleModal} closeButton>
                    <ModalTitle as="h5">New message to {recipient}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <div className="mb-3">
                            <FormLabel htmlFor="recipient-name" className="col-form-label">
                                Recipient:
                            </FormLabel>
                            <FormControl type="text" id="recipient-name" placeholder={recipient}/>
                        </div>
                        <div className="mb-3">
                            <FormLabel htmlFor="message-text" className="col-form-label">
                                Message:
                            </FormLabel>
                            <textarea className="form-control" id="message-text"></textarea>
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={toggleModal}>
                        Close
                    </Button>
                    <Button variant="primary">Send message</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

const Modals = () => {
    return (
        <>
            <ComponentCard title="Modals Variations" isCollapsible>
                <Row className="g-4">
                    <Col xl={6}>
                        <BootstrapModals/>
                    </Col>
                    <Col xl={6}>
                        <ModalPositions/>
                    </Col>
                    <Col xl={6}>
                        <MultipleModal/>
                    </Col>
                    <Col xl={6}>
                        <ToggleBetweenModals/>
                    </Col>
                    <Col xl={6}>
                        <FullscreenModal/>
                    </Col>
                    <Col xl={6}>
                        <StaticBackdropModal/>
                    </Col>
                    <Col xl={6}>
                        <VaryingModalContent/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Modals
