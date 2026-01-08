"use client"
import React, { JSX, useMemo } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Models } from "appwrite"
import { UserPrefs } from "@/store/Auth"
import slugify from "@/utils/slugify"

// Helper function to get a consistent avatar based on user ID
const getAvatarForUser = (userId: string): string => {
  const avatars = [
    "/avatars/avatar-1.png",
    "/avatars/avatar-2.png",
    "/avatars/avatar-3.png",
    "/avatars/avatar-4.png",
  ]
  // Simple hash function to get consistent avatar for each user
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  const index = Math.abs(hash) % avatars.length
  return avatars[index]
}

export const FloatingNav = ({
  navItems,
  className,
  user,
  hydrated,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
  user?: Models.User<UserPrefs> | null
  hydrated?: boolean
}) => {
  // Memoize avatar URL to prevent recalculation
  const avatarUrl = useMemo(() => {
    if (user?.$id) {
      return getAvatarForUser(user.$id)
    }
    return null
  }, [user?.$id])

  return (
    <div
      className={cn(
        "flex max-w-fit fixed top-4 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black/90 bg-white/90 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
        className
      )}
    >
      {navItems.map((navItem, idx: number) => (
        <Link
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-sm">{navItem.name}</span>
        </Link>
      ))}

      {/* Conditional Login/Profile Section */}
      {hydrated && (
        user ? (
          <div className="flex items-center gap-3">
            {/* Ask Question Button */}
            <Link
              href="/questions/ask"
              className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <span>Ask Question</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-orange-500 to-transparent h-px" />
            </Link>

            {/* User Avatar and Name */}
            <Link
              href={`/users/${user.$id}/${slugify(user.name)}`}
              className="flex items-center gap-2 border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white pl-1 pr-3 py-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl || "/avatars/avatar-1.png"}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border-2 border-orange-500/50"
              />
              <span className="hidden sm:block max-w-[100px] truncate">{user.name}</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-green-500 to-transparent h-px" />
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <span>Login</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </Link>
        )
      )}
      {!hydrated && (
        <div className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full opacity-50">
          <span>Loading...</span>
        </div>
      )}
    </div>
  )
}
