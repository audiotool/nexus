import { packedEntity } from "@document/entity-utils"
import { Modification } from "@gen/document/v1/document_service_pb"
import { Pointer } from "@gen/document/v1/pointer_pb"
import type { DeepPartial } from "utility-types"
import { describe, expect, it, vi } from "vitest"
import type { NexusEntity } from "../entity"
import { NexusLocation } from "../location"
import { nexusDocumentState } from "./state"

describe("NexusDocumentState", () => {
  describe("NexusDocumentState startup", () => {
    it("should have no entities on startup", () => {
      const state = nexusDocumentState()
      expect(state.entities.size).toBe(0)
    })

    it("should have no references on startup", () => {
      const state = nexusDocumentState()
      expect(state.references.size).toBe(0)
    })
  })

  describe("NexusDocumentState resolving entity type fails", () => {
    it("throws if entity type of updated pointer isn't known", () => {
      const state = nexusDocumentState()
      state.applyModification(noteTrackCreate("id"))
      // it will try to create a nexus location pointing to `"foo"`, which requires
      // that the type of the thing being pointed to is known. The following tests
      // will all do `_addEntityTypeForId` to add the type, but here we make sure it
      // fails if this isn't done.
      expect(() =>
        state.applyModification(
          new Modification({
            modification: {
              case: "update",
              value: {
                field: {
                  entityId: "id",
                  fieldIndex: [5], // field "player"
                },
                value: {
                  case: "pointer",
                  value: {
                    entityId: "foo",
                    fieldIndex: [2, 3],
                  },
                },
              },
            },
          }),
        ),
      ).toThrow()
    })

    it("throws if entity that's updated isn't known", () => {
      const state = nexusDocumentState()
      state._addEntityTypeForId("foo", "noteTrack")
      expect(() =>
        state.applyModification(
          new Modification({
            modification: {
              case: "update",
              value: {
                field: {
                  entityId: "id",
                  fieldIndex: [5], // field "player"
                },
                value: {
                  case: "pointer",
                  value: {
                    entityId: "foo",
                    fieldIndex: [2, 3],
                  },
                },
              },
            },
          }),
        ),
      ).toThrow()
    })
  })

  describe("NexusDocumentState creates entities", () => {
    const tinyGainCreate = (id: string) =>
      new Modification({
        modification: {
          case: "create",
          value: {
            entity: packedEntity("tinyGain", {
              audioInput: {},
              audioOutput: {},
              id,
              gain: 2,
              isActive: true,
              isMuted: false,
            }),
          },
        },
      })

    describe("tinyGain", () => {
      it("should create an entity", () => {
        const state = nexusDocumentState()
        state.applyModification(tinyGainCreate("id"))
        expect(state.entities.size).toBe(1)
      })

      it("should remove an entity", () => {
        const state = nexusDocumentState()
        state.applyModification(tinyGainCreate("id"))

        state.applyModification(
          new Modification({
            modification: {
              case: "delete",
              value: {
                entityId: "id",
              },
            },
          }),
        )
        expect(state.entities.size).toBe(0)
      })

      it("should create the correct entity", () => {
        const state = nexusDocumentState()
        state.applyModification(
          new Modification({
            modification: {
              case: "create",
              value: {
                entity: packedEntity("tinyGain", {
                  audioInput: {},
                  audioOutput: {},
                  id: "id",
                  gain: 2,
                  isActive: true,
                  isMuted: false,
                }),
              },
            },
          }),
        )

        const loc = (idx: number[]) => new NexusLocation("id", "tinyGain", idx)
        expect(state.entities.get("id")).toMatchObject({
          entityType: "tinyGain",
          id: "id",
          fields: {
            gain: {
              location: loc([7]),
              value: 2,
              mutable: true,
              _protoType: "float",
            },
            isActive: {
              location: loc([9]),
              value: true,
              mutable: true,
              _protoType: "bool",
            },
            isMuted: {
              location: loc([8]),
              value: false,
              mutable: true,
              _protoType: "bool",
            },
          },
        } satisfies DeepPartial<NexusEntity<"tinyGain">>)
      })

      it("should init uninitialized fields", () => {
        const state = nexusDocumentState()
        state.applyModification(
          new Modification({
            modification: {
              case: "create",
              value: {
                entity: packedEntity("tinyGain", {
                  audioInput: {},
                  audioOutput: {},
                  id: "id",
                }),
              },
            },
          }),
        )

        expect(state.entities.get("id")).toMatchObject({
          entityType: "tinyGain",
          id: "id",
          fields: {
            gain: {
              location: {
                entityId: "id",
                entityType: "tinyGain",
                fieldIndex: [7],
              },
              value: 0,
              mutable: true,
              _protoType: "float",
            },
          },
        } satisfies DeepPartial<NexusEntity<"tinyGain">>)
      })

      it("should update the entity correctly", () => {
        const state = nexusDocumentState()
        state.applyModification(tinyGainCreate("id"))

        state.applyModification(
          new Modification({
            modification: {
              case: "update",
              value: {
                field: {
                  entityId: "id",
                  fieldIndex: [7],
                },
                value: {
                  case: "float",
                  value: 2,
                },
              },
            },
          }),
        )
        const loc = (idx: number[]) => new NexusLocation("id", "tinyGain", idx)
        expect(state.entities.get("id")).toMatchObject({
          entityType: "tinyGain",
          id: "id",
          fields: {
            gain: {
              location: loc([7]),
              value: 2,
              mutable: true,
              _protoType: "float",
            },
            isActive: {
              location: loc([9]),
              value: true,
              mutable: true,
              _protoType: "bool",
            },
            isMuted: {
              location: loc([8]),
              value: false,
              mutable: true,
              _protoType: "bool",
            },
          },
        } satisfies DeepPartial<NexusEntity<"tinyGain">>)
      })
    })

    // the helmholtz is a good test candidate because it has fields embedded
    // in arrays
    describe("helmholtz", () => {
      it("should create the helmholtz correctly with arrays", () => {
        const state = nexusDocumentState()
        state.applyModification(
          new Modification({
            modification: {
              case: "create",
              value: {
                entity: packedEntity("helmholtz", {
                  id: "id",
                  microTuning: {
                    entityId: "",
                    fieldIndex: [],
                  },
                  filters: [{}, {}, {}, {}, {}],
                  audioInput: {},
                  audioOutput: {},
                }),
              },
            },
          }),
        )
        const loc = (idx: number[]) => new NexusLocation("id", "helmholtz", idx)
        expect(state.entities.get("id")).toMatchObject({
          entityType: "helmholtz",
          id: "id",
          fields: {
            microTuning: {
              location: loc([5]),
              value: {
                entityId: "",
                fieldIndex: [],
              },
              mutable: true,
              _protoType: "pointer",
            },

            filters: {
              // location of repeated field
              location: loc([10]),
              array: [
                {
                  // location of first element in array
                  location: loc([10, 0]),
                  // content of first element in array
                  fields: {
                    gain: {
                      location: loc([10, 0, 2]),
                      value: 0,
                      mutable: true,
                      _protoType: "float",
                    },
                    panning: {
                      location: loc([10, 0, 3]),
                      value: 0,
                      mutable: true,
                      _protoType: "float",
                    },
                  },
                },
                {
                  // location of second element in array
                  location: loc([10, 1]),
                  // content of second element in array
                  fields: {
                    gain: {
                      location: loc([10, 1, 2]),
                      value: 0,
                      mutable: true,
                      _protoType: "float",
                    },
                    panning: {
                      location: loc([10, 1, 3]),
                      value: 0,
                      mutable: true,
                      _protoType: "float",
                    },
                  },
                },
                // etc; omitted for brevity
                {},
                {},
                {},
                // must specify length here or TS will complain
              ] as { length: 5 },
            },
          },
        } satisfies DeepPartial<NexusEntity<"helmholtz">>)
      })
      it("should update an array field correctly", () => {
        const state = nexusDocumentState()
        state.applyModification(
          new Modification({
            modification: {
              case: "create",
              value: {
                entity: packedEntity("helmholtz", {
                  id: "id",
                  microTuning: {
                    entityId: "",
                    fieldIndex: [],
                  },
                  filters: [{}, {}, {}, {}, {}],
                  audioInput: {},
                  audioOutput: {},
                }),
              },
            },
          }),
        )

        state.applyModification(
          new Modification({
            modification: {
              case: "update",
              value: {
                field: {
                  entityId: "id",
                  fieldIndex: [10, 1, 3],
                },
                value: {
                  case: "float",
                  value: 0.5,
                },
              },
            },
          }),
        )

        expect(state.entities.get("id")).toMatchObject({
          entityType: "helmholtz",
          id: "id",
          fields: {
            filters: {
              array: [
                {},
                {
                  fields: {
                    panning: {
                      location: {
                        entityId: "id",
                        fieldIndex: [10, 1, 3],
                      },
                      value: 0.5, // updated
                      mutable: true,
                      _protoType: "float",
                    },
                  },
                },
                {},
                {},
                {},
              ] as { length: 5 },
            },
          },
        } satisfies DeepPartial<NexusEntity<"helmholtz">>)
      })

      it("should update an pointer field correctly", () => {
        const state = nexusDocumentState()
        state.applyModification(
          new Modification({
            modification: {
              case: "create",
              value: {
                entity: packedEntity("helmholtz", {
                  id: "id",
                  microTuning: {
                    entityId: "",
                    fieldIndex: [],
                  },
                  filters: [{}, {}, {}, {}, {}],
                  audioInput: {},
                  audioOutput: {},
                }),
              },
            },
          }),
        )
        state._addEntityTypeForId("test", "microTuningOctave")

        state.applyModification(
          new Modification({
            modification: {
              case: "update",
              value: {
                field: {
                  entityId: "id",
                  fieldIndex: [5],
                },
                value: {
                  case: "pointer",
                  value: {
                    entityId: "test",
                    fieldIndex: [1, 2, 3],
                  },
                },
              },
            },
          }),
        )

        expect(state.entities.get("id")).toMatchObject({
          entityType: "helmholtz",
          id: "id",
          fields: {
            // updated
            microTuning: {
              location: {
                entityId: "id",
                entityType: "helmholtz",
                fieldIndex: [5],
              },
              value: {
                entityId: "test",
                entityType: "microTuningOctave",
                fieldIndex: [1, 2, 3],
              },
              mutable: true,
              _protoType: "pointer",
            },
          },
        } satisfies DeepPartial<NexusEntity<"helmholtz">>)
      })
    })
  })

  describe("NexusDocumentState callbacks", () => {
    it("should call onCreate", () => {
      const onCreate = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onCreate,
        },
      })
      state.applyModification(noteTrackCreate("id"))
      expect(onCreate).toHaveBeenCalledWith(state.entities.get("id"))
    })

    it("should call onUpdate on primitive field", () => {
      const onUpdate = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onUpdate,
        },
      })
      state.applyModification(noteTrackCreate("id"))
      state.applyModification(
        new Modification({
          modification: {
            case: "update",
            value: {
              field: {
                entityId: "id",
                fieldIndex: [2], // field "orderAmongTracks"
              },
              value: {
                case: "float",
                value: 44,
              },
            },
          },
        }),
      )
      expect(onUpdate).toHaveBeenCalledWith(
        new NexusLocation("id", "noteTrack", [2]),
        44,
      )
    })

    it("should call onUpdate on pointer field", () => {
      const onUpdate = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onUpdate,
        },
      })
      state.applyModification(noteTrackCreate("id"))
      state._addEntityTypeForId("foo", "heisenberg")
      state.applyModification(
        new Modification({
          modification: {
            case: "update",
            value: {
              field: {
                entityId: "id",
                fieldIndex: [5], // field "player"
              },
              value: {
                case: "pointer",
                value: {
                  entityId: "foo",
                  fieldIndex: [2, 3],
                },
              },
            },
          },
        }),
      )
      expect(onUpdate).toHaveBeenCalledWith(
        new NexusLocation("id", "noteTrack", [5]),
        new NexusLocation("foo", "heisenberg", [2, 3]),
      )
    })

    it("should call onUpdate on field in an array", () => {
      const onUpdate = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onUpdate,
        },
      })
      state.applyModification(
        new Modification({
          modification: {
            case: "create",
            value: {
              entity: packedEntity("helmholtz", {
                id: "id",
                microTuning: {
                  entityId: "",
                  fieldIndex: [],
                },
                filters: [{}, {}, {}, {}, {}],
                audioInput: {},
                audioOutput: {},
              }),
            },
          },
        }),
      )
      state.applyModification(
        new Modification({
          modification: {
            case: "update",
            value: {
              field: {
                entityId: "id",
                fieldIndex: [10, 3, 3], // field "helmholtz/filters/3/panning"
              },
              value: {
                case: "float",
                value: 22,
              },
            },
          },
        }),
      )
      expect(onUpdate).toHaveBeenCalledWith(
        new NexusLocation("id", "helmholtz", [10, 3, 3]),
        22,
      )
    })

    it("should call onDelete", () => {
      const onDelete = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onDelete,
        },
      })
      state.applyModification(noteTrackCreate("id"))
      const placement = state.entities.get("id")
      state.applyModification(
        new Modification({
          modification: {
            case: "delete",
            value: {
              entityId: "id",
            },
          },
        }),
      )
      expect(onDelete).toHaveBeenCalledWith(placement)
    })

    it("should not call onStartPointingTo if pointer is not set", () => {
      const onStartPointingTo = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onStartPointingTo,
        },
      })
      state.applyModification(noteTrackCreate("id"))
      state.applyModification(
        new Modification({
          modification: {
            case: "delete",
            value: {
              entityId: "id",
            },
          },
        }),
      )
      expect(onStartPointingTo).not.toHaveBeenCalled()
    })

    it("should call onStartPointingTo if pointer is set", () => {
      const onStartPointingTo = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onStartPointingTo,
        },
      })
      state._addEntityTypeForId("target", "tonematrix")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "target",
            fieldIndex: [2, 3],
          }),
        ),
      )
      state.applyModification(
        new Modification({
          modification: {
            case: "delete",
            value: {
              entityId: "id",
            },
          },
        }),
      )
      expect(onStartPointingTo).toHaveBeenCalledWith(
        // field `noteTrack/player`
        new NexusLocation("id", "noteTrack", [5]),
        new NexusLocation("target", "tonematrix", [2, 3]),
      )
    })

    it("should call onStopPointingTo if pointer is updated", () => {
      const onStopPointingTo = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onStopPointingTo,
        },
      })
      state._addEntityTypeForId("old target", "tonematrix")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "old target",
            fieldIndex: [2, 3],
          }),
        ),
      )
      state._addEntityTypeForId("new target", "heisenberg")
      state.applyModification(
        new Modification({
          modification: {
            case: "update",

            value: {
              field: {
                entityId: "id",
                fieldIndex: [5],
              },
              value: {
                case: "pointer",
                value: {
                  entityId: "new target",
                  fieldIndex: [2, 3],
                },
              },
            },
          },
        }),
      )
      expect(onStopPointingTo).toHaveBeenCalledWith(
        new NexusLocation("id", "noteTrack", [5]),
        new NexusLocation("old target", "tonematrix", [2, 3]),
      )
    })

    it("should call onStartPointingTo if pointer is updated", () => {
      const onStartPointingTo = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onStartPointingTo,
        },
      })

      state._addEntityTypeForId("old target", "tonematrix")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "old target",
            fieldIndex: [2, 3],
          }),
        ),
      )
      state._addEntityTypeForId("new target", "heisenberg")
      state.applyModification(
        new Modification({
          modification: {
            case: "update",

            value: {
              field: {
                entityId: "id",
                fieldIndex: [5],
              },
              value: {
                case: "pointer",
                value: {
                  entityId: "new target",
                  fieldIndex: [2, 3],
                },
              },
            },
          },
        }),
      )
      expect(onStartPointingTo).toHaveBeenLastCalledWith(
        // field `noteTrack/player`
        new NexusLocation("id", "noteTrack", [5]),
        new NexusLocation("new target", "heisenberg", [2, 3]),
      )
    })

    it("should not call onStartPointingTo if pointer is updated to empty", () => {
      const onStartPointingTo = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onStartPointingTo,
        },
      })
      state._addEntityTypeForId("old target", "tonematrix")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "old target",
            fieldIndex: [2, 3],
          }),
        ),
      )
      state._addEntityTypeForId("target", "noteTrack")
      state.applyModification(
        new Modification({
          modification: {
            case: "update",

            value: {
              field: {
                entityId: "id",
                fieldIndex: [5],
              },
              value: {
                case: "pointer",
                // empty pointer
                value: {
                  entityId: "",
                  fieldIndex: [],
                },
              },
            },
          },
        }),
      )
      // only called once on entity creation
      expect(onStartPointingTo).toHaveBeenCalledTimes(1)
    })

    it("should call onStopPointingTo if entity is removed", () => {
      const onStopPointingTo = vi.fn()
      const state = nexusDocumentState({
        callbacks: {
          onStopPointingTo,
        },
      })
      state._addEntityTypeForId("target", "noteTrack")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "target",
            fieldIndex: [2, 3],
          }),
        ),
      )
      state.applyModification(
        new Modification({
          modification: {
            case: "delete",

            value: {
              entityId: "id",
            },
          },
        }),
      )
      expect(onStopPointingTo).toHaveBeenCalledWith(
        // field `noteTrack/player`
        new NexusLocation("id", "noteTrack", [5]),
        new NexusLocation("target", "noteTrack", [2, 3]),
      )
    })
  })

  describe("NexusDocumentState keeps track of references", () => {
    it("should not update references if pointer is unset", () => {
      const state = nexusDocumentState()
      state.applyModification(noteTrackCreate("id"))
      expect(state.references.size).toBe(0)
    })

    it("should update references if pointer is set", () => {
      const state = nexusDocumentState()
      state._addEntityTypeForId("foo", "noteTrack")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "foo",
            fieldIndex: [2, 3],
          }),
        ),
      )
      expect(state.references.size).toBe(1)
    })

    it("should update references with correct content if pointer is set", () => {
      const state = nexusDocumentState()

      state._addEntityTypeForId("foo", "noteTrack")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "foo",
            fieldIndex: [2, 3],
          }),
        ),
      )
      expect([...state.references.entries()]).toMatchObject([
        [
          new NexusLocation("foo", "noteTrack", [2, 3]), // target
          [new NexusLocation("id", "noteTrack", [5])], // sources
        ],
      ])
    })

    it("should merge source references if multiple entities are created pointing to the same thing", () => {
      const state = nexusDocumentState()

      state._addEntityTypeForId("foo", "noteTrack")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "foo",
            fieldIndex: [2, 3],
          }),
        ),
      )

      state.applyModification(
        noteTrackCreate(
          "id2",
          new Pointer({
            entityId: "foo",
            fieldIndex: [2, 3],
          }),
        ),
      )
      expect([...state.references.entries()]).toMatchObject([
        [
          new NexusLocation("foo", "noteTrack", [2, 3]),
          [
            new NexusLocation("id", "noteTrack", [5]),
            new NexusLocation("id2", "noteTrack", [5]),
          ],
        ],
      ])
    })

    it("should remove source reference if entity is removed", () => {
      const state = nexusDocumentState()

      state._addEntityTypeForId("foo", "noteTrack")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "foo",
            fieldIndex: [2, 3],
          }),
        ),
      )

      state.applyModification(
        noteTrackCreate(
          "id2",
          new Pointer({
            entityId: "foo",
            fieldIndex: [2, 3],
          }),
        ),
      )

      state.applyModification(
        new Modification({
          modification: {
            case: "delete",
            value: {
              entityId: "id",
            },
          },
        }),
      )
      expect([...state.references.entries()]).toMatchObject([
        [
          new NexusLocation("foo", "noteTrack", [2, 3]),
          [new NexusLocation("id2", "noteTrack", [5])],
        ],
      ])
    })

    it("should clean up references if no entity points to target", () => {
      const state = nexusDocumentState()
      state._addEntityTypeForId("foo", "noteTrack")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "foo",
            fieldIndex: [2, 3],
          }),
        ),
      )

      state.applyModification(
        new Modification({
          modification: {
            case: "delete",
            value: {
              entityId: "id",
            },
          },
        }),
      )
      // we _could_ have [NexusLocation, []], but in that case, this should be cleaned up
      expect([...state.references.entries()]).toMatchObject([])
    })

    it("should update references with correct content if pointer is updated", () => {
      const state = nexusDocumentState()

      state._addEntityTypeForId("foo", "noteTrack")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "foo",
            fieldIndex: [2, 3],
          }),
        ),
      )
      state._addEntityTypeForId("bar", "heisenberg")
      state.applyModification(
        new Modification({
          modification: {
            case: "update",
            value: {
              field: {
                entityId: "id",
                fieldIndex: [5],
              },
              value: {
                case: "pointer",
                value: {
                  entityId: "bar",
                  fieldIndex: [2, 3],
                },
              },
            },
          },
        }),
      )
      expect([...state.references.entries()]).toMatchObject([
        [
          new NexusLocation("bar", "heisenberg", [2, 3]),
          [new NexusLocation("id", "noteTrack", [5])],
        ],
      ])
    })

    it("should clean up if pointer is reset", () => {
      const state = nexusDocumentState()

      state._addEntityTypeForId("foo", "noteTrack")
      state.applyModification(
        noteTrackCreate(
          "id",
          new Pointer({
            entityId: "foo",
            fieldIndex: [2, 3],
          }),
        ),
      )
      state.applyModification(
        new Modification({
          modification: {
            case: "update",
            value: {
              field: {
                entityId: "id",
                fieldIndex: [5],
              },
              value: {
                case: "pointer",
                value: {
                  // empty pointer
                  entityId: "",
                  fieldIndex: [],
                },
              },
            },
          },
        }),
      )
      expect([...state.references.entries()]).toMatchObject([])
    })
  })
})

// note track because it also has a pointer
const noteTrackCreate = (id: string, player?: Pointer) =>
  new Modification({
    modification: {
      case: "create",
      value: {
        entity: packedEntity("noteTrack", {
          id,
          groove: {
            entityId: "",
            fieldIndex: [],
          },
          player: player ?? {
            entityId: "",
            fieldIndex: [],
          },
        }),
      },
    },
  })
