// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

/** @internal
 Array type, Arr<0 | 1> expands to [0] | [1] */
export type Arr<N extends number> = `[${N}]`

/** Submessage type. Use like: Submessage<"foo", SubmessageType> to get fields "foo", "foo/x" etc */
/** @internal */
export type Submessage<Name extends string, Subtypes extends string> =
  | Name
  | `${Name}/${Subtypes}`

/** @internal */
export type AdsrEnvelopePath =
  | "isSynced"
  | "attackTimeNormalized"
  | "attackSlopeFactor"
  | "decayTimeNormalized"
  | "decaySlopeFactor"
  | "decayIsLooped"
  | "sustainFactor"
  | "releaseTimeNormalized"
  | "releaseSlopeFactor"

/** @internal */
export type AudioDevicePath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "gain"
  | "panning"
  | "isActive"
  | "audioOutput"

/** @internal */
export type AudioMergerPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "blendModeIndex"
  | "audioInputA"
  | "audioInputB"
  | "audioInputC"
  | "audioOutput"
  | Submessage<"mergeCoords", AudioMergerCoordinatesPath>

/** @internal */
export type AudioMergerCoordinatesPath = "x" | "y"

/** @internal */
export type AudioSplitterPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "blendModeIndex"
  | "audioInput"
  | "audioOutputA"
  | "audioOutputB"
  | "audioOutputC"
  | Submessage<"splitCoords", AudioSplitterCoordinatesPath>

/** @internal */
export type AudioSplitterCoordinatesPath = "x" | "y"

/** @internal */
export type AutoFilterPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "thresholdGain"
  | "attackMs"
  | "sustainMs"
  | "releaseMs"
  | "filterModeIndex"
  | "cutoffFrequencyHz"
  | "filterModulationDepth"
  | "filterResonance"
  | "gain"
  | "mix"
  | "audioInput"
  | "sideChainInput"
  | "audioOutput"
  | "isActive"

/** @internal */
export type BandSplitterPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "filterLowHz"
  | "filterHighHz"
  | "highGain"
  | "highAudioOutput"
  | "midGain"
  | "midAudioOutput"
  | "lowGain"
  | "lowAudioOutput"
  | "audioInput"

/** @internal */
export type BasslinePath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "gain"
  | "tuneSemitones"
  | "cutoffFrequencyHz"
  | "filterResonance"
  | "filterEnvelopeModulationDepth"
  | "filterDecay"
  | "accent"
  | "waveformIndex"
  | "patternIndex"
  | Submessage<"patternSlots", Arr<0 | 1 | 2 | 3 | 4>>
  | "microTuning"
  | "audioInput"
  | "audioOutput"
  | "isActive"

/** @internal */
export type BasslinePatternPath =
  | "slot"
  | "groove"
  | "length"
  | Submessage<"steps", Submessage<Arr<number>, BasslineStepPath>>

/** @internal */
export type BasslineStepPath =
  | "key"
  | "transposeOctaves"
  | "isActive"
  | "doesSlide"
  | "isAccented"

/** @internal */
export type Beatbox8Path =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "gain"
  | "accentAmount"
  | "isActive"
  | Submessage<"patternSlots", Arr<0 | 1 | 2 | 3 | 4>>
  | "patternIndex"
  | Submessage<"bassdrum", Beatbox8BassdrumPath>
  | Submessage<"snaredrum", Beatbox8SnaredrumPath>
  | Submessage<"tomCongaLow", Beatbox8TomCongaLowPath>
  | Submessage<"tomCongaMid", Beatbox8TomCongaMidPath>
  | Submessage<"tomCongaHigh", Beatbox8TomCongaHighPath>
  | Submessage<"rimClaves", Beatbox8RimClavesPath>
  | Submessage<"clapMaracas", Beatbox8ClapMaracasPath>
  | Submessage<"cowbell", Beatbox8CowbellPath>
  | Submessage<"cymbal", Beatbox8CymbalPath>
  | Submessage<"openHihat", Beatbox8OpenHihatPath>
  | Submessage<"closedHihat", Beatbox8ClosedHihatPath>
  | "audioOutput"
  | "notesInput"

/** @internal */
export type Beatbox8PatternPath =
  | "slot"
  | "groove"
  | "length"
  | "stepScaleIndex"
  | Submessage<"steps", Submessage<Arr<number>, Beatbox8PatternStepPath>>

/** @internal */
export type Beatbox8PatternStepPath =
  | "bassdrumIsActive"
  | "snaredrumIsActive"
  | "tomCongaLowIsActive"
  | "tomCongaMidIsActive"
  | "tomCongaHighIsActive"
  | "rimClavesIsActive"
  | "clapMaracasIsActive"
  | "cowbellIsActive"
  | "cymbalIsActive"
  | "openHihatIsActive"
  | "closedHihatIsActive"
  | "isAccented"

/** @internal */
export type Beatbox8BassdrumPath = "gain" | "tone" | "decay" | "audioOutput"

/** @internal */
export type Beatbox8SnaredrumPath = "gain" | "tone" | "snappy" | "audioOutput"

/** @internal */
export type Beatbox8TomCongaLowPath =
  | "gain"
  | "tuning"
  | "instrumentTypeIndex"
  | "audioOutput"

/** @internal */
export type Beatbox8TomCongaMidPath =
  | "gain"
  | "tuning"
  | "instrumentTypeIndex"
  | "audioOutput"

/** @internal */
export type Beatbox8TomCongaHighPath =
  | "gain"
  | "tuning"
  | "instrumentTypeIndex"
  | "audioOutput"

/** @internal */
export type Beatbox8RimClavesPath =
  | "gain"
  | "instrumentTypeIndex"
  | "audioOutput"

/** @internal */
export type Beatbox8ClapMaracasPath =
  | "gain"
  | "instrumentTypeIndex"
  | "audioOutput"

/** @internal */
export type Beatbox8CowbellPath = "gain" | "audioOutput"

/** @internal */
export type Beatbox8CymbalPath = "gain" | "tone" | "decay" | "audioOutput"

/** @internal */
export type Beatbox8OpenHihatPath = "gain" | "decay" | "audioOutput"

/** @internal */
export type Beatbox8ClosedHihatPath = "gain" | "audioOutput"

/** @internal */
export type Beatbox9Path =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "gain"
  | "accentAmount"
  | "isActive"
  | Submessage<"patternSlots", Arr<0 | 1 | 2 | 3 | 4>>
  | "patternIndex"
  | Submessage<"bassdrum", Beatbox9BassdrumPath>
  | Submessage<"snaredrum", Beatbox9SnaredrumPath>
  | Submessage<"tomLow", Beatbox9TomPath>
  | Submessage<"tomMid", Beatbox9TomPath>
  | Submessage<"tomHigh", Beatbox9TomPath>
  | Submessage<"rim", Beatbox9RimPath>
  | Submessage<"clap", Beatbox9ClapPath>
  | Submessage<"hihat", Beatbox9HihatPath>
  | Submessage<"crash", Beatbox9CrashPath>
  | Submessage<"ride", Beatbox9RidePath>
  | "audioOutput"
  | "notesInput"

/** @internal */
export type Beatbox9PatternPath =
  | "slot"
  | "groove"
  | "length"
  | "stepScaleIndex"
  | Submessage<"steps", Submessage<Arr<number>, Beatbox9PatternStepPath>>

/** @internal */
export type Beatbox9PatternStepPath =
  | "bassdrumStepIndex"
  | "snaredrumStepIndex"
  | "tomLowStepIndex"
  | "tomMidStepIndex"
  | "tomHighStepIndex"
  | "rimStepIndex"
  | "clapStepIndex"
  | "closedHihatStepIndex"
  | "openHihatStepIndex"
  | "crashStepIndex"
  | "rideStepIndex"

/** @internal */
export type Beatbox9BassdrumPath =
  | "gain"
  | "tone"
  | "attack"
  | "decay"
  | "audioOutput"

/** @internal */
export type Beatbox9SnaredrumPath =
  | "gain"
  | "tune"
  | "tone"
  | "snappy"
  | "audioOutput"

/** @internal */
export type Beatbox9TomPath = "gain" | "tune" | "decay" | "audioOutput"

/** @internal */
export type Beatbox9RimPath = "gain" | "audioOutput"

/** @internal */
export type Beatbox9ClapPath = "gain" | "audioOutput"

/** @internal */
export type Beatbox9HihatPath =
  | "gain"
  | "closedDecay"
  | "openDecay"
  | "audioOutput"

/** @internal */
export type Beatbox9CrashPath = "gain" | "tune" | "audioOutput"

/** @internal */
export type Beatbox9RidePath = "gain" | "tune" | "audioOutput"

/** @internal */
export type CentroidPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "postGain"
  | "panning"
  | Submessage<"aux1", CentroidAuxPath>
  | Submessage<"aux2", CentroidAuxPath>
  | "audioOutput"

/** @internal */
export type CentroidAuxPath = "sendGain" | "audioInput" | "audioOutput"

/** @internal */
export type CentroidChannelPath =
  | "centroid"
  | "orderAmongChannels"
  | "displayName"
  | "audioInput"
  | "preGain"
  | "eqHighGainDb"
  | "eqMidFrequency"
  | "eqMidGainDb"
  | "eqLowGainDb"
  | "aux1SendGain"
  | "aux2SendGain"
  | "useAuxPreMode"
  | "panning"
  | "postGain"
  | "isMuted"
  | "isSoloed"

/** @internal */
export type ConfigPath =
  | "tempoBpm"
  | "baseFrequencyHz"
  | "signatureNumerator"
  | "signatureDenominator"
  | "durationTicks"
  | "defaultGroove"

/** @internal */
export type CrossfaderPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "postGain"
  | "crossfade"
  | "panning"
  | "blendModeIndex"
  | Submessage<"channelA", CrossfaderChannelPath>
  | Submessage<"channelB", CrossfaderChannelPath>
  | "audioOutput"

/** @internal */
export type CrossfaderChannelPath =
  | "preGain"
  | "eqLowFrequencyHz"
  | "eqLowGainDb"
  | "lowKillEnabled"
  | "eqMidFrequencyHz"
  | "eqMidGainDb"
  | "midKillEnabled"
  | "eqHighFrequencyHz"
  | "eqHighGainDb"
  | "highKillEnabled"
  | "audioInput"

/** @internal */
export type CurvePath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "gainDb"
  | "isActive"
  | "spectrumModeIndex"
  | Submessage<"lowPass", CurvePassPath>
  | Submessage<"highPass", CurvePassPath>
  | Submessage<"lowShelf", CurveShelfPath>
  | Submessage<"highShelf", CurveShelfPath>
  | Submessage<"peak1", CurvePeakPath>
  | Submessage<"peak2", CurvePeakPath>
  | Submessage<"peak3", CurvePeakPath>
  | "audioInput"
  | "audioOutput"

/** @internal */
export type CurvePassPath =
  | "cutoffFrequencyHz"
  | "filterSlopeIndex"
  | "q"
  | "isEnabled"

/** @internal */
export type CurveShelfPath = "centerFrequencyHz" | "gainDb" | "isEnabled"

/** @internal */
export type CurvePeakPath = "centerFrequencyHz" | "gainDb" | "q" | "isEnabled"

/** @internal */
export type DesktopAudioCablePath = "fromSocket" | "toSocket" | "colorIndex"

/** @internal */
export type DesktopNoteCablePath = "fromSocket" | "toSocket" | "colorIndex"

/** @internal */
export type ExciterPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "audioInput"
  | "audioOutput"
  | "toneFrequencyHz"
  | "powerFactor"
  | "mix"
  | "isActive"

/** @internal */
export type GakkiPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "soundfontId"
  | "gain"
  | "notesInput"
  | "audioOutput"

/** @internal */
export type GenericVst3PluginBetaPath =
  | "displayName"
  | "pluginPath"
  | "positionX"
  | "positionY"
  | "audioInput"
  | "audioOutput"
  | "notesInput"
  | "state"
  | "isActive"

/** @internal */
export type GraphicalEQPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | Submessage<"filter1", GraphicalEQFilterPath>
  | Submessage<"filter2", GraphicalEQFilterPath>
  | "mix"
  | "gainDb"
  | "audioInput"
  | "audioOutput"
  | "isActive"

/** @internal */
export type GraphicalEQFilterPath =
  | "gainDb"
  | "frequencyHz"
  | "q"
  | "stereoSeparation"

/** @internal */
export type GravityPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "thresholdDb"
  | "ratio"
  | "kneeDbRange"
  | "makeupGainDb"
  | "attackMs"
  | "releaseIsSynced"
  | "releaseTimeNormalized"
  | "rmsWindowMs"
  | "isActive"
  | "audioOutput"
  | "audioInput"
  | "sideChainInput"

/** @internal */
export type GroovePath =
  | "functionIndex"
  | "durationTicks"
  | "impact"
  | "displayName"

/** @internal */
export type HeisenbergPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "microTuning"
  | "tuneSemitones"
  | "gain"
  | "playModeIndex"
  | "glideMs"
  | "velocityFactor"
  | "unisonoCount"
  | "unisonoDetuneSemitones"
  | "unisonoStereoSpreadFactor"
  | "operatorDetuneModeIndex"
  | Submessage<"operatorA", HeisenbergOperatorPath>
  | Submessage<"operatorB", HeisenbergOperatorPath>
  | Submessage<"operatorC", HeisenbergOperatorPath>
  | Submessage<"operatorD", HeisenbergOperatorPath>
  | Submessage<"envelopeMain", AdsrEnvelopePath>
  | Submessage<"envelope2", AdsrEnvelopePath>
  | Submessage<"envelope3", AdsrEnvelopePath>
  | Submessage<"pitchEnvelope", HeisenbergPitchEnvelopePath>
  | Submessage<"lfo1", HeisenbergLFOPath>
  | Submessage<"lfo2", HeisenbergLFOPath>
  | Submessage<"filter", HeisenbergFilterPath>
  | "notesInput"
  | "audioOutput"
  | "isActive"

/** @internal */
export type HeisenbergOperatorPath =
  | "gain"
  | "panning"
  | "detuneFactor"
  | "frequencyOffsetHz"
  | "waveformIndex"
  | "usePitchEnvelope"
  | "modulationFactorA"
  | "modulationFactorB"
  | "modulationFactorC"
  | "modulationFactorD"
  | "velocityAmplitudeModulationDepth"
  | "envelopeMainAmplitudeModulationDepth"
  | "envelope2AmplitudeModulationDepth"
  | "envelope3AmplitudeModulationDepth"
  | "lfo1AmplitudeModulationDepth"
  | "lfo2AmplitudeModulationDepth"

/** @internal */
export type HeisenbergLFOPath =
  | "isSynced"
  | "doesRestart"
  | "rateNormalized"
  | "offsetFactor"
  | "delayTimeNormalized"
  | "blendTimeNormalized"
  | "waveformIndex"

/** @internal */
export type HeisenbergPitchEnvelopePath =
  | "isSynced"
  | "loopDecayIndex"
  | "attackRangeFactor"
  | "attackTimeNormalized"
  | "attackSlopeFactor"
  | "decayRangeFactor"
  | "decayTimeNormalized"
  | "decaySlopeFactor"
  | "sustainRangeFactor"
  | "releaseTimeNormalized"
  | "releaseSlopeFactor"
  | "releaseRangeFactor"
  | "semitoneRange"

/** @internal */
export type HeisenbergFilterPath =
  | "cutoffFrequencyHz"
  | "resonance"
  | "filterType"
  | "orderIndex"
  | "velocityCutoffModulationDepth"
  | "envelopeMainCutoffModulationDepth"
  | "envelope2CutoffModulationDepth"
  | "envelope3CutoffModulationDepth"
  | "lfo1CutoffModulationDepth"
  | "lfo2CutoffModulationDepth"
  | "keyboardTrackingAmount"

/** @internal */
export type HelmholtzPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "microTuning"
  | "gain"
  | "decayTime"
  | "mix"
  | "isActive"
  | Submessage<"filters", Submessage<Arr<number>, HelmholtzFilterPath>>
  | "audioInput"
  | "audioOutput"

/** @internal */
export type HelmholtzFilterPath =
  | "isActive"
  | "gain"
  | "panning"
  | "frequencyNote"
  | "frequencyTuneSemitones"

/** @internal */
export type KoboltPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "postGain"
  | Submessage<"channels", Submessage<Arr<number>, KoboltChannelPath>>
  | "audioOutput"

/** @internal */
export type KoboltChannelPath = "audioInput" | "gain" | "panning"

/** @internal */
export type MachinistePath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "mainOutputGain"
  | "mainOutput"
  | "globalModulationDepth"
  | Submessage<"patternSlots", Arr<0 | 1 | 2 | 3 | 4>>
  | "patternIndex"
  | Submessage<"channels", Submessage<Arr<number>, MachinisteChannelPath>>
  | "notesInput"
  | "isActive"

/** @internal */
export type MachinistePatternPath =
  | "slot"
  | "groove"
  | "stepScaleIndex"
  | "length"
  | Submessage<
      "channelPatterns",
      Submessage<Arr<number>, MachinisteChannelPatternPath>
    >

/** @internal */
export type MachinisteChannelPatternPath =
  | "isExclusive"
  | "isMuted"
  | Submessage<"steps", Submessage<Arr<number>, MachinisteStepPath>>

/** @internal */
export type MachinisteStepPath = "isActive" | "modulationDepth"

/** @internal */
export type MachinisteChannelPath =
  | "sample"
  | "startTrimFactor"
  | "startTrimModulationDepth"
  | "endTrimFactor"
  | "endTrimModulationDepth"
  | "pitchSemitones"
  | "pitchModulationDepth"
  | "filterTypeIndex"
  | "cutoffFrequencyHz"
  | "cutoffModulationDepth"
  | "resonance"
  | "resonanceModulationDepth"
  | "envelopePeakRatio"
  | "envelopeRatioModulationDepth"
  | "envelopeSlope"
  | "envelopeSlopeModulationDepth"
  | "panning"
  | "panningModulationDepth"
  | "gain"
  | "gainModulationDepth"
  | "channelOutput"

/** @internal */
export type MatrixArpeggiatorPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "isActive"
  | "velocity"
  | "stepLengthIndex"
  | "repeat"
  | "gateRatio"
  | "arpeggiationModeIndex"
  | "randomSeed"
  | "octaves"
  | "holdNotes"
  | "holdNotesUntilNote"
  | "ignorePatternStepParameters"
  | "patternIsSynced"
  | Submessage<"patternSlots", Arr<0 | 1 | 2 | 3 | 4>>
  | "patternIndex"
  | "notesInput"
  | "notesOutput"

/** @internal */
export type MatrixArpeggiatorPatternPath =
  | "slot"
  | "groove"
  | "length"
  | Submessage<
      "steps",
      Submessage<Arr<number>, MatrixArpeggiatorPatternStepPath>
    >

/** @internal */
export type MatrixArpeggiatorPatternStepPath =
  | "overrideVelocity"
  | "stepVelocity"
  | "isMuted"
  | "isTied"
  | "isChord"

/** @internal */
export type MicroTuningOctavePath =
  | Submessage<"semitones", Arr<0 | 1 | 2 | 3 | 4>>
  | "displayName"

/** @internal */
export type MinimixerPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "gain"
  | "auxSendGain"
  | "auxIsPreGain"
  | Submessage<"channel1", MinimixerChannelPath>
  | Submessage<"channel2", MinimixerChannelPath>
  | Submessage<"channel3", MinimixerChannelPath>
  | Submessage<"channel4", MinimixerChannelPath>
  | "mainOutput"
  | "auxSendOutput"
  | "auxReturnInput"

/** @internal */
export type MinimixerChannelPath =
  | "gain"
  | "panning"
  | "auxSendGain"
  | "auxIsPreGain"
  | "isMuted"
  | "isSoloed"
  | "audioInput"

/** @internal */
export type MixerStripDisplayParametersPath =
  | "orderAmongStrips"
  | "displayName"
  | "colorIndex"

/** @internal */
export type MixerStripFaderParametersPath =
  | "panning"
  | "postGain"
  | "isMuted"
  | "isSoloed"

/** @internal */
export type MixerTrimFilterPath =
  | "highPassCutoffFrequencyHz"
  | "lowPassCutoffFrequencyHz"
  | "isActive"

/** @internal */
export type MixerAuxPath =
  | Submessage<"displayParameters", MixerStripDisplayParametersPath>
  | "preGain"
  | Submessage<"trimFilter", MixerTrimFilterPath>
  | "insertOutput"
  | "insertInput"
  | Submessage<"faderParameters", MixerStripFaderParametersPath>

/** @internal */
export type MixerAuxRoutePath = "gain" | "auxSend" | "auxReceive"

/** @internal */
export type MixerCompressorPath =
  | "attackMs"
  | "releaseMs"
  | "makeupGainDb"
  | "detectionModeIndex"
  | "ratio"
  | "thresholdDb"
  | "isActive"
  | "sideChainInput"

/** @internal */
export type MixerEqPath =
  | "lowShelfFrequencyHz"
  | "lowShelfGainDb"
  | "lowMidFrequencyHz"
  | "lowMidGainDb"
  | "highMidFrequencyHz"
  | "highMidGainDb"
  | "highShelfFrequencyHz"
  | "highShelfGainDb"
  | "isActive"

/** @internal */
export type MixerChannelPath =
  | "audioInput"
  | Submessage<"displayParameters", MixerStripDisplayParametersPath>
  | "preGain"
  | "doesPhaseReverse"
  | Submessage<"trimFilter", MixerTrimFilterPath>
  | Submessage<"compressor", MixerCompressorPath>
  | Submessage<"eq", MixerEqPath>
  | "auxSendsAreActive"
  | "auxSend"
  | "sideChainOutput"
  | Submessage<"faderParameters", MixerStripFaderParametersPath>

/** @internal */
export type MixerDelayAuxPath =
  | Submessage<"displayParameters", MixerStripDisplayParametersPath>
  | "preGain"
  | Submessage<"trimFilter", MixerTrimFilterPath>
  | "feedbackFactor"
  | "stepCount"
  | "stepLengthIndex"
  | Submessage<"faderParameters", MixerStripFaderParametersPath>

/** @internal */
export type MixerGroupPath =
  | Submessage<"displayParameters", MixerStripDisplayParametersPath>
  | Submessage<"trimFilter", MixerTrimFilterPath>
  | Submessage<"compressor", MixerCompressorPath>
  | Submessage<"eq", MixerEqPath>
  | "insertOutput"
  | "insertInput"
  | "auxSendsAreActive"
  | "auxSend"
  | "sideChainOutput"
  | Submessage<"faderParameters", MixerStripFaderParametersPath>

/** @internal */
export type MixerMasterPath =
  | "positionX"
  | "positionY"
  | "doBypassInserts"
  | "insertOutput"
  | "insertInput"
  | "panning"
  | "postGain"
  | "limiterEnabled"
  | "isMuted"

/** @internal */
export type MixerReverbAuxPath =
  | Submessage<"displayParameters", MixerStripDisplayParametersPath>
  | "preGain"
  | Submessage<"trimFilter", MixerTrimFilterPath>
  | "roomSizeFactor"
  | "preDelayTimeMs"
  | "dampFactor"
  | Submessage<"faderParameters", MixerStripFaderParametersPath>

/** @internal */
export type MixerSideChainCablePath = "from" | "to"

/** @internal */
export type MixerStripGroupingPath = "childStrip" | "groupStrip"

/** @internal */
export type NoteSplitterPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "notesInput"
  | Submessage<"channels", Submessage<Arr<number>, NoteSplitterChannelPath>>

/** @internal */
export type NoteSplitterChannelPath =
  | "notesOutput"
  | "velocityModulation"
  | "isMuted"

/** @internal */
export type PanoramaPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "leftFactor"
  | "rightFactor"
  | "leftPanning"
  | "rightPanning"
  | "audioInput"
  | "audioOutput"
  | "isActive"

/** @internal */
export type PulsarPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "preDelayLeftTimeSemibreveIndex"
  | "preDelayLeftTimeMs"
  | "preDelayLeftPanning"
  | "preDelayRightTimeSemibreveIndex"
  | "preDelayRightTimeMs"
  | "preDelayRightPanning"
  | "feedbackDelayTimeSemibreveIndex"
  | "feedbackDelayTimeMs"
  | "lfoSpeedHz"
  | "lfoModulationDepthMs"
  | "feedbackFactor"
  | "stereoCrossFactor"
  | "filterMinHz"
  | "filterMaxHz"
  | "dryGain"
  | "wetGain"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type PulverisateurPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "notesInput"
  | "audioInput"
  | "audioOutput"
  | "gain"
  | Submessage<"oscillatorA", PulverisateurOscillatorAPath>
  | Submessage<"oscillatorB", PulverisateurOscillatorBPath>
  | Submessage<"oscillatorC", PulverisateurOscillatorCPath>
  | Submessage<"noise", PulverisateurNoisePath>
  | Submessage<"audio", PulverisateurAudioPath>
  | Submessage<"filter", PulverisateurFilterPath>
  | Submessage<"lfo", PulverisateurLfoPath>
  | Submessage<"filterEnvelope", PulverisateurFilterEnvelopePath>
  | Submessage<"amplitudeEnvelope", PulverisateurAmplitudeEnvelopePath>
  | "glideTimeMs"
  | "tuneSemitones"
  | "playModeIndex"
  | "microTuning"
  | "isActive"

/** @internal */
export type PulverisateurOscillatorAPath =
  | Submessage<"channel", PulverisateurChannelPath>
  | Submessage<"oscillator", PulverisateurOscillatorPath>

/** @internal */
export type PulverisateurOscillatorBPath =
  | Submessage<"channel", PulverisateurChannelPath>
  | Submessage<"oscillator", PulverisateurOscillatorPath>
  | "hardSyncToOscillatorA"

/** @internal */
export type PulverisateurOscillatorCPath =
  | Submessage<"channel", PulverisateurChannelPath>
  | Submessage<"oscillator", PulverisateurOscillatorPath>
  | "doesTrackKeyboard"

/** @internal */
export type PulverisateurNoisePath =
  | Submessage<"channel", PulverisateurChannelPath>
  | "color"

/** @internal */
export type PulverisateurAudioPath =
  | Submessage<"channel", PulverisateurChannelPath>
  | "drive"

/** @internal */
export type PulverisateurFilterPath =
  | "modeIndex"
  | "cutoffFrequencyHz"
  | "resonance"
  | "filterSpacing"
  | "keyboardTrackingAmount"

/** @internal */
export type PulverisateurLfoPath =
  | "waveform"
  | "rateIsSynced"
  | "rateNormalized"
  | "restartOnNote"
  | "targetsOscillatorAPitch"
  | "targetsOscillatorBPitch"
  | "targetsOscillatorCPitch"
  | "targetsFilterCutoff"
  | "targetsPulseWidth"
  | "modulationDepth"

/** @internal */
export type PulverisateurFilterEnvelopePath =
  | "attackMs"
  | "decayMs"
  | "decayIsLooped"
  | "sustainFactor"
  | "releaseMs"
  | "modulationDepth"

/** @internal */
export type PulverisateurAmplitudeEnvelopePath =
  | "attackMs"
  | "decayMs"
  | "decayIsLooped"
  | "sustainFactor"
  | "releaseMs"

/** @internal */
export type PulverisateurChannelPath = "isActive" | "panning" | "gain"

/** @internal */
export type PulverisateurOscillatorPath =
  | "tuneSemitones"
  | "tuneOctaves"
  | "waveform"

/** @internal */
export type QuantumPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "gainDb"
  | "rmsWindowMs"
  | "isActive"
  | "spectrumModeIndex"
  | Submessage<"splitFrequencyHz", Arr<0 | 1 | 2 | 3 | 4>>
  | Submessage<"bands", Submessage<Arr<number>, QuantumBandPath>>
  | "audioInput"
  | "audioOutput"

/** @internal */
export type QuantumBandPath =
  | "thresholdDb"
  | "ratio"
  | "kneeDb"
  | "attackMs"
  | "releaseMs"
  | "makeupGainDb"
  | "isCompressorActive"
  | "isMuted"
  | "isSoloed"

/** @internal */
export type QuasarPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "preDelayMs"
  | "lowPassFrequencyHz"
  | "highPassFrequencyHz"
  | "filterSlopeIndex"
  | "dryGain"
  | "wetGain"
  | "isActive"
  | "plateDecay"
  | "plateDamp"
  | "inputDiffusion"
  | "tankDiffusion"
  | "vibratoDepth"
  | "vibratoFrequencyHz"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type RasselbockPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | Submessage<"patternSlots", Arr<0 | 1 | 2 | 3 | 4>>
  | "patternIndex"
  | Submessage<"channelConfigs", Submessage<Arr<number>, RasselbockChannelPath>>
  | Submessage<"shuffleConfig", RasselbockShufflePath>
  | Submessage<"speedConfig", RasselbockSpeedPath>
  | Submessage<"stopConfig", RasselbockStopPath>
  | Submessage<"gateConfig", RasselbockGatePath>
  | Submessage<"stutterConfig", RasselbockStutterPath>
  | Submessage<"scratchConfig", RasselbockScratchPath>
  | Submessage<"reverseConfig", RasselbockReversePath>
  | "audioInput"
  | "masterOutput"
  | "isActive"

/** @internal */
export type RasselbockPatternPath =
  | "slot"
  | "length"
  | Submessage<
      "channelPatterns",
      Submessage<Arr<number>, RasselbockRowPatternPath>
    >
  | Submessage<"effectOrder", Arr<0 | 1 | 2 | 3 | 4>>
  | Submessage<
      "effectPatterns",
      Submessage<Arr<number>, RasselbockRowPatternPath>
    >
  | "groove"

/** @internal */
export type RasselbockRowPatternPath = Submessage<
  "steps",
  Submessage<Arr<number>, RasselbockStepPath>
>

/** @internal */
export type RasselbockStepPath = "isOn" | "isEnd"

/** @internal */
export type RasselbockChannelPath =
  | "gain"
  | "panning"
  | "mix"
  | "mixMode"
  | "isMuted"
  | "isSoloed"
  | "audioOutput"

/** @internal */
export type RasselbockShufflePath =
  | "intervalIndex"
  | "seed"
  | "isMuted"
  | "isSoloed"

/** @internal */
export type RasselbockSpeedPath = "speedRatioIndex" | "isMuted" | "isSoloed"

/** @internal */
export type RasselbockStopPath =
  | "durationIndex"
  | "doesSpinback"
  | "isMuted"
  | "isSoloed"

/** @internal */
export type RasselbockGatePath =
  | "intervalDurationIndex"
  | "durationFactor"
  | "isMuted"
  | "isSoloed"

/** @internal */
export type RasselbockStutterPath =
  | "intervalDurationIndex"
  | "scaleFactor"
  | "pitchSemitones"
  | "isMuted"
  | "isSoloed"

/** @internal */
export type RasselbockScratchPath =
  | "rateBars"
  | "modulationDepth"
  | "modulationOffset"
  | "modulationShapeIndex"
  | "isMuted"
  | "isSoloed"

/** @internal */
export type RasselbockReversePath = "isMuted" | "isSoloed"

/** @internal */
export type RegionPath =
  | "positionTicks"
  | "durationTicks"
  | "collectionOffsetTicks"
  | "loopOffsetTicks"
  | "loopDurationTicks"
  | "isEnabled"
  | "colorIndex"
  | "displayName"

/** @internal */
export type RingModulatorPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "audioInput1"
  | "audioInput2"
  | "audioOutput"
  | "gain"
  | "isActive"

/** @internal */
export type SamplePath = "sampleName" | "uploadStartTime"

/** @internal */
export type SpacePath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "microTuning"
  | "gain"
  | "stereoDetuneShift"
  | "tuneSemitones"
  | "tuneASemitones"
  | "tuneBSemitones"
  | "glideMs"
  | "mixAB"
  | "lfoMixModulationDepth"
  | "lfoGainModulationDepth"
  | "lfoStereoDetuneShiftModulationDepth"
  | "lfoPanningModulationDepth"
  | "envelopeMixModulationDepth"
  | "envelopeTuneModulationDepth"
  | "envelopeLfoRateModulationDepth"
  | "envelopeLfoAmountModulationDepth"
  | "velocityGainModulationDepth"
  | "velocityMixModulationDepth"
  | "keyboardMixModulationDepth"
  | "notePlayModeIndex"
  | Submessage<"lfo", SpaceLFOPath>
  | Submessage<"amplitudeEnvelope", AdsrEnvelopePath>
  | Submessage<"modulationEnvelope", AdsrEnvelopePath>
  | "modulationEnvelopeHasRelease"
  | Submessage<"soundA", SpaceSoundPath>
  | Submessage<"soundB", SpaceSoundPath>
  | "notesInput"
  | "audioOutput"
  | "isActive"

/** @internal */
export type SpaceLFOPath =
  | "waveformIndex"
  | "rateNormalized"
  | "phaseOffset"
  | "isSynced"
  | "doesRetrigger"

/** @internal */
export type SpaceSoundPath =
  | "dispersion"
  | "vaporisation"
  | "brightness"
  | "metal"
  | "separation"
  | "harmonicsCount"
  | "combFilterAmount"
  | "combFilterRate"
  | "combFilterWidth"

/** @internal */
export type SpitfireLabsVst3PluginPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "expression"
  | "dynamics"
  | "reverb"
  | "release"
  | "tightness"
  | "vibrato"
  | "simpleMix"
  | "stereoPan"
  | "adsrAttack"
  | "adsrDecay"
  | "adsrSustain"
  | "adsrRelease"
  | "globalGain"
  | "globalPan"
  | "globalTune"
  | "stereoFlip"
  | "stereoSpread"
  | "variation"
  | "delay"
  | "amount"
  | "distortion"
  | "lushVerb"
  | "pedalVol"
  | "pedalDyn"
  | "length"
  | "timeMachine"
  | "stretch"
  | "softPedal"
  | "response"
  | "mallet"
  | "stopMute"
  | "direction"
  | "lowPassFilter"
  | "portamento"
  | "generalPurpose1"
  | "generalPurpose2"
  | "generalPurpose3"
  | "generalPurpose4"
  | "generalPurpose5"
  | "generalPurpose6"
  | "generalPurpose7"
  | "generalPurpose8"
  | "generalPurpose9"
  | "speed"
  | "compression"
  | "scale"
  | "depth"
  | "noiseFx"
  | "grainSpeed"
  | "audioOutput"
  | "notesInput"
  | "state"

/** @internal */
export type StereoEnhancerPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "channelsAreInverted"
  | "frequencyHz"
  | "stereoWidth"
  | "audioInput"
  | "audioOutput"
  | "isActive"

/** @internal */
export type StompboxChorusPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "delayTimeMs"
  | "feedbackFactor"
  | "lfoFrequencyHz"
  | "lfoModulationDepth"
  | "spreadFactor"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxCompressorPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "attackMs"
  | "releaseMs"
  | "makeupGainDb"
  | "detectionModeIndex"
  | "ratio"
  | "thresholdDb"
  | "isActive"
  | "audioInput"
  | "sideChainInput"
  | "audioOutput"

/** @internal */
export type StompboxCrusherPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "preGain"
  | "downsamplingFactor"
  | "postGain"
  | "bits"
  | "mix"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxDelayPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "stepCount"
  | "stepLengthIndex"
  | "feedbackFactor"
  | "mix"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxFlangerPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "delayTimeMs"
  | "feedbackFactor"
  | "lfoFrequencyHz"
  | "lfoModulationDepth"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxGatePath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "attackMs"
  | "releaseMs"
  | "postGain"
  | "isInverted"
  | "holdMs"
  | "thresholdGain"
  | "isActive"
  | "audioInput"
  | "sideChainInput"
  | "audioOutput"

/** @internal */
export type StompboxParametricEqualizerPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "frequencyHz"
  | "bandwidthFactor"
  | "postGainDb"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxPhaserPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "minFrequencyHz"
  | "maxFrequencyHz"
  | "feedbackFactor"
  | "lfoFrequencyHz"
  | "mix"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxPitchDelayPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "stepCount"
  | "stepLengthIndex"
  | "feedbackFactor"
  | "tuneFactor"
  | "mix"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxReverbPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "roomSizeFactor"
  | "preDelayTimeMs"
  | "feedbackFactor"
  | "dampFactor"
  | "mix"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxSlopePath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "filterModeIndex"
  | "frequencyHz"
  | "resonanceFactor"
  | "bandWidthHz"
  | "mix"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxStereoDetunePath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "detuneSemitones"
  | "delayTimeMs"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type StompboxTubePath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "drive"
  | "tone"
  | "postGain"
  | "isActive"
  | "audioInput"
  | "audioOutput"

/** @internal */
export type AudioRegionPath =
  | Submessage<"region", RegionPath>
  | "track"
  | "playbackAutomationCollection"
  | "sample"
  | "gain"
  | "fadeInDurationTicks"
  | "fadeInSlope"
  | "fadeOutDurationTicks"
  | "fadeOutSlope"
  | "timestretchMode"
  | "pitchShiftSemitones"

/** @internal */
export type AudioTrackPath =
  | "orderAmongTracks"
  | "isEnabled"
  | "groove"
  | "player"

/** @internal */
export type AutomationCollectionPath = never

/** @internal */
export type AutomationEventPath =
  | "collection"
  | "positionTicks"
  | "value"
  | "slope"
  | "interpolation"
  | "isSecond"

/** @internal */
export type AutomationRegionPath =
  | Submessage<"region", RegionPath>
  | "collection"
  | "track"

/** @internal */
export type AutomationTrackPath =
  | "orderAmongTracks"
  | "isEnabled"
  | "automatedParameter"

/** @internal */
export type TempoAutomationTrackPath = "isEnabled"

/** @internal */
export type NotePath =
  | "collection"
  | "positionTicks"
  | "durationTicks"
  | "pitch"
  | "velocity"
  | "doesSlide"

/** @internal */
export type NoteCollectionPath = never

/** @internal */
export type NoteRegionPath =
  | Submessage<"region", RegionPath>
  | "collection"
  | "track"

/** @internal */
export type NoteTrackPath =
  | "orderAmongTracks"
  | "isEnabled"
  | "groove"
  | "player"

/** @internal */
export type PatternRegionPath =
  | Submessage<"region", RegionPath>
  | "patternIndex"
  | "track"
  | "restart"

/** @internal */
export type PatternTrackPath = "orderAmongTracks" | "isEnabled" | "player"

/** @internal */
export type TinyGainPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "audioInput"
  | "audioOutput"
  | "gain"
  | "isMuted"
  | "isActive"

/** @internal */
export type TonematrixPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "patternIndex"
  | Submessage<"patternSlots", Arr<0 | 1 | 2 | 3 | 4>>
  | "microTuning"
  | "noteOutput"
  | "audioOutput"
  | "isActive"

/** @internal */
export type TonematrixPatternPath =
  | "slot"
  | Submessage<"steps", Submessage<Arr<number>, TonematrixStepPath>>
  | "groove"

/** @internal */
export type TonematrixStepPath = Submessage<"notes", Arr<0 | 1 | 2 | 3 | 4>>

/** @internal */
export type WaveshaperPath =
  | "displayName"
  | "positionX"
  | "positionY"
  | "presetName"
  | "preGain"
  | "mix"
  | "autoDrive"
  | "attackMs"
  | "releaseMs"
  | "thresholdGain"
  | "invertEnvelope"
  | "finalSlope"
  | "finalY"
  | "audioInput"
  | "sideChainInput"
  | "audioOutput"
  | "isActive"
  | "disableOversampling"

/** @internal */
export type WaveshaperAnchorPath = "x" | "y" | "slope" | "waveshaper"

/** This is a generated type that is a subset of `string` that represents a path
 * to a field in the schema.
 *
 * Examples:
 * ```ts
 * import { SchemaPath } from "@audiotool/nexus/utils"
 *
 * "/desktopAudioCable" satisfies SchemaPath
 * "/desktopAudioCable/audioInput" satisfies SchemaPath
 * "/heisenberg/pitchEnvelope/releaseBendFactor" satisfies SchemaPath
 * "/heisenberg/operators/0/pitchEnvelope/releaseBendFactor" satisfies SchemaPath
 * ```
 *
 * Converter functions:
 * * {@link document.schemaLocationToSchemaPath}
 * * {@link document.schemaPathToSchemaLocation}
 */

export type SchemaPath = `/${
  | Submessage<"audioDevice", AudioDevicePath>
  | Submessage<"audioMerger", AudioMergerPath>
  | Submessage<"audioSplitter", AudioSplitterPath>
  | Submessage<"autoFilter", AutoFilterPath>
  | Submessage<"bandSplitter", BandSplitterPath>
  | Submessage<"bassline", BasslinePath>
  | Submessage<"basslinePattern", BasslinePatternPath>
  | Submessage<"beatbox8", Beatbox8Path>
  | Submessage<"beatbox8Pattern", Beatbox8PatternPath>
  | Submessage<"beatbox9", Beatbox9Path>
  | Submessage<"beatbox9Pattern", Beatbox9PatternPath>
  | Submessage<"centroid", CentroidPath>
  | Submessage<"centroidChannel", CentroidChannelPath>
  | Submessage<"config", ConfigPath>
  | Submessage<"crossfader", CrossfaderPath>
  | Submessage<"curve", CurvePath>
  | Submessage<"desktopAudioCable", DesktopAudioCablePath>
  | Submessage<"desktopNoteCable", DesktopNoteCablePath>
  | Submessage<"exciter", ExciterPath>
  | Submessage<"gakki", GakkiPath>
  | Submessage<"genericVst3PluginBeta", GenericVst3PluginBetaPath>
  | Submessage<"graphicalEQ", GraphicalEQPath>
  | Submessage<"gravity", GravityPath>
  | Submessage<"groove", GroovePath>
  | Submessage<"heisenberg", HeisenbergPath>
  | Submessage<"helmholtz", HelmholtzPath>
  | Submessage<"kobolt", KoboltPath>
  | Submessage<"machiniste", MachinistePath>
  | Submessage<"machinistePattern", MachinistePatternPath>
  | Submessage<"matrixArpeggiator", MatrixArpeggiatorPath>
  | Submessage<"matrixArpeggiatorPattern", MatrixArpeggiatorPatternPath>
  | Submessage<"microTuningOctave", MicroTuningOctavePath>
  | Submessage<"minimixer", MinimixerPath>
  | Submessage<"mixerAux", MixerAuxPath>
  | Submessage<"mixerAuxRoute", MixerAuxRoutePath>
  | Submessage<"mixerChannel", MixerChannelPath>
  | Submessage<"mixerDelayAux", MixerDelayAuxPath>
  | Submessage<"mixerGroup", MixerGroupPath>
  | Submessage<"mixerMaster", MixerMasterPath>
  | Submessage<"mixerReverbAux", MixerReverbAuxPath>
  | Submessage<"mixerSideChainCable", MixerSideChainCablePath>
  | Submessage<"mixerStripGrouping", MixerStripGroupingPath>
  | Submessage<"noteSplitter", NoteSplitterPath>
  | Submessage<"panorama", PanoramaPath>
  | Submessage<"pulsar", PulsarPath>
  | Submessage<"pulverisateur", PulverisateurPath>
  | Submessage<"quantum", QuantumPath>
  | Submessage<"quasar", QuasarPath>
  | Submessage<"rasselbock", RasselbockPath>
  | Submessage<"rasselbockPattern", RasselbockPatternPath>
  | Submessage<"ringModulator", RingModulatorPath>
  | Submessage<"sample", SamplePath>
  | Submessage<"space", SpacePath>
  | Submessage<"spitfireLabsVst3Plugin", SpitfireLabsVst3PluginPath>
  | Submessage<"stereoEnhancer", StereoEnhancerPath>
  | Submessage<"stompboxChorus", StompboxChorusPath>
  | Submessage<"stompboxCompressor", StompboxCompressorPath>
  | Submessage<"stompboxCrusher", StompboxCrusherPath>
  | Submessage<"stompboxDelay", StompboxDelayPath>
  | Submessage<"stompboxFlanger", StompboxFlangerPath>
  | Submessage<"stompboxGate", StompboxGatePath>
  | Submessage<"stompboxParametricEqualizer", StompboxParametricEqualizerPath>
  | Submessage<"stompboxPhaser", StompboxPhaserPath>
  | Submessage<"stompboxPitchDelay", StompboxPitchDelayPath>
  | Submessage<"stompboxReverb", StompboxReverbPath>
  | Submessage<"stompboxSlope", StompboxSlopePath>
  | Submessage<"stompboxStereoDetune", StompboxStereoDetunePath>
  | Submessage<"stompboxTube", StompboxTubePath>
  | Submessage<"audioRegion", AudioRegionPath>
  | Submessage<"audioTrack", AudioTrackPath>
  | Submessage<"automationCollection", AutomationCollectionPath>
  | Submessage<"automationEvent", AutomationEventPath>
  | Submessage<"automationRegion", AutomationRegionPath>
  | Submessage<"automationTrack", AutomationTrackPath>
  | Submessage<"tempoAutomationTrack", TempoAutomationTrackPath>
  | Submessage<"note", NotePath>
  | Submessage<"noteCollection", NoteCollectionPath>
  | Submessage<"noteRegion", NoteRegionPath>
  | Submessage<"noteTrack", NoteTrackPath>
  | Submessage<"patternRegion", PatternRegionPath>
  | Submessage<"patternTrack", PatternTrackPath>
  | Submessage<"tinyGain", TinyGainPath>
  | Submessage<"tonematrix", TonematrixPath>
  | Submessage<"tonematrixPattern", TonematrixPatternPath>
  | Submessage<"waveshaper", WaveshaperPath>
  | Submessage<"waveshaperAnchor", WaveshaperAnchorPath>}`

