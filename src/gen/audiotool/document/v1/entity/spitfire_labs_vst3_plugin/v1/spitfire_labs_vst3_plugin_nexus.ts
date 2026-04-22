// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"spitfireLabsVst3Plugin"`
 * is | {@link api.TargetType.NoteTrackPlayer}
 *
 *
 *  Data structure representing the Spitfire VST plugin. This plugin only runs
 *  when connected to the booster.
 *
 *  All automatable parameters are added below as float values. However, they're
 *  set to `immutable`, because the plugin state is not actually synced through
 *  these parameters; they only exist to be able to connect automation tracks.
 *
 *  The plugin state is instead synced through the `state` field below,
 *  containing an opaque binary blob. Note that the engine on its own doesn't
 *  read the `state` field, it has to be passed in manually (this is
 *  automatically managed in the DAW)
 *
 *
 * @category Utility Entities*/
export type SpitfireLabsVst3Plugin = {
  /**
   *  The user-assigned name of this device.
   */
  displayName: PrimitiveField<string, "mut">
  /**
   *  X position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionX: PrimitiveField<number, "mut">
  /**
   *  Y position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionY: PrimitiveField<number, "mut">
  /**
   *  spitfire labs parameter 10
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  expression: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 20
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  dynamics: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 30
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  reverb: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 40
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  release: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 50
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  tightness: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 60
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  vibrato: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 70
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  simpleMix: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 80
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  stereoPan: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1869222698
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  adsrAttack: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1869225099
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  adsrDecay: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1869240026
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  adsrSustain: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1869238562
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  adsrRelease: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 892218455
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  globalGain: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 98063557
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  globalPan: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 892625104
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  globalTune: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1235749049
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  stereoFlip: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1816604410
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  stereoSpread: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 875294141
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  variation: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1513843245
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  delay: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1753593070
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  amount: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1078470069
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  distortion: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 31201011
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  lushVerb: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 27831802
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  pedalVol: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 27784064
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  pedalDyn: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 2061082492
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  length: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 164512228
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  timeMachine: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1819677999
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  stretch: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1018373914
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  softPedal: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 591113047
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  response: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 2085962329
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  mallet: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 444268806
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  stopMute: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 2142130985
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  direction: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 749414706
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  lowPassFilter: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 2027374695
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  portamento: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 481116022
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  generalPurpose1: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 481116053
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  generalPurpose2: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 481116735
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  generalPurpose3: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter  481116766
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  generalPurpose4: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 481116797
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  generalPurpose5: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 481116828
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  generalPurpose6: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 481116859
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  generalPurpose7: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 481116890
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  generalPurpose8: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 481116921
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  generalPurpose9: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1528017137
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  speed: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1077613272
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  compression: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1527626228
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  scale: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 1456563165
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  depth: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 2119488876
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  noiseFx: PrimitiveField<number, "immut">
  /**
   *  spitfire labs parameter 481116952
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  grainSpeed: PrimitiveField<number, "immut">
  /**
   *  Audio Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Notes Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  The Spitifire Labs VST state, with opaque content only understandable by
   *  the plugin. Contains all parameters also part of this message, which is why
   *  those are marked as immutable.
   *
   *  If the state cannot be read by the Spitfire LABS plugin, this will keep
   *  working with existing values. The DAW will likely overwrite it soon with
   *  valid values.
   *
   *  If the state contains a sample pack that the user doesn't have installed,
   *  the user won't hear any sound (the plugin UI shows some error), otherwise
   *  it will continue working as expected.
   */
  state: PrimitiveField<Uint8Array, "mut">
}
/** @internal */

export type SpitfireLabsVst3PluginConstructor = {
  /**
   *  The user-assigned name of this device.
   */
  displayName?: string
  /**
   *  X position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionX?: number
  /**
   *  Y position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionY?: number
  /**
   *  spitfire labs parameter 10
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  expression?: number
  /**
   *  spitfire labs parameter 20
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  dynamics?: number
  /**
   *  spitfire labs parameter 30
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  reverb?: number
  /**
   *  spitfire labs parameter 40
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  release?: number
  /**
   *  spitfire labs parameter 50
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  tightness?: number
  /**
   *  spitfire labs parameter 60
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  vibrato?: number
  /**
   *  spitfire labs parameter 70
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  simpleMix?: number
  /**
   *  spitfire labs parameter 80
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  stereoPan?: number
  /**
   *  spitfire labs parameter 1869222698
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  adsrAttack?: number
  /**
   *  spitfire labs parameter 1869225099
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  adsrDecay?: number
  /**
   *  spitfire labs parameter 1869240026
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  adsrSustain?: number
  /**
   *  spitfire labs parameter 1869238562
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  adsrRelease?: number
  /**
   *  spitfire labs parameter 892218455
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  globalGain?: number
  /**
   *  spitfire labs parameter 98063557
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  globalPan?: number
  /**
   *  spitfire labs parameter 892625104
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  globalTune?: number
  /**
   *  spitfire labs parameter 1235749049
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  stereoFlip?: number
  /**
   *  spitfire labs parameter 1816604410
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  stereoSpread?: number
  /**
   *  spitfire labs parameter 875294141
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  variation?: number
  /**
   *  spitfire labs parameter 1513843245
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  delay?: number
  /**
   *  spitfire labs parameter 1753593070
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  amount?: number
  /**
   *  spitfire labs parameter 1078470069
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  distortion?: number
  /**
   *  spitfire labs parameter 31201011
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  lushVerb?: number
  /**
   *  spitfire labs parameter 27831802
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  pedalVol?: number
  /**
   *  spitfire labs parameter 27784064
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  pedalDyn?: number
  /**
   *  spitfire labs parameter 2061082492
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  length?: number
  /**
   *  spitfire labs parameter 164512228
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  timeMachine?: number
  /**
   *  spitfire labs parameter 1819677999
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  stretch?: number
  /**
   *  spitfire labs parameter 1018373914
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  softPedal?: number
  /**
   *  spitfire labs parameter 591113047
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  response?: number
  /**
   *  spitfire labs parameter 2085962329
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  mallet?: number
  /**
   *  spitfire labs parameter 444268806
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  stopMute?: number
  /**
   *  spitfire labs parameter 2142130985
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  direction?: number
  /**
   *  spitfire labs parameter 749414706
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  lowPassFilter?: number
  /**
   *  spitfire labs parameter 2027374695
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  portamento?: number
  /**
   *  spitfire labs parameter 481116022
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  generalPurpose1?: number
  /**
   *  spitfire labs parameter 481116053
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  generalPurpose2?: number
  /**
   *  spitfire labs parameter 481116735
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  generalPurpose3?: number
  /**
   *  spitfire labs parameter  481116766
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  generalPurpose4?: number
  /**
   *  spitfire labs parameter 481116797
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  generalPurpose5?: number
  /**
   *  spitfire labs parameter 481116828
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  generalPurpose6?: number
  /**
   *  spitfire labs parameter 481116859
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  generalPurpose7?: number
  /**
   *  spitfire labs parameter 481116890
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  generalPurpose8?: number
  /**
   *  spitfire labs parameter 481116921
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  generalPurpose9?: number
  /**
   *  spitfire labs parameter 1528017137
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  speed?: number
  /**
   *  spitfire labs parameter 1077613272
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  compression?: number
  /**
   *  spitfire labs parameter 1527626228
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  scale?: number
  /**
   *  spitfire labs parameter 1456563165
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  depth?: number
  /**
   *  spitfire labs parameter 2119488876
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  noiseFx?: number
  /**
   *  spitfire labs parameter 481116952
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * immutable | true*/
  grainSpeed?: number
  /**
   *  The Spitifire Labs VST state, with opaque content only understandable by
   *  the plugin. Contains all parameters also part of this message, which is why
   *  those are marked as immutable.
   *
   *  If the state cannot be read by the Spitfire LABS plugin, this will keep
   *  working with existing values. The DAW will likely overwrite it soon with
   *  valid values.
   *
   *  If the state contains a sample pack that the user doesn't have installed,
   *  the user won't hear any sound (the plugin UI shows some error), otherwise
   *  it will continue working as expected.
   */
  state?: Uint8Array
}

