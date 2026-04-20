// Configuration for TypeDoc categories
// This file defines which entities belong to which categories

export interface EntityGroupConfig {
  category?: string
}

export const ENTITY_GROUPS: Record<string, EntityGroupConfig> = {
  // Beatbox8
  beatbox8: { category: "Device Entities" },
  beatbox8Pattern: { category: "Device Entities" },
  beatbox8patternstep: { category: "Device Fields" },
  beatbox8bassdrum: { category: "Device Fields" },
  beatbox8snaredrum: { category: "Device Fields" },
  beatbox8tomcongalow: { category: "Device Fields" },
  beatbox8tomcongamid: { category: "Device Fields" },
  beatbox8tomcongahigh: { category: "Device Fields" },
  beatbox8rimclaves: { category: "Device Fields" },
  beatbox8clapmaracas: { category: "Device Fields" },
  beatbox8cowbell: { category: "Device Fields" },
  beatbox8cymbal: { category: "Device Fields" },
  beatbox8openhihat: { category: "Device Fields" },
  beatbox8closedhihat: { category: "Device Fields" },

  // Beatbox9
  beatbox9: { category: "Device Entities" },
  beatbox9Pattern: { category: "Device Entities" },
  beatbox9patternstep: { category: "Device Fields" },
  beatbox9bassdrum: { category: "Device Fields" },
  beatbox9snaredrum: { category: "Device Fields" },
  beatbox9tom: { category: "Device Fields" },
  beatbox9rim: { category: "Device Fields" },
  beatbox9clap: { category: "Device Fields" },
  beatbox9hihat: { category: "Device Fields" },
  beatbox9crash: { category: "Device Fields" },
  beatbox9ride: { category: "Device Fields" },

  // Bassline
  bassline: { category: "Device Entities" },
  basslinestep: { category: "Device Fields" },
  basslinePattern: { category: "Device Fields" },

  // Heisenberg
  heisenberg: { category: "Device Entities" },
  heisenbergoperator: { category: "Device Fields" },
  heisenberglfo: { category: "Device Fields" },
  heisenbergpitchenvelope: { category: "Device Fields" },
  heisenbergfilter: { category: "Device Fields" },

  // Kobolt
  kobolt: { category: "Device Entities" },
  koboltchannel: { category: "Device Fields" },

  // Machiniste
  machiniste: { category: "Device Entities" },
  machinistePattern: { category: "Device Entities" },
  machinistechannelpattern: { category: "Device Fields" },
  machinistestep: { category: "Device Fields" },
  machinistechannel: { category: "Device Fields" },

  // Helmholtz
  helmholtz: { category: "Device Entities" },
  helmholtzfilter: { category: "Device Fields" },

  // Pulverisateur
  pulverisateur: { category: "Device Entities" },
  pulverisateuroscillatora: { category: "Device Fields" },
  pulverisateuroscillatorb: { category: "Device Fields" },
  pulverisateuroscillatorc: { category: "Device Fields" },
  pulverisateurnoise: { category: "Device Fields" },
  pulverisateuraudio: { category: "Device Fields" },
  pulverisateurfilter: { category: "Device Fields" },
  pulverisateurlfo: { category: "Device Fields" },
  pulverisateurfilterenvelope: { category: "Device Fields" },
  pulverisateuramplitudeenvelope: { category: "Device Fields" },
  pulverisateurchannel: { category: "Device Fields" },
  pulverisateuroscillator: { category: "Device Fields" },

  // Quantum
  quantum: { category: "Device Entities" },
  quantumband: { category: "Device Fields" },

  // Rasselbock
  rasselbock: { category: "Device Entities" },
  rasselbockPattern: { category: "Device Entities" },
  rasselbockrowpattern: { category: "Device Fields" },
  rasselbockstep: { category: "Device Fields" },
  rasselbockchannel: { category: "Device Fields" },
  rasselbockshuffle: { category: "Device Fields" },
  rasselbockspeed: { category: "Device Fields" },
  rasselbockstop: { category: "Device Fields" },
  rasselbockgate: { category: "Device Fields" },
  rasselbockstutter: { category: "Device Fields" },
  rasselbockscratch: { category: "Device Fields" },
  rasselbockreverse: { category: "Device Fields" },

  // Tonematrix
  tonematrix: { category: "Device Entities" },
  tonematrixPattern: { category: "Device Entities" },
  tonematrixstep: { category: "Device Fields" },

  // Space
  space: { category: "Device Entities" },
  spaceLfo: { category: "Device Fields" },
  spaceSound: { category: "Device Fields" },
  spacelfo: { category: "Device Fields" },
  spacesound: { category: "Device Fields" },

  // Minimixer
  minimixer: { category: "Device Entities" },
  minimixerchannel: { category: "Device Entities" },

  // Matrix Arpeggiator
  matrixArpeggiator: { category: "Device Entities" },
  matrixArpeggiatorPattern: { category: "Device Fields" },
  matrixarpeggiatorpatternstep: { category: "Device Fields" },

  // Smaller devices
  autoFilter: { category: "Device Entities" },
  bandSplitter: { category: "Device Entities" },
  crossfader: { category: "Device Entities" },
  exciter: { category: "Device Entities" },
  gravity: { category: "Device Entities" },
  ringModulator: { category: "Device Entities" },
  stereoEnhancer: { category: "Device Entities" },
  tinyGain: { category: "Device Entities" },
  panorama: { category: "Device Entities" },
  gakki: { category: "Device Entities" },
  pulsar: { category: "Device Entities" },
  quasar: { category: "Device Entities" },

  // Centroid
  centroid: { category: "Device Entities" },
  // ...channel
  centroidChannel: { category: "Device Entities" },
  centroidaux: { category: "Device Fields" },
  crossfaderchannel: { category: "Device Fields" },

  // Waveshaper
  waveshaper: { category: "Device Entities" },
  // ... anchor
  waveshaperAnchor: { category: "Device Entities" },

  // Graphical EQ
  graphicalEQ: { category: "Device Entities" },
  graphicaleqfilter: { category: "Device Fields" },

  // curve
  curve: { category: "Device Entities" },
  curvepass: { category: "Device Fields" },
  curveshelf: { category: "Device Fields" },
  curvepeak: { category: "Device Fields" },

  // Stompbox Effects
  stompboxChorus: { category: "Device Entities" },
  stompboxCompressor: { category: "Device Entities" },
  stompboxCrusher: { category: "Device Entities" },
  stompboxDelay: { category: "Device Entities" },
  stompboxFlanger: { category: "Device Entities" },
  stompboxGate: { category: "Device Entities" },
  stompboxParametricEqualizer: { category: "Device Entities" },
  stompboxPhaser: { category: "Device Entities" },
  stompboxPitchDelay: { category: "Device Entities" },
  stompboxReverb: { category: "Device Entities" },
  stompboxSlope: { category: "Device Entities" },
  stompboxStereoDetune: { category: "Device Entities" },
  stompboxTube: { category: "Device Entities" },

  // Audio Merger
  audioMerger: { category: "Device Entities" },
  audiomergercoordinates: { category: "Device Fields" },

  // Audio Routing - Signal routing components
  audioDevice: { category: "Device Entities" },

  // Audio Splitter
  audioSplitter: { category: "Device Entities" },
  audiosplittercoordinates: { category: "Device Fields" },

  // note splitter
  noteSplitter: { category: "Device Entities" },
  notesplitterchannel: { category: "Device Fields" },

  desktopAudioCable: { category: "Utility Entities" },
  desktopNoteCable: { category: "Utility Entities" },

  // Mixer - Mixing console components
  mixerAux: { category: "Mixer Entities" },
  mixerAuxRoute: { category: "Mixer Entities" },
  mixerChannel: { category: "Mixer Entities" },
  mixerDelayAux: { category: "Mixer Entities" },
  mixerGroup: { category: "Mixer Entities" },
  mixerMaster: { category: "Mixer Entities" },
  mixerReverbAux: { category: "Mixer Entities" },
  mixerSideChainCable: { category: "Mixer Entities" },
  mixerStripGrouping: { category: "Mixer Entities" },
  mixercompressor: { category: "Mixer Fields" },
  mixertrimfilter: { category: "Mixer Fields" },
  mixerstripfaderparameters: { category: "Mixer Fields" },
  mixerstripdisplayparameters: { category: "Mixer Fields" },
  mixereq: { category: "Mixer Fields" },

  // Timeline
  audioRegion: { category: "Timeline Entities" },
  audioTrack: { category: "Timeline Entities" },
  automationCollection: { category: "Timeline Entities" },
  automationEvent: { category: "Timeline Entities" },
  automationRegion: { category: "Timeline Entities" },
  automationTrack: { category: "Timeline Entities" },
  tempoAutomationTrack: { category: "Timeline Entities" },
  noteCollection: { category: "Timeline Entities" },
  note: { category: "Timeline Entities" },
  noteRegion: { category: "Timeline Entities" },
  noteTrack: { category: "Timeline Entities" },
  patternRegion: { category: "Timeline Entities" },
  patternTrack: { category: "Timeline Entities" },
  region: { category: "Timeline Fields" },

  // Utilities - Helper types and configurations
  config: { category: "Utility Entities" },
  groove: { category: "Utility Entities" },
  microTuningOctave: { category: "Utility Entities" },
  sample: { category: "Utility Entities" },
  spitfireLabsVst3Plugin: { category: "Utility Entities" },
  genericVst3PluginBeta: { category: "Utility Entities" },

  // Non-entity types - Component parts and sub-structures
  empty: { category: "Utility Fields" },
  adsrenvelope: { category: "Utility Fields" },
}

// Category descriptions for TypeDoc
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  ["Device Entities"]: `
    Audio Device Entities are entities representing devices that are placed on the desktop.  \n\n
    
    They're the main building blocks of the audio processing graph. Some of the types below are actual entities, some
    are just fields of entities.  \n\n

    All devices have \`positionX\` and \`positionY\` fields that can be used to position the device on the desktop, and
    a \`displayName\` field that can be used to name the device. They can be connected using {@link entities.DesktopAudioCable} and {@link entities.DesktopNoteCable}.  \n\n
    
    The DAW will manage placement of these devices so they don't overlap whenever the user moves them.  \n\n
    `,
  ["Mixer Entities"]: `
  Mixer related entities are entities with which the main audiotool mixer is configured. An audiotool project must
  contain an {@link entities.MixerMaster} entity in order to produce sound. To connect an audio device to the mixer,
  create a {@link entities.MixerChannel} entity and connect a device to it through the field {@link entities.MixerChannel.audioInput}
  using a {@link entities.DesktopAudioCable}.
  `,
  ["Timeline Entities"]: `
    These are entities that are built to build the timeline - be it note tracks, audio tracks, automation tracks, or pattern tracks.
    `,
  ["Utility Entities"]: `
    Utility types and helper entities used throughout the system.
    `,
}
