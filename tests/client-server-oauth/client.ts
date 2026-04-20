import { audiotool } from "@audiotool/nexus"

const CLIENT_ID = "bd496109-d9b4-4b6a-8519-8b6ce88b58c5"
const REDIRECT_URL = "http://127.0.0.1:5173/"
const SERVER_URL = "http://127.0.0.1:3000"

const statusEl = document.getElementById("status")!
const actionsEl = document.getElementById("actions")!
const logEl = document.getElementById("log")!

function log(message: string, type: "info" | "success" | "error" = "info") {
  const timestamp = new Date().toLocaleTimeString()
  const className = type === "info" ? "" : type
  logEl.innerHTML += `<span class="${className}">[${timestamp}] ${message}</span>\n`
  logEl.scrollTop = logEl.scrollHeight
}

function createButton(text: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement("button")
  btn.textContent = text
  btn.addEventListener("click", onClick)
  return btn
}

async function main() {
  log("Initializing Audiotool client...")

  const at = await audiotool({
    clientId: CLIENT_ID,
    redirectUrl: REDIRECT_URL,
    scope: "project:write",
  })

  if (at.status === "authenticated") {
    statusEl.innerHTML = `<strong>Logged in as:</strong> ${at.userName}`
    log(`Authenticated as ${at.userName}`, "success")

    // Add logout button
    actionsEl.appendChild(
      createButton("Logout", () => {
        at.logout()
      })
    )

    // Add button to trigger server-side project creation
    actionsEl.appendChild(
      createButton("Create Project on Server", async () => {
        log("Exporting tokens...")
        const tokens = at.exportTokens()
        log(`Tokens exported (expires: ${new Date(tokens.expiresAt).toLocaleTimeString()})`)

        log("Sending tokens to server...")
        try {
          const response = await fetch(`${SERVER_URL}/create-project`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokens,
              clientId: CLIENT_ID,
            }),
          })

          const result = await response.json()

          if (result.success) {
            log(`Project created: ${result.projectName}`, "success")
            log(`Heisenberg added with id: ${result.heisenbergId}`, "success")
            log(`Project deleted after test`, "success")
          } else {
            log(`Server error: ${result.error}`, "error")
          }
        } catch (err) {
          log(`Network error: ${err}`, "error")
        }
      })
    )
  } else if (at.status === "unauthenticated") {
    statusEl.innerHTML = "<strong>Not logged in</strong>"
    log("User is not authenticated")

    actionsEl.appendChild(
      createButton("Login with Audiotool", () => {
        log("Redirecting to Audiotool login...")
        at.login()
      })
    )
  } else {
    statusEl.innerHTML = `<strong>Error:</strong> ${at.error.message}`
    log(`Authentication error: ${at.error.message}`, "error")

    actionsEl.appendChild(
      createButton("Retry", () => {
        at.retry()
      })
    )
  }
}

main().catch((err) => {
  log(`Fatal error: ${err}`, "error")
})
