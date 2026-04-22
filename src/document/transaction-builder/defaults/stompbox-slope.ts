import type { StompboxSlopeConstructor } from "@gen/document/v1/entity/stompbox_slope/v1/stompbox_slope_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxSlopeDefaults: Defaults<StompboxSlopeConstructor> = {
  ...defaultDisplayParams,
  displayName: "Slope",
  filterModeIndex: 1,
  frequencyHz: 300,
  resonanceFactor: 0,
  bandWidthHz: 0,
  mix: 1,
  isActive: true,
  presetName: "",
}
