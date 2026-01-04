"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Container } from "@/components/layout/container"

export default function LoginPage() {
    const { login, loading, error } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await login({ email, password })
        } catch (err) {
            console.error("Login failed:", err)
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <Container>
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900">
                            Negosyo Digital
                        </h1>
                        <p className="text-lg text-zinc-600">
                            Welcome back! Log in to continue
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white border-4 border-zinc-900 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border-2 border-red-900 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-red-900">{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 transition-colors"
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="flex justify-end">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                                size="lg"
                            >
                                {loading ? "Logging in..." : "Log In"}
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-zinc-600">
                                    Don't have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="font-bold text-zinc-900 hover:underline"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                </div>
            </Container>
        </div>
    )
}
