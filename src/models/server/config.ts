import env from "@/app/env"
import { Avatars, Client, Databases, Storage, Users } from "node-appwrite"

let client = new Client()

client
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectId) // Your project ID
  .setKey(env.appwrite.apikey) // Your secret API key

// Databases
const databases = new Databases(client)
// Users
const users = new Users(client)
// Avatars
const avatars = new Avatars(client)
// Storage
const storage = new Storage(client)

export { client, databases, users, avatars, storage }
