import {createContext, use, useCallback, useEffect, useMemo, useState} from 'react'
import {useLocalStorage} from 'usehooks-ts'

import {debounce} from '@/helpers/debounce'
import {toggleAttribute} from '@/helpers/layout'
import type {ChildrenType} from '@/types'
import type {
    LayoutOffcanvasStatesType,
    LayoutPositionType,
    LayoutSkinType,
    LayoutState,
    LayoutThemeType,
    LayoutType,
    OffcanvasControlType,
    SideNavType,
    TopBarType,
} from '@/types/layout'
import useViewPort from '@/hooks/useViewPort'

const INIT_STATE: LayoutState = {
    skin: 'shadcn',
    monochrome: false,
    theme: 'light',
    sidenav: {
        size: 'default',
        color: 'light',
        user: true,
        isMobileMenuOpen: false,
    },
    topBar: {
        color: 'light',
    },
    position: 'fixed',
}

const LayoutContext = createContext<LayoutType | undefined>(undefined)

const useLayoutContext = () => {
    const context = use(LayoutContext)
    if (!context) {
        throw new Error('useLayoutContext can only be used within LayoutProvider')
    }
    return context
}

const LayoutProvider = ({children}: ChildrenType) => {
    const [settings, setSettings] = useLocalStorage<LayoutState>('__SIMPLE_REACT_CONFIG__', INIT_STATE)

    const [offcanvasStates, setOffcanvasStates] = useState<LayoutOffcanvasStatesType>({
        showCustomizer: false,
    })

    // update settings
    const updateSettings = useCallback(
        (_newSettings: Partial<LayoutState>) => {
            setSettings((prevSettings) => ({
                ...prevSettings,
                ..._newSettings,
                sidenav: {
                    ...prevSettings.sidenav,
                    ...(_newSettings.sidenav || {}),
                },
                topBar: {
                    ...prevSettings.topBar,
                    ...(_newSettings.topBar || {}),
                },
            }))
        },
        [setSettings],
    )

    const changeSkin = useCallback(
        (nSkin: LayoutSkinType, persist = true) => {
            toggleAttribute('data-skin', nSkin)
            if (persist) updateSettings({skin: nSkin})
        },
        [updateSettings],
    )

    const toggleMonochromeMode = (persist = true) => {
        toggleAttribute('class', !settings.monochrome ? 'monochrome' : '')
        if (persist) updateSettings({monochrome: !settings.monochrome})
    }

    const changeTheme = useCallback(
        (nTheme: LayoutThemeType, persist = true) => {
            toggleAttribute('data-bs-theme', nTheme)
            if (persist) updateSettings({theme: nTheme})
        },
        [updateSettings],
    )

    const changeTopBarColor = useCallback(
        (nColor: TopBarType['color'], persist = true) => {
            toggleAttribute('data-topbar-color', nColor)
            if (persist) updateSettings({topBar: {color: nColor}})
        },
        [updateSettings],
    )

    const changeSideNavSize = useCallback(
        (nSize: SideNavType['size'], persist = true) => {
            toggleAttribute('data-sidenav-size', nSize)
            if (persist) updateSettings({sidenav: {...settings.sidenav, size: nSize}})
        },
        [settings.sidenav, updateSettings],
    )

    const changeSideNavColor = useCallback(
        (nColor: SideNavType['color'], persist = true) => {
            toggleAttribute('data-menu-color', nColor)
            if (persist) updateSettings({sidenav: {...settings.sidenav, color: nColor}})
        },
        [settings.sidenav, updateSettings],
    )

    const toggleSideNavUser = () => {
        toggleAttribute('data-sidenav-user', (!settings.sidenav.user).toString())
        updateSettings({sidenav: {...settings.sidenav, user: !settings.sidenav.user}})
    }

    const toggleMobileMenu = () => {
        updateSettings({sidenav: {...settings.sidenav, isMobileMenuOpen: !settings.sidenav.isMobileMenuOpen}})
    }

    const changePosition = useCallback(
        (nPosition: LayoutPositionType, persist = true) => {
            toggleAttribute('data-layout-position', nPosition)
            if (persist) updateSettings({position: nPosition})
        },
        [updateSettings],
    )

    const toggleCustomizer: OffcanvasControlType['toggle'] = () => {
        setOffcanvasStates({
            ...offcanvasStates,
            showCustomizer: !offcanvasStates.showCustomizer,
        })
    }

    const customizer: LayoutType['customizer'] = {
        isOpen: offcanvasStates.showCustomizer,
        toggle: toggleCustomizer,
    }

    const reset = useCallback(() => {
        setSettings(INIT_STATE)
    }, [setSettings])

    const showBackdrop = () => {
        const backdrop = document.createElement('div')
        backdrop.id = 'custom-backdrop'
        backdrop.className = 'offcanvas-backdrop fade show'
        document.body.appendChild(backdrop)
        document.body.style.overflow = 'hidden'
        if (window.innerWidth > 767) {
            document.body.style.paddingRight = '15px'
        }
        backdrop.addEventListener('click', () => {
            const html = document.documentElement
            html.classList.remove('sidebar-enable')
            hideBackdrop()
        })
    }

    const hideBackdrop = () => {
        const backdrop = document.getElementById('custom-backdrop')
        if (backdrop) {
            document.body.removeChild(backdrop)
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
        }
    }

    useEffect(() => {
        toggleAttribute('data-skin', settings.skin)
        toggleAttribute('data-bs-theme', settings.theme)
        toggleAttribute('data-topbar-color', settings.topBar.color)
        toggleAttribute('data-sidenav-color', settings.sidenav.color)
        toggleAttribute('data-sidenav-size', settings.sidenav.size)
        toggleAttribute('data-sidenav-user', settings.sidenav.user.toString())
        toggleAttribute('data-layout-position', settings.position)
        toggleAttribute('class', settings.monochrome ? 'monochrome' : '')
        
        // Apply body background color based on theme and skin
        if (settings.theme === 'dark' && settings.skin === 'leafline') {
            document.body.style.backgroundColor = '#121912'
        } else if (settings.theme === 'light' && settings.skin === 'leafline') {
            document.body.style.backgroundColor = '#f5f6f7'
        } else if (settings.theme === 'dark') {
            document.body.style.backgroundColor = '#17181e' // default dark mode color
        } else {
            document.body.style.backgroundColor = '#f5f6f7' // default light mode color
        }
    }, [settings])

    const {width} = useViewPort()

    useEffect(() => {
        const handleResize = () => {
            if (width <= 1199) {
                changeSideNavSize('offcanvas')
            } else {
                changeSideNavSize('default')
            }
        }

        handleResize()

        const debouncedResize = debounce(handleResize, 200)

        window.addEventListener('resize', debouncedResize)

        return () => {
            window.removeEventListener('resize', debouncedResize)
        }
    }, [width])

    return (
        <LayoutContext.Provider
            value={useMemo(
                () => ({
                    ...settings,
                    changeSkin,
                    toggleMonochromeMode,
                    changeTheme,
                    changeTopBarColor,
                    changeSideNavSize,
                    changeSideNavColor,
                    toggleSideNavUser,
                    toggleMobileMenu,
                    changePosition,
                    customizer,
                    reset,
                    showBackdrop,
                    hideBackdrop,
                }),
                [
                    settings,
                    changeSkin,
                    toggleMonochromeMode,
                    changeTheme,
                    changeTopBarColor,
                    changeSideNavSize,
                    changeSideNavColor,
                    toggleSideNavUser,
                    toggleMobileMenu,
                    changePosition,
                    customizer,
                    reset,
                ],
            )}>
            {children}
        </LayoutContext.Provider>
    )
}
export {LayoutProvider, useLayoutContext}
