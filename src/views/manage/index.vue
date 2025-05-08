<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" :items="items" @click="clickMenu" />

    <RouterView />
  </a-space>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const selectedKeys = ref([])
const items = ref([
  {
    key: '/user',
    label: '用户管理',
  },
  {
    key: '/model',
    label: '模型管理',
  },
])

onMounted(() => {
  selectedKeys.value.push(`/${route.path.split('/')[2]}`)
})

watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [`/${newPath.split('/')[2]}`]
  }
)

function clickMenu({ item, key, keyPath }) {
  router.push(`/manage${key}`)
}
</script>