import { NexusLocation } from "@document/location"
import type { AudioRegionConstructor } from "@gen/document/v1/entity/timeline/v1/audio/audio_region_nexus"
import type { AudioTrackConstructor } from "@gen/document/v1/entity/timeline/v1/audio/audio_track_nexus"
import type { AutomationCollectionConstructor } from "@gen/document/v1/entity/timeline/v1/automation/automation_collection_nexus"
import type { AutomationEventConstructor } from "@gen/document/v1/entity/timeline/v1/automation/automation_event_nexus"
import type { AutomationRegionConstructor } from "@gen/document/v1/entity/timeline/v1/automation/automation_region_nexus"
import type { AutomationTrackConstructor } from "@gen/document/v1/entity/timeline/v1/automation/automation_track_nexus"
import type { TempoAutomationTrackConstructor } from "@gen/document/v1/entity/timeline/v1/automation/tempo_automation_track_nexus"
import type { NoteCollectionConstructor } from "@gen/document/v1/entity/timeline/v1/note/note_collection_nexus"
import type { NoteConstructor } from "@gen/document/v1/entity/timeline/v1/note/note_nexus"
import type { NoteRegionConstructor } from "@gen/document/v1/entity/timeline/v1/note/note_region_nexus"
import type { NoteTrackConstructor } from "@gen/document/v1/entity/timeline/v1/note/note_track_nexus"
import type { PatternRegionConstructor } from "@gen/document/v1/entity/timeline/v1/pattern/pattern_region_nexus"
import type { PatternTrackConstructor } from "@gen/document/v1/entity/timeline/v1/pattern/pattern_track_nexus"
import type { Defaults } from "./default-type"

const defaultRegion = {
  positionTicks: 0,
  durationTicks: 15360,
  collectionOffsetTicks: 0,
  loopOffsetTicks: 0,
  loopDurationTicks: 15360,
  isEnabled: true,
  colorIndex: 0,
  displayName: "",
}

export const audioRegionDefaults: Defaults<AudioRegionConstructor> = {
  region: defaultRegion,
  gain: 1,
  fadeInDurationTicks: 10,
  fadeInSlope: 0,
  fadeOutDurationTicks: 10,
  fadeOutSlope: 0,
  timestretchMode: 2,
  pitchShiftSemitones: 0,
}

export const audioTrackDefaults: Defaults<AudioTrackConstructor> = {
  orderAmongTracks: 0,
  isEnabled: true,
  groove: new NexusLocation(),
}

export const automationCollectionDefaults: Defaults<AutomationCollectionConstructor> =
  {}

export const automationEventDefaults: Defaults<AutomationEventConstructor> = {
  positionTicks: 0,
  value: 0,
  slope: 0,
  interpolation: 1,
  isSecond: false,
}

export const automationRegionDefaults: Defaults<AutomationRegionConstructor> = {
  region: defaultRegion,
}

export const automationTrackDefaults: Defaults<AutomationTrackConstructor> = {
  orderAmongTracks: 0,
  isEnabled: true,
}

export const tempoAutomationTrackDefaults: Defaults<TempoAutomationTrackConstructor> =
  {
    isEnabled: true,
  }

export const noteDefaults: Defaults<NoteConstructor> = {
  positionTicks: 0,
  durationTicks: 960,
  pitch: 60,
  velocity: 0.699999988079071,
  doesSlide: false,
}

export const noteCollectionDefaults: Defaults<NoteCollectionConstructor> = {}

export const noteRegionDefaults: Defaults<NoteRegionConstructor> = {
  region: defaultRegion,
}

export const noteTrackDefaults: Defaults<NoteTrackConstructor> = {
  orderAmongTracks: 0,
  isEnabled: true,
  groove: new NexusLocation(),
}

export const patternRegionDefaults: Defaults<PatternRegionConstructor> = {
  region: defaultRegion,
  patternIndex: 0,
  restart: false,
}

export const patternTrackDefaults: Defaults<PatternTrackConstructor> = {
  orderAmongTracks: 0,
  isEnabled: true,
}
