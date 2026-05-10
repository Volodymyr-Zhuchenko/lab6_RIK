import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddPromptView from '../views/AddPromptView.vue'
import EditPromptView from '../views/EditPromptView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/add', component: AddPromptView },
    { path: '/edit/:id', component: EditPromptView },
    { path: '/favorites', component: FavoritesView },
    { path: '/:pathMatch(.*)*', component: NotFoundView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
