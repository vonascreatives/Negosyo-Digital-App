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
        const { audioUrl, submissionId } = body

        if (!audioUrl) {
            return NextResponse.json({ error: 'Audio URL is required' }, { status: 400 })
        }

        // Transcribe audio
        console.log('Transcribing audio from:', audioUrl)
        const transcript = await groqService.transcribeAudioFromUrl(audioUrl)

        // Update submission with transcript if submissionId provided
        if (submissionId) {
            const { error: updateError } = await supabase
                .from('submissions')
                .update({ transcript })
                .eq('id', submissionId)
                .eq('creator_id', user.id) // Ensure user owns this submission

            if (updateError) {
                console.error('Error updating submission:', updateError)
                return NextResponse.json({ error: 'Failed to save transcript' }, { status: 500 })
            }
        }

        return NextResponse.json({
            success: true,
            transcript,
        })
    } catch (error: any) {
        console.error('Transcription API error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to transcribe audio' },
            { status: 500 }
        )
    }
}
