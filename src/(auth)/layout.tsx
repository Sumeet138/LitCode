"use client"
import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/router"
import { useEffect } from "react"

const layout = ({ childern }: { childern: React.ReactNode }) => {
  //to Check whether there is session or not
  const { session } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/")
    }
  }, [session, router])
  if (session) {
    return null
  }

  return (
    <div className="">
      <div className="">{childern}</div>
    </div>
  )
}

export default layout
