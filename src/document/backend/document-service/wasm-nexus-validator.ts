/** Validates all modification using the go wasm.
 *
 * If no argument is passed, it will create a new {@link WasmDocumentVerifier} internally.
 * This assumes the wasm state has been initialized, otherwise it will throw an error.
 */

import { Modification, Transaction } from "@gen/document/v1/document_service_pb"
import { getWasmDocumentState } from "../create-wasm-document-state"
import type { NexusValidator } from "../validator"

export const createWasmNexusValidator = async (): Promise<NexusValidator> => {
  const state = await getWasmDocumentState()
  return {
    validate: (mod: Modification): string | undefined => {
      const ret = state.applyTransaction(
        new Transaction({ modifications: [mod] }),
      )
      if (ret instanceof Transaction) {
        return undefined
      }
      return ret
    },
    terminate: () => {
      state.terminate()
    },
  }
}
