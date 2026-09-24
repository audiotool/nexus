// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import type { NexusLocation } from "@document/location"
import type { NexusField } from "./fields"

/**
 * @internal*/
export type NexusFieldTypes = { [index: string]: NexusField }

/**
 * A "struct"/"object" like field in the document:
 * * fields of entities that are objects are a {@link NexusObject}
 * * {@link NexusEntity} inherits {@link NexusObject}
 */
export class NexusObject<F extends NexusFieldTypes = NexusFieldTypes>
  implements NexusField
{
  /** the fields in this object */
  fields: F
  location: NexusLocation

  /** @internal */
  constructor(fields: F, location: NexusLocation) {
    this.location = location
    this.fields = fields
  }

  /** @internal Returns the field with the given field number, or undefined if the SDK doesn't know it. */
  _getField(fieldNumber: number): NexusField | undefined {
    return Object.values(this.fields).find(
      (field) => field.location.fieldIndex.at(-1) === fieldNumber,
    )
  }
}
