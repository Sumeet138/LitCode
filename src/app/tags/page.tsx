import { db, questionCollection } from "@/models/name"
import { databases } from "@/models/server/config"
import { Particles } from "@/components/magicui/particles"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Query } from "node-appwrite"
import Link from "next/link"
import React from "react"
import { IconHash, IconTrendingUp, IconSearch } from "@tabler/icons-react"
import { ShimmerButton } from "@/components/magicui/shimmer-button"

interface TagInfo {
    name: string
    count: number
}

const TagsPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>
}) => {
    const { search } = await searchParams
    // Fetch all questions to extract tags
    const questions = await databases.listDocuments(db, questionCollection, [
        Query.limit(1000),
        Query.select(["tags"]),
    ])

    // Count tag occurrences
    const tagCounts: Record<string, number> = {}

    questions.documents.forEach((question) => {
        if (question.tags && Array.isArray(question.tags)) {
            question.tags.forEach((tag: string) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
        }
    })

    // Convert to array and sort by count
    let tags: TagInfo[] = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    // Filter by search if provided
    if (search) {
        const searchTerm = search.toLowerCase()
        tags = tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm))
    }

    const totalTags = Object.keys(tagCounts).length

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
                <div className="mb-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="mb-2 flex items-center gap-3 bg-gradient-to-r from-white via-orange-200 to-orange-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                                <IconHash className="h-10 w-10 text-orange-500" />
                                Tags
                            </h1>
                            <p className="max-w-2xl text-lg text-gray-400">
                                A tag is a keyword or label that categorizes your question with
                                other similar questions. Using the right tags makes it easier
                                for others to find and answer your question.
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

                {/* Stats Bar */}
                <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <IconTrendingUp className="h-5 w-5 text-orange-500" />
                        <span>
                            <strong className="text-white">{totalTags}</strong> tags available
                        </span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <form className="flex items-center gap-2" action="/tags" method="GET">
                            <div className="relative">
                                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Filter by tag name..."
                                    defaultValue={search || ""}
                                    className="w-48 rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 md:w-64"
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-lg bg-orange-500/20 px-4 py-2 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-500/30"
                            >
                                Filter
                            </button>
                        </form>
                    </div>
                </div>

                {tags.length === 0 ? (
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 py-20 text-center backdrop-blur-sm">
                        <BorderBeam size={400} duration={12} delay={5} />
                        <IconHash className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                        <p className="text-xl text-gray-400">
                            {search
                                ? `No tags found matching "${search}"`
                                : "No tags found yet."}
                        </p>
                        <p className="mt-2 text-gray-500">
                            {search
                                ? "Try a different search term."
                                : "Be the first to ask a question with tags!"}
                        </p>
                        {!search && (
                            <Link
                                href="/questions/ask"
                                className="mt-6 inline-block rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                            >
                                Ask a Question
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {tags.map((tag, index) => (
                            <Link
                                key={tag.name}
                                href={`/questions?tag=${encodeURIComponent(tag.name)}`}
                                className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 transition-all duration-300 hover:border-orange-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-orange-500/5"
                            >
                                {index < 3 && (
                                    <div className="absolute right-3 top-3">
                                        <span className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-2 py-0.5 text-xs font-medium text-white">
                                            Popular
                                        </span>
                                    </div>
                                )}
                                <div className="mb-3">
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500/20 px-3 py-1.5 text-sm font-medium text-orange-400 transition-all duration-300 group-hover:bg-orange-500/30 group-hover:text-orange-300">
                                        <IconHash className="h-3.5 w-3.5" />
                                        {tag.name}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    <span className="font-semibold text-white">{tag.count}</span>{" "}
                                    {tag.count === 1 ? "question" : "questions"}
                                </p>
                                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500 group-hover:opacity-100"
                                        style={{
                                            width: `${Math.min((tag.count / Math.max(...tags.map((t) => t.count))) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default TagsPage
