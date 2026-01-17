import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { selectTemplateForBusinessType, getTemplate } from '@/lib/templates'
import { injectContent } from '@/lib/templates/injector'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        const { data: creator } = await supabase
            .from('creators')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!creator || creator.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        const body = await request.json()
        const { submissionId, templateName, customizations } = body

        if (!submissionId) {
            return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 })
        }

        // Get submission
        const { data: submission, error: fetchError } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', submissionId)
            .single()

        if (fetchError || !submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
        }

        // Check if submission is approved
        if (submission.status === 'rejected') {
            return NextResponse.json({ error: 'Cannot generate website for rejected submission' }, { status: 400 })
        }

        // Check if there's an existing generated website with edited content
        const { data: existingWebsite } = await supabase
            .from('generated_websites')
            .select('extracted_content')
            .eq('submission_id', submissionId)
            .single()

        // Get or extract content - prioritization:
        // 1. Edited content from generated_websites (if exists)
        // 2. Previously extracted content from submissions
        // 3. Fresh extraction via Groq
        let extractedContent = existingWebsite?.extracted_content || submission.website_content

        if (!extractedContent) {
            console.log('Extracting website content using Groq...')

            // Build context from submission data
            const context = `
Business Name: ${submission.business_name}
Business Type: ${submission.business_type}
Owner: ${submission.owner_name}
Location: ${submission.city}, ${submission.address}
Phone: ${submission.owner_phone}
${submission.owner_email ? `Email: ${submission.owner_email}` : ''}

${submission.transcript ? `Business Interview Transcript:\n${submission.transcript}` : ''}
            `.trim()

            // Extract structured content using Groq
            const Groq = (await import('groq-sdk')).default
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

            const prompt = `You are a professional website content writer. Based on the following business information, create compelling website content.

${context}

Generate a JSON response with the following structure:
{
  "business_name": "${submission.business_name}",
  "tagline": "A catchy, memorable tagline (max 10 words)",
  "about": "A compelling 2-3 sentence description of the business that highlights what makes it special",
  "services": [
    {"name": "Service Name 1", "description": "Brief description of this service"},
    {"name": "Service Name 2", "description": "Brief description of this service"},
    {"name": "Service Name 3", "description": "Brief description of this service"}
  ],
  "unique_selling_points": ["USP 1", "USP 2", "USP 3"],
  "tone": "professional-friendly"
}

IMPORTANT:
- Make the tagline creative and memorable
- Services should be specific to this business type
- USPs should highlight what makes this business unique
- Keep descriptions concise and compelling
- Return ONLY valid JSON, no markdown or additional text`

            try {
                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7,
                    max_tokens: 2000,
                })

                const content = completion.choices[0]?.message?.content || '{}'

                // Clean up markdown code blocks if present
                const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
                extractedContent = JSON.parse(cleanContent)

                console.log('Content extracted successfully:', extractedContent)

                // Save extracted content to submission
                await supabase
                    .from('submissions')
                    .update({ website_content: extractedContent })
                    .eq('id', submissionId)

            } catch (error) {
                console.error('Groq extraction error:', error)
                return NextResponse.json({
                    error: 'Failed to extract website content. Please try again.'
                }, { status: 500 })
            }
        }

        // Select template
        const selectedTemplate = templateName || selectTemplateForBusinessType(submission.business_type)
        const template = getTemplate(selectedTemplate)

        // Read template file
        const templatePath = path.join(process.cwd(), 'app', template.path)
        const templateHtml = await fs.readFile(templatePath, 'utf-8')

        // Inject content with default customizations if none provided
        const photos = (extractedContent as any).images || submission.photos || []
        const defaultCustomizations = {
            heroStyle: '1',
            aboutStyle: '1',
            servicesStyle: '1',
            footerStyle: '1',
            colorScheme: 'auto',
            colorSchemeId: 'auto',
            fontPairing: 'modern',
            fontPairingId: 'modern'
        }
        const finalCustomizations = customizations && Object.keys(customizations).length > 0
            ? { ...defaultCustomizations, ...customizations }
            : defaultCustomizations
        const generatedHtml = injectContent(templateHtml, extractedContent, finalCustomizations, photos)

        // Upload to Supabase Storage
        const fileName = `${submissionId}/website-${Date.now()}.html`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('generated-websites')
            .upload(fileName, generatedHtml, {
                contentType: 'text/html',
                upsert: true
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: 'Failed to upload website' }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('generated-websites')
            .getPublicUrl(fileName)

        // Save to database
        const { data: websiteData, error: saveError } = await supabase
            .from('generated_websites')
            .upsert({
                submission_id: submissionId,
                template_name: selectedTemplate,
                extracted_content: extractedContent,
                customizations: finalCustomizations,
                html_content: generatedHtml,
                storage_url: publicUrl,
                status: 'draft',
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'submission_id'
            })
            .select()
            .single()

        if (saveError) {
            console.error('Save error:', saveError)
            return NextResponse.json({ error: 'Failed to save website data' }, { status: 500 })
        }

        // Update submission status to website_generated
        const { error: statusError } = await supabase
            .from('submissions')
            .update({
                status: 'website_generated',
                website_url: publicUrl
            })
            .eq('id', submissionId)

        if (statusError) {
            console.error('Status update error:', statusError)
        }

        return NextResponse.json({
            success: true,
            website: websiteData,
            previewUrl: publicUrl,
            htmlContent: generatedHtml, // Add HTML content for iframe srcdoc
            message: 'Website generated successfully'
        })

    } catch (error: any) {
        console.error('Website generation error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate website' },
            { status: 500 }
        )
    }
}
