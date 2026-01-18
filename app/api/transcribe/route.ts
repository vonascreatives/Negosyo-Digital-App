import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { groqService } from '@/lib/services/groq.service'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
    try {
        // Check Clerk authentication
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { audioUrl, submissionId, useConvexStorage, videoStorageId, audioStorageId } = body

        let mediaUrl = audioUrl

        // If using Convex storage, get the actual URL
        if (useConvexStorage && (videoStorageId || audioStorageId)) {
            const storageId = videoStorageId || audioStorageId
            try {
                // Get URL from Convex storage
                const url = await convex.query(api.files.getUrlByString, {
                    storageId: storageId.toString()
                })
                if (url) {
                    mediaUrl = url
                }
            } catch (err) {
                console.error('Error getting Convex storage URL:', err)
                return NextResponse.json({ error: 'Failed to get media URL' }, { status: 500 })
            }
        }

        if (!mediaUrl) {
            return NextResponse.json({ error: 'Audio/Video URL is required' }, { status: 400 })
        }

        // Transcribe audio
        const transcript = await groqService.transcribeAudioFromUrl(mediaUrl)

        // Update submission with transcript if submissionId provided
        if (submissionId) {
            try {
                await convex.mutation(api.submissions.update, {
                    id: submissionId as Id<"submissions">,
                    transcript: transcript,
                })
            } catch (err) {
                console.error('Error updating submission:', err)
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
