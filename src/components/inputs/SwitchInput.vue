<script setup lang="ts">
  const modelValue = defineModel<boolean>({
    required: true,
  })
</script>

<template>
  <label class="switch">
    <input type="checkbox" v-model="modelValue" />

    <div class="slider"></div>
  </label>
</template>

<style lang="css" scoped>
  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;

    input {
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .slider {
        background-color: var(--color-primary);
      }

      &:checked + .slider::before {
        transform: translateX(20px);
      }
    }

    .slider {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      border-radius: 9999px;
      transition: background-color 0.3s ease;
      cursor: pointer;

      &::before {
        content: '';
        position: absolute;
        height: 20px;
        width: 20px;
        left: 2px;
        top: 2px;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        transition: transform 0.3s ease;
      }
    }
  }
</style>
