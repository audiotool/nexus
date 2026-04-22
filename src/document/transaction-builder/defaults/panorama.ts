import type { PanoramaConstructor } from "@gen/document/v1/entity/panorama/v1/panorama_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const panoramaDefaults: Defaults<PanoramaConstructor> = {
  ...defaultDisplayParams,
  displayName: "Panorama",
  leftFactor: 1,
  rightFactor: 1,
  leftPanning: -1,
  rightPanning: 1,
  isActive: true,
  presetName: "",
}
