"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

const Pagination = ({
  className,
  total,
  limit,
}: {
  className?: string
  limit: number
  total: number
}) => {
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get("page") || "1")
  const totalPages = Math.ceil(total / limit) || 1
  const router = useRouter()
  const pathname = usePathname()

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("page", `${pageNumber}`)
    router.push(`${pathname}?${newSearchParams}`)
  }

  const prev = () => goToPage(page - 1)
  const next = () => goToPage(page + 1)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)

      if (page > 3) pages.push("...")

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      for (let i = start; i <= end; i++) pages.push(i)

      if (page < totalPages - 2) pages.push("...")

      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        className="flex h-10 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={prev}
        disabled={page <= 1}
      >
        <IconChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageNum, index) =>
          pageNum === "..." ? (
            <span key={`dots-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum as number)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ${page === pageNum
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                  : "border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              {pageNum}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        className="flex h-10 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={next}
        disabled={page >= totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <IconChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Pagination
