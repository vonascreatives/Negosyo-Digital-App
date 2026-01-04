import { createClient } from '@/lib/supabase/client'

export interface SignupData {
    name: string
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
function generateReferralCode(name: string): string {
    const namePrefix = name.substring(0, 3).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${namePrefix}${random}`
}

export const authService = {
    /**
     * Sign up a new user
     */
    async signup({ name, email, password }: SignupData) {
        const supabase = createClient()

        // Sign up with Supabase Auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (signUpError) throw signUpError

        // Create creator profile
        if (authData.user) {
            const referralCode = generateReferralCode(name)
            // Generate placeholder phone from user ID
            const placeholderPhone = `PH${authData.user.id.substring(0, 8).toUpperCase()}`

            const { error: profileError } = await supabase
                .from('creators')
                .insert([
                    {
                        id: authData.user.id,
                        phone: placeholderPhone,
                        name,
                        email,
                        password_hash: 'managed_by_supabase_auth',
                        referral_code: referralCode,
                        status: 'active',
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
}
