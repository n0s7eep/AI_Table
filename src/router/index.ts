import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import ExecutionView from '../views/ExecutionView.vue'
import CreationView from '../views/CreationView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/execution'
  },
  {
    path: '/execution',
    name: 'Execution',
    component: ExecutionView
  },
  {
    path: '/creation',
    name: 'Creation',
    component: CreationView
  },
  {
    path: '/collaboration',
    name: 'Collaboration',
    component: () => import('../views/CollaborationView.vue')
  },
  {
    path: '/management',
    name: 'Management',
    component: () => import('../views/ManagementView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
