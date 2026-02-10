import { DescMessage } from "@bufbuild/protobuf"
import { localName } from "@bufbuild/protoplugin/ecmascript"
import * as opt_pb from "../../src/gen/audiotool/document/v1/opt/opt_pb"
import { findOptions, getFieldOptions, toTypeName } from "./utils"

export const gatherFieldTargets = (
  messages: DescMessage[],
  entityNames: Map<string, string>,
): Map<string, string[]> => {
  const result = new Map<string, string[]>()
  const pushSymbol = (targetType: string, symbol: string) => {
    result.set(targetType, [...(result.get(targetType) ?? []), symbol])
  }

  messages.forEach((message) => {
    const name = toTypeName(message)
    const is = findOptions(message, opt_pb.entity)?.is
    if (name !== undefined) {
      is?.forEach((is) => {
        pushSymbol(opt_pb.TargetType[is], name)
      })
    }

    message.fields.forEach((field) => {
      const opts = getFieldOptions(field)
      opts.target?.is?.forEach((is) => {
        pushSymbol(is, `${name}.${localName(field)}`)
      })
      opts.list?.elementIs?.forEach((is) => {
        pushSymbol(is, `${name}.${localName(field)}`)
      })
    })
  })

  return result
}
