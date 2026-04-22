import type { GrooveConstructor } from "@gen/document/v1/entity/groove/v1/groove_nexus"
import type { Defaults } from "./default-type"

export const grooveDefaults: Defaults<GrooveConstructor> = {
  functionIndex: 1,
  durationTicks: 1920,
  impact: 0,
  displayName: "",
}
