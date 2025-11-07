import type {ChildrenType} from '@/types'
import {LayoutProvider} from '@/context/useLayoutContext'
import {NotificationProvider} from '@/context/useNotificationContext'

const AppWrapper = ({children}: ChildrenType) => {
    return (
        <LayoutProvider>
            <NotificationProvider>{children}</NotificationProvider>
        </LayoutProvider>
    )
}

export default AppWrapper
