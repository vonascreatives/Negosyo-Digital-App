// Submission types
export interface Submission {
    id: string
    business_name: string
    business_type: string
    owner_name: string
    owner_phone: string
    owner_email: string
    address: string
    city: string
    photos: string[]
    video_url?: string
    audio_url?: string
    transcript?: string
    website_url?: string
    website_code?: string
    status: SubmissionStatus
    amount: number
    payment_reference?: string
    paid_at?: string
    creator_payout: number
    payout_requested_at?: string
    creator_paid_at?: string
    created_at: string
    updated_at: string
    creator_id: string
}

export type SubmissionStatus =
    | 'draft'
    | 'submitted'
    | 'in_review'
    | 'approved'
    | 'rejected'
    | 'website_generated'
    | 'pending_payment'
    | 'paid'
    | 'completed'

// Creator types
export interface Creator {
    id: string
    phone?: string
    first_name: string
    middle_name?: string
    last_name: string
    email?: string
    password_hash: string
    referral_code: string
    referred_by?: string
    balance: number
    total_earnings: number
    status: CreatorStatus
    role: UserRole
    payout_method?: string
    payout_details?: string
    created_at: string
    updated_at: string
}

export type CreatorStatus = 'pending' | 'active' | 'suspended'
export type UserRole = 'creator' | 'admin'

// Submission with creator info (for joins)
export interface SubmissionWithCreator extends Submission {
    creators?: {
        first_name: string
        last_name: string
        email?: string
        phone?: string
    }
}
