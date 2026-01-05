"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
    const router = useRouter()
    const { signup, signInWithGoogle, loading, error: authError } = useAuth()
    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)
    const [validationError, setValidationError] = useState<string | null>(null)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setValidationError(null)

        // Validation
        if (!firstName.trim()) {
            setValidationError("First name is required")
            return
        }
        if (!lastName.trim()) {
            setValidationError("Last name is required")
            return
        }
        if (!phone.trim()) {
            setValidationError("Phone number is required")
            return
        }
        // Basic phone validation (Philippine format)
        const phoneRegex = /^(\+63|0)?9\d{9}$/
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            setValidationError("Please enter a valid Philippine phone number (e.g., 09123456789)")
            return
        }
        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters")
            return
        }

        try {
            await signup({ firstName, middleName, lastName, phone, email, password }, () => {
                setSuccess(true)
                setTimeout(() => {
                    window.location.href = '/dashboard'
                }, 2000)
            })
        } catch (err) {
            // Error is handled by the hook
        }
    }

    const error = authError || validationError

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}

            <br />

            {/* Main Content */}
            <div className="flex-1 px-6 pb-6">
                <div className="max-w-md mx-auto">
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Let's get you started.
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Join the community of Filipino creators digitizing local businesses.
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600 font-medium">
                                Account created successfully! Redirecting...
                            </p>
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* First Name */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="Juan"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        {/* Middle Name */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">
                                    Middle Name
                                </Label>
                                <span className="text-xs text-gray-400">Optional</span>
                            </div>
                            <Input
                                id="middleName"
                                type="text"
                                placeholder="Santos"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                disabled={loading}
                                className="h-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Dela Cruz"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                Mobile Number
                            </Label>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2 px-3 h-12 bg-white border border-gray-200 rounded-lg">
                                    <Image
                                        src="/ph-flag.png"
                                        alt="PH"
                                        width={24}
                                        height={16}
                                        className="rounded-sm"
                                    />
                                    <span className="text-sm font-medium text-gray-700">+63</span>
                                </div>
                                <div className="flex-1 relative">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="912 345 4567"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        disabled={loading}
                                        className="h-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                                    />

                                </div>
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="juan@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="h-12 pr-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-gray-200 rounded-full">
                                    <div
                                        className={`h-full rounded-full transition-all ${password.length === 0 ? 'w-0 bg-gray-200' :
                                            password.length < 6 ? 'w-1/3 bg-red-500' :
                                                password.length < 10 ? 'w-2/3 bg-yellow-500' :
                                                    'w-full bg-green-500'
                                            }`}
                                    ></div>
                                </div>
                                <span className={`text-xs font-medium ${password.length === 0 ? 'text-gray-400' :
                                    password.length < 6 ? 'text-red-500' :
                                        password.length < 10 ? 'text-yellow-500' :
                                            'text-green-500'
                                    }`}>
                                    {password.length === 0 ? 'At least 6 chars' :
                                        password.length < 6 ? 'Weak' :
                                            password.length < 10 ? 'Medium' :
                                                'Strong'}
                                </span>
                            </div>
                        </div>

                        {/* Create Account Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors mt-8"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Create Account
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 border-t border-gray-200" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                            Or continue with
                        </span>
                        <div className="flex-1 border-t border-gray-200" />
                    </div>

                    {/* Social Login Button */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            try {
                                signInWithGoogle()
                            } catch (err) {
                                console.error("Google sign-in failed:", err)
                            }
                        }}
                        disabled={loading}
                        className="w-full h-12 bg-white border-gray-200 hover:bg-gray-50 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-green-500 hover:text-green-600 transition-colors"
                            >
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
