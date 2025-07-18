import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignInButton, SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs"
import { Target, Users, Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AccountabilityHub</span>
          </div>
          <SignedOut>
            <div className="flex items-center space-x-4">
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Get Started</Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/challenges/create">
                <Button>Create Challenge</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
            </div>
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🚀 Transform Your Habits with Social Power
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Your Goals Into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Social Victories
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Join a community of achievers who track habits, share progress, and celebrate wins together. Make
            accountability fun with streaks, badges, and social encouragement.
          </p>
          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Your Journey
                </Button>
              </SignUpButton>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                See How It Works
              </Button>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-3">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/challenges/create">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Create Challenge
                </Button>
              </Link>
            </div>
          </SignedIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Social Accountability Works</h2>
            <p className="text-xl text-gray-700">Science-backed features that make habit formation stick</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Social Accountability</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base text-gray-700">
                  Share your progress with friends and community members. Studies show you're 65% more likely to achieve
                  goals when accountable to others.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Streak Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base text-gray-700">
                  Build momentum with visual streak counters. Watch your consistency grow and celebrate milestone
                  achievements with the community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Gamification</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base text-gray-700">
                  Earn badges, unlock achievements, and compete in friendly challenges. Make personal growth feel like a
                  rewarding game.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Steps to Success</h2>
            <p className="text-xl text-gray-700">Get started in minutes and see results in days</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Create Your Challenge</h3>
                <p className="text-gray-700">
                  Set up a habit or goal you want to track. Make it public or invite specific friends to join you.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Log Daily Progress</h3>
                <p className="text-gray-700">
                  Check in each day with your status and optional notes. Build your streak and track your journey.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Get Social Support</h3>
                <p className="text-gray-700">
                  Receive encouragement from your community, celebrate wins together, and stay motivated through
                  challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Habits?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who are achieving their goals with social accountability. Start your first
            challenge today - it's completely free!
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Create Your Free Account
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Target className="h-6 w-6" />
            <span className="text-xl font-bold">AccountabilityHub</span>
          </div>
          <p className="text-gray-400 mb-4">Empowering personal growth through social accountability</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
