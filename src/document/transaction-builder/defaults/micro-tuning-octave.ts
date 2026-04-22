import type { MicroTuningOctaveConstructor } from "@gen/document/v1/entity/micro_tuning_octave/v1/micro_tuning_octave_nexus"
import type { Defaults } from "./default-type"

export const microTuningOctaveDefaults: Defaults<MicroTuningOctaveConstructor> =
  {
    displayName: "Micro Tuning",
    semitones: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }
