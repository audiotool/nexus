import type { GravityConstructor } from "@gen/document/v1/entity/gravity/v1/gravity_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const gravityDefaults: Defaults<GravityConstructor> = {
  ...defaultDisplayParams,
  displayName: "Gravity",
  thresholdDb: -10,
  ratio: 4,
  kneeDbRange: 3,
  makeupGainDb: 0,
  attackMs: 5,
  releaseTimeNormalized: 0.5,
  rmsWindowMs: 5,
  releaseIsSynced: false,
  isActive: true,
  presetName: "",
}
