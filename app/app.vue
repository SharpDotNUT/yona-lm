<script setup lang="ts">
import Bar from './components/Bar.vue';
</script>

<template>
  <div class="flex flex-col w-full h-screen overflow-y-hidden">
    <Bar class="w-full" />
    <NuxtPage class="w-full flex-1" />
  </div>
</template>
