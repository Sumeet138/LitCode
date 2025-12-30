"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import React from "react"
import { IconUser, IconMessageQuestion, IconMessage, IconThumbUp } from "@tabler/icons-react"

const navItems = [
  { name: "Summary", path: "", icon: IconUser },
  { name: "Questions", path: "/questions", icon: IconMessageQuestion },
  { name: "Answers", path: "/answers", icon: IconMessage },
  { name: "Votes", path: "/votes", icon: IconThumbUp },
]

const Navbar = () => {
  const { userId, userSlug } = useParams()
  const pathname = usePathname()
  const basePath = `/users/${userId}/${userSlug}`

  return (
    <nav className="w-full shrink-0 lg:w-48">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
        <ul className="flex gap-1 overflow-auto lg:flex-col">
          {navItems.map((item) => {
            const href = `${basePath}${item.path}`
            const isActive = pathname === href
            const Icon = item.icon

            return (
              <li key={item.name}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-orange-500" : ""}`} />
                  <span className="whitespace-nowrap">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-orange-500" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
