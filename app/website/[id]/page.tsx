'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function WebsitePage() {
    const params = useParams()
    const submissionId = params.id as string
    const [htmlContent, setHtmlContent] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadWebsite() {
            try {
                const supabase = createClient()
                const { data: website, error } = await supabase
                    .from('generated_websites')
                    .select('html_content')
                    .eq('submission_id', submissionId)
                    .single()

                if (error) {
                    console.error('Supabase error:', error)
                    throw error
                }

                if (website && website.html_content) {
                    setHtmlContent(website.html_content)
                } else {
                    setError('Website not found')
                }
            } catch (err: any) {
                console.error('Error loading website:', err)
                setError(err.message || 'Failed to load website')
            } finally {
                setLoading(false)
            }
        }

        if (submissionId) {
            loadWebsite()
        }
    }, [submissionId])

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid #e5e7eb',
                        borderTopColor: '#2563eb',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }}></div>
                    <p style={{ color: '#6b7280' }}>Loading website...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                        Website Not Found
                    </h1>
                    <p style={{ color: '#6b7280' }}>{error}</p>
                </div>
            </div>
        )
    }

    // Use iframe with srcdoc for proper rendering
    return (
        <iframe
            srcDoc={htmlContent}
            style={{
                width: '100%',
                height: '100vh',
                border: 'none',
                margin: 0,
                padding: 0,
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0
            }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            title="Generated Website"
        />
    )
}
