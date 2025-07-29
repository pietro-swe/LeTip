<script setup lang="ts">
  import CurrencyInput from './components/inputs/CurrencyInput.vue'
  import RangeInput from './components/inputs/RangeInput.vue'
  import { useCurrencySymbol } from './composables/currency-symbol'
  import { useTipCalculator } from './composables/tip-calculator'

  const { formData } = useTipCalculator()

  const { currency, currencySymbol } = useCurrencySymbol(formData)

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
  <div class="app-container">
    <header>
      <h1>Le/Tip</h1>
    </header>

    <main class="app-container__content">
      <CurrencyInput
        v-model="formData.amount"
        label="Valor"
        :currency="currency"
        :symbol="currencySymbol"
      />

      <RangeInput
        v-model="formData.tipPercentage"
        label="Gorjeta"
        :formatter="percentFormatter"
        :min="0.1"
        :max="0.2"
        :step="0.01"
      />

      <RangeInput
        v-model="formData.numberOfPeopleToSplit"
        label="Pessoas"
        :formatter="unitFormatter"
        :min="2"
        :max="16"
        :step="1"
      />
    </main>
  </div>
</template>

<style scoped>
  .app-container {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-rows: repeat(2, minmax(0, 1fr));
    justify-content: center;
    align-content: center;

    .app-container__content {
      .app-container__content__form {
      }

      .app-container__content__summary {
      }
    }
  }
</style>
