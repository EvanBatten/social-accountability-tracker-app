"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, TrendingUp, CheckCircle, MessageCircle, Heart, Share2, Trophy, Flame } from "lucide-react"
import { format } from "date-fns"

// Mock data - replace with Convex queries
const challengeData = {
  id: "1",
  title: "30-Day Morning Meditation",
  description:
    "Start each day with 10 minutes of mindfulness meditation to improve focus, reduce stress, and cultivate inner peace. This challenge will help you build a sustainable morning routine.",
  category: "Wellness & Mindfulness",
  createdBy: {
    name: "Sarah Chen",
    avatar: "/placeholder-user.jpg",
    id: "user1",
  },
  startDate: "2024-01-01",
  endDate: "2024-01-30",
  participants: 24,
  isPublic: true,
  hasJoined: true,
  currentStreak: 12,
  totalDays: 30,
  completedDays: 12,
  status: "active",
}

const progressLogs = [
  {
    id: "1",
    date: "2024-01-15",
    user: { name: "You", avatar: "/placeholder-user.jpg" },
    status: "completed",
    note: "Great session today! Feeling more centered and focused.",
    likes: 3,
    comments: 1,
  },
  {
    id: "2",
    date: "2024-01-15",
    user: { name: "Mike Johnson", avatar: "/placeholder-user.jpg" },
    status: "completed",
    note: "10 minutes of breathing meditation. Already feeling the benefits!",
    likes: 5,
    comments: 2,
  },
  {
    id: "3",
    date: "2024-01-14",
    user: { name: "Emma Wilson", avatar: "/placeholder-user.jpg" },
    status: "missed",
    note: "Overslept today, but getting back on track tomorrow!",
    likes: 2,
    comments: 3,
  },
]

const participants = [
  { name: "Sarah Chen", avatar: "/placeholder-user.jpg", streak: 15, role: "creator" },
  { name: "Mike Johnson", avatar: "/placeholder-user.jpg", streak: 12 },
  { name: "Emma Wilson", avatar: "/placeholder-user.jpg", streak: 8 },
  { name: "Alex Rodriguez", avatar: "/placeholder-user.jpg", streak: 14 },
  { name: "Lisa Park", avatar: "/placeholder-user.jpg", streak: 10 },
]

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const [todayStatus, setTodayStatus] = useState("")
  const [todayNote, setTodayNote] = useState("")
  const [hasLoggedToday, setHasLoggedToday] = useState(false)

  const handleLogProgress = async () => {
    if (!todayStatus) return

    // Here you would use Convex mutation to log progress
    console.log("Logging progress:", { status: todayStatus, note: todayNote })

    setHasLoggedToday(true)
    setTodayStatus("")
    setTodayNote("")
  }

  const progressPercentage = (challengeData.completedDays / challengeData.totalDays) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Challenge Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-gray-900">{challengeData.title}</h1>
              <Badge>{challengeData.category}</Badge>
            </div>
            <p className="text-gray-700 max-w-3xl">{challengeData.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-700">
              <span>Created by {challengeData.createdBy.name}</span>
              <span>•</span>
              <span>
                {format(new Date(challengeData.startDate), "MMM d")} -{" "}
                {format(new Date(challengeData.endDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {!challengeData.hasJoined && <Button>Join Challenge</Button>}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Your Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center text-gray-900">
                {challengeData.currentStreak}
                <span className="text-sm font-normal ml-1">days</span>
              </div>
              <p className="text-xs text-gray-700">Keep it going! 🔥</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Participants</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{challengeData.participants}</div>
              <p className="text-xs text-gray-700">Active members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Days Remaining</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{challengeData.totalDays - challengeData.completedDays}</div>
              <p className="text-xs text-gray-700">Until completion</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Log Today's Progress */}
          {challengeData.hasJoined && !hasLoggedToday && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>Log Today's Progress</span>
                </CardTitle>
                <CardDescription className="text-gray-700">How did you do with your meditation today?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-900">Status *</Label>
                  <Select value={todayStatus} onValueChange={setTodayStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">✅ Completed</SelectItem>
                      <SelectItem value="partial">⚡ Partially Done</SelectItem>
                      <SelectItem value="missed">❌ Missed Today</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note" className="text-gray-900">Note (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Share how it went, any insights, or encouragement for others..."
                    value={todayNote}
                    onChange={(e) => setTodayNote(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleLogProgress} disabled={!todayStatus} className="w-full">
                  Log Progress
                </Button>
              </CardContent>
            </Card>
          )}

          {hasLoggedToday && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Great job! You've logged your progress for today.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Progress Feed</CardTitle>
              <CardDescription className="text-gray-700">See how everyone is doing with their daily progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {progressLogs.map((log) => (
                <div key={log.id} className="flex space-x-4">
                  <Avatar>
                    <AvatarImage src={log.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{log.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{log.user.name}</span>
                      <Badge
                        variant={
                          log.status === "completed"
                            ? "default"
                            : log.status === "partial"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {log.status === "completed" ? "Completed" : log.status === "partial" ? "Partial" : "Missed"}
                      </Badge>
                      <span className="text-xs text-gray-700">{format(new Date(log.date), "MMM d")}</span>
                    </div>
                    <p className="text-gray-700">{log.note}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                        <Heart className="h-4 w-4" />
                        <span>{log.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                        <MessageCircle className="h-4 w-4" />
                        <span>{log.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Participants</CardTitle>
              <CardDescription className="text-gray-700">See who's joining you on this journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className="text-xs">{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{participant.name}</p>
                      {participant.role === "creator" && (
                        <Badge variant="outline" className="text-xs">
                          Creator
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-700">
                      <Flame className="h-3 w-3 text-orange-500" />
                      <span>{participant.streak} day streak</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Challenge Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Challenge Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Average completion rate</span>
                <span className="text-sm font-medium text-gray-900">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Longest streak</span>
                <span className="text-sm font-medium text-gray-900">15 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Total check-ins</span>
                <span className="text-sm font-medium text-gray-900">1,247</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
