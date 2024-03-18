// 商户
<template>
  <view class="bussins">
    <view class="item" v-for="(artItem,artIndex) in list" :key="artIndex">
      <view class="_top" @click="detail(artItem)">
        <image class="_left" v-if="artItem.photos" :src="geturl(artItem.photos)"
          mode="scaleToFill" />
        <image class="_left" mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/home/image-home-article-default.png"
          v-if="!artItem.photos" />
        <view class="_right">
          <view class="line">
            <view :class="[artItem.topFlag == 1 ?'_color':'']">{{artItem.topFlag == 1?'置顶':''}}
            </view>
            <view class="test">{{artItem.orgOfficeName}}</view>
          </view>
          <view class="linNum">
            <view class="point">{{artItem.orgOfficeType}}</view>
            <!-- <view class="point">38元/人</view> -->
          </view>
          <view class="linNum">
            <view class="point">距您</view>
            <view class="point">{{artItem.distance | setDistance}}</view>
          </view>
          <!-- <view class="linNum">
                      <view class="point">距您</view>
                      <view class="point">200公里</view>
                  </view>
                  <view class="flag">
                      <view class="item">团</view>
                      <view class="item">劵</view>
                  </view> -->
        </view>
      </view>
      <view class="noimg-bottom">
        <view class="_item" @click="optionClick(0,artItem,artIndex)">
          <image class="icon" :src="icons[artItem.topFlag]" mode="scaleToFill" />
          <view class="_text">{{artItem.topFlag == 1?'取消置顶':'置顶'}}</view>
        </view>
        <view class="_item" @click="optionClick(1,artItem,artIndex)">
          <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/user-center/del.png"
            mode="scaleToFill" />
          <view class="_text">取消收藏</view>
        </view>
        <!-- <view class="_item" @click="optionClick(2,artItem,artIndex)">
                    <image class="icon" src="@/pages/user-center/static/option.png" mode="scaleToFill" />
                    <view class="_text">分享</view>
                </view> -->
      </view>
    </view>
    <block v-if="list.length === 0">
      <view class="pad-top flex-v flex-c-c status-box">
        <image src="https://ggllstatic.hpgjzlinfo.com/static/common/status-none2x.png"
          mode="scaleToFill" class="imgStyle" />
        <view class="flex-c-c status-text">暂无内容</view>
      </view>
    </block>
    <!-- TODO 抽离分享功能 -->
    <uni-popup class="popup" ref="popup" type="bottom" :mask-click="true">
      <view class="share-pop pt-32">
        <view class="title fs-36">分享到</view>
        <view class="flex-h list fs-36">
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-wechat.png" mode="" />
            <text>微信好友</text>
          </button>
          <!-- #ifdef MP-ALIPAY -->
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-qq.png"
              mode="scaleToFill" />
            <text>QQ好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-alipay.png"
              mode="scaleToFill" />
            <text>支付宝好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-message.png"
              mode="scaleToFill" />
            <text>短信</text>
          </button>
          <!-- #endif -->
          <button class="item flex-v flex-c-c ml-56" @click="handleCopyClick">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-link.png" mode="" />
            <text>复制链接</text>
          </button>
        </view>
        <view class="btn">
          <view @click="handleCloseClick" class="cancle bg-white flex-h flex-c-c fs-44">取消</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import api from '@/apis/index.js'
import { showToast } from '@/utils/uni'
export default {
  props: {
    list: {
      type: Array,
      default: () => [

      ]
    }
  },
  data() {
    return {
      orgOfficeId: '',
      orgOfficeType: '',
      icons: { '0': 'https://ggllstatic.hpgjzlinfo.com/static/user-center/topicon.png', '1': 'https://ggllstatic.hpgjzlinfo.com/static/user-center/cancel.png' },
      list2: [
        {
          'orgOfficeId': '9f0b0552d0dc40febdc42b099d3e89ed',
          'topFlag': '0',
          'orgOfficeName': '高吉湖小龙·The Long House',
          'orgOfficeType': '美食',
          'orgOfficeAddr': '甜水园街北里16号楼京客隆商厦超市1层',
          'price': '',
          'distance': 0.528340786677242,
          'level': '',
          'photos': 'https://imgs.699pic.com/01/500/628/783/500628783.jpg!list2x.v1,http://120.42.37.88:10088/nepsp-file/group1/M00/03/89/wKgupGFDOdiAPIRZAAAryBQH0Sw784.jpg'
        },
        {
          'orgOfficeId': '57a372a4ed2c495f8b85aecd42f1ec12',
          'topFlag': '0',
          'orgOfficeName': '服务中心托老所',
          'orgOfficeType': '养老院',
          'orgOfficeAddr': '甜水园街北里16号楼京客隆商厦超市2层',
          'price': '',
          'distance': 0.4591509063670338,
          'level': '',
          'photos': 'http://120.42.37.88:10088/nepsp-file/group1/M00/03/89/wKgupGFDOdiAPIRZAAAryBQH0Sw784.jpg,https://imgs.699pic.com/01/500/628/783/500628783.jpg!list2x.v1'
        }
      ]
    }
  },
  created() {
  },
  filters: {
    setDistance(s) {
      const distant = s
      s = Number(s * 1000)
      if (s.toFixed() < 1000) {
        return s.toFixed() + '米'
      } else {
        return distant.toFixed(2) + '公里'
      }
    }
  },
  methods: {
    geturl(urls) {
      return urls.split(',')[0]
    },
    detail(item) {
      // 经确认可以收藏回来的列表都有详情
      uni.navigateTo({
        url: '/pages/map/address-detail?orgOfficeId=' + item.orgOfficeId
      })
    },
    // 点击复制链接
    handleCopyClick() {
      // 没有详情--助餐点，"日间照料":"look-after-details"
      const mapUrl = {
        '美食': 'delicious-food-details',
        '政务服务': 'government-details', '养老院': 'nursing-home-details',
        '药店': 'pharmacy-details', '商超': 'store-details',
        '景点': 'scenic-details', '酒店': 'hotel-details', '医院': 'hospital-details'
      }
      const s_url = mapUrl[this.orgOfficeType]
      if (!s_url) return
      let url = ''
      url = `https://ggll.hpgjzlinfo.com/#/map/${s_url}/${this.orgOfficeId}?isShare=1`
      uni.setClipboardData({
        data: url,
        success: (res) => {
          uni.getClipboardData({
            success: (resp) => {
              this.$refs.popup.close()
              console.log('resp:', resp)
              uni.showToast({
                title: '已复制到剪贴板'
              })
            }
          })
        }
      })
    },
    // 点击分享
    handleShareClick() {
      if (!uni.getStorageSync('token')) {
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
        return
      }
      this.$refs.popup.open()
    },
    // 关闭分享
    handleCloseClick() {
      this.$refs.popup.close()
    },
    optionClick(type, item, i_id) {
      this.orgOfficeId = item['orgOfficeId']
      this.orgOfficeType = item['orgOfficeType']
      if (type == 0) {
        // 取消置顶
        const flag = { 0: '1', 1: '0' }
        const topV = flag[item['topFlag']]
        const id = item['orgOfficeId'] || ''
        this.updateByid(id, topV, '0', item, i_id, type)
      } else if (type == 1) {
        // 取消收藏
        const id = item['orgOfficeId'] || ''
        this.updateByid(id, '0', '1', item, i_id, type)
      } else {
        // 分享
        this.handleShareClick()
      }
    },
    updateByid(colId, topFlag, delFlag, item, i_id, type) {
      const params = {
        colId: colId,
        topFlag: topFlag, // 置顶 1 ,0
        delFlag: delFlag// 取消 1  0
      }
      const param = {
        requestColSingleDTOList: [params]
      }
      api.updateCollect({
        data: param,
        success: (res) => {
          if (res) {
            this.$emit('fresh', { item: item, index: i_id, type: type })
            this.$uni.showToast('操作成功')
          }
        },
        fail: (erro) => {
          this.$uni.showToast(erro.message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bussins {
  background-color: #f2f2f2;
  margin-top: 80rpx;
  .pad-top {
    padding-top: 300rpx;
    background-color: #fdfdfd;
    .imgStyle {
      width: 440rpx;
      height: 234rpx;
      margin-bottom: 24rpx;
    }
  }
  .item {
    background-color: #fff;
    padding-top: 12rpx;
    padding-left: 21rpx;
    padding-right: 21rpx;
    margin-bottom: 13rpx;
    ._top {
      display: flex;
      width: 100%;
      ._left {
        width: 30%;
        height: 244rpx;
        margin-right: 14rpx;
      }
      ._right {
        width: 70%;
        .line {
          display: flex;
          // height: 50rpx;
          display: flex;
          // line-height: 45rpx;
          margin-bottom: 8rpx;
          margin-top: 5rpx;
          ._color {
            width: 86rpx;
            height: 40rpx;
            background: #ff9a00;
            border-radius: 2px;
            color: #fff;
            text-align: center;
            font-size: 32rpx;
            line-height: 40rpx;
            margin-right: 13rpx;
            margin-top: 9rpx;
          }
          .test {
            font-weight: 500;
            font-size: 40rpx;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 460rpx;
          }
        }
        .linNum {
          display: flex;
          margin-bottom: 15rpx;
        }
        .flag {
          display: flex;
          .item {
            background: #fffefd;
            border-radius: 2px;
            border: 1px solid #ff5500;
            color: #ff5500;
            width: 56rpx;
            height: 35rpx;
            padding: 0;
            margin-right: 14rpx;
            text-align: center;
            line-height: 35rpx;
          }
        }
      }
    }
    .noimg-bottom {
      width: 100%;
      display: flex;
      justify-content: space-between;
      height: 96rpx;
      line-height: 96rpx;
      border-top: 2rpx solid #eeeeee;

      ._item {
        display: flex;
        justify-content: flex-start;
        font-size: 36rpx;
        .icon {
          width: 40rpx;
          height: 40rpx;
          // padding-top: 28rpx;
          margin-top: 26rpx;
        }
        ._text {
          margin-left: 4rpx;
        }
      }
    }
  }
  .share-pop {
    background-color: #f2f2f2;
    border-radius: 16px 16px 0px 0px;
    color: #333333;
    .title {
      text-align: center;
      line-height: 50rpx;
    }
    .list {
      // #ifdef MP-ALIPAY
      justify-content: flex-start;
      // #endif
      // #ifdef MP-WEIXIN
      justify-content: center;
      // #endif
      align-items: center;
      padding: 24rpx 74rpx;
      flex-wrap: wrap;
      .item {
        height: 192rpx;
        flex-shrink: 0;
        width: 33.3%;
        margin-bottom: 28rpx;
        image {
          flex-shrink: 0;
          width: 134rpx;
          height: 134rpx;
          margin-bottom: 8rpx;
        }
        text {
          line-height: 50rpx;
        }
      }
    }
    .btn {
      padding: 24rpx 74rpx;
      box-sizing: border-box;
      .cancle {
        height: 108rpx;
        border-radius: 54rpx;
        color: #666;
        font-weight: 500;
      }
    }
  }
}
</style>
