"use client"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation"
import React from "react"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session, hydrated } = useAuthStore()
  const router = useRouter()

  React.useEffect(() => {
    if (hydrated && session) {
      router.push("/")
    }
  }, [session, hydrated, router])

  // Show loading while checking auth state
  if (!hydrated) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
        <BackgroundBeams />
        <div className="relative flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  // If user is already logged in, don't render auth pages
  if (session) {
    return null
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <BackgroundBeams />
      <div className="relative">{children}</div>
    </div>
  )
}

export default Layout
