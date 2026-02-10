// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"desktopAudioCable"`
 * is | {@link api.TargetType.Listenable}
 *
 *
 *  A cable connecting an audio output to an audio input on the desktop.
 *
 *
 * @category Utility Entities*/
export type DesktopAudioCable = {
  /**
   *  Pointer to an audio output from which the cable transports audio.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.AudioOutput}, meaning one of: <br />{@link entities.AudioDevice.audioOutput}, <br />{@link entities.AudioMerger.audioOutput}, <br />{@link entities.AudioSplitter.audioOutputA}, <br />{@link entities.AudioSplitter.audioOutputB}, <br />{@link entities.AudioSplitter.audioOutputC}, <br />{@link entities.AutoFilter.audioOutput}, <br />{@link entities.BandSplitter.highAudioOutput}, <br />{@link entities.BandSplitter.midAudioOutput}, <br />{@link entities.BandSplitter.lowAudioOutput}, <br />{@link entities.Bassline.audioOutput}, <br />{@link entities.Beatbox8.audioOutput}, <br />{@link entities.Beatbox8Bassdrum.audioOutput}, <br />{@link entities.Beatbox8Snaredrum.audioOutput}, <br />{@link entities.Beatbox8TomCongaLow.audioOutput}, <br />{@link entities.Beatbox8TomCongaMid.audioOutput}, <br />{@link entities.Beatbox8TomCongaHigh.audioOutput}, <br />{@link entities.Beatbox8RimClaves.audioOutput}, <br />{@link entities.Beatbox8ClapMaracas.audioOutput}, <br />{@link entities.Beatbox8Cowbell.audioOutput}, <br />{@link entities.Beatbox8Cymbal.audioOutput}, <br />{@link entities.Beatbox8OpenHihat.audioOutput}, <br />{@link entities.Beatbox8ClosedHihat.audioOutput}, <br />{@link entities.Beatbox9.audioOutput}, <br />{@link entities.Beatbox9Bassdrum.audioOutput}, <br />{@link entities.Beatbox9Snaredrum.audioOutput}, <br />{@link entities.Beatbox9Tom.audioOutput}, <br />{@link entities.Beatbox9Rim.audioOutput}, <br />{@link entities.Beatbox9Clap.audioOutput}, <br />{@link entities.Beatbox9Hihat.audioOutput}, <br />{@link entities.Beatbox9Crash.audioOutput}, <br />{@link entities.Beatbox9Ride.audioOutput}, <br />{@link entities.Centroid.audioOutput}, <br />{@link entities.CentroidAux.audioOutput}, <br />{@link entities.Crossfader.audioOutput}, <br />{@link entities.Curve.audioOutput}, <br />{@link entities.Exciter.audioOutput}, <br />{@link entities.Gakki.audioOutput}, <br />{@link entities.GraphicalEQ.audioOutput}, <br />{@link entities.Gravity.audioOutput}, <br />{@link entities.Heisenberg.audioOutput}, <br />{@link entities.Helmholtz.audioOutput}, <br />{@link entities.Kobolt.audioOutput}, <br />{@link entities.Machiniste.mainOutput}, <br />{@link entities.MachinisteChannel.channelOutput}, <br />{@link entities.Minimixer.mainOutput}, <br />{@link entities.Minimixer.auxSendOutput}, <br />{@link entities.MixerAux.insertOutput}, <br />{@link entities.MixerGroup.insertOutput}, <br />{@link entities.MixerMaster.insertOutput}, <br />{@link entities.Panorama.audioOutput}, <br />{@link entities.Pulsar.audioOutput}, <br />{@link entities.Pulverisateur.audioOutput}, <br />{@link entities.Quantum.audioOutput}, <br />{@link entities.Quasar.audioOutput}, <br />{@link entities.Rasselbock.masterOutput}, <br />{@link entities.RasselbockChannel.audioOutput}, <br />{@link entities.RingModulator.audioOutput}, <br />{@link entities.Space.audioOutput}, <br />{@link entities.SpitfireLabsVst3Plugin.audioOutput}, <br />{@link entities.StereoEnhancer.audioOutput}, <br />{@link entities.StompboxChorus.audioOutput}, <br />{@link entities.StompboxCompressor.audioOutput}, <br />{@link entities.StompboxCrusher.audioOutput}, <br />{@link entities.StompboxDelay.audioOutput}, <br />{@link entities.StompboxFlanger.audioOutput}, <br />{@link entities.StompboxGate.audioOutput}, <br />{@link entities.StompboxParametricEqualizer.audioOutput}, <br />{@link entities.StompboxPhaser.audioOutput}, <br />{@link entities.StompboxPitchDelay.audioOutput}, <br />{@link entities.StompboxReverb.audioOutput}, <br />{@link entities.StompboxSlope.audioOutput}, <br />{@link entities.StompboxStereoDetune.audioOutput}, <br />{@link entities.StompboxTube.audioOutput}, <br />{@link entities.TinyGain.audioOutput}, <br />{@link entities.Tonematrix.audioOutput}, <br />{@link entities.Waveshaper.audioOutput}*/
  fromSocket: PrimitiveField<NexusLocation, "mut">
  /**
   *  Pointer to an audio input to which the cable transports audio.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.AudioInput}, meaning one of: <br />{@link entities.AudioMerger.audioInputA}, <br />{@link entities.AudioMerger.audioInputB}, <br />{@link entities.AudioMerger.audioInputC}, <br />{@link entities.AudioSplitter.audioInput}, <br />{@link entities.AutoFilter.audioInput}, <br />{@link entities.AutoFilter.sideChainInput}, <br />{@link entities.BandSplitter.audioInput}, <br />{@link entities.Bassline.audioInput}, <br />{@link entities.CentroidAux.audioInput}, <br />{@link entities.CentroidChannel.audioInput}, <br />{@link entities.CrossfaderChannel.audioInput}, <br />{@link entities.Curve.audioInput}, <br />{@link entities.Exciter.audioInput}, <br />{@link entities.GraphicalEQ.audioInput}, <br />{@link entities.Gravity.audioInput}, <br />{@link entities.Gravity.sideChainInput}, <br />{@link entities.Helmholtz.audioInput}, <br />{@link entities.KoboltChannel.audioInput}, <br />{@link entities.Minimixer.auxReturnInput}, <br />{@link entities.MinimixerChannel.audioInput}, <br />{@link entities.MixerAux.insertInput}, <br />{@link entities.MixerChannel.audioInput}, <br />{@link entities.MixerGroup.insertInput}, <br />{@link entities.MixerMaster.insertInput}, <br />{@link entities.Panorama.audioInput}, <br />{@link entities.Pulsar.audioInput}, <br />{@link entities.Pulverisateur.audioInput}, <br />{@link entities.Quantum.audioInput}, <br />{@link entities.Quasar.audioInput}, <br />{@link entities.Rasselbock.audioInput}, <br />{@link entities.RingModulator.audioInput1}, <br />{@link entities.RingModulator.audioInput2}, <br />{@link entities.StereoEnhancer.audioInput}, <br />{@link entities.StompboxChorus.audioInput}, <br />{@link entities.StompboxCompressor.audioInput}, <br />{@link entities.StompboxCompressor.sideChainInput}, <br />{@link entities.StompboxCrusher.audioInput}, <br />{@link entities.StompboxDelay.audioInput}, <br />{@link entities.StompboxFlanger.audioInput}, <br />{@link entities.StompboxGate.audioInput}, <br />{@link entities.StompboxGate.sideChainInput}, <br />{@link entities.StompboxParametricEqualizer.audioInput}, <br />{@link entities.StompboxPhaser.audioInput}, <br />{@link entities.StompboxPitchDelay.audioInput}, <br />{@link entities.StompboxReverb.audioInput}, <br />{@link entities.StompboxSlope.audioInput}, <br />{@link entities.StompboxStereoDetune.audioInput}, <br />{@link entities.StompboxTube.audioInput}, <br />{@link entities.TinyGain.audioInput}, <br />{@link entities.Waveshaper.audioInput}, <br />{@link entities.Waveshaper.sideChainInput}*/
  toSocket: PrimitiveField<NexusLocation, "mut">
  /**
   *  Index of the color. The meaning of the color index is implementation-specific.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 41]*/
  colorIndex: PrimitiveField<number, "mut">
}
/** @internal */

export type DesktopAudioCableConstructor = {
  /**
   *  Pointer to an audio output from which the cable transports audio.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true*/
  fromSocket: NexusLocation
  /**
   *  Pointer to an audio input to which the cable transports audio.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true*/
  toSocket: NexusLocation
  /**
   *  Index of the color. The meaning of the color index is implementation-specific.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 41]*/
  colorIndex?: number
}

