<script setup>
import { ref, provide } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { usePrompts } from './composables/usePrompts'

const route = useRoute()
const { favorites } = usePrompts()

const toasts = ref([])

function showToast(message, type = 'success') {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 3000)
}

provide('showToast', showToast)
</script>

<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Navbar -->
    <nav
      class="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800"
    >
      <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2 font-bold text-lg text-white hover:text-violet-400 transition-colors"
        >
          <span class="text-xl">✨</span>
          <span>PromptVault</span>
        </router-link>

        <!-- Nav links -->
        <div class="flex items-center gap-1">
          <router-link
            to="/"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
              route.path === '/'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800',
            ]"
          >
            Головна
          </router-link>

          <router-link
            to="/add"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
              route.path === '/add'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800',
            ]"
          >
            + Додати
          </router-link>

          <router-link
            to="/favorites"
            :class="[
              'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
              route.path === '/favorites'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800',
            ]"
          >
            ⭐ Вибране
            <span
              v-if="favorites.length"
              class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm"
            >
              {{ favorites.length }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="pt-14">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <!-- Toast notifications -->
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2.5 min-w-[220px] pointer-events-auto',
            toast.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-900/30'
              : 'bg-red-600 text-white shadow-red-900/30',
          ]"
        >
          <span class="text-base">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  transform: translateX(110%);
  opacity: 0;
}
.toast-leave-to {
  transform: translateX(110%);
  opacity: 0;
}
</style>
