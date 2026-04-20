import { audiotool } from "@audiotool/nexus"
import { throw_ } from "@audiotool/nexus/utils"

const at = await audiotool({
  clientId: "44409854-1d9a-4e3c-af4d-01b6e3b6dd8b",
  redirectUrl: "http://127.0.0.1:5173/",
  scope: "project:write",
})

if (at.status === "unauthenticated") {
  const button = document.createElement("button")
  button.innerHTML = "Login"
  button.addEventListener("click", () => at.login())
  document.body.appendChild(button)
  throw await new Promise(() => {}) // wait forever
}

const button = document.createElement("button")
button.innerHTML = "Logout"
button.addEventListener("click", () => at.logout())
document.body.appendChild(button)

const p = document.createElement("p")
p.innerHTML = "Hello, " + at.userName
document.body.appendChild(p)

const run = async () => {
  console.debug("creating project...")
  const project = await at.projects.createProject({
    project: {
      displayName: "Test - remove",
    },
  })
  if (project instanceof Error) {
    throw project
  }

  console.debug("opening project...")
  const nexus = await at.open(
    project.project?.name ?? throw_("couldn't find project"),
  )

  console.debug("adding event listener...")
  nexus.events.onCreate("tonematrix", () => {
    console.debug("tonematrix created")
  })

  console.debug("starting nexus...")
  await nexus.start()

  console.debug("modifying document...")
  await nexus.modify((t) => {
    t.create("tonematrix", {})
  })

  console.debug("deleting project...")
  at.projects.deleteProject({
    name: project.project?.name ?? throw_("couldn't find project"),
  })
  console.debug("all fine and dandy!")
}

await run()

await run()

run()
run()
