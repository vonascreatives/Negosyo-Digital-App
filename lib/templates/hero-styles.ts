/**
 * Hero Style Generators
 * 5 unique, visually stunning hero components for website templates
 */

interface HeroProps {
    businessName: string
    tagline: string
    about: string
    heroCta?: { label: string; link: string }
    photos: string[]
}

/**
 * Style 1 - Cinematic Slideshow (Default - matches current atelier template)
 * Editorial magazine feel with dramatic auto-crossfading images
 */
function generateHeroStyle1(props: HeroProps): string {
    const { businessName, tagline, about, heroCta, photos } = props
    const slideImages = photos.slice(0, 4).map((photo, i) =>
        `<img src="${photo}" class="hero-slide" alt="${businessName}">`
    ).join('')

    return `
    <div class="md:px-6 md:pt-12 md:pb-12 border-[#E3E6E3] border-b pt-10 pr-4 pb-10 pl-4">
        <style>
            @keyframes slideLeft {
                0% { opacity: 0; transform: scale(1.1) translateX(-60px); filter: blur(8px); }
                4% { opacity: 1; transform: scale(1.1) translateX(0); filter: blur(0); }
                25% { opacity: 1; transform: scale(1.1) translateX(15px); }
                29% { opacity: 0; transform: scale(1.1) translateX(30px); filter: blur(4px); }
                100% { opacity: 0; }
            }
            @keyframes slideRight {
                0% { opacity: 0; transform: scale(1.1) translateX(60px); filter: blur(8px); }
                4% { opacity: 1; transform: scale(1.1) translateX(0); filter: blur(0); }
                25% { opacity: 1; transform: scale(1.1) translateX(-15px); }
                29% { opacity: 0; transform: scale(1.1) translateX(-30px); filter: blur(4px); }
                100% { opacity: 0; }
            }
            #hero-slideshow .hero-slide {
                position: absolute; inset: 0; width: 100%; height: 100%;
                object-fit: cover; opacity: 0; will-change: transform, opacity;
            }
            #hero-slideshow .hero-slide:nth-child(1) { animation: slideLeft 24s ease-out infinite; animation-delay: 0s; }
            #hero-slideshow .hero-slide:nth-child(2) { animation: slideRight 24s ease-out infinite; animation-delay: 6s; }
            #hero-slideshow .hero-slide:nth-child(3) { animation: slideLeft 24s ease-out infinite; animation-delay: 12s; }
            #hero-slideshow .hero-slide:nth-child(4) { animation: slideRight 24s ease-out infinite; animation-delay: 18s; }
        </style>
        
        <h1 class="text-[18vw] leading-[0.8] break-words font-semibold text-[#1F2933] tracking-tight font-dm-sans text-center w-full mb-8 sm:text-[16vw] sm:mb-10 md:text-[14rem] md:text-center">
            ${businessName.toUpperCase()}
        </h1>

        <div class="flex flex-col sm:flex-row sm:items-start md:flex-row md:items-start sm:text-lg sm:mb-8 sm:items-end gap-6 sm:gap-8 text-base text-[#4B5563] mb-6 pr-1 pl-1 gap-x-6 gap-y-6 items-start justify-between">
            <p class="leading-snug italic max-w-xs sm:max-w-sm font-serif">
                <span class="block font-manrope">${tagline}</span>
            </p>
            <p class="leading-snug md:mt-0 italic text-left sm:text-right max-w-xs sm:max-w-sm mt-0 sm:mt-0 font-serif">
                <span class="block font-manrope">${about}</span>
            </p>
        </div>

        <div class="relative w-full h-[320px] sm:h-[420px] md:h-[600px] overflow-hidden group border border-[#E3E6E3]">
            <div id="hero-slideshow" class="absolute inset-0 w-full h-full bg-[#E3E6E3]">
                ${slideImages}
            </div>
            <div class="absolute bottom-0 right-0 p-4 sm:p-6 md:p-8 flex gap-4 items-end w-full sm:w-auto justify-center sm:justify-end">
                <button class="bg-[#6B8F71] text-white px-6 sm:px-8 py-3 flex items-center gap-3 text-xs font-semibold hover:bg-[#4F6F57] transition-colors uppercase tracking-widest w-full sm:w-auto justify-center font-manrope">
                    ${heroCta?.label || 'Explore What We Offer'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 7h10v10M7 17L17 7"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>`
}

/**
 * Style 2 - Video/Cinematic Dark
 * Dark, immersive hero with bold typography and gradient overlay
 */
function generateHeroStyle2(props: HeroProps): string {
    const { businessName, tagline, about, heroCta, photos } = props
    const bgPhoto = photos[0] || ''

    return `
    <div class="border-[#E3E6E3] border-b">
        <style>
            .hero-video-style {
                position: relative; min-height: 100vh; overflow: hidden;
                display: flex; align-items: center; justify-content: center;
            }
            .hero-video-style .bg-image {
                position: absolute; inset: 0; z-index: 0;
            }
            .hero-video-style .bg-image img {
                width: 100%; height: 100%; object-fit: cover;
                filter: brightness(0.4);
            }
            .hero-video-style .gradient-overlay {
                position: absolute; inset: 0; z-index: 1;
                background: linear-gradient(135deg, rgba(31,41,51,0.9) 0%, rgba(107,143,113,0.3) 100%);
            }
            .hero-video-style .content {
                position: relative; z-index: 10; text-align: center;
                padding: 3rem; max-width: 900px;
            }
            .hero-video-style h1 {
                font-size: clamp(3rem, 10vw, 8rem); font-weight: 800;
                line-height: 0.9; letter-spacing: -0.04em;
                color: #fff; margin-bottom: 1.5rem;
                text-shadow: 0 4px 30px rgba(0,0,0,0.3);
            }
            .hero-video-style .accent-bar {
                width: 80px; height: 4px; margin: 0 auto 2rem;
                background: linear-gradient(90deg, #6B8F71, #4ECDC4);
            }
            .hero-video-style .tagline {
                font-size: clamp(1rem, 2vw, 1.5rem);
                color: rgba(255,255,255,0.85); max-width: 600px;
                margin: 0 auto 2.5rem; line-height: 1.7;
            }
            .hero-video-style .cta-btn {
                display: inline-flex; align-items: center; gap: 12px;
                padding: 1rem 2.5rem; border: 2px solid #fff;
                color: #fff; font-weight: 600; font-size: 0.85rem;
                text-transform: uppercase; letter-spacing: 0.15em;
                transition: all 0.4s ease; background: transparent;
            }
            .hero-video-style .cta-btn:hover {
                background: #fff; color: #1F2933;
            }
            .hero-video-style .scroll-hint {
                position: absolute; bottom: 2rem; left: 50%;
                transform: translateX(-50%); color: rgba(255,255,255,0.6);
                font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em;
                display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
            }
            .hero-video-style .scroll-hint::after {
                content: ''; display: block; width: 1px; height: 40px;
                background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
                animation: pulseScroll 2s ease-in-out infinite;
            }
            @keyframes pulseScroll {
                0%, 100% { transform: scaleY(1); opacity: 1; }
                50% { transform: scaleY(0.5); opacity: 0.3; }
            }
        </style>
        
        <section class="hero-video-style">
            <div class="bg-image">
                <img src="${bgPhoto}" alt="${businessName}">
            </div>
            <div class="gradient-overlay"></div>
            
            <div class="content">
                <div class="accent-bar"></div>
                <h1 class="font-dm-sans">${businessName.toUpperCase()}</h1>
                <p class="tagline font-manrope">${tagline}</p>
                ${heroCta ? `
                    <a href="${heroCta.link || '#'}" class="cta-btn font-manrope">
                        ${heroCta.label}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14m-7-7l7 7-7 7"/>
                        </svg>
                    </a>
                ` : ''}
            </div>
            
            <div class="scroll-hint font-manrope">Scroll</div>
        </section>
    </div>`
}

/**
 * Style 3 - Split Screen
 * Modern asymmetric 50/50 layout with diagonal divider
 */
function generateHeroStyle3(props: HeroProps): string {
    const { businessName, tagline, about, heroCta, photos } = props
    const mainPhoto = photos[0] || ''

    return `
    <div class="border-[#E3E6E3] border-b">
        <style>
            .hero-split {
                display: grid; grid-template-columns: 1fr 1fr;
                min-height: 100vh;
            }
            @media (max-width: 768px) {
                .hero-split { grid-template-columns: 1fr; }
                .hero-split .image-side { min-height: 50vh; order: -1; }
            }
            .hero-split .content-side {
                display: flex; flex-direction: column; justify-content: center;
                padding: 4rem; background: #1a1a1a; position: relative; overflow: hidden;
            }
            .hero-split .image-side {
                position: relative; overflow: hidden;
            }
            .hero-split .image-side img {
                width: 100%; height: 100%; object-fit: cover;
                transition: transform 8s ease-out;
            }
            .hero-split:hover .image-side img {
                transform: scale(1.08);
            }
            .hero-split .diagonal-clip {
                position: absolute; right: -60px; top: 0; bottom: 0; width: 120px;
                background: #1a1a1a; transform: skewX(-4deg); z-index: 5;
            }
            @media (max-width: 768px) {
                .hero-split .diagonal-clip { display: none; }
            }
            .hero-split h1 {
                font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800;
                line-height: 0.95; letter-spacing: -0.03em;
                color: #fff; margin-bottom: 1.5rem;
            }
            .hero-split .accent-line {
                width: 60px; height: 4px;
                background: linear-gradient(90deg, #6B8F71, #4ECDC4);
                margin-bottom: 2rem;
            }
            .hero-split .tagline {
                font-size: 1.125rem; color: rgba(255,255,255,0.75);
                max-width: 400px; line-height: 1.7; margin-bottom: 0.75rem;
            }
            .hero-split .about {
                font-size: 0.9rem; color: rgba(255,255,255,0.5);
                max-width: 400px; line-height: 1.6;
            }
            .hero-split .cta-btn {
                display: inline-flex; align-items: center; gap: 12px;
                margin-top: 2.5rem; padding: 1.25rem 2.5rem;
                background: linear-gradient(135deg, #6B8F71, #4ECDC4);
                color: #fff; font-weight: 600; font-size: 0.85rem;
                text-transform: uppercase; letter-spacing: 0.1em;
                transition: all 0.3s ease; border: none;
            }
            .hero-split .cta-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 20px 40px rgba(107, 143, 113, 0.4);
            }
            .hero-split .floating-orb {
                position: absolute; border-radius: 50%;
                background: radial-gradient(circle, rgba(107,143,113,0.2), transparent 70%);
                animation: floatOrb 8s ease-in-out infinite;
            }
            @keyframes floatOrb {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(20px, -30px) scale(1.1); }
            }
        </style>
        
        <section class="hero-split">
            <div class="content-side">
                <div class="floating-orb" style="width: 300px; height: 300px; top: -100px; left: -50px;"></div>
                <div class="floating-orb" style="width: 200px; height: 200px; bottom: 50px; right: 100px; animation-delay: -4s;"></div>
                
                <div class="accent-line"></div>
                <h1 class="font-dm-sans">${businessName}</h1>
                <p class="tagline font-manrope">${tagline}</p>
                <p class="about font-manrope">${about}</p>
                ${heroCta ? `
                    <a href="${heroCta.link || '#'}" class="cta-btn font-manrope">
                        ${heroCta.label}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14m-7-7l7 7-7 7"/>
                        </svg>
                    </a>
                ` : ''}
                <div class="diagonal-clip"></div>
            </div>
            
            <div class="image-side">
                <img src="${mainPhoto}" alt="${businessName}">
            </div>
        </section>
    </div>`
}

/**
 * Style 4 - Minimal Typography
 * Clean, text-centric with oversized typography and subtle imagery
 */
function generateHeroStyle4(props: HeroProps): string {
    const { businessName, tagline, about, heroCta, photos } = props
    const bgPhoto = photos[0] || ''

    return `
    <div class="border-[#E3E6E3] border-b">
        <style>
            .hero-minimal {
                position: relative; min-height: 100vh; overflow: hidden;
                background: #fafaf9; display: flex; flex-direction: column;
                justify-content: center; padding: 3rem;
            }
            .hero-minimal .bg-image {
                position: absolute; inset: 0; opacity: 0.06;
            }
            .hero-minimal .bg-image img {
                width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%);
            }
            .hero-minimal .content {
                position: relative; z-index: 10;
            }
            .hero-minimal h1 {
                font-size: clamp(4rem, 15vw, 14rem); font-weight: 600;
                line-height: 0.85; letter-spacing: -0.05em;
                color: #1a1a1a; margin-bottom: 3rem;
                background: url("${bgPhoto}") center/cover;
                -webkit-background-clip: text; background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .hero-minimal .meta-row {
                display: flex; align-items: center; justify-content: space-between;
                flex-wrap: wrap; gap: 2rem;
                padding-top: 2rem; border-top: 1px solid rgba(0,0,0,0.1);
            }
            .hero-minimal .tagline {
                font-size: 1.125rem; color: #555; max-width: 450px; line-height: 1.7;
            }
            .hero-minimal .cta-btn {
                display: inline-flex; align-items: center; gap: 12px;
                padding: 0; color: #1a1a1a; font-weight: 500; font-size: 1rem;
                position: relative; background: transparent; border: none;
            }
            .hero-minimal .cta-btn::after {
                content: ''; position: absolute; bottom: -4px; left: 0;
                width: 100%; height: 2px; background: #1a1a1a;
                transform: scaleX(0); transform-origin: right;
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .hero-minimal .cta-btn:hover::after {
                transform: scaleX(1); transform-origin: left;
            }
            .hero-minimal .corner-label {
                position: absolute; font-size: 0.65rem;
                text-transform: uppercase; letter-spacing: 0.2em; color: #999;
            }
            .hero-minimal .corner-label.top { top: 2rem; left: 3rem; }
            .hero-minimal .corner-label.bottom { bottom: 2rem; right: 3rem; }
        </style>
        
        <section class="hero-minimal">
            <div class="bg-image">
                <img src="${bgPhoto}" alt="">
            </div>
            
            <span class="corner-label top font-manrope">Est. 2024</span>
            <span class="corner-label bottom font-manrope">Scroll to explore ↓</span>
            
            <div class="content">
                <h1 class="font-dm-sans">${businessName.toUpperCase()}</h1>
                
                <div class="meta-row">
                    <p class="tagline font-manrope">${tagline}</p>
                    ${heroCta ? `
                        <a href="${heroCta.link || '#'}" class="cta-btn font-manrope">
                            ${heroCta.label}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M7 7h10v10M7 17L17 7"/>
                            </svg>
                        </a>
                    ` : ''}
                </div>
            </div>
        </section>
    </div>`
}

/**
 * Style 5 - Full Screen Immersive
 * Full-bleed imagery with glassmorphism content card
 */
function generateHeroStyle5(props: HeroProps): string {
    const { businessName, tagline, about, heroCta, photos } = props
    const bgPhoto = photos[0] || ''

    return `
    <div class="border-[#E3E6E3] border-b">
        <style>
            .hero-fullscreen {
                position: relative; min-height: 100vh; overflow: hidden;
                display: flex; align-items: center; justify-content: center;
            }
            .hero-fullscreen .bg-layer {
                position: absolute; inset: 0; z-index: 0;
            }
            .hero-fullscreen .bg-layer img {
                width: 100%; height: 100%; object-fit: cover;
            }
            .hero-fullscreen .gradient-mesh {
                position: absolute; inset: 0;
                background: 
                    radial-gradient(ellipse at 30% 20%, rgba(107,143,113,0.4) 0%, transparent 50%),
                    radial-gradient(ellipse at 70% 80%, rgba(78,205,196,0.3) 0%, transparent 50%),
                    linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5));
            }
            .hero-fullscreen .glass-card {
                position: relative; z-index: 10;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 24px; padding: 3rem 4rem;
                max-width: 680px; text-align: center;
                box-shadow: 0 32px 64px rgba(0,0,0,0.2);
            }
            .hero-fullscreen .badge {
                display: inline-block; padding: 0.5rem 1.25rem;
                background: rgba(255,255,255,0.15); border-radius: 100px;
                font-size: 0.7rem; text-transform: uppercase;
                letter-spacing: 0.15em; color: rgba(255,255,255,0.9);
                margin-bottom: 1.5rem;
            }
            .hero-fullscreen h1 {
                font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700;
                line-height: 1.1; letter-spacing: -0.02em;
                color: #fff; margin-bottom: 1.25rem;
            }
            .hero-fullscreen .tagline {
                font-size: 1.1rem; color: rgba(255,255,255,0.85);
                line-height: 1.7; margin-bottom: 2rem;
            }
            .hero-fullscreen .cta-btn {
                display: inline-flex; align-items: center; gap: 10px;
                padding: 1rem 2rem; background: #fff; color: #1a1a1a;
                font-weight: 600; font-size: 0.9rem; border-radius: 100px;
                transition: all 0.3s ease; border: none;
            }
            .hero-fullscreen .cta-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 20px 40px rgba(255,255,255,0.2);
            }
            .hero-fullscreen .scroll-indicator {
                position: absolute; bottom: 2.5rem; left: 50%;
                transform: translateX(-50%); z-index: 10;
                display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
                color: rgba(255,255,255,0.6); font-size: 0.65rem;
                text-transform: uppercase; letter-spacing: 0.15em;
            }
            .hero-fullscreen .scroll-indicator::after {
                content: ''; display: block; width: 1px; height: 35px;
                background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
                animation: scrollPulse 2s ease-in-out infinite;
            }
            @keyframes scrollPulse {
                0%, 100% { opacity: 1; transform: scaleY(1); }
                50% { opacity: 0.4; transform: scaleY(0.6); }
            }
        </style>
        
        <section class="hero-fullscreen">
            <div class="bg-layer">
                <img src="${bgPhoto}" alt="${businessName}">
                <div class="gradient-mesh"></div>
            </div>
            
            <div class="glass-card">
                <div class="badge font-manrope">Welcome</div>
                <h1 class="font-dm-sans">${businessName}</h1>
                <p class="tagline font-manrope">${tagline}</p>
                ${heroCta ? `
                    <a href="${heroCta.link || '#'}" class="cta-btn font-manrope">
                        ${heroCta.label}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14m-7-7l7 7-7 7"/>
                        </svg>
                    </a>
                ` : ''}
            </div>
            
            <div class="scroll-indicator font-manrope">Scroll</div>
        </section>
    </div>`
}

/**
 * Main generator function - routes to appropriate style
 */
export function generateHeroHtml(style: string, props: HeroProps): string {
    const generators: Record<string, (props: HeroProps) => string> = {
        '1': generateHeroStyle1,
        '2': generateHeroStyle2,
        '3': generateHeroStyle3,
        '4': generateHeroStyle4,
        '5': generateHeroStyle5,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { HeroProps }
