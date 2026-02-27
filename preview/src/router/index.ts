import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/design',
      name: 'design',
      component: () => import('../views/Design.vue'),
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/Main.vue'),
    },
    {
      path: '/qnanova',
      name: 'qnanova',
      component: () => import('../views/QnaNova.vue'),
    },
  ],
});

export default router;
