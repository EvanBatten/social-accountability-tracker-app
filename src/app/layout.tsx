import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SignedOut } from "@clerk/nextjs"
import { ConvexProvider } from "@/app/convex-provider"
import { SafeClerkProvider } from "@/components/safe-clerk-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Social Accountability Tracker",
  description: "Track your habits and goals with social accountability",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SafeClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SignedOut>
            {/* No header or bar for signed out users */}
          </SignedOut>
          <ConvexProvider>{children}</ConvexProvider>
        </body>
      </html>
    </SafeClerkProvider>
  )
}
