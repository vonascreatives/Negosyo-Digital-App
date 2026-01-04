"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService, type SignupData, type LoginData } from '@/lib/services/auth.service'

export function useAuth() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Sign up a new user
     */
    const signup = async (data: SignupData, onSuccess?: () => void) => {
        setLoading(true)
        setError(null)

        try {
            await authService.signup(data)

            if (onSuccess) {
                onSuccess()
            } else {
                // Default: redirect to dashboard
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup')
            throw err
        } finally {
            setLoading(false)
        }
    }

    /**
     * Login an existing user
     */
    const login = async (data: LoginData, onSuccess?: () => void) => {
        setLoading(true)
        setError(null)

        try {
            await authService.login(data)

            if (onSuccess) {
                onSuccess()
            } else {
                // Default: redirect to dashboard
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login')
            throw err
        } finally {
            setLoading(false)
        }
    }

    /**
     * Logout current user
     */
    const logout = async (redirectTo: string = '/login') => {
        setLoading(true)
        setError(null)

        try {
            await authService.logout()
            router.push(redirectTo)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'An error occurred during logout')
            throw err
        } finally {
            setLoading(false)
        }
    }

    /**
     * Clear error
     */
    const clearError = () => setError(null)

    /**
     * Sign in with Google
     */
    const signInWithGoogle = async () => {
        setLoading(true)
        setError(null)

        try {
            await authService.signInWithGoogle()
            // OAuth redirect will handle navigation
        } catch (err: any) {
            setError(err.message || 'An error occurred during Google sign-in')
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        signup,
        login,
        logout,
        signInWithGoogle,
        loading,
        error,
        clearError,
    }
}
