type CurrencyType = '₹' | '$' | '€'

export const currency: CurrencyType = '$'

export const currentYear = new Date().getFullYear()

export const appName = 'Simple'
export const appTitle = 'Simple - Responsive Bootstrap 5 Admin Dashboard'
export const appDescription: string =
  'Perfect for building CRM, CMS, project management tools, and custom web apps with clean UI, responsive design, and powerful features.'

export const author: string = 'Coderthemes'
export const authorWebsite: string = 'https://coderthemes.com/'
export const authorContact: string = ''

export const basePath = (import.meta as any).env?.VITE_PATH ?? "";
