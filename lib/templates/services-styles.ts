/**
 * Services Section Style Generators
 * Modern services components for website templates
 */

interface ServicesProps {
    photos: string[]
    services?: Array<{ name: string; description: string }>
    headline?: string
    subheadline?: string
    visibility?: {
        services_badge?: boolean
        services_headline?: boolean
        services_subheadline?: boolean
        services_image?: boolean
        services_list?: boolean
    }
}

// Service icons as inline SVGs for the accordion
const serviceIcons = [
    // Kitchens/Home icon
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>`,
    // Loft/Building icon
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M9 4v16M15 4v16M4 9h16M4 15h16"/>
    </svg>`,
    // Bathroom/Droplet icon
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
    </svg>`,
    // Extensions/Expand icon
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon">
        <path d="M21 3h-6m6 0v6m0-6l-9 9M3 21h6m-6 0v-6m0 6l9-9"/>
    </svg>`,
    // Restorations/Refresh icon
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon">
        <path d="M23 4v6h-6M1 20v-6h6"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>`,
    // External/Outdoor icon
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
    </svg>`,
]

/**
 * Style 1 - Refit-Inspired Services Section
 * Light background with accordion-style service list
 * Features: Services badge, headline, image gallery on left, accordion list on right
 * Includes scroll-triggered animations and click-to-expand functionality
 */
function generateServicesStyle1(props: ServicesProps): string {
    const {
        photos,
        services = [],
        headline = 'What we do',
        subheadline = 'Find out which one of our services fit the needs of your project',
        visibility
    } = props

    // Default services if none provided
    const serviceList = services.length > 0 ? services : [
        { name: 'Kitchens', description: 'We design and build stunning kitchens tailored to your style and needs. Whether you\'re after a sleek modern space or a classic, timeless look, our expert team delivers high-quality craftsmanship, functionality, and attention to detail to create the heart of your home.' },
        { name: 'Loft Conversions', description: 'Transform your unused loft space into a beautiful, functional room. From home offices to extra bedrooms, we handle everything from design to completion with expert craftsmanship.' },
        { name: 'Bathrooms', description: 'Create your perfect bathroom sanctuary. We specialize in luxury bathroom renovations, from contemporary minimalist designs to traditional elegant spaces.' },
        { name: 'Extensions', description: 'Expand your living space with a professionally designed and built extension. We work with you to create seamless additions that enhance your home\'s value and functionality.' },
        { name: 'Restorations', description: 'Breathe new life into period properties with our expert restoration services. We preserve character while updating for modern living, respecting the original craftsmanship.' },
        { name: 'External Works', description: 'Complete your property with professional external works including driveways, patios, landscaping, and outdoor living spaces designed to complement your home.' }
    ]

    // Get main photo for the image section
    const mainPhoto = photos && photos.length > 0
        ? photos[0]
        : 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2000'

    // Visibility defaults
    const showBadge = visibility?.services_badge !== false
    const showHeadline = visibility?.services_headline !== false
    const showSubheadline = visibility?.services_subheadline !== false
    const showImage = visibility?.services_image !== false
    const showList = visibility?.services_list !== false

    return `
    <div class="services-refit-wrapper" id="services">
        <style>
            .services-refit-wrapper {
                background-color: var(--services-bg, #ffffff);
                padding: 5rem 2rem;
                position: relative;
                overflow: hidden;
            }

            @media (min-width: 768px) {
                .services-refit-wrapper {
                    padding: 6rem 4rem;
                }
            }

            @media (min-width: 1024px) {
                .services-refit-wrapper {
                    padding: 8rem 5rem;
                }
            }

            .services-refit {
                max-width: 1400px;
                margin: 0 auto;
            }

            /* Header Section */
            .services-refit .header-section {
                text-align: center;
                margin-bottom: 4rem;
            }

            /* Services Badge */
            .services-refit .services-badge {
                display: inline-flex;
                align-items: center;
                padding: 0.5rem 1rem;
                background: var(--services-badge-bg, #1F2933);
                color: var(--services-badge-text, #ffffff);
                border-radius: 100px;
                margin-bottom: 1.5rem;
                font-size: 0.85rem;
                letter-spacing: 0.02em;
            }

            /* Headline */
            .services-refit .headline {
                font-size: clamp(2.5rem, 5vw, 4rem);
                font-weight: 500;
                line-height: 1.1;
                color: var(--services-headline, #1F2933);
                letter-spacing: -0.02em;
                margin: 0 0 1rem 0;
            }

            /* Subheadline */
            .services-refit .subheadline {
                font-size: clamp(1rem, 1.5vw, 1.125rem);
                color: var(--services-text, rgba(31, 41, 51, 0.65));
                line-height: 1.6;
                margin: 0;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }

            /* Main Content - Split Layout */
            .services-refit .content-section {
                display: grid;
                grid-template-columns: 1fr;
                gap: 3rem;
            }

            @media (min-width: 1024px) {
                .services-refit .content-section {
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: start;
                }
            }

            /* Left Side - Image */
            .services-refit .image-section {
                position: relative;
                border-radius: 16px;
                overflow: hidden;
                aspect-ratio: 4/5;
            }

            @media (min-width: 1024px) {
                .services-refit .image-section {
                    position: sticky;
                    top: 2rem;
                    aspect-ratio: 3/4;
                }
            }

            .services-refit .image-section img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                transition: transform 0.7s ease;
            }

            .services-refit .image-section:hover img {
                transform: scale(1.03);
            }

            /* Right Side - Services List */
            .services-refit .services-list {
                display: flex;
                flex-direction: column;
            }

            /* Service Item */
            .services-refit .service-item {
                border-bottom: 1px solid var(--services-border, rgba(31, 41, 51, 0.1));
                overflow: hidden;
            }

            .services-refit .service-item:first-child {
                border-top: 1px solid var(--services-border, rgba(31, 41, 51, 0.1));
            }

            .services-refit .service-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.5rem 0;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .services-refit .service-header:hover {
                padding-left: 0.5rem;
            }

            .services-refit .service-header-left {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .services-refit .service-icon {
                width: 24px;
                height: 24px;
                color: var(--services-icon, #1F2933);
                flex-shrink: 0;
            }

            .services-refit .service-name {
                font-size: 1.25rem;
                font-weight: 500;
                color: var(--services-headline, #1F2933);
                margin: 0;
                transition: color 0.3s ease;
            }

            .services-refit .service-header:hover .service-name {
                color: var(--services-accent, #6B8F71);
            }

            .services-refit .service-toggle {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--services-icon, #1F2933);
                transition: transform 0.3s ease;
            }

            .services-refit .service-item.active .service-toggle {
                transform: rotate(45deg);
            }

            .services-refit .service-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.4s ease-out, padding 0.3s ease;
            }

            .services-refit .service-item.active .service-content {
                max-height: 300px;
                padding-bottom: 1.5rem;
            }

            .services-refit .service-description {
                font-size: 1rem;
                color: var(--services-text, rgba(31, 41, 51, 0.75));
                line-height: 1.8;
                margin: 0;
                padding-left: 2.5rem;
            }

            /* Scroll Animation Styles */
            .services-refit .fade-in-up {
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }

            .services-refit .fade-in-up.visible {
                opacity: 1;
                transform: translateY(0);
            }

            /* Staggered animation delays */
            .services-refit .header-section .fade-in-up:nth-child(1) { transition-delay: 0s; }
            .services-refit .header-section .fade-in-up:nth-child(2) { transition-delay: 0.1s; }
            .services-refit .header-section .fade-in-up:nth-child(3) { transition-delay: 0.2s; }
            .services-refit .image-section { transition-delay: 0.3s; }
            .services-refit .service-item:nth-child(1) { transition-delay: 0.1s; }
            .services-refit .service-item:nth-child(2) { transition-delay: 0.15s; }
            .services-refit .service-item:nth-child(3) { transition-delay: 0.2s; }
            .services-refit .service-item:nth-child(4) { transition-delay: 0.25s; }
            .services-refit .service-item:nth-child(5) { transition-delay: 0.3s; }
            .services-refit .service-item:nth-child(6) { transition-delay: 0.35s; }
        </style>

        <section class="services-refit">
            <div class="header-section">
                ${showBadge ? `
                <div class="services-badge fade-in-up font-manrope">
                    Services
                </div>
                ` : ''}

                ${showHeadline ? `
                <h2 class="headline fade-in-up font-dm-sans">${headline}</h2>
                ` : ''}

                ${showSubheadline ? `
                <p class="subheadline fade-in-up font-manrope">${subheadline}</p>
                ` : ''}
            </div>

            <div class="content-section">
                ${showImage ? `
                <div class="image-section fade-in-up">
                    <img src="${mainPhoto}" alt="Our services" loading="lazy" id="services-main-image">
                </div>
                ` : ''}

                ${showList ? `
                <div class="services-list">
                    ${serviceList.map((service, index) => `
                    <div class="service-item fade-in-up${index === 0 ? ' active' : ''}" data-index="${index}">
                        <div class="service-header" onclick="toggleService(this)">
                            <div class="service-header-left">
                                ${serviceIcons[index % serviceIcons.length]}
                                <h3 class="service-name font-dm-sans">${service.name}</h3>
                            </div>
                            <div class="service-toggle">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="8" y1="2" x2="8" y2="14"/>
                                    <line x1="2" y1="8" x2="14" y2="8"/>
                                </svg>
                            </div>
                        </div>
                        <div class="service-content">
                            <p class="service-description font-manrope">${service.description}</p>
                        </div>
                    </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        </section>

        <script>
            // Toggle service accordion
            function toggleService(header) {
                const item = header.closest('.service-item');
                const wasActive = item.classList.contains('active');

                // Close all items
                document.querySelectorAll('.services-refit .service-item').forEach(el => {
                    el.classList.remove('active');
                });

                // Open clicked item if it wasn't active
                if (!wasActive) {
                    item.classList.add('active');
                }
            }

            // Intersection Observer for scroll animations
            (function() {
                const servicesSection = document.querySelector('.services-refit-wrapper');
                if (!servicesSection) return;

                const fadeElements = servicesSection.querySelectorAll('.fade-in-up');

                const observerOptions = {
                    root: null,
                    rootMargin: '0px 0px -100px 0px',
                    threshold: 0.1
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);

                fadeElements.forEach(el => observer.observe(el));
            })();
        </script>
    </div>`
}

/**
 * Main generator function - routes to appropriate style
 */
export function generateServicesHtml(style: string, props: ServicesProps): string {
    const generators: Record<string, (props: ServicesProps) => string> = {
        '1': generateServicesStyle1,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { ServicesProps }
