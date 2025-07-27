export type GetParams = {
  endpoint: string
  query?: Record<string, any>,
  headers?: Headers
}

export interface IHttpClient {
  get<TOutput>(params: GetParams): Promise<TOutput>
}
