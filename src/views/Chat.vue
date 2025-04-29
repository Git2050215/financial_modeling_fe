<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-list class="message-list" :data-source="messages" bordered>
      <template #renderItem="{ item }">
        <a-list-item>
          <div :class="['message-bubble', item.role]">
            <div class="message-content">{{ item.content }}</div>
            <div class="message-time">{{ item.time }}</div>
          </div>
        </a-list-item>
      </template>
    </a-list>

    <div class="action-area">
      <a-textarea v-model:value="inputMessage" placeholder="输入您的问题..." :rows="4" :maxlength="1000"
        :disabled="loading" />
      <a-button-group class="button-group">
        <a-button type="primary" @click="handleSend" :loading="loading" :disabled="!inputMessage.trim()">
          发送
        </a-button>
        <a-button danger @click="handleClear">清空</a-button>
        <a-button type="dashed" :disabled="!showDownload" :loading="downloadLoading" @click="handleDownload">
          下载文件
        </a-button>
      </a-button-group>
    </div>
  </a-space>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import api from '@/api'

const messages = ref([])
const inputMessage = ref('')
const loading = ref(false)
const downloadLoading = ref(false)
const showDownload = ref(false)

onMounted(() => {
  messages.value.push({
    role: 'assistant',
    content: '您好，我是一个基于大语言模型的金融分析师，请输入一段房产相关的投资计划，我可以回答您的问题，并生成一张对应的财务报表。',
    time: new Date().toLocaleTimeString()
  })
})

const handleSend = async () => {
  loading.value = true

  const userMessage = inputMessage.value.trim()
  messages.value.push({
    role: 'user',
    content: userMessage,
    time: new Date().toLocaleTimeString()
  })

  try {
    const data = await api.chat.sendMessage({ userMessage })
    const timeStr = new Date().toLocaleTimeString()
    data.assistantMessage.forEach(message => {
      messages.value.push({
        role: 'assistant',
        content: message,
        time: timeStr
      })
    })
    showDownload.value = data.showDownloadButton
    inputMessage.value = ''
  } catch (error) {
    return
  } finally {
    loading.value = false
  }
}

const handleClear = async () => {
  try {
    await api.chat.newChat()
  } catch (error) {
    return
  }
  messages.value = []
  showDownload.value = false
}

const handleDownload = async () => {
  try {
    downloadLoading.value = true
    try {
      const data = await api.chat.downloadExcel()

      const link = document.createElement('a')
      link.href = data.fileUrl
      link.download = '对话记录.txt'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      return
    }
  } finally {
    downloadLoading.value = false;
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.message-list {
  height: 60vh;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 8px 0;
}

.message-bubble.user {
  background: #e6f7ff;
  margin-left: auto;
}

.message-bubble.assistant {
  background: #f6ffed;
  margin-right: auto;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
}

.message-time {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  text-align: right;
}

.action-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button-group {
  display: flex;
  gap: 8px;
}
</style>