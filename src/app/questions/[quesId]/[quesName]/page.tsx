import Answers, { AnswerDocument } from "@/components/Answers"
import Comments, { CommentDocument } from "@/components/Comments"
import { Models } from "appwrite"
import { MarkdownPreview } from "@/components/RTE"
import VoteButtons from "@/components/VoteButtons"
import { Particles } from "@/components/magicui/particles"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { BorderBeam } from "@/components/magicui/border-beam"
import { avatars } from "@/models/client/config"
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
  commentCollection,
  questionAttachmentBucket,
} from "@/models/name"
import { databases, users } from "@/models/server/config"
import { storage } from "@/models/client/config"
import { UserPrefs } from "@/store/Auth"
import convertDateToRelativeTime from "@/utils/relativeTime"
import slugify from "@/utils/slugify"
import { IconClock, IconMessage, IconArrowUp, IconHash } from "@tabler/icons-react"
import Link from "next/link"
import { Query } from "node-appwrite"
import React from "react"
import DeleteQuestion from "./DeleteQuestion"
import EditQuestion from "./EditQuestion"
import { TracingBeam } from "@/components/ui/tracing-beam"

const Page = async ({
  params,
}: {
  params: Promise<{ quesId: string; quesName: string }>
}) => {
  const { quesId } = await params
  const [question, answers, upvotes, downvotes, comments] = await Promise.all([
    databases.getDocument(db, questionCollection, quesId),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("questionId", quesId),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal("type", "question"),
      Query.equal("typeId", quesId),
      Query.orderDesc("$createdAt"),
    ]),
  ])

  const author = await users.get<UserPrefs>(question.authorId)
    ;[comments.documents, answers.documents] = await Promise.all([
      Promise.all(
        comments.documents.map(async (comment) => {
          const author = await users.get<UserPrefs>(comment.authorId)
          return {
            ...comment,
            author: {
              $id: author.$id,
              name: author.name,
              reputation: author.prefs.reputation,
            },
          }
        })
      ),
      Promise.all(
        answers.documents.map(async (answer) => {
          const [author, comments, upvotes, downvotes] = await Promise.all([
            users.get<UserPrefs>(answer.authorId),
            databases.listDocuments(db, commentCollection, [
              Query.equal("typeId", answer.$id),
              Query.equal("type", "answer"),
              Query.orderDesc("$createdAt"),
            ]),
            databases.listDocuments(db, voteCollection, [
              Query.equal("typeId", answer.$id),
              Query.equal("type", "answer"),
              Query.equal("voteStatus", "upvoted"),
              Query.limit(1),
            ]),
            databases.listDocuments(db, voteCollection, [
              Query.equal("typeId", answer.$id),
              Query.equal("type", "answer"),
              Query.equal("voteStatus", "downvoted"),
              Query.limit(1),
            ]),
          ])

          comments.documents = await Promise.all(
            comments.documents.map(async (comment) => {
              const author = await users.get<UserPrefs>(comment.authorId)
              return {
                ...comment,
                author: {
                  $id: author.$id,
                  name: author.name,
                  reputation: author.prefs.reputation,
                },
              }
            })
          )

          return {
            ...answer,
            comments,
            upvotesDocuments: upvotes,
            downvotesDocuments: downvotes,
            author: {
              $id: author.$id,
              name: author.name,
              reputation: author.prefs.reputation,
            },
          }
        })
      ),
    ])

  return (
    <TracingBeam className="container pl-6">
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={300}
        ease={100}
        color="#ffffff"
        refresh
      />
      <div className="relative mx-auto px-4 pb-20 pt-36">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h1 className="mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent">
              {question.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <IconClock className="h-4 w-4 text-orange-500" />
                Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
              </span>
              <span className="flex items-center gap-1">
                <IconMessage className="h-4 w-4 text-blue-500" />
                {answers.total} {answers.total === 1 ? "answer" : "answers"}
              </span>
              <span className="flex items-center gap-1">
                <IconArrowUp className="h-4 w-4 text-green-500" />
                {upvotes.total + downvotes.total} votes
              </span>
            </div>
          </div>
          <Link href="/questions/ask" className="shrink-0">
            <ShimmerButton className="shadow-2xl">
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                Ask a Question
              </span>
            </ShimmerButton>
          </Link>
        </div>

        <hr className="mb-6 border-white/10" />

        {/* Question Content */}
        <div className="flex gap-6">
          {/* Vote and Actions Column */}
          <div className="hidden shrink-0 flex-col items-center gap-4 sm:flex">
            <VoteButtons
              type="question"
              id={question.$id}
              className="w-full"
              upvotes={upvotes}
              downvotes={downvotes}
            />
            <EditQuestion
              questionId={question.$id}
              questionTitle={question.title}
              authorId={question.authorId}
            />
            <DeleteQuestion
              questionId={question.$id}
              authorId={question.authorId}
            />
          </div>

          {/* Main Content */}
          <div className="w-full overflow-hidden">
            {/* Question Body */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6">
              <BorderBeam size={400} duration={12} delay={5} />
              <MarkdownPreview
                className="rounded-xl !bg-transparent"
                source={question.content}
              />

              {/* Attachment */}
              {question.attachmentId && (
                <div className="mt-4">
                  <picture>
                    <img
                      src={
                        storage.getFilePreview(
                          questionAttachmentBucket,
                          question.attachmentId
                        ).toString()
                      }
                      alt={question.title}
                      className="max-h-96 rounded-xl border border-white/10 object-contain"
                    />
                  </picture>
                </div>
              )}

              {/* Tags */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {question.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/questions?tag=${tag}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-orange-500/20 px-3 py-1.5 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/30"
                  >
                    <IconHash className="h-3.5 w-3.5" />
                    {tag}
                  </Link>
                ))}
              </div>

              {/* Author Info */}
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                {/* Mobile Vote/Edit/Delete buttons */}
                <div className="flex items-center gap-2 sm:hidden">
                  <VoteButtons
                    type="question"
                    id={question.$id}
                    className="w-auto"
                    upvotes={upvotes}
                    downvotes={downvotes}
                  />
                  <EditQuestion
                    questionId={question.$id}
                    questionTitle={question.title}
                    authorId={question.authorId}
                  />
                  <DeleteQuestion
                    questionId={question.$id}
                    authorId={question.authorId}
                  />
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <div className="text-right">
                    <Link
                      href={`/users/${author.$id}/${slugify(author.name)}`}
                      className="font-medium text-orange-400 transition-colors hover:text-orange-300"
                    >
                      {author.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {author.prefs.reputation} reputation
                    </p>
                  </div>
                  <picture>
                    <img
                      src={avatars.getInitials(author.name, 48, 48).toString()}
                      alt={author.name}
                      className="rounded-xl ring-2 ring-white/10"
                    />
                  </picture>
                </div>
              </div>
            </div>

            {/* Comments */}
            <Comments
              comments={comments as unknown as Models.DocumentList<CommentDocument>}
              className="mt-6"
              type="question"
              typeId={question.$id}
            />
          </div>
        </div>

        {/* Answers Section */}
        <div className="mt-10">
          <Answers answers={answers as unknown as Models.DocumentList<AnswerDocument>} questionId={question.$id} />
        </div>
      </div>
    </TracingBeam>
  )
}

export default Page
