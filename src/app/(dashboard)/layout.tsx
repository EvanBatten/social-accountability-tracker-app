import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { UserProfileInitializer } from "@/components/user-profile-initializer"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfileInitializer />
      <Navigation />
      <main className="pt-16">{children}</main>
    </div>
  );
}
