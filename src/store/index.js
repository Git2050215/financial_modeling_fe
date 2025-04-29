import { reactive } from 'vue'

const store = reactive({
  token: '',
  user: null,
  setToken(token) {
    this.token = token
  },
  setUser(user) {
    this.user = user
  },
})

export default store