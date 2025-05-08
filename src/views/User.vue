<template>
  <a-descriptions bordered title="用户信息">
    <a-descriptions-item label="UID">{{ store.user.id }}</a-descriptions-item>
    <a-descriptions-item label="用户名" :span="2">
      <a-space size="large">
        {{ store.user.name }}

        <a @click="openResetName">更改用户名</a>
      </a-space>
    </a-descriptions-item>
    <a-descriptions-item label="用户类型">{{ userTypeDesc }}</a-descriptions-item>
    <a-descriptions-item label="注册时间">{{ store.user.registerTime }}</a-descriptions-item>
    <a-descriptions-item label="最后登录时间">{{ store.user.lastLoginTime }}</a-descriptions-item>
  </a-descriptions>

  <a-modal v-model:open="resetNameOpen" title="更改用户名" :footer="null">
    <a-form name="resetType" style="margin-top: 20px;" :model="resetNameForm" :rules="resetNameRules"
      @finish="finishResetName">
      <a-form-item label="用户名" name="name">
        <a-input v-model:value="resetNameForm.name" />
      </a-form-item>

      <a-form-item>
        <a-space style="float: right;">
          <a-button @click="closeResetName">
            取消
          </a-button>

          <a-button type="primary" html-type="submit" :disabled="resetNameDisabled" :loading="resetNameLoading">
            确认
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import api from '@/api'
import store from '@/store'
import enums from '@/utility/enums'

const userTypeDesc = computed(() => {
  return enums.USER_TYPE_DESC[store.user.type] || '未知用户类型'
})

const resetNameOpen = ref(false)
const resetNameForm = reactive({
  name: ''
})
const resetNameRules = {
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
}
const resetNameDisabled = computed(() => {
  resetNameForm.name === store.user.name
})
const resetNameLoading = ref(false)

const openResetName = () => resetNameOpen.value = true
const closeResetName = () => resetNameOpen.value = false
const finishResetName = async (values) => {
  resetNameLoading.value = true
  try {
    await api.user.resetName(values)
  } catch (error) {
    return
  } finally {
    resetNameLoading.value = false
  }
  getUser()
}
const getUser = async () => {
  try {
    const data = await api.user.getUser()
    store.setUser(data)
  } catch (error) {
    return
  }
}
</script>