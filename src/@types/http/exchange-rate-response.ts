import type { Currency } from '../enterprise/currency'

export type Rate = {
  base_currency: Currency
  quote_currency: Currency
  quote: number
  date: string
}

export type GetRateResponse = Rate
