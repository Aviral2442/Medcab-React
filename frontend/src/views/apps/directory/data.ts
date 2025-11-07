import user1 from '@/assets/images/users/user-1.jpg'
import user2 from '@/assets/images/users/user-2.jpg'
import user3 from '@/assets/images/users/user-3.jpg'
import user4 from '@/assets/images/users/user-4.jpg'
import user5 from '@/assets/images/users/user-5.jpg'
import user6 from '@/assets/images/users/user-6.jpg'
import user7 from '@/assets/images/users/user-7.jpg'
import user8 from '@/assets/images/users/user-8.jpg'
import user9 from '@/assets/images/users/user-9.jpg'
import user10 from '@/assets/images/users/user-10.jpg'
import usFlag from '@/assets/images/flags/us.svg'
import gbFlag from '@/assets/images/flags/gb.svg'
import auFlag from '@/assets/images/flags/au.svg'
import jpFlag from '@/assets/images/flags/jp.svg'
import inFlag from '@/assets/images/flags/in.svg'
import frFlag from '@/assets/images/flags/fr.svg'
import deFlag from '@/assets/images/flags/de.svg'
import caFlag from '@/assets/images/flags/ca.svg'
import esFlag from '@/assets/images/flags/es.svg'
import itFlag from '@/assets/images/flags/it.svg'
import brFlag from '@/assets/images/flags/br.svg'
import nlFlag from '@/assets/images/flags/nl.svg'
import krFlag from '@/assets/images/flags/kr.svg'
import zaFlag from '@/assets/images/flags/za.svg'
import seFlag from '@/assets/images/flags/se.svg'

export type ContactType = {
    name: string
    avatar: string
    country: {
        name: string
        flag: string
    }
    jobTitle: string
    about: string
    verified?: boolean
    rating: number
    campaigns: number
    contacts: number
    engagement: string
}

export const contacts: ContactType[] = [
    {
        name: 'Daniel Carter',
        avatar: user1,
        country: {name: 'USA', flag: usFlag},
        jobTitle: 'Product Manager',
        about: 'Daniel is a tech-savvy product manager with a track record of launching scalable SaaS products.',
        verified: true,
        rating: 4.8,
        campaigns: 76,
        contacts: 335,
        engagement: '97%',
    },
    {
        name: 'Liam Carter',
        avatar: user2,
        country: {name: 'USA', flag: usFlag},
        jobTitle: 'Creative Director',
        about: 'Liam leads design teams and defines creative visions across multi-channel campaigns.',
        verified: true,
        rating: 4.7,
        campaigns: 132,
        contacts: 580,
        engagement: '91%',
    },
    {
        name: 'Emma Scott',
        avatar: user3,
        country: {name: 'UK', flag: gbFlag},
        jobTitle: 'UI/UX Designer',
        about: 'Emma specializes in creating intuitive, user-centered web and mobile interfaces.',
        rating: 4.6,
        campaigns: 115,
        contacts: 430,
        engagement: '87%',
    },
    {
        name: 'Noah Blake',
        avatar: user4,
        country: {name: 'Australia', flag: auFlag},
        jobTitle: 'Frontend Developer',
        about: 'Noah builds scalable and responsive interfaces with modern JavaScript frameworks.',
        rating: 4.8,
        campaigns: 121,
        contacts: 400,
        engagement: '93%',
    },
    {
        name: 'Olivia White',
        avatar: user5,
        country: {name: 'France', flag: frFlag},
        jobTitle: 'Marketing Manager',
        about: 'Olivia drives customer acquisition through strategic performance campaigns.',
        rating: 4.5,
        campaigns: 140,
        contacts: 560,
        engagement: '88%',
    },
    {
        name: 'Ethan Moore',
        avatar: user6,
        country: {name: 'Germany', flag: deFlag},
        jobTitle: 'Brand Consultant',
        about: 'Ethan helps startups position their brand with high-impact storytelling.',
        rating: 4.6,
        campaigns: 98,
        contacts: 380,
        engagement: '79%',
    },
    {
        name: 'Ava Mitchell',
        avatar: user7,
        country: {name: 'Canada', flag: caFlag},
        jobTitle: 'SEO Specialist',
        about: 'Ava improves online visibility through white-hat SEO strategies and audits.',
        verified: true,
        rating: 4.9,
        campaigns: 150,
        contacts: 620,
        engagement: '95%',
    },
    {
        name: 'Lucas Bennett',
        avatar: user8,
        country: {name: 'India', flag: inFlag},
        jobTitle: 'Growth Hacker',
        about: 'Lucas focuses on scalable growth through product-led and data-driven experiments.',
        rating: 4.4,
        campaigns: 103,
        contacts: 470,
        engagement: '86%',
    },
    {
        name: 'Sophia Taylor',
        avatar: user9,
        country: {name: 'Spain', flag: esFlag},
        jobTitle: 'Digital Analyst',
        about: 'Sophia provides actionable insights through advanced data visualization.',
        verified: true,
        rating: 4.3,
        campaigns: 111,
        contacts: 355,
        engagement: '82%',
    },
    {
        name: 'Mason Rivera',
        avatar: user10,
        country: {name: 'Italy', flag: itFlag},
        jobTitle: 'Content Strategist',
        about: 'Mason crafts content plans that align with business goals and brand tone.',
        verified: true,
        rating: 4.5,
        campaigns: 124,
        contacts: 512,
        engagement: '89%',
    },
    {
        name: 'Isabella Reed',
        avatar: user1,
        country: {name: 'Brazil', flag: brFlag},
        jobTitle: 'Social Media Manager',
        about: 'Isabella leads engagement and audience growth across social platforms.',
        verified: true,
        rating: 4.7,
        campaigns: 108,
        contacts: 498,
        engagement: '84%',
    },
    {
        name: 'James Lee',
        avatar: user2,
        country: {name: 'South Korea', flag: krFlag},
        jobTitle: 'Data Engineer',
        about: 'James builds and optimizes data pipelines for analytics and ML workflows.',
        verified: true,
        rating: 4.6,
        campaigns: 138,
        contacts: 560,
        engagement: '91%',
    },
    {
        name: 'Mia Johnson',
        avatar: user3,
        country: {name: 'Japan', flag: jpFlag},
        jobTitle: 'Project Manager',
        about: 'Mia ensures timely project delivery and team collaboration across sprints.',
        verified: true,
        rating: 4.5,
        campaigns: 120,
        contacts: 405,
        engagement: '85%',
    },
    {
        name: 'Benjamin Adams',
        avatar: user4,
        country: {name: 'South Africa', flag: zaFlag},
        jobTitle: 'Product Designer',
        about: 'Benjamin designs products that are both functional and delightful to use.',
        verified: true,
        rating: 4.4,
        campaigns: 106,
        contacts: 376,
        engagement: '80%',
    },
    {
        name: 'Charlotte Evans',
        avatar: user8,
        country: {name: 'Netherlands', flag: nlFlag},
        jobTitle: 'Creative Strategist',
        about: 'Charlotte combines data with creativity to craft powerful brand messages.',
        rating: 4.8,
        campaigns: 129,
        contacts: 590,
        engagement: '94%',
    },
    {
        name: 'Daniel Foster',
        avatar: user7,
        country: {name: 'Sweden', flag: seFlag},
        jobTitle: 'Innovation Lead',
        about: 'Daniel drives innovation initiatives and fosters cross-functional collaboration.',
        verified: true,
        rating: 4.6,
        campaigns: 117,
        contacts: 488,
        engagement: '90%',
    },
]
