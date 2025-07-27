export class RequestError extends Error {
  endpoint: string
  params: Record<string, any>
  status: number
  headers?: Headers

  constructor(endpoint: string, params: Record<string, any>, status: number, headers?: Headers) {
    super()

    this.endpoint = endpoint
    this.params = params
    this.status = status
    this.headers = headers
  }
}
