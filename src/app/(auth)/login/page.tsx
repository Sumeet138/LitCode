"use client"
import { useAuthStore } from "@/store/Auth"
import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { IconBrandGithub, IconBrandGoogle, IconCode, IconLock, IconMail } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Particles } from "@/components/magicui/particles"
import { BorderBeam } from "@/components/magicui/border-beam"

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  )
}

function LoginPage() {
  const { login, user, hydrated } = useAuthStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const router = useRouter()

  React.useEffect(() => {
    if (hydrated && user) {
      router.push("/")
    }
  }, [hydrated, user, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      setError(() => "All fields are required")
      return
    }

    setIsLoading(() => true)
    setError(() => "")

    const loginResponse = await login(email.toString(), password.toString())
    if (loginResponse.error) {
      setError(() => loginResponse.error!.message)
    } else {
      router.push("/")
    }
    setIsLoading(() => false)
  }

  return (
    <>
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={200}
        ease={100}
        color="#ffffff"
        refresh
      />
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 shadow-2xl backdrop-blur-sm">
        <BorderBeam size={300} duration={12} delay={5} />

        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500">
            <IconCode className="h-8 w-8 text-white" />
          </div>
          <h2 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold text-transparent">
            Welcome back to LitCode
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to continue asking questions and sharing knowledge
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <Label htmlFor="email" className="flex items-center gap-2 text-gray-300">
              <IconMail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-orange-500/50 focus:ring-orange-500/50"
              id="email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="password" className="flex items-center gap-2 text-gray-300">
              <IconLock className="h-4 w-4" />
              Password
            </Label>
            <Input
              className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-orange-500/50 focus:ring-orange-500/50"
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
            />
          </LabelInputContainer>

          <button
            className="group/btn relative flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                Sign in
                <BottomGradient />
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="group/btn relative flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 font-medium text-white transition-all duration-300 hover:bg-white/10"
              type="button"
              disabled={isLoading}
            >
              <IconBrandGoogle className="h-5 w-5" />
              Google
              <BottomGradient />
            </button>
            <button
              className="group/btn relative flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 font-medium text-white transition-all duration-300 hover:bg-white/10"
              type="button"
              disabled={isLoading}
            >
              <IconBrandGithub className="h-5 w-5" />
              GitHub
              <BottomGradient />
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-orange-500 transition-colors hover:text-orange-400"
          >
            Create one now
          </Link>
        </p>
      </div>
    </>
  )
}

export default LoginPage
