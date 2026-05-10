<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePrompts } from '../composables/usePrompts'

const router = useRouter()
const route = useRoute()
const { getPromptById, updatePrompt } = usePrompts()
const showToast = inject('showToast')

const title = ref('')
const text = ref('')
const tagsInput = ref('')
const tags = ref([])
const category = ref('coding')

const titleTouched = ref(false)
const textTouched = ref(false)

onMounted(() => {
  const prompt = getPromptById(route.params.id)
  if (!prompt) {
    router.push('/')
    return
  }
  title.value = prompt.title
  text.value = prompt.text
  tags.value = [...prompt.tags]
  category.value = prompt.category
})

function validateTitle() {
  if (!title.value.trim()) return "Назва є обов'язковою"
  if (title.value.length > 80) return 'Максимум 80 символів'
  return ''
}

function validateText() {
  if (!text.value.trim()) return "Текст промпту є обов'язковим"
  if (text.value.length < 20) return 'Мінімум 20 символів'
  return ''
}

const titleError = computed(() => (titleTouched.value ? validateTitle() : ''))
const textError = computed(() => (textTouched.value ? validateText() : ''))
const isValid = computed(() => !validateTitle() && !validateText())

function parseTagsInput() {
  if (!tagsInput.value.trim()) return
  const parsed = tagsInput.value
    .split(',')
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter((t) => t.length > 0)
  tags.value = [...new Set([...tags.value, ...parsed])]
  tagsInput.value = ''
}

function removeTag(tag) {
  tags.value = tags.value.filter((t) => t !== tag)
}

function handleTagsKeydown(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    parseTagsInput()
  }
}

function submit() {
  titleTouched.value = true
  textTouched.value = true
  if (!isValid.value) return
  if (tagsInput.value.trim()) parseTagsInput()

  updatePrompt(route.params.id, {
    title: title.value.trim(),
    text: text.value.trim(),
    tags: tags.value,
    category: category.value,
  })

  showToast('Промпт успішно оновлено!', 'success')
  router.push('/')
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/" class="text-slate-400 hover:text-white transition-colors text-sm">
        ← Назад
      </router-link>
      <h1 class="text-2xl font-bold text-white">Редагувати промпт</h1>
    </div>

    <form
      @submit.prevent="submit"
      class="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-5"
    >
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1.5">
          Назва <span class="text-red-400">*</span>
        </label>
        <input
          v-model="title"
          type="text"
          @blur="titleTouched = true"
          placeholder="Коротка описова назва..."
          maxlength="80"
          :class="[
            'w-full bg-slate-900 border text-white placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none transition-all',
            titleError
              ? 'border-red-500 focus:border-red-400'
              : 'border-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30',
          ]"
        />
        <div class="flex justify-between mt-1.5">
          <span v-if="titleError" class="text-red-400 text-xs">{{ titleError }}</span>
          <span class="text-slate-500 text-xs ml-auto">{{ title.length }}/80</span>
        </div>
      </div>

      <!-- Prompt text -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1.5">
          Текст промпту <span class="text-red-400">*</span>
        </label>
        <textarea
          v-model="text"
          @blur="textTouched = true"
          placeholder="Введіть повний текст промпту..."
          rows="6"
          maxlength="2000"
          :class="[
            'w-full bg-slate-900 border text-white placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none transition-all resize-none',
            textError
              ? 'border-red-500 focus:border-red-400'
              : 'border-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30',
          ]"
        ></textarea>
        <div class="flex justify-between mt-1.5">
          <span v-if="textError" class="text-red-400 text-xs">{{ textError }}</span>
          <span class="text-slate-500 text-xs ml-auto">{{ text.length }}/2000</span>
        </div>
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1.5">Теги</label>
        <div v-if="tags.length" class="flex flex-wrap gap-1.5 mb-2">
          <span
            v-for="tag in tags"
            :key="tag"
            class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-violet-600/25 text-violet-300 border border-violet-500/30 rounded-md"
          >
            #{{ tag }}
            <button
              type="button"
              @click="removeTag(tag)"
              class="hover:text-red-400 transition-colors leading-none ml-0.5"
            >
              ×
            </button>
          </span>
        </div>
        <input
          v-model="tagsInput"
          @keydown="handleTagsKeydown"
          @blur="parseTagsInput"
          type="text"
          placeholder="frontend, vue, coding..."
          class="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
        />
        <p class="text-slate-500 text-xs mt-1">Натисніть Enter або кому для підтвердження тега</p>
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1.5">Категорія</label>
        <select
          v-model="category"
          class="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all appearance-none cursor-pointer"
        >
          <option value="coding">💻 Coding</option>
          <option value="writing">✍️ Writing</option>
          <option value="analysis">📊 Analysis</option>
          <option value="image">🎨 Image</option>
          <option value="other">📦 Other</option>
        </select>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3 pt-1">
        <button
          type="submit"
          :disabled="titleTouched && textTouched && !isValid"
          class="flex-1 py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💾 Зберегти зміни
        </button>
        <router-link
          to="/"
          class="px-5 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors text-center"
        >
          Скасувати
        </router-link>
      </div>
    </form>
  </div>
</template>
