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
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Challenge, ChallengeProgress, ChallengeStats, ProgressFeedItem } from "@/types";
import { ChallengeDetailSkeleton } from "@/components/ui/loading";
import { getUserDisplayName, getUserInitials } from "@/utils/user-helpers";

export default function ChallengeDetailPage() {
  const { user } = useUser();
  const params = useParams()
  const challengeId = params.id as string
  
  const [todayStatus, setTodayStatus] = useState("")
  const [todayNote, setTodayNote] = useState("")
  const [hasLoggedToday, setHasLoggedToday] = useState(false)

  // Fetch real data from Convex
  const challenge = useQuery(api.challenges.getChallenge, { challengeId: challengeId as any }) as Challenge | undefined
  const userProgress = useQuery(
    api.progress.getChallengeProgress, 
    challengeId && user?.id ? { challengeId: challengeId as any, userId: user.id } : "skip"
  ) as ChallengeProgress[] | undefined
  const progressFeed = useQuery(
    api.progress.getChallengeProgressFeed, 
    challengeId ? { challengeId: challengeId as any } : "skip"
  ) as ProgressFeedItem[] | undefined
  const challengeStats = useQuery(
    api.progress.getChallengeStats, 
    challengeId && user?.id ? { challengeId: challengeId as any, userId: user.id } : "skip"
  ) as ChallengeStats | undefined

  const logProgress = useMutation(api.progress.logProgress)
  const joinChallenge = useMutation(api.challenges.joinChallenge)
  const leaveChallenge = useMutation(api.challenges.leaveChallenge)

  const handleLogProgress = async () => {
    if (!todayStatus || !user?.id || !challengeId) return

    try {
      const today = new Date().toISOString().split('T')[0]
      await logProgress({
        challengeId: challengeId as any,
        userId: user.id,
        date: today,
        status: todayStatus as any,
        note: todayNote || undefined,
      })

      setHasLoggedToday(true)
      setTodayStatus("")
      setTodayNote("")
      // Show success message
      alert("Progress logged successfully!")
    } catch (error) {
      console.error("Failed to log progress:", error)
      alert("Failed to log progress. Please try again.")
    }
  }

  const handleJoinChallenge = async () => {
    if (!user?.id || !challengeId) return
    try {
      await joinChallenge({ challengeId: challengeId as any, userId: user.id })
      alert("Successfully joined challenge!")
    } catch (error) {
      console.error("Failed to join challenge:", error)
      alert("Failed to join challenge. Please try again.")
    }
  }

  const handleLeaveChallenge = async () => {
    if (!user?.id || !challengeId) return
    try {
      await leaveChallenge({ challengeId: challengeId as any, userId: user.id })
      alert("Successfully left challenge!")
    } catch (error) {
      console.error("Failed to leave challenge:", error)
      alert("Failed to leave challenge. Please try again.")
    }
  }

  if (!challenge) {
    return <ChallengeDetailSkeleton />
  }

  const isParticipant = challenge.participants.includes(user?.id || "")
  const progressPercentage = challengeStats && challengeStats.totalDays > 0 
    ? (challengeStats.completedDays / challengeStats.totalDays) * 100 
    : 0
  const today = new Date().toISOString().split('T')[0]
  const userHasLoggedToday = userProgress?.some((p: ChallengeProgress) => p.date === today)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Challenge Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
              <Badge>{challenge.category}</Badge>
            </div>
            <p className="text-gray-700 max-w-3xl">{challenge.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-700">
              <span>Created by {getUserDisplayName(challenge.createdBy, user)}</span>
              <span>•</span>
              <span>
                {format(new Date(challenge.startDate), "MMM d")} -{" "}
                {format(new Date(challenge.endDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {!isParticipant ? (
              <Button onClick={handleJoinChallenge}>Join Challenge</Button>
            ) : (
              <Button variant="outline" onClick={handleLeaveChallenge}>Leave Challenge</Button>
            )}
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
                {challengeStats?.currentStreak || 0}
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
              <div className="text-2xl font-bold text-gray-900">{challenge.participants.length}</div>
              <p className="text-xs text-gray-700">Active members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Days Remaining</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
              </div>
              <p className="text-xs text-gray-700">Until completion</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Log Today's Progress */}
          {isParticipant && !userHasLoggedToday && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>Log Today's Progress</span>
                </CardTitle>
                <CardDescription className="text-gray-700">How did you do with your challenge today?</CardDescription>
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

          {userHasLoggedToday && (
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
              {progressFeed && progressFeed.length > 0 ? (
                progressFeed.map((log: ProgressFeedItem) => (
                  <div key={log._id} className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>{getUserInitials(log.userId, user)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{getUserDisplayName(log.userId, user)}</span>
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
                      {log.note && <p className="text-gray-700">{log.note}</p>}
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                          <Heart className="h-4 w-4" />
                          <span>0</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                          <MessageCircle className="h-4 w-4" />
                          <span>0</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-700">No progress logged yet. Be the first to share your progress!</p>
                </div>
              )}
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
              {challenge.participants.map((participantId: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-xs">{getUserInitials(participantId, user)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{getUserDisplayName(participantId, user)}</p>
                      {participantId === challenge.createdBy && (
                        <Badge variant="outline" className="text-xs">
                          Creator
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-700">
                      <Flame className="h-3 w-3 text-orange-500" />
                      <span>Active</span>
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
                <span className="text-sm text-gray-700">Total check-ins</span>
                <span className="text-sm font-medium text-gray-900">{progressFeed?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Challenge duration</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.ceil((new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Completion rate</span>
                <span className="text-sm font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
