<template>
  <div class="center-container">
    <p :style="{ fontSize: '18px' }">忘记密码</p>

    <a-form name="resetPassword" autocomplete="off" :model="formState" :rules="rules" :style="{ width: '350px' }"
      @finish="finishResetPassword">
      <a-form-item has-feedback label="用户名" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item has-feedback label="新密码" name="password">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item has-feedback label="确认新密码" name="confirmPassword">
        <a-input-password v-model:value="formState.confirmPassword" type="password" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :style="{ width: '100%' }">
          提交
        </a-button>
        返回登录页面：
        <a @click="clickLogin">登录</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'

const router = useRouter()

const formState = reactive({
  name: '',
  password: '',
  confirmPassword: '',
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
  confirmPassword: [
    {
      required: true,
      message: '确认密码不能为空',
    },
    {
      validator: async (_rule, value) => {
        if (value != formState.password) {
          return Promise.reject('两次输入的密码不同')
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

const finishResetPassword = async (values) => {
  try {
    await api.user.resetPassword(values)
  } catch (error) {
    return
  }
  router.push('/login')
}

function clickLogin() {
  router.push('/login')
}
</script>

<style scoped>
.center-container {
  display: grid;
  place-items: center;
  margin-top: 100px;
}
</style>