<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePrompts } from '../composables/usePrompts'

const props = defineProps({
  prompt: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const { toggleFavorite, deletePrompt } = usePrompts()

const copied = ref(false)
const confirmDelete = ref(false)
const expanded = ref(false)

function toggleExpand() {
  expanded.value = !expanded.value
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.prompt.text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // fallback for non-secure contexts
    const el = document.createElement('textarea')
    el.value = props.prompt.text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

function handleDelete() {
  if (confirmDelete.value) {
    deletePrompt(props.prompt.id)
  } else {
    confirmDelete.value = true
  }
}

function cancelDelete() {
  confirmDelete.value = false
}

const categoryColors = {
  coding: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  writing: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  analysis: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  image: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
  other: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
}
</script>

<template>
  <div
    :class="[
      'bg-slate-800 rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200 cursor-pointer',
      expanded
        ? 'border-violet-500/50 shadow-lg shadow-violet-900/20'
        : 'border-slate-700 hover:shadow-lg hover:shadow-violet-900/20 hover:border-slate-600 hover:-translate-y-0.5',
    ]"
    @click="toggleExpand"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-white font-semibold text-base leading-snug">{{ prompt.title }}</h3>
      <div class="flex items-center gap-1.5 shrink-0">
        <span
          :class="[
            'text-xs px-2 py-0.5 rounded-full font-medium',
            categoryColors[prompt.category] || categoryColors.other,
          ]"
        >
          {{ prompt.category }}
        </span>
        <span class="text-slate-500 text-xs transition-transform duration-200" :class="expanded ? 'rotate-180' : ''">
          ▾
        </span>
      </div>
    </div>

    <!-- Text preview / full -->
    <p
      :class="['text-slate-400 text-sm leading-relaxed flex-1', expanded ? 'whitespace-pre-wrap' : 'line-clamp-3']"
    >{{ prompt.text }}</p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="tag in prompt.tags"
        :key="tag"
        class="text-xs px-2 py-0.5 bg-slate-700/80 text-slate-400 rounded-md"
      >
        #{{ tag }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1.5 pt-2 border-t border-slate-700/60 mt-auto" @click.stop>
      <!-- Copy -->
      <button
        @click="copyToClipboard"
        :class="[
          'flex-1 text-xs py-1.5 rounded-lg transition-all duration-200 font-medium',
          copied
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white',
        ]"
      >
        {{ copied ? '✓ Скопійовано!' : '📋 Копіювати' }}
      </button>

      <!-- Favorite -->
      <button
        @click="toggleFavorite(prompt.id)"
        :class="[
          'px-3 py-1.5 rounded-lg text-base transition-all duration-200',
          prompt.isFavorite
            ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
            : 'text-slate-500 bg-slate-700 hover:text-amber-400 hover:bg-amber-400/10',
        ]"
        :title="prompt.isFavorite ? 'Прибрати з вибраного' : 'Додати до вибраного'"
      >
        {{ prompt.isFavorite ? '⭐' : '☆' }}
      </button>

      <!-- Edit -->
      <button
        @click="router.push('/edit/' + prompt.id)"
        class="px-3 py-1.5 rounded-lg text-base text-slate-500 bg-slate-700 hover:text-violet-400 hover:bg-violet-400/10 transition-all duration-200"
        title="Редагувати"
      >
        ✏️
      </button>

      <!-- Delete / Confirm -->
      <template v-if="confirmDelete">
        <button
          @click="handleDelete"
          class="px-2.5 py-1.5 rounded-lg text-xs bg-red-600 text-white hover:bg-red-500 transition-colors font-semibold"
        >
          Так
        </button>
        <button
          @click="cancelDelete"
          class="px-2.5 py-1.5 rounded-lg text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors font-semibold"
        >
          Ні
        </button>
      </template>
      <button
        v-else
        @click="handleDelete"
        class="px-3 py-1.5 rounded-lg text-base text-slate-500 bg-slate-700 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        title="Видалити"
      >
        🗑️
      </button>
    </div>
  </div>
</template>
