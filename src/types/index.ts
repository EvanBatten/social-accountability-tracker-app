// Challenge types
export interface Challenge {
  _id: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  participants: string[];
  createdAt: number;
}

// Progress types
export interface ChallengeProgress {
  _id: string;
  challengeId: string;
  userId: string;
  date: string;
  status: "completed" | "partial" | "missed";
  note?: string;
  createdAt: number;
}

// User stats types
export interface UserStats {
  currentStreak: number;
  totalChallenges: number;
  successRate: number;
  longestStreak: number;
  totalDays: number;
}

// Challenge stats types
export interface ChallengeStats {
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
}

// Progress feed item
export interface ProgressFeedItem {
  _id: string;
  challengeId: string;
  userId: string;
  date: string;
  status: "completed" | "partial" | "missed";
  note?: string;
  createdAt: number;
  user?: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  };
}

// Form data types
export interface CreateChallengeFormData {
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  maxParticipants: string;
  goal: string;
}

// API parameter types
export interface ChallengeIdParam {
  challengeId: string;
}

export interface UserIdParam {
  userId: string;
}

export interface ChallengeAndUserParams {
  challengeId: string;
  userId: string;
}

export interface LogProgressParams {
  challengeId: string;
  userId: string;
  date: string;
  status: "completed" | "partial" | "missed";
  note?: string;
}

export interface CreateChallengeParams {
  title: string;
  description: string;
  category: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
}

export interface JoinChallengeParams {
  challengeId: string;
  userId: string;
} 