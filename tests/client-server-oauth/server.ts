import { createAudiotoolClient, createServerAuth } from "@audiotool/nexus"
import {
  createNodeTransport,
  createDiskWasmLoader,
} from "@audiotool/nexus/node"
import cors from "cors"
import express from "express"

const app = express()
app.use(cors())
app.use(express.json())

app.post("/create-project", async (req, res) => {
  console.log("\n[Server] Received request to create project")

  try {
    const { tokens, clientId } = req.body

    if (!tokens || !clientId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing tokens or clientId" })
    }

    console.log("[Server] Creating Audiotool client with user tokens...")

    const client = await createAudiotoolClient({
      auth: createServerAuth({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        clientId,
        onTokenRefresh: (newTokens) => {
          console.log("[Server] Tokens refreshed!")
        },
      }),
      transport: createNodeTransport(),
      wasm: createDiskWasmLoader(),
    })

    console.log("[Server] Client created!")

    // Create a project called "bar"
    console.log("[Server] Creating project 'bar'...")
    const createResponse = await client.projects.createProject({
      project: {
        displayName: "bar",
      },
    })

    if (createResponse instanceof Error) {
      console.error("[Server] Failed to create project:", createResponse)
      return res
        .status(500)
        .json({ success: false, error: createResponse.message })
    }

    const projectName = createResponse.project?.name
    if (!projectName) {
      return res
        .status(500)
        .json({ success: false, error: "No project name returned" })
    }

    console.log(`[Server] Project created: ${projectName}`)

    // Open the project for editing
    console.log("[Server] Opening project for sync...")
    const doc = await client.open(projectName)

    // Start syncing
    await doc.start()
    console.log("[Server] Sync started!")

    // Add a Heisenberg
    console.log("[Server] Creating Heisenberg...")
    const heisenberg = await doc.modify((t) => {
      return t.create("heisenberg", {
        displayName: "Server-Created Heisenberg",
        positionX: 200,
        positionY: 200,
      })
    })

    console.log(`[Server] Heisenberg created with id: ${heisenberg.id}`)

    // Stop syncing
    await doc.stop()
    console.log("[Server] Sync stopped!")

    // Clean up: delete the project
    console.log("[Server] Deleting project...")
    const deleteResponse = await client.projects.deleteProject({
      name: projectName,
    })

    if (deleteResponse instanceof Error) {
      console.error("[Server] Failed to delete project:", deleteResponse)
    } else {
      console.log("[Server] Project deleted!")
    }

    res.json({
      success: true,
      projectName,
      heisenbergId: heisenberg.id,
    })
  } catch (err) {
    console.error("[Server] Error:", err)
    res.status(500).json({ success: false, error: String(err) })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`[Server] Running on http://127.0.0.1:${PORT}`)
  console.log("[Server] Waiting for requests...")
})
