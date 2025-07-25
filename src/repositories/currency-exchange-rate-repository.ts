import type { Currency } from "@/@types/enterprise/currency";
import type { GetRateResponse } from "@/@types/http/exchange-rate-response";
import type { IHttpClient } from "@/clients/http-client";
import { FetchHttpClient } from "@/clients/implementations/fetch-http-client";

type GetRateParams = {
  currencies: Currency[]
  baseCurrency?: Currency
  from?: Date
}

// TODO: Cache layer? Retry?
export class CurrencyExchangeRateRepository {
  readonly #baseURL: string
  readonly #apiKey: string

  readonly #client: IHttpClient

  constructor() {
    this.#baseURL = import.meta.env.VITE_API_BASE_URL
    this.#apiKey = import.meta.env.VITE_API_KEY

    this.#client = new FetchHttpClient(this.#baseURL)
  }

  async getRate(params: GetRateParams) {
    const {
      currencies,
      baseCurrency = 'EUR',
      from = new Date()
    } = params

    const date = this.#parseDate(from)
    const quoteCurrencies = this.#parseCurrenciesList(currencies)

    const headers = this.#buildHeaders();

    const response = await this.#client.get<GetRateResponse>(
      'rates',
      {
        date,
        base_currency: baseCurrency,
        quote_currencies: quoteCurrencies,
      },
      headers,
    )

    if (response instanceof Error) {
      return []
    }

    return response;
  }

  #parseCurrenciesList(currencies: Currency[]): string {
    return currencies.join(',')
  }

  #parseDate(date: Date): string {
    const [datePart, ..._] = date.toISOString().split('T')

    return datePart
  }

  #buildHeaders(): Headers {
    return new Headers({
      Authorizaiton: `ApiKey ${this.#apiKey}`,
      Accept: 'Application/json; Charset=utf-8',
    })
  }
}
