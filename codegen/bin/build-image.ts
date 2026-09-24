// Builds the proto image that both buf.gen.yaml templates generate from, and
// removes the fields in HIDDEN_FIELDS from it.

import {
  type DescriptorProto,
  type FileDescriptorProto,
  FileDescriptorSet,
} from "@bufbuild/protobuf"
import { spawnSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const IMAGE_PATH = path.resolve(import.meta.dirname, "..", ".image.binpb")

const PROTOS_REPO = "https://github.com/audiotool/protos.git#branch=main"

const PATHS = [
  "audiotool/document/",
  "audiotool/project/",
  "audiotool/preset/",
  "audiotool/user/",
  "audiotool/sample/",
  "audiotool/audiograph/",
  "audiotool/longrunning/",
]

const EXCLUDE_PATHS = [
  // engine messages (plugin_state, request, response, feedback) are internal
  // DAW <-> engine communication and are not part of the SDK surface.
  "audiotool/document/v1/engine/",
]

/**
 * Fields that exist in the protos but are not part of the SDK yet, given as
 * `<full message name>.<field name>`.
 *
 * The SDK ignores updates to these fields that it receives from the server.
 */
const HIDDEN_FIELDS = [
  "audiotool.document.v1.entity.pulverisateur.v1.Pulverisateur.use_legacy_algorithm",
  "audiotool.document.v1.entity.stompbox_reverb.v1.StompboxReverb.use_legacy_algorithm",
  "audiotool.document.v1.entity.timeline.v1.audio.AudioRegion.use_quantized_groove_application",
]

const FILE_MESSAGE_TYPE = 4
const MESSAGE_FIELD = 2
const MESSAGE_NESTED_TYPE = 3

const buildImage = () => {
  const args = [
    "buf",
    "build",
    PROTOS_REPO,
    ...PATHS.flatMap((p) => ["--path", p]),
    ...EXCLUDE_PATHS.flatMap((p) => ["--exclude-path", p]),
    "-o",
    IMAGE_PATH,
  ]
  const result = spawnSync("npx", args, { stdio: "inherit" })
  if (result.status !== 0) {
    throw new Error(`buf build failed with exit code ${result.status}`)
  }
}

/** Removes the field at `fieldIndex` of the message at `messagePath` from the
 * file, and fixes up the source code info (comments) of the fields after it. */
const removeField = (
  file: FileDescriptorProto,
  message: DescriptorProto,
  messagePath: number[],
  fieldIndex: number,
) => {
  message.field.splice(fieldIndex, 1)

  const sourceCodeInfo = file.sourceCodeInfo
  if (sourceCodeInfo === undefined) {
    return
  }
  const prefix = [...messagePath, MESSAGE_FIELD]
  sourceCodeInfo.location = sourceCodeInfo.location.filter((location) => {
    const isFieldOfMessage =
      location.path.length > prefix.length &&
      prefix.every((value, i) => location.path[i] === value)
    if (!isFieldOfMessage) {
      return true
    }
    const index = location.path[prefix.length]
    if (index === fieldIndex) {
      return false
    }
    if (index > fieldIndex) {
      location.path[prefix.length] = index - 1
    }
    return true
  })
}

const visitMessages = (
  file: FileDescriptorProto,
  visit: (message: DescriptorProto, fullName: string, path: number[]) => void,
) => {
  const visitMessage = (
    message: DescriptorProto,
    parentName: string,
    path: number[],
  ) => {
    const fullName = `${parentName}.${message.name}`
    visit(message, fullName, path)
    message.nestedType.forEach((nested, i) =>
      visitMessage(nested, fullName, [...path, MESSAGE_NESTED_TYPE, i]),
    )
  }
  file.messageType.forEach((message, i) =>
    visitMessage(message, file.package ?? "", [FILE_MESSAGE_TYPE, i]),
  )
}

const hideFields = () => {
  const image = FileDescriptorSet.fromBinary(readFileSync(IMAGE_PATH))
  const remaining = new Set(HIDDEN_FIELDS)

  for (const file of image.file) {
    visitMessages(file, (message, fullName, messagePath) => {
      for (let i = message.field.length - 1; i >= 0; i--) {
        const fieldName = `${fullName}.${message.field[i].name}`
        if (remaining.delete(fieldName)) {
          removeField(file, message, messagePath, i)
        }
      }
    })
  }

  if (remaining.size > 0) {
    throw new Error(
      `hidden fields not found in protos: ${[...remaining].join(", ")}`,
    )
  }

  writeFileSync(IMAGE_PATH, image.toBinary())
}

buildImage()
hideFields()
