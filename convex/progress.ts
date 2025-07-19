import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Log daily progress for a challenge
export const logProgress = mutation({
  args: {
    challengeId: v.id("challenges"),
    userId: v.string(),
    date: v.string(),
    status: v.union(v.literal("completed"), v.literal("partial"), v.literal("missed")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if progress already exists for this date
    const existingProgress = await ctx.db
      .query("challengeProgress")
      .filter((q) => 
        q.and(
          q.eq(q.field("challengeId"), args.challengeId),
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("date"), args.date)
        )
      )
      .first();

    if (existingProgress) {
      // Update existing progress
      await ctx.db.patch(existingProgress._id, {
        status: args.status,
        note: args.note,
      });
    } else {
      // Create new progress entry
      await ctx.db.insert("challengeProgress", {
        challengeId: args.challengeId,
        userId: args.userId,
        date: args.date,
        status: args.status,
        note: args.note,
        createdAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Get progress for a specific challenge and user
export const getChallengeProgress = query({
  args: {
    challengeId: v.id("challenges"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("challengeProgress")
      .filter((q) => 
        q.and(
          q.eq(q.field("challengeId"), args.challengeId),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .order("asc")
      .collect();

    return progress;
  },
});

// Get all progress for a specific challenge (for feed)
export const getChallengeProgressFeed = query({
  args: {
    challengeId: v.id("challenges"),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("challengeProgress")
      .filter((q) => q.eq(q.field("challengeId"), args.challengeId))
      .order("desc")
      .collect();

    return progress;
  },
});

// Get user's progress for all challenges on a specific date
export const getUserDailyProgress = query({
  args: {
    userId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("challengeProgress")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("date"), args.date)
        )
      )
      .collect();

    return progress;
  },
});

// Calculate user stats for a challenge
export const getChallengeStats = query({
  args: {
    challengeId: v.id("challenges"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the challenge to calculate total days
    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      return {
        totalDays: 0,
        completedDays: 0,
        percentage: 0,
        currentStreak: 0,
        progress: [],
      };
    }

    const progress = await ctx.db
      .query("challengeProgress")
      .filter((q) => 
        q.and(
          q.eq(q.field("challengeId"), args.challengeId),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .order("asc")
      .collect();

    const completed = progress.filter(p => p.status === "completed").length;
    
    // Calculate total days in the challenge
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const percentage = totalDays > 0 ? (completed / totalDays) * 100 : 0;

    // Calculate current streak
    let currentStreak = 0;
    const sortedProgress = progress.sort((a, b) => a.date.localeCompare(b.date));
    
    for (let i = sortedProgress.length - 1; i >= 0; i--) {
      if (sortedProgress[i].status === "completed") {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalDays,
      completedDays: completed,
      percentage,
      currentStreak,
      progress,
    };
  },
}); 