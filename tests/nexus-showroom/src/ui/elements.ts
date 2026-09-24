/**
 * Simple DOM helper functions.
 * Nothing fancy - just makes element creation cleaner.
 */

export function $(selector: string): HTMLElement | null {
  return document.querySelector(selector)
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  children?: (HTMLElement | string)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (key === "className") {
        element.className = value
      } else {
        element.setAttribute(key, value)
      }
    }
  }
  
  if (children) {
    for (const child of children) {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child))
      } else {
        element.appendChild(child)
      }
    }
  }
  
  return element
}

export function text(content: string): Text {
  return document.createTextNode(content)
}

export function clear(element: HTMLElement): void {
  element.innerHTML = ""
}

export function show(element: HTMLElement): void {
  element.classList.remove("hidden")
}

export function hide(element: HTMLElement): void {
  element.classList.add("hidden")
}

export function button(
  text: string,
  onClick: () => void,
  className = "primary"
): HTMLButtonElement {
  const btn = el("button", { className }, [text])
  btn.addEventListener("click", onClick)
  return btn
}

export function status(
  message: string,
  type: "success" | "error" | "info"
): HTMLDivElement {
  return el("div", { className: `status ${type}` }, [message])
}

/** A small pulsing "LIVE" pill, reused anywhere that shows live data. */
export function liveIndicator(title = "Updating in real-time"): HTMLElement {
  return el("div", { className: "live-indicator", title }, [
    el("span", { className: "live-dot" }, []),
    el("span", { className: "live-label" }, ["LIVE"]),
  ])
}
