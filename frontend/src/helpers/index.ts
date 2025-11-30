type CurrencyType = '₹' | '$' | '€'

export const currency: CurrencyType = '$'

export const currentYear = new Date().getFullYear()

export const appName = 'Medcab'
export const appTitle = 'Medcab - Admin Dashboard'
export const appDescription: string =
  'Medcab is a premium admin dashboard template built with React and TypeScript.'
export const author: string = 'Medcab'
export const authorWebsite: string = 'IME.com'
export const authorContact: string = ''

export const basePath = (import.meta as any).env?.VITE_PATH ?? "";
export const baseURL = (import.meta as any).env?.base_Path ?? "";
