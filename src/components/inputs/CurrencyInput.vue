<script lang="ts" setup>
  import type { CurrencyLocale } from '@/composables/currency-symbol'
  import { watch } from 'vue'
  import { CurrencyDisplay, useCurrencyInput } from 'vue-currency-input'

  const props = withDefaults(
    defineProps<{
      label: string
      currency: CurrencyLocale
      symbol: string
      id?: string
    }>(),
    {
      id: crypto.randomUUID(),
    },
  )

  const modelValue = defineModel<number>({
    required: true,
  })

  defineEmits<{
    change: []
  }>()

  const { inputRef, formattedValue, setValue } = useCurrencyInput({
    currency: props.currency,
    locale: 'en',
    precision: 2,
    currencyDisplay: CurrencyDisplay.hidden,
    hideCurrencySymbolOnFocus: true,
    hideGroupingSeparatorOnFocus: true,
    hideNegligibleDecimalDigitsOnFocus: false,
    autoDecimalDigits: true,
    useGrouping: true,
    accountingSign: false,
  })

  watch(modelValue, (value) => {
    setValue(value)
  })
</script>

<template>
  <div class="currency-input-container">
    <label :for="props.id">{{ props.label }}</label>

    <div class="currency-input-container__input-wrapper">
      <span>{{ props.symbol }}</span>

      <div class="currency-input-container__input">
        <input
          ref="inputRef"
          v-model="formattedValue"
          type="text"
          inputmode="decimal"
          :id="props.id"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .currency-input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    justify-content: space-between;

    label {
      font-size: 0.875rem;
      color: var(--color-text);
    }

    .currency-input-container__input-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.3rem;

      .currency-input-container__input {
        padding: 0.5rem;
        border: solid 1px var(--color-border);
        background-color: var(--color-surface);
        border-radius: 0.75rem;

        input {
          width: 100%;
          height: 100%;
          background-color: transparent;
          font-size: 1rem;
          color: var(--color-text);

          border: none;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
</style>
