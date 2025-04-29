<template>
  <a-descriptions title="用户信息">
    <a-descriptions-item label="UID">{{ store.user.id }}</a-descriptions-item>
    <a-descriptions-item label="用户名" :span="2">{{ store.user.name }}</a-descriptions-item>
    <a-descriptions-item label="用户类型">{{ userTypeDesc }}</a-descriptions-item>
    <a-descriptions-item label="注册时间">{{ store.user.registerTime }}</a-descriptions-item>
    <a-descriptions-item label="最后登录时间">{{ store.user.lastLoginTime }}</a-descriptions-item>
  </a-descriptions>
</template>

<script setup>
import { computed } from 'vue'

import store from '@/store'
import enums from '@/utility/enums'

const userTypeDesc = computed(() => {
  return enums.USER_TYPE_DESC[store.user.type] || '未知用户类型'
})
</script>