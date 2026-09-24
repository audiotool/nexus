import type { StompboxPhaserConstructor } from "@gen/document/v1/entity/stompbox_phaser/v1/stompbox_phaser_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxPhaserDefaults: Defaults<StompboxPhaserConstructor> = {
  ...defaultDisplayParams,
  displayName: "Phaser",
  minFrequencyHz: 30,
  maxFrequencyHz: 378.484375,
  feedbackFactor: 0.7291666865348816,
  lfoFrequencyHz: 0.3618587553501129,
  mix: 0.2695000171661377,
  isActive: true,
  presetName: "",
}
