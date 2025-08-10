import { answerCollection, db } from "@/models/name"
import { databases, users } from "@/models/server/config"
import { userPref } from "@/store/Auth"
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
    const prefs = await users.getPrefs<userPref>(authorId)
    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1,
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error creating answer",
      },
      {
        status: error?.status || error?.code || 500,
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
    const prefs = await users.getPrefs<userPref>(answer.authorId)
    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1,
    })

    return NextResponse.json({ data: response }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error deleting answer",
      },
      {
        status: error?.status || error?.code || 500,
      }
    )
  }
}
