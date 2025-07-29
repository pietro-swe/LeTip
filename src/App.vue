<script setup lang="ts">
  import RangeInput from './components/inputs/RangeInput.vue'
  import { useTipCalculator } from './composables/tip-calculator'

  const { formData } = useTipCalculator()

  const percentFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 0,
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

    <main>
      <RangeInput
        v-model="formData.tipPercentage"
        label="Gorjeta"
        :formatter="percentFormatter"
        :min="10"
        :max="20"
        :step="1"
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
  }
</style>
