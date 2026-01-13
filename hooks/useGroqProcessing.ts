"use client"

import { useState } from 'react'

interface ProcessingResult {
    transcript?: string
    businessContent?: any
    websiteUrl?: string
    message?: string
}

export function useGroqProcessing() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<ProcessingResult | null>(null)

    /**
     * Transcribe audio to text
     */
    const transcribeAudio = async (audioUrl: string, submissionId?: string) => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioUrl, submissionId }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Transcription failed')
            }

            setResult(data)
            return data
        } catch (err: any) {
            setError(err.message || 'Failed to transcribe audio')
            throw err
        } finally {
            setLoading(false)
        }
    }

    /**
     * Extract business content from transcript
     */
    const extractContent = async (transcript: string, submissionId?: string) => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const res = await fetch('/api/extract-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript, submissionId }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Content extraction failed')
            }

            setResult(data)
            return data
        } catch (err: any) {
            setError(err.message || 'Failed to extract content')
            throw err
        } finally {
            setLoading(false)
        }
    }

    /**
     * Process entire submission (transcribe + extract + generate)
     */
    const processSubmission = async (submissionId: string) => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const res = await fetch('/api/process-submission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Processing failed')
            }

            setResult(data)
            return data
        } catch (err: any) {
            setError(err.message || 'Failed to process submission')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const clearError = () => setError(null)
    const clearResult = () => setResult(null)

    return {
        transcribeAudio,
        extractContent,
        processSubmission,
        loading,
        error,
        result,
        clearError,
        clearResult,
    }
}
