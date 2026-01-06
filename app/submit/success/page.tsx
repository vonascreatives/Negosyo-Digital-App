"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function SubmissionSuccessPage() {
    const router = useRouter()
    const [payout, setPayout] = useState<number | null>(null)
    const [submissionId, setSubmissionId] = useState<string | null>(null)

    useEffect(() => {
        const id = sessionStorage.getItem('current_submission_id')
        if (id) {
            setSubmissionId(id)
            fetchPayout(id)
            // Clear session storage so user can start fresh next time
            sessionStorage.removeItem('current_submission_id')
        }
    }, [])

    const fetchPayout = async (id: string) => {
        try {
            const supabase = createClient()
            const { data } = await supabase
                .from('submissions')
                .select('creator_payout')
                .eq('id', id)
                .single()

            if (data) {
                setPayout(data.creator_payout)
            }
        } catch (err) {
            console.error('Error fetching payout:', err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Success Animation/Icon */}
                <div className="relative">
                    <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center animate-in zoom-in duration-500">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    {/* Confetti decorations can be added here with CSS/SVG if desired */}
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Submission Received!</h1>
                    <p className="text-gray-500 text-lg">
                        Great job! We've received your submission and will start processing it right away.
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <div className="pb-4 border-b border-gray-100">
                        <p className="text-sm text-gray-500 uppercase font-medium tracking-wide">Expected Payout</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">
                            ₱{payout || '---'}
                        </p>
                    </div>

                    <div className="space-y-3 text-left">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold">1</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                We'll review the submission and generate the website within <span className="font-semibold text-gray-900">24–48 hours</span>.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold">2</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                You'll receive your payout once the client pays the service fee.
                            </p>
                        </div>
                    </div>

                    {submissionId && (
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                Submission ID: <span className="font-mono">{submissionId.slice(0, 8)}...</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link href="/dashboard">
                        <Button className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-md shadow-lg shadow-gray-900/20">
                            Back to Dashboard
                        </Button>
                    </Link>

                    <Link href="/submit/info">
                        <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-900">
                            Submit Another Business
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
