/**
 * Project selector component.
 */

import type { AuthenticatedClient } from "@audiotool/nexus"
import { el, button, clear, status } from "./elements"

type Project = {
  name: string
  displayName: string
  updateTime?: Date
}

export function renderProjectSelector(
  client: AuthenticatedClient,
  onProjectSelected: (projectName: string) => void
): HTMLElement {
  const container = el("div", { className: "project-selector" }, [
    el("h2", {}, ["Select a Project"]),
  ])

  const urlInput = el("input", {
    type: "text",
    placeholder: "Paste a DAW URL or search for projects...",
  }) as HTMLInputElement

  const openButton = button("Open", async () => {
    const value = urlInput.value.trim()
    if (!value) return
    
    openButton.disabled = true
    openButton.textContent = "Opening..."
    
    try {
      onProjectSelected(value)
    } catch {
      openButton.disabled = false
      openButton.textContent = "Open"
    }
  }, "primary")

  const createButton = button("Create New", async () => {
    createButton.disabled = true
    createButton.textContent = "Creating..."
    
    try {
      const result = await client.projects.createProject({
        project: {
          displayName: `Nexus Showroom - ${new Date().toLocaleDateString()}`,
        },
      })
      
      if (result instanceof Error) {
        throw result
      }
      
      const projectName = result.project?.name
      if (!projectName) throw new Error("No project name returned")
      
      onProjectSelected(projectName)
    } catch (err) {
      createButton.disabled = false
      createButton.textContent = "Create New"
      container.appendChild(status(`Error: ${err}`, "error"))
    }
  }, "secondary")

  container.appendChild(
    el("div", { className: "project-input-group" }, [urlInput, openButton, createButton])
  )

  const projectList = el("div", { className: "project-list" })
  container.appendChild(projectList)

  loadProjects(client, projectList, onProjectSelected)

  return container
}

async function loadProjects(
  client: AuthenticatedClient,
  container: HTMLElement,
  onSelect: (name: string) => void
) {
  container.appendChild(el("div", {}, ["Loading projects..."]))

  try {
    const result = await client.projects.listProjects({
      pageSize: 10,
    })

    if (result instanceof Error) {
      throw result
    }

    clear(container)

    const projects: Project[] = result.projects.map((p) => ({
      name: p.name,
      displayName: p.displayName || "Untitled Project",
      updateTime: p.updateTime?.toDate(),
    }))

    if (projects.length === 0) {
      container.appendChild(el("div", {}, ["No projects found. Create one to get started!"]))
      return
    }

    for (const project of projects) {
      const item = el("div", { className: "project-item" }, [
        el("div", { className: "name" }, [project.displayName]),
        el("div", { className: "date" }, [
          project.updateTime
            ? `Updated ${project.updateTime.toLocaleDateString()}`
            : "",
        ]),
      ])
      
      item.addEventListener("click", () => onSelect(project.name))
      container.appendChild(item)
    }
  } catch (err) {
    clear(container)
    container.appendChild(status(`Failed to load projects: ${err}`, "error"))
  }
}
