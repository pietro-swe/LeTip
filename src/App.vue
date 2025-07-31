<script setup lang="ts">
  import CalculatorPanel from './components/ui/CalculatorPanel.vue'
  import ResultPanel from './components/ui/ResultPanel.vue'
  import { useCurrencySymbol } from './composables/currency-symbol'
  import { useTipCalculator } from './composables/tip-calculator'

  const { formData, summary, totalInBrl } = useTipCalculator()

  const { currency, currencySymbol } = useCurrencySymbol(formData)
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Le/Tip</h1>
    </header>

    <main class="app-container__content">
      <CalculatorPanel v-model="formData" :currency :currency-symbol />

      <ResultPanel
        :should-use-usd="formData.shouldUseUSD"
        :summary
        :total-in-brl
        :currency-symbol
      />
    </main>
  </div>
</template>

<style scoped>
  .app-container {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;

    gap: 2rem;

    header {
      width: 100%;
      text-align: center;
    }

    .app-container__content {
      width: 100%;

      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  }
</style>
