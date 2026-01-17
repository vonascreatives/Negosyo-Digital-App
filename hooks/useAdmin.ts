"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminService } from '@/lib/services/admin.service'
import type { SubmissionWithCreator, Submission, Creator, SubmissionStatus } from '@/types/database'

/**
 * Hook to check if user is admin and redirect if not
 */
export function useAdminAuth() {
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        try {
            const admin = await adminService.isAdmin()

            if (!admin) {
                router.push('/dashboard')
                return
            }

            setIsAdmin(true)
        } catch (err) {
            console.error('Error checking admin:', err)
            router.push('/login')
        } finally {
            setLoading(false)
        }
    }

    return { isAdmin, loading }
}

/**
 * Hook to fetch all submissions
 */
export function useSubmissions() {
    const [submissions, setSubmissions] = useState<SubmissionWithCreator[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadSubmissions()
    }, [])

    const loadSubmissions = async () => {
        try {
            setLoading(true)
            const data = await adminService.getAllSubmissions()
            setSubmissions(data)
            setError(null)
        } catch (err: any) {
            console.error('Error loading submissions:', err)
            setError(err.message || 'Failed to load submissions')
        } finally {
            setLoading(false)
        }
    }

    const refresh = () => loadSubmissions()

    return { submissions, loading, error, refresh }
}

/**
 * Hook to fetch single submission with creator info
 */
export function useSubmission(id: string) {
    const [submission, setSubmission] = useState<Submission | null>(null)
    const [creator, setCreator] = useState<Partial<Creator> | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            loadSubmission()
        }
    }, [id])

    const loadSubmission = async () => {
        try {
            setLoading(true)

            const submissionData = await adminService.getSubmissionById(id)
            setSubmission(submissionData)

            if (submissionData?.creator_id) {
                const creatorData = await adminService.getCreatorById(submissionData.creator_id)
                setCreator(creatorData)
            }

            setError(null)
        } catch (err: any) {
            console.error('Error loading submission:', err)
            setError(err.message || 'Failed to load submission')
        } finally {
            setLoading(false)
        }
    }

    const refresh = () => loadSubmission()

    return { submission, creator, loading, error, refresh }
}

/**
 * Hook to update submission status
 */
export function useSubmissionStatus(submissionId: string) {
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateStatus = async (newStatus: SubmissionStatus): Promise<boolean> => {
        setUpdating(true)
        setError(null)

        try {
            await adminService.updateSubmissionStatus(submissionId, newStatus)
            return true
        } catch (err: any) {
            console.error('Error updating status:', err)
            setError(err.message || 'Failed to update status')
            return false
        } finally {
            setUpdating(false)
        }
    }

    return { updateStatus, updating, error }
}
