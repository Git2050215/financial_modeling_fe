<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-image width="100%" :src="homeBackground" :preview="false" />
  </a-space>
</template>

<script setup>
import homeBackground from '@/assets/image/home_background.png'
</script>