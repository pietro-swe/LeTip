import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'

export type TipFormSchema = {
  shouldUseUSD: boolean
  amount: number
  tipPercentage: number
  numberOfPeopleToSplit: number
}

export type SummarySchema = {
  tipTotal: number
  total: number
  perPersonAmount: number
}

export const useTipCalculatorStore = defineStore('tip-calculator', () => {
  const formData = ref<TipFormSchema>({
    shouldUseUSD: false,
    amount: 0,
    tipPercentage: 0.10,
    numberOfPeopleToSplit: 2,
  })

  const summary = computed<SummarySchema>(() => {
    const tipTotal = formData.value.amount * formData.value.tipPercentage
    const total = formData.value.amount + tipTotal
    const perPersonAmount = total / formData.value.numberOfPeopleToSplit

    return {
      total,
      tipTotal,
      perPersonAmount,
    }
  });

  function $reset() {
    formData.value = {
      shouldUseUSD: false,
      amount: 0,
      tipPercentage: 0.10,
      numberOfPeopleToSplit: 2,
    }
  }

  return {
    formData,
    summary,
    $reset,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTipCalculatorStore, import.meta.hot))
}
