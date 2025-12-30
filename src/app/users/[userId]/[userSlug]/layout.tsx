import { avatars } from "@/models/client/config"
import { users } from "@/models/server/config"
import { UserPrefs } from "@/store/Auth"
import convertDateToRelativeTime from "@/utils/relativeTime"
import React from "react"
import EditButton from "./EditButton"
import Navbar from "./Navbar"
import { IconClockFilled, IconUserFilled, IconTrophy } from "@tabler/icons-react"
import { Particles } from "@/components/magicui/particles"
import { ShineBorder } from "@/components/magicui/shine-border"

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ userId: string; userSlug: string }>
}) => {
  const { userId } = await params
  const user = await users.get<UserPrefs>(userId)

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 1000) return { label: "Legend", color: "from-yellow-500 to-orange-500" }
    if (reputation >= 500) return { label: "Expert", color: "from-purple-500 to-pink-500" }
    if (reputation >= 100) return { label: "Rising Star", color: "from-blue-500 to-cyan-500" }
    if (reputation >= 10) return { label: "Contributor", color: "from-green-500 to-emerald-500" }
    return { label: "Newcomer", color: "from-gray-500 to-gray-400" }
  }

  const level = getReputationLevel(user.prefs?.reputation || 0)

  return (
    <>
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={150}
        ease={100}
        color="#ffffff"
        refresh
      />
      <div className="container relative mx-auto space-y-6 px-4 pb-20 pt-32">
        {/* Profile Header Card */}
        <ShineBorder
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-sm"
          shineColor={["#ff7b00", "#ff2975", "#8c1eff"]}
        >
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-32 w-32 overflow-hidden rounded-2xl ring-4 ring-white/10 sm:h-40 sm:w-40">
                <picture className="block h-full w-full">
                  <img
                    src={avatars.getInitials(user.name, 200, 200).toString()}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </picture>
              </div>
              {/* Level Badge */}
              <div
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r ${level.color} px-3 py-1 text-xs font-bold text-white shadow-lg`}
              >
                {level.label}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                    {user.name}
                  </h1>
                  <p className="text-lg text-gray-400">{user.email}</p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <IconUserFilled className="h-4 w-4 text-orange-500" />
                      Joined {convertDateToRelativeTime(new Date(user.$createdAt))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <IconClockFilled className="h-4 w-4 text-blue-500" />
                      Active {convertDateToRelativeTime(new Date(user.$updatedAt))}
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <EditButton />
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-6 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20">
                    <IconTrophy className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {user.prefs?.reputation || 0}
                    </p>
                    <p className="text-xs text-gray-400">Reputation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ShineBorder>

        {/* Navigation and Content */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <Navbar />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout
