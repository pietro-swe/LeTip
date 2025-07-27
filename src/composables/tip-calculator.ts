import { computed, ref } from 'vue'

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

export function useTipCalculator() {
  const formData = ref<TipFormSchema>({
    shouldUseUSD: false,
    amount: 0,
    tipPercentage: 0.1,
    numberOfPeopleToSplit: 2,
  })

  const summary = computed<SummarySchema>(() => {
    const tipTotal = calculateTipAmount(formData.value.amount, formData.value.tipPercentage)
    const total = calculateTotal(formData.value.amount, tipTotal)
    const perPersonAmount = calculateAmountPerPerson(total, formData.value.numberOfPeopleToSplit)

    return {
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

  function reset() {
    formData.value = {
      shouldUseUSD: false,
      amount: 0,
      tipPercentage: 0.1,
      numberOfPeopleToSplit: 2,
    }
  }

  return {
    formData,
    summary,
    reset,
    calculateTipAmount,
    calculateTotal,
    calculateAmountPerPerson,
  }
}
