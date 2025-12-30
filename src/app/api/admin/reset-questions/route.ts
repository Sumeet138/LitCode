import { databases } from "@/models/server/config"
import { db, questionCollection } from "@/models/name"
import createQuestionCollection from "@/models/server/question.collection"
import { NextResponse } from "next/server"
import { AppwriteException } from "node-appwrite"

/**
 * DELETE /api/admin/reset-questions
 * 
 * Deletes and recreates the question collection with updated schema
 */
export async function DELETE() {
    try {
        // Delete existing collection
        try {
            await databases.deleteCollection(db, questionCollection)
            console.log("✅ Question collection deleted")
        } catch (error: unknown) {
            if (error instanceof AppwriteException && error.code === 404) {
                console.log("ℹ️  Collection doesn't exist")
            } else {
                throw error
            }
        }

        // Wait a bit for Appwrite to process the deletion
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Create new collection with updated schema
        await createQuestionCollection()
        console.log("✅ Question collection created with array tags")

        return NextResponse.json({
            success: true,
            message: "Question collection reset successfully. Tags are now an array!"
        })
    } catch (error: unknown) {
        console.error("❌ Error resetting collection:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to reset collection"
        return NextResponse.json(
            {
                success: false,
                error: errorMessage
            },
            { status: 500 }
        )
    }
}
