/**
 * Featured Products Section Style Generators
 * Modern featured/portfolio section with scroll reveal effect
 */

interface FeaturedProduct {
    title: string
    description: string
    image?: string
    tags?: string[]
    testimonial?: {
        quote: string
        author: string
        avatar?: string
    }
}

interface FeaturedProps {
    photos: string[]
    projects?: FeaturedProduct[]
    headline?: string
    subheadline?: string
    visibility?: {
        featured_headline?: boolean
        featured_subheadline?: boolean
        featured_products?: boolean
    }
}

/**
 * Style 1 - Refit-Inspired Featured Section
 * Scroll-triggered reveal cards with testimonials
 * Features: Large project cards, testimonials, tags, scroll-up reveal animation
 */
function generateFeaturedStyle1(props: FeaturedProps): string {
    const {
        photos,
        projects = [],
        headline = 'Featured Products',
        subheadline = 'Take a look at some of our recent work',
        visibility
    } = props

    // Default projects if none provided - also validate that existing projects have required fields
    const validProducts = projects.filter(p => p && p.title && p.description)

    const defaultProducts: FeaturedProduct[] = [
        {
            title: 'Modern kitchen refit',
            description: 'This kitchen transformation brought sleek, modern design and enhanced functionality to our client\'s home. We installed custom cabinetry, high-quality worktops, and state-of-the-art appliances, creating a stylish yet practical space perfect for cooking and entertaining.',
            tags: ['Kitchen', '4 weeks'],
            testimonial: {
                quote: 'Refit completely transformed our kitchen, making it both beautiful and highly functional. The craftsmanship was outstanding, and the team was professional and communicative throughout. We couldn\'t be happier with the result!',
                author: 'Rachel Morgan'
            }
        },
        {
            title: 'External garden path build',
            description: 'Our team designed and built a durable, visually appealing garden path to enhance our client\'s outdoor space. Using high-quality materials, we created a seamless walkway that complements the garden\'s natural beauty.',
            tags: ['External', '2 weeks'],
            testimonial: {
                quote: 'The garden path exceeded our expectations. It\'s both practical and beautiful, perfectly blending with our landscape.',
                author: 'James Wilson'
            }
        },
        {
            title: 'Complete bathroom renovation',
            description: 'A full bathroom transformation featuring modern fixtures, custom tiling, and elegant finishes. We maximized space efficiency while creating a spa-like atmosphere.',
            tags: ['Bathroom', '3 weeks'],
            testimonial: {
                quote: 'Our new bathroom feels like a luxury spa. The attention to detail was incredible.',
                author: 'Sarah Chen'
            }
        }
    ]

    const productList: FeaturedProduct[] = validProducts.length > 0 ? validProducts : defaultProducts

    // Assign photos to projects and ensure all fields are safe
    const productsWithPhotos = productList.map((project, index) => ({
        title: project.title || `Project ${index + 1}`,
        description: project.description || 'A showcase of our quality work.',
        image: project.image || photos[index % Math.max(photos.length, 1)] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2000',
        tags: project.tags && Array.isArray(project.tags) ? project.tags : [],
        testimonial: project.testimonial && project.testimonial.quote && project.testimonial.author
            ? project.testimonial
            : undefined
    }))

    // Visibility defaults
    const showHeadline = visibility?.featured_headline !== false
    const showSubheadline = visibility?.featured_subheadline !== false
    const showProducts = visibility?.featured_products !== false

    return `
    <div class="featured-refit-wrapper" id="featured">
        <style>
            .featured-refit-wrapper {
                background-color: var(--featured-bg, #F6F7F5);
                position: relative;
                overflow: hidden;
            }

            .featured-refit {
                max-width: 1400px;
                margin: 0 auto;
            }

            /* Header Section */
            .featured-refit .header-section {
                text-align: center;
                padding: 5rem 2rem 3rem;
            }

            @media (min-width: 768px) {
                .featured-refit .header-section {
                    padding: 6rem 4rem 4rem;
                }
            }

            @media (min-width: 1024px) {
                .featured-refit .header-section {
                    padding: 8rem 5rem 5rem;
                }
            }

            /* Headline */
            .featured-refit .headline {
                font-size: clamp(2.5rem, 5vw, 4rem);
                font-weight: 500;
                line-height: 1.1;
                color: var(--featured-headline, #1F2933);
                letter-spacing: -0.02em;
                margin: 0 0 1rem 0;
            }

            /* Subheadline */
            .featured-refit .subheadline {
                font-size: clamp(1rem, 1.5vw, 1.125rem);
                color: var(--featured-text, rgba(31, 41, 51, 0.65));
                line-height: 1.6;
                margin: 0;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }

            /* Project Cards Container */
            .featured-refit .projects-container {
                display: flex;
                flex-direction: column;
                gap: 0;
            }

            /* Individual Project Card */
            .featured-refit .product-card {
                position: relative;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                background-color: var(--featured-card-bg, #ffffff);
            }

            @media (min-width: 768px) {
                .featured-refit .product-card {
                    padding: 4rem;
                }
            }

            /* Alternating backgrounds */
            .featured-refit .product-card:nth-child(odd) {
                background-color: var(--featured-card-bg, #ffffff);
            }

            .featured-refit .product-card:nth-child(even) {
                background-color: var(--featured-card-alt-bg, #1F2933);
            }

            .featured-refit .product-card:nth-child(even) .product-title,
            .featured-refit .product-card:nth-child(even) .product-description,
            .featured-refit .product-card:nth-child(even) .testimonial-quote,
            .featured-refit .product-card:nth-child(even) .testimonial-author {
                color: #ffffff;
            }

            .featured-refit .product-card:nth-child(even) .product-description {
                color: rgba(255, 255, 255, 0.75);
            }

            .featured-refit .product-card:nth-child(even) .product-tag {
                background-color: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }

            /* Project Content Layout */
            .featured-refit .product-content {
                max-width: 1200px;
                width: 100%;
                display: grid;
                grid-template-columns: 1fr;
                gap: 2rem;
                align-items: center;
            }

            @media (min-width: 1024px) {
                .featured-refit .product-content {
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                }
            }

            /* Project Image */
            .featured-refit .product-image-wrapper {
                position: relative;
                border-radius: 16px;
                overflow: hidden;
                aspect-ratio: 4/3;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            }

            .featured-refit .product-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                transition: transform 0.7s ease;
            }

            .featured-refit .product-image-wrapper:hover .product-image {
                transform: scale(1.05);
            }

            /* Project Info */
            .featured-refit .product-info {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .featured-refit .product-title {
                font-size: clamp(1.75rem, 3vw, 2.5rem);
                font-weight: 500;
                line-height: 1.2;
                color: var(--featured-headline, #1F2933);
                margin: 0;
            }

            .featured-refit .product-description {
                font-size: 1rem;
                color: var(--featured-text, rgba(31, 41, 51, 0.75));
                line-height: 1.8;
                margin: 0;
            }

            /* Project Tags */
            .featured-refit .product-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .featured-refit .product-tag {
                display: inline-flex;
                align-items: center;
                padding: 0.5rem 1rem;
                background-color: var(--featured-tag-bg, rgba(31, 41, 51, 0.05));
                color: var(--featured-headline, #1F2933);
                border-radius: 100px;
                font-size: 0.85rem;
                font-weight: 500;
            }

            /* Testimonial */
            .featured-refit .testimonial {
                margin-top: 1rem;
                padding-top: 1.5rem;
                border-top: 1px solid var(--featured-border, rgba(31, 41, 51, 0.1));
            }

            .featured-refit .product-card:nth-child(even) .testimonial {
                border-top-color: rgba(255, 255, 255, 0.1);
            }

            .featured-refit .testimonial-quote {
                font-size: 1rem;
                color: var(--featured-text, rgba(31, 41, 51, 0.75));
                line-height: 1.8;
                margin: 0 0 1rem 0;
                font-style: italic;
                position: relative;
                padding-left: 1.5rem;
            }

            .featured-refit .testimonial-quote::before {
                content: '"';
                position: absolute;
                left: 0;
                top: -0.25rem;
                font-size: 2rem;
                font-weight: 700;
                color: var(--featured-accent, #6B8F71);
                line-height: 1;
            }

            .featured-refit .testimonial-author-wrapper {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .featured-refit .testimonial-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: var(--featured-tag-bg, rgba(31, 41, 51, 0.1));
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .featured-refit .testimonial-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .featured-refit .testimonial-avatar-placeholder {
                font-size: 1rem;
                font-weight: 600;
                color: var(--featured-headline, #1F2933);
            }

            .featured-refit .product-card:nth-child(even) .testimonial-avatar-placeholder {
                color: #ffffff;
            }

            .featured-refit .testimonial-author {
                font-size: 0.9rem;
                font-weight: 500;
                color: var(--featured-headline, #1F2933);
                margin: 0;
            }

            /* Cards are visible by default - animation will hide and reveal */
            .featured-refit .product-card {
                opacity: 1;
                transform: translateY(0);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }

            /* Animation state - hidden before scroll reveals */
            .featured-refit .product-card.animate-hidden {
                opacity: 0;
                transform: translateY(100px);
            }

            .featured-refit .product-card.animate-visible {
                opacity: 1;
                transform: translateY(0);
            }

            /* Sticky scroll effect for overlapping cards */
            @media (min-width: 1024px) {
                .featured-refit .product-card {
                    position: sticky;
                    top: 0;
                }

                .featured-refit .product-card:nth-child(1) { z-index: 1; }
                .featured-refit .product-card:nth-child(2) { z-index: 2; }
                .featured-refit .product-card:nth-child(3) { z-index: 3; }
                .featured-refit .product-card:nth-child(4) { z-index: 4; }
                .featured-refit .product-card:nth-child(5) { z-index: 5; }
                .featured-refit .product-card:nth-child(6) { z-index: 6; }
            }

            /* Staggered animation delays */
            .featured-refit .header-section .headline { transition-delay: 0s; }
            .featured-refit .header-section .subheadline { transition-delay: 0.1s; }

            /* Fade in up elements - visible by default for iframe compatibility */
            .featured-refit .fade-in-up {
                opacity: 1;
                transform: translateY(0);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }

            .featured-refit .fade-in-up.animate-hidden {
                opacity: 0;
                transform: translateY(40px);
            }

            .featured-refit .fade-in-up.animate-visible {
                opacity: 1;
                transform: translateY(0);
            }
        </style>

        <section class="featured-refit">
            ${showHeadline || showSubheadline ? `
            <div class="header-section">
                ${showHeadline ? `
                <h2 class="headline fade-in-up font-dm-sans">${headline}</h2>
                ` : ''}

                ${showSubheadline ? `
                <p class="subheadline fade-in-up font-manrope">${subheadline}</p>
                ` : ''}
            </div>
            ` : ''}

            ${showProducts ? `
            <div class="projects-container">
                ${productsWithPhotos.map((project, index) => {
                    const safeTitle = project.title || `Project ${index + 1}`
                    const safeDescription = project.description || 'A showcase of our quality work.'
                    const safeImage = project.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2000'
                    const safeTags = project.tags || []
                    const hasTestimonial = project.testimonial && project.testimonial.quote && project.testimonial.author
                    const safeAuthorInitial = hasTestimonial ? (project.testimonial?.author?.charAt(0) || 'A') : ''

                    return `
                <div class="product-card visible" data-index="${index}">
                    <div class="product-content">
                        <div class="product-image-wrapper">
                            <img src="${safeImage}" alt="${safeTitle}" class="product-image" loading="lazy">
                        </div>
                        <div class="product-info">
                            <h3 class="product-title font-dm-sans">${safeTitle}</h3>
                            <p class="product-description font-manrope">${safeDescription}</p>
                            ${safeTags.length > 0 ? `
                            <div class="product-tags">
                                ${safeTags.map(tag => `
                                <span class="product-tag font-manrope">${tag || ''}</span>
                                `).join('')}
                            </div>
                            ` : ''}
                            ${hasTestimonial ? `
                            <div class="testimonial">
                                <p class="testimonial-quote font-manrope">${project.testimonial?.quote || ''}</p>
                                <div class="testimonial-author-wrapper">
                                    <div class="testimonial-avatar">
                                        ${project.testimonial?.avatar
                                            ? `<img src="${project.testimonial.avatar}" alt="${project.testimonial?.author || 'Author'}">`
                                            : `<span class="testimonial-avatar-placeholder">${safeAuthorInitial}</span>`
                                        }
                                    </div>
                                    <p class="testimonial-author font-manrope">${project.testimonial?.author || 'Customer'}</p>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                `}).join('')}
            </div>
            ` : ''}
        </section>

        <script>
            // Intersection Observer for scroll animations - works in iframe context
            (function initFeaturedAnimations() {
                // Delay initialization to ensure DOM is ready in iframe
                function setupAnimations() {
                    const featuredSection = document.querySelector('.featured-refit-wrapper');
                    if (!featuredSection) {
                        // Retry if section not found yet
                        setTimeout(setupAnimations, 100);
                        return;
                    }

                    // Get elements
                    const fadeElements = featuredSection.querySelectorAll('.fade-in-up');
                    const productCards = featuredSection.querySelectorAll('.product-card');

                    // Check if Intersection Observer is available
                    if (!('IntersectionObserver' in window)) {
                        // Fallback: make everything visible immediately
                        fadeElements.forEach(el => el.classList.add('animate-visible'));
                        productCards.forEach(card => card.classList.add('animate-visible'));
                        return;
                    }

                    // First hide elements that will be animated
                    fadeElements.forEach(el => el.classList.add('animate-hidden'));
                    productCards.forEach((card, index) => {
                        // Add staggered delay for initial animation
                        card.style.transitionDelay = (index * 0.15) + 's';
                        card.classList.add('animate-hidden');
                    });

                    // Observer for header elements
                    const headerObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.remove('animate-hidden');
                                entry.target.classList.add('animate-visible');
                                headerObserver.unobserve(entry.target);
                            }
                        });
                    }, {
                        root: null,
                        rootMargin: '0px 0px -50px 0px',
                        threshold: 0.1
                    });

                    fadeElements.forEach(el => headerObserver.observe(el));

                    // Observer for project cards with scroll reveal
                    const cardObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.remove('animate-hidden');
                                entry.target.classList.add('animate-visible');
                                cardObserver.unobserve(entry.target);
                            }
                        });
                    }, {
                        root: null,
                        rootMargin: '0px 0px -100px 0px',
                        threshold: 0.15
                    });

                    productCards.forEach(card => cardObserver.observe(card));

                    console.log('Featured section animations initialized:', {
                        fadeElements: fadeElements.length,
                        productCards: productCards.length
                    });
                }

                // Initialize when DOM is ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', setupAnimations);
                } else {
                    // DOM already ready, initialize after a small delay for iframe
                    setTimeout(setupAnimations, 50);
                }
            })();
        </script>
    </div>`
}

/**
 * Main generator function - routes to appropriate style
 */
export function generateFeaturedHtml(style: string, props: FeaturedProps): string {
    const generators: Record<string, (props: FeaturedProps) => string> = {
        '1': generateFeaturedStyle1,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { FeaturedProps, FeaturedProduct }
