import type { StompboxSlopeConstructor } from "@gen/document/v1/entity/stompbox_slope/v1/stompbox_slope_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxSlopeDefaults: Defaults<StompboxSlopeConstructor> = {
  ...defaultDisplayParams,
  displayName: "Slope",
  filterModeIndex: 2,
  frequencyHz: 1200,
  resonanceFactor: 0.699999988079071,
  bandWidthHz: -40,
  mix: 1,
  isActive: true,
  presetName: "",
}
