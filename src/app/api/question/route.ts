import {
    answerCollection,
    commentCollection,
    db,
    questionAttachmentBucket,
    questionCollection,
    voteCollection,
} from "@/models/name"
import { databases, storage } from "@/models/server/config"
import { NextRequest, NextResponse } from "next/server"
import { ID, Query } from "node-appwrite"

export async function POST(request: NextRequest) {
    try {
        const { title, content, authorId, tags, attachmentId } = await request.json()

        if (!title || !content || !authorId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const response = await databases.createDocument(
            db,
            questionCollection,
            ID.unique(),
            {
                title,
                content,
                authorId,
                tags: tags || [],
                attachmentId: attachmentId || null,
            }
        )

        return NextResponse.json(response, { status: 201 })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error creating question"
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
        const { questionId, authorId } = await request.json()

        if (!questionId) {
            return NextResponse.json(
                { error: "Missing questionId" },
                { status: 400 }
            )
        }

        // Get the question to verify ownership and get attachment
        const question = await databases.getDocument(db, questionCollection, questionId)

        // Verify the user is the author
        if (authorId && question.authorId !== authorId) {
            return NextResponse.json(
                { error: "You are not authorized to delete this question" },
                { status: 403 }
            )
        }

        // Delete all related data in parallel
        // 1. Delete all answers and their related comments/votes
        const answers = await databases.listDocuments(db, answerCollection, [
            Query.equal("questionId", questionId),
        ])

        await Promise.all(
            answers.documents.map(async (answer) => {
                // Delete votes for this answer
                const answerVotes = await databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "answer"),
                    Query.equal("typeId", answer.$id),
                ])
                await Promise.all(
                    answerVotes.documents.map((vote) =>
                        databases.deleteDocument(db, voteCollection, vote.$id)
                    )
                )

                // Delete comments for this answer
                const answerComments = await databases.listDocuments(db, commentCollection, [
                    Query.equal("type", "answer"),
                    Query.equal("typeId", answer.$id),
                ])
                await Promise.all(
                    answerComments.documents.map((comment) =>
                        databases.deleteDocument(db, commentCollection, comment.$id)
                    )
                )

                // Delete the answer
                await databases.deleteDocument(db, answerCollection, answer.$id)
            })
        )

        // 2. Delete votes for this question
        const questionVotes = await databases.listDocuments(db, voteCollection, [
            Query.equal("type", "question"),
            Query.equal("typeId", questionId),
        ])
        await Promise.all(
            questionVotes.documents.map((vote) =>
                databases.deleteDocument(db, voteCollection, vote.$id)
            )
        )

        // 3. Delete comments for this question
        const questionComments = await databases.listDocuments(db, commentCollection, [
            Query.equal("type", "question"),
            Query.equal("typeId", questionId),
        ])
        await Promise.all(
            questionComments.documents.map((comment) =>
                databases.deleteDocument(db, commentCollection, comment.$id)
            )
        )

        // 4. Delete attachment if exists
        if (question.attachmentId) {
            try {
                await storage.deleteFile(questionAttachmentBucket, question.attachmentId)
            } catch (error) {
                // Attachment might not exist, continue anyway
                console.log("Error deleting attachment:", error)
            }
        }

        // 5. Finally delete the question
        const response = await databases.deleteDocument(db, questionCollection, questionId)

        return NextResponse.json(
            { data: response, message: "Question and all related data deleted successfully" },
            { status: 200 }
        )
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error deleting question"
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
