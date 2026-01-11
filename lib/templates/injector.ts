import * as cheerio from 'cheerio'
import { generateHeroHtml } from './hero-styles'

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
}

export interface Customizations {
    heroStyle?: string
    colorScheme?: string[]
    fontPairing?: string
}

/**
 * Inject extracted content into HTML template using server-side replacement
 * This replaces content directly in the HTML before sending to client
 */
export function injectContent(
    templateHtml: string,
    content: ExtractedContent,
    customizations?: Customizations,
    photos?: string[]
): string {
    const $ = cheerio.load(templateHtml)

    // 0. Apply Hero Style if provided (replaces entire hero section)
    if (customizations?.heroStyle) {
        const heroHtml = generateHeroHtml(customizations.heroStyle, {
            businessName: content.business_name,
            tagline: content.tagline,
            about: content.about,
            heroCta: content.hero_cta,
            photos: photos || []
        })

        // Find and replace the hero section (first child div of main)
        const $heroSection = $('main > div').first()
        if ($heroSection.length) {
            $heroSection.replaceWith(heroHtml)
        }
    }

    // 1. Replace page title
    $('title').text(`${content.business_name} - ${content.tagline}`)

    // 5. Replace "Signature Cohorts" with Offer Section title and description
    $('h2, p').each((_, el) => {
        const $el = $(el)
        if ($el.text().trim() === 'Signature Cohorts') {
            if (content.offer_section?.title) {
                $el.text(content.offer_section.title)
            }
            // The description is usually the next p element or close by
            const $desc = $el.next('p')
            if ($desc.length && content.offer_section?.description) {
                $desc.text(content.offer_section.description)
            }
        }
    })
    // 2. Replace all h1 elements with business name
    $('h1').each((_, el) => {
        $(el).text(content.business_name.toUpperCase())
    })

    // 3. Replace hero section content
    const heroParagraphs = $('p.leading-snug')
    if (heroParagraphs.length >= 1) {
        heroParagraphs.eq(0).html(`<span class="block">${content.tagline}</span>`)
        if (heroParagraphs.length >= 2) {
            heroParagraphs.eq(1).html(`<span class="block">${content.about}</span>`)
        }
    }

    // 4. Replace ALL images with business photos
    if (photos && photos.length > 0) {
        // Replace hero slideshow images
        $('.hero-slide').each((index, el) => {
            const photoIndex = index % photos.length
            $(el).attr('src', photos[photoIndex])
            $(el).attr('alt', content.business_name)
        })

        // Replace all other images
        $('img:not(.hero-slide)').each((index, el) => {
            const photoIndex = index % photos.length
            $(el).attr('src', photos[photoIndex])
            $(el).attr('alt', content.business_name)
        })

        // Remove template image badges/overlays
        // Remove template image badges/overlays
        // Target specific style classes used for badges in atelier.html: "top-2 right-2", "uppercase", "tracking-widest", "border"
        $('.absolute.top-2.right-2.uppercase.tracking-widest.border').remove();

        // Also try more generic removal for any badge-like element in cards
        $('.group.cursor-pointer .absolute.top-2.right-2').remove();
    }

    // 5. Replace section headings
    const h2Elements = $('h2')
    // The template has "Curated Disciplines" and "Signature Cohorts" (or "Discover" section)
    if (h2Elements.length > 0) {
        // Find specific headers by text to be safe
        $('h2').each((_, el) => {
            const text = $(el).text().trim();
            if (text.includes('Signature Cohorts') || text.includes('Discover')) {
                $(el).text('What We Offer');
            }
        });
    }

    // 6. Inject service/program cards
    if (content.services && content.services.length > 0) {
        // Find all service card containers
        const serviceCards = $('.group.cursor-pointer')

        content.services.forEach((service, index) => {
            if (index < serviceCards.length) {
                const $card = serviceCards.eq(index)

                // Find the content area (the div with flex justify-between)
                const $contentArea = $card.find('.flex.justify-between.items-start').first()

                if ($contentArea.length > 0) {
                    // Create and prepend service title and description
                    const serviceHtml = `
                        <div class="leading-tight">
                            <h3 class="text-xl font-medium text-[#1F2933] tracking-tight font-serif font-manrope">
                                ${service.name}
                            </h3>
                            <p class="uppercase text-xs text-[#4B5563] tracking-widest mt-1 font-manrope">
                                ${service.description}
                            </p>
                        </div>
                    `
                    $contentArea.prepend(serviceHtml)

                    // Remove rating stars and numbers
                    $contentArea.find('.flex.items-center.gap-1').remove()
                }
            }
        })
    }

    // 7. Inject Unique Selling Points (USPs)
    // Map these to the "Collection Cards" (replacing "Technology", "Design Strategy", etc.)
    // The user explicitly requested these cards be the USPs.
    if (content.unique_selling_points && content.unique_selling_points.length > 0) {
        // Target the collection card titles
        const collectionTitles = $('.group.relative .absolute h3');
        const collectionSubtitles = $('.group.relative .absolute span');

        content.unique_selling_points.forEach((usp, index) => {
            if (index < collectionTitles.length) {
                collectionTitles.eq(index).text(usp);
                // process subtitle to say "Highlight" or similar instead of "Track"
                if (index < collectionSubtitles.length) {
                    collectionSubtitles.eq(index).text('Highlight');
                }
            }
        });

        // Hide unused collection cards if we have fewer USPs than cards
        if (content.unique_selling_points.length < collectionTitles.length) {
            $('.group.relative').each((index, el) => {
                if (index >= content.unique_selling_points.length) {
                    $(el).attr('style', 'display: none !important');
                }
            });
        }
    }

    // 8. Replace methodology/workflow section
    if (content.methodology) {
        // Find section with "Structured for Outcome" or similar
        $('h2, h3').each((_, el) => {
            const $el = $(el);
            const text = $el.text();
            if (text.includes('Structured for Outcome') || text.includes('Process') || text.includes('Methodology')) {
                $el.text(content.methodology!.title);
            }
        });

        // Map steps
        if (content.methodology.steps && content.methodology.steps.length > 0) {
            // Find step headers
            const stepHeaders = $('h3.text-xl, h3.text-2xl');
            const stepDescriptions = $('p.text-gray-600, p[class*="text-[#4B5563]"]');

            content.methodology.steps.forEach((step, idx) => {
                // Try to find corresponding headers by index order in the methodology section
                // This is a bit heuristic, assuming the order matches the template
                // Ideally we'd use more specific selectors if the template allowed

                // Update Step Title (e.g., "01 — Discover")
                if (idx < stepHeaders.length) {
                    // We try to preserve the number if possible, or just replace the text
                    const currentScript = stepHeaders.eq(idx).text();
                    const numberPart = currentScript.split('—')[0];
                    if (numberPart.trim().match(/^\d+$/)) {
                        stepHeaders.eq(idx).text(`${numberPart} — ${step.title}`);
                    } else {
                        stepHeaders.eq(idx).text(step.title);
                    }
                }

                // Update Description
                // Skiping first few p tags that might be hero text
                const offset = 2; // Heuristic: skip hero taglines
                if (idx + offset < stepDescriptions.length) {
                    stepDescriptions.eq(idx + offset).text(step.description);
                }
            });
        }
    } else {
        // Fallback for methodology if new field not present (legacy support)
        $('h2, h3, h4').each((_, el) => {
            const $el = $(el)
            const text = $el.text()

            if (text.includes('Structured for Outcome')) {
                $el.text(`Why Choose ${content.business_name}`)
            }
            if (text === 'Discover' && content.unique_selling_points && content.unique_selling_points[0]) {
                $el.text(content.unique_selling_points[0])
            }
            if (text === 'Apply' && content.unique_selling_points && content.unique_selling_points[1]) {
                $el.text(content.unique_selling_points[1])
            }
            if (text === 'Master' && content.unique_selling_points && content.unique_selling_points[2]) {
                $el.text(content.unique_selling_points[2])
            }
        })

        // 9. Replace methodology descriptions fallback
        $('p').each((_, el) => {
            const $el = $(el)
            const text = $el.text()

            if (text.includes('Identify your skill gap') || text.includes('Explore curated learning paths')) {
                $el.text(content.tagline)
            }
            if (text.includes('Join a vetted cohort') || text.includes('Selective intake')) {
                $el.text(content.about)
            }
            if (text.includes('Live sessions and real projects') || text.includes('Direct feedback')) {
                $el.text('Experience quality service and authentic hospitality.')
            }
        })
    }

    // 9.5 Collection Items (Images with Text overlays) - Curated Disciplines section
    if (content.collection_items && content.collection_items.length > 0) {
        // Target the collection cards more precisely
        // Find all cards with the collection structure
        const $collectionCards = $('a[class*="group"][class*="aspect-[3/4]"]').filter((_, el) => {
            return $(el).find('.absolute').length > 0;
        });

        content.collection_items.forEach((item, idx) => {
            if (idx < $collectionCards.length) {
                const $card = $collectionCards.eq(idx);
                // Find subtitle (the small TRACK label)
                const $subtitle = $card.find('.text-\\[10px\\]').first();
                if ($subtitle.length && item.subtitle) {
                    $subtitle.text(item.subtitle);
                }
                // Find title (Technology, Design Strategy, etc.)
                const $title = $card.find('h3').first();
                if ($title.length && item.title) {
                    $title.text(item.title);
                }
            }
        });
    }

    // 9.6 Map "Curated Disciplines" heading
    $('h2').each((_, el) => {
        const $el = $(el);
        if ($el.text().trim() === 'Curated Disciplines') {
            if (content.collections_heading) {
                $el.text(content.collections_heading);
            }
        }
    });

    // 10. Replace footer content
    // 10. Replace footer content
    if (content.footer) {
        if (content.footer.brand_blurb) {
            // Try to find the brand blurb paragraph (usually first p in footer or near logo)
            const $footerP = $('footer p').first();
            if ($footerP.length) $footerP.text(content.footer.brand_blurb);
        }
    } else {
        $('footer p').first().text(content.about)
    }

    // Force Footer White Text (Inline)
    $('footer').attr('style', ($('footer').attr('style') || '') + '; color: #ffffff !important;');
    $('footer *').each((_, el) => {
        const $el = $(el);
        // Skip inputs/buttons if they need specific styling, but generally force white for text
        if (!$el.is('button') && !$el.is('input')) {
            $el.attr('style', ($el.attr('style') || '') + '; color: #ffffff !important; border-color: rgba(255,255,255,0.2) !important;');
        }
        // Force SVG stroke/fill to white in footer
        if ($el.is('svg') || $el.is('path')) {
            $el.attr('stroke', '#ffffff');
        }
    });

    $('footer h2, footer h3, footer h4').each((_, el) => {
        const $el = $(el)
        const text = $el.text().trim()

        if (text.includes('ATELIER')) {
            $el.text(content.business_name.toUpperCase())
        }

        // Hide template navigation sectionsA QUI
        if (text === 'SUPPORT' || text === 'TEACH' || text === 'INSIGHTS' || text === 'FRMWRKD MEDIA') {
            const $parent = $el.closest('div')
            if ($parent.parent().length) {
                $parent.parent().css('display', 'none')
            }
        }
    })

    // 12. Remove template footer links
    $('footer a').each((_, el) => {
        const $el = $(el)
        const text = $el.text().trim()

        if (text === 'Help Center' || text === 'Scholarships' || text === 'Enterprise' ||
            text === 'Become a Mentor' || text === 'Curriculum Guide' || text === 'Mentor Resources' ||
            text.includes('career insights')) {
            // target list item if possible to preserve the column layout
            const $li = $el.closest('li');
            if ($li.length) {
                $li.remove();
            } else {
                // Fallback to div or element removal if not in a list
                const $parent = $el.closest('div');
                // Only remove parent div if it looks like a wrapper, not the main col.
                // But risky. Let's just remove the element itself if no li.
                $el.remove();
            }
        }
    })

    // 13. Remove template footer text
    $('footer p, footer span, footer div').each((_, el) => {
        const $el = $(el)
        const text = $el.text().trim()

        if (text.includes('Get career insights') ||
            text.includes('learning paths delivered') ||
            text.includes('self-community') ||
            text.includes('Interviews, trends, and curated thoughts')) {
            $el.remove()
        }
    })

    // 14. Replace contact information - Rewrite the "Contact Us" column
    if (content.contact) {
        // Clear the old contact section (vertical list in footer columns)
        let $contactSection: any = $('#contact-section');

        // Fallback: If ID not found, search by text (legacy support / robustness)
        if (!$contactSection.length) {
            $('footer h4').each((_, el) => {
                const $el = $(el);
                const text = $el.text().trim().toLowerCase();
                if (text.includes('support') || text.includes('contact')) {
                    $contactSection = $el.closest('div');
                    return false; // break loop
                }
            });
        }

        // Hide or clear the old contact column
        if ($contactSection.length) {
            $contactSection.hide();
        }

        // Now inject into the footer bottom bar (the orange band at the very bottom)
        const $footerBottomBar = $('#footer-bottom-bar');
        if ($footerBottomBar.length) {
            const contactItems = [];

            if (content.contact.phone) {
                contactItems.push(`
                    <div class="text-[10px] text-[#F6F7F5]/70 tracking-wide">
                        <span class="uppercase font-semibold">Phone:</span>
                        <a href="tel:${content.contact.phone}" class="ml-2 hover:text-[#F6F7F5] transition-colors">${content.contact.phone}</a>
                    </div>
                `);
            }

            if (content.contact.email) {
                contactItems.push(`
                    <div class="text-[10px] text-[#F6F7F5]/70 tracking-wide">
                        <span class="uppercase font-semibold">Email:</span>
                        <a href="mailto:${content.contact.email}" class="ml-2 hover:text-[#F6F7F5] transition-colors">${content.contact.email}</a>
                    </div>
                `);
            }

            if (content.contact.address) {
                contactItems.push(`
                    <div class="text-[10px] text-[#F6F7F5]/70 tracking-wide">
                        <span class="uppercase font-semibold">Address:</span>
                        <span class="ml-2">${content.contact.address}</span>
                    </div>
                `);
            }

            // Replace footer bottom bar content with contact info in 3 columns
            $footerBottomBar.html(`
                <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 py-4 font-manrope">
                    ${contactItems.join('')}
                </div>
            `);
        }

        // Dedicated Contact Section removed as per user request (reverting to footer only)
        $('#dedicated-contact-section').remove();
    }

    // 15. Replace all remaining template-specific text
    $('p, span, div').each((_, el) => {
        const $el = $(el)
        let text = $el.text()

        if (text.includes('Atelier') && !text.includes(content.business_name)) {
            text = text.replace(/Atelier/gi, content.business_name)
            $el.text(text)
        }
        if (text.includes('world-class practitioners')) {
            $el.text(content.tagline)
        }
        if (text.includes('lifelong learners')) {
            $el.text(content.about)
        }
        if (text.includes('educational experiences')) {
            $el.text(content.about)
        }
        if (text.includes('professionals who grow with intention')) {
            $el.text('customers who appreciate quality and authenticity')
        }
    })

    // 16. Replace CTAs
    if (content.hero_cta) {
        // Hero CTA is usually the first button/link in the hero section
        // Strategy: Look for "Explore What we Offer" or the first main button
        $('button, a').each((_, el) => {
            const $el = $(el)
            const text = $el.text().trim()
            if (text.includes('Explore What we Offer') || text.includes('Explore')) {
                // If it's a button, we might need to wrap it or change it to an anchor if a link is provided
                // For now, let's assume we just change text and add onclick or href

                // Preserve the icon if it exists
                const $svg = $el.find('svg').clone()
                $el.text(content.hero_cta!.label + ' ') // Add space for icon
                if ($svg.length) $el.append($svg)

                if (content.hero_cta!.link) {
                    // If it's a button, try to make it act like a link or change to 'a' tag
                    if ($el.is('button')) {
                        // Convert button to a if possible, or just set onclick
                        $el.attr('onclick', `window.location.href='${content.hero_cta!.link}'`)
                    } else {
                        $el.attr('href', content.hero_cta!.link)
                    }
                }
            }
        })
    }

    if (content.services_cta) {
        // Services CTA "View Services"
        $('a').each((_, el) => {
            const $el = $(el)
            const text = $el.text().trim()
            if (text.includes('View Services')) {
                const $svg = $el.find('svg').clone()
                $el.text(content.services_cta!.label + ' ')
                if ($svg.length) $el.append($svg)

                if (content.services_cta!.link) {
                    $el.attr('href', content.services_cta!.link)
                }
            }
        })
    }

    // Apply color scheme if provided - CREATIVE & COMPREHENSIVE
    if (customizations?.colorScheme && customizations.colorScheme.length >= 3) {
        const [primary, secondary, accent] = customizations.colorScheme
        const primaryContrast = getContrastColor(primary)
        const secondaryContrast = getContrastColor(secondary)
        const accentContrast = getContrastColor(accent)

        $('head').append(`
      <style>
        /* ===== GLOBAL COLOR VARIABLES ===== */
        :root {
          --color-primary: ${primary};
          --color-secondary: ${secondary};
          --color-accent: ${accent};
          --color-primary-contrast: ${primaryContrast};
          --color-primary-light: ${primary}15;
          --color-primary-dark: ${primary}dd;
        }
        
        /* ===== PRIMARY COLOR APPLICATIONS ===== */
        /* Main buttons and CTAs */
        .bg-\\[\\#6B8F71\\],
        button.bg-\\[\\#6B8F71\\],
        .hover\\:bg-\\[\\#6B8F71\\]:hover,
        [class*="bg-purple"],
        [class*="bg-green"] {
          background-color: ${primary} !important;
          color: white !important; /* STRICTLY WHITE */
        }
        
        /* Ensure svgs inside buttons inherit contrast color */
        button.bg-\\[\\#6B8F71\\] svg,
        .bg-\\[\\#6B8F71\\] svg {
             color: white !important;
             stroke: white !important;
        }
        
        /* Primary text colors */
        .text-\\[\\#6B8F71\\],
        .hover\\:text-\\[\\#6B8F71\\]:hover {
          color: ${primary} !important;
        }
        
        /* Primary borders */
        .border-\\[\\#6B8F71\\],
        .border-purple-600,
        .border-green-600 {
          border-color: ${primary} !important;
        }
        
        /* Selection color */
        ::selection {
          background-color: ${primary} !important;
          color: ${primaryContrast} !important;
        }
        
        /* ===== SECONDARY COLOR APPLICATIONS ===== */
        /* Subtle backgrounds and hover states */
        .hover\\:bg-\\[\\#4F6F57\\]:hover,
        .bg-\\[\\#F6F7F5\\],
        .group:hover .group-hover\\:bg-\\[\\#6B8F71\\]\\/10 {
          background-color: ${secondary}20 !important;
        }
        
        /* Secondary borders */
        .border-\\[\\#E3E6E3\\] {
          border-color: ${secondary}40 !important;
        }
        
        /* ===== ACCENT COLOR APPLICATIONS ===== */
        /* Accent elements - badges, highlights */
        .absolute.top-2.right-2,
        .absolute.top-4.right-4,
        [class*="badge"] {
          background-color: ${accent} !important;
          color: ${accentContrast} !important;
          border-color: ${accent} !important;
        }
        
        /* Links and interactive elements */
        a:hover,
        button:hover {
          color: ${accent} !important;
        }
        
        /* ===== CREATIVE ENHANCEMENTS ===== */
        /* Gradient overlays */
        .hero-slide::after {
          background: linear-gradient(135deg, ${primary}40, ${accent}40) !important;
        }
        
        /* Button hover effects with gradient */
        button:hover,
        .bg-\\[\\#6B8F71\\]:hover {
          background: linear-gradient(135deg, ${primary}, ${accent}) !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px ${primary}40 !important;
          transition: all 0.3s ease !important;
          color: ${primaryContrast} !important; /* Keep contrast on hover */
        }
        
        /* Card hover effects */
        .group.cursor-pointer:hover {
          border-color: ${primary} !important;
          box-shadow: 0 8px 30px ${primary}30 !important;
          transition: all 0.3s ease !important;
        }
        
        /* Icon colors */
        svg path[stroke="currentColor"] {
          stroke: currentColor !important;
        }
        .text-\\[\\#6B8F71\\] svg path {
             stroke: ${primary} !important;
        }
        
        /* Star ratings */
        .text-\\[\\#6B8F71\\] svg {
          color: ${accent} !important;
        }
        
        /* Focus states */
        input:focus,
        textarea:focus,
        select:focus {
          border-color: ${primary} !important;
          outline: 2px solid ${primary}40 !important;
          outline-offset: 2px;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar-thumb {
          background-color: ${primary} !important;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background-color: ${accent} !important;
        }
        
        /* Link underlines */
        a {
          text-decoration-color: ${primary}60 !important;
        }
        
        /* Section dividers with gradient */
        .border-b.border-\\[\\#E3E6E3\\] {
          border-image: linear-gradient(90deg, ${secondary}20, ${primary}40, ${secondary}20) 1 !important;
        }
        
        /* Backdrop blur elements */
        .backdrop-blur-sm,
        .backdrop-blur-md {
          background-color: ${secondary}15 !important;
        }
        
        /* Navigation hover states */
        nav a:hover {
          color: ${primary} !important;
          border-bottom: 2px solid ${primary} !important;
        }
        
        /* Footer styling */
        footer {
          background: linear-gradient(180deg, ${secondary}10, ${secondary}05) !important;
        }
        
        /* Footer styling - FORCE CONTRAST */
        footer {
            background-color: ${primary} !important;
            background: ${primary} !important;
            color: ${primaryContrast} !important;
        }
        
        /* Force all children of footer to inherit contrast color */
        footer p, 
        footer span, 
        footer a, 
        footer h3, 
        footer h4, 
        footer h2,
        footer div,
        footer li {
             color: ${primaryContrast} !important;
             opacity: 1 !important; /* Remove opacity to ensure max contrast */
        }
        
        /* Footer inputs and buttons */
        footer input {
            color: ${primaryContrast} !important;
            border-bottom-color: ${primaryContrast} !important;
        }
        footer input::placeholder {
            color: ${primaryContrast} !important;
            opacity: 0.6 !important;
        }
        
        footer button,
        footer button:hover {
            color: ${primaryContrast} !important;
        }
        /* Force overrides for the specific Explore button */
        button[class*="bg-"],
        .bg-\\[\\#6B8F71\\] {
             color: #ffffff !important;
        }
        
        /* Override specifically for the Explore button text */
        button .font-manrope,
        button span {
            color: #ffffff !important;
        }

        /* Hover state for footer links */
        footer a:hover {
             text-decoration: underline !important;
             opacity: 0.8 !important;
        }
        
        /* Pricing/number highlights */
        span.text-base.font-medium,
        .text-\\[\\#1F2933\\].text-base {
          color: ${accent} !important;
        }
        
        /* Badge and tag styling */
        .text-xs.uppercase.tracking-widest {
          color: ${primary} !important;
        }
        
        /* Image overlays on hover */
        .group:hover img {
          filter: brightness(0.9) saturate(1.2) !important;
        }
        
        /* Animated underlines */
        a::after {
          background-color: ${primary} !important;
        }
      </style>
    `)
    }

    // Apply font pairing if provided
    if (customizations?.fontPairing) {
        const fontPairs = getFontPairing(customizations.fontPairing)
        if (fontPairs) {
            // Remove all font-related classes from elements
            $('[class*="font-"]').each((_, el) => {
                const $el = $(el)
                const classes = $el.attr('class') || ''
                const newClasses = classes.split(' ').filter(c => !c.startsWith('font-')).join(' ')
                $el.attr('class', newClasses)
            })

            // Add global font override
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
        </style>
      `)
        }
    }
    // 12. Force High Contrast on Buttons (Inline Style Override)
    // This addresses the user's persistent issue with button contrast by forcing it directly on the element
    $('button').each((_, el) => {
        const $el = $(el)
        const className = $el.attr('class') || ''
        const text = $el.text().trim()

        // Target the "Explore" button and potential primary buttons
        if (text.includes('Explore') || className.includes('bg-[#6B8F71]') || className.includes('bg-')) {
            $el.attr('style', ($el.attr('style') || '') + '; color: #ffffff !important;')
            $el.find('*').attr('style', ($el.find('*').attr('style') || '') + '; color: #ffffff !important;')
            $el.find('svg, path').attr('stroke', '#ffffff').attr('fill', 'none')
        }
    })

    return $.html()
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

/**
 * Calculate contrast color (black or white) for a given hex color
 * Uses standard W3C recommendations for contrast
 */
function getContrastColor(hex: string): string {
    // Sanitize hex
    hex = hex.replace('#', '');

    // Handle short hex (e.g. F00)
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // Parse r, g, b
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Get relative luminance
    // Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
    // Using simple YIQ for performance as it's generally good enough for black/white text decision
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Threshold of 128 is standard, but we'll bias towards black for better readability on mid-tones
    // if the user's primary is a bright orange (approx 150-180), black is better.
    // If it's dark blue (<100), white is better.
    return (yiq >= 140) ? '#000000' : '#ffffff';
}
