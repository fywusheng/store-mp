//我的积分
<template>
  <view class="my-points">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar title="我的积分" title-color="#ffffff"
      background-color="linear-gradient(to right, #ff8800, #ff5000)" />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar title="我的积分" title-color="#ffffff"
      background-color="linear-gradient(to right, #ff8800, #ff5000)" back-button-style="white"
      :shows-back-button="true" />
    <!-- #endif -->
    <view class="blank" style="height: 242rpx;" />
    <view class="background" />
    <view class="card br-16 bg-white m-0-32 p-24 flex-v">
      <text class="fs-36 c-black">当前可用积分</text>
      <view class="flex-h flex-c-s">
        <text class="fs-60 c-primary">{{score}}</text>
        <text class="fs-36 c-secondary ml-12" @click="handleScoreList">查看</text>
      </view>
      <!-- <view class="flex-h flex-c-e">
        <text class="fs-36 c-lightgrey">历史累计积分：</text>
        <text class="fs-36 c-black">{{fixScore}}</text>
      </view> -->
      <view class="progress-bar mt-16">
        <view class="total br-6" />
        <view class="current br-6" :style="{ width: progressBarWidth + 'rpx' }" />
      </view>
      <view class="flex-h flex-c-b mt-16">
        <text class="fs-36 c-lightgrey">0</text>
        <text class="fs-36 c-lightgrey">200</text>
        <text class="fs-36 c-lightgrey">400</text>
        <text class="fs-36 c-lightgrey">600</text>
        <text class="fs-36 c-lightgrey">800</text>
        <text class="fs-36 c-lightgrey">1000</text>
      </view>
      <image class="watermark" mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-logo-watermark.png" />
    </view>
    <view class="points-detail bg-white">
      <view class="tab-bar flex-h flex-c-s">
        <view style="font-size:44rpx;color:#333333;font-weight:bold">赚积分</view>
        <!-- <button
          class="tab animated"
          hover-class="none"
          :class="{ 'tab--selected': selectedIndex === 0 }"
          @click="handleTabClick(0)"
        >
          赚积分
        </button> -->
        <!-- <button
          class="tab animated"
          hover-class="none"
          :class="{ 'tab--selected': selectedIndex === 1 }"
          @click="handleTabClick(1)"
        >
          积分兑换
        </button> -->
        <!-- <view
          class="indicator bg-primary br-6 animated"
          :class="indicatorClass"
        /> -->
      </view>
      <view class="list" v-if="selectedIndex === 0">
        <view @click="selectUrl(item)" class="item br-16 mt-32 p-24 flex-h flex-c-b"
          v-for="(item, index) in list" :key="index"
          :class="{ 'item--finished': item.hasComplete ==='1' }">
          <image class="icon" :src="item.hasComplete ==='1'?item.doneIcon :item.taskIcon  "
            mode="scaleToFill" />
          <view class="info flex-v m-0-24 flex-1">
            <text class="fs-40 fw-500 c-black">{{ item.taskDscr }}</text>
            <text class="fs-36 c-primary mt-12">+{{ item.taskScore }} 积分</text>
          </view>
          <button class="button fs-40 c-primary br-32" hover-class="none">
            {{ item.hasComplete ==='1'  ? "已完成" : "去完成" }}
          </button>
        </view>
      </view>
      <view class="flex-h flex-c-c" v-else>
        <text class="fs-44 c-grey mt-64">
          项目建设中，敬请期待！
        </text>
      </view>
    </view>
    <real-name-pop ref="realpop" @succFlag="succFlag" :headImg="headImg"></real-name-pop>
  </view>
</template>

<script>
import NavigationBar from '../../components/common/navigation-bar.vue'
import api from '@/apis/index.js'
import RealNamePop from '@/pages/real-name-pop/real-name-pop.vue'
export default {
  components: { NavigationBar, RealNamePop },
  data() {
    return {
      headImg: '',
      clickId: '',
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // // 当前可用积分进度条宽度
      // progressBarWidth: 234,
      // 选中的下标
      selectedIndex: 0,
      // 赚积分任务列表
      list: [],
      // 可用积分
      score: '0',
      // 最高积分
      fixScore: '0'
    }
  },
  computed: {
    indicatorClass() {
      return ['indicator--left', 'indicator--right'][this.selectedIndex]
    },
    progressBarWidth() {
      // 当前可用积分进度条宽度
      return Math.ceil((this.score / 1000) * 636)
    }
  },
  onLoad() {
    this.userInfo = uni.getStorageSync('userInfo')
    // this.setData();
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo.tel) {
      this.handleScoreInfo()
    }
    this.getUserTaskInfoByPage()
  },
  methods: {
    handleNavigationBack() {
      // 导航返回处理
      uni.reLaunch({
        url: `/pages/index/index?index=4`
      })
    },
    /**
     * 获取用户信息 getUserAccount
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
    async succFlag(flag) {
      if (flag == 1) {
        const userinfor = await this.getUserInfo()
        uni.setStorageSync('userInfo', userinfor)
        this.userInfo = userinfor
        console.log('=====实名后的信息---', userinfor)
        this.$refs.realpop.close()
        const urls = { '1': '/pages/certificate/electronic-card?index=0', '2': '/pages/family-account/select-type', '3': '/pages/support/index', '6': '/pages/user-center/my-points' }
        if (!urls[this.clickId]) return
        console.log('====实名后要去的页面--', urls[this.clickId])
        // uni.navigateTo({url: urls[this.clickId]})

        uni.navigateTo({
          url: `/pages/user-center/real-name-result2?back=${urls[this.clickId]}`
        })
      }
    },
    selectUrl(item) {
      const tastId = item.taskInfoId || ''
      this.clickId = tastId

      // if (tastId == '1') {
      //   this.$uni.showToast('当前所在地区功能开通中')
      //   return
      // }
      console.log('====点击的下标---', item)
      if (item.hasComplete == 1) return
      // 1-申领老年人证  2-亲情账号 3-添加赡养抚养关系 6-实名认证
      // const urls = { '1': '/pages/certificate/electronic-card?index=0', '2': '/pages/family-account/select-type', '3': '/pages/support/index', '6': 'pages/user-center/my-points' }
      const urls = { '1': '/pages/user-center/licence', '2': '/pages/family-account/select-type', '3': '/pages/support/index', '6': 'pages/user-center/my-points' }
      if (this.userInfo.crtfStas !== '2') {
        // 未实名
        if (tastId == '6') {
          this.headImg = 'https://ggllstatic.hpgjzlinfo.com/static/common/loginAttest.png'
        } else {
          this.headImg = 'https://ggllstatic.hpgjzlinfo.com/static/common/img-real-name.png'
        }
        this.$refs.realpop.open()
        return
      }
      if (this.userInfo.crtfStas !== '0') {
        // 已实名
        uni.navigateTo({ url: urls[tastId] })
      }
    },
    /**
     * tab 点击事件
     */
    handleTabClick(index) {
      if (index === this.selectedIndex) return
      this.selectedIndex = index
    },
    // 获取用户积分
    handleScoreInfo() {
      api.scoreInfo({
        data: {
          userId: this.userInfo.uactId
        },
        success: (res) => {
          console.log('用户积分：', res)
          this.score = res.score
          this.fixScore = res.fixScore
        }
      })
    },
    // 获取用户积分任务列表
    getUserTaskInfoByPage() {
      api.getUserTaskInfoByPage({
        data: {
          userId: this.userInfo.uactId,
          pageNum: 1,
          pageSize: 100
        },
        success: (res) => {
          console.log('用户积分任务列表：', res.list)
          this.list = res.list
        }
      })
    },
    /**
     * 设置数据
     */
    setData() {
      this.list = [
        {
          title: '添加亲情账号',
          points: 300,
          icon: 'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-task-2.png',
          isFinished: false
        },
        {
          title: '完善赡养扶养关系',
          points: 200,
          icon: 'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-task-1.png',
          isFinished: false
        },
        {
          title: '申领电子证照老年人证',
          points: 500,
          icon: 'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-task-0-finished.png',
          isFinished: true
        }
      ]
    },

    // 点击查看
    handleScoreList() {
      uni.navigateTo({
        url: '/pages/user-center/points-list'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-points {
  .background {
    @include size(750, 488);
    position: fixed;
    top: 0;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
  .card {
    @include size(638, 276);
    position: relative;
    box-shadow: 0 4rpx 24rpx 0 rgba(6, 6, 6, 0.12);
    z-index: 9;
    .progress-bar {
      position: relative;
      .total {
        @include size(636, 12);
        position: absolute;
        background: #e5e7e6;
      }
      .current {
        position: absolute;
        height: 12rpx;
        background: #ff2600;
      }
    }
    .watermark {
      @include size(282, 294);
      position: absolute;
      right: 0;
      bottom: 0;
      opacity: 0.75;
      z-index: -1;
    }
  }
  .points-detail {
    position: relative;
    margin-top: -112rpx;
    padding: 160rpx 32rpx 32rpx;
    border-radius: 20rpx 20rpx 0 0;
    .tab-bar {
      position: relative;
      .tab {
        @include size(200, 88rpx);
        line-height: 88rpx;
        font-size: 40rpx;
        color: $color-black;
        &--selected {
          font-size: 44rpx;
          color: $color-primary;
        }
      }
      .indicator {
        @include size(80, 12);
        position: absolute;
        bottom: 0;
        &--left {
          left: 60rpx;
        }
        &--right {
          left: 260rpx;
        }
      }
    }
    .list {
      .item {
        @include size(638, 168);
        box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.12);
        .icon {
          @include square(168);
        }
        .info {
          height: 100%;
        }
        .button {
          @include size(158, 64);
          line-height: 64rpx;
          border: 2rpx solid $color-primary;
          box-sizing: border-box;
        }
        &--finished {
          text {
            color: $color-lightgrey;
          }
          .button {
            color: $color-lightgrey;
            border: 2rpx solid $color-lightgrey;
          }
        }
      }
    }
  }
}
</style>
