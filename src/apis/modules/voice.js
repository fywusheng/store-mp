import { request } from '@/apis/request'

export default {
  // 获取随机语音搜索示例
  getRandomExamples: function(args = {}) {
    request({
      url: '/cin/rout/ser/selectRoutInfoByRandom',
      ...args
    })
  },
  // 获取热门语音搜索示例
  getHotExamples: function(args = {}) {
    request({
      url: '/cin/rout/ser/selectHotRoutInfo',
      // 这个接口一定要传这个, 不然会接收不到参数(我也不知道为什么, 反正后端就是这么会玩)
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取语音搜索结果
  getVoiceSearchResult: function(args = {}) {
    request({
      url: '/cin/rout/ser/selectRoutInfoByName',
      // 这个接口一定要传这个, 不然会接收不到参数(我也不知道为什么, 反正后端就是这么会玩)
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 语音识别
  getVoiceResult: function(args = {}) {
    request({
      url: '/eac/audio/analysis',
      // 这个接口一定要传这个, 不然会接收不到参数(我也不知道为什么, 反正后端就是这么会玩)
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 规划师搜索
  selectPlannerByPhone: function(args = {}) {
    request({
      url: '/nun/api/testament/selectPlannerByPhone',
      // 这个接口一定要传这个, 不然会接收不到参数(我也不知道为什么, 反正后端就是这么会玩)
      header: { 'content-type': 'application/json' },
      ...args
    })
  }
}
