<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <div class="center-container">
      <p :style="{ fontSize: '18px' }">注册</p>
      <a-form name="register" autocomplete="off" :model="formState" :rules="rules" :style="{ width: '350px' }"
        @finish="finishRegister">
        <a-form-item has-feedback label="用户名" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item has-feedback label="密码" name="passwd">
          <a-input-password v-model:value="formState.passwd" />
        </a-form-item>

        <a-form-item has-feedback label="确认密码" name="confirm_passwd">
          <a-input-password v-model:value="formState.confirm_passwd" type="password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :style="{ width: '100%' }">
            注册
          </a-button>
          已有账户？
          <a @click="clickLogin">登录</a>
        </a-form-item>
      </a-form>
    </div>
  </a-space>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'

const router = useRouter()

const formState = reactive({
  name: '',
  passwd: '',
  confirm_passwd: '',
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
  confirm_passwd: [
    {
      required: true,
      message: '确认密码不能为空',
    },
    {
      validator: async (_rule, value) => {
        if (value != formState.passwd) {
          return Promise.reject('两次输入的密码不同')
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

const finishRegister = async (values) => {
  try {
    await api.auth.register(values)
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