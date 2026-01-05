"use client"

import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <Container>
                <div className="max-w-md mx-auto space-y-8">
                    {/* Error Icon */}
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 border-4 border-red-900 rounded-full mx-auto flex items-center justify-center mb-6">
                            <svg
                                className="w-10 h-10 text-red-900"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-zinc-900 mb-3">
                            Authentication Error
                        </h1>
                        <p className="text-lg text-zinc-600">
                            We couldn't complete your sign-in
                        </p>
                    </div>

                    {/* Error Details */}
                    <div className="bg-red-50 border-2 border-red-900 rounded-lg p-6 space-y-4">
                        <h2 className="font-bold text-red-900">What happened?</h2>
                        <ul className="text-sm text-red-800 space-y-2 list-disc list-inside">
                            <li>The authentication code may have expired</li>
                            <li>There might be a configuration issue</li>
                            <li>Your account setup may be incomplete</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link href="/login">
                            <Button
                                className="w-full"
                                size="lg"
                            >
                                Try Again
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="w-full"
                                size="lg"
                            >
                                Go Home
                            </Button>
                        </Link>
                    </div>

                    {/* Support */}
                    <div className="text-center">
                        <p className="text-sm text-zinc-500">
                            Still having issues?{" "}
                            <a
                                href="mailto:support@negosyo-digital.com"
                                className="font-semibold text-zinc-900 hover:underline"
                            >
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    )
}
