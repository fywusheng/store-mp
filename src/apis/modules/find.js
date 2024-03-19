import { request } from '@/apis/request'

export default {
  // 栏目分类接口
  queryColList: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscol/queryColList',
      ...args
    })
  },
  // 根据栏目Id和城市citycode刷新文章列表
  getCmsReflushList: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/getCmsReflushList',
      ...args
    })
  },
  // 根据栏目Id获取文章列表
  selectArtiListByColId: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/selectArtiListByColId',
      ...args
    })
  },
  // 获取置顶
  getTopList: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/getTopList',
      ...args
    })
  },
  // 获取文章详情
  getContById: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/getContById',
      ...args
    })
  },
  // 获取视频列表
  getVideoList: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/getVideoList',
      ...args
    })
  },
  // 获取小视频随机列表
  getRandomVideo: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/getRandomVideo',
      ...args
    })
  },

  // 获取小视频随机列表
  getCategoryList: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/getCategoryList',
      ...args
    })
  },
  // 搜索页面
  // 热词接口
  getCmsHotList: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/getCmsHotList',
      ...args
    })
  },

  // 传关键字回联想词
  findLenWord: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/findLenWord',
      ...args
    })
  },
  // /iep/web/cms/cmscont/findFilterVideoWord
  // 微信小程序没有视频入口 关键字查找
  findFilterVideoWord: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/findFilterVideoWord',
      ...args
    })
  },
  // 搜索
  selectArtiListByKey: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/selectArtiListByKey',
      ...args
    })
  },
  // 搜索-没有小视频的过滤
  selectArtiListByKeyWord: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/selectArtiListByKeyWord',
      ...args
    })
  },
  // 点赞
  giveAlike: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/giveAlike',
      ...args
    })
  }

}
