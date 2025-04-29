import http from './http'

export default {
  // 获取金融模型
  getModel(payload) {
    return http.get(`/model/get/model?${new URLSearchParams(payload).toString()}`)
  },

  // 获取金融模型列表
  getModelList(payload) {
    return http.get(`/model/get/model/list?${new URLSearchParams(payload).toString()}`)
  },

  // 获取金融模型详情
  getModelDetail(payload) {
    return http.get(`/model/get/model/detail?${new URLSearchParams(payload).toString()}`)
  },

  // 创建金融模型
  createModel(payload) {
    return http.post('/model/create/model', payload)
  },

  // 删除金融模型
  deleteModel(payload) {
    return http.post('/model/delete/model', payload)
  },

  // 更改金融模型
  updateModel(payload) {
    return http.post('/model/update/model', payload)
  },
}