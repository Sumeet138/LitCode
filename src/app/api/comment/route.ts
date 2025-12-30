import { commentCollection, db } from "@/models/name"
import { databases } from "@/models/server/config"
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"

export async function POST(request: NextRequest) {
    try {
        const { content, authorId, type, typeId } = await request.json()

        if (!content || !authorId || !type || !typeId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        if (!["question", "answer"].includes(type)) {
            return NextResponse.json(
                { error: "Invalid type. Must be 'question' or 'answer'" },
                { status: 400 }
            )
        }

        const response = await databases.createDocument(
            db,
            commentCollection,
            ID.unique(),
            {
                content,
                authorId,
                type,
                typeId,
            }
        )

        return NextResponse.json(response, { status: 201 })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error creating comment"
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
        const { commentId } = await request.json()

        if (!commentId) {
            return NextResponse.json(
                { error: "Missing commentId" },
                { status: 400 }
            )
        }

        const response = await databases.deleteDocument(
            db,
            commentCollection,
            commentId
        )

        return NextResponse.json({ data: response }, { status: 200 })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error deleting comment"
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
