import { NexusLocation } from "@document/location"
import type { HelmholtzConstructor } from "@gen/document/v1/entity/helmholtz/v1/helmholtz_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const helmholtzDefaults: Defaults<HelmholtzConstructor> = {
  ...defaultDisplayParams,
  displayName: "Helmholtz",
  microTuning: new NexusLocation(),
  gain: 0.7079399824142456,
  decayTime: 0.75,
  mix: 1,
  filters: [
    {
      isActive: true,
      gain: 1,
      panning: 0,
      frequencyNote: 60,
      frequencyTuneSemitones: 0,
    },
    {
      isActive: true,
      gain: 1,
      panning: 0,
      frequencyNote: 42,
      frequencyTuneSemitones: 0,
    },
    {
      isActive: true,
      gain: 1,
      panning: 0,
      frequencyNote: 65,
      frequencyTuneSemitones: 0,
    },
    {
      isActive: false,
      gain: 1,
      panning: 0,
      frequencyNote: 60,
      frequencyTuneSemitones: 0,
    },
    {
      isActive: false,
      gain: 1,
      panning: 0,
      frequencyNote: 60,
      frequencyTuneSemitones: 0,
    },
  ],
  isActive: true,
  presetName: "",
}
