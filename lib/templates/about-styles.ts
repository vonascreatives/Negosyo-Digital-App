/**
 * About Section Style Generators
 * 5 premium, responsive variants optimized for 3-item content arrays.
 */

interface AboutProps {
    businessName: string
    about: string
    photos: string[]
    stats?: { label: string; value: string }[]
    usps?: string[]
}

// Icons for features (SVG strings)
const ICONS = [
    `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
    `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
]

/**
 * Style 1: Modern Cards (Default)
 * 3-column grid with hover lift. Very clean.
 */
function generateAboutStyle1(props: AboutProps): string {
    const { businessName, about, usps = [] } = props
    // Ensure exactly 3 items for symmetry, or use provided USPs
    const displayUsps = usps.length >= 3 ? usps.slice(0, 3) : [...usps, 'Professional Quality', 'Dedicated Service'].slice(0, 3)

    return `
    <div class="py-24 bg-white border-b border-[#E3E6E3]" id="about-section">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-3xl mx-auto mb-20">
                <span class="text-[#6B8F71] font-bold tracking-widest uppercase text-xs mb-4 block">Our Philosophy</span>
                <h2 class="text-4xl md:text-5xl font-dm-sans font-bold text-[#1F2933] mb-6 tracking-tight">
                    Why ${businessName}?
                </h2>
                <div class="w-20 h-1.5 bg-[#6B8F71] mx-auto rounded-full mb-8"></div>
                <p class="text-lg text-[#4B5563] font-manrope leading-relaxed">
                    ${about}
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${displayUsps.map((usp, i) => `
                <div class="group bg-[#F6F7F5] p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white border border-transparent hover:border-gray-100">
                    <div class="w-14 h-14 bg-white rounded-xl shadow-sm text-[#6B8F71] flex items-center justify-center mb-6 text-2xl group-hover:bg-[#6B8F71] group-hover:text-white transition-colors duration-300">
                        ${ICONS[i % 3]}
                    </div>
                    <h3 class="text-xl font-dm-sans font-bold text-[#1F2933] mb-3 group-hover:text-[#6B8F71] transition-colors">
                        ${usp}
                    </h3>
                    <p class="text-[#4B5563] text-sm leading-relaxed font-manrope">
                        Experience the gold standard in service. We are committed to delivering excellence in every interaction.
                    </p>
                </div>
                `).join('')}
            </div>
        </div>
    </div>`
}

/**
 * Style 2: Split Feature (Left Text, Right List)
 * Excellent for storytelling with benefits.
 */
function generateAboutStyle2(props: AboutProps): string {
    const { businessName, about, usps = [], photos } = props
    const displayUsps = usps.length >= 3 ? usps.slice(0, 3) : [...usps, 'Excellence', 'Innovation'].slice(0, 3)
    const photo = photos[0] || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'

    return `
    <div class="py-24 bg-[#F6F7F5] border-b border-[#E3E6E3]" id="about-section">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div class="space-y-8 order-2 lg:order-1">
                     <div>
                        <span class="text-[#6B8F71] font-bold tracking-widest uppercase text-xs mb-2 block">About Us</span>
                        <h2 class="text-4xl md:text-5xl font-dm-sans font-bold text-[#1F2933] mb-6">
                            ${businessName}
                        </h2>
                        <p class="text-lg text-[#4B5563] font-manrope leading-relaxed">
                            ${about}
                        </p>
                    </div>

                    <div class="space-y-6">
                        ${displayUsps.map((usp, i) => `
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-white text-[#6B8F71] flex items-center justify-center shadow-sm">
                                <span class="font-bold font-dm-sans">0${i + 1}</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-[#1F2933] font-dm-sans mb-1">${usp}</h3>
                                <p class="text-sm text-[#4B5563] font-manrope">Setting the standard for quality and reliability.</p>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>

                <div class="relative order-1 lg:order-2 h-[500px]">
                    <div class="absolute inset-0 bg-[#1F2933] rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                    <img src="${photo}" class="relative w-full h-full object-cover rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                </div>
            </div>
        </div>
    </div>`
}

/**
 * Style 3: Minimal Typography
 * Clean, text-focused, horizontal layout.
 */
function generateAboutStyle3(props: AboutProps): string {
    const { businessName, about, usps = [] } = props
    const displayUsps = usps.length >= 3 ? usps.slice(0, 3) : [...usps, 'Quality', 'Integrity'].slice(0, 3)

    return `
    <div class="py-32 bg-white border-b border-[#E3E6E3]" id="about-section">
        <div class="max-w-7xl mx-auto px-6">
             <div class="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-gray-100 pb-16 mb-16">
                <div class="md:col-span-5">
                    <h2 class="text-5xl md:text-7xl font-dm-sans font-extrabold text-[#1F2933] tracking-tighter leading-tight">
                        Driven by<br><span class="text-[#6B8F71]">Purpose.</span>
                    </h2>
                </div>
                <div class="md:col-span-7 flex flex-col justify-end">
                    <p class="text-xl md:text-2xl text-[#4B5563] font-manrope font-light leading-relaxed">
                        "${about}"
                    </p>
                    <div class="mt-8 font-bold font-dm-sans text-[#1F2933]">— ${businessName}</div>
                </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${displayUsps.map((usp, i) => `
                <div class="flex flex-col border-t-2 border-[#1F2933] pt-6 group cursor-default hover:border-[#6B8F71] transition-colors">
                    <span class="text-xs font-mono text-[#9CA3AF] mb-4">0${i + 1}</span>
                    <h3 class="text-2xl font-bold font-dm-sans text-[#1F2933] mb-2 group-hover:text-[#6B8F71] transition-colors">${usp}</h3>
                </div>
                `).join('')}
             </div>
        </div>
    </div>`
}

/**
 * Style 4: Dark Mode Feature
 * High contrast, premium dark look.
 */
function generateAboutStyle4(props: AboutProps): string {
    const { businessName, about, usps = [], photos } = props
    const displayUsps = usps.length >= 3 ? usps.slice(0, 3) : [...usps, 'Premium', 'Exclusive'].slice(0, 3)
    const photo = photos[0] || 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80'

    return `
    <div class="py-24 bg-[#111827] text-white border-b border-gray-800" id="about-section">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                <div>
                     <h2 class="text-4xl md:text-5xl font-dm-sans font-bold mb-6">
                        About <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#6B8F71] to-[#4ECDC4]">${businessName}</span>
                    </h2>
                     <p class="text-gray-400 text-lg leading-relaxed font-manrope border-l-2 border-[#6B8F71] pl-6">
                        ${about}
                    </p>
                </div>
                <div class="relative h-64 md:h-auto rounded-2xl overflow-hidden group">
                     <img src="${photo}" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100 transform">
                     <div class="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent"></div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                 ${displayUsps.map((usp, i) => `
                 <div class="bg-[#1F2937] p-8 rounded-xl hover:bg-[#374151] transition-colors duration-300 group">
                    <div class="w-12 h-12 bg-[#374151] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#6B8F71] transition-colors text-white">
                        ${ICONS[i % 3]}
                    </div>
                    <h3 class="text-xl font-bold font-dm-sans mb-2">${usp}</h3>
                    <p class="text-sm text-gray-400">Defining excellence in our industry.</p>
                 </div>
                 `).join('')}
            </div>
        </div>
    </div>`
}

/**
 * Style 5: Enhanced Timeline
 * Fixed content mapping.
 */
/**
 * Style 5: Editorial Journey (Redesigned)
 * Centered, elegant, serif-focused timeline.
 */
function generateAboutStyle5(props: AboutProps): string {
    const { businessName, about, usps = [] } = props
    const displayUsps = usps.length >= 3 ? usps.slice(0, 3) : [...usps, 'Establishment', 'Growth', 'Future']

    // Milestones mapping with safe access
    const milestones = [
        { year: 'Phase 1', title: displayUsps[0] || 'Origin', desc: 'Laying the foundation for excellence and establishing core values.' },
        { year: 'Phase 2', title: displayUsps[1] || 'Growth', desc: 'Expanding our horizons and refining our craft to serve you better.' },
        { year: 'Phase 3', title: displayUsps[2] || 'Future', desc: 'Innovating for tomorrow while staying true to our roots.' }
    ]

    return `
    <div class="py-32 bg-[#FAFAF9] border-b border-[#E3E6E3]" id="about-section">
        <div class="max-w-6xl mx-auto px-6">
            <div class="max-w-3xl mx-auto text-center mb-24">
                <span class="inline-block py-1 px-3 border border-[#6B8F71] rounded-full text-[#6B8F71] text-[10px] font-bold tracking-widest uppercase mb-6">Our Story</span>
                <h2 class="text-5xl md:text-6xl font-serif text-[#1F2933] mb-8 leading-tight">${businessName}</h2>
                <p class="text-xl text-gray-600 font-manrope leading-relaxed font-light">${about || 'A journey of passion, dedication, and relentless pursuit of quality.'}</p>
            </div>
            
            <div class="relative">
                <!-- Center Line -->
                <div class="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-1/2 ml-8 md:ml-0 dashed-line"></div>
                
                ${milestones.map((m, i) => `
                <div class="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 last:mb-0 group">
                    
                    <!-- Date/Marker -->
                    <div class="absolute left-8 md:left-1/2 top-8 md:top-1/2 w-4 h-4 bg-white border-2 border-[#6B8F71] rounded-full md:-translate-x-1/2 md:-translate-y-1/2 z-10 group-hover:scale-125 transition-transform duration-300 ml-[-8.5px] md:ml-0"></div>
                    
                    <!-- Content Block Left (Odd) -->
                    <div class="w-full md:w-[45%] pl-20 md:pl-0 md:pr-16 ${i % 2 === 0 ? 'md:text-right' : 'md:hidden'}">
                        ${i % 2 === 0 ? `
                        <span class="text-[#6B8F71] font-mono text-sm mb-2 block tracking-widest">${m.year}</span>
                        <h3 class="text-3xl font-serif text-[#1F2933] mb-4">${m.title}</h3>
                        <p class="text-gray-500 font-manrope leading-relaxed text-sm">${m.desc}</p>
                        `: ''}
                    </div>

                    <!-- Content Block Right (Even) -->
                    <div class="w-full md:w-[45%] pl-20 md:pl-16 ${i % 2 !== 0 ? 'md:text-left' : 'md:hidden'}">
                         ${i % 2 !== 0 ? `
                        <span class="text-[#6B8F71] font-mono text-sm mb-2 block tracking-widest">${m.year}</span>
                        <h3 class="text-3xl font-serif text-[#1F2933] mb-4">${m.title}</h3>
                        <p class="text-gray-500 font-manrope leading-relaxed text-sm">${m.desc}</p>
                        `: ''}
                    </div>
                    
                    <!-- Mobile View (Always show if hidden on desktop side) -->
                    <div class="md:hidden w-full pl-20 pr-4">
                        ${i % 2 !== 0 ? `` : `
                             <!-- If it was Left on Desktop, show it here for Mobile -->
                         `}
                         <!-- Actually, cleaner to just duplicate logic for responsive or use CSS grid. 
                              Let's stick to a simpler flex structure for reliability -->
                    </div>
                   
                   <!-- Simplified Responsive Logic: Just render content in the right div based on index, and use CSS order? 
                        Let's just duplicate content for mobile/desktop split ensuring valid HTML -->
                   
                   <div class="md:hidden w-full pl-20 mt-[-2rem]">
                        <span class="text-[#6B8F71] font-mono text-sm mb-1 block tracking-widest">${m.year}</span>
                        <h3 class="text-2xl font-serif text-[#1F2933] mb-2">${m.title}</h3>
                        <p class="text-gray-500 font-manrope leading-relaxed text-sm">${m.desc}</p>
                   </div>

                </div>
                `).join('')}
            </div>
        </div>
    </div>`
}

export function generateAboutHtml(style: string, props: AboutProps): string {
    const generators: Record<string, (props: AboutProps) => string> = {
        '1': generateAboutStyle1,
        '2': generateAboutStyle2,
        '3': generateAboutStyle3,
        '4': generateAboutStyle4,
        '5': generateAboutStyle5,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { AboutProps }
