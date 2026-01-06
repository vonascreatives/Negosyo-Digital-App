import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { groqService } from '@/lib/services/groq.service'

/**
 * Process submission: Transcribe audio → Extract content → Generate website
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { submissionId } = body

        if (!submissionId) {
            return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 })
        }

        // Get submission
        const { data: submission, error: fetchError } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', submissionId)
            .eq('creator_id', user.id)
            .single()

        if (fetchError || !submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
        }

        // Check if audio/video exists
        const audioUrl = submission.audio_url || submission.video_url
        if (!audioUrl) {
            return NextResponse.json({ error: 'No audio/video found in submission' }, { status: 400 })
        }

        // Step 1: Transcribe audio
        console.log('Step 1: Transcribing audio...')
        const transcript = await groqService.transcribeAudioFromUrl(audioUrl)

        // Update with transcript
        await supabase
            .from('submissions')
            .update({ transcript, status: 'in_review' })
            .eq('id', submissionId)

        // Step 2: Extract business content
        console.log('Step 2: Extracting business content...')
        const businessContent = await groqService.extractBusinessContent(transcript)

        // Step 3: Generate website
        console.log('Step 3: Generating website...')
        const websiteHtml = await groqService.generateWebsite(businessContent, {
            name: submission.business_name,
            type: submission.business_type,
            owner: submission.owner_name,
            location: submission.city,
        })

        // Step 4: Update submission with everything
        const { error: updateError } = await supabase
            .from('submissions')
            .update({
                transcript,
                website_code: websiteHtml,
                status: 'website_generated',
            })
            .eq('id', submissionId)

        if (updateError) {
            console.error('Error updating submission:', updateError)
            return NextResponse.json({ error: 'Failed to save results' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            transcript,
            businessContent,
            websiteUrl: `/preview/${submissionId}`,
            message: 'Submission processed successfully',
        })
    } catch (error: any) {
        console.error('Process submission error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to process submission' },
            { status: 500 }
        )
    }
}
