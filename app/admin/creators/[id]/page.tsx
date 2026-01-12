"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/useAdmin"
import { adminService } from "@/lib/services/admin.service"
import type { Creator, Submission, CreatorStatus } from "@/types/database"

interface CreatorWithStats extends Creator {
    submission_count: number
}

export default function CreatorDetailPage() {
    const params = useParams()
    const router = useRouter()
    const creatorId = params.id as string

    const { isAdmin, loading: authLoading } = useAdminAuth()
    const [creator, setCreator] = useState<CreatorWithStats | null>(null)
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updating, setUpdating] = useState(false)

    // Confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [pendingAction, setPendingAction] = useState<'suspend' | 'reactivate' | null>(null)

    // Fetch creator data
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const [creatorData, submissionsData] = await Promise.all([
                    adminService.getCreatorWithStats(creatorId),
                    adminService.getCreatorSubmissions(creatorId)
                ])
                setCreator(creatorData)
                setSubmissions(submissionsData)
            } catch (err: any) {
                setError(err.message || 'Failed to load creator')
            } finally {
                setLoading(false)
            }
        }

        if (isAdmin && creatorId) {
            fetchData()
        }
    }, [isAdmin, creatorId])

    const handleStatusChange = async () => {
        if (!creator || !pendingAction) return

        setUpdating(true)
        try {
            const newStatus = pendingAction === 'suspend' ? 'suspended' : 'active'
            await adminService.updateCreatorStatus(creator.id, newStatus)
            setCreator({ ...creator, status: newStatus as CreatorStatus })
            setShowConfirmModal(false)
            setPendingAction(null)
        } catch (err: any) {
            setError(err.message || 'Failed to update status')
        } finally {
            setUpdating(false)
        }
    }

    const openConfirmModal = (action: 'suspend' | 'reactivate') => {
        setPendingAction(action)
        setShowConfirmModal(true)
    }

    const getStatusBadge = (status: CreatorStatus) => {
        const styles = {
            active: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            suspended: 'bg-red-100 text-red-800 border-red-200',
        }
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    const getSubmissionStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-600',
            submitted: 'bg-blue-100 text-blue-700',
            in_review: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
            website_generated: 'bg-purple-100 text-purple-700',
            published: 'bg-emerald-100 text-emerald-700',
        }
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
                {status.replace('_', ' ')}
            </span>
        )
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (!isAdmin) return null

    if (!creator) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Creator Not Found</h2>
                    <Link href="/admin/creators">
                        <Button>Back to Creators</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/creators">
                                <Button variant="outline" size="sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {creator.first_name} {creator.middle_name ? `${creator.middle_name} ` : ''}{creator.last_name}
                                </h1>
                                <p className="text-sm text-gray-500">Creator Details</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {creator.status === 'suspended' ? (
                                <Button
                                    onClick={() => openConfirmModal('reactivate')}
                                    disabled={updating}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                    {updating ? 'Updating...' : 'Reactivate Creator'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => openConfirmModal('suspend')}
                                    disabled={updating || creator.role === 'admin'}
                                    variant="outline"
                                    className="border-red-600 text-red-600 hover:bg-red-50"
                                >
                                    {updating ? 'Updating...' : 'Suspend Creator'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold">
                                    {creator.first_name.charAt(0)}{creator.last_name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        {creator.first_name} {creator.last_name}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getStatusBadge(creator.status)}
                                        {creator.role === 'admin' && (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                                                👑 Admin
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="text-gray-900 font-medium">{creator.email || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phone</span>
                                    <span className="text-gray-900 font-medium">{creator.phone || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Referral Code</span>
                                    <span className="text-gray-900 font-medium font-mono">{creator.referral_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Referred By</span>
                                    <span className="text-gray-900 font-medium">{creator.referred_by || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="text-gray-900 font-medium">
                                        {new Date(creator.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payout Info */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4">Payout Information</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method</span>
                                    <span className="text-gray-900 font-medium">{creator.payout_method || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Details</span>
                                    <span className="text-gray-900 font-medium">{creator.payout_details || 'Not set'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Submissions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₱{(creator.total_earnings || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ₱{(creator.balance || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Total Submissions</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {creator.submission_count}
                                </p>
                            </div>
                        </div>

                        {/* Submission History */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="font-bold text-gray-900">Submission History</h3>
                            </div>
                            {submissions.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-500">
                                    No submissions yet
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {submissions.map((submission) => (
                                        <div key={submission.id} className="px-6 py-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Link
                                                        href={`/admin/submissions/${submission.id}`}
                                                        className="font-medium text-gray-900 hover:text-blue-600"
                                                    >
                                                        {submission.business_name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">{submission.business_type}</p>
                                                </div>
                                                <div className="text-right">
                                                    {getSubmissionStatusBadge(submission.status)}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(submission.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center gap-4 text-sm">
                                                <span className="text-gray-500">
                                                    Payout: <span className="text-green-600 font-medium">₱{submission.creator_payout}</span>
                                                </span>
                                                <span className="text-gray-500">
                                                    📍 {submission.city}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {pendingAction === 'suspend' ? 'Suspend Creator?' : 'Reactivate Creator?'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {pendingAction === 'suspend'
                                ? `Are you sure you want to suspend ${creator.first_name} ${creator.last_name}? They will not be able to access the platform.`
                                : `Are you sure you want to reactivate ${creator.first_name} ${creator.last_name}? They will regain full access to the platform.`
                            }
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowConfirmModal(false)
                                    setPendingAction(null)
                                }}
                                disabled={updating}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleStatusChange}
                                disabled={updating}
                                className={pendingAction === 'suspend' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-500 hover:bg-green-600'}
                            >
                                {updating ? 'Processing...' : pendingAction === 'suspend' ? 'Suspend' : 'Reactivate'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
