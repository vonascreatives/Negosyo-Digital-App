import { createClient } from '@/lib/supabase/client'
import type { Submission, SubmissionWithCreator, Creator, SubmissionStatus } from '@/types/database'

export const adminService = {
    /**
     * Check if current user is admin
     */
    async isAdmin(): Promise<boolean> {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return false

            const { data: creator } = await supabase
                .from('creators')
                .select('role')
                .eq('id', user.id)
                .single()

            return creator?.role === 'admin'
        } catch (err) {
            console.error('Error checking admin status:', err)
            return false
        }
    },

    /**
     * Get all submissions with creator info
     */
    async getAllSubmissions(): Promise<SubmissionWithCreator[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('submissions')
            .select(`
                *,
                creators:creator_id (
                    first_name,
                    last_name,
                    email,
                    phone
                )
            `)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    },

    /**
     * Get single submission by ID
     */
    async getSubmissionById(id: string): Promise<Submission | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    /**
     * Get creator by ID
     */
    async getCreatorById(id: string): Promise<Partial<Creator> | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('creators')
            .select('first_name, last_name, email, phone')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    /**
     * Update submission status
     */
    async updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
        const supabase = createClient()

        const { error } = await supabase
            .from('submissions')
            .update({ status })
            .eq('id', id)

        if (error) throw error
    },

    /**
     * Get all creators with submission counts
     */
    async getAllCreators(): Promise<(Creator & { submission_count: number })[]> {
        const supabase = createClient()

        // Get all creators
        const { data: creators, error } = await supabase
            .from('creators')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        if (!creators) return []

        // Get submission counts for all creators in one query
        const { data: counts } = await supabase
            .from('submissions')
            .select('creator_id')

        // Count submissions per creator
        const countMap: Record<string, number> = {}
        counts?.forEach(s => {
            countMap[s.creator_id] = (countMap[s.creator_id] || 0) + 1
        })

        // Merge counts with creators
        return creators.map(creator => ({
            ...creator,
            submission_count: countMap[creator.id] || 0
        }))
    },

    /**
     * Update creator
     */
    async updateCreator(id: string, updates: Partial<Creator>): Promise<void> {
        const supabase = createClient()

        const { error } = await supabase
            .from('creators')
            .update(updates)
            .eq('id', id)

        if (error) throw error
    },

    /**
     * Get creator with submission stats
     */
    async getCreatorWithStats(id: string): Promise<Creator & { submission_count: number } | null> {
        const supabase = createClient()

        const { data: creator, error: creatorError } = await supabase
            .from('creators')
            .select('*')
            .eq('id', id)
            .single()

        if (creatorError) throw creatorError
        if (!creator) return null

        const { count } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', id)

        return { ...creator, submission_count: count || 0 }
    },

    /**
     * Get all submissions by a creator
     */
    async getCreatorSubmissions(creatorId: string): Promise<Submission[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('creator_id', creatorId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    },

    /**
     * Update creator status (suspend/reactivate)
     */
    async updateCreatorStatus(id: string, status: 'active' | 'pending' | 'suspended'): Promise<void> {
        const supabase = createClient()

        const { error } = await supabase
            .from('creators')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) throw error
    },
}
