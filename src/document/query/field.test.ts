import { NexusDocument } from "@document/document"
import type { NexusEntity } from "@document/entity"
import { beforeEach, describe, expect, it } from "vitest"
import type { NexusField } from "../fields"
import type { TransactionBuilder } from "../transaction-builder"
import { onlyTransactionBuilder } from "../transaction-builder/builder-test-utils"
import type { FieldQuery } from "./field"

interface QueryTestContext {
  t: TransactionBuilder
  fieldQuery: FieldQuery<NexusField>
  flanger: NexusEntity<"stompboxFlanger">
  automationTrack: NexusEntity<"automationTrack">
  allFields: NexusField[]
}

describe("FieldQuery", () => {
  beforeEach<QueryTestContext>((context) => {
    context.t = onlyTransactionBuilder()

    context.flanger = context.t.create("stompboxFlanger", {})
    context.t.update(context.flanger.fields.feedbackFactor, 0.3)
    context.automationTrack = context.t.create("automationTrack", {
      automatedParameter: context.flanger.fields.feedbackFactor.location,
    })

    context.allFields = [
      context.flanger.fields.feedbackFactor,
      context.flanger.fields.delayTimeMs,
      context.flanger.fields.lfoModulationDepth,
      context.flanger.fields.lfoFrequencyHz,
      context.flanger.fields.isActive,
      context.flanger.fields.audioOutput,
      context.flanger.fields.audioInput,
      context.flanger.fields.positionX,
      context.flanger.fields.positionY,
      context.flanger.fields.displayName,
      context.flanger.fields.presetName,
      context.automationTrack.fields.automatedParameter,
      context.automationTrack.fields.orderAmongTracks,
      context.automationTrack.fields.isEnabled,
    ]

    context.fieldQuery = context.t.entities.fields()
  })

  describe("get", () => {
    it<QueryTestContext>("should return all fields", (context) => {
      const fields = context.fieldQuery.get()
      expect(fields).toContainExactly(context.allFields)
    })
    it("should return [] if there are no fields", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()
      expect(
        nexus.queryEntitiesWithoutLock.fields().primitiveFields().get(),
      ).toStrictEqual([])
    })
  })

  describe("getByEntity", () => {
    it<QueryTestContext>("should return a map with fields for the specified entity types", (context) => {
      const fieldMap = context.fieldQuery.getByEntity()
      expect(fieldMap.get(context.flanger.id)).toContainExactly([
        context.flanger.fields.feedbackFactor,
        context.flanger.fields.delayTimeMs,
        context.flanger.fields.lfoModulationDepth,
        context.flanger.fields.lfoFrequencyHz,
        context.flanger.fields.isActive,
        context.flanger.fields.audioInput,
        context.flanger.fields.audioOutput,
        context.flanger.fields.positionX,
        context.flanger.fields.positionY,
        context.flanger.fields.displayName,
        context.flanger.fields.presetName,
      ])
    })
    it<QueryTestContext>("should return an empty map if no fields exist for the specified entity types", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()
      expect(
        nexus.queryEntitiesWithoutLock.fields().primitiveFields().getByEntity()
          .size,
      ).toStrictEqual(0)
    })
  })

  describe("ofTargetTypes", () => {
    it<QueryTestContext>("should return map with only fields of specified target types", (context) => {
      const fields = context.fieldQuery
        .ofTargetTypes("AutomatableParameter")
        .get()
      expect(fields).toContainExactly([
        context.flanger.fields.feedbackFactor,
        context.flanger.fields.delayTimeMs,
        context.flanger.fields.lfoModulationDepth,
        context.flanger.fields.lfoFrequencyHz,
        context.flanger.fields.isActive,
      ])
    })
    it<QueryTestContext>("should return empty map if no target type specified", (context) => {
      const fields = context.fieldQuery.ofTargetTypes().get()
      expect(fields).toStrictEqual([])
    })
  })

  describe("notPointedTo", () => {
    it<QueryTestContext>("should only return fields not being pointed to", (context) => {
      const fields = context.fieldQuery
        .notPointedTo()
        .getByEntity()
        .get(context.flanger.id)
      expect(fields).toContainExactly([
        context.flanger.fields.delayTimeMs,
        context.flanger.fields.lfoModulationDepth,
        context.flanger.fields.lfoFrequencyHz,
        context.flanger.fields.isActive,
        context.flanger.fields.audioInput,
        context.flanger.fields.audioOutput,
        context.flanger.fields.positionX,
        context.flanger.fields.positionY,
        context.flanger.fields.displayName,
        context.flanger.fields.presetName,
      ])
    })
  })

  describe("pointedToBy", () => {
    it<QueryTestContext>("should only return fields pointed to by the specified pointer", (context) => {
      const fields = context.fieldQuery
        .pointedToBy(context.automationTrack.fields.automatedParameter.location)
        .get()
      expect(fields).toContainExactly([context.flanger.fields.feedbackFactor])
    })
  })

  describe("primitiveOnly", () => {
    it<QueryTestContext>("should only return primitive fields", (context) => {
      const fields = context.fieldQuery.primitiveFields().get()
      expect(fields).not.toContain(context.flanger.fields.audioOutput)
    })
  })

  describe("should be consistent", () => {
    it<QueryTestContext>("across multiple get() calls", (context) => {
      const query = context.fieldQuery.ofTargetTypes("AutomatableParameter")
      query.get()
      const fields2 = query.get()

      expect(fields2).toContainExactly([
        context.flanger.fields.feedbackFactor,
        context.flanger.fields.delayTimeMs,
        context.flanger.fields.lfoModulationDepth,
        context.flanger.fields.lfoFrequencyHz,
        context.flanger.fields.isActive,
      ])
    })

    it<QueryTestContext>("and multiple filter steps", (context) => {
      const query = context.fieldQuery
        .ofTargetTypes("AutomatableParameter")
        .notPointedTo()
      query.get()
      const fields2 = query.get()

      expect(fields2).toContainExactly([
        context.flanger.fields.delayTimeMs,
        context.flanger.fields.lfoModulationDepth,
        context.flanger.fields.lfoFrequencyHz,
        context.flanger.fields.isActive,
      ])
    })
  })

  describe("should not modify source Nexus document", () => {
    it<QueryTestContext>("after multiple filter steps", (context) => {
      const query = context.fieldQuery.ofTargetTypes("AutomatableParameter")
      query.notPointedTo().get()
      query.ofTargetTypes("AudioInput").get()
      expect(context.fieldQuery.get()).toContainExactly(context.allFields)
    })
  })
})
