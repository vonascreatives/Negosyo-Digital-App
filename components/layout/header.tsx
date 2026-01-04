"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
    const pathname = usePathname()
    const isAuthPage = pathname === "/login" || pathname === "/signup"

    if (isAuthPage) {
        return null
    }

    return (
        <header className="border-b-2 border-zinc-900 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tight text-zinc-900">
                        Negosyo Digital
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/profile"
                            className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                        >
                            Profile
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
