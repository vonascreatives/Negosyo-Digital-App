import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

interface SubmissionDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function SubmissionDetailPage({ params }: SubmissionDetailPageProps) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch submission with creator check for security
    const { data: submission, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", id)
        .eq("creator_id", user.id)
        .single()

    if (error || !submission) {
        notFound()
    }

    // Check if submission is incomplete (draft)
    const isIncomplete = (!submission.photos || submission.photos.length === 0) || (!submission.video_url && !submission.audio_url)
    const isDraft = submission.status === 'draft' || isIncomplete

    const getStatusBadge = () => {
        const s = submission.status?.toLowerCase()
        if (s === 'approved' || s === 'paid' || s === 'website_generated') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {s === 'paid' ? 'Paid' : s === 'website_generated' ? 'Website Generated' : 'Approved'}
                </span>
            )
        }
        if (s === 'rejected') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Rejected
                </span>
            )
        }
        // Check if incomplete (draft)
        if (isDraft) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-zinc-700">
                    Draft
                </span>
            )
        }
        // Default: Pending/In Review
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {s === 'submitted' ? 'Submitted' : s === 'in_review' ? 'In Review' : 'Pending'}
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/submissions"
                                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{submission.business_name}</h1>
                                <p className="text-sm text-gray-500">Submission Details</p>
                            </div>
                        </div>
                        {getStatusBadge()}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Business Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Business Information */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Business Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Business Name</label>
                                    <p className="text-gray-900 font-medium mt-1">{submission.business_name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Business Type</label>
                                    <p className="text-gray-900 mt-1">{submission.business_type}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Owner Name</label>
                                    <p className="text-gray-900 mt-1">{submission.owner_name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Owner Phone</label>
                                    <p className="text-gray-900 mt-1">{submission.owner_phone}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Owner Email</label>
                                    <p className="text-gray-900 mt-1">{submission.owner_email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">City</label>
                                    <p className="text-gray-900 mt-1">{submission.city}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-gray-500 uppercase font-medium">Address</label>
                                    <p className="text-gray-900 mt-1">{submission.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Photos */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Photos ({submission.photos?.length || 0})
                            </h2>
                            {submission.photos && submission.photos.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {submission.photos.map((url: string, index: number) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                        >
                                            <Image
                                                src={url}
                                                alt={`Photo ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No photos uploaded</p>
                            )}
                        </div>

                        {/* Interview */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Interview</h2>

                            {/* Transcript Section */}
                            {submission.transcript && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                            AI Transcript
                                        </h3>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                            Generated
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {submission.transcript}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Media Player */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                    {submission.transcript ? 'Original Recording' : 'Recording'}
                                </h3>
                                {submission.video_url ? (
                                    <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                                        <video
                                            src={submission.video_url}
                                            controls
                                            className="w-full h-full"
                                        />
                                    </div>
                                ) : submission.audio_url ? (
                                    <div className="p-6 bg-gray-50 rounded-xl">
                                        <audio
                                            src={submission.audio_url}
                                            controls
                                            className="w-full"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No interview uploaded</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Metadata */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Status</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Current Status</label>
                                    <p className="text-lg font-semibold text-gray-900 capitalize mt-1">{submission.status.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Creator Payout</label>
                                    <p className="text-2xl font-bold text-green-600">₱{submission.creator_payout || 0}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Submitted On</label>
                                    <p className="text-gray-900 mt-1">{new Date(submission.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quality Checklist */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Submission Checklist</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${submission.photos?.length > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {submission.photos?.length > 0 ? (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={submission.photos?.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                                        Photos uploaded ({submission.photos?.length || 0})
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(submission.video_url || submission.audio_url) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {(submission.video_url || submission.audio_url) ? (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={(submission.video_url || submission.audio_url) ? 'text-gray-900' : 'text-gray-500'}>
                                        Interview recording
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${submission.transcript ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {submission.transcript ? (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={submission.transcript ? 'text-gray-900' : 'text-gray-500'}>
                                        AI transcript generated
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(submission.business_name && submission.business_type) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {(submission.business_name && submission.business_type) ? (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={(submission.business_name && submission.business_type) ? 'text-gray-900' : 'text-gray-500'}>
                                        Business info complete
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Published Website */}
                        {submission.published_url && (
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Published Website</h2>
                                <a
                                    href={submission.published_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View Live Website
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
