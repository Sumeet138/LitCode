import env from "@/app/env"
import { Client, Account, Avatars, Databases, Storage } from "appwrite"

const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectId) // Your project ID

// Databases
const databases = new Databases(client)
// Account
const account = new Account(client)
// Avatars
const avatars = new Avatars(client)
// Storage
const storage = new Storage(client)

export { client, databases, account, avatars, storage }
