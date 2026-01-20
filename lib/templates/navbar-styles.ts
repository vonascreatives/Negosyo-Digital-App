/**
 * Navbar Style Generators
 * Navigation bar components for website templates
 */

interface NavbarProps {
    businessName: string
    links?: Array<{ label: string; href: string }>
    visibility?: {
        navbar?: boolean
    }
}

/**
 * Style 1 - Minimal Dark Navbar (Refit-inspired)
 * Dark transparent navbar with logo on left, navigation links on right
 * Features: brand name, horizontal navigation links
 */
function generateNavbarStyle1(props: NavbarProps): string {
    const { businessName, links, visibility } = props

    // Default navigation links if none provided
    const defaultLinks = [
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Featured', href: '#featured' },
        { label: 'Contacts', href: '#contact' }
    ]

    const navLinks = links && links.length > 0 ? links : defaultLinks
    const showNavbar = visibility?.navbar !== false

    if (!showNavbar) {
        return ''
    }

    return `
    <nav class="navbar-refit">
        <style>
            .navbar-refit {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                z-index: 100;
                padding: 1.5rem 2rem;
                margin-bottom: 1rem;
            }

            @media (min-width: 768px) {
                .navbar-refit {
                    padding: 1.75rem 4rem;
                    margin-bottom: 1.5rem;
                }
            }

            @media (min-width: 1024px) {
                .navbar-refit {
                    padding: 2rem 5rem;
                    margin-bottom: 2rem;
                }
            }

            .navbar-refit .navbar-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 1400px;
                margin: 0 auto;
            }

            .navbar-refit .brand {
                font-size: 1.5rem;
                font-weight: 500;
                color: var(--hero-text, #ffffff);
                text-decoration: none;
                letter-spacing: -0.01em;
            }

            @media (min-width: 1024px) {
                .navbar-refit .brand {
                    font-size: 1.75rem;
                }
            }

            .navbar-refit .nav-links {
                display: none;
                align-items: center;
                gap: 2rem;
            }

            @media (min-width: 768px) {
                .navbar-refit .nav-links {
                    display: flex;
                }
            }

            .navbar-refit .nav-links a {
                font-size: 1rem;
                color: rgba(255, 255, 255, 0.7);
                text-decoration: none;
                transition: color 0.2s ease;
                letter-spacing: 0.01em;
            }

            @media (min-width: 1024px) {
                .navbar-refit .nav-links a {
                    font-size: 1.125rem;
                }
            }

            .navbar-refit .nav-links a:hover {
                color: var(--hero-text, #ffffff);
            }

            /* Mobile menu button */
            .navbar-refit .mobile-menu-btn {
                display: flex;
                flex-direction: column;
                gap: 5px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
            }

            @media (min-width: 768px) {
                .navbar-refit .mobile-menu-btn {
                    display: none;
                }
            }

            .navbar-refit .mobile-menu-btn span {
                display: block;
                width: 24px;
                height: 2px;
                background: var(--hero-text, #ffffff);
                border-radius: 1px;
                transition: all 0.3s ease;
            }

            /* Mobile menu */
            .navbar-refit .mobile-menu {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(10, 10, 10, 0.98);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                padding: 1.5rem 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .navbar-refit .mobile-menu.active {
                display: block;
            }

            .navbar-refit .mobile-menu a {
                display: block;
                padding: 0.75rem 0;
                font-size: 1rem;
                color: rgba(255, 255, 255, 0.7);
                text-decoration: none;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                transition: color 0.2s ease;
            }

            .navbar-refit .mobile-menu a:last-child {
                border-bottom: none;
            }

            .navbar-refit .mobile-menu a:hover {
                color: var(--hero-text, #ffffff);
            }
        </style>

        <div class="navbar-container">
            <a href="#" class="brand font-dm-sans">${businessName}</a>

            <div class="nav-links font-manrope">
                ${navLinks.map(link => `<a href="${link.href}">${link.label}</a>`).join('\n                ')}
            </div>

            <button class="mobile-menu-btn" onclick="this.parentElement.parentElement.querySelector('.mobile-menu').classList.toggle('active')">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <div class="mobile-menu font-manrope">
            ${navLinks.map(link => `<a href="${link.href}">${link.label}</a>`).join('\n            ')}
        </div>
    </nav>`
}

/**
 * Main generator function - routes to appropriate style
 */
export function generateNavbarHtml(style: string, props: NavbarProps): string {
    const generators: Record<string, (props: NavbarProps) => string> = {
        '1': generateNavbarStyle1,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { NavbarProps }
