import type { PulsarConstructor } from "@gen/document/v1/entity/pulsar/v1/pulsar_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const pulsarDefaults: Defaults<PulsarConstructor> = {
  ...defaultDisplayParams,
  displayName: "Pulsar Delay",
  preDelayLeftTimeSemibreveIndex: 1,
  preDelayLeftTimeMs: 0,
  preDelayLeftPanning: -1,
  preDelayRightTimeSemibreveIndex: 3,
  preDelayRightTimeMs: 0,
  preDelayRightPanning: 1,
  feedbackDelayTimeSemibreveIndex: 1,
  feedbackDelayTimeMs: 0,
  lfoSpeedHz: 5,
  lfoModulationDepthMs: 0,
  feedbackFactor: 0.7,
  stereoCrossFactor: 1,
  filterMinHz: 20,
  filterMaxHz: 20000,
  dryGain: 1,
  wetGain: 0.7,
  isActive: true,
  presetName: "",
}
