/**
 * Services Section Style Generators - Complete Redesign
 * 4 premium, modern variants optimized for restaurant/service showcase
 */

interface ServicesProps {
    photos: string[]
    services?: Array<{ name: string; description: string }>
}

/**
 * Style 1: Featured Grid with Hover Overlay
 * Clean card grid with elegant hover effects
 */
function generateServicesStyle1(props: ServicesProps): string {
    const photos = (props.photos && props.photos.length > 0) ? props.photos : [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000'
    ]
    const services = props.services && props.services.length > 0 ? props.services : [
        { name: 'Traditional Filipino Cuisine', description: 'Enjoy our wide range of Filipino dishes, from karikale to grilled seafood' },
        { name: 'Private Dining', description: 'Host your festive family gatherings or quiet lunches in our cozy restaurant' },
        { name: 'Dessert Specials', description: 'Indulge in our creamy buko pandan and other Filipino desserts' }
    ]

    return `
    <div class="py-24 bg-gradient-to-b from-white to-gray-50" id="services-section">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <span class="inline-block px-4 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold tracking-wider uppercase mb-4">What We Offer</span>
                <h2 class="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Featured Collections</h2>
                <p class="text-gray-600 max-w-2xl mx-auto text-lg">Discover our carefully curated offerings designed to delight your senses</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${services.map((service, i) => `
                <div class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div class="relative h-64 overflow-hidden">
                        <img src="${photos[i % photos.length]}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${service.name}">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div class="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg shadow-lg">
                            ${String(i + 1).padStart(2, '0')}
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">${service.name}</h3>
                        <p class="text-gray-600 leading-relaxed mb-4">${service.description}</p>
                        <div class="flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                            <span>Learn More</span>
                            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </div>`
}

/**
 * Style 2: Split Layout with Methodology
 * Alternating image-text layout with process steps
 */
function generateServicesStyle2(props: ServicesProps): string {
    const photos = (props.photos && props.photos.length > 0) ? props.photos : [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000'
    ]
    const services = props.services && props.services.length > 0 ? props.services : [
        { name: 'Traditional Filipino Cuisine', description: 'Enjoy our wide range of Filipino dishes, from karikale to grilled seafood' },
        { name: 'Private Dining', description: 'Host your festive family gatherings or quiet lunches in our cozy restaurant' },
        { name: 'Dessert Specials', description: 'Indulge in our creamy buko pandan and other Filipino desserts' }
    ]

    const methodology = ['Discover', 'Experience', 'Savor', 'Share']

    return `
    <div class="py-24 bg-white" id="services-section">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-20">
                <h2 class="text-5xl font-serif text-gray-900 mb-6">Our Offerings</h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">Each experience is crafted with passion and attention to detail</p>
            </div>

            <div class="space-y-24">
                ${services.map((service, i) => `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}">
                    <div class="${i % 2 === 1 ? 'lg:order-2' : ''}">
                        <div class="relative rounded-3xl overflow-hidden shadow-2xl group">
                            <img src="${photos[i % photos.length]}" class="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" alt="${service.name}">
                            <div class="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 to-transparent"></div>
                            <div class="absolute bottom-6 left-6 right-6">
                                <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                                            ${i + 1}
                                        </div>
                                        <span class="text-sm font-semibold text-gray-700 uppercase tracking-wider">Step ${i + 1}: ${methodology[i % methodology.length]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="${i % 2 === 1 ? 'lg:order-1' : ''}">
                        <div class="space-y-6">
                            <div>
                                <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Featured</span>
                                <h3 class="text-4xl font-serif font-bold text-gray-900 mb-4">${service.name}</h3>
                                <p class="text-lg text-gray-600 leading-relaxed">${service.description}</p>
                            </div>
                            
                            <div class="border-l-4 border-emerald-500 pl-6 py-2">
                                <h4 class="font-bold text-gray-900 mb-2">How It Works</h4>
                                <ul class="space-y-2 text-gray-600">
                                    <li class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                        <span>Browse our curated selection</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                        <span>Prepared fresh with quality ingredients</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                        <span>Served with care and attention</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </div>`
}

/**
 * Style 3: Bento Box Layout
 * Modern asymmetric grid with varied card sizes
 */
function generateServicesStyle3(props: ServicesProps): string {
    const photos = (props.photos && props.photos.length > 0) ? props.photos : [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000'
    ]
    const services = props.services && props.services.length > 0 ? props.services : [
        { name: 'Traditional Filipino Cuisine', description: 'Enjoy our wide range of Filipino dishes, from karikale to grilled seafood' },
        { name: 'Private Dining', description: 'Host your festive family gatherings or quiet lunches in our cozy restaurant' },
        { name: 'Dessert Specials', description: 'Indulge in our creamy buko pandan and other Filipino desserts' }
    ]

    return `
    <div class="py-24 bg-gray-50" id="services-section">
        <div class="max-w-7xl mx-auto px-6">
            <div class="mb-16">
                <h2 class="text-5xl md:text-6xl font-serif text-gray-900 mb-4">What We Offer</h2>
                <div class="flex items-center gap-4">
                    <div class="h-1 w-20 bg-emerald-600 rounded-full"></div>
                    <p class="text-gray-600 text-lg">Curated experiences for every occasion</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[280px]">
                ${services.map((service, i) => {
        const layouts = [
            'md:col-span-4 md:row-span-2',
            'md:col-span-2 md:row-span-1',
            'md:col-span-3 md:row-span-1'
        ]
        return `
                    <div class="group relative ${layouts[i % layouts.length]} rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                        <img src="${photos[i % photos.length]}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${service.name}">
                        <div class="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-transparent group-hover:from-emerald-900/70 transition-all duration-500"></div>
                        
                        <div class="absolute inset-0 p-8 flex flex-col justify-end">
                            <div class="transform transition-transform duration-500 group-hover:-translate-y-2">
                                <div class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-3">
                                    Collection ${i + 1}
                                </div>
                                <h3 class="text-3xl font-serif font-bold text-white mb-3 leading-tight">${service.name}</h3>
                                <p class="text-white/90 text-sm leading-relaxed mb-4 line-clamp-2">${service.description}</p>
                                
                                <div class="flex items-center gap-2 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <span>Explore</span>
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
    }).join('')}
                
                <!-- Info Card -->
                <div class="md:col-span-3 md:row-span-1 bg-emerald-600 rounded-3xl p-8 flex flex-col justify-center text-white">
                    <h4 class="text-2xl font-serif font-bold mb-3">Ready to Experience?</h4>
                    <p class="text-emerald-50 mb-6">Visit us today and discover the authentic flavors that make us special</p>
                    <button class="self-start px-6 py-3 bg-white text-emerald-600 rounded-full font-bold hover:bg-emerald-50 transition-colors">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    </div>`
}

/**
 * Style 4: Accordion Cards with Expandable Details
 * Interactive cards that expand to show full methodology
 */
function generateServicesStyle4(props: ServicesProps): string {
    const photos = (props.photos && props.photos.length > 0) ? props.photos : [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000'
    ]
    const services = props.services && props.services.length > 0 ? props.services : [
        { name: 'Traditional Filipino Cuisine', description: 'Enjoy our wide range of Filipino dishes, from karikale to grilled seafood' },
        { name: 'Private Dining', description: 'Host your festive family gatherings or quiet lunches in our cozy restaurant' },
        { name: 'Dessert Specials', description: 'Indulge in our creamy buko pandan and other Filipino desserts' }
    ]

    return `
    <div class="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white" id="services-section">
        <div class="max-w-6xl mx-auto px-6">
            <div class="text-center mb-20">
                <span class="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">Our Services</span>
                <h2 class="text-5xl md:text-6xl font-serif text-white mb-6">Featured Collections</h2>
                <p class="text-gray-400 text-xl max-w-2xl mx-auto">Hover over each card to discover our methodology and approach</p>
            </div>

            <div class="space-y-6">
                ${services.map((service, i) => `
                <div class="group relative bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all duration-500">
                    <div class="grid grid-cols-1 md:grid-cols-3">
                        <!-- Image Section -->
                        <div class="relative h-64 md:h-auto overflow-hidden">
                            <img src="${photos[i % photos.length]}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${service.name}">
                            <div class="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
                            <div class="absolute top-6 left-6">
                                <div class="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                                    ${String(i + 1).padStart(2, '0')}
                                </div>
                            </div>
                        </div>

                        <!-- Content Section -->
                        <div class="md:col-span-2 p-8">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <span class="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">Featured Item ${i + 1}</span>
                                    <h3 class="text-3xl font-serif font-bold text-white mb-3">${service.name}</h3>
                                    <p class="text-gray-300 text-lg leading-relaxed mb-6">${service.description}</p>
                                </div>
                            </div>

                            <!-- Methodology Section (Visible on Hover) -->
                            <div class="border-t border-gray-600 pt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <h4 class="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">How It Works</h4>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div class="flex items-start gap-3">
                                        <div class="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span class="text-emerald-400 font-bold text-sm">1</span>
                                        </div>
                                        <div>
                                            <div class="text-white font-semibold text-sm mb-1">Select</div>
                                            <div class="text-gray-400 text-xs">Choose from our menu</div>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <div class="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span class="text-emerald-400 font-bold text-sm">2</span>
                                        </div>
                                        <div>
                                            <div class="text-white font-semibold text-sm mb-1">Prepare</div>
                                            <div class="text-gray-400 text-xs">Freshly made to order</div>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <div class="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span class="text-emerald-400 font-bold text-sm">3</span>
                                        </div>
                                        <div>
                                            <div class="text-white font-semibold text-sm mb-1">Enjoy</div>
                                            <div class="text-gray-400 text-xs">Savor every bite</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>

            <!-- CTA Section -->
            <div class="mt-16 text-center">
                <div class="inline-flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full px-8 py-4 shadow-2xl hover:shadow-emerald-500/50 transition-shadow">
                    <span class="text-white font-bold text-lg">Ready to get started?</span>
                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>`
}

export function generateServicesHtml(style: string, props: ServicesProps): string {
    const generators: Record<string, (props: ServicesProps) => string> = {
        '1': generateServicesStyle1,
        '2': generateServicesStyle2,
        '3': generateServicesStyle3,
        '4': generateServicesStyle4,
    }

    const generator = generators[style] || generators['1']
    return generator(props)
}

export type { ServicesProps }
