<template>
  <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <a-row>
        <a-col :span="6">
          <span :style="{ color: 'white', fontSize: '18px' }">基于大语言模型的金融自动化建模</span>
        </a-col>

        <a-col :span="12">
          <a-space :size="30">
            <a @click="clickHome">首页</a>
            <a @click="clickChat">聊天</a>
            <a @click="clickUser">用户</a>
            <a v-if="isLoginAdmin" @click="clickManage">管理</a>
          </a-space>
        </a-col>

        <a-col :span="6">
          <div :style="{ float: 'right' }">
            <a-space v-if="isLoginUser" size="large">
              <span :style="{ color: '#f0f0f0' }">欢迎您！{{ store.user.name }}</span>
              <a @click="clickLogout">登出</a>
            </a-space>
            <a-space v-else size="large">
              <a @click="clickLogin">登录</a>
              <a @click="clickRegister">注册</a>
            </a-space>
          </div>
        </a-col>
      </a-row>
    </a-layout-header>

    <a-layout-content :style="{ padding: '15px 25px', marginTop: '64px' }">
      <div :style="{ background: '#fff', padding: '20px', minHeight: '800px' }">
        <RouterView />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRouter } from 'vue-router'

import api from '@/api'
import enums from '@/utility/enums'
import store from '@/store'

const router = useRouter()

const isLoginUser = computed(() => {
  return store.token && store.user !== null
})

const isLoginAdmin = computed(() => {
  return store.token && store.user !== null && store.user.type === enums.USER_TYPE.ADMIN
})

function clickHome() {
  router.push('/home')
}
function clickChat() {
  router.push('/chat')
}
function clickUser() {
  router.push('/user')
}
function clickManage() {
  router.push('/manage')
}
function clickLogin() {
  router.push('/login')
}
function clickRegister() {
  router.push('/register')
}

async function clickLogout() {
  try {
    await api.auth.logout()
  } catch (error) {
    return
  }
  store.setToken("")
  store.setUser(null)
  router.push('/login')
}
</script>

<style scoped>
a {
  color: #fff;
}
</style>