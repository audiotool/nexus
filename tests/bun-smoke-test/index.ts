/**
 * Bun smoke test for @audiotool/nexus
 *
 * Tests PAT authentication and basic project/document operations.
 * Run with: bun run index.ts
 */

import { createAudiotoolClient } from "@audiotool/nexus"
import { createDiskWasmLoader } from "@audiotool/nexus/node"

function requirePat(): string {
  const pat = process.env.PAT
  if (!pat) {
    throw new Error(
      "Missing PAT in environment. Add it to tests/bun-smoke-test/.env",
    )
  }
  return pat
}

const PAT = requirePat()

async function main() {
  console.log("Creating Audiotool client with PAT...")

  // Bun uses default transport (browser transport works fine)
  // but needs disk-based WASM loader for server-side execution
  const client = await createAudiotoolClient({
    auth: PAT,
    wasm: createDiskWasmLoader(),
  })

  console.log("Client created successfully!")

  // Create a project called "foo"
  console.log("\nCreating project 'foo'...")
  const createResponse = await client.projects.createProject({
    project: {
      displayName: "foo",
    },
  })

  if (createResponse instanceof Error) {
    console.error("Failed to create project:", createResponse)
    process.exit(1)
  }

  const projectName = createResponse.project?.name
  if (!projectName) {
    console.error("No project name returned")
    process.exit(1)
  }

  console.log(`Project created: ${projectName}`)

  // Open the project for editing
  console.log("\nOpening project for real-time sync...")
  const doc = await client.open(projectName)
  console.log(`DAW URL: ${doc.dawUrl}`)

  // Start syncing
  console.log("Starting sync...")
  await doc.start()
  console.log("Sync started!")

  // Add a tonematrix
  console.log("\nCreating tonematrix...")
  const tonematrix = await doc.modify((t) => {
    return t.create("tonematrix", {
      displayName: "Smoke Test Tonematrix",
      positionX: 100,
      positionY: 100,
    })
  })

  console.log(`Tonematrix created with id: ${tonematrix.id}`)

  // Query to verify it exists
  const entities = doc.queryEntities.ofTypes("tonematrix").get()
  console.log(`Found ${entities.length} tonematrix(es) in project`)

  // Stop syncing
  console.log("\nStopping sync...")
  await doc.stop()
  console.log("Sync stopped!")

  // Clean up: delete the project
  console.log("\nCleaning up: deleting project...")
  const deleteResponse = await client.projects.deleteProject({
    name: projectName,
  })

  if (deleteResponse instanceof Error) {
    console.error("Failed to delete project:", deleteResponse)
    process.exit(1)
  }

  console.log("Project deleted!")
  console.log("\n✅ Smoke test passed!")
}

main().catch((err) => {
  console.error("Smoke test failed:", err)
  process.exit(1)
})
