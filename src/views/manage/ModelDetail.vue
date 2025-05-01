<template>
  <a-spin :spinning="loading">
    <a-space direction="vertical" style="width: 100%">
      <a-space align="center">
        <a-button type="link" @click="gotoModel">
          《 返回
        </a-button>

        <span style="font-size: 18px;">金融模型详情</span>
      </a-space>

      <a-descriptions bordered :column="4">
        <a-descriptions-item label="ID">{{ modelInfo.id }}</a-descriptions-item>
        <a-descriptions-item label="模型名">{{ modelInfo.name }}</a-descriptions-item>
        <a-descriptions-item label="模型中文名">{{ modelInfo.nameCN }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ modelInfo.createTime }}</a-descriptions-item>
        <a-descriptions-item label="月份属性ID">{{ modelInfo.monthsAttrId }}</a-descriptions-item>
        <a-descriptions-item label="月份属性名">{{ modelInfo.monthAttrName }}</a-descriptions-item>
        <a-descriptions-item label="月份属性中文名">{{ modelInfo.monthAttrNameCN }}</a-descriptions-item>
        <a-descriptions-item label="月份属性默认值">{{ modelInfo.monthAttrDefault }}</a-descriptions-item>
        <a-descriptions-item label="模型描述" :span="4">{{ modelInfo.desc }}</a-descriptions-item>
      </a-descriptions>

      <a-table :columns="attrListColumns" :data-source="attrListFilter" bordered>
        <template #title>
          <a-space align="center" size="large">
            <span style="font-size: 18px;">金融属性表</span>

            <a-input-search v-model:value="name" placeholder="搜索属性名" enter-button style="width: 300px"
              @search="searchName" />

            <a-button type="primary">
              新增属性
            </a-button>
          </a-space>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a @click="openFormulaList(record)">查看详情</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-space>
  </a-spin>

  <a-drawer width="80%" :open="formulaListOpen" @close="closeFormulaList">
    <a-table bordered :columns="formulaListColumns" :data-source="formulaList" :pagination="false">
      <template #title>
        <a-space align="center" size="large">
          <span style="font-size: 18px;">计算公式表</span>

          <a-button type="primary">
            新增公式
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

      <template #expandedRowRender="{ record }">
        <a-table :columns="paraListColumns" :data-source="record.paraList" :pagination="false">
        </a-table>
      </template>
    </a-table>
  </a-drawer>
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

// 模型详情 & 属性表格
const modelId = ref(0)
const attrListColumns = [
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
    width: '10%',
  },
  {
    title: '属性数值类型',
    dataIndex: 'valueTypeDesc',
    width: '10%',
  },
  {
    title: '默认值',
    dataIndex: 'default',
    width: '10%',
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
const attrList = ref([])
const attrIdToAttr = ref({})
const name = ref('')
const attrListFilter = ref([])

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
    searchName()
    attrIdToAttr.value = Object.fromEntries(attrList.value.map(attr => [attr.id, attr]))

    const monthsAttr = attrIdToAttr.value[data.monthsAttrId] || {}
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
    console.error(error)
    return
  } finally {
    loading.value = false
  }
}

const searchName = () => {
  attrListFilter.value = attrList.value.filter(attr => attr.name.includes(name.value))
}

// 属性详情抽屉
const formulaListColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
  },
  {
    title: '公式内容',
    dataIndex: 'content',
    width: '60%',
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
const paraListColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
  },
  {
    title: '参数名',
    dataIndex: 'name',
    width: '15%',
  },
  {
    title: '参数类型',
    dataIndex: 'typeDesc',
    width: '15%',
  },
  {
    title: '属性名',
    dataIndex: 'attrName',
    width: '15%',
  },
  {
    title: '属性类型',
    dataIndex: 'attrTypeDesc',
    width: '15%',
  },
  {
    title: '属性数值类型',
    dataIndex: 'attrValueTypeDesc',
    width: '15%',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '15%',
  },
]
const formulaListOpen = ref(false)
const formulaList = ref([])

const openFormulaList = (record) => {
  formulaListOpen.value = true
  formulaList.value = record.formulaList.map(formula => {
    formula.paraList.forEach(para => {
      para.typeDesc = enums.PARA_TYPE_DESC[para.type]
      const attr = attrIdToAttr.value[para.attrId]
      if (!attr) {
        return
      }
      para.attrName = attr.name
      para.attrTypeDesc = attr.typeDesc
      para.attrValueTypeDesc = attr.valueTypeDesc
    })
    return formula
  })
}

const closeFormulaList = () => {
  formulaListOpen.value = false
}

const gotoModel = () => {
  router.push('/manage/model')
}
</script>