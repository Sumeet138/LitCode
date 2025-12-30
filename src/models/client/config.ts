import env from "@/app/env"
import { Client, Account, Avatars, Databases, Storage } from "appwrite"

// Extend global to include appwrite client for singleton pattern
declare global {
  var appwriteClient: Client | undefined
}

// Singleton pattern to prevent multiple client instances during hot reloading
let client: Client

if (typeof window !== "undefined") {
  // Client-side singleton
  if (!globalThis.appwriteClient) {
    globalThis.appwriteClient = new Client()
      .setEndpoint(env.appwrite.endpoint)
      .setProject(env.appwrite.projectId)
  }
  client = globalThis.appwriteClient
} else {
  // Server-side (shouldn't happen for this client config, but just in case)
  client = new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId)
}

// Databases
const databases = new Databases(client)
// Account
const account = new Account(client)
// Avatars
const avatars = new Avatars(client)
// Storage
const storage = new Storage(client)

export { client, databases, account, avatars, storage }
