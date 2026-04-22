import type { GenericVst3PluginBetaConstructor } from "@gen/document/v1/entity/generic_vst3_plugin_beta/v1/generic_vst3_plugin_beta_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const genericVst3PluginBetaDefaults: Defaults<GenericVst3PluginBetaConstructor> =
  {
    ...defaultDisplayParams,
    displayName: "",
    pluginPath: "",
    state: new Uint8Array(0),
    isActive: true,
  }
