import { FetchHttpClient } from '@/clients/implementations/fetch-http-client'
import type { IHttpClient } from '@/clients/http-client'
import { RequestError } from '@/clients/errors/request-error'

describe('Fetch HTTP Client Test Suite', () => {
  const mockDelayedFetch = () =>
    vi.fn().mockImplementation((_url, { signal }: RequestInit) => {
      return new Promise((_resolve, reject) => {
        const timeout = setTimeout(() => {
        }, 10_000)


        signal?.addEventListener('abort', () => {
          clearTimeout(timeout)
          reject(new DOMException('Aborted', 'TimeoutError'))
        })
      })
    })

  let systemUnderTest: IHttpClient

  it('should thrown an error after timeout expired', async () => {
    systemUnderTest = new FetchHttpClient('https://some-exchange-rate-api.com', {
      timeoutMs: 500,
      fetcherFn: mockDelayedFetch()
    })

    await expect(systemUnderTest.get({
      endpoint: 'rate'
    })).rejects.toThrow(RequestError)
  })
})
