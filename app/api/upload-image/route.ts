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

        const formData = await request.formData()
        const file = formData.get('file') as File
        const submissionId = formData.get('submissionId') as string

        if (!file || !submissionId) {
            return NextResponse.json({ error: 'Missing file or submission ID' }, { status: 400 })
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const fileExt = file.name.split('.').pop()
        const fileName = `${submissionId}/${timestamp}.${fileExt}`

        // Convert File to ArrayBuffer then to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('submission-photos')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('submission-photos')
            .getPublicUrl(fileName)

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: uploadData.path
        })
    } catch (error) {
        console.error('Upload image error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
