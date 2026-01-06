"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function UploadPhotosPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // New files to upload
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    // Already uploaded photos from DB
    const [existingPhotos, setExistingPhotos] = useState<string[]>([])

    const [submissionId, setSubmissionId] = useState<string | null>(null)

    // Load submission ID and existing data
    useEffect(() => {
        const loadData = async () => {
            const id = sessionStorage.getItem('current_submission_id')
            if (!id) {
                router.push('/submit/info')
                return
            }
            setSubmissionId(id)

            try {
                const supabase = createClient()
                const { data } = await supabase
                    .from('submissions')
                    .select('photos')
                    .eq('id', id)
                    .single()

                if (data && data.photos) {
                    setExistingPhotos(data.photos)
                }
            } catch (err) {
                console.error("Error loading photos:", err)
            }
        }
        loadData()
    }, [router])

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url))
        }
    }, [previews])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            const totalCount = files.length + existingPhotos.length + newFiles.length

            // Validate: Max 10 files total
            if (totalCount > 10) {
                setError("You can only have a maximum of 10 photos total.")
                return
            }

            // Validate: Max 5MB per file
            const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024)
            if (oversizedFiles.length > 0) {
                setError("Some files are larger than 5MB. Please upload smaller images.")
                return
            }

            // check duplicate files (simple name check against current batch)
            const uniqueFiles = newFiles.filter(
                (newFile) => !files.some((file) => file.name === newFile.name && file.size === newFile.size)
            );

            // Validate: Must be images
            const nonImageFiles = uniqueFiles.filter(file => !file.type.startsWith('image/'))
            if (nonImageFiles.length > 0) {
                setError("Only image files (JPG, PNG) are allowed.")
                return
            }

            if (uniqueFiles.length === 0 && newFiles.length > 0 && files.length > 0) {
                setError("Duplicate files are not allowed.");
                return;
            }

            setError(null)
            setFiles(prev => [...prev, ...uniqueFiles])

            // Create previews
            const newPreviews = uniqueFiles.map(file => URL.createObjectURL(file))
            setPreviews(prev => [...prev, ...newPreviews])
        }
    }

    const removeFile = (index: number) => {
        const newFiles = [...files]
        const newPreviews = [...previews]

        URL.revokeObjectURL(newPreviews[index])

        newFiles.splice(index, 1)
        newPreviews.splice(index, 1)

        setFiles(newFiles)
        setPreviews(newPreviews)
    }

    // Note: We don't implement removing *existing* uploaded photos in this UI for simplicity,
    // as it creates complexity (deleting from storage immediately vs waiting for save).
    // Users can just overwrite data by re-submitting or we can add it later.

    const handleNext = async () => {
        if (!submissionId) return

        const totalPhotos = files.length + existingPhotos.length

        // Validate: Min 3 photos
        if (totalPhotos < 3) {
            setError("Please upload at least 3 photos.")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const uploadedUrls: string[] = []

            // Upload each NEW file
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${submissionId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('submission-photos')
                    .upload(fileName, file)

                if (uploadError) throw uploadError

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('submission-photos')
                    .getPublicUrl(fileName)

                uploadedUrls.push(publicUrl)
            }

            // Combine existing photos + new uploads
            const finalPhotoList = [...existingPhotos, ...uploadedUrls]

            // Update submission record
            const { error: updateError } = await supabase
                .from('submissions')
                .update({
                    photos: finalPhotoList,
                    updated_at: new Date().toISOString()
                })
                .eq('id', submissionId)

            if (updateError) throw updateError

            // Navigate to next step
            router.push('/submit/interview')
        } catch (err: any) {
            console.error('Error uploading photos:', err)
            setError(err.message || 'Failed to upload photos. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const totalCount = files.length + existingPhotos.length

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="text-sm text-gray-500 font-medium">STEP 2 OF 4</span>
            </div>

            {/* Progress Bar */}
            <div className="px-4 mb-6">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-6 pb-6">
                <div className="max-w-md mx-auto">
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Photos</h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Upload 3-10 photos of the business (storefront, interior, products, etc.)
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Upload Area */}
                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={loading || totalCount >= 10}
                            />
                            <div className="space-y-2">
                                <div className="mx-auto w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="text-gray-600 font-medium">
                                    Click or drag photos here
                                </div>
                                <div className="text-xs text-gray-400">
                                    JPG, PNG up to 5MB each
                                </div>
                            </div>
                        </div>

                        {/* File Previews */}
                        <div className="grid grid-cols-3 gap-2">
                            {/* Existing Photos (Saved) */}
                            {existingPhotos.map((url, index) => (
                                <div key={url} className="relative aspect-square bg-green-50 rounded-lg overflow-hidden group border border-green-200">
                                    <Image
                                        src={url}
                                        alt={`Saved Photo ${index + 1}`}
                                        fill
                                        className="object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">Saved</span>
                                    </div>
                                </div>
                            ))}

                            {/* New Photos (Pending) */}
                            {previews.map((url, index) => (
                                <div key={url} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                                    <Image
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Count Info */}
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>{totalCount} of 10 photos total</span>
                            <span className={totalCount < 3 ? "text-amber-500" : "text-green-500"}>
                                {totalCount < 3 ? "Need at least 3" : "Good to go!"}
                            </span>
                        </div>

                        {/* Next Button */}
                        <Button
                            onClick={handleNext}
                            disabled={loading || totalCount < 3}
                            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors mt-8"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {files.length > 0 ? `Uploading ${files.length} photos...` : 'Saving...'}
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Next: Upload Interview
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
