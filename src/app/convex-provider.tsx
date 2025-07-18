"use client";
import * as React from "react"
import { ConvexProvider as ConvexProviderBase } from "convex/react"
import { ConvexReactClient } from "convex/react"

/**
 * Provides Convex context to the React tree.
 * If `NEXT_PUBLIC_CONVEX_URL` is _not_ defined we fall back to
 * a passthrough wrapper so development previews don't crash.
 */
export function ConvexProvider({ children }: { children: React.ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  const client = React.useMemo(() => {
    if (!convexUrl) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("NEXT_PUBLIC_CONVEX_URL is not set — Convex features are disabled for this build.")
      }
      return null
    }
    return new ConvexReactClient(convexUrl)
  }, [convexUrl])

  if (!client) {
    return <>{children}</>
  }

  return <ConvexProviderBase client={client}>{children}</ConvexProviderBase>
}
