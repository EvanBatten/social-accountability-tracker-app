import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    createdBy: v.string(), // Clerk user ID
    startDate: v.string(),
    endDate: v.string(),
    isPublic: v.boolean(),
    participants: v.array(v.string()), // Array of Clerk user IDs
    createdAt: v.number(),
  }).index("by_createdBy", ["createdBy"]).index("by_public", ["isPublic"]),

  challengeProgress: defineTable({
    challengeId: v.id("challenges"),
    userId: v.string(), // Clerk user ID
    date: v.string(), // YYYY-MM-DD format
    status: v.union(v.literal("completed"), v.literal("partial"), v.literal("missed")),
    note: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_challenge_user", ["challengeId", "userId"]).index("by_user_date", ["userId", "date"]),

  userProfiles: defineTable({
    userId: v.string(), // Clerk user ID
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    totalChallenges: v.number(),
    completedChallenges: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    totalDays: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
}); 