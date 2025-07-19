"use client"

import { Button } from "@/components/ui/button"
import { Target, Home, Plus, User, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import UserButton to prevent hydration errors
const UserButton = dynamic(() => import("@clerk/nextjs").then(mod => ({ default: mod.UserButton })), {
  ssr: false,
})

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/challenges/create", label: "Create", icon: Plus },
    { href: "/dashboard/my-challenges", label: "My Challenges", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 hover:-translate-y-0.5 transition-transform cursor-pointer">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AccountabilityHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2 hover:-translate-y-0.5 transition-transform cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="hover:-translate-y-0.5 transition-transform cursor-pointer">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around mt-3 pt-3 border-t">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className="flex flex-col items-center space-y-1 h-auto py-2 hover:-translate-y-0.5 transition-transform cursor-pointer"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
