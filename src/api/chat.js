import http from './http'

export default {
  // 用户发送消息
  sendMessage(payload) {
    return http.post('/chat/send/message', payload)
  },

  // 开启新对话
  newChat(payload) {
    return http.get(`/chat/new/chat?${new URLSearchParams(payload).toString()}`)
  },

  // 下载表格
  downloadExcel(payload) {
    return http.get(`/chat/download/excel?${new URLSearchParams(payload).toString()}`)
  },
}