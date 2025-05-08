<template>
  <a-spin :spinning="getModelListLoading">
    <a-space direction="vertical" style="width: 100%;">
      <a-space align="center" size="large">
        <span style="font-size: 18px;">对话金融模型</span>

        <a-input-search v-model:value="modelNameSearch" placeholder="搜索模型名" enter-button style="width: 300px"
          @search="searchModelName" />
      </a-space>

      <a-row :gutter="16">
        <a-col v-for="model in modelDataSource" :span="8">
          <a-card :title="model.name">
            <template #extra>
              <a-button type="link" :loading="newChatLoading && model.id === chatModel.id" @click="clickChat(model)">
                对话
              </a-button>
            </template>

            <p>{{ model.nameCN }}</p>

            <p>{{ model.desc }}</p>
          </a-card>
        </a-col>
      </a-row>

      <a-pagination v-model:current="modelPagination.current" v-model:page-size="modelPagination.pageSize"
        style="float: right;" :total="modelPagination.total" :pageSizeOptions="modelPageSizeOptions"
        :show-total="showModelPagination" @change="changeModelPagination" />
    </a-space>
  </a-spin>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'

const router = useRouter()

onMounted(() => {
  getModelList()
})

// 模型列表
const modelPageSizeOptions = [9, 18, 27, 36]

const getModelListLoading = ref(false)
const modelNameSearch = ref('')
const modelDataSource = ref([])
const modelPagination = ref({
  current: 1,
  pageSize: 9,
  total: 0,
})

const searchModelName = (searchValue) => {
  getModelList()
}
const showModelPagination = (total, range) => `第${range[0]}-${range[1]}项 共${total}项`
const changeModelPagination = (page, pageSize) => {
  getModelList()
}
const getModelList = async () => {
  getModelListLoading.value = true
  const params = {
    current: modelPagination.value.current,
    pageSize: modelPagination.value.pageSize,
    name: modelNameSearch.value,
  }
  try {
    const data = await api.model.getModelList(params)
    modelDataSource.value = data.dataSource.map(model => ({
      ...model,
      key: model.id,
    }))
    modelPagination.value = data.pagination
  } catch (error) {
    return
  } finally {
    getModelListLoading.value = false
  }
}

// 前往对话界面
const chatModel = ref(null)
const newChatLoading = ref(false)
const newChatId = ref(0)

const clickChat = (model) => {
  chatModel.value = model
  newChat()
}
const newChat = async () => {
  newChatLoading.value = true
  try {
    const data = await api.chat.newChat({ modelId: chatModel.value.id })
    newChatId.value = data.chatId
  } catch (error) {
    return
  } finally {
    newChatLoading.value = false
  }
  gotoChatContent()
}
const gotoChatContent = () => {
  router.push({ path: '/chat/content/detail', query: { chatId: newChatId.value } })
}
</script>