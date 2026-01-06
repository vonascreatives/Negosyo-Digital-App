"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

interface Submission {
    id: string
    business_name: string
    business_type: string
    owner_name: string
    owner_phone: string
    owner_email: string
    address: string
    city: string
    photos: string[]
    video_url?: string
    audio_url?: string
    creator_payout: number
}

export default function ReviewSubmissionPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submission, setSubmission] = useState<Submission | null>(null)
    const [agreed, setAgreed] = useState(false)

    useEffect(() => {
        const fetchSubmission = async () => {
            const id = sessionStorage.getItem('current_submission_id')
            if (!id) {
                router.push('/submit/info')
                return
            }

            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('submissions')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setSubmission(data)
            } catch (err: any) {
                console.error('Error fetching submission:', err)
                setError('Failed to load submission data.')
            } finally {
                setLoading(false)
            }
        }

        fetchSubmission()
    }, [router])

    const handleSubmit = async () => {
        if (!submission || !agreed) return

        setSubmitting(true)
        setError(null)

        try {
            const supabase = createClient()

            // Update status to submitted
            const { error: updateError } = await supabase
                .from('submissions')
                .update({
                    status: 'submitted',
                    updated_at: new Date().toISOString()
                })
                .eq('id', submission.id)

            if (updateError) throw updateError

            // Navigate to success page
            router.push('/submit/success')
        } catch (err: any) {
            console.error('Error submitting:', err)
            setError(err.message || 'Failed to submit. Please try again.')
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (!submission) return null

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
                <span className="text-sm text-gray-500 font-medium">STEP 4 OF 4</span>
            </div>

            {/* Progress Bar */}
            <div className="px-4 mb-6">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-6 pb-6">
                <div className="max-w-md mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h1>
                        <p className="text-sm text-gray-500">
                            Please review all information before submitting.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Business Info Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Business Info</h3>
                            <Link href="/submit/info" className="text-sm text-green-600 font-medium hover:text-green-700">
                                Edit
                            </Link>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-medium">Business</label>
                                <p className="text-gray-900 font-medium">{submission.business_name}</p>
                                <p className="text-sm text-gray-500">{submission.business_type}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-medium">Owner</label>
                                <p className="text-gray-900">{submission.owner_name}</p>
                                <p className="text-sm text-gray-500">{submission.owner_phone}</p>
                                {submission.owner_email && (
                                    <p className="text-sm text-gray-500">{submission.owner_email}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-medium">Location</label>
                                <p className="text-gray-900">{submission.address}</p>
                                <p className="text-sm text-gray-500">{submission.city}</p>
                            </div>
                        </div>
                    </div>

                    {/* Photos Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Photos</h3>
                            <Link href="/submit/photos" className="text-sm text-green-600 font-medium hover:text-green-700">
                                Edit
                            </Link>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                {(submission.photos || []).slice(0, 4).map((url, i) => (
                                    <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={url}
                                            alt={`Photo ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">
                                {submission.photos?.length || 0} photos uploaded
                            </p>
                        </div>
                    </div>

                    {/* Interview Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Interview</h3>
                            <Link href="/submit/interview" className="text-sm text-green-600 font-medium hover:text-green-700">
                                Edit
                            </Link>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    {submission.video_url ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {submission.video_url ? 'Video Interview' : 'Audio Interview'}
                                    </p>
                                    <p className="text-sm text-green-600 font-bold">
                                        Payout: ₱{submission.creator_payout}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-xl">
                        <Checkbox
                            id="terms"
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                            checked={agreed}
                            onCheckedChange={(checked) => setAgreed(checked as boolean)}
                        />
                        <div className="space-y-1">
                            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I confirm this is a real business
                            </Label>
                            <p className="text-xs text-gray-500">
                                By submitting, I confirm that the business owner has agreed to the ₱1000 service fee and that all information provided is accurate.
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || !agreed}
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20"
                    >
                        {submitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'Submit Application'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
