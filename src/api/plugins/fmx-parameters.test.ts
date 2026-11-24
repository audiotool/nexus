import { describe, expect, it } from "vitest"
import {
  createDefaultNormalizedParameters,
  denormalizeFmxParameterValue,
  formatFmxParameterValue,
  normalizeFmxParameterValue,
  parseFmxDocument,
  parseFmxParameterValue,
  quantizeFmxNormalizedValue,
  type FmxParameter,
} from "./fmx-parameters"

const createParameter = (
  overrides: Partial<FmxParameter> & Pick<FmxParameter, "id">,
): FmxParameter => ({
  name: `Parameter ${overrides.id}`,
  minimum: 0,
  maximum: 100,
  defaultValue: 50,
  step: 0.1,
  stepped: false,
  curve: "linear",
  choices: [],
  unit: "none",
  label: "",
  automatable: true,
  ...overrides,
})

describe("fmx parameter curves", () => {
  it("maps linear ranges onto [0, 1]", () => {
    const parameter = createParameter({ id: 0, minimum: -60, maximum: 12 })
    expect(normalizeFmxParameterValue(parameter, -60)).toBe(0)
    expect(normalizeFmxParameterValue(parameter, 12)).toBe(1)
    expect(normalizeFmxParameterValue(parameter, -24)).toBeCloseTo(0.5)
  })

  it("maps exponential ranges like the Flow interface", () => {
    const parameter = createParameter({
      id: 0,
      minimum: 100,
      maximum: 18_000,
      curve: "exponential",
    })
    expect(normalizeFmxParameterValue(parameter, 100)).toBeCloseTo(0)
    expect(normalizeFmxParameterValue(parameter, 18_000)).toBeCloseTo(1)
    expect(
      normalizeFmxParameterValue(parameter, Math.sqrt(100 * 18_000)),
    ).toBeCloseTo(0.5)
  })

  it("maps squared and root curves", () => {
    const squared = createParameter({ id: 0, curve: "squared" })
    expect(normalizeFmxParameterValue(squared, 25)).toBeCloseTo(0.5)
    const sqrt = createParameter({ id: 0, curve: "sqrt" })
    expect(normalizeFmxParameterValue(sqrt, 25)).toBeCloseTo(0.0625)
  })

  it("round-trips every curve", () => {
    for (const curve of [
      "linear",
      "exponential",
      "squared",
      "cubed",
      "sqrt",
      "cbrt",
    ] as const) {
      const parameter = createParameter({
        id: 0,
        minimum: 2,
        maximum: 16,
        curve,
      })
      const normalized = normalizeFmxParameterValue(parameter, 9)
      expect(denormalizeFmxParameterValue(parameter, normalized)).toBeCloseTo(9)
    }
  })

  it("snaps stepped values that went through float32 storage", () => {
    const parameter = createParameter({
      id: 0,
      minimum: 0,
      maximum: 3,
      step: 1,
      stepped: true,
    })
    const storedNormalized = Math.fround(2 / 3)
    expect(denormalizeFmxParameterValue(parameter, storedNormalized)).toBe(2)
    expect(quantizeFmxNormalizedValue(parameter, storedNormalized)).toBe(2 / 3)
  })

  it("leaves continuous values unquantized", () => {
    const parameter = createParameter({ id: 0 })
    const storedNormalized = Math.fround(1 / 3)
    expect(quantizeFmxNormalizedValue(parameter, storedNormalized)).toBe(
      storedNormalized,
    )
  })

  it("returns 0 for an empty range", () => {
    const parameter = createParameter({ id: 0, minimum: 5, maximum: 5 })
    expect(normalizeFmxParameterValue(parameter, 5)).toBe(0)
  })

  it("creates normalized defaults by id and skips ids out of range", () => {
    const values = createDefaultNormalizedParameters(
      [
        createParameter({ id: 1, defaultValue: 25 }),
        createParameter({ id: 3, defaultValue: 100 }),
        createParameter({ id: 9, defaultValue: 100 }),
      ],
      4,
    )
    expect(values).toEqual([0, 0.25, 0, 1])
  })
})

describe("fmx parameter display", () => {
  const model = createParameter({
    id: 0,
    minimum: 0,
    maximum: 2,
    step: 1,
    stepped: true,
    choices: ["Clean", "SSL Console", "Cassette"],
  })
  const gain = createParameter({
    id: 1,
    minimum: -24,
    maximum: 24,
    step: 0.01,
    label: "dB",
  })

  it("shows the choice of an enum parameter", () => {
    expect(formatFmxParameterValue(model, Math.fround(0.5))).toBe("SSL Console")
    expect(formatFmxParameterValue(model, 1)).toBe("Cassette")
  })

  it("shows continuous values with their label", () => {
    expect(formatFmxParameterValue(gain, 0.5625)).toBe("3.00 dB")
  })

  it("parses a choice name case-insensitively", () => {
    expect(parseFmxParameterValue(model, " ssl console ")).toBe(0.5)
    expect(parseFmxParameterValue(model, "Tape")).toBeUndefined()
  })

  it("parses a plain value and clamps it to the range", () => {
    expect(parseFmxParameterValue(gain, "3 dB")).toBeCloseTo(0.5625)
    expect(parseFmxParameterValue(gain, "100")).toBe(1)
    expect(parseFmxParameterValue(gain, "loud")).toBeUndefined()
  })
})

describe("parseFmxDocument", () => {
  const requiredParameter = { id: 0, name: "Mix", min: 0, max: 1, default: 1 }

  const encodeDocument = (overrides: Record<string, unknown>) =>
    new TextEncoder().encode(
      JSON.stringify({
        version: "1.1.0",
        name: "Test",
        type: "vst_effect",
        html: "",
        wasm: "",
        metadata: { params: [requiredParameter] },
        ...overrides,
      }),
    )

  it("rejects a file that is not JSON", () => {
    expect(
      parseFmxDocument(new TextEncoder().encode("not json")),
    ).toBeInstanceOf(Error)
  })

  it("rejects an unknown plugin type", () => {
    expect(
      parseFmxDocument(encodeDocument({ type: "vst_midi" })),
    ).toBeInstanceOf(Error)
  })

  it("reads the plugin name, type and parameters", () => {
    const fmxDocument = parseFmxDocument(
      encodeDocument({
        name: "Test Gate",
        spaceVersion: 3,
        metadata: JSON.stringify({
          params: [
            {
              id: 0,
              name: "Mix",
              min: 0,
              max: 100,
              default: 100,
              step: 0.1,
              label: "%",
              unit: "percent",
              choices: [],
            },
          ],
        }),
      }),
    )
    expect(fmxDocument).toMatchObject({
      name: "Test Gate",
      pluginType: "vst_effect",
      formatVersion: "1.1.0",
      spaceVersion: 3,
      parameters: [
        {
          id: 0,
          name: "Mix",
          minimum: 0,
          maximum: 100,
          defaultValue: 100,
          label: "%",
        },
      ],
    })
  })

  it("defaults missing optional fields", () => {
    expect(parseFmxDocument(encodeDocument({}))).toMatchObject({
      spaceVersion: 0,
      parameters: [
        {
          step: 0.01,
          stepped: false,
          curve: "linear",
          choices: [],
          unit: "",
          label: "",
          automatable: true,
        },
      ],
    })
  })

  it("accepts a document without a version", () => {
    expect(
      parseFmxDocument(encodeDocument({ version: undefined })),
    ).toMatchObject({ formatVersion: undefined })
  })

  it("accepts a version in any format", () => {
    expect(
      parseFmxDocument(encodeDocument({ version: "not semver" })),
    ).toMatchObject({ formatVersion: "not semver" })
  })

  it("defaults optional fields of the wrong type", () => {
    const fmxDocument = parseFmxDocument(
      encodeDocument({
        spaceVersion: "3",
        metadata: {
          params: [
            {
              ...requiredParameter,
              step: "1",
              stepped: "yes",
              curve: "logarithmic",
              choices: "a,b",
              unit: 1,
              label: null,
              automatable: 0,
            },
          ],
        },
      }),
    )
    expect(fmxDocument).toMatchObject({
      spaceVersion: 0,
      parameters: [
        {
          step: 0.01,
          stepped: false,
          curve: "linear",
          choices: [],
          unit: "",
          label: "",
          automatable: true,
        },
      ],
    })
  })

  it("drops non-string choices and marks the parameter as stepped", () => {
    const fmxDocument = parseFmxDocument(
      encodeDocument({
        metadata: {
          params: [{ ...requiredParameter, choices: ["Off", 1, null, "On"] }],
        },
      }),
    )
    expect(fmxDocument).toMatchObject({
      parameters: [{ stepped: true, choices: ["Off", "On"] }],
    })
  })

  it("reads metadata stored as a JSON string", () => {
    const fmxDocument = parseFmxDocument(
      encodeDocument({
        metadata: JSON.stringify({ params: [requiredParameter] }),
      }),
    )
    expect(fmxDocument).toMatchObject({ parameters: [{ name: "Mix" }] })
  })

  it("rejects metadata that is not valid JSON", () => {
    expect(
      parseFmxDocument(encodeDocument({ metadata: "{params" })),
    ).toBeInstanceOf(Error)
  })

  it("rejects missing metadata", () => {
    expect(
      parseFmxDocument(encodeDocument({ metadata: undefined })),
    ).toBeInstanceOf(Error)
  })

  it("rejects an empty plugin name", () => {
    expect(parseFmxDocument(encodeDocument({ name: "" }))).toBeInstanceOf(Error)
  })

  it("rejects a parameter without a range", () => {
    const fmxDocument = parseFmxDocument(
      encodeDocument({ metadata: { params: [{ id: 0, name: "Mix" }] } }),
    )
    expect(fmxDocument).toBeInstanceOf(Error)
  })
})
