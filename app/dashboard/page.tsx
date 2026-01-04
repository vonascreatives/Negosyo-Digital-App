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
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b-4 border-zinc-900 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                            Negosyo Digital
                        </h1>
                        <form action={handleSignOut}>
                            <Button variant="outline" type="submit">
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-white border-4 border-zinc-900 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-2xl font-black text-zinc-900 mb-2">
                            Welcome back, {creator?.name || "Creator"}!
                        </h2>
                        <p className="text-zinc-600">
                            {creator?.referral_code && (
                                <>Your referral code: <span className="font-bold">{creator.referral_code}</span></>
                            )}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border-4 border-zinc-900 rounded-xl p-6">
                            <p className="text-sm font-semibold text-zinc-600 mb-1">Balance</p>
                            <p className="text-3xl font-black text-zinc-900">₱{creator?.balance?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="bg-white border-4 border-zinc-900 rounded-xl p-6">
                            <p className="text-sm font-semibold text-zinc-600 mb-1">Total Earnings</p>
                            <p className="text-3xl font-black text-zinc-900">₱{creator?.total_earnings?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="bg-white border-4 border-zinc-900 rounded-xl p-6">
                            <p className="text-sm font-semibold text-zinc-600 mb-1">Submissions</p>
                            <p className="text-3xl font-black text-zinc-900">{submissionsCount || 0}</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border-4 border-zinc-900 rounded-2xl p-8">
                        <h3 className="text-xl font-black text-zinc-900 mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/submit">
                                <Button className="w-full" size="lg">
                                    Submit New Business
                                </Button>
                            </Link>
                            <Link href="/profile">
                                <Button variant="outline" className="w-full" size="lg">
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-zinc-600 mb-3">Account Information</h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-zinc-900">
                                <span className="font-semibold">Phone:</span> {creator?.phone}
                            </p>
                            {creator?.email && (
                                <p className="text-zinc-900">
                                    <span className="font-semibold">Email:</span> {creator.email}
                                </p>
                            )}
                            <p className="text-zinc-900">
                                <span className="font-semibold">Account Status:</span>{" "}
                                <span className={creator?.status === 'active' ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>
                                    {creator?.status === 'active' ? 'Active' : creator?.status === 'pending' ? 'Pending' : 'Suspended'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
