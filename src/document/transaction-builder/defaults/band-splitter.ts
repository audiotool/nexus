import type { BandSplitterConstructor } from "@gen/document/v1/entity/band_splitter/v1/band_splitter_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const bandSplitterDefaults: Defaults<BandSplitterConstructor> = {
  ...defaultDisplayParams,
  displayName: "Band Splitter",
  filterLowHz: 360,
  filterHighHz: 3600,
  highGain: 1,
  midGain: 1,
  lowGain: 1,
  presetName: "",
}
