<template>
  <div class="center-container">
    <p :style="{ fontSize: '18px' }">登录</p>

    <a-form name="login" autocomplete="off" :model="formState" :rules="rules" :style="{ width: '350px' }"
      @finish="finishLogin">
      <a-form-item has-feedback label="用户名" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item has-feedback label="密码" name="password">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :style="{ width: '100%' }">
          登录
        </a-button>
        <span>
          新用户？
          <a @click="clickRegister">注册</a>
        </span>
        <a :style="{ float: 'right' }" @click="clickForgetPassword">忘记密码</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'
import store from '@/store'

const router = useRouter()

const formState = reactive({
  name: '',
  password: '',
})

const rules = {
  name: [
    {
      required: true,
      message: '用户名不能为空',
    },
    {
      min: 3,
      max: 30,
      message: '用户名长度至少为3，至多为30',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
    },
    {
      min: 3,
      max: 30,
      message: '密码长度至少为3，至多为30',
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

function clickForgetPassword() {
  router.push('/forgetPassword')
}
</script>

<style scoped>
.center-container {
  display: grid;
  place-items: center;
  margin-top: 100px;
}
</style>