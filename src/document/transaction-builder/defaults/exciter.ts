import type { ExciterConstructor } from "@gen/document/v1/entity/exciter/v1/exciter_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const exciterDefaults: Defaults<ExciterConstructor> = {
  ...defaultDisplayParams,
  displayName: "Exciter",
  toneFrequencyHz: 3500,
  powerFactor: 0.5,
  mix: 1,
  isActive: true,
  presetName: "",
}
