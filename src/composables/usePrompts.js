import { ref, computed } from 'vue'

const STORAGE_KEY = 'ai-prompts-uk'

const seedPrompts = [
  {
    id: crypto.randomUUID(),
    title: 'Генератор Vue 3 компонентів',
    text: 'Ти Senior Vue 3 розробник. Згенеруй повністю типізований компонент із синтаксисом <script setup> для [НАЗВА_КОМПОНЕНТА], який приймає пропси [ПРОПСИ], емітує події [ПОДІЇ] та використовує Composition API. Додай JSDoc-коментарі та приклад використання.',
    tags: ['vue', 'компонент', 'фронтенд'],
    category: 'coding',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Оптимізатор SQL-запитів',
    text: 'Проаналізуй наступний SQL-запит та запропонуй оптимізації для підвищення продуктивності. Поясни кожну зміну, додай відповідні індекси та перепиши запит за потреби: [ВСТАВИТИ_ЗАПИТ]',
    tags: ['sql', 'база-даних', 'продуктивність'],
    category: 'coding',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Автор статей для блогу',
    text: 'Напиши захопливу статтю на 800 слів про [ТЕМА] для аудиторії [АУДИТОРІЯ]. Використай чіпляючий вступ, 3 основні розділи з підзаголовками, практичні приклади та сильний заклик до дії. Тон: [офіційний/розмовний].',
    tags: ['блог', 'написання', 'seo'],
    category: 'writing',
    isFavorite: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Асистент з рев'ю коду",
    text: "Перевір наступний фрагмент коду на: помилки, вразливості безпеки, проблеми з продуктивністю та невідповідності стилю. Вкажи рівень критичності (критичний/major/minor) для кожної проблеми та запропонуй виправлення: [ВСТАВИТИ_КОД]",
    tags: ["рев'ю", 'безпека', 'рефакторинг'],
    category: 'analysis',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Промпт для портрету Midjourney',
    text: 'Портрет [ОПИС_ПЕРСОНАЖА], кінематографічне освітлення, мала глибина різкості, зйомка на Sony A7IV, об\'єктив 85мм, золота година, ультра-реалістично, 8K, фотографія, що отримала нагороду --ar 2:3 --v 6 --style raw',
    tags: ['midjourney', 'портрет', 'фотографія'],
    category: 'image',
    isFavorite: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Конкурентний аналіз ринку',
    text: 'Проведи конкурентний аналіз [КОМПАНІЯ/ПРОДУКТ] у порівнянні з трьома головними конкурентами. Для кожного конкурента охопи: ціноутворення, ключові функції, цільову аудиторію, сильні та слабкі сторони. Виведи як структуровану markdown-таблицю з подальшим SWOT-аналізом.',
    tags: ['бізнес', 'стратегія', 'аналіз'],
    category: 'analysis',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Написання API документації',
    text: 'Згенеруй повну REST API документацію для наступного ендпоінту у форматі OpenAPI 3.0. Включи: опис, параметри з типами та правилами валідації, схему тіла запиту, схеми відповідей для 200/400/401/500 та приклад використання curl: [ВСТАВИТИ_КОД_ЕНДПОІНТУ]',
    tags: ['api', 'документація', 'бекенд'],
    category: 'coding',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
]

const stored = localStorage.getItem(STORAGE_KEY)
const prompts = ref(stored ? JSON.parse(stored) : seedPrompts)

if (!stored) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts.value))
}

const activeTag = ref(null)
const searchQuery = ref('')

const allTags = computed(() => {
  const tags = new Set()
  prompts.value.forEach((p) => p.tags.forEach((t) => tags.add(t)))
  return [...tags].sort()
})

const filteredPrompts = computed(() => {
  let result = prompts.value
  if (activeTag.value) {
    result = result.filter((p) => p.tags.includes(activeTag.value))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }
  return result
})

const favorites = computed(() => prompts.value.filter((p) => p.isFavorite))

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts.value))
}

function addPrompt(payload) {
  prompts.value.unshift({
    id: crypto.randomUUID(),
    title: payload.title,
    text: payload.text,
    tags: payload.tags,
    category: payload.category,
    isFavorite: false,
    createdAt: new Date().toISOString(),
  })
  persist()
}

function updatePrompt(id, payload) {
  const index = prompts.value.findIndex((p) => p.id === id)
  if (index !== -1) {
    prompts.value[index] = { ...prompts.value[index], ...payload }
    persist()
  }
}

function deletePrompt(id) {
  prompts.value = prompts.value.filter((p) => p.id !== id)
  persist()
}

function toggleFavorite(id) {
  const prompt = prompts.value.find((p) => p.id === id)
  if (prompt) {
    prompt.isFavorite = !prompt.isFavorite
    persist()
  }
}

function setActiveTag(tag) {
  activeTag.value = activeTag.value === tag ? null : tag
}

function getPromptById(id) {
  return prompts.value.find((p) => p.id === id)
}

export function usePrompts() {
  return {
    prompts,
    filteredPrompts,
    favorites,
    activeTag,
    searchQuery,
    allTags,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    setActiveTag,
    getPromptById,
  }
}
