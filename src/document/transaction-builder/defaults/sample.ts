import type { SampleConstructor } from "@gen/document/v1/entity/sample/v1/sample_nexus"
import type { Defaults } from "./default-type"

export const sampleDefaults: Defaults<SampleConstructor> = {
  sampleName: "",
  uploadStartTime: 0n,
}
