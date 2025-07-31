import type { IHttpClient } from '@/clients/http-client'
import { FetchHttpClient } from '@/clients/implementations/fetch-http-client'
import { CurrencyExchangeRateRepository } from '@/repositories/currency-exchange-rate-repository'
import { watchDebounced } from '@vueuse/core'
import { computed, ref } from 'vue'

export type TipFormSchema = {
  shouldUseUSD: boolean
  amount: number
  tipPercentage: number
  numberOfPeopleToSplit: number
}

export type SummarySchema = {
  amount: number
  tipTotal: number
  total: number
  perPersonAmount: number
}

export type UseTipCalculatorOptions = {
  debounceMs?: number
  client?: IHttpClient
  repository?: CurrencyExchangeRateRepository
}

export function useTipCalculator(options?: UseTipCalculatorOptions) {
  const { debounceMs = 750, client = new FetchHttpClient(import.meta.env.VITE_API_BASE_URL) } =
    options ?? {
      debounceMs: 750,
      client: new FetchHttpClient(import.meta.env.VITE_API_BASE_URL),
    }

  const repository =
    options?.repository ?? new CurrencyExchangeRateRepository(client, import.meta.env.VITE_API_KEY)

  const isCalculatingBrlTotal = ref<boolean>(false)

  const formData = ref<TipFormSchema>({
    shouldUseUSD: false,
    amount: 0,
    tipPercentage: 0.1,
    numberOfPeopleToSplit: 2,
  })

  const totalInBrl = ref<number>(0)

  const summary = computed<SummarySchema>(() => {
    const tipTotal = calculateTipAmount(formData.value.amount, formData.value.tipPercentage)
    const total = calculateTotal(formData.value.amount, tipTotal)
    const perPersonAmount = calculateAmountPerPerson(total, formData.value.numberOfPeopleToSplit)

    return {
      amount: formData.value.amount,
      total,
      tipTotal,
      perPersonAmount,
    }
  })

  function calculateTipAmount(amount: number, tipPercentage: number): number {
    return amount * tipPercentage
  }

  function calculateTotal(amount: number, tipTotal: number): number {
    return amount + tipTotal
  }

  function calculateAmountPerPerson(total: number, numberOfPersonsToSplit: number): number {
    const numberOfPersons = numberOfPersonsToSplit === 0 ? 1 : numberOfPersonsToSplit

    return total / numberOfPersons
  }

  async function onSummaryUpdate(updatedSummary: SummarySchema) {
    isCalculatingBrlTotal.value = true

    const rate = await repository.getRate({
      currency: 'BRL',
      baseCurrency: formData.value.shouldUseUSD ? 'USD' : 'EUR',
    })

    if (!rate) {
      isCalculatingBrlTotal.value = false
      return
    }

    totalInBrl.value = updatedSummary.total / rate

    isCalculatingBrlTotal.value = false
  }

  function reset() {
    formData.value = {
      shouldUseUSD: false,
      amount: 0,
      tipPercentage: 0.1,
      numberOfPeopleToSplit: 2,
    }
  }

  watchDebounced(summary, onSummaryUpdate, {
    debounce: debounceMs,
  })

  return {
    isCalculatingBrlTotal,
    formData,
    summary,
    totalInBrl,
    reset,
    calculateTipAmount,
    calculateTotal,
    calculateAmountPerPerson,
    onSummaryUpdate,
  }
}
