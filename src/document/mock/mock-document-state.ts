import type { WasmDocumentState } from "@document/backend/create-wasm-document-state"
import type { Transaction } from "@gen/document/v1/document_service_pb"

export class MockNexusDocumentState implements WasmDocumentState {
  applyTransaction(t: Transaction): string | Transaction {
    return t.clone()
  }
  terminate(): void {
    // do nothing
  }
}
