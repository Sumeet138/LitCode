import { answerCollection, db } from "@/models/name"
import { databases, users } from "@/models/server/config"
import { UserPrefs } from "@/store/Auth"
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json()

    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content: answer,
        authorId: authorId,
        questionId: questionId,
      }
    )
    //Increse author reputation
    const prefs = await users.getPrefs<UserPrefs>(authorId)
    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1,
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error creating answer"
    const errorCode = (error as { status?: number; code?: number })?.status || (error as { status?: number; code?: number })?.code || 500
    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: errorCode,
      }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json()

    const answer = await databases.getDocument(db, answerCollection, answerId)
    const response = await databases.deleteDocument(
      db,
      answerCollection,
      answerId
    )

    //Decrease author reputation
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId)
    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1,
    })

    return NextResponse.json({ data: response }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error deleting answer"
    const errorCode = (error as { status?: number; code?: number })?.status || (error as { status?: number; code?: number })?.code || 500
    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: errorCode,
      }
    )
  }
}
