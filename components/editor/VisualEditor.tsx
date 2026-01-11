import { useState, useEffect, useRef } from 'react'
import { Save, RotateCcw, Eye, Image as ImageIcon, X, Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface Service {
    name: string
    description: string
}

interface CollectionItem {
    title: string
    subtitle: string
}

interface MethodologyStep {
    title: string
    subtitle: string
    description: string
}

interface WebsiteContent {
    business_name: string
    tagline: string
    about: string
    services: Service[]
    images?: string[]
    contact?: {
        phone?: string
        email?: string
        address?: string
    }
    // New fields
    methodology?: {
        title: string
        description: string
        steps: MethodologyStep[]
    }
    collection_items?: CollectionItem[]
    offer_section?: {
        title: string
        description: string
    }
    collections_heading?: string
    footer?: {
        brand_blurb: string
        social_links: { platform: string; url: string }[]
    }
    hero_cta?: {
        label: string
        link: string
    }
    services_cta?: {
        label: string
        link: string
    }
    unique_selling_points?: string[]
}

interface VisualEditorProps {
    initialContent: WebsiteContent
    htmlContent: string
    submissionId: string
    onSave: (content: WebsiteContent) => Promise<void>
}

export default function VisualEditor({
    initialContent,
    htmlContent,
    submissionId,
    onSave
}: VisualEditorProps) {
    const [content, setContent] = useState<WebsiteContent>(initialContent)
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [highlightedSection, setHighlightedSection] = useState<string | null>(null)
    const [iframeDoc, setIframeDoc] = useState<Document | null>(null)
    const [newImageUrl, setNewImageUrl] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    // Initialize missing fields with defaults on mount
    useEffect(() => {
        setContent(prev => {
            const next = { ...prev }
            let changed = false

            if (!next.methodology) {
                next.methodology = {
                    title: `Why Choose ${prev.business_name}`,
                    description: '',
                    steps: [
                        { title: 'Discover', subtitle: '', description: 'Identify your needs and explore our curated offerings.' },
                        { title: 'Apply', subtitle: '', description: 'Select the best options tailored for you.' },
                        { title: 'Master', subtitle: '', description: 'Experience excellence and achieve your goals.' }
                    ]
                }
                changed = true
            }

            if (!next.collection_items || next.collection_items.length === 0) {
                next.collection_items = [
                    { title: 'Technology', subtitle: 'Track' },
                    { title: 'Design Strategy', subtitle: 'Track' },
                    { title: 'Leadership', subtitle: 'Track' },
                    { title: 'Culture', subtitle: 'Track' }
                ]
                changed = true
            }

            if (!next.footer) {
                next.footer = {
                    brand_blurb: prev.about || '',
                    social_links: []
                }
                changed = true
            }

            if (!next.unique_selling_points) {
                next.unique_selling_points = []
                changed = true
            }

            if (!next.offer_section) {
                next.offer_section = {
                    title: 'What We Offer',
                    description: 'Intensive, outcome-driven programs designed for professionals. Limited seats available per season.'
                }
                next.collections_heading = 'Curated Disciplines'
                changed = true
            }

            if (!next.contact) {
                next.contact = {
                    phone: '',
                    email: '',
                    address: ''
                }
                changed = true
            }

            if (changed) {
                setHasChanges(true) // Mark as changed so user knows to save
                return next
            }
            return prev
        })
    }, [])

    useEffect(() => {
        // Get iframe document after it loads
        const iframe = document.getElementById('visual-preview') as HTMLIFrameElement
        if (iframe && iframe.contentDocument) {
            setIframeDoc(iframe.contentDocument)

            // Add click listeners to images in iframe
            const doc = iframe.contentDocument
            const images = doc.getElementsByTagName('img')

            const handleImageClick = (e: Event) => {
                e.preventDefault()
                e.stopPropagation()
                const imagesSection = document.getElementById('images-editor-section')
                if (imagesSection) {
                    imagesSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    imagesSection.classList.add('ring-2', 'ring-blue-500')
                    setTimeout(() => imagesSection.classList.remove('ring-2', 'ring-blue-500'), 2000)
                }
            }

            for (let i = 0; i < images.length; i++) {
                images[i].style.cursor = 'pointer'
                images[i].title = 'Click to edit images'
                images[i].addEventListener('click', handleImageClick)
            }
        }
    }, [htmlContent])

    // Sync iframe content when htmlContent prop updates (e.g. from live preview regeneration)
    useEffect(() => {
        const iframe = document.getElementById('visual-preview') as HTMLIFrameElement
        if (iframe && htmlContent) {
            (iframe as any).srcdoc = htmlContent
        }
    }, [htmlContent])

    const updateField = (field: keyof WebsiteContent, value: any) => {
        setContent(prev => ({ ...prev, [field]: value }))
        setHasChanges(true)
    }

    const updateService = (index: number, field: keyof Service, value: string) => {
        setContent(prev => ({
            ...prev,
            services: prev.services.map((service, i) =>
                i === index ? { ...service, [field]: value } : service
            )
        }))
        setHasChanges(true)
    }

    const updateContact = (field: string, value: string) => {
        setContent(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }))
        setHasChanges(true)
    }

    const addImage = () => {
        if (!newImageUrl) return
        setContent(prev => ({
            ...prev,
            images: [...(prev.images || []), newImageUrl]
        }))
        setNewImageUrl('')
        setHasChanges(true)
        toast.success('Image added')
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const toastId = toast.loading('Uploading image...')

        try {
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
            const filePath = `uploads/${submissionId}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath)

            // Add new image to content
            setContent(prev => ({
                ...prev,
                images: [...(prev.images || []), publicUrl]
            }))
            setHasChanges(true)
            toast.success('Image uploaded successfully', { id: toastId })
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload image', { id: toastId })
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const removeImage = (index: number) => {
        setContent(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }))
        setHasChanges(true)
    }

    const handleSave = async () => {
        // Validation
        if (content.contact?.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(content.contact.email)) {
                toast.error('Please enter a valid email address')
                return
            }
        }

        setIsSaving(true)
        const saveToast = toast.loading('Saving changes...')

        try {
            await onSave(content)
            setHasChanges(false)
            toast.success('Changes saved successfully!', { id: saveToast })
        } catch (error) {
            console.error('Save error:', error)
            toast.error('Failed to save changes', { id: saveToast })
        } finally {
            setIsSaving(false)
        }
    }

    const handleReset = () => {
        if (confirm('Reset all changes?')) {
            setContent(initialContent)
            setHasChanges(false)
            toast.info('Changes reset')
        }
    }

    const highlightElement = (selector: string, textContent?: string) => {
        if (!iframeDoc) return

        // Remove previous highlights
        iframeDoc.querySelectorAll('.editor-highlight').forEach(el => {
            el.classList.remove('editor-highlight')
        })

        // Add highlight to target element
        let elements: NodeListOf<Element> | Element[] = iframeDoc.querySelectorAll(selector)

        if (textContent) {
            elements = Array.from(elements).filter(el =>
                el.textContent?.includes(textContent)
            )
        }

        elements.forEach(el => {
            el.classList.add('editor-highlight')
        })

        // Add highlight styles if not already present
        if (!iframeDoc.getElementById('editor-highlight-styles')) {
            const style = iframeDoc.createElement('style')
            style.id = 'editor-highlight-styles'
            style.textContent = `
                .editor-highlight {
                    outline: 3px solid #3B82F6 !important;
                    outline-offset: 2px;
                    background-color: rgba(59, 130, 246, 0.1) !important;
                    transition: all 0.2s ease;
                    position: relative;
                }
                .editor-highlight::before {
                    content: '✏️ Editing';
                    position: absolute;
                    top: -30px;
                    left: 0;
                    background: #3B82F6;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    z-index: 1000;
                }
            `
            iframeDoc.head.appendChild(style)
        }

        setHighlightedSection(selector)
    }

    const removeHighlight = () => {
        if (!iframeDoc) return
        iframeDoc.querySelectorAll('.editor-highlight').forEach(el => {
            el.classList.remove('editor-highlight')
        })
        setHighlightedSection(null)
    }

    return (
        <div className="flex flex-col lg:flex-row gap-4 min-h-[600px] lg:h-[800px]">
            {/* Left Panel - Editor */}
            <div className="w-full lg:w-1/2 bg-white rounded-lg border border-gray-200 overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Content Editor</h3>
                            <p className="text-sm text-gray-500">Edit content and see changes highlighted</p>
                        </div>
                        <div className="flex gap-2">
                            {/* Buttons removed as per request */}
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Business Name */}
                    <div
                        onMouseEnter={() => highlightElement('h1')}
                        onMouseLeave={removeHighlight}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Eye className="w-4 h-4 inline mr-1" />
                            Business Name (Main Heading)
                        </label>
                        <input
                            type="text"
                            value={content.business_name}
                            onChange={(e) => updateField('business_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            maxLength={100}
                        />
                        <p className="text-xs text-gray-500 mt-1">{content.business_name.length}/100</p>
                    </div>

                    {/* Tagline */}
                    <div
                        onMouseEnter={() => highlightElement('p.leading-snug')}
                        onMouseLeave={removeHighlight}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Eye className="w-4 h-4 inline mr-1" />
                            Tagline (Hero Section)
                        </label>
                        <input
                            type="text"
                            value={content.tagline}
                            onChange={(e) => updateField('tagline', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            maxLength={200}
                        />
                        <p className="text-xs text-gray-500 mt-1">{content.tagline.length}/200</p>
                    </div>

                    {/* About */}
                    <div
                        onMouseEnter={() => highlightElement('p.leading-snug')}
                        onMouseLeave={removeHighlight}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Eye className="w-4 h-4 inline mr-1" />
                            About (Description)
                        </label>
                        <textarea
                            value={content.about}
                            onChange={(e) => updateField('about', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={3}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">{content.about.length}/500</p>
                    </div>

                    {/* About/Hero CTA */}
                    <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <label className="text-sm font-medium text-gray-700">About/Hero Button</label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-500">Label</label>
                                <input
                                    type="text"
                                    value={content.hero_cta?.label || ''}
                                    onChange={(e) => updateField('hero_cta', { ...content.hero_cta, label: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="e.g. Explore Offers"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Link</label>
                                <input
                                    type="text"
                                    value={content.hero_cta?.link || ''}
                                    onChange={(e) => updateField('hero_cta', { ...content.hero_cta, link: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="e.g. #services"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div
                        id="images-editor-section"
                        className="p-4 rounded-lg border border-gray-200 transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                <ImageIcon className="w-4 h-4 inline mr-1" />
                                Website Images (Hero Slideshow)
                            </label>
                            <span className="text-xs text-gray-500">
                                {(content.images?.length || 0)} images available
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                            {content.images?.map((url, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img
                                        src={url}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-full object-cover rounded-md border border-gray-200"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove image"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">
                                        #{index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="Paste image URL here..."
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={addImage}
                                disabled={!newImageUrl}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        {/* File Upload UI */}
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full px-4 py-2 bg-white border border-dashed border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2 text-sm text-gray-600 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                {isUploading ? 'Uploading...' : 'Upload Image from Device'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Images are used in rotation for slides and sections. Add/remove to change the sequence.
                        </p>
                    </div>

                    {/* Unique Selling Points */}
                    <div className="p-4 rounded-lg border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">Unique Selling Points</h4>
                            <button
                                onClick={() => {
                                    const newUSPs = [...(content.unique_selling_points || [])]
                                    newUSPs.push('New Selling Point')
                                    updateField('unique_selling_points', newUSPs)
                                }}
                                className="p-1 px-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-xs flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Add USP
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(content.unique_selling_points || []).map((usp, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={usp}
                                        onChange={(e) => {
                                            const newUSPs = [...(content.unique_selling_points || [])]
                                            newUSPs[index] = e.target.value
                                            updateField('unique_selling_points', newUSPs)
                                        }}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                        placeholder="Selling Point"
                                    />
                                    <button
                                        onClick={() => {
                                            const newUSPs = content.unique_selling_points!.filter((_, i) => i !== index)
                                            updateField('unique_selling_points', newUSPs)
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {(!content.unique_selling_points || content.unique_selling_points.length === 0) && (
                                <p className="text-xs text-gray-400 italic">No unique selling points added.</p>
                            )}
                        </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Services / Products</h4>
                        {content.services.map((service, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => highlightElement(`.group.cursor-pointer:nth-of-type(${index + 1})`)}
                                onMouseLeave={removeHighlight}
                                className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer space-y-3"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">Service Card {index + 1}</span>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Service Name
                                    </label>
                                    <input
                                        type="text"
                                        value={service.name}
                                        onChange={(e) => updateService(index, 'name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        maxLength={100}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={service.description}
                                        onChange={(e) => updateService(index, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        rows={2}
                                        maxLength={300}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Services CTA */}
                        <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <label className="text-sm font-medium text-gray-700">Services Button (View Services)</label>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-500">Label</label>
                                    <input
                                        type="text"
                                        value={content.services_cta?.label || ''}
                                        onChange={(e) => updateField('services_cta', { ...content.services_cta, label: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                        placeholder="e.g. View Services"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Link</label>
                                    <input
                                        type="text"
                                        value={content.services_cta?.link || ''}
                                        onChange={(e) => updateField('services_cta', { ...content.services_cta, link: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                        placeholder="e.g. /services"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div
                        onMouseEnter={() => highlightElement('footer')}
                        onMouseLeave={removeHighlight}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer space-y-3"
                    >
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Contact Information (Footer)
                        </h4>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={content.contact?.phone || ''}
                                onChange={(e) => {
                                    // Allow numbers, spaces, dashes, parens, and plus sign
                                    const val = e.target.value.replace(/[^0-9+\- ()]/g, '')
                                    updateContact('phone', val)
                                }}
                                placeholder="Enter phone number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                maxLength={50}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                value={content.contact?.email || ''}
                                onChange={(e) => {
                                    updateContact('email', e.target.value.trim())
                                }}
                                placeholder="Enter email address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                maxLength={100}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                            <textarea
                                value={content.contact?.address || ''}
                                onChange={(e) => updateContact('address', e.target.value)}
                                placeholder="Enter business address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows={2}
                                maxLength={200}
                            />
                        </div>
                    </div>

                    {/* Offer Section (replacing Collections) */}
                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium text-gray-900">Offer Section (What We Offer)</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Section Title</label>
                                <input
                                    type="text"
                                    value={content.offer_section?.title || ''}
                                    onChange={(e) => {
                                        setContent(prev => ({
                                            ...prev,
                                            offer_section: {
                                                description: prev.offer_section?.description || '',
                                                ...prev.offer_section,
                                                title: e.target.value
                                            }
                                        }));
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                <textarea
                                    value={content.offer_section?.description || ''}
                                    onChange={(e) => {
                                        setContent(prev => ({
                                            ...prev,
                                            offer_section: {
                                                title: prev.offer_section?.title || '',
                                                ...prev.offer_section,
                                                description: e.target.value
                                            }
                                        }));
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Collections Heading */}
                    <div className="space-y-3 border-t pt-4">
                        <h4 className="font-medium text-gray-900">Collections Section Heading</h4>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Heading</label>
                            <input
                                type="text"
                                value={content.collections_heading || ''}
                                onChange={(e) => {
                                    setContent(prev => ({ ...prev, collections_heading: e.target.value }));
                                    setHasChanges(true);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    {/* Collection Items (Curated Disciplines) */}
                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium text-gray-900">Featured Collections</h4>
                        {content.collection_items?.map((item, index) => (
                            <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer space-y-2">
                                <label className="block text-xs font-medium text-gray-600">Item {index + 1} Title</label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                        const newItems = [...(content.collection_items || [])];
                                        newItems[index] = { ...newItems[index], title: e.target.value };
                                        setContent(prev => ({ ...prev, collection_items: newItems }));
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <label className="block text-xs font-medium text-gray-600">Subtitle/Track Label</label>
                                <input
                                    type="text"
                                    value={item.subtitle}
                                    onChange={(e) => {
                                        const newItems = [...(content.collection_items || [])];
                                        newItems[index] = { ...newItems[index], subtitle: e.target.value };
                                        setContent(prev => ({ ...prev, collection_items: newItems }));
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Methodology Section */}
                    <div
                        onMouseEnter={() => highlightElement('h2', 'Structured for Outcome')}
                        onMouseLeave={removeHighlight}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer space-y-3"
                    >
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Methodology / How It Works
                        </h4>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Section Title</label>
                            <input
                                type="text"
                                value={content.methodology?.title || ''}
                                onChange={(e) => {
                                    setContent(prev => ({
                                        ...prev,
                                        methodology: { ...prev.methodology, title: e.target.value } as any
                                    }))
                                    setHasChanges(true)
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Structured for Outcome"
                            />
                        </div>
                        {/* Steps */}
                        {content.methodology?.steps?.map((step, idx) => (
                            <div key={idx} className="border-t pt-2 mt-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Step {idx + 1}</label>
                                <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) => {
                                        const newSteps = [...(content.methodology?.steps || [])];
                                        newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                                        setContent(prev => ({ ...prev, methodology: { ...prev.methodology, steps: newSteps } as any }));
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm"
                                    placeholder="Step Title (e.g. Discover)"
                                />
                                <textarea
                                    value={step.description}
                                    onChange={(e) => {
                                        const newSteps = [...(content.methodology?.steps || [])];
                                        newSteps[idx] = { ...newSteps[idx], description: e.target.value };
                                        setContent(prev => ({ ...prev, methodology: { ...prev.methodology, steps: newSteps } as any }));
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    rows={2}
                                    placeholder="Description"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Footer Section */}
                    <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer space-y-3">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Footer Content
                        </h4>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Brand Blurb</label>
                            <textarea
                                value={content.footer?.brand_blurb || ''}
                                onChange={(e) => {
                                    setContent(prev => ({
                                        ...prev,
                                        footer: { ...prev.footer, brand_blurb: e.target.value } as any
                                    }))
                                    setHasChanges(true)
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-20 text-sm"
                                rows={3}
                                maxLength={300}
                                placeholder="Short description for footer..."
                            />
                        </div>
                    </div>

                    {/* Save Indicator & Actions (Moved to Bottom) */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 z-10 flex justify-between items-center shadow-lg">
                        <div className="text-sm">
                            {hasChanges ? (
                                <span className="text-yellow-600 font-medium">⚠️ Unsaved changes</span>
                            ) : (
                                <span className="text-gray-500">All changes saved</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleReset}
                                disabled={!hasChanges || isSaving}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-semibold shadow-sm"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Live Preview */}
            <div className="w-full lg:w-1/2 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-white border-b border-gray-200 p-3">
                    <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
                    <p className="text-xs text-gray-500">Hover over fields to see where they appear. Click images in preview to edit.</p>
                </div>
                <div className="h-[400px] lg:h-full overflow-auto">
                    <iframe
                        id="visual-preview"
                        srcDoc={htmlContent}
                        className="w-full h-full border-0"
                        title="Website Preview"
                        sandbox="allow-same-origin allow-scripts"
                    />
                </div>
            </div>
        </div >
    )
}
