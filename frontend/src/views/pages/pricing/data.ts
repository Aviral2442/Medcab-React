import {currency} from '@/helpers'

export type PricingPlanType = {
    name: string
    description: string
    price: string
    priceNote: string
    usage: string
    features: {
        label: string
        included: boolean
    }[]
    buttonLabel: string
    buttonVariant: 'primary' | 'outline-primary' | 'dark' | 'outline-dark'
    badge?: {
        text: string
        color: string
        textColor: string
    }
    contactEmail?: string
}

export const pricingPlans: PricingPlanType[] = [
    {
        name: 'Single License',
        description: 'Perfect for personal or one-client projects',
        price: currency + '39',
        priceNote: 'One-time payment',
        usage: 'Single project use',
        features: [
            {label: '1 project usage', included: true},
            {label: 'Full component access', included: true},
            {label: 'Basic documentation', included: true},
            {label: 'No multi-client use', included: false},
            {label: 'No SaaS/resale rights', included: false},
        ],
        buttonLabel: 'Buy Single License',
        buttonVariant: 'outline-primary',
    },
    {
        name: 'Multiple License',
        description: 'For developers or agencies working with multiple clients',
        price: currency + '199',
        priceNote: 'One-time payment',
        usage: 'Up to 5 projects',
        features: [
            {label: 'Use in up to 5 projects', included: true},
            {label: 'Commercial client use', included: true},
            {label: 'Lifetime updates', included: true},
            {label: 'Premium support', included: true},
            {label: 'No resale/SaaS rights', included: false},
        ],
        buttonLabel: 'Buy Multiple License',
        buttonVariant: 'primary',
        badge: {
            text: 'Best Value',
            color: 'primary-subtle',
            textColor: 'primary',
        },
    },
    {
        name: 'Extended License',
        description: 'For SaaS products or items offered in paid applications',
        price: currency + '799',
        priceNote: 'One-time payment',
        usage: 'Commercial redistribution rights',
        features: [
            {label: 'Unlimited project usage', included: true},
            {label: 'SaaS & resale rights', included: true},
            {label: 'Full Figma source files', included: true},
            {label: 'Priority support', included: true},
            {label: 'Custom licensing agreement', included: true},
        ],
        buttonLabel: 'Buy Extended License',
        buttonVariant: 'dark',
    },
    {
        name: 'Custom License',
        description: 'Tailored for enterprise or unique distribution needs',
        price: 'Contact Us',
        priceNote: 'Flexible pricing',
        usage: 'Based on project scope',
        features: [
            {label: 'Unlimited users & usage', included: true},
            {label: 'White-label allowed', included: true},
            {label: 'Custom branding permissions', included: true},
            {label: 'Dedicated account support', included: true},
            {label: 'NDA and legal agreement', included: true},
        ],
        buttonLabel: 'Request Custom License',
        buttonVariant: 'outline-dark',
        badge: {
            text: 'Enterprise',
            color: 'primary-subtle',
            textColor: 'primary',
        },
        contactEmail: 'sales@example.com',
    },
]
