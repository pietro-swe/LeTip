import { RequestError } from '../errors/request-error'
import type { GetParams, IHttpClient } from '../http-client'

export type FetchHttpClientParams = {
  timeoutMs?: number
  fetcherFn?: typeof fetch
}

export class FetchHttpClient implements IHttpClient {
  readonly #baseURL: string
  readonly #timeoutMs: number
  readonly #fetchFn: typeof fetch

  constructor(baseURL: string, options?: FetchHttpClientParams) {
    this.#baseURL = baseURL
    this.#timeoutMs = options?.timeoutMs ?? 15_000
    this.#fetchFn = options?.fetcherFn ?? fetch
  }

  async get<TOutput>({ endpoint, query, headers }: GetParams): Promise<TOutput> {
    try {
      const queryParams = this.#buildSearchParams(query)
      const url = this.#buildURL(endpoint, queryParams)

      const signal = AbortSignal.timeout(this.#timeoutMs)

      const response = await this.#fetchFn(url, {
        headers,
        signal,
      })

      if (!response.ok) {
        throw new RequestError({
          endpoint,
          method: 'GET',
          status: response.status,
          query,
          headers,
        })
      }

      const body = await response.json()

      return body as TOutput
    } catch (e) {
      if (e instanceof DOMException && e.name === 'TimeoutError') {
        throw new RequestError({
          endpoint,
          method: 'GET',
          query,
          headers,
          message: 'Request timed out',
        })
      }

      throw new RequestError({
        endpoint,
        method: 'GET',
        query,
        headers,
        message: e instanceof Error ? e.message : 'Unknown error occurred',
      })
    }
  }

  #buildSearchParams<TInput extends Record<string, any>>(params?: TInput): URLSearchParams {
    const searchParams = new URLSearchParams()

    if (!params) {
      return searchParams
    }

    for (const key in params) {
      const value = params[key]

      if (Array.isArray(value)) {
        searchParams.set(key, value.join(','))
        continue
      }

      searchParams.set(key, value)
    }

    return searchParams
  }

  #buildURL(endpoint: string, query?: URLSearchParams): string {
    const url = new URL(endpoint, this.#baseURL)

    if (query) {
      url.search = query.toString()
    }

    return url.toString()
  }
}
