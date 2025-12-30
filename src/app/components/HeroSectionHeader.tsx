"use client"

import React from "react"
import { RetroGrid } from "@/components/magicui/retro-grid"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { IconArrowRight, IconBrandGithub, IconSearch } from "@tabler/icons-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function HeroSectionHeader() {
  const router = useRouter()
  const [search, setSearch] = React.useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/questions?search=${encodeURIComponent(search)}`)
    }
  }

  return (
    <div className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="z-10 flex w-full max-w-5xl flex-col items-center gap-8 px-4 text-center md:gap-12">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white/5 px-3 py-1 text-sm text-neutral-500 backdrop-blur-sm dark:border-white/10 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Live Community
          </span>
          <span className="mx-2 h-4 w-[1px] bg-neutral-200 dark:bg-white/10"></span>
          <span className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white">
            v1.0 Launched <IconArrowRight className="h-3 w-3" />
          </span>
        </div>

        {/* Hero Title */}
        <div className="flex flex-col gap-4">
          <h1 className="animate-fade-in whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent sm:text-8xl">
            LitCode
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-500 line-clamp-2 dark:text-neutral-400 sm:text-xl">
            Ask questions, share knowledge, and collaborate with developers worldwide.
            Join our community to enhance your coding skills and build your reputation.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex w-full max-w-lg flex-col gap-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search for solutions..."
                className="h-12 w-full rounded-full border-neutral-200 bg-white/50 pl-10 pr-4 backdrop-blur-xl transition-all focus:border-orange-500 focus:ring-orange-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/questions/ask">
              <ShimmerButton className="h-12 px-8 shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Ask a Question
                </span>
              </ShimmerButton>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 items-center gap-2 rounded-full border border-neutral-200 bg-white px-8 text-neutral-900 transition-all hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <IconBrandGithub className="h-5 w-5" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <RetroGrid opacity={0.5} />
    </div>
  )
}
