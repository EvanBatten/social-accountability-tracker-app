"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { Calendar, Trophy, TrendingUp, Users, CheckCircle, Flame, Star, Award, Plus } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Challenge, UserStats } from "@/types"
import { LoadingSpinner } from "@/components/ui/loading"
import Link from "next/link"

// Badge definitions
const badgeDefinitions = [
  { name: "First Challenge", icon: "🏁", description: "Completed your first challenge", condition: (stats: UserStats) => stats.totalChallenges >= 1 },
  { name: "Streak Master", icon: "🔥", description: "Maintained a 30-day streak", condition: (stats: UserStats) => stats.longestStreak >= 30 },
  { name: "Consistent Achiever", icon: "⭐", description: "Achieved 80%+ success rate", condition: (stats: UserStats) => stats.successRate >= 80 },
  { name: "Active Participant", icon: "🤝", description: "Participated in 5+ challenges", condition: (stats: UserStats) => stats.totalChallenges >= 5 },
]

export default function ProfilePage() {
  const { user } = useUser()
  const userId = user?.id

  // Fetch real data from Convex
  const userStats = useQuery(api.users.getUserDashboardStats, userId ? { userId } : "skip") as UserStats | undefined
  const userChallenges = useQuery(api.challenges.getUserParticipatingChallenges, userId ? { userId } : "skip") as Challenge[] | undefined

  // Separate active and completed challenges
  const activeChallenges = userChallenges?.filter((challenge: Challenge) => {
    const endDate = new Date(challenge.endDate)
    return endDate > new Date()
  }) || []

  const completedChallenges = userChallenges?.filter((challenge: Challenge) => {
    const endDate = new Date(challenge.endDate)
    return endDate <= new Date()
  }) || []

  // Get earned badges based on user stats
  const earnedBadges = userStats ? badgeDefinitions.filter(badge => badge.condition(userStats)) : []

  // Show loading if user data is not available
  if (!user || !userStats) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-700">
                  Member since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                    : "Recently"}
                </p>
                            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">Level {Math.floor((userStats.totalDays || 0) / 30) + 1}</Badge>
              <span className="text-sm text-gray-700">{userStats.totalDays || 0} total active days</span>
            </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Total Challenges</CardTitle>
            <Trophy className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats.totalChallenges || 0}</div>
            <p className="text-xs text-gray-700">{completedChallenges.length} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Longest Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats.longestStreak || 0}</div>
            <p className="text-xs text-gray-700">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats.successRate || 0}%</div>
            <p className="text-xs text-gray-700">completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Current Streak</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats.currentStreak || 0}</div>
            <p className="text-xs text-gray-700">days active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Challenges</CardTitle>
              <CardDescription className="text-gray-700">Your latest challenge activity and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userChallenges && userChallenges.length > 0 ? (
                userChallenges.slice(0, 5).map((challenge: Challenge) => {
                  const isActive = new Date(challenge.endDate) > new Date()
                  const isCreator = challenge.createdBy === userId
                  return (
                    <div key={challenge._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{challenge.title}</h3>
                          {isCreator && (
                            <Badge variant="outline" className="text-xs">
                              Creator
                            </Badge>
                          )}
                          <Badge variant={isActive ? "secondary" : "default"} className="text-xs">
                            {isActive ? "Active" : "Completed"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-700">
                          <span>{challenge.category}</span>
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{challenge.participants.length} participants</span>
                          </span>
                        </div>
                      </div>
                      <Link href={`/challenges/${challenge._id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-700">No challenges yet. Start your first challenge!</p>
                  <Link href="/challenges/create" className="mt-4 inline-block">
                    <Button className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Challenge
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievement Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Achievements</CardTitle>
              <CardDescription className="text-gray-700">Your latest milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {earnedBadges.length > 0 ? (
                earnedBadges.slice(0, 3).map((badge, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{badge.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Earned "{badge.name}" badge</p>
                      <p className="text-sm text-gray-700">{badge.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-700">No achievements yet. Start participating in challenges to earn badges!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Award className="h-5 w-5 text-yellow-600" />
                <span>Badges Earned</span>
              </CardTitle>
              <CardDescription className="text-gray-700">Recognition for your achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {earnedBadges.length > 0 ? (
                earnedBadges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{badge.name}</p>
                      <p className="text-xs text-gray-700">{badge.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-700 text-sm">No badges earned yet. Keep participating in challenges!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/challenges/create" className="w-full">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Challenge
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Browse Challenges
                </Button>
              </Link>
              <Link href="/dashboard/my-challenges" className="w-full">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  My Challenges
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
