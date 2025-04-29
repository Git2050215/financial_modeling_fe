<template>
  <a-space direction="vertical" style="width: 100%">
    <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading" bordered
      @change="changeTable">
      <template #title>
        <a-space align="center" size="large">
          <span :style="{ fontSize: '18px' }">用户信息表</span>

          <a-input-search v-model:value="name" placeholder="搜索用户名" enter-button style="width: 300px"
            @search="searchName" />
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a @click="openResetType(record)">更改用户类型</a>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="open" title="更改用户类型" :footer="null">
      <a-form name="resetType" style="margin-top: 20px;" :model="formState" :rules="rules" @finish="finishResetType">
        <a-form-item label="用户类型" name="type">
          <a-select v-model:value="formState.type" style="width: 300px;" :options="options" />
        </a-form-item>

        <a-form-item>
          <a-space style="float: right;">
            <a-button @click="closeResetType">
              取消
            </a-button>

            <a-button type="primary" html-type="submit" :disabled="noModify" :loading="resetTypeLoading">
              确认
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-space>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import api from '@/api'
import enums from '@/utility/enums'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
  },
  {
    title: '用户名',
    dataIndex: 'name',
    width: '25%',
  },
  {
    title: '用户类型',
    dataIndex: 'typeDesc',
    width: '25%',
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    width: '15%',
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastLoginTime',
    width: '15%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '10%',
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

onMounted(() => {
  getUserList(pagination.value.current, pagination.value.pageSize, name.value)
})

const searchName = (searchValue) => {
  getUserList(pagination.value.current, pagination.value.pageSize, searchValue)
}

const changeTable = (pag, filters, sorter) => {
  getUserList(pag.current, pag.pageSize, name.value)
}

const getUserList = async (current, pageSize, name) => {
  loading.value = true
  try {
    const data = await api.user.getUserList({ current, pageSize, name })
    dataSource.value = data.dataSource.map(user => ({
      ...user,
      key: user.id,
      typeDesc: enums.USER_TYPE_DESC[user.type]
    }))
    pagination.value = data.pagination
  } catch (error) {
    return
  } finally {
    loading.value = false
  }
}

const rules = {
  type: [
    {
      required: true,
      message: '用户类型不能为空',
    },
  ],
}
const options = [
  {
    value: enums.USER_TYPE.ADMIN,
    label: enums.USER_TYPE_DESC[enums.USER_TYPE.ADMIN],
  },
  {
    value: enums.USER_TYPE.ORDINARY,
    label: enums.USER_TYPE_DESC[enums.USER_TYPE.ORDINARY],
  },
]

const open = ref(false)
const resetTypeLoading = ref(false)
const editUser = ref(null)
const formState = reactive({
  type: enums.USER_TYPE.ORDINARY,
})

const noModify = computed(() => {
  return formState.type === editUser.value.type
})

const openResetType = (record) => {
  open.value = true
  editUser.value = record
  formState.type = record.type
}

const closeResetType = () => open.value = false

const finishResetType = async (values) => {
  resetTypeLoading.value = true
  try {
    const params = { ...values, id: editUser.value.id }
    await api.user.resetType(params)
  } catch (error) {
    return
  } finally {
    resetTypeLoading.value = false
  }
  closeResetType()
  getUserList(pagination.value.current, pagination.value.pageSize, name.value)
}

</script>