"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Search, Filter, Users, Calendar, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Challenge, UserStats, JoinChallengeParams } from "@/types"
import { DashboardSkeleton } from "@/components/ui/loading"
import { challengeTemplates, ChallengeTemplate } from "@/data/challenge-templates"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useUser()
  const userId = user?.id
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // Fetch real data from Convex
  const userStats = useQuery(api.users.getUserDashboardStats, userId ? { userId } : "skip") as UserStats | undefined
  const userChallenges = useQuery(api.challenges.getUserParticipatingChallenges, userId ? { userId } : "skip") as Challenge[] | undefined

  // Filter templates based on search term
  const filteredTemplates = challengeTemplates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUseTemplate = (template: ChallengeTemplate) => {
    // Navigate to create page with template data
    const templateData = encodeURIComponent(JSON.stringify(template))
    router.push(`/challenges/create?template=${templateData}`)
  }

  if (!user) {
    return <DashboardSkeleton />
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
          <Input 
            placeholder="Search challenges..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

      {/* Challenge Templates */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular Challenge Templates</h2>

        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-700 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Start with a popular challenge template!"}
                  </p>
                  {!searchTerm && (
                    <Link href="/challenges/create">
                      <Button>Create Custom Challenge</Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredTemplates.map((template: ChallengeTemplate) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleUseTemplate(template)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl text-gray-900">{template.title}</CardTitle>
                      <CardDescription className="text-base text-gray-700">{template.description}</CardDescription>
                      <div className="flex items-center space-x-4 text-sm text-gray-700">
                        <Badge variant="secondary">{template.category}</Badge>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Template</span>
                        </span>
                      </div>
                    </div>
                    <Button variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1 text-gray-700">
                        <TrendingUp className="h-4 w-4" />
                        <span>{template.goal}</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
