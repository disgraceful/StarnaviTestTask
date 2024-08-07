import { createRouter, createWebHistory } from 'vue-router'
import CharacterListView from '../views/CharacterListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'characters',
      component: CharacterListView,
    },
    {
      path: '/character/:id',
      name: 'character',
      component: ()=> import('../views/CharacterView.vue'),
    },

  ]
})

export default router
