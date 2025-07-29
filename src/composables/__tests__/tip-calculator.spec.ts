import { nextTick } from 'vue'
import { useTipCalculator } from '../tip-calculator'
import type { Rate } from '@/@types/http/exchange-rate-response'
import type { Currency } from '@/@types/enterprise/currency'
import type { IHttpClient } from '@/clients/http-client'
import { CurrencyExchangeRateRepository } from '@/repositories/currency-exchange-rate-repository'
import { FetchHttpClient } from '@/clients/implementations/fetch-http-client'

describe('Tip Calculator Test Suit', () => {
  const BASE_CURRENCY = 'EUR'
  const QUOTE_CURRENCY = 'BRL'
  const RATE = 5

  const VITE_API_BASE_URL = 'https://fake-api.com'
  const VITE_API_KEY = 'test-key'

  const oldEnv = { ...import.meta.env }

  const mockFetch = (baseCurrency: Currency, quoteCurrency: Currency) =>
    vi.fn().mockResolvedValue({
      ok: true,
      json: async (): Promise<Rate> => ({
        base_currency: baseCurrency,
        quote_currency: quoteCurrency,
        date: new Date().toISOString().split('T')[0],
        quote: RATE,
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
  let repository: CurrencyExchangeRateRepository

  beforeEach(() => {
    import.meta.env.VITE_API_BASE_URL = VITE_API_BASE_URL
    import.meta.env.VITE_API_KEY = VITE_API_KEY
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.resetModules()
    /// @ts-expect-error mocking the env vars
    import.meta.env = oldEnv
    vi.useRealTimers()
  })

  it('should correctly calculate the tip amount', () => {
    const tipCalculator = useTipCalculator()

    const tipAmountSpy = vi.spyOn(tipCalculator, 'calculateTipAmount')

    const tip = tipCalculator.calculateTipAmount(100, 0.1)

    expect(tip).toBe(10)
    expect(tipAmountSpy).toHaveBeenCalledTimes(1)
  })

  it('should correctly calculate the total based on the previously calculated tip', () => {
    const tipCalculator = useTipCalculator()

    const tipAmountSpy = vi.spyOn(tipCalculator, 'calculateTipAmount')
    const totalSpy = vi.spyOn(tipCalculator, 'calculateTotal')

    const AMOUNT = 100

    const tip = tipCalculator.calculateTipAmount(AMOUNT, 0.1)

    const total = tipCalculator.calculateTotal(AMOUNT, tip)

    expect(tip).toBe(10)
    expect(total).toBe(110)
    expect(tipAmountSpy).toHaveBeenCalledTimes(1)
    expect(totalSpy).toHaveBeenCalledTimes(1)
  })

  it('should correctly calculate the amount per person based on the previously calculated total', () => {
    const tipCalculator = useTipCalculator()

    const tipAmountSpy = vi.spyOn(tipCalculator, 'calculateTipAmount')
    const totalSpy = vi.spyOn(tipCalculator, 'calculateTotal')
    const perPersonSpy = vi.spyOn(tipCalculator, 'calculateAmountPerPerson')

    const AMOUNT = 100

    const tip = tipCalculator.calculateTipAmount(AMOUNT, 0.1)

    const total = tipCalculator.calculateTotal(AMOUNT, tip)

    const perPersonTotal = tipCalculator.calculateAmountPerPerson(total, 2)

    expect(tip).toBe(10)
    expect(total).toBe(110)
    expect(perPersonTotal).toBe(55)
    expect(tipAmountSpy).toHaveBeenCalledTimes(1)
    expect(totalSpy).toHaveBeenCalledTimes(1)
    expect(perPersonSpy).toHaveBeenCalledTimes(1)
  })

  it('should calculate summary values correctly', async () => {
    httpClient = new FetchHttpClient(import.meta.env.VITE_API_BASE_URL, {
      fetcherFn: mockFetch(BASE_CURRENCY, QUOTE_CURRENCY),
    })
    repository = new CurrencyExchangeRateRepository(httpClient, import.meta.env.VITE_API_KEY)

    const { formData, summary } = useTipCalculator({
      debounceMs: 100,
      client: httpClient,
      repository: repository,
    })

    formData.value.amount = 100
    formData.value.tipPercentage = 0.15
    formData.value.numberOfPeopleToSplit = 2

    await nextTick()

    expect(summary.value.tipTotal).toBe(15)
    expect(summary.value.total).toBe(115)
    expect(summary.value.perPersonAmount).toBe(57.5)
  })

  it('should fetch rate and calculate BRL total after debounce', async () => {
    httpClient = new FetchHttpClient(import.meta.env.VITE_API_BASE_URL, {
      fetcherFn: mockFetch(BASE_CURRENCY, QUOTE_CURRENCY),
    })
    repository = new CurrencyExchangeRateRepository(httpClient, import.meta.env.VITE_API_KEY)

    const calculator = useTipCalculator({
      debounceMs: 100,
      client: httpClient,
      repository: repository,
    })

    const repositorySpy = vi.spyOn(repository, 'getRate')

    const { formData, summary, totalInBrl, isCalculatingBrlTotal } = calculator

    formData.value.amount = 100
    formData.value.tipPercentage = 0.1
    formData.value.numberOfPeopleToSplit = 1
    formData.value.shouldUseUSD = false

    await nextTick()
    await vi.runAllTimersAsync()

    console.log(summary.value, totalInBrl.value, isCalculatingBrlTotal.value)

    expect(repositorySpy).toBeCalledTimes(1)
    expect(totalInBrl.value).toBeCloseTo(110 / RATE)
    expect(isCalculatingBrlTotal.value).toBe(false)
  })

  it('should not set BRL total if rate is null', async () => {
    httpClient = new FetchHttpClient(import.meta.env.VITE_API_BASE_URL, {
      fetcherFn: mockDelayedFetch(),
    })
    repository = new CurrencyExchangeRateRepository(httpClient, import.meta.env.VITE_API_KEY)

    const calculator = useTipCalculator({
      debounceMs: 100,
      client: httpClient,
      repository: repository,
    })

    const repositorySpy = vi.spyOn(repository, 'getRate')

    const { formData, totalInBrl } = calculator

    formData.value.amount = 200

    await nextTick()
    await vi.runAllTimersAsync()

    expect(repositorySpy).toBeCalledTimes(1)
    expect(totalInBrl.value).toBe(0)
  })

  it('should reset form data to default values', () => {
    const { formData, reset } = useTipCalculator()

    formData.value.amount = 999
    formData.value.tipPercentage = 0.99
    formData.value.numberOfPeopleToSplit = 99
    formData.value.shouldUseUSD = true

    reset()

    expect(formData.value).toEqual({
      amount: 0,
      tipPercentage: 0.1,
      numberOfPeopleToSplit: 2,
      shouldUseUSD: false,
    })
  })
})
