import type { ConfigConstructor } from "@gen/document/v1/entity/config/v1/config_nexus"
import type { Defaults } from "./default-type"

export const configDefaults: Defaults<ConfigConstructor> = {
  tempoBpm: 125,
  baseFrequencyHz: 440,
  signatureNumerator: 4,
  signatureDenominator: 4,
  durationTicks: 1966080,
}
