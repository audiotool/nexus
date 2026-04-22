import { NexusLocation } from "@document/location"
import type {
  MatrixArpeggiatorConstructor,
  MatrixArpeggiatorPatternConstructor,
  MatrixArpeggiatorPatternStepConstructor,
} from "@gen/document/v1/entity/matrix_arpeggiator/v1/matrix_arpeggiator_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const matrixArpeggiatorPatternStepDefaults: Defaults<MatrixArpeggiatorPatternStepConstructor> =
  {
    overrideVelocity: false,
    stepVelocity: 1,
    isMuted: false,
    isTied: false,
    isChord: false,
  }

export const matrixArpeggiatorPatternDefaults: Defaults<MatrixArpeggiatorPatternConstructor> =
  {
    ...defaultDisplayParams,
    length: 16,
    groove: new NexusLocation(),
    steps: Array.from(
      { length: 64 },
      () => matrixArpeggiatorPatternStepDefaults,
    ),
  }

export const matrixArpeggiatorDefaults: Defaults<MatrixArpeggiatorConstructor> =
  {
    ...defaultDisplayParams,
    displayName: "Matrix Arpeggiator",
    isActive: true,
    velocity: 1,
    stepLengthIndex: 7,
    repeat: 1,
    gateRatio: 1,
    arpeggiationModeIndex: 1,
    randomSeed: 1000,
    octaves: 1,
    holdNotes: false,
    holdNotesUntilNote: 0,
    ignorePatternStepParameters: false,
    patternIsSynced: false,
    patternIndex: 0,
    presetName: "",
  }
