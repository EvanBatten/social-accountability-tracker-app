"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function UserProfileInitializer() {
  const { user, isLoaded } = useUser();
  const upsertUserProfile = useMutation(api.users.upsertUserProfile);

  useEffect(() => {
    if (isLoaded && user) {
      // Create or update user profile when user signs in
      upsertUserProfile({
        userId: user.id,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        email: user.emailAddresses[0]?.emailAddress || undefined,
        imageUrl: user.imageUrl || undefined,
      }).catch((error) => {
        console.error("Failed to create user profile:", error);
      });
    }
  }, [isLoaded, user, upsertUserProfile]);

  return null; // This component doesn't render anything
} 