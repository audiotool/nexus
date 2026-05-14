import { Any, type PartialMessage } from "@bufbuild/protobuf"
import {
  createClient,
  createRouterTransport,
  type Client,
  type ServiceImpl,
} from "@connectrpc/connect"
import { Operation, Status } from "@gen/longrunning/v1/operation_pb"
import {
  SampleConvertDoneErrorType,
  SampleConvertInfo,
} from "@gen/sample/v1/sample_event_pb"
import { Sample } from "@gen/sample/v1/sample_pb"
import { SampleService } from "@gen/sample/v1/sample_service_connect"
import { ListenResponse } from "@gen/sample/v1/sample_service_pb"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import { sleep } from "@utils/lang"
import { describe, expect, it, vi } from "vitest"
import { createSampleDataListener } from "./sample-data-listener"

const { promise: neverResolves } = Promise.withResolvers<never>()

/** Build a {@link ListenResponse} wrapping a SampleConvertInfo operation. */
const createListenResponseWithOperation = (props: {
  sample: Sample
  error?: SampleConvertDoneErrorType
  done?: boolean
  operationError?: PartialMessage<Status>
}): ListenResponse => {
  const {
    sample,
    error = SampleConvertDoneErrorType.NONE,
    done = true,
    operationError,
  } = props

  const convertInfo = new SampleConvertInfo({ sample, error })

  const operation = new Operation({
    name: `operations/${sample.name}`,
    metadata: Any.pack(convertInfo),
    done,
    result: operationError
      ? { case: "error", value: new Status(operationError) }
      : { case: undefined },
  })

  return new ListenResponse({ operation })
}

/** Build a `listen`-only client backed by the supplied service implementation. */
const createSampleServiceClient = (
  implementation: Partial<ServiceImpl<typeof SampleService>>,
): Pick<RetryingClient<typeof SampleService>, "listen"> => {
  const client: Client<typeof SampleService> = createClient(
    SampleService,
    createRouterTransport(({ service }) => {
      service(SampleService, implementation)
    }),
  )
  return { listen: client.listen }
}

describe("SampleDataListener.listenForSample", () => {
  it("resolves with the Sample when a matching ok event is received", async () => {
    const sample = new Sample({ name: "samples/abc" })

    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        yield createListenResponseWithOperation({
          sample,
          error: SampleConvertDoneErrorType.NONE,
        })
        await neverResolves
      },
    })

    const listener = createSampleDataListener(client)
    await expect(
      listener.listenForSample("samples/abc"),
    ).resolves.toMatchObject({ name: "samples/abc" })
  })

  it("resolves with an Error if the sample conversion errors", async () => {
    const sample = new Sample({ name: "samples/abc" })

    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        yield createListenResponseWithOperation({
          sample,
          error: SampleConvertDoneErrorType.INTERNAL,
        })
        await neverResolves
      },
    })

    const listener = createSampleDataListener(client)
    const result = await listener.listenForSample("samples/abc")
    expect(result).toBeInstanceOf(Error)
  })

  it("resolves with an Error when the abort signal fires", async () => {
    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        await neverResolves
        yield new ListenResponse()
      },
    })

    const abortController = new AbortController()
    const listener = createSampleDataListener(client)

    const samplePromise = listener.listenForSample(
      "samples/abc",
      abortController.signal,
    )
    abortController.abort()
    const result = await samplePromise
    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe("Aborted")
  })

  it("returns an Error immediately if the signal is already aborted", async () => {
    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        await neverResolves
        yield new ListenResponse()
      },
    })

    const abortController = new AbortController()
    abortController.abort()
    const listener = createSampleDataListener(client)
    const result = await listener.listenForSample(
      "samples/abc",
      abortController.signal,
    )
    expect(result).toBeInstanceOf(Error)
  })

  it("ignores ok events for samples that are not being awaited", async () => {
    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        yield createListenResponseWithOperation({
          sample: new Sample({ name: "samples/other" }),
          error: SampleConvertDoneErrorType.NONE,
        })
        await neverResolves
      },
    })

    const listener = createSampleDataListener(client)
    await expect(
      Promise.race([
        listener.listenForSample("samples/mine"),
        sleep(50).then(() => "timeout"),
      ]),
    ).resolves.toBe("timeout")
  })

  it("ignores error events for samples that are not being awaited", async () => {
    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        yield createListenResponseWithOperation({
          sample: new Sample({ name: "samples/other" }),
          error: SampleConvertDoneErrorType.INTERNAL,
        })
        await neverResolves
      },
    })

    const listener = createSampleDataListener(client)
    await expect(
      Promise.race([
        listener.listenForSample("samples/mine"),
        sleep(50).then(() => "timeout"),
      ]),
    ).resolves.toBe("timeout")
  })

  it("resolves multiple awaited samples from a single shared stream", async () => {
    const sample1 = new Sample({ name: "samples/one" })
    const sample2 = new Sample({ name: "samples/two" })

    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        yield createListenResponseWithOperation({
          sample: sample1,
          error: SampleConvertDoneErrorType.NONE,
        })
        yield createListenResponseWithOperation({
          sample: sample2,
          error: SampleConvertDoneErrorType.NONE,
        })
        await neverResolves
      },
    })

    const listener = createSampleDataListener(client)
    const both = await Promise.all([
      listener.listenForSample("samples/one"),
      listener.listenForSample("samples/two"),
    ])

    expect(both[0]).toMatchObject({ name: "samples/one" })
    expect(both[1]).toMatchObject({ name: "samples/two" })
  })

  it("recovers from errors thrown by the listen iterator", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const sample = new Sample({ name: "samples/abc" })
    let threwError = false

    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        if (!threwError) {
          threwError = true
          throw new Error("test error")
        }
        yield createListenResponseWithOperation({
          sample,
          error: SampleConvertDoneErrorType.NONE,
        })
        await neverResolves
      },
    })

    const listener = createSampleDataListener(client, 10)
    await expect(
      listener.listenForSample("samples/abc"),
    ).resolves.toMatchObject({ name: "samples/abc" })
  })

  it("does not start listening when no sample is being awaited", async () => {
    let amListening = false
    createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        amListening = true
        await neverResolves
        yield new ListenResponse()
      },
    })

    await sleep(20)
    expect(amListening).toBe(false)
  })

  it("stops listening once all pending samples have resolved", async () => {
    const sample = new Sample({ name: "samples/abc" })
    let keptListening = false

    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        yield createListenResponseWithOperation({
          sample,
          error: SampleConvertDoneErrorType.NONE,
        })
        // We should never reach this; the listener should abort the stream
        // once `resolvers` is empty.
        keptListening = true
        yield new ListenResponse()
        await neverResolves
      },
    })

    const listener = createSampleDataListener(client, 10)
    await listener.listenForSample("samples/abc")
    expect(keptListening).toBe(false)
  })

  it("waits for operation.done before resolving", async () => {
    const sample = new Sample({ name: "samples/abc" })

    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        yield createListenResponseWithOperation({
          sample,
          error: SampleConvertDoneErrorType.NONE,
          done: false,
        })
        await neverResolves
      },
    })

    const listener = createSampleDataListener(client)
    await expect(
      Promise.race([
        listener.listenForSample("samples/abc"),
        sleep(50).then(() => "timeout"),
      ]),
    ).resolves.toBe("timeout")
  })

  it("resolves with an Error when the operation has an error result", async () => {
    const sample = new Sample({ name: "samples/abc" })

    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        yield createListenResponseWithOperation({
          sample,
          error: SampleConvertDoneErrorType.NONE,
          operationError: { code: 1, message: "Operation failed" },
        })
        await neverResolves
      },
    })

    const listener = createSampleDataListener(client)
    const result = await listener.listenForSample("samples/abc")
    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe("Operation error: Operation failed")
  })

  it("returns an Error if the same sampleId is awaited twice concurrently", async () => {
    const client = createSampleServiceClient({
      // eslint-disable-next-line @typescript-eslint/require-await
      listen: async function* () {
        await neverResolves
        yield new ListenResponse()
      },
    })

    const listener = createSampleDataListener(client)
    void listener.listenForSample("samples/abc")
    const second = await listener.listenForSample("samples/abc")
    expect(second).toBeInstanceOf(Error)
  })
})
