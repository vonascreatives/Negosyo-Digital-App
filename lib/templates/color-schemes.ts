
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
    return `
    <style id="theme-colors">
        :root {
            --primary: ${scheme.primary};
            --secondary: ${scheme.secondary};
            --accent: ${scheme.accent};
            --background: ${scheme.background};
            --light: ${scheme.light};
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
