"use client"

import QuestionForm from "@/components/QuestionForm"
import { Particles } from "@/components/magicui/particles"
import { BorderBeam } from "@/components/magicui/border-beam"
import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation"
import React from "react"
import { IconBulb, IconCode, IconTags, IconPhoto, IconCheck } from "@tabler/icons-react"

const tips = [
    {
        icon: IconBulb,
        title: "Summarize your problem",
        description: "Write a clear, one-line title that describes your issue.",
    },
    {
        icon: IconCode,
        title: "Describe in detail",
        description: "Explain what you tried, include code snippets if needed.",
    },
    {
        icon: IconPhoto,
        title: "Add visuals",
        description: "Include screenshots or images to clarify your problem.",
    },
    {
        icon: IconTags,
        title: "Use relevant tags",
        description: "Add tags to help others find and answer your question.",
    },
    {
        icon: IconCheck,
        title: "Review before posting",
        description: "Check spelling and formatting before you publish.",
    },
]

const AskQuestionPage = () => {
    const { user, hydrated } = useAuthStore()
    const router = useRouter()

    React.useEffect(() => {
        if (hydrated && !user) {
            router.push("/login")
        }
    }, [hydrated, user, router])

    if (!hydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <>
            <Particles
                className="fixed inset-0 h-full w-full"
                quantity={300}
                ease={100}
                color="#ffffff"
                refresh
            />
            <div className="relative block pb-20 pt-32">
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <div className="mb-10">
                        <h1 className="mb-2 bg-gradient-to-r from-white via-orange-200 to-orange-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                            Ask a public question
                        </h1>
                        <p className="max-w-2xl text-lg text-gray-400">
                            Get answers from the community by asking a clear, detailed
                            question. The more context you provide, the better answers
                            you'll receive.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-8 lg:flex-row-reverse">
                        {/* Tips Sidebar */}
                        <div className="w-full lg:w-1/3">
                            <div className="sticky top-28">
                                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-sm">
                                    <BorderBeam size={300} duration={10} delay={5} />
                                    <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-orange-500">
                                        <IconBulb className="h-5 w-5" />
                                        Writing a good question
                                    </h2>
                                    <div className="space-y-4">
                                        {tips.map((tip, index) => (
                                            <div
                                                key={index}
                                                className="group flex gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-white/5"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-500/20 text-orange-500 transition-all duration-300 group-hover:from-orange-500/30 group-hover:to-pink-500/30">
                                                    <tip.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-white">
                                                        {tip.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        {tip.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Community Stats */}
                                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                                    <h3 className="mb-4 font-semibold text-white">
                                        Why ask on LitCode?
                                    </h3>
                                    <ul className="space-y-3 text-sm text-gray-400">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                            Get answers from experienced developers
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            Build your reputation in the community
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                            Help others facing similar issues
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                            Learn best practices from the community
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Question Form */}
                        <div className="w-full lg:w-2/3">
                            <QuestionForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AskQuestionPage
