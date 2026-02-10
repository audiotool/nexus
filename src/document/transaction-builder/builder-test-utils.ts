import type { Modification } from "@gen/document/v1/document_service_pb"
import { Transaction } from "@gen/document/v1/document_service_pb"
import type { TransactionBuilder } from "."
import { nexusDocumentState } from "../document-state/state"
import { EntityQuery } from "../query/entity"
import { transactionBuilder } from "./builder"

/** This is a utility for writing tests that need transactions.
 *
 * Creates a transaction builder, and collects all modifications that are applied to it.
 */
export const collectingTransactionBuilder = (): {
  t: TransactionBuilder
  /** wraps the modifications in a transaction */
  getTransaction: () => Transaction
  modifications: Modification[]
} => {
  const modifications: Modification[] = []
  const documentState = nexusDocumentState()
  const query = new EntityQuery({ documentState: documentState })
  const builder = transactionBuilder({
    query,

    applyModification: (mod) => {
      modifications.push(mod)
      documentState.applyModification(mod)
    },
  })
  return {
    t: builder,
    modifications,
    getTransaction: () => new Transaction({ modifications }),
  }
}

/** If you really only need the transaction builder, use this. */
export const onlyTransactionBuilder = (): TransactionBuilder => {
  const documentState = nexusDocumentState()
  const query = new EntityQuery({ documentState: documentState })
  const builder = transactionBuilder({
    query,

    applyModification: (mod) => {
      documentState.applyModification(mod)
    },
  })
  return builder
}
