"use client"

import RTE from "@/components/RTE"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/Auth"
import { cn } from "@/lib/utils"
import slugify from "@/utils/slugify"
import { IconX, IconPhoto, IconTags, IconTextCaption, IconFileText, IconLoader2 } from "@tabler/icons-react"
import { ID } from "appwrite"
import { useRouter } from "next/navigation"
import React from "react"
import { databases, storage } from "@/models/client/config"
import { db, questionAttachmentBucket, questionCollection } from "@/models/name"
import confetti from "canvas-confetti"

const LabelInputContainer = ({
  children,
  className,
  icon: Icon,
  title,
  description,
}: {
  children: React.ReactNode
  className?: string
  icon?: React.ElementType
  title?: string
  description?: string
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col space-y-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6",
        className
      )}
    >
      <BorderBeam size={200} duration={12} delay={Math.random() * 10} />
      {Icon && title && (
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20">
            <Icon className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-medium text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-400">{description}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

type QuestionType = {
  $id: string
  title?: string
  content?: string
  authorId?: string
  tags?: string[]
  attachmentId?: string
}

const QuestionForm = ({ question }: { question?: QuestionType }) => {
  const { user } = useAuthStore()
  const [tag, setTag] = React.useState("")
  const router = useRouter()

  const [formData, setFormData] = React.useState({
    title: String(question?.title || ""),
    content: String(question?.content || ""),
    authorId: user?.$id,
    tags: new Set((question?.tags || []) as string[]),
    attachment: null as File | null,
  })

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS
    const colors = ["#ff7b00", "#ff2975", "#8c1eff", "#ffd319"]

    const frame = () => {
      if (Date.now() > end) return

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })

      requestAnimationFrame(frame)
    }

    frame()
  }

  const create = async () => {
    if (!formData.attachment) throw new Error("Please upload an image")

    const storageResponse = await storage.createFile(
      questionAttachmentBucket,
      ID.unique(),
      formData.attachment
    )

    const response = await databases.createDocument(
      db,
      questionCollection,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: storageResponse.$id,
      }
    )

    loadConfetti()

    return response
  }

  const update = async () => {
    if (!question) throw new Error("Please provide a question")

    const attachmentId = await (async () => {
      if (!formData.attachment) return question?.attachmentId as string

      await storage.deleteFile(questionAttachmentBucket, question.attachmentId!)

      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment
      )

      return file.$id
    })()

    const response = await databases.updateDocument(
      db,
      questionCollection,
      question.$id,
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: attachmentId,
      }
    )

    return response
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.authorId) {
      setError(() => "Please fill out all fields")
      return
    }

    setLoading(() => true)
    setError(() => "")

    try {
      const response = question ? await update() : await create()

      router.push(`/questions/${response.$id}/${slugify(formData.title)}`)
    } catch (error: any) {
      setError(() => error.message)
    }

    setLoading(() => false)
  }

  return (
    <form className="space-y-6" onSubmit={submit}>
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          <IconX className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <LabelInputContainer
        icon={IconTextCaption}
        title="Question Title"
        description="Be specific and imagine you're asking a question to another person."
      >
        <Input
          id="title"
          name="title"
          placeholder="e.g. How to center a div in CSS?"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-orange-500/50"
        />
      </LabelInputContainer>

      <LabelInputContainer
        icon={IconFileText}
        title="Question Details"
        description="Introduce the problem and expand on what you put in the title. Minimum 20 characters."
      >
        <RTE
          value={formData.content}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, content: value || "" }))
          }
        />
      </LabelInputContainer>

      <LabelInputContainer
        icon={IconPhoto}
        title="Attachment (Required)"
        description="Add an image to make your question clearer and easier to understand."
      >
        <div className="flex items-center gap-4">
          <label
            htmlFor="image"
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <IconPhoto className="h-5 w-5" />
            {formData.attachment ? formData.attachment.name : "Choose an image..."}
          </label>
          <input
            id="image"
            name="image"
            accept="image/*"
            type="file"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files
              if (!files || files.length === 0) return
              setFormData((prev) => ({
                ...prev,
                attachment: files[0],
              }))
            }}
          />
          {formData.attachment && (
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, attachment: null }))}
              className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
            >
              <IconX className="h-4 w-4" />
            </button>
          )}
        </div>
      </LabelInputContainer>

      <LabelInputContainer
        icon={IconTags}
        title="Tags"
        description="Add tags to describe what your question is about. Press Enter or click Add to add a tag."
      >
        <div className="flex w-full gap-3">
          <Input
            id="tag"
            name="tag"
            placeholder="e.g. javascript, react, css"
            type="text"
            value={tag}
            onChange={(e) => setTag(() => e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                if (tag.length === 0) return
                setFormData((prev) => ({
                  ...prev,
                  tags: new Set([...Array.from(prev.tags), tag]),
                }))
                setTag("")
              }
            }}
            className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-orange-500/50"
          />
          <button
            className="shrink-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-pink-500/20 px-6 py-2 font-medium text-orange-400 transition-all duration-300 hover:from-orange-500/30 hover:to-pink-500/30"
            type="button"
            onClick={() => {
              if (tag.length === 0) return
              setFormData((prev) => ({
                ...prev,
                tags: new Set([...Array.from(prev.tags), tag]),
              }))
              setTag("")
            }}
          >
            Add
          </button>
        </div>
        {formData.tags.size > 0 && (
          <div className="flex flex-wrap gap-2">
            {Array.from(formData.tags).map((tagItem, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 rounded-lg bg-orange-500/20 px-3 py-1.5 text-sm font-medium text-orange-400"
              >
                <span>#{tagItem}</span>
                <button
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      tags: new Set(
                        Array.from(prev.tags).filter((t) => t !== tagItem)
                      ),
                    }))
                  }}
                  type="button"
                  className="opacity-60 transition-opacity hover:opacity-100"
                >
                  <IconX size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </LabelInputContainer>

      <button
        className="flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <IconLoader2 className="h-6 w-6 animate-spin" />
        ) : question ? (
          "Update Question"
        ) : (
          "Publish Question"
        )}
      </button>
    </form>
  )
}

export default QuestionForm
