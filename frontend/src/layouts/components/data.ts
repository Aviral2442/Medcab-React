import { type MenuItemType } from '@/types/layout'
import { type IconType } from 'react-icons'
import { TbLogout2, TbUserCircle } from 'react-icons/tb'
import {
  LuAmbulance,
  LuAxis3D,
  LuBed,
  LuCircleGauge,
  LuFileType,
  LuMonitorSmartphone,
  LuSettings,
  LuTableOfContents,
  LuUser,
  LuUserRoundPlus,
  LuVideo,
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
  {
    label: 'Log Out',
    icon: TbLogout2,
    url: '#',
    class: 'text-danger fw-semibold',
  },
]

export const menuItems: MenuItemType[] = [
  {
    key: 'pages-dashboard',
    label: 'Dashboard',
    icon: LuCircleGauge,
    children: [
      { key: 'amulance-dashboard', label: 'Ambulance', url: '/ambulance-dashboard' },
      { key: 'pathology-dashboard', label: 'Pathology', url: '/pathology-dashboard' },
      { key: 'manpower-dashboard', label: 'Manpower', url: '/manpower-dashboard' },
      // { key: 'manpower', label: 'Manpower', url: '/manpower' },
    ],
  },

  { key: 'consumer-list', label: 'Consumer', icon: LuUser, url: '/consumer-list' },
  // { key: 'ton-ai', label: 'Ton AI', icon: LuSparkles, url: '/ton-ai', badge: { text: 'Hot', variant: 'primary' } },
  // { key: 'calendar', label: 'Calendar', icon: LuCalendar, url: '/calendar' },
  // { key: 'directory', label: 'Directory', icon: LuBookUser, url: '/directory' },

  // { key: 'manpower', label: 'Manpower', icon: LuBookUser, url: '/manpower' },


  {
    key: 'pages-manpower',
    label: 'Manpower',
    icon: LuUserRoundPlus,
    children: [
      { key: 'manpower-category', label: 'Category', url: '/manpower-category' },
      { key: 'manpower-vendor', label: 'Vendor', url: '/manpower-vendors' },
      { key: 'manpower-booking', label: 'Booking', url: '/manpower-bookings' },
      // { key: 'pricing', label: 'Pricing', url: '/pages/pricing' },
      // { key: 'empty-page', label: 'Empty Page', url: '/pages/empty' },
      // { key: 'timeline', label: 'Timeline', url: '/pages/timeline' },
      // { key: 'terms-conditions', label: 'Terms & Conditions', url: '/pages/terms-conditions' },
      // { key: 'invoice', label: 'Invoice', url: '/pages/invoice' },
    ],
  },
  {
    key: 'pages-ambulance',
    label: 'Ambulance',
    icon: LuAmbulance,
    children: [
      { key: 'category-list', label: 'Category', url: '/ambulance/category' },
      { key: 'partner-list', label: 'Partner', url: '/ambulance/partner' },
      { key: 'driver-list', label: 'Driver', url: '/ambulance/driver' },
      { key: 'vehical-list', label: 'Vehicle', url: '/ambulance/vehicle' },
      { key: 'driver-duty', label: 'Driver Duty', url: '/ambulance/driver-duty' },
      { key: 'booking-list', label: 'Booking', url: '/ambulance/booking' },
      // { key: 'manpower', label: 'Manpower', url: '/manpower' },
    ],
  },
  {
    key: 'pages-pathology',
    label: 'Pathology',
    icon: LuAxis3D,
    children: [
      // { key: 'manpower', label: 'Manpower', url: '/manpower' },
    ],
  },
  {
    key: 'pages-video-consultation',
    label: 'Video Consultation',
    icon: LuVideo,
    children: [
      // { key: 'manpower', label: 'Manpower', url: '/manpower' },
    ],
  },
  {
    key: 'pages-Bed-Availability',
    label: 'Bed Availability',
    icon: LuBed,
    children: [
      // { key: 'manpower', label: 'Manpower', url: '/manpower' },
    ],
  },
  {
    key: 'pages-Emergency',
    label: 'Emergency',
    icon: LuFileType,
    children: [
      { key: 'driver-emergency', label: 'Driver', url: '/emergency/driver' },
      { key: 'consumer-emergency', label: 'Consumer', url: '/emergency/consumer' },
    ],
  },
  {
    key: 'pages-content-SEO',
    label: 'Content SEO',
    icon: LuTableOfContents,
    children: [
      { key: 'blogs', label: 'Blogs', url: '/content-seo/blogs' },
      {
        key: 'ambulance',
        label: 'Ambulance',
        children: [
          { key: 'city-ambulance', label: 'City Content', url: '/city/ambulance' },
        ]
      },
      {
        key: 'manpower',
        label: 'Manpower',
        children: [
          { key: 'city-manpower', label: 'City Content', url: '/city/manpower' }
        ]
      },
      {
        key: 'pathology',
        label: 'Pathology',
        children: [
          { key: 'city-pathology', label: 'City Content', url: '/city/pathology' }
        ]
      },
      {
        key: 'video-consultation',
        label: 'Video Consultation',
        children: [
          { key: 'city-video', label: 'City Content', url: '/city/video-consultation' }
        ]
      },
    ],
  },
  {
    key: 'page-transactions',
    label: 'Transactions',
    icon: LuMonitorSmartphone,
    children: [
      {key: 'consumer-transactions', label: 'Consumer', url: '/transaction/consumer' },
      {
        key: 'ambulance',
        label: 'Ambulance',
        children: [
          { key: 'transaction-driver', label: 'Driver', url: '/transaction/driver' },
          { key: 'transaction-partner', label: 'Partner', url: '/transaction/partner' },
        ]
      },
      {
        key: 'manpower',
        label: 'Manpower',
        children: [
          { key: 'transaction-vendor', label: 'Vendor', url: '/transaction/vendor' },
        ]
      },
      
    ],
  },
  {
    key: 'page-admin-settings',
    label: 'Admin Settings',
    icon: LuSettings,
    children: [
      { key: 'admin', label: 'Admin', url: '/admin' },
      { key: 'permission', label: 'Permission', url: '/permission' },
    ],
  },
]