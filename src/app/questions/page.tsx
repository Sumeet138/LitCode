import { databases, users } from "@/models/server/config"
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
} from "@/models/name"
import { Query } from "node-appwrite"
import React from "react"
import Link from "next/link"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import QuestionCard from "@/components/QuestionCard"
import { UserPrefs } from "@/store/Auth"
import Pagination from "@/components/Pagination"
import Search from "./Search"
import { Particles } from "@/components/magicui/particles"
import { IconMessageQuestion, IconFilter, IconX } from "@tabler/icons-react"

const Page = async ({
  searchParams,
}: {
  searchParams: { page?: string; tag?: string; search?: string }
}) => {
  searchParams.page ||= "1"

  const queries = [
    Query.orderDesc("$createdAt"),
    Query.offset((+searchParams.page - 1) * 25),
    Query.limit(25),
  ]

  if (searchParams.tag) queries.push(Query.equal("tags", searchParams.tag))
  if (searchParams.search)
    queries.push(
      Query.or([
        Query.search("title", searchParams.search),
        Query.search("content", searchParams.search),
      ])
    )

  const questions = await databases.listDocuments(
    db,
    questionCollection,
    queries
  )

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.limit(1),
        ]),
      ])

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
        },
      }
    })
  )

  return (
    <>
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={200}
        ease={100}
        color="#ffffff"
        refresh
      />
      <div className="container relative mx-auto px-4 pb-20 pt-36">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="mb-2 flex items-center gap-3 bg-gradient-to-r from-white via-orange-200 to-orange-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                <IconMessageQuestion className="h-10 w-10 text-orange-500" />
                All Questions
              </h1>
              <p className="text-lg text-gray-400">
                Browse questions from the community or ask your own
              </p>
            </div>
            <div className="shrink-0">
              <Link href="/questions/ask">
                <ShimmerButton className="shadow-2xl">
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                    Ask a Question
                  </span>
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <Search />

          {/* Active Filters */}
          {(searchParams.tag || searchParams.search) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <IconFilter className="h-4 w-4" />
                Active filters:
              </span>
              {searchParams.tag && (
                <Link
                  href={searchParams.search ? `/questions?search=${searchParams.search}` : "/questions"}
                  className="group flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-sm text-orange-400 transition-colors hover:bg-orange-500/30"
                >
                  Tag: #{searchParams.tag}
                  <IconX className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Link>
              )}
              {searchParams.search && (
                <Link
                  href={searchParams.tag ? `/questions?tag=${searchParams.tag}` : "/questions"}
                  className="group flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400 transition-colors hover:bg-blue-500/30"
                >
                  Search: &quot;{searchParams.search}&quot;
                  <IconX className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Link>
              )}
              <Link
                href="/questions"
                className="text-sm text-gray-500 hover:text-white"
              >
                Clear all
              </Link>
            </div>
          )}
        </div>

        {/* Results Stats */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
          <p className="text-gray-400">
            <strong className="text-white">{questions.total}</strong>{" "}
            {questions.total === 1 ? "question" : "questions"} found
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Page {searchParams.page} of {Math.ceil(questions.total / 25) || 1}
          </div>
        </div>

        {/* Questions List */}
        {questions.documents.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
            <IconMessageQuestion className="mx-auto mb-4 h-16 w-16 text-gray-600" />
            <p className="text-xl text-gray-400">No questions found</p>
            <p className="mt-2 text-gray-500">
              {searchParams.search || searchParams.tag
                ? "Try different search terms or filters"
                : "Be the first to ask a question!"}
            </p>
            <Link
              href="/questions/ask"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
            >
              Ask a Question
            </Link>
          </div>
        ) : (
          <div className="mb-8 max-w-4xl space-y-4">
            {questions.documents.map((ques) => (
              <QuestionCard key={ques.$id} ques={ques} />
            ))}
          </div>
        )}

        <Pagination total={questions.total} limit={25} />
      </div>
    </>
  )
}

export default Page
