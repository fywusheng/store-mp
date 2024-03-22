/**
 * 用户模块
 */
import VUEX from '@/store/mutation-types'

export default {
  state: {
    userInfo: null, //  登录用户数据
    wxUserInfo: null,// 微信用户信息
	storeInfo:null //门店信息
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
    },
    [VUEX.USER.SET_STORE_INFO](state, storeInfo) {
      // userInfo.age = userInfo.age || ''
      // userInfo.gender = userInfo.gender || ''
      // state.userInfo = userInfo
    },
    setUserInfo(state, userInfo) {
      if(userInfo.type === '普通用户'){
        userInfo.memberStatus = '0'
      }else{
        userInfo.memberStatus = '1'
      }
      state.userInfo = userInfo
    }
  },
  actions: {
    setUserInfo(ctx, userInfo) {
      ctx.commit('setUserInfo', userInfo)
    }
  }
}
