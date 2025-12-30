"use client"

import React from "react"
import { BorderBeam } from "./magicui/border-beam"
import Link from "next/link"
import { Models } from "appwrite"
import slugify from "@/utils/slugify"
import { avatars } from "@/models/client/config"
import convertDateToRelativeTime from "@/utils/relativeTime"
import { IconArrowUp, IconMessage, IconClock } from "@tabler/icons-react"

type QuestionDocument = Models.Document & {
  totalVotes?: number
  totalAnswers?: number
  tags?: string[]
  title?: string
  author?: {
    name: string
    $id: string
    reputation: number
  }
  $createdAt?: string
}

const QuestionCard = ({ ques }: { ques: QuestionDocument }) => {
  const [height, setHeight] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }, [ref])

  return (
    <div
      ref={ref}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 transition-all duration-300 hover:border-orange-500/30 hover:bg-white/10 sm:flex-row"
    >
      <BorderBeam size={height} duration={12} delay={9} />

      {/* Stats Column */}
      <div className="relative flex shrink-0 gap-4 text-sm sm:flex-col sm:gap-2 sm:text-right">
        <div className="flex items-center gap-1 sm:justify-end">
          <IconArrowUp className="h-4 w-4 text-orange-500" />
          <span className="font-medium text-white">{ques.totalVotes || 0}</span>
          <span className="text-gray-500">votes</span>
        </div>
        <div className={`flex items-center gap-1 sm:justify-end ${(ques.totalAnswers || 0) > 0 ? "text-green-400" : ""}`}>
          <IconMessage className="h-4 w-4" />
          <span className="font-medium">{ques.totalAnswers || 0}</span>
          <span className={`${(ques.totalAnswers || 0) > 0 ? "text-green-400/70" : "text-gray-500"}`}>answers</span>
        </div>
      </div>

      {/* Content Column */}
      <div className="relative flex-1">
        <Link
          href={`/questions/${ques.$id}/${slugify(ques.title || "Untitled Question")}`}
          className="block"
        >
          <h2 className="text-lg font-medium text-orange-400 transition-colors group-hover:text-orange-300">
            {ques.title}
          </h2>
        </Link>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ques.tags?.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-flex items-center gap-1 rounded-lg bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400 transition-colors hover:bg-orange-500/20"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Meta Row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <div className="ml-auto flex items-center gap-2">
            <picture>
              <img
                src={avatars.getInitials(ques.author?.name || "Anonymous", 24, 24)}
                alt={ques.author?.name || "Anonymous"}
                className="rounded-lg"
              />
            </picture>
            <Link
              href={`/users/${ques.author?.$id}/${slugify(ques.author?.name || "user")}`}
              className="font-medium text-orange-400 transition-colors hover:text-orange-300"
            >
              {ques.author?.name}
            </Link>
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-gray-500">
              {ques.author?.reputation || 0} rep
            </span>
          </div>
          <span className="flex items-center gap-1 text-gray-500">
            <IconClock className="h-3.5 w-3.5" />
            {convertDateToRelativeTime(new Date(ques.$createdAt || ""))}
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
