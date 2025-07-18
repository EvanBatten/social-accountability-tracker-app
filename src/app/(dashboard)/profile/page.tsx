"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { Calendar, Trophy, TrendingUp, Users, CheckCircle, Flame, Star, Award, Plus } from "lucide-react"

// Mock data - replace with Convex queries
const userStats = {
  totalChallenges: 12,
  completedChallenges: 8,
  activeChallenges: 3,
  longestStreak: 30,
  currentStreak: 12,
  totalDays: 156,
  successRate: 78,
  badges: [
    { name: "First Challenge", icon: "🏁", description: "Completed your first challenge" },
    { name: "Streak Master", icon: "🔥", description: "Maintained a 30-day streak" },
    { name: "Community Helper", icon: "🤝", description: "Helped 10 people stay motivated" },
    { name: "Early Bird", icon: "🌅", description: "Completed 30 morning challenges" },
  ],
}

const recentChallenges = [
  {
    id: "1",
    title: "Morning Workout Routine",
    status: "active",
    progress: 40,
    streak: 12,
    role: "creator",
  },
  {
    id: "2",
    title: "Daily Journaling",
    status: "active",
    progress: 38,
    streak: 8,
    role: "participant",
  },
  {
    id: "3",
    title: "30-Day Water Challenge",
    status: "completed",
    progress: 100,
    finalStreak: 28,
    role: "participant",
  },
]

export default function ProfilePage() {
  const { user } = useUser()

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
                  <Badge className="bg-blue-100 text-blue-800">Level {Math.floor(userStats.totalDays / 30) + 1}</Badge>
                  <span className="text-sm text-gray-700">{userStats.totalDays} total active days</span>
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
            <div className="text-2xl font-bold text-gray-900">{userStats.totalChallenges}</div>
            <p className="text-xs text-gray-700">{userStats.completedChallenges} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Longest Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats.longestStreak}</div>
            <p className="text-xs text-gray-700">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats.successRate}%</div>
            <p className="text-xs text-gray-700">completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Current Streak</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats.currentStreak}</div>
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
              {recentChallenges.map((challenge) => (
                <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{challenge.title}</h3>
                      {challenge.role === "creator" && (
                        <Badge variant="outline" className="text-xs">
                          Creator
                        </Badge>
                      )}
                      <Badge variant={challenge.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {challenge.status === "completed" ? "Completed" : "Active"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-700">
                      <span>{challenge.progress}% complete</span>
                      {challenge.status === "active" ? (
                        <span className="flex items-center space-x-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span>{challenge.streak} day streak</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{challenge.finalStreak} day final streak</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievement Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Achievements</CardTitle>
              <CardDescription className="text-gray-700">Your latest milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Completed "30-Day Water Challenge"</p>
                  <p className="text-sm text-gray-700">January 10, 2024</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Achieved 30-day streak milestone</p>
                  <p className="text-sm text-gray-700">December 28, 2023</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Created your first public challenge</p>
                  <p className="text-sm text-gray-700">December 15, 2023</p>
                </div>
              </div>
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
              {userStats.badges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-2xl">{badge.icon}</div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{badge.name}</p>
                    <p className="text-xs text-gray-700">{badge.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create New Challenge
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Invite Friends
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
