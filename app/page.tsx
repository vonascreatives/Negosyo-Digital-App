import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-zinc-900">
            Negosyo Digital
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-zinc-600 max-w-2xl mx-auto">
            Build, Grow, and Scale Your Digital Business
          </p>
          <p className="text-lg text-zinc-500 max-w-xl mx-auto">
            The all-in-one platform for Filipino entrepreneurs to manage their online business
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6 h-auto">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
              Log In
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="bg-white border-4 border-zinc-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-12 h-12 bg-zinc-900 rounded-lg mb-4 flex items-center justify-center text-2xl">
              📊
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-2">
              Track Sales
            </h3>
            <p className="text-zinc-600">
              Monitor your business performance in real-time
            </p>
          </div>

          <div className="bg-white border-4 border-zinc-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-12 h-12 bg-zinc-900 rounded-lg mb-4 flex items-center justify-center text-2xl">
              🛍️
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-2">
              Manage Products
            </h3>
            <p className="text-zinc-600">
              Organize your inventory with ease
            </p>
          </div>

          <div className="bg-white border-4 border-zinc-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-12 h-12 bg-zinc-900 rounded-lg mb-4 flex items-center justify-center text-2xl">
              🚀
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-2">
              Grow Fast
            </h3>
            <p className="text-zinc-600">
              Scale your business with powerful tools
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
