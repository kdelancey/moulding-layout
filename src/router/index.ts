import { createRouter, createWebHistory } from 'vue-router'
import WainscotView from '../views/WainscotView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WainscotView,
    },
  ],
})

export default router
