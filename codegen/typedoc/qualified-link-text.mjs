import { Converter } from "typedoc"
/**
 * Simple typedoc plugin that turns
 * ```
 * {@link index.SyncedDocument.stop}
 * ```
 *  into
 * ```
 * {@link index.SyncedDocument.stop | SyncedDocument.stop}
 * ```
 * in all markdown files.
 *
 * This is useful because the module name is often noise in markdown file and hinders
 * comprehension.
 */
export function load(app) {
  const updateDocLinks = (doc) => {
    doc.content?.forEach((part) => updateInlineTag(part))
    doc.children?.forEach((child) => updateDocLinks(child))
  }
  const updateInlineTag = (part) => {
    if (
      part.kind !== "inline-tag" ||
      part.tag !== "@link" ||
      part.text.includes("|") ||
      !part.text.includes(".")
    ) {
      return
    }
    part.text = `${part.text} | ${part.text.split(".").slice(1).join(".")}`
  }

  app.converter.on(Converter.EVENT_RESOLVE_END, (context) => {
    context.project.documents?.forEach((doc) => updateDocLinks(doc))
  })
}
