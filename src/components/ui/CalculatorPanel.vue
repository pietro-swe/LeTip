<script setup lang="ts">
  import type { TipFormSchema } from '@/composables/tip-calculator'
  import RangeInput from '../inputs/RangeInput.vue'
  import type { CurrencyLocale } from '@/composables/currency-symbol'
  import SwitchInput from '../inputs/SwitchInput.vue'
  import CurrencyInput from '../inputs/CurrencyInput.vue'

  const props = defineProps<{
    currency: CurrencyLocale
    currencySymbol: string
  }>()

  const modelValue = defineModel<TipFormSchema>({
    required: true,
  })

  const percentFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: 0,
  })

  const unitFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  })
</script>

<template>
  <div class="calculator-panel">
    <div class="calculator-panel__switch-container">
      <span>EUR</span>
      <SwitchInput v-model="modelValue.shouldUseUSD" />
      <span>USD</span>
    </div>

    <CurrencyInput
      v-model="modelValue.amount"
      label="Valor"
      :currency="props.currency"
      :symbol="props.currencySymbol"
    />

    <RangeInput
      v-model="modelValue.tipPercentage"
      label="Gorjeta"
      :formatter="percentFormatter"
      :min="0.1"
      :max="0.2"
      :step="0.01"
    />

    <RangeInput
      v-model="modelValue.numberOfPeopleToSplit"
      label="Pessoas"
      :formatter="unitFormatter"
      :min="2"
      :max="16"
      :step="1"
    />
  </div>
</template>

<style lang="css" scoped>
  .calculator-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .calculator-panel__switch-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;

      span {
        font-size: 0.75rem;
        color: var(--color-text);
      }
    }
  }
</style>
