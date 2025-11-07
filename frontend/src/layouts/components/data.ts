import { type MenuItemType } from '@/types/layout'
import { type IconType } from 'react-icons'
import { TbLogout2, TbUserCircle } from 'react-icons/tb'
import {
  LuCircleGauge,
  LuNotebookText,
} from 'react-icons/lu'

type UserDropdownItemType = {
  label?: string
  icon?: IconType
  url?: string
  isDivider?: boolean
  isHeader?: boolean
  class?: string
}

export const handlelogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/auth/sign-in';
}

export const userDropdownItems: UserDropdownItemType[] = [
  {
    label: 'Welcome back!',
    isHeader: true,
  },
  {
    label: 'Profile',
    icon: TbUserCircle,
    url: '/pages/profile',
  },
  // {
  //   label: 'Notifications',
  //   icon: TbBellRinging,
  //   url: '#',
  // },
  // {
  //   label: 'Balance: $985.25',
  //   icon: TbCreditCard,
  //   url: '#',
  // },
  // {
  //   label: 'Account Settings',
  //   icon: TbSettings2,
  //   url: '#',
  // },
  // {
  //   label: 'Support Center',
  //   icon: TbHeadset,
  //   url: '#',
  // },
  // {
  //   isDivider: true,
  // },
  // {
  //   label: 'Lock Screen',
  //   icon: TbLock,
  //   url: '/auth-1/lock-screen',
  // },
  {
    label: 'Log Out',
    icon: TbLogout2,
    url: '#',
    class: 'text-danger fw-semibold',
  },
]

export const menuItems: MenuItemType[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LuCircleGauge, url: '/dashboard' },
  // { key: 'ton-ai', label: 'Ton AI', icon: LuSparkles, url: '/ton-ai', badge: { text: 'Hot', variant: 'primary' } },
  // { key: 'calendar', label: 'Calendar', icon: LuCalendar, url: '/calendar' },
  // { key: 'directory', label: 'Directory', icon: LuBookUser, url: '/directory' },

  // { key: 'manpower', label: 'Manpower', icon: LuBookUser, url: '/manpower' },
  // { key: 'order-list', label: 'Order List', icon: LuNotebookText, url: '/order-list' },
  // { key: 'booking-list', label: 'Booking List', icon: LuCalendar, url: '/booking-list' },
  // { key: 'vendor-list', label: 'Vendor List', icon: LuLayers2, url: '/vendor-list' },
  // { key: 'consumer-list', label: 'Consumer List', icon: TbUserCircle, url: '/consumer-list' },

  // { key: 'custom-pages', label: 'Custom Pages', isTitle: true },

  {
    key: 'pages',
    label: 'Manage Manpower',
    icon: LuNotebookText,
    children: [
      { key: 'manpower', label: 'Manpower', url: '/manpower' },
      // { key: 'order-list', label: 'Order List', url: '/order-list' },
      { key: 'booking-list', label: 'Booking', url: '/booking-list' },
      { key: 'vendor-list', label: 'Vendor', url: '/vendor-list' },
      { key: 'consumer-list', label: 'Consumer', url: '/consumer-list' },
      // { key: 'pricing', label: 'Pricing', url: '/pages/pricing' },
      // { key: 'empty-page', label: 'Empty Page', url: '/pages/empty' },
      // { key: 'timeline', label: 'Timeline', url: '/pages/timeline' },
      // { key: 'terms-conditions', label: 'Terms & Conditions', url: '/pages/terms-conditions' },
      // { key: 'invoice', label: 'Invoice', url: '/pages/invoice' },
    ],
  },
  // {
  //   key: 'auth',
  //   label: 'Authentication',
  //   icon: LuFingerprint,
  //   children: [
  //     { key: 'sign-in', label: 'Sign In', url: '/auth/sign-in' },
  //     { key: 'sign-up', label: 'Sign Up', url: '/auth/sign-up' },
  //     { key: 'reset-pass', label: 'Reset Password', url: '/auth/reset-password' },
  //     { key: 'new-pass', label: 'New Password', url: '/auth/new-password' },
  //     { key: 'two-factor', label: 'Two Factor', url: '/auth/two-factor' },
  //     { key: 'lock-screen', label: 'Lock Screen', url: '/auth/lock-screen' },
  //     { key: 'error-404', label: '404 – Not Found', url: '/error/404' },
  //   ],
  // },
  // {
  //   key: 'ui',
  //   label: 'UI Components',
  //   icon: LuPencilRuler,
  //   children: [
  //     {
  //       key: 'core-elements',
  //       label: 'Core Elements',
  //       url: '/ui/core-elements',
  //     },
  //     {
  //       key: 'interactive-features',
  //       label: 'Interactive Features',
  //       url: '/ui/interactive-features',
  //     },
  //     {
  //       key: 'menu-links',
  //       label: 'Menu & Links',
  //       url: '/ui/menu-links',
  //     },
  //     {
  //       key: 'visual-feedback',
  //       label: 'Visual Feedback',
  //       url: '/ui/visual-feedback',
  //     },
  //     {
  //       key: 'utilities',
  //       label: 'Utilities',
  //       url: '/ui/utilities',
  //     },
  //   ],
  // },
  // {
  //   key: 'charts',
  //   label: 'Charts',
  //   icon: LuChartPie,
  //   url: '/charts',
  // },
  // {
  //   key: 'forms',
  //   label: 'Forms',
  //   icon: LuSquarePi,
  //   children: [
  //     {
  //       key: 'form-basic-elements',
  //       label: 'Basic Elements',
  //       url: '/forms/basic',
  //     },
  //     {
  //       key: 'form-plugins',
  //       label: 'Plugins',
  //       url: '/forms/plugins',
  //     },
  //     {
  //       key: 'form-validation',
  //       label: 'Validation',
  //       url: '/forms/validation',
  //     },
  //     {
  //       key: 'form-wizard',
  //       label: 'Wizard',
  //       url: '/forms/wizard',
  //     },
  //     {
  //       key: 'form-file-uploads',
  //       label: 'File Uploads',
  //       url: '/forms/file-uploads',
  //     },
  //     {
  //       key: 'form-editors',
  //       label: 'Editors',
  //       url: '/forms/editors',
  //     },
  //   ],
  // },
  // {
  //   key: 'tables',
  //   label: 'Tables',
  //   icon: LuTable2,
  //   children: [
  //     {
  //       key: 'static-tables',
  //       label: 'Static Tables',
  //       url: '/tables/static',
  //     },
  //     {
  //       key: 'data-tables',
  //       label: 'DataTables',
  //       badge: { variant: 'success', text: '09' },
  //       children: [
  //         { key: 'data-tables-basic', label: 'Basic', url: '/tables/data-tables/basic' },
  //         { key: 'data-tables-export-data', label: 'Export Data', url: '/tables/data-tables/export-data' },
  //         { key: 'data-tables-select', label: 'Select', url: '/tables/data-tables/select' },
  //         { key: 'data-tables-ajax', label: 'Ajax', url: '/tables/data-tables/ajax' },
  //         {
  //           key: 'data-tables-javascript-source',
  //           label: 'Javascript Source',
  //           url: '/tables/data-tables/javascript-source',
  //         },
  //         {
  //           key: 'data-tables-data-rendering',
  //           label: 'Data Rendering',
  //           url: '/tables/data-tables/data-rendering',
  //         },
  //         { key: 'data-tables-columns', label: 'Show & Hide Column', url: '/tables/data-tables/columns' },
  //         { key: 'data-tables-child-rows', label: 'Child Rows', url: '/tables/data-tables/child-rows' },
  //         {
  //           key: 'data-tables-checkbox-select',
  //           label: 'Checkbox Select',
  //           url: '/tables/data-tables/checkbox-select',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   key: 'icons',
  //   label: 'Icons',
  //   icon: LuLayers2,
  //   children: [
  //     {
  //       key: 'tabler-icons',
  //       label: 'Tabler',
  //       url: '/icons/tabler',
  //     },
  //     {
  //       key: 'lucide-icons',
  //       label: 'Lucide',
  //       url: '/icons/lucide',
  //     },
  //     {
  //       key: 'flags',
  //       label: 'Flags',
  //       url: '/icons/flags',
  //     },
  //   ],
  // },
  // {
  //   key: 'maps',
  //   label: 'Maps',
  //   icon: LuMapPin,
  //   children: [
  //     {
  //       key: 'vector-maps',
  //       label: 'Vector Maps',
  //       url: '/maps/vector',
  //     },
  //     {
  //       key: 'leaflet-maps',
  //       label: 'Leaflet Maps',
  //       url: '/maps/leaflet',
  //     },
  //   ],
  // },
  // { key: 'menu-items', label: 'Menu Items', isTitle: true },
  // {
  //   key: 'menu-levels',
  //   label: 'Menu Levels',
  //   icon: LuCommand,
  //   children: [
  //     {
  //       key: 'second-level',
  //       label: 'Second Level',
  //       children: [
  //         { key: 'item-2-1', label: 'Item 2.1', url: '' },
  //         { key: 'item-2-2', label: 'Item 2.2', url: '' },
  //       ],
  //     },
  //     {
  //       key: 'third-level',
  //       label: 'Third Level',
  //       children: [
  //         { key: 'item-3-1', label: 'Item 1', url: '' },
  //         {
  //           key: 'fourth-level',
  //           label: 'Item 2',
  //           children: [
  //             {
  //               key: 'item-4-1',
  //               label: 'Item 3.1',
  //               url: '',
  //             },
  //             {
  //               key: 'item-4-2',
  //               label: 'Item 3.2',
  //               url: '',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // { key: 'disabled-menu', label: 'Disabled Menu', icon: LuShieldBan, url: '', isDisabled: true },
]
