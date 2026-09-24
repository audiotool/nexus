import type { ExciterConstructor } from "@gen/document/v1/entity/exciter/v1/exciter_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const exciterDefaults: Defaults<ExciterConstructor> = {
  ...defaultDisplayParams,
  displayName: "Exciter",
  toneFrequencyHz: 1266.020263671875,
  powerFactor: 0.621999979019165,
  mix: 0.21529600024223328,
  isActive: true,
  presetName: "",
}
