/**
 * Login UI component.
 */

import { el, button } from "./elements"

export function renderLoginSection(onLogin: () => void): HTMLElement {
  return el("div", { className: "login-section" }, [
    el("p", {}, ["Sign in with your Audiotool account to explore the SDK features."]),
    button("Login with Audiotool", onLogin, "primary"),
  ])
}
