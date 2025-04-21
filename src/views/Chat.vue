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
      <a-input v-model:value="inputMessage" placeholder="输入您的问题..." @pressEnter="handleSend" :disabled="loading" />
      <a-button-group class="button-group">
        <a-button type="primary" @click="handleSend" :loading="loading" :disabled="!inputMessage.trim()">
          发送
        </a-button>
        <a-button danger @click="handleClear">清空</a-button>
        <a-button v-if="showDownload" type="dashed" @click="handleDownload" :loading="downloadLoading">
          下载文件
        </a-button>
      </a-button-group>
    </div>
  </a-space>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';

// 模拟对话数据
const messages = ref([{
  role: 'assistant',
  content: '您好，我是一个基于大语言模型的金融分析师，请输入一段房产相关的投资计划，我可以回答您的问题，并生成一张对应的财务报表。',
  time: getCurrentTime()
}]);
const inputMessage = ref('');
const loading = ref(false);
const downloadLoading = ref(false);
const showDownload = ref(false);

// 获取当前时间
const getCurrentTime = () => {
  return new Date().toLocaleTimeString();
};

// 发送消息
const handleSend = async () => {
  if (!inputMessage.value.trim()) return;

  try {
    loading.value = true;

    // 添加用户消息
    messages.value.push({
      role: 'user',
      content: inputMessage.value.trim(),
      time: getCurrentTime()
    });

    // 模拟 API 调用
    const response = await mockApiCall(inputMessage.value);

    // 添加 AI 回复
    messages.value.push({
      role: 'assistant',
      content: response.reply,
      time: getCurrentTime()
    });

    // 控制下载按钮显示
    showDownload.value = response.showDownloadButton;

    inputMessage.value = '';
  } catch (error) {
    message.error('发送失败: ' + error.message);
  } finally {
    loading.value = false;
  }
};

// 清空对话
const handleClear = () => {
  messages.value = [];
  showDownload.value = false;
  message.success('已清空对话');
};

// 下载文件
const handleDownload = async () => {
  try {
    downloadLoading.value = true;
    const response = await mockDownloadApi();

    // 创建隐藏的下载链接
    const link = document.createElement('a');
    link.href = response.fileUrl;
    link.download = '对话记录.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('开始下载文件');
  } catch (error) {
    message.error('下载失败: ' + error.message);
  } finally {
    downloadLoading.value = false;
  }
};

// 模拟 API 调用
const mockApiCall = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reply: `这是对【${query}】的模拟回复`,
        showDownloadButton: messages.value.length > 2
      });
    }, 800);
  });
};

// 模拟下载 API
const mockDownloadApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fileUrl: URL.createObjectURL(
          new Blob([messages.value.map(m => `${m.time} [${m.role}] ${m.content}`).join('\n')]),
          { type: 'text/plain' }
        )
      })
    }, 500);
  });
};
</script>

<style scoped>
.chat-container {
  max-width: 800px;
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