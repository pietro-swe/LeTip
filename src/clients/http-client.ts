export type GetParams = {
  endpoint: string
  params: Record<string, any>
  headers?: Headers
}

export interface IHttpClient {
  get<TOutput>(params: GetParams): Promise<TOutput | Error>
}
