import type { GakkiConstructor } from "@gen/document/v1/entity/gakki/v1/gakki_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

// Default sound font id ("Acoustic Piano") for the Gakki device. Matches
// `DEFAULT_GAKKI_SOUND_FONT_ID` in the studio codebase.
const DEFAULT_GAKKI_SOUND_FONT_ID = "56ada375-bc78-4912-b447-d80e06457a80"

export const gakkiDefaults: Defaults<GakkiConstructor> = {
  ...defaultDisplayParams,
  displayName: "Gakki",
  soundfontId: DEFAULT_GAKKI_SOUND_FONT_ID,
  gain: 0.6,
  presetName: "",
}
