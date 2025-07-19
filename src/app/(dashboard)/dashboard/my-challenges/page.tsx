"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, TrendingUp, CheckCircle, Plus, Calendar, Users, Target, Flame } from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Challenge, UserStats } from "@/types"

export default function MyChallengesPage() {
  const { user } = useUser()
  const userId = user?.id

  // Fetch real data from Convex
  const userChallenges = useQuery(api.challenges.getUserParticipatingChallenges, userId ? { userId } : "skip") as Challenge[] | undefined
  const userStats = useQuery(api.users.getUserDashboardStats, userId ? { userId } : "skip") as UserStats | undefined

  // Separate active and completed challenges
  const activeChallenges = userChallenges?.filter((challenge: Challenge) => {
    const endDate = new Date(challenge.endDate)
    return endDate > new Date()
  }) || []

  const completedChallenges = userChallenges?.filter((challenge: Challenge) => {
    const endDate = new Date(challenge.endDate)
    return endDate <= new Date()
  }) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Challenges</h1>
        <p className="text-gray-700">Track your progress and maintain your streaks</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Active Challenges</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeChallenges.length}</div>
            <p className="text-xs text-gray-700">Keep the momentum going!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats?.currentStreak || 0} days</div>
            <p className="text-xs text-gray-700">Keep it up! 🔥</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{completedChallenges.length}</div>
            <p className="text-xs text-gray-700">Total achievements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats?.successRate || 0}%</div>
            <p className="text-xs text-gray-700">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenges */}
      <div className="space-y-6 mb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Active Challenges ({activeChallenges.length})</h2>
          <Link href="/challenges/create">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Challenge</span>
            </Button>
          </Link>
        </div>

        {activeChallenges.length > 0 ? (
          activeChallenges.map((challenge: Challenge) => (
            <Card key={challenge._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold text-gray-900">{challenge.title}</h3>
                      {challenge.createdBy === userId && (
                        <Badge variant="outline" className="text-xs">
                          Creator
                        </Badge>
                      )}
                      <Badge variant="secondary">{challenge.category}</Badge>
                    </div>
                    <p className="text-gray-700">{challenge.description}</p>
                  </div>
                  <Link href={`/challenges/${challenge._id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{challenge.participants.length}</p>
                      <p className="text-gray-700">Participants</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                      </p>
                      <p className="text-gray-700">Days left</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900">{new Date(challenge.endDate).toLocaleDateString()}</p>
                      <p className="text-gray-700">End date</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900">Active</p>
                      <p className="text-gray-700">Status</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Challenges</h3>
                  <p className="text-gray-700 mb-4">Start your first challenge to begin tracking your progress!</p>
                  <Link href="/challenges/create">
                    <Button>Create Your First Challenge</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed Challenges */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Completed Challenges ({completedChallenges.length})</h2>

        {completedChallenges.length > 0 ? (
          completedChallenges.map((challenge: Challenge) => (
            <Card key={challenge._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold text-gray-900">{challenge.title}</h3>
                      {challenge.createdBy === userId && (
                        <Badge variant="outline" className="text-xs">
                          Creator
                        </Badge>
                      )}
                      <Badge variant="default">{challenge.category}</Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    <p className="text-gray-700">{challenge.description}</p>
                  </div>
                  <Link href={`/challenges/${challenge._id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-gray-700" />
                    <div>
                      <p className="font-medium text-gray-900">Completed</p>
                      <p className="text-gray-700">Status</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{new Date(challenge.endDate).toLocaleDateString()}</p>
                      <p className="text-gray-700">Ended</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{challenge.participants.length}</p>
                      <p className="text-gray-700">Participants</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900">{challenge.category}</p>
                      <p className="text-gray-700">Category</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Challenges</h3>
                  <p className="text-gray-700">No completed challenges yet. Keep working on your active challenges!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
