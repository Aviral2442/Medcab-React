import {Link} from 'react-router'
import user2 from '@/assets/images/users/user-2.jpg'

const UserProfile = () => {
    return (
        <div className="sidenav-user text-nowrap border border-dashed rounded-3">
            <Link to="" className="sidenav-user-name d-flex align-items-center">
                <img src={user2} width={36} height={36} className="rounded-circle me-2 d-flex" alt="user-image"/>
                <span>
                    <h5 className="my-0 fw-semibold fs-4">Maxine Kennedy</h5>
                    <h6 className="my-0 text-muted fs-5">Admin Head</h6>
                </span>
            </Link>
        </div>
    )
}

export default UserProfile
