<template>
  <a-spin :spinning="getAttrDetailLoading">
    <a-space direction="vertical" style="width: 100%">
      <a-space align="center">
        <a-button type="link" @click="gotoModelDetail">
          《 返回
        </a-button>

        <span style="font-size: 18px;">金融属性详情</span>
      </a-space>

      <a-descriptions bordered :column="4">
        <a-descriptions-item label="ID">{{ attr.id }}</a-descriptions-item>
        <a-descriptions-item label="属性名">{{ attr.name }}</a-descriptions-item>
        <a-descriptions-item label="属性中文名">{{ attr.nameCN }}</a-descriptions-item>
        <a-descriptions-item label="属性类型">{{ attrTypeDesc }}</a-descriptions-item>
        <a-descriptions-item label="数据类型">{{ attrValueTypeDesc }}</a-descriptions-item>
        <a-descriptions-item label="默认值">{{ attr.default }}</a-descriptions-item>
        <a-descriptions-item label="模型ID">{{ attr.modelId }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ attr.createTime }}</a-descriptions-item>
      </a-descriptions>

      <a-table bordered :columns="formulaListColumns" :data-source="formulaList">
        <template #title>
          <a-space align="center" size="large">
            <span style="font-size: 18px;">计算公式表</span>

            <a-button type="primary" @click="openEditFormula()">
              新增公式
            </a-button>
          </a-space>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a @click="openEditFormula(record)">编辑</a>

              <a-popconfirm title="确认要删除该公式吗？" ok-text="确认" cancel-text="取消"
                :okButtonProps="{ danger: true, loading: deleteFormulaLoading }"
                @confirm="confirmDeleteFormula(record)">
                <a>删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>

        <template #expandedRowRender="{ record }">
          <a-table :columns="paraListColumns" :data-source="record.paraList" :pagination="false" />
        </template>
      </a-table>
    </a-space>
  </a-spin>

  <a-modal width="80%" v-model:open="editFormulaOpen" title="编辑公式" ok-text="确认" cancel-text="取消"
    :okButtonProps="{ loading: editFormulaLoading }" @ok="submitEditFormula">
    <a-spin :spinning="getAttrOptionsLoading">
      <a-form name="editFormula" ref="editFormulaRef" :model="editFormulaForm" :rules="editFormulaRules">
        <a-space v-for="(para, index) in editFormulaForm.paraList" :key="para.key" align="baseline"
          style="margin-bottom: 5px;" wrap>
          <a-form-item label="参数名" :name="['paraList', index, 'name']" :rules="{ required: true, message: '参数名不能为空' }">
            <a-input v-model:value="para.name" style="width: 300px;" />
          </a-form-item>

          <a-form-item label="参数类型" :name="['paraList', index, 'type']"
            :rules="{ required: true, message: '参数类型不能为空' }">
            <a-select v-model:value="para.type" style="width: 150px;" :options="paraTypeOptions" />
          </a-form-item>

          <a-form-item label="关联属性" :name="['paraList', index, 'attrId']"
            :rules="{ required: true, message: '关联属性不能为空' }">
            <a-select v-model:value="para.attrId" style="width: 450px;" :options="attrOptions" />
          </a-form-item>

          <a @click="removePara(para)">删除</a>
        </a-space>

        <a-form-item>
          <a-button type="dashed" block @click="addPara">
            添加参数
          </a-button>
        </a-form-item>

        <a-form-item label="公式内容" name="content">
          <a-textarea v-model:value="editFormulaForm.content" style="width: 900px;" :rows="4" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import api from '@/api'
import enums from '@/utility/enums'

const route = useRoute()
const router = useRouter()

// query参数
const attrId = ref(0)

onMounted(() => {
  if (!route.query.attrId) {
    message.error('缺少参数[属性ID]')
    return
  }
  attrId.value = route.query.attrId
  getAttrDetail()
})

// 属性详情 & 公式表格 & 参数子表格
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
    width: '20%',
  },
  {
    title: '参数名',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: '参数类型',
    dataIndex: 'typeDesc',
    width: '20%',
  },
  {
    title: '属性ID',
    dataIndex: 'attrId',
    width: '20%',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '20%',
  },
]

const getAttrDetailLoading = ref(false)
const attr = ref({
  id: 0,
  name: '',
  nameCN: '',
  type: 0,
  valueType: 0,
  default: '',
  modelId: 0,
  createTime: '',
})
const formulaList = ref([])

const attrTypeDesc = computed(() => {
  return enums.ATTR_TYPE_DESC[attr.value.type]
})
const attrValueTypeDesc = computed(() => {
  return enums.VALUE_TYPE_DESC[attr.value.valueType]
})

const getAttrDetail = async () => {
  getAttrDetailLoading.value = true
  try {
    const data = await api.model.getAttrDetail({ id: attrId.value })
    attr.value = data.attr
    formulaList.value = data.formulaList.map(formulaDetail => ({
      ...formulaDetail.formula,
      key: formulaDetail.formula.id,
      paraList: formulaDetail.paraList.map(para => ({
        ...para,
        key: para.id,
        typeDesc: enums.PARA_TYPE_DESC[para.type]
      })),
    }))
  } catch (error) {
    return
  } finally {
    getAttrDetailLoading.value = false
  }
}

// 编辑公式
const editFormulaRules = {
  content: [
    {
      required: true,
      message: '公式内容不能为空',
    },
    {
      max: 1024,
      message: '公式内容长度至多为1024',
    },
  ],
}
const paraTypeOptions = [
  {
    value: enums.PARA_TYPE.MONTH,
    label: enums.PARA_TYPE_DESC[enums.PARA_TYPE.MONTH],
  },
  {
    value: enums.PARA_TYPE.INPUT,
    label: enums.PARA_TYPE_DESC[enums.PARA_TYPE.INPUT],
  },
  {
    value: enums.PARA_TYPE.MIDDLE,
    label: enums.PARA_TYPE_DESC[enums.PARA_TYPE.MIDDLE],
  },
  {
    value: enums.PARA_TYPE.LAST_MIDDLE,
    label: enums.PARA_TYPE_DESC[enums.PARA_TYPE.LAST_MIDDLE],
  },
  {
    value: enums.PARA_TYPE.ALL_MIDDLE,
    label: enums.PARA_TYPE_DESC[enums.PARA_TYPE.ALL_MIDDLE],
  },
  {
    value: enums.PARA_TYPE.OUTPUT,
    label: enums.PARA_TYPE_DESC[enums.PARA_TYPE.OUTPUT],
  },
]

const editFormulaRef = ref()
const editFormulaOpen = ref(false)
const getAttrOptionsLoading = ref(false)
const attrOptions = ref([])
const editFormula = ref(null)
const editFormulaForm = reactive({
  content: '',
  paraList: [],
})
const editFormulaLoading = ref(false)

const openEditFormula = (record) => {
  editFormulaOpen.value = true
  if (record === undefined) {
    editFormula.value = null
    editFormulaForm.content = ''
    editFormulaForm.paraList = [{
      key: Date.now(),
      name: '',
      type: null,
      attrId: null,
    }]
  } else {
    editFormula.value = record
    editFormulaForm.content = record.content
    editFormulaForm.paraList = record.paraList
  }
  getAttrOptions()
}
const getAttrOptions = async () => {
  if (!attr.value.modelId) {
    message.error('缺少参数[模型ID]')
    return
  }
  getAttrOptionsLoading.value = true
  try {
    const data = await api.model.getAttrOptions({ modelId: attr.value.modelId })
    attrOptions.value = data
  } catch (error) {
    return
  } finally {
    getAttrOptionsLoading.value = false
  }
}
const removePara = (para) => {
  const i = editFormulaForm.paraList.indexOf(para)
  if (i !== -1) {
    editFormulaForm.paraList.splice(i, 1)
  }
}
const addPara = () => {
  editFormulaForm.paraList.push({
    key: Date.now(),
    name: '',
    type: null,
    attrId: null,
  })
}
const submitEditFormula = () => {
  editFormulaRef.value.validateFields().then(() => {
    if (editFormula.value !== null &&
      editFormulaForm.content === editFormula.value.content &&
      editFormulaForm.paraList.length === editFormula.value.paraList.length) {
      let isSame = true
      for (let i = 0; i < editFormulaForm.paraList.length; i++) {
        const newPara = editFormulaForm.paraList[i]
        const oldPara = editFormula.value.paraList[i]
        if (newPara.name !== oldPara.name ||
          newPara.type !== oldPara.type ||
          newPara.attrId !== oldPara.attrId) {
          isSame = false
          break
        }
      }
      if (isSame) {
        message.info('未作任何修改')
        return
      }
    }
    createOrUpdateFormula(editFormulaForm)
  }).catch(() => { })
}
const createOrUpdateFormula = async (values) => {
  editFormulaLoading.value = true
  try {
    if (editFormula.value === null) {
      await api.model.createFormula({ ...values, attrId: attrId.value })
    } else {
      await api.model.updateFormula({ ...values, id: editFormula.value.id })
    }
  } catch (error) {
    return
  } finally {
    editFormulaLoading.value = false
  }
  editFormulaOpen.value = false
  getAttrDetail()
}

// 删除公式
const deleteFormulaLoading = ref(false)

const confirmDeleteFormula = async (record) => {
  deleteFormulaLoading.value = true
  try {
    await api.model.deleteFormula({ id: record.id })
  } catch (error) {
    return
  } finally {
    deleteFormulaLoading.value = false
  }
  getAttrDetail()
}

// 页面跳转
const gotoModelDetail = () => {
  if (!attr.value.modelId) {
    message.error('缺少参数[模型ID]')
    return
  }
  router.push({ path: '/manage/model/detail', query: { modelId: attr.value.modelId } })
}
</script>