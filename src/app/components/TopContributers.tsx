import { cn } from "@/lib/utils"

import { AnimatedList } from "@/components/magicui/animated-list"
import { users } from "@/models/server/config"
import { Models, Query } from "node-appwrite"
import { UserPrefs } from "@/store/Auth"
import convertDateToRelativeTime from "@/utils/relativeTime"
import { avatars } from "@/models/client/config"
import Link from "next/link"
import slugify from "@/utils/slugify"
import { IconTrophy } from "@tabler/icons-react"

const Notification = ({ user, rank }: { user: Models.User<UserPrefs>; rank: number }) => {
  return (
    <Link href={`/users/${user.$id}/${slugify(user.name)}`}>
      <figure
        className={cn(
          "relative mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
          // animation styles
          "transition-all duration-200 ease-in-out hover:scale-[103%]",
          // light styles
          "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
          // dark styles
          "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
        )}
      >
        <div className="flex flex-row items-center gap-3">
          {/* Rank Badge */}
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : rank === 3 ? "bg-amber-600" : "bg-white/10"
            }`}>
            {rank <= 3 ? (
              <IconTrophy className="h-4 w-4 text-white" />
            ) : (
              <span className="text-xs font-bold text-white">#{rank}</span>
            )}
          </div>
          <picture>
            <img
              src={avatars.getInitials(user.name, 40, 40)}
              alt={user.name}
              className="rounded-2xl"
            />
          </picture>
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
              <span className="text-sm sm:text-lg">{user.name}</span>
              <span className="mx-1">·</span>
              <span className="text-xs text-gray-500">
                {convertDateToRelativeTime(new Date(user.$updatedAt))}
              </span>
            </figcaption>
            <p className="text-sm font-normal dark:text-white/60">
              <span>Reputation</span>
              <span className="mx-1">·</span>
              <span className="text-xs text-orange-500 font-semibold">
                {user.prefs.reputation}
              </span>
            </p>
          </div>
        </div>
      </figure>
    </Link>
  )
}

export default async function TopContributers() {
  const topUsers = await users.list<UserPrefs>([Query.limit(100)])

  // Sort users by reputation (highest first)
  const sortedUsers = topUsers.users
    .filter((user) => user.prefs?.reputation !== undefined)
    .sort((a, b) => (b.prefs.reputation || 0) - (a.prefs.reputation || 0))
    .slice(0, 10)

  return (
    <div className="bg-background relative flex max-h-[400px] min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden rounded-lg bg-white/10 p-6 shadow-lg">
      <AnimatedList>
        {sortedUsers.map((user, index) => (
          <Notification user={user} rank={index + 1} key={user.$id} />
        ))}
      </AnimatedList>
    </div>
  )
}
