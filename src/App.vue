<script setup lang="ts"></script>

<template>
  <div class="app-container">
    <header>
      <h1>Le/Tip</h1>
    </header>

    <main>
      <p>test</p>
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
