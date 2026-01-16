import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import LogoutButton from "@/components/LogoutButton"
import Profile from '@/public/profile.png'
import Image from "next/image"
import Link from "next/link"
import { Bell, Wallet, TrendingUp, ArrowRight, Store, Plus, Users, Headphones, CircleDollarSign, Home, Map, User, Clock } from "lucide-react"

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch creator profile
    const { data: creator } = await supabase
        .from("creators")
        .select("*")
        .eq("id", user.id)
        .single()

    // Fetch submissions
    const { data: submissions } = await supabase
        .from("submissions")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3)

    return (
        <div className="min-h-screen bg-white font-sans pb-24 overflow-x-hidden">
            {/* Header */}
            <header className="px-4 pt-6 pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center overflow-hidden border border-zinc-200">
                            <Image src={Profile} alt="Profile" width={40} height={40} />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Welcome back</p>
                            <h1 className="text-lg font-bold text-zinc-900 leading-none">
                                Mabuhay, {creator?.first_name || "Creator"}!
                            </h1>
                        </div>
                    </div>
                    <div className="ml-2">
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="px-4 space-y-5">
                {/* Balance Card */}
                <div className="bg-zinc-900 text-white rounded-3xl p-5 relative overflow-hidden shadow-xl shadow-zinc-900/20">
                    {/* Abstract background effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-zinc-400 text-xs font-medium">Available Balance</span>
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-emerald-400">
                            <Wallet className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    <div className="mb-5 relative z-10">
                        <span className="text-3xl font-bold tracking-tight">₱ {creator?.balance?.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                    </div>

                    {/* <div className="flex gap-2 relative z-10">
                        <div className="flex-1 bg-zinc-800/50 rounded-xl p-2 flex items-center justify-center gap-1.5 border border-zinc-700/50 backdrop-blur-sm">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-medium text-emerald-400 truncate">+₱1,250 this week</span>
                        </div>
                        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-zinc-900 font-bold rounded-xl h-auto py-2 text-xs">
                            Cash Out
                            <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </div> */}

                </div>

                {/* Quick Actions */}
                {/* <div className="grid grid-cols-3 gap-3">
                    <Link href="/submit/info" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-100 transition-colors">
                            <Store className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 text-center leading-tight">Add<br />Business</span>
                    </Link>
                    <button className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm group-hover:bg-purple-100 transition-colors">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 text-center leading-tight">Referrals</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm group-hover:bg-orange-100 transition-colors">
                            <Headphones className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 text-center leading-tight">Support</span>
                    </button>
                </div> */}

                {/* Stats Row */}
                {/* <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="bg-white p-1 rounded-lg shadow-sm">
                                <Users className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Total Referrals</span>
                        </div>
                        <span className="text-xl font-bold text-zinc-900">24</span>
                    </div>
                    <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="bg-white p-1 rounded-lg shadow-sm">
                                <CircleDollarSign className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Earnings</span>
                        </div>
                        <span className="text-xl font-bold text-zinc-900">₱ 850</span>
                    </div>
                </div> */}

                {/* Submission Status */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold text-zinc-900">Submission Status</h2>
                        <Link href="/submissions" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">View All</Link>
                    </div>
                    <div className="space-y-3">
                        {submissions?.map((sub) => {
                            const isIncomplete = (!sub.photos || sub.photos.length === 0) || (!sub.video_url && !sub.audio_url)
                            const isDraft = sub.status === 'draft' || isIncomplete

                            const getStatusBg = () => {
                                if (sub.status === 'approved') return 'bg-emerald-100 text-emerald-600'
                                if (sub.status === 'rejected') return 'bg-red-100 text-red-600'
                                if (isDraft) return 'bg-zinc-100 text-zinc-500'
                                return 'bg-yellow-100 text-yellow-600'
                            }

                            const getStatusBadge = () => {
                                if (sub.status === 'approved') return { bg: 'bg-emerald-100 text-emerald-700', text: 'Verified' }
                                if (sub.status === 'rejected') return { bg: 'bg-red-100 text-red-700', text: 'Rejected' }
                                if (isDraft) return { bg: 'bg-zinc-100 text-zinc-600', text: 'Draft' }
                                return { bg: 'bg-yellow-100 text-yellow-700', text: 'Pending' }
                            }

                            const badge = getStatusBadge()

                            return (
                                <Link key={sub.id} href={`/submissions/${sub.id}`}>
                                    <div className="bg-white rounded-xl p-3 border border-zinc-100 shadow-sm flex items-center justify-between hover:border-zinc-200 hover:shadow-md transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getStatusBg()}`}>
                                                {isDraft ? <Clock className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-zinc-900">{sub.business_name}</h3>
                                                <p className="text-[10px] text-zinc-500">Submitted {new Date(sub.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.bg}`}>
                                            {badge.text}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                        {!submissions?.length && (
                            <div className="text-center py-6 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                                <p className="text-zinc-500 text-xs">No submissions yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-6 py-2 pb-6 flex items-center justify-center z-50">
                {/* <button className="flex flex-col items-center gap-1 text-emerald-600">
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600">
                    <Map className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Map</span>
                </button> */}

                {/* Floating Action Button */}
                <div className="relative -top-6">
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

                {/* <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600">
                    <Wallet className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Wallet</span>
                </button>
                <Link href="/profile" className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600">
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Profile</span>
                </Link> */}


            </div>
        </div>
    )
}
