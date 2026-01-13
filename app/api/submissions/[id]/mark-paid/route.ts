import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // Check admin auth using server-side client
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        const { data: adminCreator, error: adminCheckError } = await supabase
            .from('creators')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        if (adminCheckError) {
            console.error('Error checking creator role:', adminCheckError)
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        if (!adminCreator || adminCreator?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
        }

        const { id: submissionId } = await params

        // Get submission to find creator
        const { data: submission, error: submissionError } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', submissionId)
            .maybeSingle()

        if (submissionError) {
            console.error('Error fetching submission:', submissionError)
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
        }

        // Update submission status to 'paid' and set paid_at timestamp
        const { error: updateError } = await supabase
            .from('submissions')
            .update({
                status: 'paid',
                paid_at: new Date().toISOString()
            })
            .eq('id', submissionId)

        if (updateError) throw updateError

        // Update creator balance
        const { data: creatorData, error: creatorError } = await supabase
            .from('creators')
            .select('balance, total_earnings')
            .eq('id', submission.creator_id)
            .single()

        if (creatorError) throw creatorError
        if (!creatorData) throw new Error('Creator not found')

        const newBalance = (creatorData.balance || 0) + submission.creator_payout
        const newTotalEarnings = (creatorData.total_earnings || 0) + submission.creator_payout

        const { error: balanceError } = await supabase
            .from('creators')
            .update({
                balance: newBalance,
                total_earnings: newTotalEarnings,
                updated_at: new Date().toISOString()
            })
            .eq('id', submission.creator_id)

        if (balanceError) throw balanceError

        return NextResponse.json({
            success: true,
            message: 'Payment confirmed and creator balance updated',
            newBalance,
            newTotalEarnings
        })
    } catch (error: any) {
        console.error('Error marking as paid:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to mark as paid' },
            { status: 500 }
        )
    }
}
