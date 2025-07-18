import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user profile
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return profile;
  },
});

// Create or update user profile
export const upsertUserProfile = mutation({
  args: {
    userId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingProfile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existingProfile._id;
    } else {
      // Create new profile
      const profileId = await ctx.db.insert("userProfiles", {
        ...args,
        totalChallenges: 0,
        completedChallenges: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return profileId;
    }
  },
});

// Update user stats
export const updateUserStats = mutation({
  args: {
    userId: v.string(),
    totalChallenges: v.optional(v.number()),
    completedChallenges: v.optional(v.number()),
    currentStreak: v.optional(v.number()),
    longestStreak: v.optional(v.number()),
    totalDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        ...args,
        updatedAt: Date.now(),
      });
    }
  },
});

// Get user dashboard stats
export const getUserDashboardStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!profile) {
      return {
        totalChallenges: 0,
        completedChallenges: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        successRate: 0,
      };
    }

    const successRate = profile.totalChallenges > 0 
      ? Math.round((profile.completedChallenges / profile.totalChallenges) * 100)
      : 0;

    return {
      ...profile,
      successRate,
    };
  },
}); 