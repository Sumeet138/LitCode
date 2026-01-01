import React from "react"
import Link from "next/link"
import { IconBrandGithub, IconBrandTwitter, IconBrandDiscord, IconCode, IconHeart } from "@tabler/icons-react"

const Footer = () => {
  const socialLinks = [
    { icon: IconBrandGithub, href: "https://github.com/Sumeet138", label: "GitHub" },
    { icon: IconBrandTwitter, href: "https://x.com/SumitGond28", label: "Twitter" },
    { icon: IconBrandDiscord, href: "https://discord.com", label: "Discord" },
  ]

  const columns = [
    {
      title: "Platform",
      links: [
        { label: "Questions", href: "/questions" },
        { label: "Tags", href: "/tags" },
        { label: "Users", href: "/users" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Rules", href: "/rules" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
        { label: "Cookie Policy", href: "/cookie-policy" },
      ],
    },
  ]

  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Brand Section - Left Aligned */}
          <div className="flex max-w-sm flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
                <IconCode className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold text-transparent">
                LitCode
              </span>
            </Link>
            <p className="text-gray-400">
              A community-driven platform for developers to ask questions, share knowledge, and collaborate.
              Join us in building the future of software development.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-500"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section - Right Aligned (Grid on mobile, Flex on desktop) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-16">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <h3 className="font-semibold text-white">{column.title}</h3>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 transition-colors hover:text-orange-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LitCode. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            Made with <IconHeart className="h-4 w-4 text-red-500" /> by developers
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
