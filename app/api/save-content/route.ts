import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { submissionId, content, customizations } = await request.json()

        if (!submissionId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Update the website's content in generated_websites table
        // We're updating generated_websites directly because that's where the active content lives
        const { error: updateError } = await supabase
            .from('generated_websites')
            .update({
                extracted_content: content,
                updated_at: new Date().toISOString()
            })
            .eq('submission_id', submissionId)

        if (updateError) {
            console.error('Update error:', updateError)
            return NextResponse.json({ error: 'Failed to update content', details: updateError }, { status: 500 })
        }

        // Regenerate the website with new content
        const regenerateResponse = await fetch(`${request.nextUrl.origin}/api/generate-website`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || ''
            },
            body: JSON.stringify({
                submissionId,
                forceRegenerate: true,
                customizations // Pass customizations if provided to persist theme
            })
        })

        if (!regenerateResponse.ok) {
            console.error('Regeneration failed')
            return NextResponse.json({ error: 'Content saved but regeneration failed' }, { status: 500 })
        }

        const regenerateData = await regenerateResponse.json()

        return NextResponse.json({
            success: true,
            message: 'Content updated and website regenerated',
            htmlContent: regenerateData.htmlContent
        })
    } catch (error) {
        console.error('Save content error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
