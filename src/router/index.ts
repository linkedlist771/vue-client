import { createRouter, createWebHistory } from 'vue-router'
// import Chat from '../views/ChatView.vue'
// import Nav from '../views/NavView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/chat',
      name: 'key',
      component: () => import('../views/KeyView.vue')
    },
    {
      path: '/claude/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue')
    },
    {
      path: '/claude/status',
      name: 'status',
      component: () => import('../views/StatusView.vue')
    },
    {
      path: '/claude/artifacts',
      name: 'artifacts',
      component: () => import('../views/VueLiteRender.vue')
    }
  ]
})

export default router
