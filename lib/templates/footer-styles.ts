/**
 * Footer Section Style Generators
 * Refit-inspired contact/footer section
 */

interface FooterProps {
    businessName: string
    email: string
    phone: string
    address?: string
    description?: string
    socialLinks?: Array<{ platform: string; url: string }>
    visibility?: {
        footer_badge?: boolean
        footer_headline?: boolean
        footer_description?: boolean
        footer_contact?: boolean
        footer_social?: boolean
    }
}

/**
 * Style 1 - Refit-Inspired Contact Footer
 * Dark background with contact info on left, social links below
 * Features: Contact badge, "Get in touch" headline, contact details, social icons
 */
function generateFooterStyle1(props: FooterProps): string {
    const {
        businessName,
        email,
        phone,
        address,
        description = 'For any inquiries or to explore your vision further, we invite you to contact our professional team using the details provided below.',
        socialLinks = [],
        visibility
    } = props

    const year = new Date().getFullYear()

    // Visibility defaults
    const showBadge = visibility?.footer_badge !== false
    const showHeadline = visibility?.footer_headline !== false
    const showDescription = visibility?.footer_description !== false
    const showContact = visibility?.footer_contact !== false
    const showSocial = visibility?.footer_social !== false

    // Default social links if none provided
    const defaultSocialLinks = [
        { platform: 'instagram', url: '#' },
        { platform: 'tiktok', url: '#' },
        { platform: 'twitter', url: '#' }
    ]
    const socialLinksToShow = socialLinks.length > 0 ? socialLinks : defaultSocialLinks

    // Social icon SVGs
    const socialIcons: Record<string, string> = {
        instagram: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
        tiktok: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>`,
        twitter: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        facebook: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`,
        linkedin: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        youtube: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    }

    return `
    <div class="footer-refit-wrapper" id="contact">
        <style>
            .footer-refit-wrapper {
                background-color: var(--footer-bg, #1F2933);
                position: relative;
                overflow: hidden;
            }

            .footer-refit {
                max-width: 1400px;
                margin: 0 auto;
                padding: 5rem 2rem;
            }

            @media (min-width: 768px) {
                .footer-refit {
                    padding: 6rem 4rem;
                }
            }

            @media (min-width: 1024px) {
                .footer-refit {
                    padding: 8rem 5rem;
                }
            }

            /* Content Layout */
            .footer-refit .footer-content {
                display: flex;
                flex-direction: column;
                gap: 3rem;
            }

            /* Badge */
            .footer-refit .footer-badge {
                display: inline-flex;
                align-items: center;
                padding: 0.5rem 1rem;
                background-color: rgba(255, 255, 255, 0.1);
                color: #ffffff;
                border-radius: 100px;
                font-size: 0.85rem;
                font-weight: 500;
                width: fit-content;
            }

            /* Headline */
            .footer-refit .footer-headline {
                font-size: clamp(2.5rem, 5vw, 4rem);
                font-weight: 500;
                line-height: 1.1;
                color: #ffffff;
                letter-spacing: -0.02em;
                margin: 0;
            }

            /* Description */
            .footer-refit .footer-description {
                font-size: 1rem;
                color: rgba(255, 255, 255, 0.65);
                line-height: 1.8;
                margin: 0;
                max-width: 500px;
            }

            /* Contact Info */
            .footer-refit .contact-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1.5rem;
                margin-top: 1rem;
            }

            @media (min-width: 640px) {
                .footer-refit .contact-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (min-width: 768px) {
                .footer-refit .contact-grid {
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }
            }

            .footer-refit .contact-item {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .footer-refit .contact-label {
                font-size: 0.875rem;
                font-weight: 600;
                color: #ffffff;
                margin: 0;
            }

            .footer-refit .contact-value {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.65);
                margin: 0;
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .footer-refit .contact-value:hover {
                color: #ffffff;
            }

            /* Social Section */
            .footer-refit .social-section {
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .footer-refit .social-label {
                font-size: 0.875rem;
                font-weight: 600;
                color: #ffffff;
                margin: 0 0 1rem 0;
            }

            .footer-refit .social-links {
                display: flex;
                gap: 1rem;
            }

            .footer-refit .social-link {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.1);
                color: #ffffff;
                transition: background-color 0.2s ease, transform 0.2s ease;
            }

            .footer-refit .social-link:hover {
                background-color: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            /* Copyright */
            .footer-refit .copyright {
                margin-top: 3rem;
                padding-top: 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            @media (min-width: 768px) {
                .footer-refit .copyright {
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
            }

            .footer-refit .copyright-text {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.5);
                margin: 0;
            }

            .footer-refit .copyright-links {
                display: flex;
                gap: 1.5rem;
            }

            .footer-refit .copyright-link {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.5);
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .footer-refit .copyright-link:hover {
                color: #ffffff;
            }

            /* Animation */
            .footer-refit .fade-in-up {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }

            .footer-refit .fade-in-up.visible {
                opacity: 1;
                transform: translateY(0);
            }
        </style>

        <footer class="footer-refit">
            <div class="footer-content">
                ${showBadge ? `
                <span class="footer-badge fade-in-up font-manrope">Contact</span>
                ` : ''}

                ${showHeadline ? `
                <h2 class="footer-headline fade-in-up font-dm-sans">Get in touch</h2>
                ` : ''}

                ${showDescription ? `
                <p class="footer-description fade-in-up font-manrope">${description}</p>
                ` : ''}

                ${showContact ? `
                <div class="contact-grid fade-in-up">
                    ${address ? `
                    <div class="contact-item">
                        <p class="contact-label font-manrope">Office</p>
                        <p class="contact-value font-manrope">${address}</p>
                    </div>
                    ` : ''}
                    <div class="contact-item">
                        <p class="contact-label font-manrope">Email</p>
                        <a href="mailto:${email}" class="contact-value font-manrope">${email}</a>
                    </div>
                    <div class="contact-item">
                        <p class="contact-label font-manrope">Telephone</p>
                        <a href="tel:${phone.replace(/\s/g, '')}" class="contact-value font-manrope">${phone}</a>
                    </div>
                </div>
                ` : ''}

                ${showSocial ? `
                <div class="social-section fade-in-up">
                    <p class="social-label font-manrope">Follow us</p>
                    <div class="social-links">
                        ${socialLinksToShow.map(link => `
                        <a href="${link.url}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${link.platform}">
                            ${socialIcons[link.platform.toLowerCase()] || socialIcons.instagram}
                        </a>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="copyright fade-in-up">
                    <p class="copyright-text font-manrope">© ${year} ${businessName}. All rights reserved.</p>
                    <div class="copyright-links">
                        <a href="#" class="copyright-link font-manrope">Privacy Policy</a>
                        <a href="#" class="copyright-link font-manrope">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>

        <script>
            // Intersection Observer for footer animations
            (function() {
                const footerSection = document.querySelector('.footer-refit-wrapper');
                if (!footerSection) return;

                const fadeElements = footerSection.querySelectorAll('.fade-in-up');

                if (!('IntersectionObserver' in window)) {
                    fadeElements.forEach(el => el.classList.add('visible'));
                    return;
                }

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.classList.add('visible');
                            }, index * 100);
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    root: null,
                    rootMargin: '0px 0px -50px 0px',
                    threshold: 0.1
                });

                fadeElements.forEach(el => observer.observe(el));
            })();
        </script>
    </div>`
}

/**
 * Main generator function - routes to appropriate style
 */
export function generateFooterHtml(style: string, props: FooterProps): string {
    const generators: Record<string, (props: FooterProps) => string> = {
        '1': generateFooterStyle1,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { FooterProps }
