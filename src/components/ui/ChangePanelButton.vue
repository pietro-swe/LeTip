<script setup lang="ts">
  import ChevronIcon from '../icons/ChevronIcon.vue'

  const props = withDefaults(
    defineProps<{
      showingResults?: boolean
    }>(),
    {
      showingResults: false,
    },
  )

  const emit = defineEmits<{
    click: [MouseEvent]
  }>()

  function onClick(e: MouseEvent) {
    emit('click', e)
  }
</script>

<template>
  <button type="button" @click="onClick">
    <ChevronIcon
      class="icon"
      :class="{
        flipped: props.showingResults,
      }"
    />
  </button>
</template>

<style lang="css" scoped>
  button {
    position: absolute;
    bottom: 1rem;
    right: 1rem;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 3rem;
    height: 3rem;
    border-radius: 100%;
    background-color: var(--color-primary);

    .icon {
      width: 2rem;
      height: 2rem;
      color: var(--color-text);
    }
  }

  .flipped {
    transform: rotate(180deg);
  }
</style>
