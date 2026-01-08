"use client"
import React from "react"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { IconHome, IconWorldQuestion, IconTags } from "@tabler/icons-react"
import { useAuthStore } from "@/store/Auth"

export default function Header() {
  const { user, hydrated } = useAuthStore()

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Questions",
      link: "/questions",
      icon: (
        <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: "Tags",
      link: "/tags",
      icon: <IconTags className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ]

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} user={user} hydrated={hydrated} />
    </div>
  )
}
