import { RendererEvent, PageEvent, ReflectionKind } from "typedoc"
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LLMS_TXT_SOURCE = path.resolve(__dirname, "../../src/docs/llms.txt")

/**
 * TypeDoc plugin that generates LLM-friendly documentation:
 * 1. Creates .html.md markdown variants for all documentation pages using TypeDoc's reflection model
 * 2. Copies the hand-written llms.txt from src/docs/ into the output directory
 *
 * This plugin hooks into TypeDoc's rendering events to access the structured
 * reflection data (AST) rather than parsing generated HTML.
 */
export function load(app) {
  const pageData = new Map()

  // Capture reflection data for each page before it's rendered
  app.renderer.on(PageEvent.END, (event) => {
    const markdown = generateMarkdownFromPage(event, app)
    if (markdown) {
      pageData.set(event.url, {
        markdown,
        title: getPageTitle(event),
        model: event.model,
        pageKind: event.pageKind,
      })
    }
  })

  // After all pages are rendered, write markdown files and copy llms.txt
  app.renderer.on(RendererEvent.END, (event) => {
    const outputDir = event.outputDirectory

    // Write markdown files
    for (const [url, data] of pageData) {
      const mdPath = path.join(outputDir, `${url}.md`)
      ensureDir(path.dirname(mdPath))
      fs.writeFileSync(mdPath, data.markdown)
    }

    // Copy the hand-written llms.txt
    if (fs.existsSync(LLMS_TXT_SOURCE)) {
      fs.copyFileSync(LLMS_TXT_SOURCE, path.join(outputDir, "llms.txt"))
    }

    console.log(
      `[llms-markdown-plugin] Copied llms.txt and generated ${pageData.size} markdown files from reflection model`
    )

    pageData.clear()
  })
}

/**
 * Generate markdown content from a PageEvent using the reflection model
 */
function generateMarkdownFromPage(event, app) {
  const model = event.model
  if (!model) return null

  const lines = []
  const title = getPageTitle(event)

  lines.push(`# ${title}`)
  lines.push("")

  // Handle different model types
  if (model.isDocument && model.isDocument()) {
    // Document reflection (markdown documents like guides)
    lines.push(...renderDocumentReflection(model, app))
  } else if (model.isProject && model.isProject()) {
    // Project reflection (index page)
    lines.push(...renderProjectReflection(model, app))
  } else if (model.isDeclaration && model.isDeclaration()) {
    // Declaration reflection (classes, interfaces, types, functions, etc.)
    lines.push(...renderDeclarationReflection(model, app))
  } else if (model.kind !== undefined) {
    // Other reflection types
    lines.push(...renderGenericReflection(model, app))
  }

  return lines.join("\n")
}

/**
 * Render a document reflection (markdown guides)
 */
function renderDocumentReflection(doc, app) {
  const lines = []

  if (doc.content) {
    lines.push(renderCommentParts(doc.content, app))
  }

  return lines
}

/**
 * Render the project reflection (main index)
 */
function renderProjectReflection(project, app) {
  const lines = []

  // Render readme if available
  if (project.readme) {
    lines.push(renderCommentParts(project.readme, app))
    lines.push("")
  }

  // Render project comment if available
  if (project.comment) {
    lines.push(...renderComment(project.comment, app))
  }

  // List modules/entry points
  if (project.children && project.children.length > 0) {
    lines.push("## Modules")
    lines.push("")
    for (const child of project.children) {
      const url = getReflectionUrl(child)
      if (url) {
        lines.push(`- [${child.name}](${url}.md)`)
      } else {
        lines.push(`- ${child.name}`)
      }
    }
    lines.push("")
  }

  // List documents if available
  if (project.documents && project.documents.length > 0) {
    lines.push("## Documentation")
    lines.push("")
    for (const doc of project.documents) {
      const url = getReflectionUrl(doc)
      if (url) {
        lines.push(`- [${doc.name}](${url}.md)`)
      } else {
        lines.push(`- ${doc.name}`)
      }
    }
    lines.push("")
  }

  return lines
}

/**
 * Render a declaration reflection (class, interface, type, function, etc.)
 */
function renderDeclarationReflection(decl, app) {
  const lines = []

  // Add kind label
  const kindName = getKindString(decl.kind)
  if (kindName) {
    lines.push(`**${kindName}**`)
    lines.push("")
  }

  // Render comment/description
  if (decl.comment) {
    lines.push(...renderComment(decl.comment, app))
    lines.push("")
  }

  // Render type parameters
  if (decl.typeParameters && decl.typeParameters.length > 0) {
    lines.push("## Type Parameters")
    lines.push("")
    for (const tp of decl.typeParameters) {
      let tpLine = `- \`${tp.name}\``
      if (tp.type) {
        tpLine += ` extends \`${renderType(tp.type)}\``
      }
      if (tp.default) {
        tpLine += ` = \`${renderType(tp.default)}\``
      }
      if (tp.comment) {
        const summary = getCommentSummary(tp.comment)
        if (summary) tpLine += ` - ${summary}`
      }
      lines.push(tpLine)
    }
    lines.push("")
  }

  // Render signature for functions/methods
  if (decl.signatures && decl.signatures.length > 0) {
    for (const sig of decl.signatures) {
      lines.push(...renderSignature(sig, app))
    }
  }

  // Render type definition for type aliases
  if (decl.type) {
    lines.push("## Type")
    lines.push("")
    lines.push("```typescript")
    lines.push(renderType(decl.type))
    lines.push("```")
    lines.push("")
  }

  // Render properties
  const properties = decl.children?.filter(
    (c) => c.kind === ReflectionKind.Property || c.kind === ReflectionKind.Accessor
  )
  if (properties && properties.length > 0) {
    lines.push("## Properties")
    lines.push("")
    for (const prop of properties) {
      lines.push(...renderProperty(prop, app))
    }
  }

  // Render methods
  const methods = decl.children?.filter((c) => c.kind === ReflectionKind.Method)
  if (methods && methods.length > 0) {
    lines.push("## Methods")
    lines.push("")
    for (const method of methods) {
      lines.push(...renderMethod(method, app))
    }
  }

  // Render enum members
  if (decl.kind === ReflectionKind.Enum && decl.children) {
    lines.push("## Members")
    lines.push("")
    for (const member of decl.children) {
      let memberLine = `- \`${member.name}\``
      if (member.type && member.type.value !== undefined) {
        memberLine += ` = \`${member.type.value}\``
      }
      if (member.comment) {
        const summary = getCommentSummary(member.comment)
        if (summary) memberLine += ` - ${summary}`
      }
      lines.push(memberLine)
    }
    lines.push("")
  }

  // Render index signature
  if (decl.indexSignatures && decl.indexSignatures.length > 0) {
    lines.push("## Index Signatures")
    lines.push("")
    for (const sig of decl.indexSignatures) {
      lines.push("```typescript")
      lines.push(renderIndexSignature(sig))
      lines.push("```")
      if (sig.comment) {
        lines.push("")
        lines.push(...renderComment(sig.comment, app))
      }
      lines.push("")
    }
  }

  return lines
}

/**
 * Render a generic reflection
 */
function renderGenericReflection(refl, app) {
  const lines = []

  if (refl.comment) {
    lines.push(...renderComment(refl.comment, app))
  }

  return lines
}

/**
 * Render a signature (function/method signature)
 */
function renderSignature(sig, app) {
  const lines = []

  // Render signature code
  lines.push("```typescript")
  lines.push(renderSignatureCode(sig))
  lines.push("```")
  lines.push("")

  // Render description
  if (sig.comment) {
    lines.push(...renderComment(sig.comment, app))
    lines.push("")
  }

  // Render parameters
  if (sig.parameters && sig.parameters.length > 0) {
    lines.push("### Parameters")
    lines.push("")
    for (const param of sig.parameters) {
      let paramLine = `- \`${param.name}\``
      if (param.type) {
        paramLine += `: \`${renderType(param.type)}\``
      }
      if (param.flags?.isOptional) {
        paramLine += " (optional)"
      }
      if (param.comment) {
        const summary = getCommentSummary(param.comment)
        if (summary) paramLine += ` - ${summary}`
      }
      lines.push(paramLine)
    }
    lines.push("")
  }

  // Render return type
  if (sig.type) {
    lines.push("### Returns")
    lines.push("")
    lines.push(`\`${renderType(sig.type)}\``)
    if (sig.comment) {
      const returnsTag = sig.comment.blockTags?.find((t) => t.tag === "@returns")
      if (returnsTag && returnsTag.content) {
        lines.push("")
        lines.push(renderCommentParts(returnsTag.content, app))
      }
    }
    lines.push("")
  }

  return lines
}

/**
 * Render a property
 */
function renderProperty(prop, app) {
  const lines = []
  const url = getReflectionUrl(prop)

  let header = `### ${prop.name}`
  if (url) {
    header = `### [${prop.name}](${url}.md)`
  }
  lines.push(header)
  lines.push("")

  if (prop.type) {
    lines.push("```typescript")
    lines.push(`${prop.name}: ${renderType(prop.type)}`)
    lines.push("```")
    lines.push("")
  }

  if (prop.comment) {
    lines.push(...renderComment(prop.comment, app))
    lines.push("")
  }

  return lines
}

/**
 * Render a method
 */
function renderMethod(method, app) {
  const lines = []
  const url = getReflectionUrl(method)

  let header = `### ${method.name}`
  if (url) {
    header = `### [${method.name}](${url}.md)`
  }
  lines.push(header)
  lines.push("")

  if (method.signatures && method.signatures.length > 0) {
    for (const sig of method.signatures) {
      lines.push(...renderSignature(sig, app))
    }
  }

  return lines
}

/**
 * Render a comment
 */
function renderComment(comment, app) {
  const lines = []

  // Render summary
  if (comment.summary && comment.summary.length > 0) {
    lines.push(renderCommentParts(comment.summary, app))
    lines.push("")
  }

  // Render block tags (like @example, @remarks, @see, etc.)
  if (comment.blockTags && comment.blockTags.length > 0) {
    for (const tag of comment.blockTags) {
      // Skip @returns as it's handled separately
      if (tag.tag === "@returns") continue

      const tagName = tag.tag.replace("@", "")
      const capitalizedTag = tagName.charAt(0).toUpperCase() + tagName.slice(1)
      lines.push(`**${capitalizedTag}**`)
      lines.push("")
      if (tag.content && tag.content.length > 0) {
        lines.push(renderCommentParts(tag.content, app))
      }
      lines.push("")
    }
  }

  return lines
}

/**
 * Render comment display parts to markdown
 */
function renderCommentParts(parts, app) {
  if (!parts || parts.length === 0) return ""

  const result = []
  for (const part of parts) {
    switch (part.kind) {
      case "text":
        result.push(part.text)
        break
      case "code":
        result.push(part.text)
        break
      case "inline-tag":
        if (part.tag === "@link" || part.tag === "@linkcode" || part.tag === "@linkplain") {
          const linkText = part.tsLinkText || part.text?.split("|").pop()?.trim() || part.text
          if (part.target && typeof part.target === "object") {
            const url = getReflectionUrl(part.target)
            if (url) {
              result.push(`[${linkText}](${url}.md)`)
            } else {
              result.push(`\`${linkText}\``)
            }
          } else {
            result.push(`\`${linkText}\``)
          }
        } else {
          result.push(part.text || "")
        }
        break
      case "relative-link":
        // Handle relative links - the text contains the display text
        if (part.text) {
          const text = part.text
          if (part.targetUrl) {
            // Convert .md links to .html.md for consistency
            let url = part.targetUrl
            if (url.endsWith(".md")) {
              url = url.replace(/\.md$/, ".html.md")
            } else if (url.endsWith(".html")) {
              url = url + ".md"
            }
            result.push(`[${text}](${url})`)
          } else {
            result.push(text)
          }
        }
        break
      default:
        if (part.text) {
          result.push(part.text)
        }
    }
  }
  return result.join("")
}

/**
 * Get the summary text from a comment
 */
function getCommentSummary(comment) {
  if (!comment || !comment.summary) return ""
  return renderCommentParts(comment.summary, null).replace(/\n/g, " ").trim()
}

/**
 * Render a type to string
 */
function renderType(type) {
  if (!type) return "unknown"

  switch (type.type) {
    case "intrinsic":
      return type.name
    case "literal":
      if (typeof type.value === "string") {
        return `"${type.value}"`
      }
      return String(type.value)
    case "reference":
      let ref = type.name
      if (type.typeArguments && type.typeArguments.length > 0) {
        ref += `<${type.typeArguments.map(renderType).join(", ")}>`
      }
      return ref
    case "array":
      return `${renderType(type.elementType)}[]`
    case "tuple":
      if (type.elements) {
        return `[${type.elements.map(renderType).join(", ")}]`
      }
      return "[]"
    case "union":
      return type.types.map(renderType).join(" | ")
    case "intersection":
      return type.types.map(renderType).join(" & ")
    case "reflection":
      if (type.declaration) {
        return renderReflectionType(type.declaration)
      }
      return "object"
    case "query":
      return `typeof ${renderType(type.queryType)}`
    case "typeOperator":
      return `${type.operator} ${renderType(type.target)}`
    case "conditional":
      return `${renderType(type.checkType)} extends ${renderType(type.extendsType)} ? ${renderType(type.trueType)} : ${renderType(type.falseType)}`
    case "indexedAccess":
      return `${renderType(type.objectType)}[${renderType(type.indexType)}]`
    case "mapped":
      return `{ [${type.parameter} in ${renderType(type.parameterType)}]: ${renderType(type.templateType)} }`
    case "predicate":
      return `${type.name} is ${renderType(type.targetType)}`
    case "templateLiteral":
      return "`template literal`"
    case "inferred":
      return `infer ${type.name}`
    case "unknown":
      return type.name || "unknown"
    default:
      return type.name || "unknown"
  }
}

/**
 * Render a reflection type (inline object type)
 */
function renderReflectionType(decl) {
  if (decl.signatures && decl.signatures.length > 0) {
    const sig = decl.signatures[0]
    const params = sig.parameters
      ? sig.parameters.map((p) => `${p.name}: ${renderType(p.type)}`).join(", ")
      : ""
    return `(${params}) => ${renderType(sig.type)}`
  }

  if (decl.children && decl.children.length > 0) {
    const props = decl.children
      .map((c) => `${c.name}: ${renderType(c.type)}`)
      .join("; ")
    return `{ ${props} }`
  }

  return "object"
}

/**
 * Render a full signature as code
 */
function renderSignatureCode(sig) {
  const parts = []
  const name = sig.name === "__call" ? "" : sig.name

  // Type parameters
  let typeParams = ""
  if (sig.typeParameters && sig.typeParameters.length > 0) {
    typeParams = `<${sig.typeParameters.map((tp) => tp.name).join(", ")}>`
  }

  // Parameters
  const params = sig.parameters
    ? sig.parameters
        .map((p) => {
          let param = p.name
          if (p.flags?.isOptional) param += "?"
          if (p.type) param += `: ${renderType(p.type)}`
          return param
        })
        .join(", ")
    : ""

  // Return type
  const returnType = sig.type ? `: ${renderType(sig.type)}` : ""

  if (name) {
    return `function ${name}${typeParams}(${params})${returnType}`
  } else {
    return `(${params})${returnType}`
  }
}

/**
 * Render an index signature
 */
function renderIndexSignature(sig) {
  const params = sig.parameters
    ? sig.parameters.map((p) => `${p.name}: ${renderType(p.type)}`).join(", ")
    : "key: string"
  return `[${params}]: ${renderType(sig.type)}`
}

/**
 * Get a URL for a reflection
 */
function getReflectionUrl(refl) {
  if (!refl) return null
  if (refl.url) {
    return refl.url
  }
  return null
}

/**
 * Get the page title from a PageEvent
 */
function getPageTitle(event) {
  const model = event.model
  if (!model) return "Documentation"

  if (model.isDocument && model.isDocument()) {
    return model.name
  }

  if (model.isProject && model.isProject()) {
    return model.name || "API Documentation"
  }

  if (model.name) {
    return model.name
  }

  return "Documentation"
}

/**
 * Get a human-readable string for a ReflectionKind
 */
function getKindString(kind) {
  const kindNames = {
    [ReflectionKind.Project]: "Project",
    [ReflectionKind.Module]: "Module",
    [ReflectionKind.Namespace]: "Namespace",
    [ReflectionKind.Enum]: "Enum",
    [ReflectionKind.EnumMember]: "Enum Member",
    [ReflectionKind.Variable]: "Variable",
    [ReflectionKind.Function]: "Function",
    [ReflectionKind.Class]: "Class",
    [ReflectionKind.Interface]: "Interface",
    [ReflectionKind.Constructor]: "Constructor",
    [ReflectionKind.Property]: "Property",
    [ReflectionKind.Method]: "Method",
    [ReflectionKind.CallSignature]: "Call Signature",
    [ReflectionKind.IndexSignature]: "Index Signature",
    [ReflectionKind.ConstructorSignature]: "Constructor Signature",
    [ReflectionKind.Parameter]: "Parameter",
    [ReflectionKind.TypeLiteral]: "Type Literal",
    [ReflectionKind.TypeParameter]: "Type Parameter",
    [ReflectionKind.Accessor]: "Accessor",
    [ReflectionKind.GetSignature]: "Get Signature",
    [ReflectionKind.SetSignature]: "Set Signature",
    [ReflectionKind.TypeAlias]: "Type Alias",
    [ReflectionKind.Reference]: "Reference",
    [ReflectionKind.Document]: "Document",
  }
  return kindNames[kind] || null
}

/**
 * Ensure a directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}
