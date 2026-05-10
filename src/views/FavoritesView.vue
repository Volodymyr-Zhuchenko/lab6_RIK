<script setup>
import { usePrompts } from '../composables/usePrompts'
import PromptCard from '../components/PromptCard.vue'

const { favorites } = usePrompts()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-white mb-6">
      Вибране
      <span
        v-if="favorites.length"
        class="ml-2 text-base font-normal text-violet-400"
      >
        ({{ favorites.length }})
      </span>
    </h1>

    <div
      v-if="favorites.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <PromptCard v-for="prompt in favorites" :key="prompt.id" :prompt="prompt" />
    </div>

    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
      <div class="text-7xl mb-4 select-none">⭐</div>
      <h3 class="text-xl font-semibold text-slate-300 mb-2">Поки немає вибраних</h3>
      <p class="text-slate-500 mb-8 max-w-xs">
        Натисніть ☆ на картці промпту, щоб додати його до вибраного
      </p>
      <router-link
        to="/"
        class="px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-medium"
      >
        Переглянути всі промпти
      </router-link>
    </div>
  </div>
</template>
