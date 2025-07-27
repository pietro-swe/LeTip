import { RequestError } from '../errors/request-error'
import type { GetParams, IHttpClient } from '../http-client'

export class FetchHttpClient implements IHttpClient {
  readonly #baseURL: string
  #abortController: AbortController

  constructor(baseURL: string) {
    this.#baseURL = baseURL
    this.#abortController = new AbortController()
  }

  async get<TOutput>({ endpoint, params, headers }: GetParams): Promise<TOutput | Error> {
    try {
      this.#abortController.signal.throwIfAborted()

      this.#abortController = new AbortController()
      this.#abortController.abort()

      const query = this.#buildSearchParams(params)
      const url = this.#buildURL(endpoint, query)

      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(15_000),
      })

      if (!response.ok) {
        return new RequestError(endpoint, params, response.status, headers)
      }

      const body = await response.json()

      return body as TOutput
    } catch (e) {
      if (!(e instanceof Error)) {
        return new Error(`Unknown error occurred when requesting ${endpoint}`)
      }

      return e
    }
  }

  #buildSearchParams<TInput extends Record<string, any>>(params: TInput): URLSearchParams {
    const searchParams = new URLSearchParams()

    for (const key in params) {
      searchParams.set(key, params[key])
    }

    return searchParams
  }

  #buildURL(endpoint: string, query: URLSearchParams): string {
    return `${this.#baseURL}/${endpoint}?${query.toString()}`
  }
}
