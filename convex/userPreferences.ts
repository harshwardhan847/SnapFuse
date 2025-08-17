import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateUserPreferences = mutation({
    args: {
        userId: v.string(),
        preferences: v.object({
            // Generation preferences
            defaultImageStyle: v.optional(v.string()),
            defaultImageSize: v.optional(v.string()),
            defaultVideoLength: v.optional(v.string()),
            defaultVideoStyle: v.optional(v.string()),
            qualityPreference: v.optional(v.string()),
            creativityLevel: v.optional(v.number()),
            autoSaveGenerations: v.optional(v.boolean()),
            showWatermark: v.optional(v.boolean()),
            nsfwFilter: v.optional(v.boolean()),
            contentModeration: v.optional(v.boolean()),
            // Notification preferences
            emailNotifications: v.optional(v.boolean()),
            pushNotifications: v.optional(v.boolean()),
            smsNotifications: v.optional(v.boolean()),
            generationComplete: v.optional(v.boolean()),
            creditLowWarning: v.optional(v.boolean()),
            subscriptionUpdates: v.optional(v.boolean()),
            marketingEmails: v.optional(v.boolean()),
            securityAlerts: v.optional(v.boolean()),
            weeklyDigest: v.optional(v.boolean()),
            creditThreshold: v.optional(v.number()),
            notificationFrequency: v.optional(v.string()),
        }),
    },
    handler: async (ctx, { userId, preferences }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("byExternalId", (q) => q.eq("externalId", userId))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, {
            ...preferences,
            updated_at: new Date().toISOString(),
        });

        return { success: true };
    },
});

export const getUserPreferences = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("byExternalId", (q) => q.eq("externalId", userId))
            .unique();

        if (!user) {
            return null;
        }

        return {
            // Generation preferences
            defaultImageStyle: user.defaultImageStyle || "realistic",
            defaultImageSize: user.defaultImageSize || "1024x1024",
            defaultVideoLength: user.defaultVideoLength || "5s",
            defaultVideoStyle: user.defaultVideoStyle || "cinematic",
            qualityPreference: user.qualityPreference || "high",
            creativityLevel: user.creativityLevel || 7,
            autoSaveGenerations: user.autoSaveGenerations ?? true,
            showWatermark: user.showWatermark ?? false,
            nsfwFilter: user.nsfwFilter ?? true,
            contentModeration: user.contentModeration ?? true,
            // Notification preferences
            emailNotifications: user.emailNotifications ?? true,
            pushNotifications: user.pushNotifications ?? true,
            smsNotifications: user.smsNotifications ?? false,
            generationComplete: user.generationComplete ?? true,
            creditLowWarning: user.creditLowWarning ?? true,
            subscriptionUpdates: user.subscriptionUpdates ?? true,
            marketingEmails: user.marketingEmails ?? false,
            securityAlerts: user.securityAlerts ?? true,
            weeklyDigest: user.weeklyDigest ?? true,
            creditThreshold: user.creditThreshold || 10,
            notificationFrequency: user.notificationFrequency || "immediate",
        };
    },
});

export const completeOnboarding = mutation({
    args: {
        userId: v.string(),
        onboardingData: v.object({
            firstName: v.optional(v.string()),
            lastName: v.optional(v.string()),
            company: v.optional(v.string()),
            role: v.optional(v.string()),
            industry: v.optional(v.string()),
            teamSize: v.optional(v.string()),
            primaryUseCase: v.optional(v.string()),
            goals: v.optional(v.array(v.string())),
            experienceLevel: v.optional(v.string()),
            contentTypes: v.optional(v.array(v.string())),
            qualityPreference: v.optional(v.string()),
            emailNotifications: v.optional(v.boolean()),
            marketingEmails: v.optional(v.boolean()),
            weeklyDigest: v.optional(v.boolean()),
        }),
    },
    handler: async (ctx, { userId, onboardingData }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("byExternalId", (q) => q.eq("externalId", userId))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, {
            onboardingCompleted: true,
            // Map camelCase to snake_case for database fields
            first_name: onboardingData.firstName,
            last_name: onboardingData.lastName,
            // Spread the rest of the onboarding data
            company: onboardingData.company,
            role: onboardingData.role,
            industry: onboardingData.industry,
            teamSize: onboardingData.teamSize,
            primaryUseCase: onboardingData.primaryUseCase,
            goals: onboardingData.goals,
            experienceLevel: onboardingData.experienceLevel,
            contentTypes: onboardingData.contentTypes,
            qualityPreference: onboardingData.qualityPreference,
            emailNotifications: onboardingData.emailNotifications,
            marketingEmails: onboardingData.marketingEmails,
            weeklyDigest: onboardingData.weeklyDigest,
            updated_at: new Date().toISOString(),
        });

        return { success: true };
    },
});

export const checkOnboardingStatus = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("byExternalId", (q) => q.eq("externalId", userId))
            .unique();

        return {
            completed: user?.onboardingCompleted ?? false,
            user: user ? {
                name: user.name,
                email: user.email,
                company: user.company,
                role: user.role,
                primaryUseCase: user.primaryUseCase,
                experienceLevel: user.experienceLevel,
            } : null,
        };
    },
});