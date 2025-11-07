import type { Variant } from 'react-bootstrap/esm/types'
import type { IconType } from 'react-icons'

export type LayoutSkinType =
  | 'shadcn'
  | 'corporate'
  | 'spotify'
  | 'saas'
  | 'nature'
  | 'vintage'
  | 'leafline'
  | 'ghibli'
  | 'slack'
  | 'material'
  | 'flat'
  | 'pastel'
  | 'caffieine'
  | 'redshift'

export type LayoutThemeType = 'light' | 'dark'

export type TopBarType = {
  color: 'light' | 'dark'
}

export type SideNavType = {
  size: 'default' | 'collapse' | 'offcanvas'
  color: 'light' | 'dark'
  user: boolean
  isMobileMenuOpen: boolean
}

export type LayoutPositionType = 'fixed' | 'scrollable'

export type LayoutState = {
  skin: LayoutSkinType
  monochrome: boolean
  theme: LayoutThemeType
  topBar: TopBarType
  sidenav: SideNavType
  position: LayoutPositionType
}

export type LayoutOffcanvasStatesType = {
  showCustomizer: boolean
}

export type OffcanvasControlType = {
  isOpen: boolean
  toggle: () => void
}

export interface LayoutType extends LayoutState {
  changeSkin: (skin: LayoutSkinType, persist?: boolean) => void
  toggleMonochromeMode: (persist?: boolean) => void
  changeTheme: (theme: LayoutThemeType, persist?: boolean) => void
  changeTopBarColor: (color: TopBarType['color'], persist?: boolean) => void
  changeSideNavSize: (size: SideNavType['size'], persist?: boolean) => void
  changeSideNavColor: (color: SideNavType['color'], persist?: boolean) => void
  toggleSideNavUser: () => void
  toggleMobileMenu: (isMobileMenuOpen: SideNavType['isMobileMenuOpen']) => void
  changePosition: (position: LayoutPositionType, persist?: boolean) => void
  customizer: OffcanvasControlType
  reset: () => void
  showBackdrop: () => void
  hideBackdrop: () => void
}

export type MenuItemType = {
  key: string
  label: string
  isTitle?: boolean
  icon?: IconType
  url?: string
  badge?: {
    variant: Variant
    text: string
  }
  parentKey?: string
  target?: string
  isDisabled?: boolean
  children?: MenuItemType[]
}
