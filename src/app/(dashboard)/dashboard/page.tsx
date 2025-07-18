"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Search, Filter, Users, Calendar, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useUser()
  const userId = user?.id

  // Fetch real data from Convex
  const publicChallenges = useQuery(api.challenges.getPublicChallenges)
  const userStats = useQuery(api.users.getUserDashboardStats, userId ? { userId } : "skip")
  const userChallenges = useQuery(api.challenges.getUserParticipatingChallenges, userId ? { userId } : "skip")
  
  const joinChallenge = useMutation(api.challenges.joinChallenge)

  const handleJoinChallenge = async (challengeId: string) => {
    if (!userId) return
    try {
      await joinChallenge({ challengeId: challengeId as any, userId })
    } catch (error) {
      console.error("Failed to join challenge:", error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.firstName || "there"}! 👋</h1>
        <p className="text-gray-700">Discover new challenges and join a community of achievers</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Active Challenges</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userChallenges?.length || 0}</div>
            <p className="text-xs text-gray-700">Current challenges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Current Streak</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats?.currentStreak || 0} days</div>
            <p className="text-xs text-gray-700">Keep it up! 🔥</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Total Challenges</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userStats?.totalChallenges || 0}</div>
            <p className="text-xs text-gray-700">All time</p>
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

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search challenges..." className="pl-10" />
        </div>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
        <Link href="/challenges/create">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Challenge</span>
          </Button>
        </Link>
      </div>

      {/* Challenge Feed */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular Challenges</h2>

        <div className="grid gap-6">
          {publicChallenges?.map((challenge: any) => (
            <Card key={challenge._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-gray-900">{challenge.title}</CardTitle>
                    <CardDescription className="text-base text-gray-700">{challenge.description}</CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-gray-700">
                      <span>Created by {challenge.createdBy}</span>
                      <Badge variant="secondary">{challenge.category}</Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleJoinChallenge(challenge._id)}
                    disabled={challenge.participants.includes(userId || "")}
                  >
                    {challenge.participants.includes(userId || "") ? "Joined" : "Join Challenge"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1 text-gray-700">
                      <Users className="h-4 w-4" />
                      <span>{challenge.participants.length} participants</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(challenge.endDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
