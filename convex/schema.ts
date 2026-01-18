import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    // Creators table (users - both creators and admins)
    creators: defineTable({
        clerkId: v.string(), // Clerk user ID
        phone: v.optional(v.string()),
        firstName: v.string(),
        middleName: v.optional(v.string()),
        lastName: v.string(),
        email: v.optional(v.string()),
        referralCode: v.string(),
        referredBy: v.optional(v.id('creators')),
        balance: v.number(),
        totalEarnings: v.number(),
        status: v.union(
            v.literal('pending'),
            v.literal('active'),
            v.literal('suspended')
        ),
        role: v.union(v.literal('creator'), v.literal('admin')),
        payoutMethod: v.optional(v.string()),
        payoutDetails: v.optional(v.string()),
    })
        .index('by_clerkId', ['clerkId'])
        .index('by_email', ['email'])
        .index('by_referralCode', ['referralCode'])
        .index('by_role', ['role'])
        .index('by_status', ['status']),

    // Business submissions
    submissions: defineTable({
        creatorId: v.id('creators'),

        // Business info
        businessName: v.string(),
        businessType: v.string(),
        ownerName: v.string(),
        ownerPhone: v.string(),
        ownerEmail: v.optional(v.string()),
        address: v.string(),
        city: v.string(),

        // Files - store as storage IDs for Convex file storage
        photos: v.array(v.string()), // URLs or storage IDs
        videoStorageId: v.optional(v.id('_storage')),
        audioStorageId: v.optional(v.id('_storage')),
        transcript: v.optional(v.string()),

        // Generated content
        websiteUrl: v.optional(v.string()),
        websiteCode: v.optional(v.string()),

        // Status workflow: submitted -> in_review -> approved -> deployed -> pending_payment -> paid
        // Note: 'completed' and 'website_generated' kept for backward compatibility with existing data
        status: v.union(
            v.literal('draft'),
            v.literal('submitted'),
            v.literal('in_review'),
            v.literal('approved'),
            v.literal('rejected'),
            v.literal('deployed'),
            v.literal('pending_payment'),
            v.literal('paid'),
            v.literal('completed'),
            v.literal('website_generated')
        ),

        // Payment
        amount: v.number(),
        paymentReference: v.optional(v.string()),
        paidAt: v.optional(v.number()), // Timestamp

        // Creator payout
        creatorPayout: v.number(),
        payoutRequestedAt: v.optional(v.number()), // Timestamp
        creatorPaidAt: v.optional(v.number()), // Timestamp
    })
        .index('by_creatorId', ['creatorId'])
        .index('by_status', ['status'])
        .index('by_payoutRequested', ['payoutRequestedAt']),

    // Generated websites
    generatedWebsites: defineTable({
        submissionId: v.id('submissions'),
        templateName: v.string(),
        extractedContent: v.any(), // JSON object with business content
        customizations: v.optional(v.any()), // JSON object with design customizations
        htmlContent: v.optional(v.string()),
        cssContent: v.optional(v.string()),
        htmlStorageId: v.optional(v.id('_storage')), // Store HTML in Convex storage
        status: v.union(v.literal('draft'), v.literal('published')),
        publishedUrl: v.optional(v.string()), // Netlify URL
        netlifySiteId: v.optional(v.string()),
        publishedAt: v.optional(v.number()), // Timestamp
    })
        .index('by_submissionId', ['submissionId'])
        .index('by_status', ['status']),
});
