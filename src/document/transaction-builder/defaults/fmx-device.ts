import type { FmxDeviceConstructor } from "@gen/document/v1/entity/fmx_device/v1/fmx_device_nexus"
import type { Defaults } from "./default-type"

/**
 * `pluginAssetName` of a new device before a plugin is loaded into it. No
 * plugin is ever stored under this name.
 */
const emptyLocalPlugin =
  "localPluginAssets/00000000-0000-4000-8000-000000000000"

const parameterSlotCount = 1024

export const fmxDeviceDefaults: Defaults<FmxDeviceConstructor> = {
  positionX: 0,
  positionY: 0,
  displayName: "NXS",
  isActive: true,
  pluginAssetName: emptyLocalPlugin,
  parameters: Array.from({ length: parameterSlotCount }, () => 0),
  pluginState: new Uint8Array(0),
}
