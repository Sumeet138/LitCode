import { databases, users } from "@/models/server/config"
import { UserPrefs } from "@/store/Auth"
import React from "react"
import { MagicCard } from "@/components/magicui/magic-card"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { answerCollection, db, questionCollection } from "@/models/name"
import { Query } from "node-appwrite"
import { IconTrophy, IconMessageQuestion, IconMessage, IconFlame, IconStar } from "@tabler/icons-react"

const Page = async ({
  params,
}: {
  params: { userId: string; userSlug: string }
}) => {
  const [user, questions, answers] = await Promise.all([
    users.get<UserPrefs>(params.userId),
    databases.listDocuments(db, questionCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1),
    ]),
    databases.listDocuments(db, answerCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1),
    ]),
  ])

  const stats = [
    {
      title: "Reputation",
      value: user.prefs?.reputation || 0,
      icon: IconTrophy,
      gradient: "from-orange-500 to-pink-500",
      description: "Your total reputation score",
    },
    {
      title: "Questions",
      value: questions.total,
      icon: IconMessageQuestion,
      gradient: "from-blue-500 to-cyan-500",
      description: "Questions you've asked",
    },
    {
      title: "Answers",
      value: answers.total,
      icon: IconMessage,
      gradient: "from-purple-500 to-pink-500",
      description: "Answers you've provided",
    },
  ]

  const getActivityMessage = () => {
    const total = questions.total + answers.total
    if (total === 0) return "Start contributing to build your reputation!"
    if (total < 5) return "Great start! Keep engaging with the community."
    if (total < 20) return "You're becoming a valued member!"
    return "You're a top contributor! Thank you for your help."
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <MagicCard
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 p-6 shadow-2xl"
            gradientFrom="#ff7b00"
            gradientTo="#ff2975"
          >
            <div className="absolute right-4 top-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} opacity-20`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-gray-400">{stat.title}</p>
              <p className="mt-2 text-4xl font-bold text-white">
                <NumberTicker value={stat.value} />
              </p>
              <p className="mt-2 text-xs text-gray-500">{stat.description}</p>
            </div>
          </MagicCard>
        ))}
      </div>

      {/* Activity Card */}
      <MagicCard
        className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 p-6 shadow-2xl"
        gradientFrom="#8c1eff"
        gradientTo="#ff2975"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-500/20">
            <IconFlame className="h-7 w-7 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Activity Summary</h3>
            <p className="mt-1 text-gray-400">{getActivityMessage()}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                <IconStar className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">{questions.total + answers.total}</strong> total contributions
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                <IconTrophy className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">{user.prefs?.reputation || 0}</strong> reputation earned
                </span>
              </div>
            </div>
          </div>
        </div>
      </MagicCard>

      {/* Quick Tips */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-4 font-semibold text-white">Ways to earn reputation</h3>
        <ul className="grid gap-3 text-sm text-gray-400 md:grid-cols-2">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Answer questions to help others
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Get upvotes on your answers
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Ask thoughtful questions
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Participate in discussions
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Page
