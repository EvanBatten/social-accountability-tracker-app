"use client";

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Globe, Lock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function CreateChallengePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    isPublic: true,
    startDate: new Date(),
    endDate: undefined as Date | undefined,
  })

  const categories = [
    "Fitness & Health",
    "Learning & Education",
    "Productivity",
    "Wellness & Mindfulness",
    "Creative & Hobbies",
    "Social & Relationships",
    "Financial",
    "Digital Wellness",
    "Other",
  ]

  const durations = [
    { label: "7 days", value: "7" },
    { label: "14 days", value: "14" },
    { label: "21 days", value: "21" },
    { label: "30 days", value: "30" },
    { label: "60 days", value: "60" },
    { label: "90 days", value: "90" },
    { label: "Custom", value: "custom" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would use Convex mutation to create the challenge
    console.log("Creating challenge:", formData)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to the new challenge or dashboard
    router.push("/dashboard/my-challenges")
  }

  const handleDurationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, duration: value }))

    if (value !== "custom" && value) {
      const days = Number.parseInt(value)
      const endDate = new Date(formData.startDate)
      endDate.setDate(endDate.getDate() + days)
      setFormData((prev) => ({ ...prev, endDate }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Challenge</h1>
        <p className="text-gray-700">Start a new habit or goal and invite others to join your journey</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Plus className="h-5 w-5" />
            <span>Challenge Details</span>
          </CardTitle>
          <CardDescription className="text-gray-700">Fill in the details for your new challenge. Make it engaging and clear!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-900">Challenge Title *</Label>
              <Input
                id="title"
                placeholder="e.g., 30-Day Morning Meditation"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your challenge, what participants need to do, and why it matters..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-900">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-gray-900">Duration</Label>
              <Select value={formData.duration} onValueChange={handleDurationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-gray-900">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-gray-700",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData((prev) => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date (if custom duration) */}
            {formData.duration === "custom" && (
              <div className="space-y-2">
                <Label className="text-gray-900">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-gray-700",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Pick an end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Privacy Settings */}
            <div className="space-y-4">
              <Label className="text-gray-900">Privacy Settings</Label>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {formData.isPublic ? (
                    <Globe className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-700" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{formData.isPublic ? "Public Challenge" : "Private Challenge"}</p>
                    <p className="text-sm text-gray-700">
                      {formData.isPublic
                        ? "Anyone can discover and join this challenge"
                        : "Only people you invite can join this challenge"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked }))}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <Button type="submit" className="flex-1">
                Create Challenge
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
