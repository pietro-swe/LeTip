import { computed, type Ref } from 'vue'
import type { TipFormSchema } from './tip-calculator'

export type CurrencyLocale = 'USD' | 'EUR'

export function useCurrencySymbol(form: Ref<TipFormSchema>) {
  const currency = computed<CurrencyLocale>(() => {
    if (form.value.shouldUseUSD) {
      return 'USD'
    }

    return 'EUR'
  })

  const currencySymbol = computed(() => {
    if (currency.value === 'USD') {
      return '$'
    }

    return '€'
  })

  return {
    currency,
    currencySymbol,
  }
}
