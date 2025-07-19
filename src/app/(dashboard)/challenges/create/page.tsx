"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar, Lock, Users, Target, CalendarDays, Plus, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter, useSearchParams } from "next/navigation"
import { CreateChallengeFormData, CreateChallengeParams } from "@/types"
import { ChallengeTemplate } from "@/data/challenge-templates"


const categories = [
  "Fitness & Health",
  "Productivity",
  "Learning & Skills",
  "Mindfulness & Wellness",
  "Social & Relationships",
  "Finance & Budgeting",
  "Creativity & Hobbies",
  "Environmental",
  "Other",
]

export default function CreateChallengePage() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const createChallenge = useMutation(api.challenges.createChallenge)
  
  // Get template data from URL if available
  const templateParam = searchParams.get('template')
  const template: ChallengeTemplate | null = useMemo(() => {
    if (!templateParam) return null
    try {
      return JSON.parse(decodeURIComponent(templateParam))
    } catch (error) {
      console.error("Failed to parse template:", error)
      return null
    }
  }, [templateParam])
  
  const [formData, setFormData] = useState<CreateChallengeFormData>({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    isPublic: true,
    maxParticipants: "",
    goal: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when template changes
  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || "",
        description: template.description || "",
        category: template.category || "",
        startDate: template.startDate || "",
        endDate: template.endDate || "",
        isPublic: template.isPublic ?? true,
        maxParticipants: template.maxParticipants || "",
        goal: template.goal || "",
      })
    }
  }, [template])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setIsSubmitting(true)
    try {
      const params: CreateChallengeParams = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        createdBy: user.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isPublic: formData.isPublic,
      }
      const challengeId = await createChallenge(params)

      // Show success message
      alert("Challenge created successfully!")
      router.push(`/challenges/${challengeId}`)
    } catch (error) {
      console.error("Failed to create challenge:", error)
      alert("Failed to create challenge. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.title.trim() && 
    formData.description.trim() && 
    formData.category && 
    formData.startDate && 
    formData.endDate &&
    new Date(formData.startDate) < new Date(formData.endDate)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {template ? `Create Challenge from Template` : `Create a New Challenge`}
          </h1>
          <p className="text-gray-700">
            {template 
              ? `Using template: ${template.title}. Customize the details below to make it your own.`
              : "Design a challenge that will inspire and motivate others to achieve their goals"
            }
          </p>
          {template && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Template Goal:</strong> {template.goal}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Plus className="h-5 w-5 text-blue-600" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription className="text-gray-700">Set the foundation for your challenge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-900">Challenge Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., 30-Day Morning Meditation Challenge"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-900">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what participants will do, the benefits they'll gain, and any specific requirements..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-900">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Timeline</span>
              </CardTitle>
              <CardDescription className="text-gray-700">Set the start and end dates for your challenge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-900">Start Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className={cn(
                        "pl-10",
                        !formData.startDate && "text-gray-700",
                      )}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-gray-900">End Date *</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      className={cn(
                        "pl-10",
                        !formData.endDate && "text-gray-700",
                      )}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Target className="h-5 w-5 text-purple-600" />
                <span>Goals & Settings</span>
              </CardTitle>
              <CardDescription className="text-gray-700">Define the challenge goals and participation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-gray-900">Daily Goal</Label>
                <Input
                  id="goal"
                  placeholder="e.g., 10 minutes of meditation, 30 push-ups, read 20 pages..."
                  value={formData.goal}
                  onChange={(e) => handleInputChange("goal", e.target.value)}
                />
                <p className="text-sm text-gray-700">What should participants accomplish each day?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="text-gray-900">Maximum Participants</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="Leave empty for unlimited"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-700">Optional: Limit the number of participants</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900">Public Challenge</Label>
                  <p className="text-sm text-gray-700">Anyone can discover and join this challenge</p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                />
              </div>

              {!formData.isPublic && (
                <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Lock className="h-5 w-5 text-gray-700" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Private Challenge</p>
                    <p className="text-sm text-gray-700">Only invited participants can join this challenge</p>
                  </div>
                </div>
              )}

              {formData.isPublic && (
                <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Public Challenge</p>
                    <p className="text-sm text-gray-700">Anyone can discover and join this challenge</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Challenge Preview</CardTitle>
              <CardDescription className="text-gray-700">How your challenge will appear to others</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {formData.title || "Your Challenge Title"}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {formData.description || "Challenge description will appear here..."}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-700">
                  {formData.category && <span className="bg-gray-100 px-2 py-1 rounded">{formData.category}</span>}
                  {formData.startDate && formData.endDate && (
                    <span>
                      {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? "Creating..." : "Create Challenge"}
            </Button>
          </div>
          
          {!isFormValid && (
            <div className="text-sm text-red-600 mt-2">
              Please fill in all required fields and ensure the end date is after the start date.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
