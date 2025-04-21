import { createWebHistory, createRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import store from '@/store'

const routes = [
  {
    path: '/',
    redirect: '/home',
    children: [
      {
        path: '/login',
        component: () => import('../views/Login.vue'),
        meta: {
          title: '登录',
        }
      },
      {
        path: '/register',
        component: () => import('../views/Register.vue'),
        meta: {
          title: '注册',
        }
      },
      {
        path: '/home',
        component: () => import('../views/Home.vue'),
        meta: {
          title: '首页',
        }
      },
      {
        path: '/chat',
        component: () => import('../views/Chat.vue'),
        meta: {
          title: '对话',
          requireLogin: true,
        }
      },
      {
        path: '/user',
        component: () => import('../views/User.vue'),
        meta: {
          title: '用户',
          requireLogin: true,
        }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireLogin) && (!store.token || store.user === null)) {
    message.info('请先登录')
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router