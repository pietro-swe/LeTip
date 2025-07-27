import type { Currency } from '@/@types/enterprise/currency'
import type { GetRateResponse } from '@/@types/http/exchange-rate-response'
import type { IHttpClient } from '@/clients/http-client'

type GetRateParams = {
  currency: Currency
  baseCurrency?: Currency
  date?: Date
}

export class CurrencyExchangeRateRepository {
  readonly #client: IHttpClient
  readonly #apiKey: string

  constructor(client: IHttpClient, apiKey: string) {
    this.#client = client
    this.#apiKey = apiKey
  }

  async getRate(params: GetRateParams): Promise<number | null> {
    try {
      const { currency, baseCurrency = 'EUR', date = new Date() } = params

      const endpoint = this.#buildSingleRateEndpoint(baseCurrency, currency)
      const fromDate = this.#parseDate(date)
      const headers = this.#buildHeaders()

      const response = await this.#client.get<GetRateResponse>({
        endpoint,
        headers,
        query: {
          date: fromDate,
        },
      })

      return response.quote
    } catch (error) {
      console.log(error)

      return null
    }
  }

  #buildSingleRateEndpoint(baseCurrency: string, quoteCurrency: string): string {
    return `rates/${baseCurrency}/${quoteCurrency}`
  }

  #parseDate(date: Date): string {
    const [datePart, ..._] = date.toISOString().split('T')

    return datePart
  }

  #buildHeaders(): Headers {
    return new Headers({
      Authorization: `ApiKey ${this.#apiKey}`,
      Accept: 'Application/json; Charset=utf-8',
    })
  }
}
