/**
 * 登录模块
 */
// import { set } from 'lodash'
export default {
  state: {
    sessionId: uni.getStorageSync('sessionId') || '',
    session_key: '',
    openid: '',
    unionid: ''
  },
  getters: {
    isLogin(state) {
      return !!state.sessionId
    }
  },
  mutations: {
    [VUEX.LOGIN.SET_WX_AUTH_ID](state, payload) {
      payload = payload || {}
      if (payload.openId) {
        state.openid = payload.openId
        uni.setStorageSync('openid', state.openId)
      }

      if (payload.unionId) {
        state.unionid = payload.unionId
        uni.setStorageSync('unionid', state.unionId)
      }

      if (payload.wxSessionKey) {
        state.session_key = payload.wxSessionKey
        uni.setStorageSync('session_key', state.wxSessionKey)
      }
      if (payload.sessionId) {
        state.sessionId = payload.sessionId
        uni.setStorageSync('sessionId', state.sessionId)
      }
    },
    [VUEX.LOGIN.SET_SESSION_ID](state, payload) {
      state.sessionId = payload
    },
    'LOG_OUT'(state) {
      const map = ['sessionId', 'session_key', 'openid', 'unionid']
      map.forEach(key => {
        state[key] = ''
        uni.removeStorageSync(key)
      })
    }
  },
  actions: {
    logout(ctx) {
      ['token', 'userInfo'].forEach((key) => {
        uni.removeStorageSync(key)
      })
      ctx.commit('LOG_OUT')
    },
    async login(ctx) {
      const authData = await Axios.post(`/user/login`, {})
      ctx.commit(VUEX.LOGIN.SET_WX_AUTH_ID, authData.data)
    }
  }
}
