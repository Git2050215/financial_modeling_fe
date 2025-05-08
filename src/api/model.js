import http from './http'

export default {
  // 获取模型列表
  getModelList(payload) {
    return http.get(`/model/get/model/list?${new URLSearchParams(payload).toString()}`)
  },
  // 创建模型
  createModel(payload) {
    return http.post('/model/create/model', payload)
  },
  // 删除模型
  deleteModel(payload) {
    return http.post('/model/delete/model', payload)
  },
  // 更改模型
  updateModel(payload) {
    return http.post('/model/update/model', payload)
  },
  // 获取模型详情
  getModelDetail(payload) {
    return http.get(`/model/get/model/detail?${new URLSearchParams(payload).toString()}`)
  },
  // 创建属性
  createAttr(payload) {
    return http.post('/model/create/attr', payload)
  },
  // 删除属性
  deleteAttr(payload) {
    return http.post('/model/delete/attr', payload)
  },
  // 更改属性
  updateAttr(payload) {
    return http.post('/model/update/attr', payload)
  },
  // 获取属性详情
  getAttrDetail(payload) {
    return http.get(`/model/get/attr/detail?${new URLSearchParams(payload).toString()}`)
  },
  // 创建公式
  createFormula(payload) {
    return http.post('/model/create/formula', payload)
  },
  // 删除公式
  deleteFormula(payload) {
    return http.post('/model/delete/formula', payload)
  },
  // 更改公式
  updateFormula(payload) {
    return http.post('/model/update/formula', payload)
  },
  // 获取属性选项
  getAttrOptions(payload) {
    return http.get(`/model/get/attr/options?${new URLSearchParams(payload).toString()}`)
  },
}