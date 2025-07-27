import type { Rate } from '@/@types/http/exchange-rate-response'
import type { Currency } from '@/@types/enterprise/currency'
import { CurrencyExchangeRateRepository } from '@/repositories/currency-exchange-rate-repository'
import { FetchHttpClient } from '@/clients/implementations/fetch-http-client'
import type { IHttpClient } from '@/clients/http-client'

describe('Currency Exchange Rate Repository Test Suite', () => {
  const mockFetch = (baseCurrency: Currency, quoteCurrency: Currency) =>
    vi.fn().mockResolvedValue({
      ok: true,
      json: async (): Promise<Rate> => ({
        base_currency: baseCurrency,
        quote_currency: quoteCurrency,
        date: new Date().toISOString().split('T')[0],
        quote: Number((Math.random() * 5).toFixed(4)),
      }),
    })

  const mockDelayedFetch = () =>
    vi.fn().mockImplementation((_url, { signal }: RequestInit) => {
      return new Promise((_resolve, reject) => {
        const timeout = setTimeout(() => {}, 10_000)

        signal?.addEventListener('abort', () => {
          clearTimeout(timeout)
          reject(new DOMException('Aborted', 'TimeoutError'))
        })
      })
    })

  let httpClient: IHttpClient
  let systemUnderTest: CurrencyExchangeRateRepository

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 6, 27))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return a proper rate', async () => {
    const BASE_CURRENCY = 'EUR'
    const QUOTE_CURRENCY = 'BRL'

    httpClient = new FetchHttpClient('https://some-exchange-rate-api.com', {
      fetcherFn: mockFetch(BASE_CURRENCY, QUOTE_CURRENCY),
    })

    systemUnderTest = new CurrencyExchangeRateRepository(httpClient, 'SOME-COOL-API-KEY')

    const response = await systemUnderTest.getRate({
      currency: QUOTE_CURRENCY,
    })

    expect(response).toBeTruthy()
    expect(response).toBeGreaterThanOrEqual(0)
  })

  it('should return null on timeout', async () => {
    const QUOTE_CURRENCY = 'BRL'

    httpClient = new FetchHttpClient('https://some-exchange-rate-api.com', {
      timeoutMs: 500,
      fetcherFn: mockDelayedFetch(),
    })

    systemUnderTest = new CurrencyExchangeRateRepository(httpClient, 'SOME-COOL-API-KEY')

    const response = await systemUnderTest.getRate({
      currency: QUOTE_CURRENCY,
    })

    console.log(response)
  })
})
