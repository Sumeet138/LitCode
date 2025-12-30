import { db, questionCollection } from "@/models/name"
import { databases } from "@/models/server/config"
import React from "react"
import EditQues, { QuestionDocument } from "./EditQues"

const Page = async ({
  params,
}: {
  params: Promise<{ quesId: string; quesName: string }>
}) => {
  const { quesId } = await params
  const question = await databases.getDocument(
    db,
    questionCollection,
    quesId
  )

  return <EditQues question={question as unknown as QuestionDocument} />
}

export default Page
