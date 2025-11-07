import small1 from '@/assets/images/stock/small-1.jpg'
import small2 from '@/assets/images/stock/small-2.jpg'
import small5 from '@/assets/images/stock/small-5.jpg'
import user1 from '@/assets/images/users/user-1.jpg'
import user10 from '@/assets/images/users/user-10.jpg'
import user2 from '@/assets/images/users/user-2.jpg'
import user3 from '@/assets/images/users/user-3.jpg'
import user4 from '@/assets/images/users/user-4.jpg'
import user5 from '@/assets/images/users/user-5.jpg'
import user6 from '@/assets/images/users/user-6.jpg'
import user7 from '@/assets/images/users/user-7.jpg'
import user8 from '@/assets/images/users/user-8.jpg'
import user9 from '@/assets/images/users/user-9.jpg'
import ComponentCard from '@/components/ComponentCard'
import {Col, Row} from 'react-bootstrap'

const ImagesShapes = () => {
    return (
        <>
            <Col sm={2} className="text-center">
                <img src={small1} alt="image" className="img-fluid"/>
                <p className="mb-0 mt-2">
                    <code>.img-fluid</code>
                </p>
            </Col>
            <Col sm={2} className="text-center">
                <img src={small2} alt="image" className="img-fluid rounded"/>
                <p className="mb-0 mt-2">
                    <code>.rounded</code>
                </p>
            </Col>
            <Col sm={2} className="text-center">
                <img src={user2} alt="image" className="img-fluid rounded" width={120}/>
                <p className="mb-0 mt-2">
                    <code>.rounded</code>
                </p>
            </Col>
            <Col sm={2} className="text-center">
                <img src={user5} alt="image" className="img-fluid rounded-circle" width={120}/>
                <p className="mb-0 mt-2">
                    <code>.rounded-circle</code>
                </p>
            </Col>
            <Col sm={2} className="text-center">
                <img src={small5} alt="image" className="img-fluid img-thumbnail"/>
                <p className="mb-0 mt-2">
                    <code>.img-thumbnail</code>
                </p>
            </Col>
            <Col sm={2} className="text-center">
                <img src={user8} alt="image" className="img-fluid rounded-circle img-thumbnail" width={120}/>
                <p className="mb-0 mt-2">
                    <code>.rounded-circle .img-thumbnail</code>
                </p>
            </Col>
        </>
    )
}

const AvatarSizes = () => {
    return (
        <>
            <Col xl={6}>
                <Col>
                    <h5 className="mb-2 pb-1">Avatar Sizes</h5>
                    <Row className="text-center">
                        <Col>
                            <img src={user2} alt="image" className="img-fluid avatar-xs rounded"/>
                            <p className="mt-2">
                                <code>.avatar-xs</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-xs mx-auto">
                                <span className="avatar-title text-bg-primary rounded">xs</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-xs</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-xs mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded">xs</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-xs</code>
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <img src={user3} alt="image" className="img-fluid avatar-sm rounded"/>
                            <p className="mt-2">
                                <code>.avatar-sm</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-sm mx-auto">
                                <span className="avatar-title text-bg-primary rounded">sm</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-sm</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-sm mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded">sm</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-sm</code>
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <img src={user4} alt="image" className="img-fluid avatar-md rounded"/>
                            <p className="mt-2">
                                <code>.avatar-md</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-md mx-auto">
                                <span className="avatar-title text-bg-primary rounded">md</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-md</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-md mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded">md</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-md</code>
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <img src={user5} alt="image" className="img-fluid avatar-lg rounded"/>
                            <p className="mt-2">
                                <code>.avatar-lg</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-lg mx-auto">
                                <span className="avatar-title text-bg-primary rounded">LG</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-lg</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-lg mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded">LG</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-lg</code>
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <img src={user6} alt="image" className="img-fluid avatar-xl rounded"/>
                            <p className="mt-2">
                                <code>.avatar-xl</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-xl mx-auto">
                                <span className="avatar-title text-bg-primary rounded">XL</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-xl</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-xl mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded">XL</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-xl</code>
                            </p>
                        </Col>
                    </Row>
                </Col>
            </Col>
        </>
    )
}

const RoundedAvatar = () => {
    return (
        <>
            <Col xl={6}>
                <Col>
                    <h5 className="mb-2 pb-1">Avatar Sizes with Rounded</h5>
                    <Row className="text-center">
                        <Col>
                            <img src={user7} alt="image" className="img-fluid avatar-xs rounded-circle"/>
                            <p className="mt-2">
                                <code>.avatar-xs</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-xs mx-auto">
                                <span className="avatar-title text-bg-primary rounded-circle">xs</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-xs</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-xs mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded-circle">xs</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-xs</code>
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <img src={user8} alt="image" className="img-fluid avatar-sm rounded-circle"/>
                            <p className="mt-2">
                                <code>.avatar-sm</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-sm mx-auto">
                                <span className="avatar-title text-bg-primary rounded-circle">sm</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-sm</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-sm mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded-circle">sm</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-sm</code>
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <img src={user9} alt="image" className="img-fluid avatar-md rounded-circle"/>
                            <p className="mt-2">
                                <code>.avatar-md</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-md mx-auto">
                                <span className="avatar-title text-bg-primary rounded-circle">md</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-md</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-md mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded-circle">md</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-md</code>
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <img src={user10} alt="image" className="img-fluid avatar-lg rounded-circle"/>
                            <p className="mt-2">
                                <code>.avatar-lg</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-lg mx-auto">
                                <span className="avatar-title text-bg-primary rounded-circle">LG</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-lg</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-lg mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded-circle">LG</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-lg</code>
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <img src={user1} alt="image" className="img-fluid avatar-xl rounded-circle"/>
                            <p className="mt-2">
                                <code>.avatar-xl</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-xl mx-auto">
                                <span className="avatar-title text-bg-primary rounded-circle">XL</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-xl</code>
                            </p>
                        </Col>
                        <Col>
                            <div className="avatar-xl mx-auto">
                                <span className="avatar-title bg-primary-subtle text-primary rounded-circle">XL</span>
                            </div>
                            <p className="mt-2">
                                <code>.avatar-xl</code>
                            </p>
                        </Col>
                    </Row>
                </Col>
            </Col>
        </>
    )
}

const AvatarGroups = () => {
    return (
        <>
            <Col xl={3}>
                <div className="avatar-group">
                    <div className="avatar">
                        <img src={user4} alt="" className="rounded-circle avatar-sm"/>
                    </div>
                    <div className="avatar">
                        <img src={user5} alt="" className="rounded-circle avatar-sm"/>
                    </div>
                    <div className="avatar">
                        <img src={user3} alt="" className="rounded-circle avatar-sm"/>
                    </div>
                    <div className="avatar">
                        <img src={user8} alt="" className="rounded-circle avatar-sm"/>
                    </div>
                    <div className="avatar">
                        <img src={user2} alt="" className="rounded-circle avatar-sm"/>
                    </div>
                </div>
            </Col>
            <Col xl={3}>
                <div className="avatar-group">
                    <div className="avatar avatar-md">
                        <span className="avatar-title text-bg-primary rounded-circle fw-bold">K</span>
                    </div>
                    <div className="avatar avatar-md">
                        <span className="avatar-title text-bg-primary rounded-circle fw-bold">H</span>
                    </div>
                    <div className="avatar avatar-md">
                        <span className="avatar-title text-bg-primary rounded-circle fw-bold">L</span>
                    </div>
                    <div className="avatar avatar-md">
                        <span className="avatar-title text-bg-primary rounded-circle fw-bold">G</span>
                    </div>
                </div>
            </Col>
            <Col xl={3}>
                <div className="avatar-group">
                    <div className="avatar avatar-lg">
                        <span
                            className="avatar-title bg-primary-subtle text-primary rounded-circle fw-bold shadow">K</span>
                    </div>
                    <div className="avatar avatar-lg">
                        <span
                            className="avatar-title bg-primary-subtle text-primary rounded-circle fw-bold shadow">H</span>
                    </div>
                    <div className="avatar avatar-lg">
                        <span
                            className="avatar-title bg-primary-subtle text-primary rounded-circle fw-bold shadow">L</span>
                    </div>
                    <div className="avatar avatar-lg">
                        <span
                            className="avatar-title bg-primary-subtle text-primary rounded-circle fw-bold shadow">G</span>
                    </div>
                </div>
            </Col>
            <Col xl={3}>
                <div className="avatar-group">
                    <div className="avatar">
                        <img src={user10} alt="" className="rounded-circle avatar-xl"/>
                    </div>
                    <div className="avatar avatar-xl">
                        <span className="avatar-title text-bg-primary rounded-circle fs-xl fw-bold">D</span>
                    </div>
                    <div className="avatar">
                        <img src={user7} alt="" className="rounded-circle avatar-xl"/>
                    </div>
                    <div className="avatar">
                        <img src={user1} alt="" className="rounded-circle avatar-xl"/>
                    </div>
                    <div className="avatar avatar-xl">
                        <span className="avatar-title fs-xl text-bg-primary rounded-circle fw-bold">9+</span>
                    </div>
                </div>
            </Col>
        </>
    )
}

const Avatar = () => {
    return (
        <>
            <ComponentCard title="Avatar & Image Styles" isCollapsible>
                <Row>
                    <ImagesShapes/>
                </Row>
                <Row className="mt-4">
                    <AvatarSizes/>
                    <RoundedAvatar/>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <h5 className="mb-2 pb-1">Avatar Groups</h5>
                        <Row>
                            <AvatarGroups/>
                        </Row>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Avatar
