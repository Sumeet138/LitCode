"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { account } from "@/models/client/config"
import { useAuthStore } from "@/store/Auth"
import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
import React from "react"
import { BorderBeam } from "@/components/magicui/border-beam"
import { IconUser, IconLock, IconCheck, IconX } from "@tabler/icons-react"

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col space-y-2",
        className
      )}
    >
      {children}
    </div>
  )
}

const EditProfilePage = () => {
  const { user, verifySession } = useAuthStore()
  const { userId, userSlug } = useParams()
  const router = useRouter()

  const [formData, setFormData] = React.useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
      }))
    }
  }, [user])

  React.useEffect(() => {
    if (user && user.$id !== userId) {
      router.push(`/users/${userId}/${userSlug}`)
    }
  }, [user, userId, userSlug, router])

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("Name is required")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await account.updateName(formData.name)
      await verifySession()
      setSuccess("Name updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error: any) {
      setError(error?.message || "Failed to update name")
    }

    setLoading(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All password fields are required")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await account.updatePassword(formData.newPassword, formData.currentPassword)
      setSuccess("Password updated successfully!")
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
      setTimeout(() => setSuccess(""), 3000)
    } catch (error: any) {
      setError(error?.message || "Failed to update password")
    }

    setLoading(false)
  }

  if (!user || user.$id !== userId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold text-transparent">
          Edit Profile
        </h1>
        <p className="mt-1 text-gray-400">Update your account settings</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          <IconX className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">
          <IconCheck className="h-5 w-5 shrink-0" />
          {success}
        </div>
      )}

      {/* Update Name Form */}
      <form onSubmit={handleUpdateName}>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6">
          <BorderBeam size={200} duration={12} delay={5} />
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-500/20">
              <IconUser className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Display Name</h2>
              <p className="text-sm text-gray-400">This is how others will see you</p>
            </div>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="name" className="text-gray-300">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Your display name"
              className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-orange-500/50"
            />
          </LabelInputContainer>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2.5 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Name"}
          </button>
        </div>
      </form>

      {/* Update Password Form */}
      <form onSubmit={handleUpdatePassword}>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6">
          <BorderBeam size={200} duration={12} delay={8} />
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <IconLock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Change Password</h2>
              <p className="text-sm text-gray-400">Keep your account secure</p>
            </div>
          </div>
          <div className="space-y-4">
            <LabelInputContainer>
              <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                placeholder="Enter current password"
                className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-orange-500/50"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                placeholder="Enter new password (min 8 characters)"
                className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-orange-500/50"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="Confirm new password"
                className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-orange-500/50"
              />
            </LabelInputContainer>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2.5 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfilePage
