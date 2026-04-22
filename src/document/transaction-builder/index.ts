/**
 * This module contains functions that construct nexus `Modification` messages.
 *
 * The only functions that should ever be needed from this module are those exported here;
 * the others are just util functions that aid the function definitions below.
 */

export { buildModificationForEntityClone } from "./build-clone-entity"
export { buildModificationsForCloneLinkedEntities } from "./build-clone-linked-entities"
export { buildModificationForFieldReset } from "./build-field-reset"
export { buildModificationForFieldUpdate } from "./build-field-update"
export { buildModificationForNewEntity } from "./build-new-entity"
export { buildModificationForRemove } from "./build-remove"
export { buildModificationForRemoveWithDependencies } from "./build-remove-with-dependencies"

export { buildModificationsForPresetApplication } from "./build-preset-application"
export type { SafeTransactionBuilder, TransactionBuilder } from "./builder"
export { preparePreset } from "./prepare-preset"
