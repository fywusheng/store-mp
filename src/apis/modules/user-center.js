import { request } from '@/apis/request'

export default {
  // 支付宝一键登录
  alipayLogin: function (args = {}) {
    request({
      url: '/nun/api/acct/checkPhoneAndLogin',
      ...args
    })
  },
  // 是否注销过
  checkLogOutUser: function (args = {}) {
    request({
      url: '/nun/api/acct/checkLogOutUser',
      ...args
    })
  },
  // 注销账号
  cancel: function (args = {}) {
    request({
      url: '/nun/api/acct/eliminateUactInfo',
      ...args
    })
  },
  // 发送短信验证码
  sendSMSCode: function (args = {}) {
    request({
      url: '/ngcmn/sms/sendCode',
      ...args
    })
  },
  // 校验短信验证码
  checkSMSCode: function (args = {}) {
    request({
      url: '/ngcmn/sms/verifyCode',
      ...args
    })
  },
  // 手机号是否注册
  registerVerify: function (args = {}) {
    request({
      url: '/nun/api/acct/registerVerify',
      showsLoading: true,
      ...args
    })
  },
  // 注册
  register: function (args = {}) {
    request({
      url: '/nun/api/userAccount/registeredAndLogin',
      showsLoading: true,
      ...args
    })
  },
  // 查询遗嘱证信息
  getWillInfoByPhone: function(args = {}) {
    return request({
      url: '/nun/api/testament/selectByPhone',
      ...args
    })
  },
  // 获取用户信息
  getUserInfo: function (args = {}) {
    request({
      url: '/nun/api/token/getUserAccount',
      ...args
    })
  },
  // 通过手机号及验证码登录
  loginByPhoneNumber: function (args = {}) {
    request({
      url: '/nun/api/login/loginbymobile',
      showsLoading: true,
      ...args
    })
  },
  // 通过手机号或身份证号及密码登录
  loginByAccount: function (args = {}) {
    request({
      url: '/nun/api/login/loginByAcct',
      showsLoading: true,
      ...args
    })
  },
  // 修改手机号(未修改电子证)
  updateMobile: function (args = {}) {
    request({
      url: '/nun/api/acct/updateMobile',
      showsLoading: true,
      ...args
    })
  },
  // 根据身份证号获取手机号
  getPhoneNumberByIDCardNumber: function (args = {}) {
    request({
      url: '/nun/api/acct/selectAccByCertNoAndName',
      showsLoading: true,
      ...args
    })
  },
  // 退出登录
  logout: function (args = {}) {
    request({
      url: '/nun/api/login/logout',
      showsLoading: true,
      ...args
    })
  },
  // 重置密码
  resetPassword: function (args = {}) {
    request({
      url: '/nun/api/acct/findBackPwd',
      showsLoading: true,
      ...args
    })
  },
  // 验证原密码
  validateOldPassword: function (args = {}) {
    request({
      url: '/nun/api/acct/validatedPwd',
      ...args
    })
  },
  // 修改密码
  modifyPassword: function (args = {}) {
    request({
      url: '/nun/api/acct/changePwd',
      showsLoading: true,
      ...args
    })
  },
  // 批量上传图片
  uploadImages: function (args = {}) {
    request({
      url: '/common/app/imgRpc/batchUpload',
      showsLoading: true,
      ...args
    })
  },
  // 意见反馈
  feedback: function (args = {}) {
    request({
      url: '/nun/app/prb/add',
      ...args
    })
  },
  // 获取消息列表
  getMessageInfo: function (args = {}) {
    request({
      url: '/ngcmn/wbst/msgtype/list',
      ...args
    })
  },
  // 获取消息列表
  getMessageList: function (args = {}) {
    request({
      url: '/ngcmn/wbst/msg/record/list',
      ...args
    })
  },
  // 获取消息详情
  getMessageDetail: function (args = {}) {
    request({
      url: '/ngcmn/wbst/msg/getWbstMsgDetail',
      ...args
    })
  },
  // 标记单条消息为已读
  changeMessageState: function (args = {}) {
    request({
      url: '/ngcmn/wbst/msg/editstas',
      ...args
    })
  },
  // 用户实名根据姓名和身份证号
  authAcct: function (args = {}) {
    request({
      url: '/nun/api/userAccount/authAcct',
      ...args
    })
  },
  //  去掉背景接口
  clearBg: function (args = {}) {
    request({
      url: '/eac/ec/photo/extract',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  //  人脸比对接口（每天只能调用5次）
  authComparison: function (args = {}) {
    request({
      url: '/common/auc/userPenCount',
      ...args
    })
  },
  //  卡申领
  saveCard: function (args = {}) {
    request({
      url: '/eac/senior/ec_cert_save',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  //  查询首页待操作弹窗提示
  getHomePop: function (args = {}) {
    request({
      url: '/cin/itgl/task/getHomePop',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 校验身份证
  validateCard: function (args = []) {
    request({
      url: '/nun/api/userAccount/checkIdCard',
      header: { 'content-type': 'application/json', 'tsf-metadata': '' },
      ...args
    })
  }
}
