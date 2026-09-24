import type { PulsarConstructor } from "@gen/document/v1/entity/pulsar/v1/pulsar_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const pulsarDefaults: Defaults<PulsarConstructor> = {
  ...defaultDisplayParams,
  displayName: "Pulsar Delay",
  preDelayLeftTimeSemibreveIndex: 6,
  preDelayLeftTimeMs: 0,
  preDelayLeftPanning: -1,
  preDelayRightTimeSemibreveIndex: 1,
  preDelayRightTimeMs: 0,
  preDelayRightPanning: 1,
  feedbackDelayTimeSemibreveIndex: 6,
  feedbackDelayTimeMs: 0,
  lfoSpeedHz: 5,
  lfoModulationDepthMs: 0,
  feedbackFactor: 0.6240000128746033,
  stereoCrossFactor: 0.8009999990463257,
  filterMinHz: 20,
  filterMaxHz: 20000,
  dryGain: 1,
  wetGain: 0.335999995470047,
  isActive: true,
  presetName: "",
}
