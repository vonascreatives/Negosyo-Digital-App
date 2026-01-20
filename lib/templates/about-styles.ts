/**
 * About Section Style Generators
 * Modern about section components for website templates
 */

interface AboutProps {
    businessName: string
    about: string
    photos: string[]
    stats?: { label: string; value: string }[]
    usps?: string[]
    headline?: string
    visibility?: {
        about_badge?: boolean
        about_headline?: boolean
        about_description?: boolean
        about_images?: boolean
    }
}

/**
 * Style 1 - Refit-Inspired About Section
 * Light background with split layout - headline left, description right
 * Features: About us badge, large headline, description, 4-image horizontal gallery
 * Includes scroll-triggered animations for content and images
 */
function generateAboutStyle1(props: AboutProps): string {
    const { businessName, about, photos, usps = [], headline: customHeadline, visibility } = props

    // Get up to 4 photos for the gallery
    const galleryPhotos = photos.slice(0, 4)

    // Use custom headline if provided, otherwise generate from USPs or use business type
    const headline = customHeadline
        ? customHeadline
        : (usps.length > 0
            ? usps.slice(0, 3).join(' ')
            : `${businessName} specialists`)

    // Visibility defaults (all visible by default)
    const showBadge = visibility?.about_badge !== false
    const showHeadline = visibility?.about_headline !== false
    const showDescription = visibility?.about_description !== false
    const showImages = visibility?.about_images !== false

    return `
    <div class="about-refit-wrapper" id="about">
        <style>
            .about-refit-wrapper {
                background-color: var(--background, #F6F7F5);
                padding: 5rem 2rem;
                position: relative;
                overflow: hidden;
            }

            @media (min-width: 768px) {
                .about-refit-wrapper {
                    padding: 6rem 4rem;
                }
            }

            @media (min-width: 1024px) {
                .about-refit-wrapper {
                    padding: 8rem 5rem;
                }
            }

            .about-refit {
                max-width: 1400px;
                margin: 0 auto;
            }

            /* Content Section - Split Layout */
            .about-refit .content-section {
                display: grid;
                grid-template-columns: 1fr;
                gap: 2rem;
                margin-bottom: 4rem;
            }

            @media (min-width: 768px) {
                .about-refit .content-section {
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    margin-bottom: 5rem;
                }
            }

            @media (min-width: 1024px) {
                .about-refit .content-section {
                    grid-template-columns: 45% 55%;
                    gap: 4rem;
                    margin-bottom: 6rem;
                }
            }

            /* Left Side - Badge and Headline */
            .about-refit .content-left {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            }

            /* About Badge */
            .about-refit .about-badge {
                display: inline-flex;
                align-items: center;
                padding: 0.5rem 1rem;
                background: var(--secondary, #1F2933);
                color: #ffffff;
                border-radius: 100px;
                width: fit-content;
                margin-bottom: 1.5rem;
                font-size: 0.85rem;
                letter-spacing: 0.02em;
            }

            /* Headline */
            .about-refit .headline {
                font-size: clamp(2.5rem, 5vw, 4rem);
                font-weight: 500;
                line-height: 1.1;
                color: var(--secondary, #1F2933);
                letter-spacing: -0.02em;
                margin: 0;
            }

            /* Right Side - Description */
            .about-refit .content-right {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .about-refit .description {
                font-size: clamp(1rem, 1.5vw, 1.125rem);
                color: rgba(31, 41, 51, 0.75);
                line-height: 1.8;
                margin: 0;
            }

            /* Image Gallery */
            .about-refit .image-gallery {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }

            @media (min-width: 768px) {
                .about-refit .image-gallery {
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }
            }

            .about-refit .gallery-image {
                position: relative;
                aspect-ratio: 3/4;
                border-radius: 12px;
                overflow: hidden;
            }

            @media (min-width: 768px) {
                .about-refit .gallery-image {
                    border-radius: 16px;
                }
            }

            .about-refit .gallery-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                transition: transform 0.5s ease;
            }

            .about-refit .gallery-image:hover img {
                transform: scale(1.05);
            }

            /* Scroll Animation Styles */
            .about-refit .fade-in-up {
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }

            .about-refit .fade-in-up.visible {
                opacity: 1;
                transform: translateY(0);
            }

            /* Staggered animation delays for gallery images */
            .about-refit .gallery-image:nth-child(1) { transition-delay: 0.1s; }
            .about-refit .gallery-image:nth-child(2) { transition-delay: 0.2s; }
            .about-refit .gallery-image:nth-child(3) { transition-delay: 0.3s; }
            .about-refit .gallery-image:nth-child(4) { transition-delay: 0.4s; }

            /* Content stagger */
            .about-refit .content-left .fade-in-up:nth-child(1) { transition-delay: 0s; }
            .about-refit .content-left .fade-in-up:nth-child(2) { transition-delay: 0.15s; }
            .about-refit .content-right .fade-in-up { transition-delay: 0.3s; }
        </style>

        <section class="about-refit">
            <div class="content-section">
                <div class="content-left">
                    ${showBadge ? `
                    <div class="about-badge fade-in-up font-manrope">
                        About us
                    </div>
                    ` : ''}

                    ${showHeadline ? `
                    <h2 class="headline fade-in-up font-dm-sans">${headline}</h2>
                    ` : ''}
                </div>

                <div class="content-right">
                    ${showDescription ? `
                    <p class="description fade-in-up font-manrope">${about}</p>
                    ` : ''}
                </div>
            </div>

            ${showImages && galleryPhotos.length > 0 ? `
            <div class="image-gallery">
                ${galleryPhotos.map((photo, index) => `
                <div class="gallery-image fade-in-up">
                    <img src="${photo}" alt="${businessName} - Image ${index + 1}" loading="lazy">
                </div>
                `).join('')}
            </div>
            ` : ''}
        </section>

        <script>
            // Intersection Observer for scroll animations
            (function() {
                const aboutSection = document.querySelector('.about-refit-wrapper');
                if (!aboutSection) return;

                const fadeElements = aboutSection.querySelectorAll('.fade-in-up');

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
export function generateAboutHtml(style: string, props: AboutProps): string {
    const generators: Record<string, (props: AboutProps) => string> = {
        '1': generateAboutStyle1,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { AboutProps }
