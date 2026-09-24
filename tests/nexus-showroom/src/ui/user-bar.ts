/**
 * User bar component - shows logged in user and logout button.
 */

import { el, button } from "./elements"

export function renderUserBar(
  userName: string,
  onLogout: () => void
): HTMLElement {
  return el("div", { className: "user-bar" }, [
    el("span", { className: "user-name" }, [userName]),
    button("Logout", onLogout, "secondary"),
  ])
}
