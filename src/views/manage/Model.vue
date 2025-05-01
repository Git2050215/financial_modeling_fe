<template>
  <a-space direction="vertical" style="width: 100%">
    <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading" bordered
      @change="changeTable">
      <template #title>
        <a-space align="center" size="large">
          <span style="font-size: 18px;">金融模型表</span>

          <a-input-search v-model:value="name" placeholder="搜索模型名" enter-button style="width: 300px"
            @search="searchName" />

          <a-button type="primary" @click="openCreateModel">
            新增模型
          </a-button>
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <a @click="gotoModelDetail(record)">查看详情</a>

            <a @click="openUpdateModel(record)">编辑</a>

            <a-popconfirm title="确认要删除该模型吗？" ok-text="确认" cancel-text="取消"
              :okButtonProps="{ danger: true, loading: deleteModelLoading }" @confirm="confirmDeleteModel(record)">
              <a>删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="createModelOpen" title="新增模型" :footer="null">
      <a-form name="createModel" style="margin-top: 20px;" :model="createModelform" :rules="createModelRules"
        @finish="finishCreateModel">
        <a-form-item label="模型名" name="name">
          <a-input v-model:value="createModelform.name" style="width: 300px;" />
        </a-form-item>

        <a-form-item label="模型中文名" name="nameCN">
          <a-input v-model:value="createModelform.nameCN" style="width: 300px;" />
        </a-form-item>

        <a-form-item label="模型描述" name="desc">
          <a-textarea v-model:value="createModelform.desc" style="width: 300px;" :rows="3" />
        </a-form-item>

        <a-form-item label="月份属性名" name="monthAttrName">
          <a-input v-model:value="createModelform.monthAttrName" style="width: 300px;" />
        </a-form-item>

        <a-form-item label="月份属性中文名" name="monthAttrNameCN">
          <a-input v-model:value="createModelform.monthAttrNameCN" style="width: 300px;" />
        </a-form-item>

        <a-form-item label="月份属性默认值" name="monthAttrDefault">
          <a-input-number v-model:value="createModelform.monthAttrDefault" :min="0" :max="120" />
        </a-form-item>

        <a-form-item>
          <a-space style="float: right;">
            <a-button @click="closeCreateModel">
              取消
            </a-button>

            <a-button type="primary" html-type="submit" :loading="createModelLoading">
              新增
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:open="updateModelOpen" title="更改模型" :footer="null">
      <a-form name="updateModel" style="margin-top: 20px;" :model="updateModelForm" :rules="rules"
        @finish="finishUpdateModel">
        <a-form-item label="模型名" name="name">
          <a-input v-model:value="updateModelForm.name" style="width: 300px;" />
        </a-form-item>

        <a-form-item label="模型中文名" name="nameCN">
          <a-input v-model:value="updateModelForm.nameCN" style="width: 300px;" />
        </a-form-item>

        <a-form-item label="模型描述" name="desc">
          <a-textarea v-model:value="updateModelForm.desc" style="width: 300px;" :rows="3" />
        </a-form-item>

        <a-form-item>
          <a-space style="float: right;">
            <a-button @click="closeUpdateModel">
              取消
            </a-button>

            <a-button type="primary" html-type="submit" :disabled="updateModelModify" :loading="updateModelLoading">
              更改
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-space>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'

const router = useRouter()

onMounted(() => {
  getModelList()
})

// 模型表格
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
  },
  {
    title: '模型名',
    dataIndex: 'name',
    width: '15%',
  },
  {
    title: '模型中文名',
    dataIndex: 'nameCN',
    width: '15%',
  },
  {
    title: '模型描述',
    dataIndex: 'desc',
    width: '30%',
    ellipsis: true,
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
const name = ref('')
const dataSource = ref([])
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const searchName = (searchValue) => {
  name.value = searchValue
  getModelList()
}

const changeTable = (pag, filters, sorter) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  getModelList()
}

const getModelList = async (reset) => {
  loading.value = true
  const params = {
    current: reset ? 1 : pagination.value.current,
    pageSize: pagination.value.pageSize,
    name: name.value,
  }
  try {
    const data = await api.model.getModelList(params)
    dataSource.value = data.dataSource.map(model => ({
      ...model,
      key: model.id,
    }))
    pagination.value = data.pagination
  } catch (error) {
    return
  } finally {
    loading.value = false
  }
}

// 创建模型
const createModelRules = {
  name: [
    {
      required: true,
      message: '模型名不能为空',
    },
    {
      min: 3,
      max: 64,
      message: '模型名长度至少为3，至多为64',
    },
  ],
  nameCN: [
    {
      required: true,
      message: '模型中文名不能为空',
    },
    {
      min: 3,
      max: 64,
      message: '模型中文名长度至少为3，至多为64',
    },
  ],
  desc: [
    {
      required: true,
      message: '模型描述不能为空',
    },
    {
      min: 3,
      max: 256,
      message: '模型描述长度至少为3，至多为256',
    },
  ],
  monthAttrName: [
    {
      required: true,
      message: '月份属性名不能为空',
    },
    {
      min: 3,
      max: 64,
      message: '月份属性名长度至少为3，至多为64',
    },
  ],
  monthAttrNameCN: [
    {
      required: true,
      message: '月份属性中文名不能为空',
    },
    {
      min: 3,
      max: 64,
      message: '月份属性中文名长度至少为3，至多为64',
    },
  ],
  monthAttrDefault: [
    {
      required: true,
      message: '月份属性默认值不能为空',
    },
  ],
}
const createModelOpen = ref(false)
const createModelLoading = ref(false)
const createModelform = reactive({
  name: '',
  nameCN: '',
  desc: '',
  monthAttrName: '',
  monthAttrNameCN: '',
  monthAttrDefault: 0,
})

const openCreateModel = () => {
  createModelOpen.value = true
  createModelform.name = ''
  createModelform.nameCN = ''
  createModelform.desc = ''
  createModelform.monthAttrName = ''
  createModelform.monthAttrNameCN = ''
  createModelform.monthAttrDefault = 0
}

const closeCreateModel = () => createModelOpen.value = false

const finishCreateModel = async (values) => {
  createModelLoading.value = true
  try {
    await api.model.createModel(values)
  } catch (error) {
    return
  } finally {
    createModelLoading.value = false
  }
  closeCreateModel()
  getModelList(true)
}

// 更改模型
const rules = {
  name: [
    {
      required: true,
      message: '模型名不能为空',
    },
    {
      min: 3,
      max: 64,
      message: '模型名长度至少为3，至多为64',
    },
  ],
  nameCN: [
    {
      required: true,
      message: '模型中文名不能为空',
    },
    {
      min: 3,
      max: 64,
      message: '模型中文名长度至少为3，至多为64',
    },
  ],
  desc: [
    {
      required: true,
      message: '模型描述不能为空',
    },
    {
      min: 3,
      max: 256,
      message: '模型描述长度至少为3，至多为256',
    },
  ],
}

const updateModelOpen = ref(false)
const updateModelLoading = ref(false)
const editModel = ref(null)
const updateModelForm = reactive({
  name: '',
  nameCN: '',
  desc: ''
})

const updateModelModify = computed(() => {
  return updateModelForm.name === editModel.value.name &&
    updateModelForm.nameCN === editModel.value.nameCN &&
    updateModelForm.desc === editModel.value.desc
})

const openUpdateModel = (record) => {
  updateModelOpen.value = true
  editModel.value = record
  updateModelForm.name = record.name
  updateModelForm.nameCN = record.nameCN
  updateModelForm.desc = record.desc
}

const closeUpdateModel = () => updateModelOpen.value = false

const finishUpdateModel = async (values) => {
  updateModelLoading.value = true
  try {
    const params = { ...values, id: editModel.value.id }
    await api.model.updateModel(params)
  } catch (error) {
    return
  } finally {
    updateModelLoading.value = false
  }
  closeUpdateModel()
  getModelList()
}

// 其他
const gotoModelDetail = (record) => {
  router.push({ path: '/manage/model/detail', query: { modelId: record.id } })
}

const deleteModelLoading = ref(false)

const confirmDeleteModel = (record) => {
  deleteModel(record)
}

const deleteModel = async (record) => {
  deleteModelLoading.value = true
  const params = { id: record.id }
  try {
    await api.model.deleteModel(params)
  } catch (error) {
    return
  } finally {
    deleteModelLoading.value = false
  }
  getModelList(true)
}
</script>