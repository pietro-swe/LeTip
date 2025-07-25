import { RequestError } from "../errors/request-error";
import type { IHttpClient } from "../http-client";

export class FetchHttpClient implements IHttpClient {
  readonly #baseURL: string;

  constructor(
    baseURL: string,
  ) {
    this.#baseURL = baseURL;
  }

  async get<TOutput>(
    endpoint: string,
    params: Record<string, any>,
    headers?: Headers
  ): Promise<TOutput | Error> {
    const query = this.#buildSearchParams(params);
    const url = this.#buildURL(endpoint, query);

    try {
      const response = await fetch(url, {
        headers,
      })

      if (!response.ok) {
        return new RequestError(
          endpoint,
          params,
          response.status,
          headers,
        );
      }

      const body = await response.json()

      // TODO: Validate
      return body as TOutput
    } catch (e) {
      // TODO: I think this is not good enough
      if (!(e instanceof Error)) {
        return new Error(`Unknown error occurred when requesting ${url}`);
      }

      return e;
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
