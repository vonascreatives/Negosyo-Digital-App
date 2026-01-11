'use client'

import { useState } from 'react'
import { Monitor, Smartphone, Palette, Type, Layout } from 'lucide-react'
import { toast } from 'sonner'

interface WebsitePreviewProps {
    previewUrl: string
    htmlContent: string
    submissionId: string
    initialCustomizations?: {
        heroStyle: string
        colorScheme: string | string[]
        fontPairing: string
        colorSchemeId?: string
        fontPairingId?: string
    }
    onPublish?: () => void
    onSaveDraft?: () => void
    onUpdateHtml?: (html: string) => void
    onUpdateCustomizations?: (customizations: any) => void
}

export default function WebsitePreview({ previewUrl, htmlContent, submissionId, initialCustomizations, onPublish, onSaveDraft, onUpdateHtml, onUpdateCustomizations }: WebsitePreviewProps) {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
    const [selectedHeroStyle, setSelectedHeroStyle] = useState(initialCustomizations?.heroStyle || '1')
    // Handle potential array value or missing ID by defaulting to 'auto' if safe check fails
    const [selectedColorScheme, setSelectedColorScheme] = useState(
        initialCustomizations?.colorSchemeId ||
        (typeof initialCustomizations?.colorScheme === 'string' ? initialCustomizations.colorScheme : 'auto')
    )
    const [selectedFontPairing, setSelectedFontPairing] = useState(initialCustomizations?.fontPairingId || initialCustomizations?.fontPairing || 'modern')
    const [isRegenerating, setIsRegenerating] = useState(false)
    const [currentHtmlContent, setCurrentHtmlContent] = useState(htmlContent)

    const handleRegenerate = async () => {
        setIsRegenerating(true)
        const loadingToast = toast.loading('Applying changes...')

        try {
            const response = await fetch('/api/generate-website', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId,
                    customizations: {
                        heroStyle: selectedHeroStyle,
                        colorScheme: selectedColorScheme === 'auto' ? undefined : getColorSchemeValues(selectedColorScheme),
                        fontPairing: selectedFontPairing,
                        // Persist IDs for UI state restoration
                        colorSchemeId: selectedColorScheme,
                        fontPairingId: selectedFontPairing
                    }
                })
            })

            if (!response.ok) throw new Error('Failed to regenerate')

            const data = await response.json()

            // Update the HTML content state
            if (data.htmlContent) {
                setCurrentHtmlContent(data.htmlContent)
                // Notify parent of HTML update
                if (onUpdateHtml) {
                    onUpdateHtml(data.htmlContent)
                }
            }

            // Sync customizations state with parent
            if (data.website?.customizations && onUpdateCustomizations) {
                onUpdateCustomizations(data.website.customizations)
            }

            // Reload iframe with new content
            const iframe = document.getElementById('website-preview') as HTMLIFrameElement
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.location.reload()
            }

            toast.success('Changes applied successfully!', { id: loadingToast })
        } catch (error) {
            console.error('Regeneration error:', error)
            toast.error('Failed to apply changes. Please try again.', { id: loadingToast })
        } finally {
            setIsRegenerating(false)
        }
    }

    // Helper function to get color scheme values
    const getColorSchemeValues = (scheme: string): string[] => {
        const schemes: Record<string, string[]> = {
            'blue': ['#3B82F6', '#60A5FA', '#2563EB'],
            'green': ['#10B981', '#34D399', '#059669'],
            'purple': ['#8B5CF6', '#A78BFA', '#7C3AED'],
            'orange': ['#F97316', '#FB923C', '#EA580C'],
            'dark': ['#1F2937', '#374151', '#4B5563']
        }
        return schemes[scheme] || schemes['blue']
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Controls */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Website Preview</h3>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={`p-2 rounded-md ${viewMode === 'desktop'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Monitor className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`p-2 rounded-md ${viewMode === 'mobile'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Smartphone className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Theme Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hero Style */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Layout className="w-4 h-4" />
                            Hero Style
                        </label>
                        <select
                            value={selectedHeroStyle}
                            onChange={(e) => setSelectedHeroStyle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="1">Style 1 - Slideshow</option>
                            <option value="2">Style 2 - Video</option>
                            <option value="3">Style 3 - Split</option>
                            <option value="4">Style 4 - Minimal</option>
                            <option value="5">Style 5 - Full Screen</option>
                        </select>
                    </div>

                    {/* Color Scheme */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Palette className="w-4 h-4" />
                            Color Scheme
                        </label>
                        <select
                            value={selectedColorScheme}
                            onChange={(e) => setSelectedColorScheme(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="auto">Auto (from photos)</option>
                            <option value="blue">Blue Professional</option>
                            <option value="green">Green Fresh</option>
                            <option value="purple">Purple Creative</option>
                            <option value="orange">Orange Energetic</option>
                            <option value="dark">Dark Elegant</option>
                        </select>
                    </div>

                    {/* Font Pairing */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            Font Pairing
                        </label>
                        <select
                            value={selectedFontPairing}
                            onChange={(e) => setSelectedFontPairing(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="modern">Modern</option>
                            <option value="classic">Classic</option>
                            <option value="elegant">Elegant</option>
                            <option value="bold">Bold</option>
                            <option value="minimal">Minimal</option>
                            <option value="professional">Professional</option>
                            <option value="creative">Creative</option>
                            <option value="tech">Tech</option>
                            <option value="friendly">Friendly</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                    >
                        {isRegenerating ? 'Regenerating...' : 'Apply Changes'}
                    </button>

                    <button
                        onClick={onSaveDraft}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={onPublish}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                        Publish Website
                    </button>
                </div>
            </div>

            {/* Preview Iframe */}
            <div className="bg-gray-100 p-4">
                <div className={`mx-auto bg-white shadow-lg ${viewMode === 'desktop' ? 'w-full' : 'w-[375px]'
                    } transition-all duration-300`}>
                    <iframe
                        id="website-preview"
                        srcDoc={currentHtmlContent}
                        className="w-full border-0"
                        style={{ height: '600px' }}
                        title="Website Preview"
                        sandbox="allow-same-origin allow-scripts"
                    />
                </div>
            </div>
        </div>
    )
}
