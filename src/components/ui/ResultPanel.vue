<script setup lang="ts">
  import type { SummarySchema } from '@/composables/tip-calculator'

  const props = defineProps<{
    shouldUseUsd: boolean
    summary: SummarySchema
    totalInBrl: number
    currencySymbol: string
  }>()

  const numberFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  function formatCurrency(value: number) {
    return numberFormatter.format(value)
  }
</script>

<template>
  <div class="result-panel">
    <div class="result-panel__metric-container">
      <span class="result-panel__metric-container__label">Conta</span>

      <div class="result-panel__metric-container__metric">
        <span class="result-panel__metric-container__metric__sign">{{ props.currencySymbol }}</span>
        <span class="result-panel__metric-container__metric__value">{{
          formatCurrency(props.summary.amount)
        }}</span>
      </div>
    </div>
    <div class="result-panel__metric-container">
      <span class="result-panel__metric-container__label">Gorjeta</span>

      <div class="result-panel__metric-container__metric">
        <span class="result-panel__metric-container__metric__sign">{{ props.currencySymbol }}</span>
        <span class="result-panel__metric-container__metric__value">{{
          formatCurrency(props.summary.tipTotal)
        }}</span>
      </div>
    </div>
    <div class="result-panel__metric-container">
      <span class="result-panel__metric-container__label">Total</span>

      <div class="result-panel__metric-container__metric">
        <span class="result-panel__metric-container__metric__sign">{{ props.currencySymbol }}</span>
        <span class="result-panel__metric-container__metric__value">{{
          formatCurrency(props.summary.total)
        }}</span>
      </div>
    </div>
    <div class="result-panel__metric-container">
      <span class="result-panel__metric-container__label">Por pessoa</span>

      <div class="result-panel__metric-container__metric">
        <span class="result-panel__metric-container__metric__sign">{{ props.currencySymbol }}</span>
        <span class="result-panel__metric-container__metric__value">{{
          formatCurrency(props.summary.perPersonAmount)
        }}</span>
      </div>
    </div>
    <div class="result-panel__metric-container">
      <span class="result-panel__metric-container__label">Em R$</span>

      <div class="result-panel__metric-container__metric">
        <span class="result-panel__metric-container__metric__sign">R$</span>
        <span class="result-panel__metric-container__metric__value">{{
          formatCurrency(props.totalInBrl)
        }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
  .result-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .result-panel__metric-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;

      .result-panel__metric-container__label {
        font-size: 1rem;
        color: var(--color-text);
      }

      .result-panel__metric-container__metric {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25rem;

        .result-panel__metric-container__metric__sign {
          font-size: 0.75rem;
          color: var(--color-text);
        }

        .result-panel__metric-container__metric__value {
          font-size: 1rem;
          color: var(--color-text);
        }
      }
    }
  }
</style>
