import type { NexusValidator } from "../backend/validator"

export const mockNexusValidator = (): NexusValidator => ({
  validate: () => undefined,
  terminate: () => {}
})
