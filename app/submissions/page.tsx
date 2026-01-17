import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Logo from "@/public/logo.png"
import { Filter, AlertCircle, Clock, CheckCircle, Banknote, Store, Plus, ArrowLeft } from "lucide-react"

export default async function SubmissionsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch creator profile for earnings
    const { data: creator } = await supabase
        .from("creators")
        .select("*")
        .eq("id", user.id)
        .single()

    // Fetch all submissions
    const { data: submissions } = await supabase
        .from("submissions")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })

    // Calculate stats
    // Total Earned: sum of earnings or just use creator.total_earnings (from dashboard)
    // In Review: count of pending/submitted/in_review

    // Fallback if creator.total_earnings is not available or we want to calc from list
    const totalEarned = creator?.total_earnings || 0

    // Count submissions that are NOT finalized (approved, paid, rejected)
    // This includes: pending, submitted, in_review, website_generated, etc.
    const inReviewCount = submissions?.filter(s =>
        !['approved', 'paid', 'rejected'].includes(s.status?.toLowerCase())
    ).length || 0

    // Helper to check if submission is incomplete (draft)
    const isIncomplete = (sub: any) => {
        const hasPhotos = sub.photos && sub.photos.length > 0
        const hasMedia = sub.video_url || sub.audio_url
        return !hasPhotos || !hasMedia
    }

    const getStatusBadge = (sub: any) => {
        const s = sub.status?.toLowerCase()
        if (s === 'approved') {
            return (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase">
                    Approved
                </span>
            )
        }
        if (s === 'paid') {
            return (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md uppercase">
                    Paid
                </span>
            )
        }
        if (s === 'rejected' || s === 'revision') {
            return (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-md uppercase">
                    Revision
                </span>
            )
        }
        // Check if incomplete (draft)
        if (s === 'draft' || isIncomplete(sub)) {
            return (
                <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-md uppercase">
                    Draft
                </span>
            )
        }
        // Default Pending
        return (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-md uppercase">
                Pending
            </span>
        )
    }

    const getStatusIcon = (sub: any) => {
        const s = sub.status?.toLowerCase()
        if (s === 'approved') return <CheckCircle className="w-5 h-5 text-green-500" />
        if (s === 'paid') return <Banknote className="w-5 h-5 text-blue-500" />
        if (s === 'rejected' || s === 'revision') return <AlertCircle className="w-5 h-5 text-red-500" />
        if (s === 'draft' || isIncomplete(sub)) return <Clock className="w-5 h-5 text-zinc-400" />
        return <Store className="w-5 h-5 text-orange-500" />
    }

    const getStatusBg = (sub: any) => {
        const s = sub.status?.toLowerCase()
        if (s === 'approved') return 'bg-green-50'
        if (s === 'paid') return 'bg-blue-50'
        if (s === 'rejected' || s === 'revision') return 'bg-red-50'
        if (s === 'draft' || isIncomplete(sub)) return 'bg-zinc-50'
        return 'bg-orange-50'
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-24 relative">


            <main className="px-4 py-6">
                <div className="flex items-center justify-between mb-2">
                    <Link href="/dashboard" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 text-zinc-600 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
                        My <span className="text-green-500">Submissions</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Track your business onboardings.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Total Earned</p>
                        <p className="text-xl font-bold text-zinc-900">₱ {totalEarned.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">In Review</p>
                        <p className="text-xl font-bold text-orange-500">{inReviewCount}</p>
                    </div>
                </div>

                {/* Submissions List */}
                <div className="space-y-3">
                    {submissions && submissions.length > 0 ? (
                        submissions.map((sub) => (
                            <Link key={sub.id} href={`/submissions/${sub.id}`}>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-gray-200 hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${getStatusBg(sub)}`}>
                                            {getStatusIcon(sub)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-900 text-sm">{sub.business_name}</h3>
                                            <p className="text-xs text-zinc-500 truncate max-w-[140px]">
                                                {sub.city || 'Location N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {getStatusBadge(sub)}
                                        <span className="text-[10px] text-zinc-400 font-medium">
                                            {formatDate(sub.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Store className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-zinc-900 font-bold mb-1">No submissions yet</h3>
                            <p className="text-zinc-500 text-sm">Start by adding a new business.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating New Entry FAB */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <Link
                    href="/submit/info"
                    className="group flex items-center gap-0 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 ease-out overflow-hidden"
                >
                    <div className="w-14 h-14 flex items-center justify-center shrink-0">
                        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                    <span className="max-w-0 overflow-hidden whitespace-nowrap font-bold text-sm group-hover:max-w-[120px] group-hover:pr-5 transition-all duration-300 ease-out">
                        Add Submission
                    </span>
                </Link>
            </div>
        </div>
    )
}
