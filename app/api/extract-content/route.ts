import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { groqService } from '@/lib/services/groq.service'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { transcript, submissionId } = body

        if (!transcript) {
            return NextResponse.json({ error: 'Transcript is required' }, { status: 400 })
        }

        // Extract business content from transcript
        console.log('Extracting content from transcript...')
        const businessContent = await groqService.extractBusinessContent(transcript)

        // If submissionId provided, also generate website
        if (submissionId) {
            // Get submission details
            const { data: submission, error: fetchError } = await supabase
                .from('submissions')
                .select('business_name, business_type, owner_name, city')
                .eq('id', submissionId)
                .eq('creator_id', user.id)
                .single()

            if (fetchError || !submission) {
                return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
            }

            // Generate website HTML
            console.log('Generating website...')
            const websiteHtml = await groqService.generateWebsite(businessContent, {
                name: submission.business_name,
                type: submission.business_type,
                owner: submission.owner_name,
                location: submission.city,
            })

            // Update submission with extracted content and website
            const { error: updateError } = await supabase
                .from('submissions')
                .update({
                    website_code: websiteHtml,
                    status: 'website_generated',
                })
                .eq('id', submissionId)
                .eq('creator_id', user.id)

            if (updateError) {
                console.error('Error updating submission:', updateError)
                return NextResponse.json({ error: 'Failed to save website' }, { status: 500 })
            }

            return NextResponse.json({
                success: true,
                businessContent,
                websiteHtml,
                message: 'Website generated successfully',
            })
        }

        return NextResponse.json({
            success: true,
            businessContent,
        })
    } catch (error: any) {
        console.error('Content extraction API error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to extract content' },
            { status: 500 }
        )
    }
}
