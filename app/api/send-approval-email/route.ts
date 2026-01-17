import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendApprovalEmail } from '@/lib/email/service'

export async function POST(request: NextRequest) {
    try {
        console.log('1. Starting approval email process...')

        // Check admin auth using server-side client
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        console.log('2. User authenticated:', user?.id)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        console.log('3. Checking admin role...')
        const { data: creator, error: creatorError } = await supabase
            .from('creators')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        console.log('4. Creator data:', creator, 'Error:', creatorError)

        if (creatorError) {
            console.error('Error checking creator role:', creatorError)
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        if (!creator || creator?.role !== 'admin') {
            console.log('5. Not admin - creator:', creator)
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
        }

        console.log('6. Admin verified, getting submission ID...')
        const { submissionId } = await request.json()

        if (!submissionId) {
            return NextResponse.json({ error: 'Submission ID required' }, { status: 400 })
        }

        console.log('7. Getting submission:', submissionId)
        // Get submission details directly
        const { data: submission, error: submissionError } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', submissionId)
            .maybeSingle()

        console.log('8. Submission found:', submission?.id)

        if (submissionError) {
            console.error('Error fetching submission:', submissionError)
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
        }

        console.log('9. Getting published website URL...')
        // Get published URL from generated_websites table
        const { data: website } = await supabase
            .from('generated_websites')
            .select('published_url')
            .eq('submission_id', submissionId)
            .single()

        const publishedUrl = website?.published_url || submission.website_url || 'https://your-website.netlify.app'
        console.log('10. Published URL:', publishedUrl)

        console.log('11. Sending email to:', submission.owner_email)
        // Send approval email
        await sendApprovalEmail({
            businessName: submission.business_name,
            businessOwnerName: submission.owner_name,
            businessOwnerEmail: submission.owner_email,
            websiteUrl: publishedUrl,
            amount: submission.amount,
            submissionId: submission.id
        })

        console.log('12. Email sent successfully!')
        return NextResponse.json({ success: true, message: 'Approval email sent' })
    } catch (error: any) {
        console.error('Error sending approval email:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to send email' },
            { status: 500 }
        )
    }
}
