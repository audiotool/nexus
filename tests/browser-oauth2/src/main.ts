import { createAudiotoolClient, getLoginStatus } from "@audiotool/nexus"
import { throw_ } from "@audiotool/nexus/utils"


const status = await getLoginStatus({
  clientId: "44409854-1d9a-4e3c-af4d-01b6e3b6dd8b",
  redirectUrl: "http://127.0.0.1:5173/",
  scope: "project:write",
})

if (!status.loggedIn){
  const button = document.createElement("button")
  button.innerHTML = "Login"
  button.addEventListener("click", () => status.login())
  document.body.appendChild(button)
  throw await new Promise(() => {}) // wait forever
}

const button = document.createElement("button")
button.innerHTML = "Logout"
button.addEventListener("click", () => status.logout())
document.body.appendChild(button)

const p = document.createElement("p")
p.innerHTML = "Hello, " + await status.getUserName()
document.body.appendChild(p)

const client = await createAudiotoolClient({
  authorization: status,
})

const project = await client.api.projectService.createProject({
  project: {
    displayName: "Test - remove",
  },
})
if (project instanceof Error) {
  throw project
}

const nexus = await client.createSyncedDocument({
  mode: "online",
  project: project.project?.name ?? throw_("couldn't find project"),
})

nexus.events.onCreate("tonematrix", () => {
  console.debug("tonematrix created")
})

await nexus.start()

await nexus.modify((t) => {
  t.create("tonematrix", {})
})

client.api.projectService.deleteProject({
  name: project.project?.name ?? throw_("couldn't find project"),
})
