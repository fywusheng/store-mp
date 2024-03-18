// 积分兑换
<template>
  <view class="point">
    <view class="top"></view>
    <view class="_c">
      <view class="use">
        <view class="_left">
          <image class="img" mode="scaleToFill"
            :src="userInfo.userIcon?userInfo.userIcon:'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-default-avatar.png'">
            <view class="lable">可用积分:</view>
            <view class="num">{{score?score:'--'}}</view>
        </view>
        <view class="_right">
          <view class="j" @click="goHandler">{{userInfo.tel?'赚取积分':'去登录'}}</view>
        </view>
      </view>
      <view class="di_kou">
        <view class="_top">
          <view class="n">劲爆抵扣</view>
          <view class="m">积分最高可100%抵扣</view>
        </view>
        <!-- 劲爆抵扣 -->
        <view class="list" v-for="(v,i) in explosiveList" :key="i" @click="goItemClick(v)">
          <view class="_n_list">
            <view class="list_l">
              <image class="img" :class="{'opacityImg':v.soldOut === 0?true:false}"
                :src="v.mainImgUrl" mode="scaleToFill">
                <image class="img bgempt" v-if="v.soldOut === 0"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/empt.png">
            </view>
            <view class="list_r">
              <view class="_n" :class="{'turnColor':v.soldOut === 0?true:false}">{{v.name}}</view>
              <view class="line">
                <view class="p">到手价</view>
                <view class="m">￥{{v.presentPrice}}</view>
                <view class="del">￥{{v.salePrice}}</view>
              </view>
              <view class="endP">
                <view class="widthAuto">积分抵扣￥{{v.creditPoints}}</view>
              </view>
            </view>
          </view>

        </view>
      </view>
      <!-- 好物推荐 -->
      <view class="di_kou">
        <view class="_top">
          <view class="n">好物推荐</view>
          <view class="m">积分好物爆款推荐</view>
        </view>
        <view class="good_list">
          <view class="_block" v-for="(v,i) in goodsList" :key="i" @click="goItemClick(v)">
            <view class="box">
              <image class="img" :src="v.mainImgUrl" mode="scaleToFill">
                <image class="img bgempt" v-if="v.soldOut === 0"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/empt.png">
            </view>
            <view class="jf">积分抵扣￥{{v.creditPoints}}</view>
            <view class="price">￥{{v.presentPrice}}</view>
          </view>
        </view>
      </view>
      <!-- 商品推荐 -->
      <view class="recommed">
        <view class="_block" v-for="(v,i) in prodList" :key="i" @click="goItemClick(v)">
          <image mode="scaleToFill" class="icon" :src="v.mainImgUrl"
            @error="handleImageLoadFail(i)" />
          <image class="icon bgempt" v-if="v.soldOut === 0"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/empt.png">
            <view class="name">{{v.name}}</view>
            <view class="jf">积分抵扣￥{{v.creditPoints}}</view>
            <!--  isCreditPoints == 1 时显示到手价格-->
            <view class="_p">
              <view class="getPrice">到手价</view>
              ￥{{(v.isCreditPoints == 1 && (v.presentPrice || v.presentPrice == 0))?v.presentPrice:''}}
            </view>
        </view>
      </view>
    </view>
    <view class="top-layout">
      <button class="menu" @click="goBuy">
        <image class="icon  icon-service"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/bug.png">
      </button>
      <div class="menu" @click="toTop">
        <image class="icon icon-top"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/top.png">
      </div>
    </view>
  </view>
</template>
<script>
import api from '@/apis/index.js'

export default ({
  data() {
    return {
      explosiveList: [],
      goodsList: [],
      list: [],
      prodList: [],
      pageSize: 20,
      pageNum: 1,
      userInfo: null,
      score: ''
    }
  },
  created() {
    this.recommend(1)
    this.recommend(2)
    this.getProdList()
  },
  // onShow() {
  // this.autoScore()
  // },

  async onLoad(e) {
    this.autoScore(e)
    // 监听登录事件，更新用户信息
    uni.$on('didLogin', this.autoScore)
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getProdList()
  },
  // 上拉加载
  onReachBottom() {
    this.getProdList()
  },
  methods: {
    // 图片加载失败
    handleImageLoadFail(index) {
      this.prodList[index].mainImgUrl = 'https://ggllstatic.hpgjzlinfo.com/static/home/image-home-article-default.png'
    },
    async autoScore(e) {
      const token = uni.getStorageSync('token') || e.token
      if (token) {
        uni.setStorageSync('token', token)
        this.userinfor = await this.getUserInfo()
        uni.setStorageSync('userInfo', this.userinfor)
      } else {
        Store.dispatch('logout')
      }
      this.handleScoreInfo()
    },
    /**
   * 获取用户信息
   */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        api.getUserInfo({
          data: {
            accessToken: uni.getStorageSync('token')
          },
          success: (data) => {
            resolve(data)
          },
          fail: (error) => {
            reject(error)
          }
        })
      })
    },
    toTop() {
      wx.pageScrollTo({
        scrollTop: 0
      })
    },
    goBuy() {
      if (!Store.getters.isLogin) {
        Store.dispatch('logout')
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
        return false
      }
      uni.navigateTo({
        url: '/sub-pages/point/cart/main?sceneType=积分兑换'
      })
    },
    goItemClick(v) {
      uni.navigateTo({
        url: `/sub-pages/index/item/main?id=${v.id}&sceneType=积分兑换`
      })
    },
    goHandler() {
      if (this.userInfo.tel) {
        uni.navigateTo({ url: '/pages/user-center/my-points' })
      } else {
        uni.navigateTo({ url: '/pages/user-center/login' })
      }
    },
    handleScoreInfo() {
      this.userInfo = uni.getStorageSync('userInfo')
      if (!this.userInfo.uactId) return
      api.scoreInfo({
        data: {
          userId: this.userInfo.uactId
        },
        success: (res) => {
          this.score = res.score
        }
      })
    },
    async getProdList() {
      const params = {
        pageSize: 20,
        pageNum: this.pageNum,
        isCreditPoints: 1
      }
      const res = await Axios.post('/product/getProductSearchList', params)
      if (res.code == '200') {
        const data = res.data || {}
        const esProducts = data.esProducts || []
        if (esProducts.length > 0) {
          this.pageNum = this.pageNum + 1
          this.prodList = this.prodList.concat(esProducts)
        }
      }
    },
    async recommend(flag) {
      const params = { productType: flag }
      const list = await Axios.post('/product/getProductListByType', params)
      let getList = []
      if (list.code == '200') {
        getList = list.data || []
        if (flag == 1) {
          this.explosiveList = getList
        } else {
          this.goodsList = getList
        }
      } else {
        wx.showToast(list.msg)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.point {
  background: #f2f2f2;
  .top {
    width: 100%;
    height: 762rpx;
    background-image: url('https://ggllstatic.hpgjzlinfo.com/static/home/ponit3.png');
    background-repeat: no-repeat;
    background-size: contain;
  }
  ._c {
    width: 91%;
    margin: 0 auto;
    margin-top: -373rpx;
    .use {
      width: 100%;
      height: 160rpx;
      background-image: url('https://ggllstatic.hpgjzlinfo.com/static/home/bg_point.png');
      background-size: contain;
      display: flex;
      margin-bottom: 32rpx;
      justify-content: space-between;
      line-height: 160rpx;
      ._left {
        display: flex;
        .img {
          width: 80rpx;
          height: 80rpx;
          padding: 40rpx 14rpx 40rpx 24rpx;
        }
        .lable {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
        .num {
          font-size: 44rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff5500;
        }
      }
      ._right {
        padding: 42rpx 16rpx 42rpx 0rpx;
        .j {
          width: 224rpx;
          height: 76rpx;
          background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
          border-radius: 39rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 76rpx;
          text-align: center;
        }
      }
    }
    .di_kou {
      margin-bottom: 32rpx;
      ._top {
        padding: 32rpx 0 32rpx 32rpx;
        background-image: url('https://ggllstatic.hpgjzlinfo.com/static/home/di_kou.png');
        background-size: cover;
        display: flex;
        background-repeat: no-repeat;
        .n {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
        }
        .m {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-left: 16rpx;
          line-height: 56rpx;
        }
      }
      .list {
        background-color: #fff;
        padding: 16rpx 20rpx 16rpx 20rpx;
        ._n_list {
          padding: 22rpx 0 22rpx 20rpx;
          display: flex;
          // margin-bottom: 16rpx;
          .list_l {
            position: relative;
            margin-right: 22rpx;
            .img {
              width: 222rpx;
              height: 228rpx;
              border-radius: 11rpx;
            }
            .bgempt {
              position: absolute;
              top: 0;
              left: 0;
            }
            .opacityImg {
              opacity: 0.9;
            }
          }
          .list_r {
            ._n {
              // height: 100rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              word-wrap: break-word;
              white-space: normal !important;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .turnColor {
              color: #999999;
            }
            .line {
              display: flex;
              margin-top: 20rpx;
              margin-bottom: 14rpx;
              height: 44rpx;
              line-height: 44rpx;
              .p {
                font-size: 32rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ff5500;
              }
              .m {
                font-size: 40rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #ff5500;
                margin-right: 8rpx;
              }
              .del {
                font-size: 28rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                text-decoration: line-through;
              }
            }
            .endP {
              width: fit-content;
              height: 40rpx;
              font-size: 28rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ff2600;
              line-height: 40rpx;
              .widthAuto {
                border-radius: 4rpx;
                border: 2rpx solid #ff2600;
                padding: 4rpx 8rpx 4rpx 8rpx;
              }
            }
          }
        }
      }
      .good_list {
        display: flex;
        justify-content: flex-start;
        background: #fff;
        padding: 24rpx 10rpx 12rpx 24rpx;
        ._block {
          width: 33%;
          .box {
            height: 205rpx;
            position: relative;
            .img {
              position: absolute;
              top: 0;
              left: 0;
              width: 196rpx;
              height: 196rpx;
            }
          }

          .jf {
            width: 186rpx;
            margin-top: 10rpx;
            margin-bottom: 18rpx;
            height: 36rpx;
            font-size: 28rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ff2600;
            line-height: 36rpx;
            border-radius: 4rpx;
            border: 2rpx solid #ff2600;
            padding: 4rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .price {
            font-size: 32rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ff5500;
            padding-bottom: 10rpx;
            width: 196rpx;
            text-align: center;
          }
        }
      }
    }
    .recommed {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin: 0rpx auto 32rpx auto;
      flex-wrap: wrap;
      padding-bottom: 32rpx;
      ._block {
        background: #ffffff;
        border-radius: 16px;
        width: 332rpx;
        margin-bottom: 25rpx;
        position: relative;
        .icon {
          width: 332rpx;
          height: 340rpx;
          border-radius: 16rpx;
          &.bgempt {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        .name {
          height: 97rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          margin-top: 18rpx;
          margin-left: 18rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .jf {
          margin-left: 18rpx;
          width: fit-content;
          padding-right: 12rpx;
          height: 48rpx;
          border-radius: 4rpx;
          border: 2rpx solid #ff2600;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ff2600;
          margin-top: 50rpx;
          line-height: 48rpx;
          padding-left: 10rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        ._p {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff5500;
          margin: 8rpx 0;
          margin-left: 18rpx;
          display: flex;
          height: 50rpx;
          line-height: 50rpx;
          .getPrice {
            font-size: 28rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ff5500;
          }
        }
      }
    }
  }
  .top-layout {
    position: fixed;
    right: 30rpx;
    bottom: 80rpx;
    z-index: 1000;
    .menu {
      position: relative;
      width: 75rpx;
      height: 75rpx;
      border-radius: 50%;
      margin-top: 20rpx;
      background-color: rgba(0, 0, 0, 0.3);
      border: none;
      text-align: center;
      line-height: 90rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      &:after {
        border: none;
      }
      .icon {
        // @include middle-center();
      }
      .icon-top {
        width: 33rpx;
        height: 41rpx;
      }
      .icon-service {
        width: 49rpx;
        height: 49rpx;
      }
    }
  }
}
</style>
