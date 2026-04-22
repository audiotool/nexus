import type { GraphicalEQConstructor } from "@gen/document/v1/entity/graphical_eq/v1/graphical_eq_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const graphicalEQDefaults: Defaults<GraphicalEQConstructor> = {
  ...defaultDisplayParams,
  displayName: "Graphical EQ",
  filter1: {
    gainDb: 0,
    frequencyHz: 65.406,
    q: 0.7386,
    stereoSeparation: 0,
  },
  filter2: {
    gainDb: 0,
    frequencyHz: 8372.02,
    q: 0.7386,
    stereoSeparation: 0,
  },
  mix: 1,
  gainDb: 0,
  isActive: true,
  presetName: "",
}
