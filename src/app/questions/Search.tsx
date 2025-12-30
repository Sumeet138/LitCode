"use client"

import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { IconSearch, IconLoader2 } from "@tabler/icons-react"

const Search = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = React.useState(searchParams.get("search") || "")
  const [isSearching, setIsSearching] = React.useState(false)

  React.useEffect(() => {
    setSearch(() => searchParams.get("search") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSearching(true)
    const newSearchParams = new URLSearchParams(searchParams)
    if (search.trim()) {
      newSearchParams.set("search", search)
    } else {
      newSearchParams.delete("search")
    }
    newSearchParams.delete("page") // Reset to first page on new search
    router.push(`${pathname}?${newSearchParams}`)
    setTimeout(() => setIsSearching(false), 500)
  }

  return (
    <form className="flex w-full gap-3" onSubmit={handleSearch}>
      <div className="relative flex-1">
        <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Search questions by title or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder-gray-500 focus:border-orange-500/50 focus:ring-orange-500/50"
        />
      </div>
      <button
        type="submit"
        disabled={isSearching}
        className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
      >
        {isSearching ? (
          <IconLoader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <IconSearch className="h-5 w-5" />
            <span className="hidden sm:inline">Search</span>
          </>
        )}
      </button>
    </form>
  )
}

export default Search
