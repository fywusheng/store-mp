import { request } from '@/apis/request'

export default {
  // 获取三级行政区划
  getRegions: function (args = {}) {
    request({
      url: '/common/cusc/api/usersearch/getRegnAreaTree',
      ...args
    })
  },
  // 获取支付宝人脸识别唤起参数
  getAliPayCertifyParams: function (args = {}) {
    request({
      url: '/nun/api/alipay/certify',
      ...args,
      method: 'post'
    })
  },
  // 人脸查询状态
  certifyQuery: function (args = {}) {
    request({
      url: '/nun/api/alipay/certifyQuery',
      ...args,
      method: 'post'
    })
  },
  // 实人认证
  // realPersonAuthenticate: function(args = {}) {
  //   request({
  //     url: "/nun/api/userAccount/bindBankAcct",
  //     ...args,
  //   });
  // },
  // 实人认证（无需图片）
  realPersonAuthenticate: function (args = {}) {
    request({
      url: '/nun/api/userAccount/authAcct',
      ...args
    })
  },
  // 查询提交剩余次数
  getUserPenCount: function (args = {}) {
    request({
      url: '/common/auc/getUserPenCount',
      ...args
    })
  },
  // 获取人脸识别结果
  getFaceRecognitionResult: function (args = {}) {
    request({
      url: '/common/auc/userPen',
      ...args
    })
  },
  // 获取电子证状态
  getCertificateState: function (args = {}) {
    request({
      url: '/eac/senior/ec_cert_state',
      // 这个接口一定要传这个, 因为接口会判断这个值是否包含 / 这个符号
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 非老龄委渠道激活授权接口
  executeActivation: function (args = {}) {
    request({
      url: '/eac/senior/other_cert_active',
      // 这个接口一定要传这个, 因为接口会判断这个值是否包含 / 这个符号
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 申领电子证
  applyCertificate: function (args = {}) {
    request({
      url: '/eac/senior/ec_cert_save',
      // 这个接口一定要传这个, 因为接口会判断这个值是否包含 / 这个符号
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取授权码
  getAuthorizationCode: function (args = {}) {
    request({
      url: '/nun/api/userAuth/selcetAutuCode',
      ...args
    })
  },
  // 获取展证信息
  getCertificateInfo: function (args = {}) {
    request({
      url: '/eac/senior/show_senior_cert',
      // 这个接口一定要传这个, 因为接口会判断这个值是否包含 / 这个符号
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取展码信息
  getQRCodeInfo: function (args = {}) {
    request({
      url: '/eac/gcode/get_gen_code',
      // 这个接口一定要传这个, 因为接口会判断这个值是否包含 / 这个符号
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 解码, 获取 ecToken 用于二次解码
  getECToken: function (args = {}) {
    request({
      url: '/eac/gcode/decrypt_gen_code',
      // 这个接口一定要传这个, 因为接口会判断这个值是否包含 / 这个符号
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 二次解码, 获取解码信息
  checkECToken: function (args = {}) {
    request({
      url: '/eac/gcode/check_gen_code',
      // 这个接口一定要传这个, 因为接口会判断这个值是否包含 / 这个符号
      header: { 'content-type': 'application/json' },
      ...args
    })
  },

  // 添加赡养扶养关系
  addSuppertRelations: function (args = {}) {
    request({
      url: '/nun/api/support/addUserSupport',
      ...args
    })
  },
  // 删除赡养扶养关系
  deleteSuppertRelation: function (args = {}) {
    request({
      url: '/nun/api/support/delUserSupport',
      ...args
    })
  },
  // 上传图片(修改头像)
  imgUpload: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/imgUpload',
      ...args
    })
  },
  // 个人资料编辑(修改头像)
  updateUserInfo: function (args = {}) {
    request({
      url: '/nun/api/acct/saveUserInfo',
      ...args
    })
  },
  // 查询当前可用积分(我的页面)
  scoreInfo: function (args = {}) {
    request({
      url: '/cin/itgl/task/selectItglScoreInfo',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取积分数据(积分列表)
  getScoreList: function (args = {}) {
    request({
      url: '/cin/itgl/task/selectItglScoreDetailByPage',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 查询积分任务列表(积分页面)
  getUserTaskInfoByPage: function (args = {}) {
    request({
      url: '/cin/itgl/task/getUserTaskInfoByPage',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取未弹出的积分弹框列表
  findPopoverList: function (args = {}) {
    request({
      url: '/ngcmn/wbst/send/findPopoverList',

      ...args
    })
  },
  // 标记已弹出的积分弹框
  markPopover: function (args = {}) {
    request({
      url: '/ngcmn/wbst/msg/editstas',
      header: { 'content-type': 'application/json' },
      ...args
    })
  }

}
