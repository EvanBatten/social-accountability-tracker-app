import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all public challenges
export const getPublicChallenges = query({
  args: {},
  handler: async (ctx) => {
    const challenges = await ctx.db
      .query("challenges")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .collect();

    return challenges;
  },
});

// Get challenges created by a specific user
export const getChallengesByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const challenges = await ctx.db
      .query("challenges")
      .filter((q) => q.eq(q.field("createdBy"), args.userId))
      .order("desc")
      .collect();

    return challenges;
  },
});

// Get challenges a user is participating in
export const getUserParticipatingChallenges = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const challenges = await ctx.db
      .query("challenges")
      .filter((q) => q.eq(q.field("participants"), [args.userId]))
      .order("desc")
      .collect();

    return challenges;
  },
});

// Get a specific challenge by ID
export const getChallenge = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const challenge = await ctx.db.get(args.challengeId);
    return challenge;
  },
});

// Create a new challenge
export const createChallenge = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    createdBy: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const challengeId = await ctx.db.insert("challenges", {
      ...args,
      participants: [args.createdBy], // Creator automatically joins
      createdAt: Date.now(),
    });

    // Create or update user profile
    await ctx.db.insert("userProfiles", {
      userId: args.createdBy,
      totalChallenges: 1,
      completedChallenges: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return challengeId;
  },
});

// Join a challenge
export const joinChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (challenge.participants.includes(args.userId)) {
      throw new Error("User already joined this challenge");
    }

    const updatedParticipants = [...challenge.participants, args.userId];
    
    await ctx.db.patch(args.challengeId, {
      participants: updatedParticipants,
    });

    return { success: true };
  },
});

// Leave a challenge
export const leaveChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    const updatedParticipants = challenge.participants.filter(
      (id: string) => id !== args.userId
    );

    await ctx.db.patch(args.challengeId, {
      participants: updatedParticipants,
    });

    return { success: true };
  },
}); 