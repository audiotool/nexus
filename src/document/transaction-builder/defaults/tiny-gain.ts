import type { TinyGainConstructor } from "@gen/document/v1/entity/tiny_gain/v1/tiny_gain_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const tinyGainDefaults: Defaults<TinyGainConstructor> = {
  ...defaultDisplayParams,
  displayName: "Tiny Gain",
  gain: 1,
  isMuted: false,
  isActive: true,
}
