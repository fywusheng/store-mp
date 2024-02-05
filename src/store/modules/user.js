/**
 * 用户模块
 */
import VUEX from '@/store/mutation-types'

export default {
  state: {
    userInfo: null, //  平台用户数据
    wxUserInfo: null // 微信用户信息
  },
  getters: {},
  mutations: {
    [VUEX.USER.SET_USER_INFO](state, userInfo) {
      userInfo.age = userInfo.age || ''
      userInfo.gender = userInfo.gender || ''
      state.userInfo = userInfo
    },
    [VUEX.USER.SET_WX_USER_INFO](state, payload) {
      state.wxUserInfo = payload
    },
    [VUEX.USER.SET_MODE](state, mode) {
      state.mode = mode
    }
  },
  actions: {
    getUserData(ctx) {

    }
  }
}
