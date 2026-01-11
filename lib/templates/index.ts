// Template Registry
export const templates = {
    atelier: {
        name: 'Atelier',
        displayName: 'Atelier - Editorial Learning',
        path: '/website-templates/atelier.html',
        suitableFor: ['salon', 'artisan', 'retail', 'restaurant'],
        heroVariants: 4,
        colorScheme: 'light',
        description: 'Clean, editorial design perfect for creative businesses'
    },
    studio: {
        name: 'Studio',
        displayName: 'Studio - Design & Digital',
        path: '/website-templates/studio.html',
        suitableFor: ['auto', 'medical', 'legal', 'fitness', 'technology'],
        heroVariants: 3,
        colorScheme: 'dark',
        description: 'Modern, tech-forward design for professional services'
    }
} as const

export type TemplateName = keyof typeof templates

export function selectTemplateForBusinessType(businessType: string): TemplateName {
    // Find template that suits this business type
    for (const [key, template] of Object.entries(templates)) {
        if (template.suitableFor.includes(businessType.toLowerCase())) {
            return key as TemplateName
        }
    }

    // Default to atelier for unknown types
    return 'atelier'
}

export function getTemplate(name: TemplateName) {
    return templates[name]
}

export function getAllTemplates() {
    return Object.entries(templates).map(([key, template]) => ({
        id: key,
        ...template
    }))
}
