import http from './http'

export default {
  // 登录
  login(payload) {
    return http.post('/auth/login', payload)
  },
  // 登出
  logout(payload) {
    return http.get(`/auth/logout?${new URLSearchParams(payload).toString()}`)
  },
  // 注册
  register(payload) {
    return http.post('/auth/register', payload)
  },
}