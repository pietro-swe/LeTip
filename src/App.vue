<script setup lang="ts">
  import { breakpointsSematic, useBreakpoints } from '@vueuse/core'
  import CalculatorPanel from './components/ui/CalculatorPanel.vue'
  import ChangePanelButton from './components/ui/ChangePanelButton.vue'
  import ResultPanel from './components/ui/ResultPanel.vue'
  import { useCurrencySymbol } from './composables/currency-symbol'
  import { useTipCalculator } from './composables/tip-calculator'
  import { computed, ref } from 'vue'

  const { formData, summary, totalInBrl } = useTipCalculator()
  const { currency, currencySymbol } = useCurrencySymbol(formData)
  const breakpoints = useBreakpoints(breakpointsSematic)

  const showingResults = ref<boolean>(false)
  const currentBreakpoint = breakpoints.active()

  const isOnDesktop = computed(() => {
    return (
      currentBreakpoint.value !== '' &&
      currentBreakpoint.value !== 'mobileS' &&
      currentBreakpoint.value !== 'mobileM' &&
      currentBreakpoint.value !== 'mobileL' &&
      currentBreakpoint.value !== 'tablet'
    )
  })

  function onClickChangePanel() {
    showingResults.value = !showingResults.value
  }
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

      <ChangePanelButton v-if="!isOnDesktop" :showing-results @click="onClickChangePanel" />
    </main>
  </div>
</template>

<style scoped>
  /* Laptop Small and beyond */
  @media (min-width: 1024px) {
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
  }

  .app-container {
    position: relative;
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
      align-items: center;
      flex-direction: column;
      justify-content: space-around;
    }
  }
</style>
