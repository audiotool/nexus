import type { StompboxTubeConstructor } from "@gen/document/v1/entity/stompbox_tube/v1/stompbox_tube_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxTubeDefaults: Defaults<StompboxTubeConstructor> = {
  ...defaultDisplayParams,
  displayName: "Tube",
  drive: 12,
  tone: 0,
  postGain: 1,
  isActive: true,
  presetName: "",
}
