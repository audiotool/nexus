import type { QuasarConstructor } from "@gen/document/v1/entity/quasar/v1/quasar_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const quasarDefaults: Defaults<QuasarConstructor> = {
  ...defaultDisplayParams,
  displayName: "Quasar",
  preDelayMs: 0,
  lowPassFrequencyHz: 20000,
  highPassFrequencyHz: 20,
  filterSlopeIndex: 1,
  dryGain: 0.5011870265007019,
  wetGain: 0.5011870265007019,
  plateDecay: 0.75,
  plateDamp: 0,
  inputDiffusion: 0,
  tankDiffusion: 0,
  vibratoDepth: 0,
  vibratoFrequencyHz: 1,
  isActive: true,
  presetName: "",
}
