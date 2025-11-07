import {Card, ListGroup, ListGroupItem} from 'react-bootstrap'
import SimpleBar from 'simplebar-react'
import type {IconType} from 'react-icons'
import {
    TbArchive,
    TbBrain,
    TbFolder,
    TbFolderPlus,
    TbGridPattern,
    TbMessageCircle,
    TbSearch,
    TbVideo
} from 'react-icons/tb'
import clsx from 'clsx'

type SideBarItemType = {
    label: string
    icon?: IconType
}

const sideBarItems: SideBarItemType[] = [
    {
        label: 'Start Chat',
        icon: TbMessageCircle,
    },
    {
        label: 'Find Threads',
        icon: TbSearch,
    },
    {
        label: 'Saved Sessions',
        icon: TbArchive,
    },
    {
        label: 'AI Tools',
        icon: TbBrain,
    },
    {
        label: 'AI Vision',
        icon: TbVideo,
    },
    {
        label: 'Explore Models',
        icon: TbGridPattern,
    },
]

const workspaceItems: SideBarItemType[] = [
    {
        label: 'New Workspace',
        icon: TbFolderPlus,
    },
    {
        label: 'Marketing',
        icon: TbFolder,
    },
    {
        label: 'Design Team',
        icon: TbFolder,
    },
    {
        label: 'DevOps',
        icon: TbFolder,
    },
    {
        label: 'Legal',
        icon: TbFolder,
    },
    {
        label: 'Freelancers',
        icon: TbFolder,
    },
]

const resentConversations: SideBarItemType[] = [
    {
        label: 'Website Redesign Brief',
    },
    {
        label: 'Sprint Planning Q2',
    },
    {
        label: 'Client Onboarding Script',
    },
    {
        label: 'Legal Agreement Review',
    },
    {
        label: 'Product Launch Sequence',
    },
    {
        label: 'Budget Automation Draft',
    },
]

const SideBar = () => {
    return (
        <Card className="rounded-0 mb-0">
            <SimpleBar className="card-body p-0 sidebar-offcanvas" style={{height: 'calc(100vh - 170px)'}}>
                <div className="chat-sidebar p-3">
                    <div className="mb-4">
                        <ListGroup variant="flush" className="list-custom">
                            {sideBarItems.map((item, idx) => (
                                <ListGroupItem action key={idx}
                                               className={clsx('d-flex align-items-center gap-2', idx === 0 && 'active')}>
                                    {item.icon && <item.icon className="fs-md"/>}
                                    {item.label}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>

                    <div className="mb-3">
                        <h6 className="text-muted text-uppercase fs-xs mb-2">Workspaces</h6>
                        <ListGroup variant="flush" className="list-custom">
                            {workspaceItems.map((item, idx) => (
                                <ListGroupItem action href="#" key={idx} className="d-flex align-items-center gap-2">
                                    {item.icon && <item.icon className="fs-md"/>}
                                    {item.label}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>

                    <div>
                        <h6 className="text-muted text-uppercase fs-xs mb-2">Recent Conversations</h6>
                        <ListGroup variant="flush" className="list-custom">
                            {resentConversations.map((item, idx) => (
                                <ListGroupItem action className="text-body py-1" key={idx}>
                                    {item.label}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                </div>
            </SimpleBar>
        </Card>
    )
}

export default SideBar
