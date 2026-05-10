<script setup>
import { usePrompts } from '../composables/usePrompts'
import PromptCard from '../components/PromptCard.vue'

const { filteredPrompts, allTags, activeTag, searchQuery, setActiveTag } = usePrompts()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Search bar -->
    <div class="mb-5">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Пошук промптів за назвою, текстом або тегом..."
        class="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
      />
    </div>

    <!-- Tag filter bar -->
    <div v-if="allTags.length" class="flex gap-2 overflow-x-auto pb-3 mb-6">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="setActiveTag(tag)"
        :class="[
          'shrink-0 text-sm px-3 py-1 rounded-full border transition-all duration-150 font-medium',
          activeTag === tag
            ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-900/30'
            : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-violet-500 hover:text-violet-300',
        ]"
      >
        #{{ tag }}
      </button>
    </div>

    <!-- Prompt grid -->
    <div
      v-if="filteredPrompts.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <PromptCard v-for="prompt in filteredPrompts" :key="prompt.id" :prompt="prompt" />
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
      <div class="text-7xl mb-4 select-none">🔍</div>
      <h3 class="text-xl font-semibold text-slate-300 mb-2">Промптів не знайдено</h3>
      <p class="text-slate-500 mb-8 max-w-xs">
        Спробуйте змінити пошуковий запит або фільтр тегів
      </p>
      <router-link
        to="/add"
        class="px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-medium"
      >
        ✨ Додати перший промпт
      </router-link>
    </div>
  </div>
</template>
