import axios from 'axios'
import { message } from 'ant-design-vue'

import store from '@/store'

const http = axios.create({
  baseURL: "http://127.0.0.1:1647", // 基础URL
  timeout: 10000, // 超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    const token = store.token
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    message.error(`请求错误 ${error.message}`)
    console.error(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    const data = response.data
    if (data.code !== 0) {
      message.error(data.msg)
      return Promise.reject(new Error(data.msg))
    }
    if (data.msg) {
      message.success(data.msg)
    }
    return data.data
  },
  error => {
    switch (error.status) {
      case 401:
        message.error(error.response.data)
        break
      case 403:
        message.error(error.response.data)
        break
      default:
        message.error(`响应错误 ${error.message}`)
        break
    }
    console.error(error)
    return Promise.reject(error)
  }
)

export default http