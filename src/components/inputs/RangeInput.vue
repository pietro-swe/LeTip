<script lang="ts" setup>
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      label: string
      min: number
      max: number
      step: number
      formatter: Intl.NumberFormat
      percentage?: boolean
      id?: string
    }>(),
    {
      percentage: false,
      id: crypto.randomUUID(),
    },
  )

  const modelValue = defineModel<number>({
    required: true,
  })

  const isUsingPercentageFormatter = props.formatter.resolvedOptions().style === 'percent'

  const formattedValue = computed(() => {
    return props.formatter.format(modelValue.value)
  })
</script>

<template>
  <div class="range-input-container">
    <div class="range-input-container__label-container">
      <label :for="props.id">{{ props.label }}</label>

      <strong>{{ formattedValue }}</strong>
    </div>

    <div class="range-input-container__input">
      <span>{{ isUsingPercentageFormatter ? props.min * 100 : props.min }}</span>
      <input
        v-model.number="modelValue"
        type="range"
        :id="props.id"
        :min="props.min"
        :max="props.max"
        :step="props.step"
      />
      <span>{{ isUsingPercentageFormatter ? props.max * 100 : props.max }}</span>
    </div>
  </div>
</template>

<style scoped>
  .range-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .range-input-container__label-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;

      label {
        font-size: 0.875rem;
        color: var(--color-text);
      }

      strong {
        font-size: 1.125rem;
        color: var(--color-text);
      }
    }

    .range-input-container__input {
      display: flex;
      flex-direction: row;
      gap: 0.75rem;

      span {
        font-size: 0.875rem;
        color: var(--color-text);
      }

      input {
        width: 100%;
        accent-color: var(--color-primary);
      }
    }
  }
</style>
