"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAdminAuth, useSubmission, useSubmissionStatus } from "@/hooks/useAdmin"
import { createClient } from "@/lib/supabase/client"
import type { SubmissionStatus } from "@/types/database"

export default function SubmissionDetailPage() {
    const params = useParams()
    const submissionId = params.id as string

    const { isAdmin, loading: authLoading } = useAdminAuth()
    const { submission, creator, loading: dataLoading, refresh } = useSubmission(submissionId)
    const { updateStatus, updating } = useSubmissionStatus(submissionId)

    // Modal state
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [modalType, setModalType] = useState<'success' | 'error'>('success')

    // Edit mode states
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editedData, setEditedData] = useState({
        business_name: '',
        business_type: '',
        owner_name: '',
        owner_phone: '',
        owner_email: '',
        address: '',
        city: '',
        transcript: '',
        photos: [] as string[],
    })

    const handleEdit = () => {
        if (submission) {
            setEditedData({
                business_name: submission.business_name,
                business_type: submission.business_type,
                owner_name: submission.owner_name,
                owner_phone: submission.owner_phone,
                owner_email: submission.owner_email || '',
                address: submission.address,
                city: submission.city,
                transcript: submission.transcript || '',
                photos: submission.photos || [],
            })
            setIsEditing(true)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedData({
            business_name: '',
            business_type: '',
            owner_name: '',
            owner_phone: '',
            owner_email: '',
            address: '',
            city: '',
            transcript: '',
            photos: [],
        })
    }

    const handleSave = async () => {
        if (!submission) return

        setSaving(true)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('submissions')
                .update({
                    business_name: editedData.business_name,
                    business_type: editedData.business_type,
                    owner_name: editedData.owner_name,
                    owner_phone: editedData.owner_phone,
                    owner_email: editedData.owner_email || null,
                    address: editedData.address,
                    city: editedData.city,
                    transcript: editedData.transcript || null,
                    photos: editedData.photos,
                })
                .eq('id', submission.id)

            if (error) throw error

            setModalType('success')
            setModalMessage('Changes saved successfully!')
            setShowModal(true)
            setIsEditing(false)
            refresh() // Reload data
        } catch (err: any) {
            console.error('Error saving changes:', err)
            setModalType('error')
            setModalMessage('Failed to save changes. Please try again.')
            setShowModal(true)
        } finally {
            setSaving(false)
        }
    }

    const removePhoto = (indexToRemove: number) => {
        setEditedData({
            ...editedData,
            photos: editedData.photos.filter((_, index) => index !== indexToRemove)
        })
    }

    const handleStatusUpdate = async (newStatus: SubmissionStatus) => {
        const success = await updateStatus(newStatus)

        if (success) {
            setModalType('success')
            setModalMessage(`Submission ${newStatus} successfully!`)
            setShowModal(true)
            // Refresh data to show updated status
            refresh()
        } else {
            setModalType('error')
            setModalMessage('Failed to update status. Please try again.')
            setShowModal(true)
        }
    }

    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (!isAdmin || !submission) return null

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <Button variant="outline" size="sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{submission.business_name}</h1>
                                <p className="text-sm text-gray-500">Submission Details</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={handleEdit}
                                        variant="outline"
                                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </Button>
                                    {submission.status !== 'approved' && (
                                        <Button
                                            onClick={() => handleStatusUpdate('approved')}
                                            disabled={updating}
                                            className="bg-green-500 hover:bg-green-600 text-white"
                                        >
                                            {updating ? 'Updating...' : 'Approve'}
                                        </Button>
                                    )}
                                    {submission.status !== 'rejected' && (
                                        <Button
                                            onClick={() => handleStatusUpdate('rejected')}
                                            disabled={updating}
                                            variant="outline"
                                            className="border-red-500 text-red-500 hover:bg-red-50"
                                        >
                                            {updating ? 'Updating...' : 'Reject'}
                                        </Button>
                                    )}
                                    {submission.status !== 'in_review' && (
                                        <Button
                                            onClick={() => handleStatusUpdate('in_review')}
                                            disabled={updating}
                                            variant="outline"
                                        >
                                            {updating ? 'Updating...' : 'Mark as In Review'}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Business Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Business Information */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Business Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase font-medium">Business Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedData.business_name}
                                            onChange={(e) => setEditedData({ ...editedData, business_name: e.target.value })}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium mt-1">{submission.business_name}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase font-medium">Business Type</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedData.business_type}
                                            onChange={(e) => setEditedData({ ...editedData, business_type: e.target.value })}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="text-gray-900 mt-1">{submission.business_type}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase font-medium">Owner Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedData.owner_name}
                                            onChange={(e) => setEditedData({ ...editedData, owner_name: e.target.value })}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="text-gray-900 mt-1">{submission.owner_name}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase font-medium">Owner Phone</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedData.owner_phone}
                                            onChange={(e) => setEditedData({ ...editedData, owner_phone: e.target.value })}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="text-gray-900 mt-1">{submission.owner_phone}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase font-medium">Owner Email</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedData.owner_email}
                                            onChange={(e) => setEditedData({ ...editedData, owner_email: e.target.value })}
                                            placeholder="Optional"
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="text-gray-900 mt-1">{submission.owner_email || 'N/A'}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase font-medium">City</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedData.city}
                                            onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="text-gray-900 mt-1">{submission.city}</p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-xs text-gray-500 uppercase font-medium">Address</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedData.address}
                                            onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="text-gray-900 mt-1">{submission.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Photos */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Photos ({isEditing ? editedData.photos.length : (submission.photos?.length || 0)})
                                </h2>
                                {isEditing && editedData.photos.length > 0 && (
                                    <span className="text-xs text-gray-500">Click X to remove</span>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {(isEditing ? editedData.photos : (submission.photos || [])).map((url, index) => (
                                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                                        <Image
                                            src={url}
                                            alt={`Photo ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        {isEditing && (
                                            <button
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                type="button"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditing && editedData.photos.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No photos remaining</p>
                            )}
                        </div>

                        {/* Interview */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Interview</h2>

                            {/* Transcript Section */}
                            {(submission.transcript || isEditing) && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                            AI Transcript
                                        </h3>
                                        {!isEditing && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                Generated
                                            </span>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            value={editedData.transcript}
                                            onChange={(e) => setEditedData({ ...editedData, transcript: e.target.value })}
                                            className="w-full h-96 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Transcript will appear here after AI processing..."
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {submission.transcript}
                                            </p>
                                        </div>
                                    )}
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
                                    <p className="text-lg font-semibold text-gray-900 capitalize">{submission.status.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Creator Payout</label>
                                    <p className="text-2xl font-bold text-green-600">₱{submission.creator_payout || 0}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-medium">Submitted On</label>
                                    <p className="text-gray-900">{new Date(submission.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Creator Info */}
                        {creator && (
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Creator Info</h2>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-medium">Name</label>
                                        <p className="text-gray-900">{creator.first_name} {creator.last_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-medium">Email</label>
                                        <p className="text-gray-900">{creator.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-medium">Phone</label>
                                        <p className="text-gray-900">{creator.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${modalType === 'success'
                                ? 'bg-green-100'
                                : 'bg-red-100'
                                }`}>
                                {modalType === 'success' ? (
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>

                            {/* Message */}
                            <h3 className={`text-xl font-bold mb-2 ${modalType === 'success' ? 'text-gray-900' : 'text-red-900'
                                }`}>
                                {modalType === 'success' ? 'Success!' : 'Error'}
                            </h3>
                            <p className="text-gray-600 mb-6">{modalMessage}</p>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${modalType === 'success'
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
