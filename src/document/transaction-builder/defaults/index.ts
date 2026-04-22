import type {
  EntityConstructorType,
  EntityTypeKey,
} from "@document/entity-utils"
import { audioDeviceDefaults } from "./audio-device"
import { audioMergerDefaults } from "./audio-merger"
import { audioSplitterDefaults } from "./audio-splitter"
import { autoFilterDefaults } from "./auto-filter"
import { bandSplitterDefaults } from "./band-splitter"
import { basslineDefaults, basslinePatternDefaults } from "./bassline"
import { beatbox8Defaults, beatbox8PatternDefaults } from "./beatbox8"
import { beatbox9Defaults, beatbox9PatternDefaults } from "./beatbox9"
import { centroidChannelDefaults, centroidDefaults } from "./centroid"
import { configDefaults } from "./config"
import { crossfaderDefaults } from "./crossfader"
import { curveDefaults } from "./curve"
import type { Defaults } from "./default-type"
import { desktopAudioCableDefaults } from "./desktop-audio-cable"
import { desktopNoteCableDefaults } from "./desktop-note-cable"
import { exciterDefaults } from "./exciter"
import { gakkiDefaults } from "./gakki"
import { genericVst3PluginBetaDefaults } from "./generic-vst3-plugin-beta"
import { graphicalEQDefaults } from "./graphical-eq"
import { gravityDefaults } from "./gravity"
import { grooveDefaults } from "./groove"
import { heisenbergDefaults } from "./heisenberg"
import { helmholtzDefaults } from "./helmholtz"
import { koboltDefaults } from "./kobolt"
import { machinisteDefaults, machinistePatternDefaults } from "./machiniste"
import {
  matrixArpeggiatorDefaults,
  matrixArpeggiatorPatternDefaults,
} from "./matrix-arpeggiator"
import { microTuningOctaveDefaults } from "./micro-tuning-octave"
import { minimixerDefaults } from "./minimixer"
import {
  mixerAuxDefaults,
  mixerAuxRouteDefaults,
  mixerChannelDefaults,
  mixerDelayAuxDefaults,
  mixerGroupDefaults,
  mixerMasterDefaults,
  mixerReverbAuxDefaults,
  mixerSideChainCableDefaults,
  mixerStripGroupingDefaults,
} from "./mixer"
import { noteSplitterDefaults } from "./note-splitter"
import { panoramaDefaults } from "./panorama"
import { pulsarDefaults } from "./pulsar"
import { pulverisateurDefaults } from "./pulverisateur"
import { quantumDefaults } from "./quantum"
import { quasarDefaults } from "./quasar"
import { rasselbockDefaults, rasselbockPatternDefaults } from "./rasselbock"
import { ringModulatorDefaults } from "./ring-modulator"
import { sampleDefaults } from "./sample"
import { spaceDefaults } from "./space"
import { spitfireLabsVst3PluginDefaults } from "./spitfire-labs-vst3-plugin"
import { stereoEnhancerDefaults } from "./stereo-enhancer"
import { stompboxChorusDefaults } from "./stompbox-chorus"
import { stompboxCompressorDefaults } from "./stompbox-compressor"
import { stompboxCrusherDefaults } from "./stompbox-crusher"
import { stompboxDelayDefaults } from "./stompbox-delay"
import { stompboxFlangerDefaults } from "./stompbox-flanger"
import { stompboxGateDefaults } from "./stompbox-gate"
import { stompboxParametricEqualizerDefaults } from "./stompbox-parametric-equalizer"
import { stompboxPhaserDefaults } from "./stompbox-phaser"
import { stompboxPitchDelayDefaults } from "./stompbox-pitch-delay"
import { stompboxReverbDefaults } from "./stompbox-reverb"
import { stompboxSlopeDefaults } from "./stompbox-slope"
import { stompboxStereoDetuneDefaults } from "./stompbox-stereo-detune"
import { stompboxTubeDefaults } from "./stompbox-tube"
import {
  audioRegionDefaults,
  audioTrackDefaults,
  automationCollectionDefaults,
  automationEventDefaults,
  automationRegionDefaults,
  automationTrackDefaults,
  noteCollectionDefaults,
  noteDefaults,
  noteRegionDefaults,
  noteTrackDefaults,
  patternRegionDefaults,
  patternTrackDefaults,
  tempoAutomationTrackDefaults,
} from "./timeline"
import { tinyGainDefaults } from "./tiny-gain"
import { tonematrixDefaults, tonematrixPatternDefaults } from "./tonematrix"
import { waveshaperAnchorDefaults, waveshaperDefaults } from "./waveshaper"

/**
 * A map of entity type keys to their default values.
 * Used to look up defaults when creating entities or resetting fields.
 */
export const entityDefaultsMap: Record<
  EntityTypeKey,
  Defaults<EntityConstructorType>
> = {
  audioDevice: audioDeviceDefaults,
  audioMerger: audioMergerDefaults,
  audioRegion: audioRegionDefaults,
  audioSplitter: audioSplitterDefaults,
  audioTrack: audioTrackDefaults,
  autoFilter: autoFilterDefaults,
  automationCollection: automationCollectionDefaults,
  automationEvent: automationEventDefaults,
  automationRegion: automationRegionDefaults,
  automationTrack: automationTrackDefaults,
  bandSplitter: bandSplitterDefaults,
  bassline: basslineDefaults,
  basslinePattern: basslinePatternDefaults,
  beatbox8: beatbox8Defaults,
  beatbox8Pattern: beatbox8PatternDefaults,
  beatbox9: beatbox9Defaults,
  beatbox9Pattern: beatbox9PatternDefaults,
  centroid: centroidDefaults,
  centroidChannel: centroidChannelDefaults,
  config: configDefaults,
  crossfader: crossfaderDefaults,
  curve: curveDefaults,
  desktopAudioCable: desktopAudioCableDefaults,
  desktopNoteCable: desktopNoteCableDefaults,
  exciter: exciterDefaults,
  gakki: gakkiDefaults,
  genericVst3PluginBeta: genericVst3PluginBetaDefaults,
  graphicalEQ: graphicalEQDefaults,
  gravity: gravityDefaults,
  groove: grooveDefaults,
  heisenberg: heisenbergDefaults,
  helmholtz: helmholtzDefaults,
  kobolt: koboltDefaults,
  machiniste: machinisteDefaults,
  machinistePattern: machinistePatternDefaults,
  matrixArpeggiator: matrixArpeggiatorDefaults,
  matrixArpeggiatorPattern: matrixArpeggiatorPatternDefaults,
  microTuningOctave: microTuningOctaveDefaults,
  minimixer: minimixerDefaults,
  mixerAux: mixerAuxDefaults,
  mixerAuxRoute: mixerAuxRouteDefaults,
  mixerChannel: mixerChannelDefaults,
  mixerDelayAux: mixerDelayAuxDefaults,
  mixerGroup: mixerGroupDefaults,
  mixerMaster: mixerMasterDefaults,
  mixerReverbAux: mixerReverbAuxDefaults,
  mixerSideChainCable: mixerSideChainCableDefaults,
  mixerStripGrouping: mixerStripGroupingDefaults,
  note: noteDefaults,
  noteCollection: noteCollectionDefaults,
  noteRegion: noteRegionDefaults,
  noteSplitter: noteSplitterDefaults,
  noteTrack: noteTrackDefaults,
  panorama: panoramaDefaults,
  patternRegion: patternRegionDefaults,
  patternTrack: patternTrackDefaults,
  pulsar: pulsarDefaults,
  pulverisateur: pulverisateurDefaults,
  quantum: quantumDefaults,
  quasar: quasarDefaults,
  rasselbock: rasselbockDefaults,
  rasselbockPattern: rasselbockPatternDefaults,
  ringModulator: ringModulatorDefaults,
  sample: sampleDefaults,
  space: spaceDefaults,
  spitfireLabsVst3Plugin: spitfireLabsVst3PluginDefaults,
  stereoEnhancer: stereoEnhancerDefaults,
  stompboxChorus: stompboxChorusDefaults,
  stompboxCompressor: stompboxCompressorDefaults,
  stompboxCrusher: stompboxCrusherDefaults,
  stompboxDelay: stompboxDelayDefaults,
  stompboxFlanger: stompboxFlangerDefaults,
  stompboxGate: stompboxGateDefaults,
  stompboxParametricEqualizer: stompboxParametricEqualizerDefaults,
  stompboxPhaser: stompboxPhaserDefaults,
  stompboxPitchDelay: stompboxPitchDelayDefaults,
  stompboxReverb: stompboxReverbDefaults,
  stompboxSlope: stompboxSlopeDefaults,
  stompboxStereoDetune: stompboxStereoDetuneDefaults,
  stompboxTube: stompboxTubeDefaults,
  tempoAutomationTrack: tempoAutomationTrackDefaults,
  tinyGain: tinyGainDefaults,
  tonematrix: tonematrixDefaults,
  tonematrixPattern: tonematrixPatternDefaults,
  waveshaper: waveshaperDefaults,
  waveshaperAnchor: waveshaperAnchorDefaults,
}
