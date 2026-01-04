import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Generate a random referral code
function generateReferralCode(name: string): string {
    const namePrefix = name.substring(0, 3).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${namePrefix}${random}`
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Get the authenticated user
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Check if creator profile exists
                const { data: existingCreator } = await supabase
                    .from('creators')
                    .select('id')
                    .eq('id', user.id)
                    .single()

                // Create creator profile if it doesn't exist (new Google user)
                if (!existingCreator) {
                    const name = user.user_metadata.full_name || user.user_metadata.name || 'User'
                    const placeholderPhone = `PH${user.id.substring(0, 8).toUpperCase()}`
                    const referralCode = generateReferralCode(name)

                    await supabase.from('creators').insert({
                        id: user.id,
                        phone: placeholderPhone,
                        name: name,
                        email: user.email,
                        password_hash: 'oauth_google',
                        referral_code: referralCode,
                        status: 'active', // Set to active for OAuth users
                    })
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
