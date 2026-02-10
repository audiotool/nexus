import {
  ValueNotifier,
  type ObservableValue,
} from "@utils/observable-notifier-value"
import { beforeEach, describe, expect, it } from "vitest"
import { combinedValueNotifiersWithAnd } from "./combine-notifiers"

type NotifierContext = {
  a: ValueNotifier<boolean>
  b: ValueNotifier<boolean>
  c: ValueNotifier<boolean>

  summary: ObservableValue<boolean>
}

describe("combineNotifiersWithAnd", () => {
  beforeEach<NotifierContext>((ctx) => {
    ctx.a = new ValueNotifier(true)
    ctx.b = new ValueNotifier(true)
    ctx.c = new ValueNotifier(true)

    ctx.summary = combinedValueNotifiersWithAnd(ctx.a, ctx.b, ctx.c)
  })

  it<NotifierContext>("should initialize summary as true", (ctx) => {
    expect(ctx.summary.getValue()).toBe(true)
  })

  it<NotifierContext>("should turn summary false if one of the notifiers turns false", (ctx) => {
    ctx.a.setValue(false)
    expect(ctx.summary.getValue()).toBe(false)
  })

  it<NotifierContext>("should turn summary false if another of the notifiers turns false", (ctx) => {
    ctx.c.setValue(false)
    expect(ctx.summary.getValue()).toBe(false)
  })

  it<NotifierContext>("should turn summary true if one of the notifiers turns false then true", (ctx) => {
    ctx.a.setValue(false)
    ctx.a.setValue(true)
    expect(ctx.summary.getValue()).toBe(true)
  })

  it<NotifierContext>("should turn summary false if one of the notifiers turns false then true, but another stays false", (ctx) => {
    ctx.a.setValue(false)
    ctx.b.setValue(false)
    ctx.a.setValue(true)
    expect(ctx.summary.getValue()).toBe(false)
  })

  it("should initialize summary as false if any of the inputs are false", () => {
    const a = new ValueNotifier(false)
    const b = new ValueNotifier(true)
    const summary = combinedValueNotifiersWithAnd(a, b)
    expect(summary.getValue()).toBe(false)
  })
})
