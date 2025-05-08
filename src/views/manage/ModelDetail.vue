<template>
  <a-spin :spinning="getModelDetailLoading">
    <a-space direction="vertical" style="width: 100%">
      <a-space align="center">
        <a-button type="link" @click="gotoModel">
          《 返回
        </a-button>

        <span style="font-size: 18px;">金融模型详情</span>
      </a-space>

      <a-descriptions bordered :column="4">
        <a-descriptions-item label="ID">{{ model.id }}</a-descriptions-item>
        <a-descriptions-item label="模型名">{{ model.name }}</a-descriptions-item>
        <a-descriptions-item label="模型中文名">{{ model.nameCN }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ model.createTime }}</a-descriptions-item>
        <a-descriptions-item label="月份属性ID">{{ monthsAttr.id }}</a-descriptions-item>
        <a-descriptions-item label="月份属性名">{{ monthsAttr.name }}</a-descriptions-item>
        <a-descriptions-item label="月份属性中文名">{{ monthsAttr.nameCN }}</a-descriptions-item>
        <a-descriptions-item label="月份属性默认值">{{ monthsAttr.default }}</a-descriptions-item>
        <a-descriptions-item label="模型描述" :span="4">{{ model.desc }}</a-descriptions-item>
      </a-descriptions>

      <a-table bordered :columns="attrListColumns" :data-source="attrListFilter">
        <template #title>
          <a-space align="center" size="large">
            <span style="font-size: 18px;">金融属性表</span>

            <a-input-search v-model:value="attrNameSearch" placeholder="搜索属性名" enter-button style="width: 300px"
              @search="searchAttrName" />

            <a-button type="primary" @click="openEditAttr()">
              新增属性
            </a-button>
          </a-space>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a @click="gotoAttrDetail(record)">查看详情</a>

              <a @click="openEditAttr(record)">编辑</a>

              <a-popconfirm title="确认要删除该属性吗？" ok-text="确认" cancel-text="取消"
                :okButtonProps="{ danger: true, loading: deleteAttrLoading }" @confirm="confirmDeleteAttr(record)">
                <a>删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-space>
  </a-spin>

  <a-modal v-model:open="editAttrOpen" title="编辑属性" ok-text="确认" cancel-text="取消"
    :okButtonProps="{ loading: editAttrLoading }" @ok="submitEditAttr">
    <a-form name="editAttr" ref="editAttrRef" :model="editAttrForm" :rules="editAttrRules">
      <a-form-item label="属性名" name="name">
        <a-input v-model:value="editAttrForm.name" style="width: 300px;" />
      </a-form-item>

      <a-form-item label="属性中文名" name="nameCN">
        <a-input v-model:value="editAttrForm.nameCN" style="width: 300px;" />
      </a-form-item>

      <a-form-item label="属性类型" name="type">
        <a-select v-model:value="editAttrForm.type" style="width: 150px;" :options="attrTypeOptions" />
      </a-form-item>

      <a-form-item label="属性数据类型" name="type">
        <a-select v-model:value="editAttrForm.valueType" style="width: 150px;" :options="valueTypeOptions" />
      </a-form-item>

      <a-form-item label="属性默认值" name="monthAttrDefault">
        <a-input v-model:value="editAttrForm.default" style="width: 300px;" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import api from '@/api'
import enums from '@/utility/enums'

const route = useRoute()
const router = useRouter()

// query参数
const modelId = ref(0)

onMounted(() => {
  if (!route.query.modelId) {
    message.error('缺少参数[模型ID]')
    return
  }
  modelId.value = route.query.modelId
  getModelDetail()
})

// 模型详情 & 属性表格
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

const getModelDetailLoading = ref(false)
const model = ref({
  id: 0,
  name: '',
  nameCN: '',
  desc: '',
  monthsAttrId: 0,
  createTime: '',
})
const monthsAttr = ref({
  id: 0,
  name: '',
  nameCN: '',
  type: 0,
  valueType: 0,
  default: '',
  modelId: 0,
  createTime: '',
})
const attrNameSearch = ref('')
const attrList = ref([])
const attrListFilter = ref([])

const getModelDetail = async () => {
  getModelDetailLoading.value = true
  const params = { id: modelId.value }
  try {
    const data = await api.model.getModelDetail(params)
    model.value = data.model
    const optionalMonthsAttr = data.attrList.find(attr => attr.id === data.monthsAttrId)
    if (optionalMonthsAttr !== undefined) {
      monthsAttr.value = optionalMonthsAttr
    }
    attrList.value = data.attrList.map(attr => ({
      ...attr,
      key: attr.id,
      typeDesc: enums.ATTR_TYPE_DESC[attr.type],
      valueTypeDesc: enums.VALUE_TYPE_DESC[attr.valueType],
    }))
  } catch (error) {
    return
  } finally {
    getModelDetailLoading.value = false
  }
  searchAttrName()
}
const searchAttrName = () => {
  attrListFilter.value = attrList.value.filter(attr => attr.name.includes(attrNameSearch.value))
}

// 编辑属性
const editAttrRules = {
  name: [
    {
      required: true,
      message: '属性名不能为空',
    },
    {
      max: 64,
      message: '属性名长度至多为64',
    },
  ],
  nameCN: [
    {
      required: true,
      message: '属性中文名不能为空',
    },
    {
      max: 64,
      message: '属性中文名长度至多为64',
    },
  ],
  type: [
    {
      required: true,
      message: '属性类型不能为空',
    },
  ],
  valueType: [
    {
      required: true,
      message: '属性数据类型不能为空',
    },
  ],
  default: [
    {
      max: 64,
      message: '属性默认值长度至多为64',
    },
  ],
}
const attrTypeOptions = [
  {
    value: enums.ATTR_TYPE.INPUT,
    label: enums.ATTR_TYPE_DESC[enums.ATTR_TYPE.INPUT],
  },
  {
    value: enums.ATTR_TYPE.MIDDLE,
    label: enums.ATTR_TYPE_DESC[enums.ATTR_TYPE.MIDDLE],
  },
  {
    value: enums.ATTR_TYPE.OUTPUT,
    label: enums.ATTR_TYPE_DESC[enums.ATTR_TYPE.OUTPUT],
  },
]
const valueTypeOptions = [
  {
    value: enums.VALUE_TYPE.DATE,
    label: enums.VALUE_TYPE_DESC[enums.VALUE_TYPE.DATE],
  },
  {
    value: enums.VALUE_TYPE.FLOAT,
    label: enums.VALUE_TYPE_DESC[enums.VALUE_TYPE.FLOAT],
  },
  {
    value: enums.VALUE_TYPE.INT,
    label: enums.VALUE_TYPE_DESC[enums.VALUE_TYPE.INT],
  },
  {
    value: enums.VALUE_TYPE.STRING,
    label: enums.VALUE_TYPE_DESC[enums.VALUE_TYPE.STRING],
  },
]

const editAttrRef = ref()
const editAttrOpen = ref(false)
const editAttr = ref(null)
const editAttrForm = reactive({
  name: '',
  nameCN: '',
  type: 0,
  valueType: 0,
  default: '',
})
const editAttrLoading = ref(false)

const openEditAttr = (record) => {
  editAttrOpen.value = true
  if (record === undefined) {
    editAttr.value = null
    editAttrForm.name = ''
    editAttrForm.nameCN = ''
    editAttrForm.type = 0
    editAttrForm.valueType = 0
    editAttrForm.default = ''
  } else {
    editAttr.value = record
    editAttrForm.name = record.name
    editAttrForm.nameCN = record.nameCN
    editAttrForm.type = record.type
    editAttrForm.valueType = record.valueType
    editAttrForm.default = record.default
  }
}
const submitEditAttr = () => {
  editAttrRef.value.validateFields().then(() => {
    if (editAttr.value !== null &&
      editAttrForm.name === editAttr.value.name &&
      editAttrForm.nameCN === editAttr.value.nameCN &&
      editAttrForm.type === editAttr.value.type &&
      editAttrForm.valueType === editAttr.value.valueType &&
      editAttrForm.default === editAttr.value.default) {
      message.info('未作任何修改')
      return
    }
    createOrUpdateAttr(editAttrForm)
  }).catch(() => { })
}
const createOrUpdateAttr = async (values) => {
  editAttrLoading.value = true
  try {
    if (editAttr.value === null) {
      await api.model.createAttr({ ...values, modelId: modelId.value })
    } else {
      await api.model.updateAttr({ ...values, id: editAttr.value.id })
    }
  } catch (error) {
    return
  } finally {
    editAttrLoading.value = false
  }
  editAttrOpen.value = false
  getModelDetail()
}

// 删除属性
const deleteAttrLoading = ref(false)

const confirmDeleteAttr = async (record) => {
  deleteAttrLoading.value = true
  try {
    await api.model.deleteAttr({ id: record.id })
  } catch (error) {
    return
  } finally {
    deleteAttrLoading.value = false
  }
  getModelDetail()
}

// 页面跳转
const gotoModel = () => {
  router.push('/manage/model')
}
const gotoAttrDetail = (record) => {
  router.push({ path: '/manage/model/detail/attr', query: { attrId: record.id } })
}
</script>