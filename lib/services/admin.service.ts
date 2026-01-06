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
     * Get all creators
     */
    async getAllCreators(): Promise<Creator[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('creators')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
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
}
