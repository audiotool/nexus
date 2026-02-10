---
title: All Entities
---

# All Entities

This document contains a list of all entities in the document. The second column of each table contains the entity "type name" that can be
used to construct the entity.

For example, the entity `"bassline"` can be constructed like this:

```ts
t.create("bassline", {})
```

## Audio Producing Devices

Devices that generate sound based on a timeline track.

| Link                           | Key               | Description                                             |
| ------------------------------ | ----------------- | ------------------------------------------------------- |
| {@link entities.Space}         | `"space"`         | The space synth                                         |
| {@link entities.Heisenberg}    | `"heisenberg"`    | The heisenberg synth                                    |
| {@link entities.Pulverisateur} | `"pulverisateur"` | The pulv synth                                          |
| {@link entities.Gakki}         | `"gakki"`         | A soundfont player.                                     |
| {@link entities.AudioDevice}   | `"audioDevice"`   | The device to which an audio track can be connected to. |

## Pattern Devices

These are devices that can be controlled via patterns on the desktop. The patterns can be scheduled using a pattern track. Some devices
also support note input.

| Link                                      | Key                          | Description                                                                         |
| ----------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| {@link entities.Bassline}                 | `"bassline"`                 | A tb303-like bassline device.                                                       |
| {@link entities.BasslinePattern}          | `"basslinePattern"`          | A pattern for the bassline. Must point to the bassline.                             |
| {@link entities.Beatbox8}                 | `"beatbox8"`                 | A tr808-like drum machine.                                                          |
| {@link entities.Beatbox8Pattern}          | `"beatbox8Pattern"`          | A pattern for the beatbox8. Must point to a beatbox8.                               |
| {@link entities.Beatbox9}                 | `"beatbox9"`                 | A tr909-like drum machine.                                                          |
| {@link entities.Beatbox9Pattern}          | `"beatbox9Pattern"`          | A pattern for the tr909. Must point to a beatbox9.                                  |
| {@link entities.Tonematrix}               | `"tonematrix"`               | The tonematrix device, a grid-based sequencer.                                      |
| {@link entities.TonematrixPattern}        | `"tonematrixPattern"`        | A pattern for the tonematrix. Must point to a tonematrix.                           |
| {@link entities.Rasselbock}               | `"rasselbock"`               | The rasselbock, an effect device whose effect can be triggered on a sequencer grid. |
| {@link entities.RasselbockPattern}        | `"rasselbockPattern"`        | Must point to a rasselbock.                                                         |
| {@link entities.MatrixArpeggiator}        | `"matrixArpeggiator"`        | An arpeggiator that can be configured with a pattern                                |
| {@link entities.MatrixArpeggiatorPattern} | `"matrixArpeggiatorPattern"` | A pattern for the matrix arpeggiator. Must point to a matrix arpeggiator.           |

## Effect Devices

| Link                                         | Key                             | Description                                                           |
| -------------------------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| {@link entities.StompboxChorus}              | `"stompboxChorus"`              | A stompbox Chorus                                                     |
| {@link entities.StompboxCompressor}          | `"stompboxCompressor"`          | A stompbox Compressor                                                 |
| {@link entities.StompboxCrusher}             | `"stompboxCrusher"`             | A stompbox Crusher                                                    |
| {@link entities.StompboxDelay}               | `"stompboxDelay"`               | A stompbox Delay                                                      |
| {@link entities.StompboxFlanger}             | `"stompboxFlanger"`             | A stompbox Flanger                                                    |
| {@link entities.StompboxGate}                | `"stompboxGate"`                | A stompbox Gate                                                       |
| {@link entities.StompboxParametricEqualizer} | `"stompboxParametricEqualizer"` | A stompbox ParametricEqualizer                                        |
| {@link entities.StompboxPhaser}              | `"stompboxPhaser"`              | A stompbox Phaser                                                     |
| {@link entities.StompboxPitchDelay}          | `"stompboxPitchDelay"`          | A stompbox PitchDelay                                                 |
| {@link entities.StompboxReverb}              | `"stompboxReverb"`              | A stompbox Reverb                                                     |
| {@link entities.StompboxSlope}               | `"stompboxSlope"`               | A stompbox Slope                                                      |
| {@link entities.StompboxStereoDetune}        | `"stompboxStereoDetune"`        | A stompbox StereoDetune                                               |
| {@link entities.StompboxTube}                | `"stompboxTube"`                | A stompbox Tube                                                       |
| {@link entities.AutoFilter}                  | `"autoFilter"`                  | A filter triggered based on signal gain                               |
| {@link entities.Curve}                       | `"curve"`                       | An EQ.                                                                |
| {@link entities.TinyGain}                    | `"tinyGain"`                    | A simple gain knob.                                                   |
| {@link entities.Helmholtz}                   | `"helmholtz"`                   | A resonator device.                                                   |
| {@link entities.Quantum}                     | `"quantum"`                     | A multiband compressor.                                               |
| {@link entities.Quasar}                      | `"quasar"`                      | An advanced reverb effect.                                            |
| {@link entities.Waveshaper}                  | `"waveshaper"`                  | A frame-by-frame amplitude remapping effect, resulting in distortion. |
| {@link entities.WaveshaperAnchor}            | `"waveshaperAnchor"`            | An anchor for the waveshaper. Must point to the waveshaper.           |
| {@link entities.Exciter}                     | `"exciter"`                     | Enriches the signal by adding harmonic content.                       |
| {@link entities.Panorama}                    | `"panorama"`                    | Manipulation of the stereo signal.                                    |
| {@link entities.Pulsar}                      | `"pulsar"`                      | An advanced delay effect.                                             |
| {@link entities.StereoEnhancer}              | `"stereoEnhancer"`              | Widen or narrow the stereo field.                                     |
| {@link entities.RingModulator}               | `"ringModulator"`               | Multiplies two audio signals together                                 |
| {@link entities.GraphicalEQ}                 | `"graphicalEQ"`                 | A graphical equalizer with 2 notch filters                            |
| {@link entities.Gravity}                     | `"gravity"`                     | A compressor.                                                         |

## Mixing and Routing Devices

These are devices that can be used to route audio and mix them slightly before they
enter the main mixer.

| Link                               | Key                   | Description                                                          |
| ---------------------------------- | --------------------- | -------------------------------------------------------------------- |
| {@link entities.DesktopAudioCable} | `"desktopAudioCable"` | An audio carrying cable on the desktop.                              |
| {@link entities.DesktopNoteCable}  | `"desktopNoteCable"`  | A note carrying cable on the desktop.                                |
| {@link entities.BandSplitter}      | `"bandSplitter"`      | Split the incoming signals into multiple cables by frequency bands.  |
| {@link entities.AudioMerger}       | `"audioMerger"`       | Merge audio from multiple cables into one.                           |
| {@link entities.AudioSplitter}     | `"audioSplitter"`     | Split audio into multiple cables.                                    |
| {@link entities.NoteSplitter}      | `"noteSplitter"`      | Split notes into multiple cables to connect them to multiple synths. |
| {@link entities.Centroid}          | `"centroid"`          | A mixer.                                                             |
| {@link entities.CentroidChannel}   | `"centroidChannel"`   | A channel of the centroid. Must point to the centroid.               |
| {@link entities.Minimixer}         | `"minimixer"`         | A small mixer.                                                       |
| {@link entities.Crossfader}        | `"crossfader"`        | An even smaller mixer.                                               |
| {@link entities.Kobolt}            | `"kobolt"`            | Another smaller mixer.                                               |

## Main Mixer

Entities used to build the main audiotool mixer.

| Link                                 | Key                     | Description                                                              |
| ------------------------------------ | ----------------------- | ------------------------------------------------------------------------ |
| {@link entities.MixerMaster}         | `"mixerMaster"`         | The master strip. Must exist for a project to make sound.                |
| {@link entities.MixerChannel}        | `"mixerChannel"`        | A regular mixer channel with sockets on the stagebox.                    |
| {@link entities.MixerGroup}          | `"mixerGroup"`          | A mixer group strip grouping other channel/group strips.                 |
| {@link entities.MixerStripGrouping}  | `"mixerStripGrouping"`  | An entity that can be used to group channel- and group strips            |
| {@link entities.MixerAux}            | `"mixerAux"`            | A generic aux strip with inserts                                         |
| {@link entities.MixerAuxRoute}       | `"mixerAuxRoute"`       | A connection from a channel/group strip to an aux strip.                 |
| {@link entities.MixerDelayAux}       | `"mixerDelayAux"`       | An aux strip with a baked-in delay effect                                |
| {@link entities.MixerReverbAux}      | `"mixerReverbAux"`      | An aux strip with baked-in reverb effect                                 |
| {@link entities.MixerSideChainCable} | `"mixerSideChainCable"` | A cable that can be used to connect mixer signals to side chains inputs. |
| {@link entities.Machiniste}          | `"machiniste"`          | A sample based step sequencer, useful e.g. for drums.                    |
| {@link entities.MachinistePattern}   | `"machinistePattern"`   | A pattern for the machiniste. Must point to a machiniste.                |

## Audio Tracks

| Link                         | Key             | Description                                                                                                                   |
| ---------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| {@link entities.AudioTrack}  | `"audioTrack"`  | An audio track. Must point to an AudioDevice.                                                                                 |
| {@link entities.AudioRegion} | `"audioRegion"` | An audio region. Must point to an audio track, a sample, and an automation collection controlling the playback of the sample. |

## Automation Tracks

| Link                                  | Key                      | Description                                                                              |
| ------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| {@link entities.AutomationTrack}      | `"automationTrack"`      | A parameter automation track. Must point to an automatable parameter of a device.        |
| {@link entities.AutomationCollection} | `"automationCollection"` | A collection of automation events.                                                       |
| {@link entities.AutomationEvent}      | `"automationEvent"`      | An automation event. Must point to an automation collection or a tempo automation track. |
| {@link entities.AutomationRegion}     | `"automationRegion"`     | An automation region. Must point to an automation track and an automation collection.    |

## Note Tracks

| Link                            | Key                | Description                                                           |
| ------------------------------- | ------------------ | --------------------------------------------------------------------- |
| {@link entities.NoteTrack}      | `"noteTrack"`      | A note track. Must point to a device on the desktop supporting notes. |
| {@link entities.NoteRegion}     | `"noteRegion"`     | A note region. Must point to a note track and a note collection.      |
| {@link entities.NoteCollection} | `"noteCollection"` | A collection of notes.                                                |
| {@link entities.Note}           | `"note"`           | A note. Must point to a note collection.                              |

## Pattern Tracks

| Link                           | Key               | Description                                                  |
| ------------------------------ | ----------------- | ------------------------------------------------------------ |
| {@link entities.PatternTrack}  | `"patternTrack"`  | A pattern track. Must point to a device supporting patterns. |
| {@link entities.PatternRegion} | `"patternRegion"` | A pattern region.                                            |

## Tempo Automation Track

| Link                                  | Key                      | Description                                                                                    |
| ------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------- |
| {@link entities.TempoAutomationTrack} | `"tempoAutomationTrack"` | A tempo automation track. Can exist at most once per project. Pointed to by automation events. |

## Misc

These entities don't fit into a category.

| Link                               | Key                   | Description                                                                                                       |
| ---------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| {@link entities.Config}            | `"config"`            | A config object configuring global parameters like bpm and signature. Can exist at most once.                     |
| {@link entities.Groove}            | `"groove"`            | An entity that can be pointed to by a variety of devices. Makes their notes feel more "groovy".                   |
| {@link entities.MicroTuningOctave} | `"microTuningOctave"` | An entity that can be pointed to by a variety of devices. Allows detuning every note on the scale with precision. |
| {@link entities.Sample}            | `"sample"`            | A sample. Contains an id of a sample that's resolved from the backend. Used by audio regions and the machiniste.  |

<!-- left out, not to be used by api users: "spitfireLabsVst3Plugin" -->
