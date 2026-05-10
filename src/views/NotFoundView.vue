<script setup>
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <div
      class="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-violet-400 to-violet-700 mb-4 select-none"
    >
      404
    </div>
    <h2 class="text-2xl font-semibold text-white mb-3">Сторінку не знайдено</h2>
    <p class="text-slate-400 mb-8 max-w-sm">
      Схоже, ця сторінка не існує або була переміщена
    </p>
    <router-link
      to="/"
      class="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-medium"
    >
      Повернутися на головну
    </router-link>
  </div>
</template>
