<template>
  <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <a-row>
        <a-col :span="6">
          <span :style="{ color: 'white', fontSize: '18px' }">基于大语言模型的金融自动化建模</span>
        </a-col>
        <a-col :span="12">
          <a-menu v-model:selectedKeys="selectedKeys" @click="clickMenu" theme="dark" mode="horizontal">
            <a-menu-item key="/home">首页</a-menu-item>
            <a-menu-item key="/chat">聊天</a-menu-item>
            <a-menu-item key="/user">账户</a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="6">
          <div :style="{ float: 'right' }">
            <a-space v-if="!store.token || store.user === null" size="large">
              <a @click="clickLogin">登录</a>
              <a @click="clickRegister">注册</a>
            </a-space>
            <a-space v-else size="large">
              <span :style="{ color: '#f0f0f0' }">
                欢迎您！{{ store.user.name }}
              </span>
              <a @click="clickLogout">登出</a>
            </a-space>
          </div>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content :style="{ padding: '15px 15px', marginTop: '64px' }">
      <div :style="{ background: '#fff', padding: '20px', minHeight: '500px' }">
        <RouterView />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import api from '@/api'
import store from '@/store'

const route = useRoute()
const router = useRouter()

const selectedKeys = ref([`/${route.path.split('/')[1]}`])

watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [`/${newPath.split('/')[1]}`]
  }
)

function clickMenu({ item, key, keyPath }) {
  router.push(key)
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