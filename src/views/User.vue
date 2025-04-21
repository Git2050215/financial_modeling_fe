<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-descriptions title="用户信息">
      <a-descriptions-item label="UID">{{ store.user.id }}</a-descriptions-item>
      <a-descriptions-item label="用户名" :span="2">{{ store.user.name }}</a-descriptions-item>
      <a-descriptions-item label="用户类型">{{ userTypeDesc }}</a-descriptions-item>
      <a-descriptions-item label="注册时间">{{ registerTime }}</a-descriptions-item>
      <a-descriptions-item label="最后登录时间">{{ lastLoginTime }}</a-descriptions-item>
    </a-descriptions>
  </a-space>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

import store from '@/store'
import enums from '@/utility/enums'

const userTypeDesc = computed(() => {
  return enums.USER_TYPE_DESC[store.user.type] || '未知类型'
})

const registerTime = computed(() => {
  return store.user.register_time ? dayjs(store.user.register_time).format('YYYY-MM-DD HH:mm:ss') : '-'
})

const lastLoginTime = computed(() => {
  return store.user.last_login_time ? dayjs(store.user.last_login_time).format('YYYY-MM-DD HH:mm:ss') : '-'
})

</script>