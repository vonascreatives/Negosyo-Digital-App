'use client'

import { useState } from 'react'
import { Layout, Palette, Type, Layers, Box, FileText, ChevronDown, ChevronUp, Save } from 'lucide-react'

export interface EditorCustomizations {
    heroStyle: string
    aboutStyle: string
    servicesStyle: string
    footerStyle: string
    colorScheme: string // 'auto' | 'blue' | 'green' | ...
    colorSchemeId: string
    fontPairing: string // 'modern' | 'classic' | ...
    fontPairingId: string
}

interface ContentEditorProps {
    initialCustomizations?: Partial<EditorCustomizations>
    onUpdate: (customizations: EditorCustomizations) => void
    disabled?: boolean
}

export default function ContentEditor({ initialCustomizations, onUpdate, disabled }: ContentEditorProps) {
    const [customizations, setCustomizations] = useState<EditorCustomizations>({
        heroStyle: initialCustomizations?.heroStyle || '1',
        aboutStyle: initialCustomizations?.aboutStyle || '1',
        servicesStyle: initialCustomizations?.servicesStyle || '1',
        footerStyle: initialCustomizations?.footerStyle || '1',
        colorScheme: initialCustomizations?.colorSchemeId || 'auto',
        colorSchemeId: initialCustomizations?.colorSchemeId || 'auto',
        fontPairing: initialCustomizations?.fontPairingId || 'modern',
        fontPairingId: initialCustomizations?.fontPairingId || 'modern'
    })

    const [expandedSection, setExpandedSection] = useState<string | null>('layout')
    const [hasChanges, setHasChanges] = useState(false)

    /*
    // Debounce updates to parent
    useEffect(() => {
        // Skip if first render or if customizations haven't changed (strict mode safety)
        if (JSON.stringify(prevCustomizations.current) === JSON.stringify(customizations)) {
            return
        }

        // If this is the very first run (prev is null), we also want to skip usually, 
        // unless we want to sync default state up. But typically we wait for user.
        if (prevCustomizations.current === null) {
            prevCustomizations.current = customizations
            return
        }

        prevCustomizations.current = customizations

        const timer = setTimeout(() => {
            onUpdate(customizations)
        }, 500)
        return () => clearTimeout(timer)
    }, [customizations])
    */

    const updateField = (field: keyof EditorCustomizations, value: string) => {
        setCustomizations(prev => {
            const next = { ...prev, [field]: value }
            // Sync IDs
            if (field === 'colorScheme') next.colorSchemeId = value
            if (field === 'fontPairing') next.fontPairingId = value
            return next
        })
        setHasChanges(true)
    }

    const handleSave = () => {
        onUpdate(customizations)
        setHasChanges(false)
    }

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section)
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    Content Editor
                </h3>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-4">
                {/* Layout Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('layout')}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                            <Layers className="w-4 h-4" />
                            <span>Section Styles</span>
                        </div>
                        {expandedSection === 'layout' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {expandedSection === 'layout' && (
                        <div className="p-4 space-y-4 bg-white">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    Hero Section
                                    <span className="text-xs text-gray-400 font-normal ml-auto">Top Banner</span>
                                </label>
                                <select
                                    value={customizations.heroStyle}
                                    onChange={(e) => updateField('heroStyle', e.target.value)}
                                    disabled={disabled}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                                >
                                    <option value="1">Slideshow (Default)</option>
                                    <option value="2">Cinematic Video</option>
                                    <option value="3">Split Screen</option>
                                    <option value="4">Minimal Typography</option>
                                    <option value="5">Immersive Fullscreen</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    About / Features
                                    <span className="text-xs text-gray-400 font-normal ml-auto">Info Section</span>
                                </label>
                                <select
                                    value={customizations.aboutStyle}
                                    onChange={(e) => updateField('aboutStyle', e.target.value)}
                                    disabled={disabled}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                                >
                                    <option value="1">Process Grid (Default)</option>
                                    <option value="2">Zig-Zag Story</option>
                                    <option value="3">Big Typography</option>
                                    <option value="4">Stats Bento Box</option>
                                    <option value="5">Editorial Journey</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    Services / Gallery
                                    <span className="text-xs text-gray-400 font-normal ml-auto">Middle Section</span>
                                </label>
                                <select
                                    value={customizations.servicesStyle}
                                    onChange={(e) => updateField('servicesStyle', e.target.value)}
                                    disabled={disabled}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                                >
                                    <option value="1">Featured Grid</option>
                                    <option value="2">Split Layout</option>
                                    <option value="3">Bento Box</option>
                                    <option value="4">Accordion Cards</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    Footer
                                    <span className="text-xs text-gray-400 font-normal ml-auto">Bottom Info</span>
                                </label>
                                <select
                                    value={customizations.footerStyle}
                                    onChange={(e) => updateField('footerStyle', e.target.value)}
                                    disabled={disabled}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                                >
                                    <option value="1">Standard Multi-Column (Default)</option>
                                    <option value="2">Minimal Centered</option>
                                    <option value="3">Bold Brand Background</option>
                                    <option value="4">Newsletter Focused</option>
                                    <option value="5">Map & Contact Dark</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Appearance Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('appearance')}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                            <Palette className="w-4 h-4" />
                            <span>Appearance</span>
                        </div>
                        {expandedSection === 'appearance' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {expandedSection === 'appearance' && (
                        <div className="p-4 space-y-4 bg-white">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Palette className="w-4 h-4" />
                                    Color Scheme
                                </label>
                                <select
                                    value={customizations.colorSchemeId}
                                    onChange={(e) => updateField('colorScheme', e.target.value)}
                                    disabled={disabled}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                                >
                                    <option value="auto">Auto (from photos)</option>
                                    <option value="blue">Blue Professional</option>
                                    <option value="green">Green Fresh</option>
                                    <option value="purple">Purple Creative</option>
                                    <option value="orange">Orange Energetic</option>
                                    <option value="dark">Dark Elegant</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Type className="w-4 h-4" />
                                    Typography
                                </label>
                                <select
                                    value={customizations.fontPairingId}
                                    onChange={(e) => updateField('fontPairing', e.target.value)}
                                    disabled={disabled}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                                >
                                    <option value="modern">Modern (Default)</option>
                                    <option value="classic">Classic Serif</option>
                                    <option value="elegant">Elegant Display</option>
                                    <option value="bold">Bold & Loud</option>
                                    <option value="minimal">Minimal Sans</option>
                                    <option value="tech">Tech Mono</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <button
                    onClick={handleSave}
                    disabled={disabled || !hasChanges}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-white transition-colors
                        ${disabled || !hasChanges
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#1F2933] hover:bg-gray-800'
                        }`}
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>
        </div>
    )
}
