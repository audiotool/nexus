import type { AudioDeviceConstructor } from "@gen/document/v1/entity/audio_device/v1/audio_device_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const audioDeviceDefaults: Defaults<AudioDeviceConstructor> = {
  ...defaultDisplayParams,
  displayName: "AudioDevice",
  gain: 0.7079399824142456,
  panning: 0,
  isActive: true,
}
