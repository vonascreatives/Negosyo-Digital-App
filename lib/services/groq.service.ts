import Groq from "groq-sdk"

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

export const groqService = {
    /**
     * Transcribe audio file to text using Whisper
     */
    async transcribeAudio(audioFile: File): Promise<string> {
        try {
            const transcription = await groq.audio.transcriptions.create({
                file: audioFile,
                model: "whisper-large-v3",
                language: "en",
                response_format: "json",
            })

            return transcription.text
        } catch (error) {
            console.error('Groq transcription error:', error)
            throw new Error('Failed to transcribe audio')
        }
    },

    /**
     * Transcribe audio from URL
     */
    async transcribeAudioFromUrl(audioUrl: string): Promise<string> {
        try {
            // Fetch the audio file
            const response = await fetch(audioUrl)
            const blob = await response.blob()
            const file = new File([blob], 'audio.mp3', { type: blob.type })

            return await this.transcribeAudio(file)
        } catch (error) {
            console.error('Groq transcription from URL error:', error)
            throw new Error('Failed to transcribe audio from URL')
        }
    },

    /**
     * Extract structured business content from transcript using Claude via Groq
     */
    async extractBusinessContent(transcript: string): Promise<BusinessContent> {
        try {
            const prompt = `You are a business content analyst. Extract structured information from this business interview transcript.

TRANSCRIPT:
${transcript}

Extract the following information in JSON format:
{
  "tagline": "A short, catchy tagline for the business (max 10 words)",
  "about": "A compelling 2-3 sentence description of the business",
  "services": ["Service 1", "Service 2", "Service 3"],
  "contact": {
    "phone": "Phone number if mentioned",
    "email": "Email if mentioned",
    "address": "Physical address if mentioned"
  },
  "highlights": ["Key highlight 1", "Key highlight 2", "Key highlight 3"]
}

IMPORTANT:
- If information is not mentioned, use reasonable defaults or leave empty
- Make the tagline creative and memorable
- Services should be clear and specific
- Highlights should emphasize unique selling points
- Return ONLY valid JSON, no additional text`

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: "llama-3.3-70b-versatile", // Using Claude-like model via Groq
                temperature: 0.7,
                max_tokens: 2000,
            })

            const content = completion.choices[0]?.message?.content || '{}'

            // Parse JSON response
            const parsed = JSON.parse(content)
            return parsed as BusinessContent
        } catch (error) {
            console.error('Groq content extraction error:', error)
            throw new Error('Failed to extract business content')
        }
    },

    /**
     * Generate website HTML from business content
     */
    async generateWebsite(businessContent: BusinessContent, businessInfo: BusinessInfo): Promise<string> {
        try {
            const prompt = `You are a professional web designer. Create a beautiful, modern, single-page website for this business.

BUSINESS INFORMATION:
Name: ${businessInfo.name}
Type: ${businessInfo.type}
Tagline: ${businessContent.tagline}
About: ${businessContent.about}
Services: ${businessContent.services.join(', ')}
Contact: ${JSON.stringify(businessContent.contact)}
Highlights: ${businessContent.highlights.join(', ')}

Create a complete HTML page with:
1. Modern, responsive design using Tailwind CSS (via CDN)
2. Professional color scheme matching the business type
3. Hero section with business name and tagline
4. About section
5. Services section with cards
6. Highlights/Features section
7. Contact section
8. Smooth animations and transitions
9. Mobile-friendly layout

Return ONLY the complete HTML code, starting with <!DOCTYPE html>`

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.8,
                max_tokens: 4000,
            })

            const html = completion.choices[0]?.message?.content || ''
            return html
        } catch (error) {
            console.error('Groq website generation error:', error)
            throw new Error('Failed to generate website')
        }
    },
}

// Types
export interface BusinessContent {
    tagline: string
    about: string
    services: string[]
    contact: {
        phone?: string
        email?: string
        address?: string
    }
    highlights: string[]
}

export interface BusinessInfo {
    name: string
    type: string
    owner: string
    location: string
}
