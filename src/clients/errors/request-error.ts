export type RequestErrorParams = {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  message?: string
  status?: number
  query?: Record<string, any>
  headers?: Headers
}

export class RequestError extends Error {
  endpoint: string
  method?: string
  status?: number
  query?: Record<string, any>
  headers?: Headers

  constructor({ endpoint, method, message, headers, query, status }: RequestErrorParams) {
    super(message ?? `Request ${method} /${endpoint} failed`)

    this.endpoint = endpoint
    this.method = method
    this.query = query
    this.status = status
    this.headers = headers
  }
}
