import HeroSectionHeader from "./components/HeroSectionHeader"
import LatestQuestions from "./components/LatestQuestions"
import TopContributers from "./components/TopContributers"
import Link from "next/link"
import { IconArrowRight, IconMessageQuestion, IconTrophy, IconCode, IconUsers } from "@tabler/icons-react"

const features = [
  {
    icon: IconMessageQuestion,
    title: "Ask Questions",
    description: "Get expert answers to your programming challenges",
    gradient: "from-orange-500 to-pink-500",
  },
  {
    icon: IconCode,
    title: "Share Knowledge",
    description: "Help others by answering their questions",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: IconTrophy,
    title: "Build Reputation",
    description: "Earn recognition for your contributions",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: IconUsers,
    title: "Join Community",
    description: "Connect with developers worldwide",
    gradient: "from-green-500 to-emerald-500",
  },
]

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen py-20">
        <HeroSectionHeader />
      </section>

      {/* Features Section */}
      <section className="relative border-t border-white/10 bg-black/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Why Choose LitCode?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              A modern platform designed for developers who want to learn, share, and grow together
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Questions & Top Contributors */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col-reverse gap-10 lg:flex-row">
          {/* Latest Questions */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="flex items-center gap-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                <IconMessageQuestion className="h-8 w-8 text-orange-500" />
                Latest Questions
              </h2>
              <Link
                href="/questions"
                className="group flex items-center gap-1 text-sm font-medium text-orange-500 transition-colors hover:text-orange-400"
              >
                View all
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <LatestQuestions />
          </div>

          {/* Top Contributors */}
          <div className="lg:w-80 xl:w-96">
            <div className="mb-8">
              <h2 className="flex items-center gap-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                <IconTrophy className="h-8 w-8 text-orange-500" />
                Top Contributors
              </h2>
            </div>
            <TopContributers />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 bg-gradient-to-b from-black to-orange-950/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-gray-400">
            Join thousands of developers who are already using LitCode to solve problems and share knowledge.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
            >
              Create Free Account
            </Link>
            <Link
              href="/questions"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3 font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              Browse Questions
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
