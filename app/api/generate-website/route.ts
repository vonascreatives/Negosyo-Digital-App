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

            // Count photos for featured projects generation
            const photoCount = submission.photos?.length || 0

            const prompt = `You are a professional website content writer. Based on the following business information, create compelling website content.

${context}

Number of photos available: ${photoCount}

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
  "tone": "professional-friendly",
  "featured_headline": "Featured Products",
  "featured_subheadline": "A brief description of what makes these projects special",
  "featured_products": [
    {
      "title": "Project title related to the business",
      "description": "A detailed 2-3 sentence description of this project showcasing quality work",
      "tags": ["Tag1", "Duration"],
      "testimonial": {
        "quote": "A realistic customer testimonial about this project (2-3 sentences)",
        "author": "Customer Name"
      }
    }
  ]
}

IMPORTANT:
- Make the tagline creative and memorable
- Services should be specific to this business type
- USPs should highlight what makes this business unique
- Keep descriptions concise and compelling
- Generate ${Math.min(photoCount, 3) || 3} featured_products (one for each photo if available, max 3)
- Each featured project should have a unique title, description, tags, and testimonial
- Make testimonials sound realistic and specific to each project
- Tags should include project type and estimated duration
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

        // Resolve about_images storage IDs to actual URLs (if they exist and are not already URLs)
        const aboutImageStorageIds = (extractedContent as any)?.about_images || []
        let resolvedAboutImages: string[] = []

        if (aboutImageStorageIds.length > 0) {
            try {
                // Filter out already-resolved URLs and only resolve storage IDs
                const storageIdsToResolve = aboutImageStorageIds.filter(
                    (img: string) => img && !img.startsWith('http')
                )
                const alreadyResolvedUrls = aboutImageStorageIds.filter(
                    (img: string) => img && img.startsWith('http')
                )

                if (storageIdsToResolve.length > 0) {
                    const resolvedUrls = await fetchQuery(api.files.getMultipleUrls, {
                        storageIds: storageIdsToResolve
                    })

                    // Map back to original order
                    resolvedAboutImages = aboutImageStorageIds.map((img: string) => {
                        if (img.startsWith('http')) {
                            return img
                        }
                        const idx = storageIdsToResolve.indexOf(img)
                        return resolvedUrls[idx] || img
                    }).filter((url: string | null): url is string => url !== null)
                } else {
                    resolvedAboutImages = alreadyResolvedUrls
                }
                console.log('Resolved about images:', resolvedAboutImages.length)
            } catch (error) {
                console.error('Error resolving about image URLs:', error)
                // Fallback to original array if resolution fails
                resolvedAboutImages = aboutImageStorageIds
            }
        }

        // Resolve services_image storage ID to actual URL (if exists and is not already a URL)
        const servicesImageStorageId = (extractedContent as any)?.services_image
        let resolvedServicesImage: string | undefined = undefined

        if (servicesImageStorageId && !servicesImageStorageId.startsWith('http')) {
            try {
                const resolvedUrls = await fetchQuery(api.files.getMultipleUrls, {
                    storageIds: [servicesImageStorageId]
                })
                if (resolvedUrls[0]) {
                    resolvedServicesImage = resolvedUrls[0]
                }
                console.log('Resolved services image:', resolvedServicesImage)
            } catch (error) {
                console.error('Error resolving services image URL:', error)
            }
        } else if (servicesImageStorageId?.startsWith('http')) {
            resolvedServicesImage = servicesImageStorageId
        }

        const defaultCustomizations = {
            navbarStyle: '1',
            heroStyle: '1',
            aboutStyle: '1',
            servicesStyle: '1',
            featuredStyle: '1',
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
            // Hero section fields
            hero_badge_text: extractedContent?.hero_badge_text,
            hero_testimonial: extractedContent?.hero_testimonial,
            // Visibility toggles
            visibility: extractedContent?.visibility || {
                navbar: true,
                hero_section: true,
                hero_headline: true,
                hero_tagline: true,
                hero_description: true,
                hero_testimonial: true,
                hero_button: true,
                hero_image: true,
                // About section visibility
                about_section: true,
                about_badge: true,
                about_headline: true,
                about_description: true,
                about_images: true,
                // Services section visibility
                services_section: true,
                services_badge: true,
                services_headline: true,
                services_subheadline: true,
                services_image: true,
                services_list: true,
                // Featured section visibility
                featured_section: true,
                featured_headline: true,
                featured_subheadline: true,
                featured_products: true,
                // Footer section visibility
                footer_section: true,
                footer_badge: true,
                footer_headline: true,
                footer_description: true,
                footer_contact: true,
                footer_social: true
            },
            // About section fields
            about_headline: extractedContent?.about_headline,
            about_description: (extractedContent as any)?.about_description,
            about_images: resolvedAboutImages.length > 0 ? resolvedAboutImages : undefined,
            // Services section fields
            services_headline: (extractedContent as any)?.services_headline,
            services_subheadline: (extractedContent as any)?.services_subheadline,
            services_image: resolvedServicesImage,
            // Featured section fields - generate defaults if not present
            featured_headline: (extractedContent as any)?.featured_headline || 'Featured Products',
            featured_subheadline: (extractedContent as any)?.featured_subheadline || `Take a look at some of our recent work at ${submission.business_name}`,
            featured_products: (extractedContent as any)?.featured_products || generateDefaultFeaturedProducts(submission.business_name, submission.business_type, photos.length),
            // Navbar links
            navbar_links: extractedContent?.navbar_links || [
                { label: 'About', href: '#about' },
                { label: 'Services', href: '#services' },
                { label: 'Featured', href: '#featured' },
                { label: 'Contacts', href: '#contact' }
            ],
            // Images (preserve storage IDs for later resolution)
            images: (extractedContent as any)?.images || submission.photos || [],
            // Contact info from submission (or from existing extracted content if edited)
            contact: (extractedContent as any)?.contact || {
                email: submission.owner_email || 'contact@example.com',
                phone: submission.owner_phone || '+63 900 000 0000',
                address: submission.address ? `${submission.address}, ${submission.city}` : submission.city
            },
            // Footer section fields
            footer: (extractedContent as any)?.footer || {
                brand_blurb: `For any inquiries or to explore your vision further, we invite you to contact our professional team using the details provided below.`,
                social_links: []
            }
        }

        console.log('=== DEBUG: Website Generation ===')
        console.log('Customizations:', JSON.stringify(finalCustomizations, null, 2))
        console.log('Content keys:', Object.keys(contentWithContact))
        console.log('Content business_name:', contentWithContact.business_name)
        console.log('Content tagline:', contentWithContact.tagline)
        console.log('Photos count:', photos.length)
        console.log('=== FEATURED PROJECTS DEBUG ===')
        console.log('extractedContent featured_products:', (extractedContent as any)?.featured_products)
        console.log('contentWithContact featured_products:', contentWithContact.featured_products)
        console.log('Featured projects count:', contentWithContact.featured_products?.length || 0)
        if (contentWithContact.featured_products && contentWithContact.featured_products.length > 0) {
            contentWithContact.featured_products.forEach((p: any, i: number) => {
                console.log(`Project ${i + 1}:`, {
                    title: p?.title,
                    hasDescription: !!p?.description,
                    tags: p?.tags,
                    hasTestimonial: !!(p?.testimonial?.quote && p?.testimonial?.author)
                })
            })
        }

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

/**
 * Generate default featured projects based on business info
 * Used when no featured_products are provided in extractedContent
 */
function generateDefaultFeaturedProducts(businessName: string, businessType: string, photoCount: number) {
    const productCount = Math.min(Math.max(photoCount, 1), 3) // 1-3 projects based on photos

    // Business type specific project templates
    const productTemplates: Record<string, Array<{ title: string; description: string; tags: string[] }>> = {
        'restaurant': [
            { title: 'Complete Kitchen Renovation', description: `We transformed the heart of ${businessName} with a modern kitchen setup featuring state-of-the-art equipment and efficient workflow design. The result is a space that enhances productivity while maintaining the highest standards of quality.`, tags: ['Kitchen', 'Renovation'] },
            { title: 'Dining Area Enhancement', description: `A complete refresh of the dining space at ${businessName}, creating an inviting atmosphere for guests. We focused on comfortable seating, ambient lighting, and décor that reflects the restaurant's unique character.`, tags: ['Interior', 'Design'] },
            { title: 'Outdoor Patio Setup', description: `Expanded the dining capacity with a beautiful outdoor patio area. The space features weather-resistant furniture and ambient lighting, perfect for al fresco dining experiences.`, tags: ['Outdoor', 'Expansion'] }
        ],
        'retail': [
            { title: 'Store Layout Optimization', description: `Redesigned the floor layout at ${businessName} to improve customer flow and product visibility. The new arrangement has significantly enhanced the shopping experience and increased customer engagement.`, tags: ['Retail', 'Layout'] },
            { title: 'Display System Installation', description: `Installed custom display systems that showcase products beautifully while maximizing floor space. The modular design allows for easy reconfiguration for seasonal changes.`, tags: ['Display', 'Custom'] },
            { title: 'Checkout Area Modernization', description: `Upgraded the checkout experience with modern POS systems and a welcoming counter design. The improvements have reduced wait times and improved customer satisfaction.`, tags: ['Technology', 'Service'] }
        ],
        'default': [
            { title: 'Complete Business Setup', description: `A comprehensive project for ${businessName} that included space planning, equipment installation, and finishing touches. The result is a professional environment that perfectly serves business needs.`, tags: ['Setup', 'Complete'] },
            { title: 'Service Area Enhancement', description: `Upgraded the main service area to improve workflow efficiency and customer experience. The modern design reflects the quality and professionalism of ${businessName}.`, tags: ['Enhancement', 'Service'] },
            { title: 'Customer Experience Improvement', description: `Focused improvements on the customer-facing areas, creating a welcoming atmosphere that encourages return visits and positive reviews.`, tags: ['Customer', 'Experience'] }
        ]
    }

    const templates = productTemplates[businessType.toLowerCase()] || productTemplates['default']

    // Generate projects with testimonials
    const testimonialAuthors = ['Maria Santos', 'Juan Dela Cruz', 'Ana Reyes', 'Carlo Mendoza', 'Lisa Garcia']
    const testimonialQuotes = [
        `${businessName} exceeded all our expectations. The attention to detail and professionalism was outstanding from start to finish.`,
        `Working with ${businessName} was a pleasure. They truly understood our vision and delivered beyond what we imagined.`,
        `The team at ${businessName} transformed our space completely. We couldn't be happier with the results and the service we received.`
    ]

    return templates.slice(0, productCount).map((template, index) => ({
        title: template.title,
        description: template.description,
        tags: template.tags,
        testimonial: {
            quote: testimonialQuotes[index % testimonialQuotes.length],
            author: testimonialAuthors[index % testimonialAuthors.length]
        }
    }))
}
