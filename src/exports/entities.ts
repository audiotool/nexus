/**
 * @packageDocumentation
 * Contains the field types of all possible entities in the nexus document.
 *
 * To create an entity marked with `Entity key: "foo"` use the `create` method
 * of the transaction builder as follows:
 * ```ts
 * const foo = t.create("foo", {})
 * ```
 *
 * @categoryDescription Device Entities
 * Audio Device Entities are entities representing devices that are placed on the desktop.
 *
 *
 *
 * They're the main building blocks of the audio processing graph. Some of the types below are actual entities, some
 * are just fields of entities.
 *
 *
 *
 * All devices have `positionX` and `positionY` fields that can be used to position the device on the desktop, and
 * a `displayName` field that can be used to name the device. They can be connected using {@link entities.DesktopAudioCable} and {@link entities.DesktopNoteCable}.
 *
 *
 *
 * The DAW will manage placement of these devices so they don't overlap whenever the user moves them.
 *
 * @categoryDescription Mixer Entities
 * Mixer related entities are entities with which the main audiotool mixer is configured. An audiotool project must
 * contain an {@link entities.MixerMaster} entity in order to produce sound. To connect an audio device to the mixer,
 * create a {@link entities.MixerChannel} entity and connect a device to it through the field {@link entities.MixerChannel.audioInput}
 * using a {@link entities.DesktopAudioCable}.
 *
 * @categoryDescription Timeline Entities
 * These are entities that are built to build the timeline - be it note tracks, audio tracks, automation tracks, or pattern tracks.
 *
 * @categoryDescription Utility Entities
 * Utility types and helper entities used throughout the system.
 */

export * from "@gen/document/v1/empty_nexus"
export * from "@gen/document/v1/entity/adsr_envelope/v1/adsr_envelope_nexus"
export * from "@gen/document/v1/entity/audio_device/v1/audio_device_nexus"
export * from "@gen/document/v1/entity/audio_merger/v1/audio_merger_nexus"
export * from "@gen/document/v1/entity/audio_splitter/v1/audio_splitter_nexus"
export * from "@gen/document/v1/entity/auto_filter/v1/auto_filter_nexus"
export * from "@gen/document/v1/entity/band_splitter/v1/band_splitter_nexus"
export * from "@gen/document/v1/entity/bassline/v1/bassline_nexus"
export * from "@gen/document/v1/entity/beatbox8/v1/beatbox8_nexus"
export * from "@gen/document/v1/entity/beatbox9/v1/beatbox9_nexus"
export * from "@gen/document/v1/entity/centroid/v1/centroid_nexus"
export * from "@gen/document/v1/entity/config/v1/config_nexus"
export * from "@gen/document/v1/entity/crossfader/v1/crossfader_nexus"
export * from "@gen/document/v1/entity/curve/v1/curve_nexus"
export * from "@gen/document/v1/entity/desktop_audio_cable/v1/desktop_audio_cable_nexus"
export * from "@gen/document/v1/entity/desktop_note_cable/v1/desktop_note_cable_nexus"
export * from "@gen/document/v1/entity/exciter/v1/exciter_nexus"
export * from "@gen/document/v1/entity/gakki/v1/gakki_nexus"
export * from "@gen/document/v1/entity/graphical_eq/v1/graphical_eq_nexus"
export * from "@gen/document/v1/entity/gravity/v1/gravity_nexus"
export * from "@gen/document/v1/entity/groove/v1/groove_nexus"
export * from "@gen/document/v1/entity/heisenberg/v1/heisenberg_nexus"
export * from "@gen/document/v1/entity/helmholtz/v1/helmholtz_nexus"
export * from "@gen/document/v1/entity/kobolt/v1/kobolt_nexus"
export * from "@gen/document/v1/entity/machiniste/v1/machiniste_nexus"
export * from "@gen/document/v1/entity/matrix_arpeggiator/v1/matrix_arpeggiator_nexus"
export * from "@gen/document/v1/entity/micro_tuning_octave/v1/micro_tuning_octave_nexus"
export * from "@gen/document/v1/entity/minimixer/v1/minimixer_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_aux_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_aux_route_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_channel_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_compressor_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_delay_aux_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_eq_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_group_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_master_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_reverb_aux_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_side_chain_cable_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_strip_display_parameters_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_strip_fader_parameters_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_strip_grouping_nexus"
export * from "@gen/document/v1/entity/mixer/v1/mixer_trim_filter_nexus"
export * from "@gen/document/v1/entity/note_splitter/v1/note_splitter_nexus"
export * from "@gen/document/v1/entity/panorama/v1/panorama_nexus"
export * from "@gen/document/v1/entity/pulsar/v1/pulsar_nexus"
export * from "@gen/document/v1/entity/pulverisateur/v1/pulverisateur_nexus"
export * from "@gen/document/v1/entity/quantum/v1/quantum_nexus"
export * from "@gen/document/v1/entity/quasar/v1/quasar_nexus"
export * from "@gen/document/v1/entity/rasselbock/v1/rasselbock_nexus"
export * from "@gen/document/v1/entity/region/v1/region_nexus"
export * from "@gen/document/v1/entity/ring_modulator/v1/ring_modulator_nexus"
export * from "@gen/document/v1/entity/sample/v1/sample_nexus"
export * from "@gen/document/v1/entity/space/v1/space_nexus"
export * from "@gen/document/v1/entity/spitfire_labs_vst3_plugin/v1/spitfire_labs_vst3_plugin_nexus"
export * from "@gen/document/v1/entity/stereo_enhancer/v1/stereo_enhancer_nexus"
export * from "@gen/document/v1/entity/stompbox_chorus/v1/stompbox_chorus_nexus"
export * from "@gen/document/v1/entity/stompbox_compressor/v1/stompbox_compressor_nexus"
export * from "@gen/document/v1/entity/stompbox_crusher/v1/stompbox_crusher_nexus"
export * from "@gen/document/v1/entity/stompbox_delay/v1/stompbox_delay_nexus"
export * from "@gen/document/v1/entity/stompbox_flanger/v1/stompbox_flanger_nexus"
export * from "@gen/document/v1/entity/stompbox_gate/v1/stompbox_gate_nexus"
export * from "@gen/document/v1/entity/stompbox_parametric_equalizer/v1/stompbox_parametric_equalizer_nexus"
export * from "@gen/document/v1/entity/stompbox_phaser/v1/stompbox_phaser_nexus"
export * from "@gen/document/v1/entity/stompbox_pitch_delay/v1/stompbox_pitch_delay_nexus"
export * from "@gen/document/v1/entity/stompbox_reverb/v1/stompbox_reverb_nexus"
export * from "@gen/document/v1/entity/stompbox_slope/v1/stompbox_slope_nexus"
export * from "@gen/document/v1/entity/stompbox_stereo_detune/v1/stompbox_stereo_detune_nexus"
export * from "@gen/document/v1/entity/stompbox_tube/v1/stompbox_tube_nexus"
export * from "@gen/document/v1/entity/timeline/v1/audio/audio_region_nexus"
export * from "@gen/document/v1/entity/timeline/v1/audio/audio_track_nexus"
export * from "@gen/document/v1/entity/timeline/v1/automation/automation_collection_nexus"
export * from "@gen/document/v1/entity/timeline/v1/automation/automation_event_nexus"
export * from "@gen/document/v1/entity/timeline/v1/automation/automation_region_nexus"
export * from "@gen/document/v1/entity/timeline/v1/automation/automation_track_nexus"
export * from "@gen/document/v1/entity/timeline/v1/automation/tempo_automation_track_nexus"
export * from "@gen/document/v1/entity/timeline/v1/note/note_collection_nexus"
export * from "@gen/document/v1/entity/timeline/v1/note/note_nexus"
export * from "@gen/document/v1/entity/timeline/v1/note/note_region_nexus"
export * from "@gen/document/v1/entity/timeline/v1/note/note_track_nexus"
export * from "@gen/document/v1/entity/timeline/v1/pattern/pattern_region_nexus"
export * from "@gen/document/v1/entity/timeline/v1/pattern/pattern_track_nexus"
export * from "@gen/document/v1/entity/tiny_gain/v1/tiny_gain_nexus"
export * from "@gen/document/v1/entity/tonematrix/v1/tonematrix_nexus"
export * from "@gen/document/v1/entity/waveshaper/v1/waveshaper_nexus"
