/**
 * Hero Style Generators
 * Modern hero component for website templates
 */

interface HeroProps {
    businessName: string
    tagline: string
    about: string
    heroCta?: { label: string; link: string }
    photos: string[]
    badgeText?: string
    testimonial?: string
    visibility?: {
        hero_headline?: boolean
        hero_tagline?: boolean
        hero_description?: boolean
        hero_testimonial?: boolean
        hero_button?: boolean
        hero_image?: boolean
    }
}

/**
 * Style 1 - Split Dark Modern (Refit-inspired)
 * Dark background with split layout - content left, hero image right
 * Features: availability badge, bold headline, description, CTA button, floating testimonial
 */
function generateHeroStyle1(props: HeroProps): string {
    const { businessName, tagline, about, heroCta, photos, badgeText, testimonial, visibility } = props
    const mainPhoto = photos[0] || ''
    const displayBadgeText = badgeText // No default - empty means hidden
    const displayTestimonial = testimonial || `${businessName} has been a game changer. The ability to blend function with exquisite design is unparalleled.`

    // Visibility defaults (all visible by default)
    const showHeadline = visibility?.hero_headline !== false
    const showTagline = visibility?.hero_tagline !== false && displayBadgeText
    const showDescription = visibility?.hero_description !== false
    const showTestimonial = visibility?.hero_testimonial !== false
    const showButton = visibility?.hero_button !== false
    const showImage = visibility?.hero_image !== false

    return `
    <div class="hero-refit-wrapper">
        <style>
            .hero-refit-wrapper {
                background-color: var(--hero-bg, #0a0a0a);
                min-height: 100vh;
                position: relative;
                overflow: hidden;
                padding-top: 5rem;
            }

            @media (min-width: 768px) {
                .hero-refit-wrapper {
                    padding-top: 6rem;
                }
            }

            @media (min-width: 1024px) {
                .hero-refit-wrapper {
                    padding-top: 7rem;
                }
            }

            .hero-refit {
                display: grid;
                grid-template-columns: 1fr;
                min-height: 100vh;
                max-width: 1400px;
                margin: 0 auto;
                padding: 2rem;
                gap: 2rem;
            }

            @media (min-width: 768px) {
                .hero-refit {
                    grid-template-columns: 1fr 1fr;
                    padding: 3rem 4rem;
                    gap: 3rem;
                    align-items: center;
                }
            }

            @media (min-width: 1024px) {
                .hero-refit {
                    grid-template-columns: 45% 55%;
                    padding: 4rem 5rem;
                    gap: 4rem;
                }
            }

            /* Content Side */
            .hero-refit .content-side {
                display: flex;
                flex-direction: column;
                justify-content: center;
                order: 2;
                padding-top: 2rem;
            }

            @media (min-width: 768px) {
                .hero-refit .content-side {
                    order: 1;
                    padding-top: 0;
                }
            }

            /* Availability Badge */
            .hero-refit .availability-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 100px;
                width: fit-content;
                margin-bottom: 2rem;
            }

            .hero-refit .availability-badge .dot {
                width: 8px;
                height: 8px;
                background: var(--hero-accent, #6B8F71);
                border-radius: 50%;
                animation: pulse-dot 2s ease-in-out infinite;
            }

            @keyframes pulse-dot {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.2); }
            }

            .hero-refit .availability-badge span {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.85);
                letter-spacing: 0.02em;
            }

            /* Headline */
            .hero-refit h1 {
                font-size: clamp(2.5rem, 6vw, 4.5rem);
                font-weight: 500;
                line-height: 1.1;
                color: var(--hero-text, #ffffff);
                margin-bottom: 1.5rem;
                letter-spacing: -0.02em;
            }

            /* Description */
            .hero-refit .description {
                font-size: clamp(1rem, 1.5vw, 1.125rem);
                color: rgba(255, 255, 255, 0.65);
                line-height: 1.7;
                max-width: 420px;
                margin-bottom: 2.5rem;
            }

            /* CTA Button */
            .hero-refit .cta-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                padding: 1rem 1.5rem;
                background: var(--hero-text, #ffffff);
                color: var(--hero-bg, #0a0a0a);
                font-size: 0.9rem;
                font-weight: 500;
                border-radius: 100px;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                width: fit-content;
            }

            .hero-refit .cta-button:hover {
                transform: scale(1.03);
                box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15);
            }

            .hero-refit .cta-button .arrow-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                background: var(--hero-bg, #0a0a0a);
                border-radius: 50%;
                transition: transform 0.3s ease;
            }

            .hero-refit .cta-button:hover .arrow-icon {
                transform: rotate(45deg);
            }

            .hero-refit .cta-button .arrow-icon svg {
                stroke: var(--hero-text, #ffffff);
            }

            /* Image Side */
            .hero-refit .image-side {
                position: relative;
                order: 1;
                min-height: 300px;
            }

            @media (min-width: 768px) {
                .hero-refit .image-side {
                    order: 2;
                    min-height: auto;
                    height: 100%;
                }
            }

            .hero-refit .image-container {
                position: relative;
                width: 100%;
                height: 100%;
                min-height: 350px;
                border-radius: 16px;
                overflow: hidden;
            }

            @media (min-width: 768px) {
                .hero-refit .image-container {
                    min-height: 500px;
                    border-radius: 20px;
                }
            }

            @media (min-width: 1024px) {
                .hero-refit .image-container {
                    min-height: 600px;
                    border-radius: 24px;
                }
            }

            .hero-refit .image-container img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }

            /* Floating Testimonial Card */
            .hero-refit .testimonial-card {
                position: absolute;
                bottom: 1.5rem;
                right: 1rem;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 12px;
                padding: 1rem;
                max-width: 280px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                display: none;
            }

            @media (min-width: 768px) {
                .hero-refit .testimonial-card {
                    display: block;
                    bottom: 2rem;
                    right: 1.5rem;
                    padding: 1.25rem;
                }
            }

            @media (min-width: 1024px) {
                .hero-refit .testimonial-card {
                    bottom: 2.5rem;
                    right: 2rem;
                    max-width: 300px;
                    padding: 1.5rem;
                }
            }

            .hero-refit .testimonial-stars {
                display: flex;
                gap: 0.25rem;
                margin-bottom: 0.75rem;
            }

            .hero-refit .testimonial-stars svg {
                width: 14px;
                height: 14px;
                fill: var(--hero-accent, #6B8F71);
            }

            .hero-refit .testimonial-text {
                font-size: 0.85rem;
                color: #1a1a1a;
                line-height: 1.6;
                margin-bottom: 0;
                font-style: italic;
            }

            /* Navigation hint (optional floating element) */
            .hero-refit .nav-hint {
                position: absolute;
                top: 1rem;
                right: 1rem;
                display: flex;
                gap: 1.5rem;
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.6);
            }

            @media (min-width: 768px) {
                .hero-refit .nav-hint {
                    top: 1.5rem;
                    right: 1.5rem;
                }
            }

            .hero-refit .nav-hint a {
                color: rgba(255, 255, 255, 0.6);
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .hero-refit .nav-hint a:hover {
                color: var(--hero-text, #ffffff);
            }
        </style>

        <section class="hero-refit">
            <div class="content-side">
                ${showTagline ? `
                <div class="availability-badge">
                    <span class="dot"></span>
                    <span class="font-manrope">${displayBadgeText}</span>
                </div>
                ` : ''}

                ${showHeadline ? `<h1 class="font-dm-sans">${tagline}</h1>` : ''}

                ${showDescription ? `<p class="description font-manrope">${about}</p>` : ''}

                ${showButton ? `
                <a href="${heroCta?.link || '#services'}" class="cta-button font-manrope">
                    ${heroCta?.label || 'Work with us'}
                    <span class="arrow-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M7 7h10v10"/>
                            <path d="M7 17L17 7"/>
                        </svg>
                    </span>
                </a>
                ` : ''}
            </div>

            ${showImage ? `
            <div class="image-side">
                <div class="image-container">
                    <img src="${mainPhoto}" alt="${businessName}" class="hero-image">

                    ${showTestimonial ? `
                    <div class="testimonial-card">
                        <div class="testimonial-stars">
                            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        </div>
                        <p class="testimonial-text font-manrope">"${displayTestimonial}"</p>
                    </div>
                    ` : ''}
                </div>
            </div>
            ` : ''}
        </section>
    </div>`
}

/**
 * Main generator function - routes to appropriate style
 */
export function generateHeroHtml(style: string, props: HeroProps): string {
    const generators: Record<string, (props: HeroProps) => string> = {
        '1': generateHeroStyle1,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { HeroProps }
