export interface IHttpClient {
  get<TOutput>(
    endpoint: string,
    params: Record<string, any>,
    headers?: Headers
  ): Promise<TOutput | Error>
}
