import type { RingModulatorConstructor } from "@gen/document/v1/entity/ring_modulator/v1/ring_modulator_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const ringModulatorDefaults: Defaults<RingModulatorConstructor> = {
  ...defaultDisplayParams,
  displayName: "Ring Modulator",
  gain: 1,
  isActive: true,
}
