import type { KoboltConstructor } from "@gen/document/v1/entity/kobolt/v1/kobolt_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const koboltDefaults: Defaults<KoboltConstructor> = {
  ...defaultDisplayParams,
  displayName: "Kobolt",
  postGain: 1,
  channels: [
    ...Array.from({ length: 16 }, () => ({
      gain: 1,
      panning: 0,
    })),
  ],
}
