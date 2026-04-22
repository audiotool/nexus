import type { MixerAuxConstructor } from "@gen/document/v1/entity/mixer/v1/mixer_aux_nexus"
import type { MixerAuxRouteConstructor } from "@gen/document/v1/entity/mixer/v1/mixer_aux_route_nexus"
import type { MixerChannelConstructor } from "@gen/document/v1/entity/mixer/v1/mixer_channel_nexus"
import type { MixerDelayAuxConstructor } from "@gen/document/v1/entity/mixer/v1/mixer_delay_aux_nexus"
import type { MixerGroupConstructor } from "@gen/document/v1/entity/mixer/v1/mixer_group_nexus"
import type { MixerMasterConstructor } from "@gen/document/v1/entity/mixer/v1/mixer_master_nexus"
import type { MixerReverbAuxConstructor } from "@gen/document/v1/entity/mixer/v1/mixer_reverb_aux_nexus"
import type { MixerSideChainCableConstructor } from "@gen/document/v1/entity/mixer/v1/mixer_side_chain_cable_nexus"
import type { MixerStripGroupingConstructor } from "@gen/document/v1/entity/mixer/v1/mixer_strip_grouping_nexus"
import type { Defaults } from "./default-type"

const defaultDisplayParameters = {
  orderAmongStrips: 0,
  displayName: "",
  colorIndex: 0,
}

const defaultFaderParameters = {
  panning: 0,
  postGain: 1,
  isMuted: false,
  isSoloed: false,
}

const defaultTrimFilter = {
  highPassCutoffFrequencyHz: 20,
  lowPassCutoffFrequencyHz: 20000,
  isActive: true,
}

const defaultCompressor = {
  attackMs: 15,
  releaseMs: 100,
  makeupGainDb: 0,
  detectionModeIndex: 1,
  ratio: 2,
  thresholdDb: -10,
  isActive: false,
}

const defaultEq = {
  lowShelfFrequencyHz: 60,
  lowShelfGainDb: 0,
  lowMidFrequencyHz: 500,
  lowMidGainDb: 0,
  highMidFrequencyHz: 4800,
  highMidGainDb: 0,
  highShelfFrequencyHz: 12000,
  highShelfGainDb: 0,
  isActive: true,
}

export const mixerAuxDefaults: Defaults<MixerAuxConstructor> = {
  displayParameters: defaultDisplayParameters,
  preGain: 1,
  trimFilter: defaultTrimFilter,
  faderParameters: defaultFaderParameters,
}

export const mixerAuxRouteDefaults: Defaults<MixerAuxRouteConstructor> = {
  gain: 1,
}

export const mixerChannelDefaults: Defaults<MixerChannelConstructor> = {
  displayParameters: defaultDisplayParameters,
  preGain: 0.39810699224472046,
  doesPhaseReverse: false,
  trimFilter: defaultTrimFilter,
  compressor: defaultCompressor,
  eq: defaultEq,
  auxSendsAreActive: true,
  faderParameters: defaultFaderParameters,
}

export const mixerDelayAuxDefaults: Defaults<MixerDelayAuxConstructor> = {
  displayParameters: defaultDisplayParameters,
  preGain: 1,
  trimFilter: defaultTrimFilter,
  feedbackFactor: 0.30000001192092896,
  stepCount: 3,
  stepLengthIndex: 1,
  faderParameters: defaultFaderParameters,
}

export const mixerGroupDefaults: Defaults<MixerGroupConstructor> = {
  displayParameters: defaultDisplayParameters,
  trimFilter: defaultTrimFilter,
  compressor: defaultCompressor,
  eq: defaultEq,
  auxSendsAreActive: true,
  faderParameters: defaultFaderParameters,
}

export const mixerMasterDefaults: Defaults<MixerMasterConstructor> = {
  positionX: 0,
  positionY: 0,
  doBypassInserts: false,
  panning: 0,
  postGain: 1,
  limiterEnabled: false,
  isMuted: false,
}

export const mixerReverbAuxDefaults: Defaults<MixerReverbAuxConstructor> = {
  displayParameters: defaultDisplayParameters,
  preGain: 1,
  trimFilter: defaultTrimFilter,
  roomSizeFactor: 0.800000011920929,
  preDelayTimeMs: 160,
  dampFactor: 0.10000000149011612,
  faderParameters: defaultFaderParameters,
}

export const mixerSideChainCableDefaults: Defaults<MixerSideChainCableConstructor> =
  {}

export const mixerStripGroupingDefaults: Defaults<MixerStripGroupingConstructor> =
  {}
