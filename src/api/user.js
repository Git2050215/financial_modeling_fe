import http from './http'

export default {
  // 获取用户信息
  getUser(payload) {
    return http.get(`/user/get/user?${new URLSearchParams(payload).toString()}`)
  },

  // 更改用户名
  resetName(payload) {
    return http.post('/user/reset/name', payload)
  },

  // 更改密码
  resetPasswd(payload) {
    return http.post('/user/reset/passwd', payload)
  },
}