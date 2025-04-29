<template>
  <a-spin :spinning="loading">
    <a-space direction="vertical" style="width: 100%">
      <a @click="gotoModel">返回模型列表</a>

      <a-descriptions title="金融模型信息">
        <a-descriptions-item label="ID">{{ modelInfo.id }}</a-descriptions-item>
        <a-descriptions-item label="模型名">{{ modelInfo.name }}</a-descriptions-item>
        <a-descriptions-item label="模型中文名">{{ modelInfo.nameCN }}</a-descriptions-item>
        <a-descriptions-item label="模型描述" :span="2">{{ modelInfo.desc }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ modelInfo.createTime }}</a-descriptions-item>
        <a-descriptions-item label="月份属性ID">{{ modelInfo.monthsAttrId }}</a-descriptions-item>
        <a-descriptions-item label="月份属性名">{{ modelInfo.monthAttrName }}</a-descriptions-item>
        <a-descriptions-item label="月份属性中文名">{{ modelInfo.monthAttrNameCN }}</a-descriptions-item>
        <a-descriptions-item label="月份属性默认值">{{ modelInfo.monthAttrDefault }}</a-descriptions-item>
      </a-descriptions>

      <a-table :columns="columns" :data-source="attrListPage" :pagination="pagination" bordered @change="changeTable">
        <template #title>
          <a-space align="center" size="large">
            <span style="font-size: 18px;">金融属性信息表</span>

            <!-- <a-input-search v-model:value="name" placeholder="搜索模型名" enter-button style="width: 300px"
              @search="searchName" /> -->

            <a-button type="primary">
              新增属性
            </a-button>
          </a-space>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a>查看详情</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-space>
  </a-spin>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import api from '@/api'
import enums from '@/utility/enums'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (!route.query.modelId) {
    message.error('缺少参数[模型ID]')
    return
  }
  modelId.value = route.query.modelId
  getModelDetail()
})

// 属性表格
const modelId = ref(0)
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
  },
  {
    title: '属性名',
    dataIndex: 'name',
    width: '15%',
  },
  {
    title: '属性中文名',
    dataIndex: 'nameCN',
    width: '15%',
  },
  {
    title: '属性类型',
    dataIndex: 'typeDesc',
    width: '15%',
  },
  {
    title: '属性数值类型',
    dataIndex: 'valueTypeDesc',
    width: '15%',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '15%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '15%',
  },
]
const loading = ref(false)
const modelInfo = ref({
  id: 0,
  name: '',
  nameCN: '',
  desc: '',
  monthsAttrId: 0,
  monthAttrName: '',
  monthAttrNameCN: '',
  monthAttrDefault: 0,
  createTime: '',
})
const attrIdToAttr = ref({})
const attrList = ref([])
const attrListPage = ref([])
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const changeTable = (pag, filters, sorter) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  attrListPage.value = attrList.slice(start, end)
}

const getModelDetail = async () => {
  loading.value = true
  const params = { id: modelId.value }
  try {
    const data = await api.model.getModelDetail(params)
    attrList.value = data.attrList.map(attr => ({
      ...attr,
      key: attr.id,
      typeDesc: enums.ATTR_TYPE_DESC[attr.type],
      valueTypeDesc: enums.VALUE_TYPE_DESC[attr.valueType]
    }))
    const start = (pagination.value.current - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    attrListPage.value = attrList.slice(start, end)
    pagination.value.total = attrList.length

    attrIdToAttr.value = Object.fromEntries(attrList.value.map(attr => [attr.id, attr]))
    const monthsAttr = attrIdToAttr[data.monthsAttrId] || {}
    modelInfo.value = {
      id: data.id,
      name: data.name,
      nameCN: data.nameCN,
      desc: data.desc,
      monthsAttrId: 0,
      monthAttrName: monthsAttr.name,
      monthAttrNameCN: monthsAttr.nameCN,
      monthAttrDefault: monthsAttr.default,
      createTime: monthsAttr.createTime,
    }
  } catch (error) {
    return
  } finally {
    loading.value = false
  }
}

const gotoModel = () => {
  router.push('/manage/model')
}
</script>