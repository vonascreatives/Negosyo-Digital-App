
export interface ColorScheme {
    primary: string
    secondary: string
    accent: string
    background: string
    light: string
}

export const colorSchemes: Record<string, ColorScheme> = {
    // The default "Green Fresh" scheme used in templates
    default: {
        primary: '#6B8F71',
        secondary: '#1F2933',
        accent: '#4ECDC4',
        background: '#F6F7F5',
        light: '#FFFFFF'
    },
    blue: {
        primary: '#3B82F6',
        secondary: '#1E3A8A',
        accent: '#60A5FA',
        background: '#EFF6FF',
        light: '#FFFFFF'
    },
    purple: {
        primary: '#8B5CF6',
        secondary: '#4C1D95',
        accent: '#A78BFA',
        background: '#F5F3FF',
        light: '#FFFFFF'
    },
    orange: {
        primary: '#F97316',
        secondary: '#7C2D12',
        accent: '#FB923C',
        background: '#FFF7ED',
        light: '#FFFFFF'
    },
    dark: {
        primary: '#D1D5DB',
        secondary: '#000000',
        accent: '#374151',
        background: '#111827',
        light: '#1F2933'
    }
}

export function generateColorSchemeCss(schemeId: string): string {
    const scheme = colorSchemes[schemeId] || colorSchemes['default']

    // For dark scheme, use dark background with light text
    // For other schemes, use dark hero with accent colors
    const isDark = schemeId === 'dark'

    return `
    <style id="theme-colors">
        :root {
            --primary: ${scheme.primary};
            --secondary: ${scheme.secondary};
            --accent: ${scheme.accent};
            --background: ${scheme.background};
            --light: ${scheme.light};

            /* Hero section variables */
            --hero-bg: ${isDark ? scheme.background : scheme.secondary};
            --hero-text: ${isDark ? scheme.primary : '#ffffff'};
            --hero-accent: ${scheme.primary};

            /* About section variables */
            --about-bg: ${isDark ? scheme.background : scheme.background};
            --about-headline: ${isDark ? '#ffffff' : scheme.secondary};
            --about-text: ${isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(31, 41, 51, 0.75)'};
            --about-badge-bg: ${isDark ? 'rgba(255, 255, 255, 0.1)' : scheme.secondary};
            --about-badge-text: #ffffff;

            /* Services section variables */
            --services-bg: ${isDark ? scheme.background : '#ffffff'};
            --services-headline: ${isDark ? '#ffffff' : scheme.secondary};
            --services-text: ${isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(31, 41, 51, 0.65)'};
            --services-badge-bg: ${isDark ? 'rgba(255, 255, 255, 0.1)' : scheme.secondary};
            --services-badge-text: #ffffff;
            --services-icon: ${isDark ? '#ffffff' : scheme.secondary};
            --services-border: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(31, 41, 51, 0.1)'};
            --services-accent: ${scheme.primary};

            /* Featured section variables */
            --featured-bg: ${isDark ? scheme.background : '#F6F7F5'};
            --featured-headline: ${isDark ? '#ffffff' : scheme.secondary};
            --featured-text: ${isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(31, 41, 51, 0.65)'};
            --featured-card-bg: ${isDark ? '#1a1a2e' : '#ffffff'};
            --featured-card-alt-bg: ${isDark ? '#0f0f1a' : scheme.secondary};
            --featured-tag-bg: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(31, 41, 51, 0.05)'};
            --featured-border: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(31, 41, 51, 0.1)'};
            --featured-accent: ${scheme.primary};

            /* Footer section variables */
            --footer-bg: ${isDark ? '#0a0a0f' : scheme.secondary};
            --footer-text: #ffffff;
            --footer-text-muted: rgba(255, 255, 255, 0.65);
            --footer-text-dim: rgba(255, 255, 255, 0.5);
            --footer-border: rgba(255, 255, 255, 0.1);
            --footer-badge-bg: rgba(255, 255, 255, 0.1);
            --footer-social-bg: rgba(255, 255, 255, 0.1);
            --footer-social-hover: rgba(255, 255, 255, 0.2);
        }

        /* Hero section color overrides */
        .hero-refit-wrapper {
            background-color: var(--hero-bg) !important;
        }
        .hero-refit h1 {
            color: var(--hero-text) !important;
        }
        .hero-refit .description {
            color: rgba(255, 255, 255, 0.65) !important;
        }
        .hero-refit .availability-badge .dot {
            background: var(--hero-accent) !important;
        }
        .hero-refit .cta-button {
            background: var(--hero-text) !important;
            color: var(--hero-bg) !important;
        }
        .hero-refit .cta-button .arrow-icon {
            background: var(--hero-bg) !important;
        }
        .hero-refit .cta-button .arrow-icon svg {
            stroke: var(--hero-text) !important;
        }
        .hero-refit .testimonial-stars svg {
            fill: var(--hero-accent) !important;
        }

        /* About section color overrides */
        .about-refit-wrapper {
            background-color: var(--about-bg) !important;
        }
        .about-refit .headline {
            color: var(--about-headline) !important;
        }
        .about-refit .description {
            color: var(--about-text) !important;
        }
        .about-refit .about-badge {
            background-color: var(--about-badge-bg) !important;
            color: var(--about-badge-text) !important;
        }

        /* Services section color overrides */
        .services-refit-wrapper {
            background-color: var(--services-bg) !important;
        }
        .services-refit .headline {
            color: var(--services-headline) !important;
        }
        .services-refit .subheadline {
            color: var(--services-text) !important;
        }
        .services-refit .services-badge {
            background-color: var(--services-badge-bg) !important;
            color: var(--services-badge-text) !important;
        }
        .services-refit .service-name {
            color: var(--services-headline) !important;
        }
        .services-refit .service-description {
            color: var(--services-text) !important;
        }
        .services-refit .service-icon {
            color: var(--services-icon) !important;
        }
        .services-refit .service-toggle {
            color: var(--services-icon) !important;
        }
        .services-refit .service-item {
            border-color: var(--services-border) !important;
        }
        .services-refit .service-header:hover .service-name {
            color: var(--services-accent) !important;
        }

        /* Featured section color overrides */
        .featured-refit-wrapper {
            background-color: var(--featured-bg) !important;
        }
        .featured-refit .headline {
            color: var(--featured-headline) !important;
        }
        .featured-refit .subheadline {
            color: var(--featured-text) !important;
        }
        .featured-refit .product-card:nth-child(odd) {
            background-color: var(--featured-card-bg) !important;
        }
        .featured-refit .product-card:nth-child(even) {
            background-color: var(--featured-card-alt-bg) !important;
        }
        .featured-refit .product-title {
            color: var(--featured-headline) !important;
        }
        .featured-refit .product-description {
            color: var(--featured-text) !important;
        }
        .featured-refit .product-tag {
            background-color: var(--featured-tag-bg) !important;
            color: var(--featured-headline) !important;
        }
        .featured-refit .testimonial {
            border-top-color: var(--featured-border) !important;
        }
        .featured-refit .testimonial-quote {
            color: var(--featured-text) !important;
        }
        .featured-refit .testimonial-quote::before {
            color: var(--featured-accent) !important;
        }
        .featured-refit .testimonial-author {
            color: var(--featured-headline) !important;
        }
        /* Dark card (even) text colors - force white */
        .featured-refit .product-card:nth-child(even) .product-title {
            color: #ffffff !important;
        }
        .featured-refit .product-card:nth-child(even) .product-description {
            color: rgba(255, 255, 255, 0.75) !important;
        }
        .featured-refit .product-card:nth-child(even) .product-tag {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
        }
        .featured-refit .product-card:nth-child(even) .testimonial {
            border-top-color: rgba(255, 255, 255, 0.1) !important;
        }
        .featured-refit .product-card:nth-child(even) .testimonial-quote {
            color: rgba(255, 255, 255, 0.75) !important;
        }
        .featured-refit .product-card:nth-child(even) .testimonial-author {
            color: #ffffff !important;
        }
        .featured-refit .product-card:nth-child(even) .testimonial-avatar-placeholder {
            color: #ffffff !important;
        }

        /* Footer section color overrides */
        .footer-refit-wrapper {
            background-color: var(--footer-bg) !important;
        }
        .footer-refit .footer-headline {
            color: var(--footer-text) !important;
        }
        .footer-refit .footer-description {
            color: var(--footer-text-muted) !important;
        }
        .footer-refit .footer-badge {
            background-color: var(--footer-badge-bg) !important;
            color: var(--footer-text) !important;
        }
        .footer-refit .contact-label {
            color: var(--footer-text) !important;
        }
        .footer-refit .contact-value {
            color: var(--footer-text-muted) !important;
        }
        .footer-refit .contact-value:hover {
            color: var(--footer-text) !important;
        }
        .footer-refit .social-section {
            border-top-color: var(--footer-border) !important;
        }
        .footer-refit .social-label {
            color: var(--footer-text) !important;
        }
        .footer-refit .social-link {
            background-color: var(--footer-social-bg) !important;
            color: var(--footer-text) !important;
        }
        .footer-refit .social-link:hover {
            background-color: var(--footer-social-hover) !important;
        }
        .footer-refit .copyright {
            border-top-color: var(--footer-border) !important;
        }
        .footer-refit .copyright-text {
            color: var(--footer-text-dim) !important;
        }
        .footer-refit .copyright-link {
            color: var(--footer-text-dim) !important;
        }
        .footer-refit .copyright-link:hover {
            color: var(--footer-text) !important;
        }

        /* Override generic utility classes used in templates */
        .text-\\[\\#6B8F71\\] { color: var(--primary) !important; }
        .bg-\\[\\#6B8F71\\] { background-color: var(--primary) !important; }
        .border-\\[\\#6B8F71\\] { border-color: var(--primary) !important; }

        .text-\\[\\#1F2933\\] { color: var(--secondary) !important; }
        .bg-\\[\\#1F2933\\] { background-color: var(--secondary) !important; }

        .text-\\[\\#4ECDC4\\] { color: var(--accent) !important; }
        .bg-\\[\\#F6F7F5\\] { background-color: var(--background) !important; }
    </style>
    `
}
