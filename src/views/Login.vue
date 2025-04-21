<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <div class="center-container">
      <p :style="{ fontSize: '18px' }">登录</p>
      <a-form name="login" autocomplete="off" :model="formState" :rules="rules" :style="{ width: '350px' }"
        @finish="finishLogin">
        <a-form-item has-feedback label="用户名" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item has-feedback label="密码" name="passwd">
          <a-input-password v-model:value="formState.passwd" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :style="{ width: '100%' }">
            登录
          </a-button>
          <span>
            新用户？
            <a @click="clickRegister">注册</a>
          </span>
        </a-form-item>
      </a-form>
    </div>
  </a-space>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'
import store from '@/store'

const router = useRouter()

const formState = reactive({
  name: '',
  passwd: '',
})

const rules = {
  name: [
    {
      required: true,
      message: '用户名不能为空',
    },
    {
      validator: async (_rule, value) => {
        if (!value) {
          return Promise.resolve()
        }
        if (value.length < 3 || value.length > 30) {
          return Promise.reject('用户名长度至少为3位，至多为30位')
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
  passwd: [
    {
      required: true,
      message: '密码不能为空',
    },
    {
      validator: async (_rule, value) => {
        if (!value) {
          return Promise.resolve()
        }
        if (value.length < 3 || value.length > 30) {
          return Promise.reject('密码长度至少为3位，至多为30位')
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

const finishLogin = async (values) => {
  try {
    const tokenData = await api.auth.login(values)
    store.setToken(tokenData.token)
    const userData = await api.user.getUser()
    store.setUser(userData)
  } catch (error) {
    return
  }
  router.push('/home')
}

function clickRegister() {
  router.push('/register')
}
</script>

<style scoped>
.center-container {
  display: grid;
  place-items: center;
  margin-top: 100px;
}
</style>