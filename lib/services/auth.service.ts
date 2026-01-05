import { createClient } from '@/lib/supabase/client'

export interface SignupData {
    firstName: string
    middleName?: string
    lastName: string
    phone: string
    email: string
    password: string
}

export interface LoginData {
    email: string
    password: string
}

export interface AuthError {
    message: string
}

// Generate a random referral code
function generateReferralCode(firstName: string, lastName: string): string {
    const namePrefix = (firstName.substring(0, 2) + lastName.substring(0, 1)).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${namePrefix}${random}`
}

export const authService = {
    /**
     * Sign up a new user
     */
    async signup({ firstName, middleName, lastName, phone, email, password }: SignupData) {
        const supabase = createClient()

        // Sign up with Supabase Auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (signUpError) throw signUpError

        // Create creator profile
        if (authData.user) {
            const referralCode = generateReferralCode(firstName, lastName)

            const { error: profileError } = await supabase
                .from('creators')
                .insert([
                    {
                        id: authData.user.id,
                        phone: phone,
                        first_name: firstName,
                        middle_name: middleName || null,
                        last_name: lastName,
                        email,
                        password_hash: 'managed_by_supabase_auth',
                        referral_code: referralCode,
                        status: 'active',
                        role: 'creator',
                    },
                ])

            if (profileError) {
                console.error('Profile creation error:', profileError)
                throw new Error('Failed to create profile: ' + profileError.message)
            }
        }

        return authData
    },

    /**
     * Login an existing user
     */
    async login({ email, password }: LoginData) {
        const supabase = createClient()

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) throw signInError

        return data
    },

    /**
     * Logout current user
     */
    async logout() {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    /**
     * Get current user
     */
    async getCurrentUser() {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    },

    /**
     * Get current user session
     */
    async getSession() {
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return session
    },

    /**
     * Sign in with Google OAuth
     */
    async signInWithGoogle() {
        const supabase = createClient()

        // Use current origin for redirect (works for both localhost and production)
        const redirectUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
        if (error) throw error
        return data
    },
}
