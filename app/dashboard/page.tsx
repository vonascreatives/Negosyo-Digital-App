import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

    // Fetch submissions count
    const { count: submissionsCount } = await supabase
        .from("submissions")
        .select("*", { count: 'exact', head: true })
        .eq("creator_id", user.id)

    const handleSignOut = async () => {
        "use server"
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Negosyo Digital
                            </h1>
                        </div>
                        <form action={handleSignOut}>
                            <Button variant="ghost" type="submit" className="text-gray-500 hover:text-gray-900 hover:bg-gray-50">
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    Welcome back, {creator?.name || "Creator"}!
                                </h2>
                                <p className="text-gray-500">
                                    Track your submissions and earnings here.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {creator?.referral_code && (
                                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                                        Referral Code: <span className="font-bold">{creator.referral_code}</span>
                                    </div>
                                )}
                                <div className={`px-4 py-2 rounded-lg text-sm font-medium ${creator?.status === 'active' ? 'bg-green-100 text-green-700' :
                                        creator?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {creator?.status === 'active' ? 'Active Account' : creator?.status === 'pending' ? 'Pending Approval' : 'Suspended'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-0.5">Available Balance</p>
                                    <p className="text-2xl font-bold text-gray-900">₱{creator?.balance?.toFixed(2) || '0.00'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-0.5">Total Earnings</p>
                                    <p className="text-2xl font-bold text-gray-900">₱{creator?.total_earnings?.toFixed(2) || '0.00'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l4 4a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-0.5">Total Submissions</p>
                                    <p className="text-2xl font-bold text-gray-900">{submissionsCount || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg shadow-green-500/20">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">Ready to earn?</h3>
                                <p className="text-green-50 max-w-md">
                                    Submit a new business today and earn up to ₱500 per approved submission.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <Link href="/submit/info" className="w-full md:w-auto">
                                    <Button size="lg" className="w-full bg-white text-green-600 hover:bg-green-50 font-bold border-0">
                                        Submit New Business
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Account Info - simplified */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Account Details</h3>
                            <Link href="/profile">
                                <Button variant="outline" size="sm">Edit Profile</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-500 mb-1">Phone Number</p>
                                <p className="font-medium text-gray-900">{creator?.phone}</p>
                            </div>
                            {creator?.email && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 mb-1">Email Address</p>
                                    <p className="font-medium text-gray-900">{creator.email}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
