import http from './http'

export default {
  // 开启对话
  newChat(payload) {
    return http.get(`/chat/new/chat?${new URLSearchParams(payload).toString()}`)
  },
  // 清空对话
  clearChat(payload) {
    return http.get(`/chat/clear/chat?${new URLSearchParams(payload).toString()}`)
  },
  // 结束对话
  endChat(payload) {
    return http.get(`/chat/end/chat?${new URLSearchParams(payload).toString()}`)
  },
  // 用户发送消息
  sendMessage(payload) {
    return http.post('/chat/send/message', payload)
  },
  // 获取对话列表（用户）
  getChatListMy(payload) {
    return http.get(`/chat/get/chat/list/my?${new URLSearchParams(payload).toString()}`)
  },
  // 获取对话列表（全部）
  getChatList(payload) {
    return http.get(`/chat/get/chat/list?${new URLSearchParams(payload).toString()}`)
  },
}