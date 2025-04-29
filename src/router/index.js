import { createWebHistory, createRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import enums from '@/utility/enums'
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
        path: '/forgetPassword',
        component: () => import('../views/ForgetPassword.vue'),
        meta: {
          title: '忘记密码',
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
      {
        path: '/manage',
        redirect: '/manage/user',
        component: () => import('../views/manage/Manage.vue'),
        children: [
          {
            path: '/manage/user',
            component: () => import('../views/manage/User.vue'),
            meta: {
              title: '用户管理',
              requireAdmin: true,
            }
          },
          {
            path: '/manage/model',
            component: () => import('../views/manage/Model.vue'),
            meta: {
              title: '模型管理',
              requireAdmin: true,
            }
          },
          {
            path: '/manage/model/detail',
            component: () => import('../views/manage/ModelDetail.vue'),
            meta: {
              title: '模型详情',
              requireAdmin: true,
            }
          },
        ]
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

function isAdmin() {
  return store.token && store.user !== null && store.user.type === enums.USER_TYPE.ADMIN
}

function isLogin() {
  return store.token && store.user !== null
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAdmin) && !isAdmin()) {
    message.info('请先以管理员身份登录')
    next({ path: '/login' })
    return
  }

  if (to.matched.some(record => record.meta.requireLogin) && !isLogin()) {
    message.info('请先登录')
    next({ path: '/login' })
    return
  }

  next()
})

export default router