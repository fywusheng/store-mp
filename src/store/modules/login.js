/**
 * 登录模块
 */
// import { set } from 'lodash'
export default {
  state: {
    token: uni.getStorageSync('token') || '',
    session_key: '',
    openid: '',
    unionid: '',
	userInfo:null,//登录用户信息
	storeInfo:null, //门店信息
	storeNo:'' //门店编号
  },
  getters: {
    isLogin(state) {
      return !!state.token
    },
	UserInfo(state){
		return state.userInfo
	},
	StoreInfo(state){
		return state.storeInfo
	},
	storeNo(state){
		return state.storeNo
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
		console.log(" payload = payload || {}",payload)
		state.token = payload.token;
		state.userInfo = payload;
		state.storeInfo = payload.shStoreDTO;
		state.storeNo = payload.storeNo
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
    async login(ctx,data) {
      ctx.commit(VUEX.LOGIN.SET_SESSION_ID,data)
    }
  }
}
