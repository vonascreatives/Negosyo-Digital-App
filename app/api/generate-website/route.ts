import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { selectTemplateForBusinessType, getTemplate } from '@/lib/templates'
import { injectContent } from '@/lib/templates/injector'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        // Check Clerk authentication
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin using Convex
        const creator = await fetchQuery(api.creators.getByClerkId, { clerkId: userId })
        if (!creator || creator.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        const body = await request.json()
        const { submissionId, templateName, customizations } = body

        if (!submissionId) {
            return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 })
        }

        // Get submission from Convex
        const submissionData = await fetchQuery(api.submissions.getById, { id: submissionId as any })

        if (!submissionData) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
        }

        // Map Convex data to expected format
        const submission = {
            id: submissionData._id,
            business_name: submissionData.businessName,
            business_type: submissionData.businessType,
            owner_name: submissionData.ownerName,
            owner_phone: submissionData.ownerPhone,
            owner_email: submissionData.ownerEmail,
            address: submissionData.address,
            city: submissionData.city,
            photos: submissionData.photos,
            transcript: submissionData.transcript,
            status: submissionData.status,
            website_content: (submissionData as any).websiteContent,
        }

        // Check if submission is rejected
        if (submission.status === 'rejected') {
            return NextResponse.json({ error: 'Cannot generate website for rejected submission' }, { status: 400 })
        }

        // Check if there's an existing generated website with edited content (from Convex)
        const existingWebsite = await fetchQuery(api.generatedWebsites.getBySubmissionId, {
            submissionId: submissionData._id
        })

        // Get or extract content - prioritization:
        // 1. Edited content from generated_websites (if exists)
        // 2. Previously extracted content from submissions
        // 3. Fresh extraction via Groq
        let extractedContent = existingWebsite?.extractedContent || submission.website_content

        // Validate that extractedContent has required fields
        const hasRequiredFields = extractedContent &&
            extractedContent.business_name &&
            extractedContent.tagline &&
            extractedContent.about

        console.log('=== CONTENT VALIDATION ===')
        console.log('extractedContent exists:', !!extractedContent)
        console.log('Has required fields:', hasRequiredFields)
        if (extractedContent) {
            console.log('Content fields:', Object.keys(extractedContent))
        }

        if (!extractedContent || !hasRequiredFields) {
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

                // Note: Content will be saved to generated_websites table below

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
        // Get photos from submission and resolve Convex storage IDs to actual URLs
        const photoStorageIds = (extractedContent as any).images || submission.photos || []
        let photos: string[] = []

        if (photoStorageIds.length > 0) {
            try {
                const resolvedUrls = await fetchQuery(api.files.getMultipleUrls, {
                    storageIds: photoStorageIds
                })
                // Filter out null values and keep only valid URLs
                photos = resolvedUrls.filter((url): url is string => url !== null)
            } catch (error) {
                console.error('Error resolving photo URLs:', error)
                // Fallback to original array if resolution fails
                photos = photoStorageIds
            }
        }

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

        // Ensure all required fields are present with fallbacks from submission data
        const contentWithContact = {
            // Core required fields with fallbacks
            business_name: extractedContent?.business_name || submission.business_name,
            tagline: extractedContent?.tagline || `Welcome to ${submission.business_name}`,
            about: extractedContent?.about || `${submission.business_name} is a ${submission.business_type} located in ${submission.city}.`,
            services: extractedContent?.services || [
                { name: 'Service 1', description: 'Quality service for our customers' },
                { name: 'Service 2', description: 'Professional and reliable' },
                { name: 'Service 3', description: 'Customer satisfaction guaranteed' }
            ],
            unique_selling_points: extractedContent?.unique_selling_points || ['Quality', 'Reliability', 'Service'],
            tone: extractedContent?.tone || 'professional-friendly',
            // Optional fields
            hero_cta: extractedContent?.hero_cta,
            services_cta: extractedContent?.services_cta,
            methodology: extractedContent?.methodology,
            // Contact info from submission
            contact: {
                email: submission.owner_email || 'contact@example.com',
                phone: submission.owner_phone || '+63 900 000 0000',
                address: submission.address ? `${submission.address}, ${submission.city}` : submission.city
            }
        }

        console.log('=== DEBUG: Website Generation ===')
        console.log('Customizations:', JSON.stringify(finalCustomizations, null, 2))
        console.log('Content keys:', Object.keys(contentWithContact))
        console.log('Content business_name:', contentWithContact.business_name)
        console.log('Content tagline:', contentWithContact.tagline)
        console.log('Photos count:', photos.length)

        const generatedHtml = injectContent(templateHtml, contentWithContact, finalCustomizations, photos)

        console.log('Generated HTML length:', generatedHtml.length)
        console.log('Has hero-section:', generatedHtml.includes('id="hero-section"'))
        console.log('Has about-section:', generatedHtml.includes('id="about-section"'))
        console.log('Has services-section:', generatedHtml.includes('id="services-section"'))
        console.log('Has footer-section:', generatedHtml.includes('id="footer-section"'))

        // Save to Convex using mutations
        const { fetchMutation } = await import('convex/nextjs')

        // Save generated website to Convex
        const websiteId = await fetchMutation(api.generatedWebsites.upsert, {
            submissionId: submissionData._id,
            templateName: selectedTemplate,
            extractedContent: contentWithContact,
            customizations: finalCustomizations,
            htmlContent: generatedHtml,
            status: 'draft',
        })

        // Note: Status is not automatically changed when generating website
        // The workflow is: in_review -> (generate) -> approved -> deployed -> pending_payment -> paid

        return NextResponse.json({
            success: true,
            websiteId: websiteId,
            htmlContent: generatedHtml, // For iframe srcdoc preview
            website: {
                extracted_content: contentWithContact,
                customizations: finalCustomizations
            },
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
