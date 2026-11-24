/** The number of parameter slots of every {@link entities.FmxDevice}. */
export const FMX_PARAMETER_SLOT_COUNT = 1024

/** The maximum length of a device name the studio gives a plugin device. */
export const FMX_DISPLAY_NAME_MAX_LENGTH = 100

/** The type of plugin an `.fmx` file declares. Effects process audio; instruments play notes. */
export type FmxPluginType = "vst_effect" | "vst_instrument"

const FMX_PLUGIN_TYPES = [
  "vst_effect",
  "vst_instrument",
] as const satisfies readonly FmxPluginType[]

/** How a parameter maps its value range onto the normalized range [0, 1]. */
export type FmxParameterCurve =
  "linear" | "exponential" | "squared" | "cubed" | "sqrt" | "cbrt"

const FMX_PARAMETER_CURVES = [
  "linear",
  "exponential",
  "squared",
  "cubed",
  "sqrt",
  "cbrt",
] as const satisfies readonly FmxParameterCurve[]

/** One parameter declared in the metadata of an `.fmx` file. */
export type FmxParameter = {
  /** The parameter slot of the device, see {@link entities.FmxDevice.parameters}. */
  id: number
  name: string
  minimum: number
  maximum: number
  defaultValue: number
  step: number
  /** Only whole multiples of `step` above `minimum` are valid values (enums, integers). */
  stepped: boolean
  curve: FmxParameterCurve
  /** The names of the values of an enum parameter, starting at `minimum`. Empty otherwise. */
  choices: readonly string[]
  unit: string
  /** The unit shown next to the value, for example `"dB"`. */
  label: string
  /** Whether the DAW may automate this parameter. */
  automatable: boolean
}

/** The parts of an `.fmx` file the SDK reads. */
export type FmxDocument = {
  name: string
  pluginType: FmxPluginType
  /** The `version` field, if present. Hosts ignore it. */
  formatVersion: string | undefined
  spaceVersion: number
  parameters: FmxParameter[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const numberOr = (value: unknown, fallback: number) =>
  typeof value === "number" ? value : fallback

const stringOr = (value: unknown, fallback: string) =>
  typeof value === "string" ? value : fallback

/**
 * Only `id`, `name` and the range are required. The optional fields fall back
 * to a default when they are missing or have the wrong type, so a plugin with
 * sloppy metadata still loads. Non-string choices are dropped, and a parameter
 * with choices is always stepped.
 */
const parseParameter = (
  value: unknown,
  index: number,
): FmxParameter | Error => {
  if (!isRecord(value)) {
    return new Error(`parameter ${index} is not an object`)
  }
  const { id, name, min, max } = value
  const defaultValue = value.default
  if (
    typeof id !== "number" ||
    typeof name !== "string" ||
    typeof min !== "number" ||
    typeof max !== "number" ||
    typeof defaultValue !== "number"
  ) {
    return new Error(
      `parameter ${index} needs a numeric id, min, max and default, and a string name`,
    )
  }
  const choices = Array.isArray(value.choices)
    ? value.choices.filter((choice) => typeof choice === "string")
    : []
  const curve = FMX_PARAMETER_CURVES.find((c) => c === value.curve) ?? "linear"
  return {
    id,
    name,
    minimum: min,
    maximum: max,
    defaultValue,
    step: numberOr(value.step, 0.01),
    stepped:
      (typeof value.stepped === "boolean" && value.stepped) ||
      choices.length > 0,
    curve,
    choices,
    unit: stringOr(value.unit, ""),
    label: stringOr(value.label, ""),
    automatable:
      typeof value.automatable === "boolean" ? value.automatable : true,
  }
}

/** Older packages store the metadata object as a JSON string. */
const parseMetadata = (value: unknown): FmxParameter[] | Error => {
  let metadata = value
  if (typeof metadata === "string") {
    try {
      metadata = JSON.parse(metadata)
    } catch (error) {
      return new Error("fmx metadata is not valid JSON", { cause: error })
    }
  }
  if (!isRecord(metadata) || !Array.isArray(metadata.params)) {
    return new Error("fmx metadata has no params array")
  }
  const parameters: FmxParameter[] = []
  for (const [index, param] of metadata.params.entries()) {
    const parameter = parseParameter(param, index)
    if (parameter instanceof Error) {
      return parameter
    }
    parameters.push(parameter)
  }
  return parameters
}

/** Reads the name, type and parameter metadata of an `.fmx` file. */
export const parseFmxDocument = (bytes: Uint8Array): FmxDocument | Error => {
  let document: unknown
  try {
    document = JSON.parse(new TextDecoder().decode(bytes))
  } catch (error) {
    return new Error("fmx file is not valid JSON", { cause: error })
  }
  if (!isRecord(document)) {
    return new Error("fmx file is not a JSON object")
  }
  const { name, type, version, html, wasm } = document
  if (typeof name !== "string" || name.length === 0) {
    return new Error("fmx file has no name")
  }
  const pluginType = FMX_PLUGIN_TYPES.find((t) => t === type)
  if (pluginType === undefined) {
    return new Error(`fmx file has an unknown plugin type: ${String(type)}`)
  }
  if (version !== undefined && typeof version !== "string") {
    return new Error("fmx file has a version that is not a string")
  }
  if (typeof html !== "string" || typeof wasm !== "string") {
    return new Error("fmx file has no html or wasm")
  }
  const parameters = parseMetadata(document.metadata)
  if (parameters instanceof Error) {
    return parameters
  }
  return {
    name,
    pluginType,
    formatVersion: version,
    spaceVersion: numberOr(document.spaceVersion, 0),
    parameters,
  }
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum)

/** Same curves as the Flow plugin interface uses to talk to its host. */
const CURVE_EXPONENTS: Record<
  Exclude<FmxParameterCurve, "exponential">,
  number
> = {
  linear: 1,
  squared: 2,
  cubed: 3,
  sqrt: 0.5,
  cbrt: 1 / 3,
}

const EXPONENTIAL_MINIMUM = 0.00000001

type CurveParameter = Pick<
  FmxParameter,
  "minimum" | "maximum" | "curve" | "step" | "stepped"
>

/** Maps a value in the parameter's own units onto [0, 1]. */
export const normalizeFmxParameterValue = (
  parameter: CurveParameter,
  value: number,
) => {
  if (parameter.curve === "exponential") {
    const minimum =
      parameter.minimum <= 0 ? EXPONENTIAL_MINIMUM : parameter.minimum
    return (
      (Math.log(value) - Math.log(minimum)) /
      Math.log(parameter.maximum / minimum)
    )
  }
  const span = parameter.maximum - parameter.minimum
  if (span === 0) {
    return 0
  }
  return Math.pow(
    (value - parameter.minimum) / span,
    1 / CURVE_EXPONENTS[parameter.curve],
  )
}

/** Stepped parameters snap to the nearest step, so float32 round trips still hit exact enum values. */
export const denormalizeFmxParameterValue = (
  parameter: CurveParameter,
  normalized: number,
) => {
  const minimum =
    parameter.curve === "exponential" && parameter.minimum <= 0
      ? EXPONENTIAL_MINIMUM
      : parameter.minimum
  const value =
    parameter.curve === "exponential"
      ? Math.exp(
          Math.log(minimum) +
            normalized * Math.log(parameter.maximum / minimum),
        )
      : minimum +
        Math.pow(normalized, CURVE_EXPONENTS[parameter.curve]) *
          (parameter.maximum - minimum)
  if (!parameter.stepped || parameter.step <= 0) {
    return value
  }
  const snapped =
    parameter.minimum +
    Math.round((value - parameter.minimum) / parameter.step) * parameter.step
  return clamp(
    snapped,
    Math.min(parameter.minimum, parameter.maximum),
    Math.max(parameter.minimum, parameter.maximum),
  )
}

/** Normalized value the Flow interface expects: stepped parameters land exactly on their step. */
export const quantizeFmxNormalizedValue = (
  parameter: CurveParameter,
  normalized: number,
) =>
  parameter.stepped
    ? normalizeFmxParameterValue(
        parameter,
        denormalizeFmxParameterValue(parameter, normalized),
      )
    : normalized

type DisplayParameter = CurveParameter & Pick<FmxParameter, "choices" | "label">

/** Human-readable value of a normalized parameter: its choice, or its value with label. */
export const formatFmxParameterValue = (
  parameter: DisplayParameter,
  normalized: number,
) => {
  const value = denormalizeFmxParameterValue(parameter, normalized)
  if (parameter.choices.length > 0) {
    const choiceIndex = Math.round(value - parameter.minimum)
    return (
      parameter.choices[clamp(choiceIndex, 0, parameter.choices.length - 1)] ??
      ""
    )
  }
  const fractionDigits =
    parameter.stepped && parameter.step >= 1
      ? 0
      : Math.abs(value) >= 100
        ? 0
        : 2
  const text = value.toFixed(fractionDigits)
  return parameter.label.length > 0 ? `${text} ${parameter.label}` : text
}

/** Normalized value for typed input: a choice name, or a number in plain units. */
export const parseFmxParameterValue = (
  parameter: DisplayParameter,
  text: string,
): number | undefined => {
  const trimmed = text.trim()
  if (parameter.choices.length > 0) {
    const choiceIndex = parameter.choices.findIndex(
      (choice) => choice.toLowerCase() === trimmed.toLowerCase(),
    )
    return choiceIndex === -1
      ? undefined
      : normalizeFmxParameterValue(parameter, parameter.minimum + choiceIndex)
  }
  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) {
    return undefined
  }
  const low = Math.min(parameter.minimum, parameter.maximum)
  const high = Math.max(parameter.minimum, parameter.maximum)
  return normalizeFmxParameterValue(parameter, clamp(value, low, high))
}

/** Normalized default values indexed by parameter id, padded with zeros to `length`. */
export const createDefaultNormalizedParameters = (
  parameters: readonly FmxParameter[],
  length: number,
): number[] => {
  const values = Array.from({ length }, () => 0)
  for (const parameter of parameters) {
    if (parameter.id >= 0 && parameter.id < length) {
      values[parameter.id] = normalizeFmxParameterValue(
        parameter,
        parameter.defaultValue,
      )
    }
  }
  return values
}
