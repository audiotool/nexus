import type {
  CentroidChannelConstructor,
  CentroidConstructor,
} from "@gen/document/v1/entity/centroid/v1/centroid_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const centroidDefaults: Defaults<CentroidConstructor> = {
  ...defaultDisplayParams,
  displayName: "Centroid",
  postGain: 1,
  panning: 0,
  aux1: {
    sendGain: 1,
  },
  aux2: {
    sendGain: 1,
  },
}

export const centroidChannelDefaults: Defaults<CentroidChannelConstructor> = {
  displayName: "Channel",
  postGain: 1,
  panning: 0,
  orderAmongChannels: 0,
  isMuted: false,
  isSoloed: false,
  useAuxPreMode: false,
  preGain: 1,
  eqHighGainDb: 0,
  eqMidFrequency: 1000,
  eqMidGainDb: 0,
  eqLowGainDb: 0,
  aux1SendGain: 0,
  aux2SendGain: 0,
}
