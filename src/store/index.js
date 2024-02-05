import { createStore } from 'vuex'
import login from './modules/login'
import user from './modules/user'
import checkout from './modules/checkout'


export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    login,
    user,
    checkout
  },
  strict: false
})
