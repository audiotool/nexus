import type { StompboxPhaserConstructor } from "@gen/document/v1/entity/stompbox_phaser/v1/stompbox_phaser_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxPhaserDefaults: Defaults<StompboxPhaserConstructor> = {
  ...defaultDisplayParams,
  displayName: "Phaser",
  minFrequencyHz: 240,
  maxFrequencyHz: 3000,
  feedbackFactor: 0.7,
  lfoFrequencyHz: 0.6,
  mix: 1,
  isActive: true,
  presetName: "",
}
