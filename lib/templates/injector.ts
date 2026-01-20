import * as cheerio from 'cheerio'
import { generateNavbarHtml } from './navbar-styles'
import { generateHeroHtml } from './hero-styles'
import { generateAboutHtml } from './about-styles'
import { generateServicesHtml } from './services-styles'
import { generateFeaturedHtml } from './featured-styles'
import { generateFooterHtml } from './footer-styles'
import { generateColorSchemeCss } from './color-schemes'

export interface ExtractedContent {
    business_name: string
    tagline: string
    about: string
    services: Array<{ name: string; description: string }>
    unique_selling_points: string[]
    tone: string
    contact?: {
        phone?: string
        email?: string
        address?: string
    }
    hero_cta?: {
        label: string
        link: string
    }
    services_cta?: {
        label: string
        link: string
    }
    methodology?: {
        title: string
        description?: string
        steps: Array<{ title: string; subtitle?: string; description: string }>
    }
    collection_items?: Array<{ title: string; subtitle: string }>
    offer_section?: {
        title: string
        description: string
    }
    collections_heading?: string
    footer?: {
        brand_blurb: string
        social_links?: Array<{ platform: string; url: string }>
    }
    // Hero section fields
    hero_badge_text?: string
    hero_testimonial?: string
    // Visibility toggles
    visibility?: {
        navbar?: boolean
        hero_section?: boolean // Master toggle for entire hero section
        hero_headline?: boolean
        hero_tagline?: boolean
        hero_description?: boolean
        hero_testimonial?: boolean
        hero_button?: boolean
        hero_image?: boolean
        // About section visibility
        about_section?: boolean // Master toggle for entire about section
        about_badge?: boolean
        about_headline?: boolean
        about_description?: boolean
        about_images?: boolean
        // Services section visibility
        services_section?: boolean // Master toggle for entire services section
        services_badge?: boolean
        services_headline?: boolean
        services_subheadline?: boolean
        services_image?: boolean
        services_list?: boolean
        // Featured section visibility
        featured_section?: boolean // Master toggle for entire featured section
        featured_headline?: boolean
        featured_subheadline?: boolean
        featured_products?: boolean
        // Footer section visibility
        footer_section?: boolean // Master toggle for entire footer section
        footer_badge?: boolean
        footer_headline?: boolean
        footer_description?: boolean
        footer_contact?: boolean
        footer_social?: boolean
    }
    // Services section fields
    services_headline?: string
    services_subheadline?: string
    services_image?: string
    // Featured section fields
    featured_headline?: string
    featured_subheadline?: string
    featured_products?: Array<{
        title: string
        description: string
        image?: string
        tags?: string[]
        testimonial?: {
            quote: string
            author: string
            avatar?: string
        }
    }>
    // About section fields
    about_headline?: string
    about_description?: string // Separate description for about section
    about_images?: string[] // Separate images for about section gallery
    // Navbar fields
    navbar_links?: Array<{ label: string; href: string }>
}

export interface Customizations {
    navbarStyle?: string
    heroStyle?: string
    aboutStyle?: string
    servicesStyle?: string
    featuredStyle?: string
    footerStyle?: string
    colorScheme?: string[]
    fontPairing?: string
    colorSchemeId?: string
    fontPairingId?: string
}

/**
 * Inject extracted content into HTML template using server-side replacement
 * This completely replaces the template content with our generated components
 */
export function injectContent(
    templateHtml: string,
    content: ExtractedContent,
    customizations?: Customizations,
    photos?: string[]
): string {
    const $ = cheerio.load(templateHtml)

    console.log('=== INJECTOR DEBUG ===')
    console.log('Content received:', {
        business_name: content?.business_name,
        tagline: content?.tagline,
        about: content?.about,
        services_count: content?.services?.length,
        services: content?.services?.map(s => ({ name: s.name, description: s.description?.substring(0, 50) + '...' })),
        contact: content?.contact
    })
    console.log('Visibility settings:', content?.visibility)
    console.log('Services section fields:', {
        services_headline: content?.services_headline,
        services_subheadline: content?.services_subheadline,
        services_image: content?.services_image ? 'set' : 'not set'
    })
    console.log('Customizations:', customizations)
    console.log('Photos:', photos?.length)

    // Update page title
    $('title').text(`${content.business_name} - ${content.tagline}`)

    // STEP 1: Clear ALL content from main and body (except head)
    // Remove all existing content - we're building from scratch with our components
    $('main').empty()
    $('nav').remove()
    $('header').remove()
    $('footer').remove()

    // Remove any divs that might be outside main but inside body
    $('body > div').not('main').remove()
    $('body > section').remove()

    // Ensure main element exists
    let $main = $('main').first()
    if (!$main.length) {
        $('body').append('<main></main>')
        $main = $('main').first()
    }

    // STEP 2: Generate and inject our components in order

    // 2a. Generate Navbar
    let navbarHtml = ''
    if (customizations?.navbarStyle) {
        const navbarProps = {
            businessName: content.business_name,
            links: content.navbar_links,
            visibility: {
                navbar: content.visibility?.navbar
            }
        }
        console.log('=== NAVBAR GENERATION ===')
        console.log('Navbar props:', {
            businessName: navbarProps.businessName,
            links: navbarProps.links,
            visible: navbarProps.visibility?.navbar
        })
        navbarHtml = generateNavbarHtml(customizations.navbarStyle, navbarProps)
        console.log('Navbar generated, length:', navbarHtml.length)
    }

    // 2b. Generate Hero (only if hero_section is visible)
    let heroHtml = ''
    if (customizations?.heroStyle && content.visibility?.hero_section !== false) {
        const heroProps = {
            businessName: content.business_name,
            tagline: content.tagline,
            about: content.about,
            heroCta: content.hero_cta,
            photos: photos || [],
            badgeText: content.hero_badge_text,
            testimonial: content.hero_testimonial,
            visibility: content.visibility
        }
        console.log('=== HERO GENERATION ===')
        console.log('Hero props:', {
            businessName: heroProps.businessName,
            tagline: heroProps.tagline,
            about: heroProps.about?.substring(0, 100) + '...',
            badgeText: heroProps.badgeText,
            testimonial: heroProps.testimonial?.substring(0, 50) + '...',
            photosCount: heroProps.photos?.length
        })
        heroHtml = generateHeroHtml(customizations.heroStyle, heroProps)
        console.log('Hero generated, length:', heroHtml.length)
    }

    // 2c. Generate About (only if about_section is visible)
    let aboutHtml = ''
    if (customizations?.aboutStyle && content.visibility?.about_section !== false) {
        // Use about_description if set, otherwise fall back to about
        const aboutDescription = content.about_description || content.about
        // Use about_images if set, otherwise fall back to photos
        const aboutPhotos = content.about_images && content.about_images.length > 0
            ? content.about_images
            : (photos || [])

        const aboutProps = {
            businessName: content.business_name,
            about: aboutDescription,
            photos: aboutPhotos,
            usps: content.unique_selling_points,
            headline: content.about_headline,
            visibility: {
                about_badge: content.visibility?.about_badge,
                about_headline: content.visibility?.about_headline,
                about_description: content.visibility?.about_description,
                about_images: content.visibility?.about_images
            }
        }
        console.log('=== ABOUT GENERATION ===')
        console.log('About props:', {
            businessName: aboutProps.businessName,
            headline: aboutProps.headline,
            about: aboutProps.about?.substring(0, 100) + '...',
            usps: aboutProps.usps,
            photosCount: aboutProps.photos?.length,
            visibility: aboutProps.visibility
        })

        aboutHtml = generateAboutHtml(customizations.aboutStyle, aboutProps)
        console.log('About generated, length:', aboutHtml.length)
    }

    // 2d. Generate Services (only if services_section is visible)
    let servicesHtml = ''
    if (customizations?.servicesStyle && content.visibility?.services_section !== false) {
        // Use services_image if set, otherwise fall back to first photo
        const servicesPhoto = content.services_image
            ? [content.services_image]
            : (photos && photos.length > 0 ? [photos[0]] : [])

        const servicesProps = {
            photos: servicesPhoto,
            services: content.services,
            headline: content.services_headline,
            subheadline: content.services_subheadline,
            visibility: {
                services_badge: content.visibility?.services_badge,
                services_headline: content.visibility?.services_headline,
                services_subheadline: content.visibility?.services_subheadline,
                services_image: content.visibility?.services_image,
                services_list: content.visibility?.services_list
            }
        }
        console.log('=== SERVICES GENERATION ===')
        console.log('Services props:', {
            headline: servicesProps.headline || 'What we do (default)',
            subheadline: servicesProps.subheadline?.substring(0, 50) + '...' || 'Find out which one... (default)',
            photosCount: servicesProps.photos?.length,
            servicesCount: servicesProps.services?.length,
            services: servicesProps.services?.map(s => ({
                name: s.name,
                description: s.description?.substring(0, 80) + '...'
            })),
            visibility: servicesProps.visibility
        })

        servicesHtml = generateServicesHtml(customizations.servicesStyle, servicesProps)
        console.log('Services generated, length:', servicesHtml.length)
    }

    // 2e. Generate Featured (only if featured_section is visible)
    let featuredHtml = ''
    if (customizations?.featuredStyle && content.visibility?.featured_section !== false) {
        const featuredProps = {
            photos: photos || [],
            projects: content.featured_products,
            headline: content.featured_headline,
            subheadline: content.featured_subheadline,
            visibility: {
                featured_headline: content.visibility?.featured_headline,
                featured_subheadline: content.visibility?.featured_subheadline,
                featured_products: content.visibility?.featured_products
            }
        }
        console.log('=== FEATURED GENERATION ===')
        console.log('Featured props:', {
            headline: featuredProps.headline || 'Featured Products (default)',
            subheadline: featuredProps.subheadline?.substring(0, 50) + '...' || 'Take a look... (default)',
            photosCount: featuredProps.photos?.length,
            projectsCount: featuredProps.projects?.length,
            visibility: featuredProps.visibility
        })
        // Log each project in detail
        if (featuredProps.projects && featuredProps.projects.length > 0) {
            featuredProps.projects.forEach((p, i) => {
                console.log(`Featured Product ${i + 1}:`, {
                    title: p?.title || '(missing)',
                    description: p?.description?.substring(0, 80) + '...' || '(missing)',
                    image: p?.image ? 'set' : 'not set',
                    tags: p?.tags || [],
                    hasTestimonial: !!(p?.testimonial?.quote && p?.testimonial?.author),
                    testimonialAuthor: p?.testimonial?.author || '(none)'
                })
            })
        } else {
            console.log('No featured projects provided - will use defaults')
        }

        featuredHtml = generateFeaturedHtml(customizations.featuredStyle, featuredProps)
        console.log('Featured generated, length:', featuredHtml.length)
    }

    // 2f. Generate Footer (only if footer_section is visible)
    let footerHtml = ''
    if (customizations?.footerStyle && content.visibility?.footer_section !== false) {
        const footerProps = {
            businessName: content.business_name,
            email: content.contact?.email || 'contact@example.com',
            phone: content.contact?.phone || '+63 900 000 0000',
            address: content.contact?.address,
            description: content.footer?.brand_blurb,
            socialLinks: content.footer?.social_links,
            visibility: {
                footer_badge: content.visibility?.footer_badge,
                footer_headline: content.visibility?.footer_headline,
                footer_description: content.visibility?.footer_description,
                footer_contact: content.visibility?.footer_contact,
                footer_social: content.visibility?.footer_social
            }
        }
        console.log('=== FOOTER GENERATION ===')
        console.log('Footer props:', {
            businessName: footerProps.businessName,
            email: footerProps.email,
            phone: footerProps.phone,
            address: footerProps.address,
            description: footerProps.description?.substring(0, 50) + '...',
            socialLinksCount: footerProps.socialLinks?.length,
            visibility: footerProps.visibility
        })
        footerHtml = generateFooterHtml(customizations.footerStyle, footerProps)
        console.log('Footer generated, length:', footerHtml.length)
    }

    // STEP 3: Inject components in correct order
    // Order: Navbar (in body before main) -> Hero -> About -> Services -> Featured (all in main) -> Footer (after main)

    // Navbar goes at the beginning of body (before main)
    if (navbarHtml) {
        $('body').prepend(`<div id="navbar-section">${navbarHtml}</div>`)
    }

    // Hero section
    if (heroHtml) {
        $main.append(`<div id="hero-section">${heroHtml}</div>`)
    }

    // About section
    if (aboutHtml) {
        $main.append(`<div id="about-section">${aboutHtml}</div>`)
    }

    // Services section
    if (servicesHtml) {
        $main.append(`<div id="services-section">${servicesHtml}</div>`)
    }

    // Featured section
    if (featuredHtml) {
        $main.append(`<div id="featured-section">${featuredHtml}</div>`)
    }

    // Footer goes after main
    if (footerHtml) {
        $main.after(`<div id="footer-section">${footerHtml}</div>`)
    }

    // STEP 4: Apply color scheme
    if (customizations?.colorSchemeId) {
        const colorCss = generateColorSchemeCss(customizations.colorSchemeId)
        $('head').append(colorCss)
    }

    // STEP 5: Apply font pairing
    if (customizations?.fontPairing) {
        const fontPairs = getFontPairing(customizations.fontPairing)
        if (fontPairs) {
            $('head').append(`
                <link href="https://fonts.googleapis.com/css2?family=${fontPairs.heading.replace(' ', '+')}:wght@300;400;500;600;700&family=${fontPairs.body.replace(' ', '+')}:wght@300;400;500;600&display=swap" rel="stylesheet">
                <style>
                    /* Global font override */
                    * {
                        font-family: '${fontPairs.body}', sans-serif !important;
                    }
                    body, p, span, div, a, button, input, textarea, select {
                        font-family: '${fontPairs.body}', sans-serif !important;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-family: '${fontPairs.heading}', sans-serif !important;
                    }
                    /* Font class overrides */
                    .font-dm-sans {
                        font-family: '${fontPairs.heading}', sans-serif !important;
                    }
                    .font-manrope {
                        font-family: '${fontPairs.body}', sans-serif !important;
                    }
                </style>
            `)
        }
    }

    // Debug output
    console.log('=== FINAL STATE ===')
    const finalHtml = $.html()
    console.log('Final HTML has navbar-section:', finalHtml.includes('id="navbar-section"'))
    console.log('Final HTML has hero-section:', finalHtml.includes('id="hero-section"'))
    console.log('Final HTML has about-section:', finalHtml.includes('id="about-section"'))
    console.log('Final HTML has services-section:', finalHtml.includes('id="services-section"'))
    console.log('Final HTML has footer-section:', finalHtml.includes('id="footer-section"'))

    return finalHtml
}

/**
 * Font pairing presets
 */
const fontPairings: Record<string, { heading: string; body: string }> = {
    'modern': { heading: 'Space Grotesk', body: 'Inter' },
    'classic': { heading: 'Playfair Display', body: 'Source Sans Pro' },
    'elegant': { heading: 'Cormorant Garamond', body: 'Montserrat' },
    'bold': { heading: 'Bebas Neue', body: 'Roboto' },
    'minimal': { heading: 'DM Sans', body: 'DM Sans' },
    'professional': { heading: 'Poppins', body: 'Open Sans' },
    'creative': { heading: 'Righteous', body: 'Nunito' },
    'tech': { heading: 'Orbitron', body: 'Exo 2' },
    'friendly': { heading: 'Quicksand', body: 'Quicksand' },
    'luxury': { heading: 'Cinzel', body: 'Lato' },
}

function getFontPairing(name: string) {
    return fontPairings[name] || fontPairings['modern']
}

export function getAvailableFontPairings() {
    return Object.keys(fontPairings)
}
