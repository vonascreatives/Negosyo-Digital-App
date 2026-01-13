/**
 * Footer Section Style Generators
 * 5 premium, responsive variants.
 */

interface FooterProps {
    businessName: string
    email: string
    phone: string
    address?: string
}

/**
 * Style 1: Minimal Centered (Default)
 * Clean, focused on brand identity.
 */
function generateFooterStyle1(props: FooterProps): string {
    const { businessName, email, phone, address } = props
    const year = new Date().getFullYear()

    return `
    <footer class="bg-white text-[#1F2933] py-20 border-t border-[#E3E6E3]" id="footer-section">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <h2 class="text-4xl md:text-6xl font-dm-sans font-bold tracking-tighter mb-8 hover:text-[#6B8F71] transition-colors cursor-default">
                ${businessName}
            </h2>
            
            <div class="flex flex-wrap justify-center gap-8 mb-12 font-manrope font-medium text-sm tracking-wide uppercase">
                <a href="#about-section" class="hover:text-[#6B8F71] transition-colors">About</a>
                <a href="#services-section" class="hover:text-[#6B8F71] transition-colors">Services</a>
                <a href="#" class="hover:text-[#6B8F71] transition-colors">Contact</a>
            </div>

            <div class="w-12 h-px bg-gray-200 mx-auto mb-12"></div>

            <div class="flex flex-col items-center gap-4 text-gray-500 font-manrope">
                <p>
                    <a href="mailto:${email}" class="hover:text-[#1F2933] transition-colors">${email}</a>
                     • 
                    <a href="tel:${phone}" class="hover:text-[#1F2933] transition-colors">${phone}</a>
                </p>
                <p class="text-xs text-gray-400">© ${year} ${businessName}. All rights reserved.</p>
            </div>
        </div>
    </footer>`
}

/**
 * Style 2: Modern Corporate (Multi-Column)
 * Standard, organized layout.
 */
function generateFooterStyle2(props: FooterProps): string {
    const { businessName, email, phone, address } = props
    const year = new Date().getFullYear()

    return `
    <footer class="bg-[#F6F7F5] text-[#1F2933] py-24 border-t border-[#E3E6E3]" id="footer-section">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div class="md:col-span-1 space-y-6">
                    <h3 class="font-bold text-xl font-dm-sans tracking-tight">${businessName}</h3>
                    <p class="text-sm text-gray-500 font-manrope leading-relaxed">
                        Delivering excellence through dedication and quality service. Your trusted partner.
                    </p>
                </div>

                <div>
                    <h4 class="font-bold text-sm uppercase tracking-widest mb-6 text-[#6B8F71]">Links</h4>
                    <ul class="space-y-4 text-sm font-manrope text-gray-600">
                        <li><a href="#hero-section" class="hover:text-[#1F2933] transition-colors">Home</a></li>
                        <li><a href="#about-section" class="hover:text-[#1F2933] transition-colors">About</a></li>
                        <li><a href="#services-section" class="hover:text-[#1F2933] transition-colors">Services</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold text-sm uppercase tracking-widest mb-6 text-[#6B8F71]">Contact</h4>
                    <ul class="space-y-4 text-sm font-manrope text-gray-600">
                        <li>${email}</li>
                        <li>${phone}</li>
                         ${address ? `<li>${address}</li>` : ''}
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold text-sm uppercase tracking-widest mb-6 text-[#6B8F71]">Social</h4>
                    <div class="flex gap-4">
                        <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#6B8F71] hover:text-white transition-colors shadow-sm">
                             <span class="sr-only">Facebook</span>
                             <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                        </a>
                        <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#6B8F71] hover:text-white transition-colors shadow-sm">
                            <span class="sr-only">Instagram</span>
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/></svg>
                        </a>
                    </div>
                </div>
            </div>

            <div class="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-manrope">
                <p>© ${year} ${businessName}.</p>
                <div class="flex gap-6 mt-4 md:mt-0">
                    <a href="#" class="hover:text-[#1F2933]">Privacy</a>
                    <a href="#" class="hover:text-[#1F2933]">Terms</a>
                </div>
            </div>
        </div>
    </footer>`
}

/**
 * Style 3: Big Impact (Dark)
 * Bold call to action.
 */
function generateFooterStyle3(props: FooterProps): string {
    const { businessName, email, phone } = props
    const year = new Date().getFullYear()

    return `
    <footer class="bg-[#111827] text-white py-32 border-t border-gray-800" id="footer-section">
        <div class="max-w-7xl mx-auto px-6">
             <div class="mb-24">
                <span class="text-[#6B8F71] font-bold tracking-widest uppercase text-xs mb-8 block">Get in Touch</span>
                <a href="mailto:${email}" class="text-5xl md:text-8xl font-dm-sans font-bold hover:text-[#6B8F71] transition-colors leading-[0.9] block break-words">
                    Let's Talk.
                </a>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-800 pt-12">
                <div class="space-y-2">
                    <h3 class="text-2xl font-dm-sans font-bold">${businessName}</h3>
                    <p class="text-gray-500 font-manrope">Creating experiences that matter.</p>
                </div>
                <div class="grid grid-cols-2 gap-8 text-sm font-manrope text-gray-400">
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:text-white transition-colors">Instagram</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Facebook</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Twitter</a></li>
                    </ul>
                     <ul class="space-y-2">
                         <li><a href="tel:${phone}" class="hover:text-white transition-colors">${phone}</a></li>
                        <li><a href="mailto:${email}" class="hover:text-white transition-colors">${email}</a></li>
                    </ul>
                </div>
             </div>
             
             <div class="mt-24 text-gray-600 text-xs font-mono">
                © ${year} ALL RIGHTS RESERVED
             </div>
        </div>
    </footer>`
}

/**
 * Style 4: Minimal Bar (Sparse)
 * Very clean, bottom alignment.
 */
function generateFooterStyle4(props: FooterProps): string {
    const { businessName, email } = props
    const year = new Date().getFullYear()

    return `
    <footer class="bg-white text-[#1F2933] py-12 border-t border-[#E3E6E3]" id="footer-section">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <h3 class="font-bold font-dm-sans tracking-tight text-lg">${businessName}</h3>
            
            <nav class="flex gap-8 font-manrope text-sm font-medium">
                <a href="#about-section" class="hover:text-[#6B8F71] transition-colors">About</a>
                <a href="#services-section" class="hover:text-[#6B8F71] transition-colors">Services</a>
                <a href="mailto:${email}" class="hover:text-[#6B8F71] transition-colors">Contact</a>
            </nav>

            <span class="text-xs text-gray-400 font-manrope">© ${year}</span>
        </div>
    </footer>`
}

/**
 * Style 5: Split Black & White
 * Artistic layout.
 */
function generateFooterStyle5(props: FooterProps): string {
    const { businessName, email, phone, address } = props
    const year = new Date().getFullYear()

    return `
    <footer class="flex flex-col md:flex-row border-t border-[#E3E6E3]" id="footer-section">
        <div class="bg-white w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-between min-h-[400px]">
             <div>
                <h2 class="text-4xl font-dm-sans font-bold mb-6">${businessName}</h2>
                <p class="text-gray-500 font-manrope max-w-sm">Thank you for visiting. We look forward to realizing your vision.</p>
             </div>
             <div class="mt-12">
                <p class="text-xs text-gray-400 font-mono uppercase tracking-widest">Est. ${year}</p>
             </div>
        </div>
        
        <div class="bg-[#1F2933] w-full md:w-1/2 p-12 md:p-24 text-white flex flex-col justify-between min-h-[400px]">
            <div class="grid grid-cols-2 gap-8">
                <div>
                     <h4 class="font-bold text-sm uppercase tracking-widest mb-6 text-[#6B8F71]">Inquiries</h4>
                     <p class="font-manrope text-gray-400 text-sm mb-2">${email}</p>
                     <p class="font-manrope text-gray-400 text-sm">${phone}</p>
                </div>
                 <div>
                     <h4 class="font-bold text-sm uppercase tracking-widest mb-6 text-[#6B8F71]">Office</h4>
                     <p class="font-manrope text-gray-400 text-sm">${address || 'Main St, City'}</p>
                </div>
            </div>
            
            <div class="flex gap-4 mt-12 md:mt-0">
                 <a href="#" class="text-gray-400 hover:text-white transition-colors">IG.</a>
                 <a href="#" class="text-gray-400 hover:text-white transition-colors">FB.</a>
                 <a href="#" class="text-gray-400 hover:text-white transition-colors">LN.</a>
            </div>
        </div>
    </footer>`
}

export function generateFooterHtml(style: string, props: FooterProps): string {
    const generators: Record<string, (props: FooterProps) => string> = {
        '1': generateFooterStyle1,
        '2': generateFooterStyle2,
        '3': generateFooterStyle3,
        '4': generateFooterStyle4,
        '5': generateFooterStyle5,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { FooterProps }
