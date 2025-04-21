import { reactive } from 'vue'

const store = reactive({
  token: '',
  user: null,
  setToken(_token) {
    this.token = _token
  },
  setUser(_user) {
    this.user = _user
  },
})

export default store