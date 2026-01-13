"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/useAdmin"
import { adminService } from "@/lib/services/admin.service"
import type { SubmissionWithCreator } from "@/types/database"

type PayoutStatus = 'all' | 'pending' | 'paid'

interface PayoutWithCreatorDetails extends SubmissionWithCreator {
    creators?: {
        first_name: string
        last_name: string
        email?: string
        phone?: string
        payout_method?: string
        payout_details?: string
    }
}

export default function PayoutsPage() {
    const { isAdmin, loading: authLoading } = useAdminAuth()
    const [payouts, setPayouts] = useState<PayoutWithCreatorDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [processing, setProcessing] = useState(false)

    // Filters & Selection
    const [statusFilter, setStatusFilter] = useState<PayoutStatus>('all')
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    // Stats
    const [stats, setStats] = useState({
        totalPending: 0,
        totalPendingAmount: 0,
        paidThisWeek: 0,
        paidThisWeekAmount: 0,
    })

    // Fetch payouts
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const [payoutsData, statsData] = await Promise.all([
                    adminService.getPendingPayouts(),
                    adminService.getPayoutStats()
                ])
                setPayouts(payoutsData as PayoutWithCreatorDetails[])
                setStats(statsData)
            } catch (err: any) {
                setError(err.message || 'Failed to load payouts')
            } finally {
                setLoading(false)
            }
        }

        if (isAdmin) {
            fetchData()
        }
    }, [isAdmin])

    // Filtered payouts
    const filteredPayouts = useMemo(() => {
        return payouts.filter(payout => {
            if (statusFilter === 'pending') return !payout.creator_paid_at
            if (statusFilter === 'paid') return !!payout.creator_paid_at
            return true
        })
    }, [payouts, statusFilter])

    // Select all visible
    const handleSelectAll = () => {
        if (selectedIds.size === filteredPayouts.filter(p => !p.creator_paid_at).length) {
            setSelectedIds(new Set())
        } else {
            const pendingIds = filteredPayouts
                .filter(p => !p.creator_paid_at)
                .map(p => p.id)
            setSelectedIds(new Set(pendingIds))
        }
    }

    // Toggle single selection
    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedIds(newSet)
    }

    // Mark single as paid
    const handleMarkAsPaid = async (id: string) => {
        setProcessing(true)
        try {
            await adminService.markPayoutAsPaid(id)
            setPayouts(prev => prev.map(p =>
                p.id === id ? { ...p, creator_paid_at: new Date().toISOString() } : p
            ))
            setStats(prev => ({
                ...prev,
                totalPending: prev.totalPending - 1,
                paidThisWeek: prev.paidThisWeek + 1
            }))
            setSelectedIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(id)
                return newSet
            })
        } catch (err: any) {
            setError(err.message || 'Failed to mark as paid')
        } finally {
            setProcessing(false)
        }
    }

    // Bulk mark as paid
    const handleBulkMarkAsPaid = async () => {
        if (selectedIds.size === 0) return

        setProcessing(true)
        try {
            await adminService.bulkMarkAsPaid(Array.from(selectedIds))
            setPayouts(prev => prev.map(p =>
                selectedIds.has(p.id) ? { ...p, creator_paid_at: new Date().toISOString() } : p
            ))
            setStats(prev => ({
                ...prev,
                totalPending: prev.totalPending - selectedIds.size,
                paidThisWeek: prev.paidThisWeek + selectedIds.size
            }))
            setSelectedIds(new Set())
        } catch (err: any) {
            setError(err.message || 'Failed to process bulk action')
        } finally {
            setProcessing(false)
        }
    }

    const getPayoutStatusBadge = (payout: PayoutWithCreatorDetails) => {
        if (payout.creator_paid_at) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
        }
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (!isAdmin) return null

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
                                <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
                                <p className="text-sm text-gray-500">Process creator payouts</p>
                            </div>
                        </div>
                        {selectedIds.size > 0 && (
                            <Button
                                onClick={handleBulkMarkAsPaid}
                                disabled={processing}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                {processing ? 'Processing...' : `Mark ${selectedIds.size} as Paid`}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.totalPending}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Pending Amount</p>
                        <p className="text-3xl font-bold text-gray-900">₱{stats.totalPendingAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Paid This Week</p>
                        <p className="text-3xl font-bold text-green-600">{stats.paidThisWeek}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Paid Amount (Week)</p>
                        <p className="text-3xl font-bold text-green-600">₱{stats.paidThisWeekAmount.toLocaleString()}</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                    <div className="flex gap-2">
                        {(['all', 'pending', 'paid'] as PayoutStatus[]).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${statusFilter === status
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                {status === 'pending' && stats.totalPending > 0 && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                        {stats.totalPending}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                        <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700">✕</button>
                    </div>
                )}

                {/* Payouts Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size > 0 && selectedIds.size === filteredPayouts.filter(p => !p.creator_paid_at).length}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Creator
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Business
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payout Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Requested
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayouts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        {statusFilter === 'pending' ? 'No pending payouts' : 'No payouts found'}
                                    </td>
                                </tr>
                            ) : (
                                filteredPayouts.map((payout) => (
                                    <tr key={payout.id} className={`hover:bg-gray-50 ${selectedIds.has(payout.id) ? 'bg-green-50' : ''}`}>
                                        <td className="px-4 py-4">
                                            {!payout.creator_paid_at && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(payout.id)}
                                                    onChange={() => toggleSelect(payout.id)}
                                                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                                                />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-semibold">
                                                    {payout.creators?.first_name?.charAt(0) || '?'}{payout.creators?.last_name?.charAt(0) || ''}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {payout.creators?.first_name} {payout.creators?.last_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {payout.creators?.email || payout.creators?.phone || '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{payout.business_name}</div>
                                            <div className="text-xs text-gray-500">{payout.business_type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-lg font-bold text-green-600">
                                                ₱{(payout.creator_payout || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{payout.creators?.payout_method || 'Not set'}</div>
                                            <div className="text-xs text-gray-500 font-mono">{payout.creators?.payout_details || '—'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getPayoutStatusBadge(payout)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {payout.payout_requested_at
                                                ? new Date(payout.payout_requested_at).toLocaleDateString()
                                                : '—'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {!payout.creator_paid_at ? (
                                                <Button
                                                    onClick={() => handleMarkAsPaid(payout.id)}
                                                    disabled={processing}
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                >
                                                    Mark Paid
                                                </Button>
                                            ) : (
                                                <span className="text-green-600 text-xs">
                                                    Paid {new Date(payout.creator_paid_at).toLocaleDateString()}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-gray-500">
                    Showing {filteredPayouts.length} payouts
                    {selectedIds.size > 0 && ` • ${selectedIds.size} selected`}
                </div>
            </div>
        </div>
    )
}
