import type * as React from "react"
import { ClerkProvider } from "@clerk/nextjs"

/**
 * A wrapper around ClerkProvider that prevents runtime crashes
 * when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not configured.
 */
export function SafeClerkProvider({ children, ...rest }: { children: React.ReactNode; [key: string]: any }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set — authentication features are disabled for this build.",
      )
    }
    // Render children without Clerk context; all <SignInButton> etc. will be inert
    return <>{children}</>
  }

  return (
    <ClerkProvider publishableKey={publishableKey} {...rest}>
      {children}
    </ClerkProvider>
  )
}
