"use client"

import { useAuthStore } from "@/store/Auth"
import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"
import { IconEdit, IconLogout } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

const EditButton = () => {
  const { userId, userSlug } = useParams()
  const { user, logout } = useAuthStore()
  const router = useRouter()

  if (user?.$id !== userId) return null

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/users/${userId}/${userSlug}/edit`}
        className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/10"
      >
        <IconEdit className="h-4 w-4 text-gray-400 transition-colors group-hover:text-orange-500" />
        Edit Profile
      </Link>
      <button
        onClick={handleLogout}
        className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/10"
      >
        <IconLogout className="h-4 w-4 text-gray-400 transition-colors group-hover:text-red-500" />
        Logout
      </button>
    </div>
  )
}

export default EditButton
