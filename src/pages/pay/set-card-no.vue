<template>
  <scroll-view class="set-card-no" :scroll-y="canScrollY">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <text class="icon-desc" @click="handleDone">完成</text>
          <text class="navigation-bar__title fs-44 c-black flex-1">{{ title }}</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <text class="icon-desc" @click="handleDone">完成</text>
          <text class="navigation-bar__title fs-44 c-black flex-1">{{ title }}</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header">
      <view class="desc">系统将按如下卡片顺序展示及扣款</view>
      <view class="panel-title">
        <view class="title">银行卡</view>
        <view class="text">长按排序</view>
      </view>

      <view :scroll-y="canScrollY" class="drag-box list" :style="{ height: viewHeight + 'rpx' }">
        <view
          v-for="(item, index) in dataList"
          :key="index"
          :style="{ top: item.top + 'px', height: itemHeight - 1 + 'rpx' }"
          class="drag-item"
          :class="{ 'drag-active': item.isActive }"
          @longtap="longtap(item)"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend(item)"
        >
          <view class="list-item">
            <image class="icon-bank" :src="item.bankIcon" />
            <view class="bann-name">
              {{ item.bankName }}({{ item.bankCardNum | formatBankNum }})
            </view>
            <image class="icon-drag" :src="icon.drag" />
          </view>
        </view>
      </view>
    </view>
    <view class="page-desc">对于特殊业务有特殊规则的,将遵循业务规则扣款。</view>
  </scroll-view>
</template>

<script>
  import NavigationBar from '@/components/common/navigation-bar.vue';
  import drag from './components/drag.js';
  import api from '@/apis/index.js';
  export default {
    components: { NavigationBar },
    mixins: [drag],
    data() {
      return {
        // 结果类型 0-成功 1-失败
        resultType: 0,
        title: '设置卡片顺序',
        // 银行卡列表
        list: [],
        // iconPath
        icon: {
          success: 'http://192.168.1.187:10088/static/pay/icon-success.png',
          fail: 'http://192.168.1.187:10088/static/pay/icon-fail.png',
          drag: 'http://192.168.1.187:10088/static/pay/icon-drag.png',
        },
        // 导航栏高度
        //#ifdef MP-WEIXIN
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
        //#endif
        //#ifdef MP-ALIPAY
        navigationBarHeight:
          uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
        //#endif
        // 状态栏高度
        statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
        pageHeight: uni.getSystemInfoSync().screenHeight,
      };
    },
    onLoad(e) {
      this.getBankList();
    },
    onShow() {},
    methods: {
      // 银行列表
      getBankList() {
        api.getBankList({
          data: {},
          success: (res) => {
            console.log(res);
            let mockRes = [
              {
                recordId: '03158c14149543a29354e853b35b82a6',
                bankName: '民生银行',
                bankIcon:
                  'http://120.42.37.88:10088/nepsp-file/group1/M00/45/FF/wKgupGF45reAEFJCAAAf2PbeKz8685.png',
                bankCardNum: '12312312',
                encryptCardNum: '****7777',
              },
              {
                recordId: '21cab20a8d08413e98f3aa18dffb6b9b',
                bankName: '广厦银行',
                bankIcon:
                  'http://120.42.37.88:10088/nepsp-file/group1/M00/45/FF/wKgupGF45reAEFJCAAAf2PbeKz8685.png',
                bankCardNum: '12312312',
                encryptCardNum: '****7777',
              },
            ];
            this.list = res || mockRes;
          },
        });
      },
      // 返回上一页
      handleNavBack() {
        this.$refs.tipModal.open();
        // uni.navigateBack();
      },
      // 返回首页
      handleHomeBack() {
        uni.reLaunch({
          url: '/pages/index/index',
        });
      },
      // 完成，更新银行卡顺序
      handleDone() {
        const data = this.sortList.map((item, index) => {
          return { recordId: item.recordId, srt: index + 1 };
        });

        api.updateBankCardNo({
          data,
          success: function (res) {
            res &&
              uni.navigateTo({
                url: '/pages/pay/my-bank-card',
              });
          },
        });
      },
    },
    filters: {
      formatBankNum(bankNum) {
        return bankNum.substring(bankNum.length - 4);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .drag-box {
    width: 100%;
    position: relative;
    .drag-item {
      width: 100%;
      text-align: center;
      transition: all 0.5s;
      // background-color: #fff;
      z-index: 1;
      // border-bottom: 1rpx solid #F5F5F5;
      position: absolute;
    }
  }
  .drag-active {
    box-shadow: 0 8px 20px 0 #e6e6e6;
    transform: scale(1.1);
    z-index: 9 !important;
    transition: box-shadow 0.5s, transform 0.5s, top 0s !important;
  }
</style>
<style lang="scss" scoped>
  //scoped 在当前页生效 不影响子组件
  .drag-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    border-top: 2rpx solid #e5e5e5;
    &:last-child {
      border-bottom: 2rpx solid #e5e5e5;
    }
  }
  .set-card-no {
    // 加这两行代码是为了固定定位 解决此页面上下可滑动回弹问题
    position: fixed;
    width: 100vw;
    height: 100vh;
    .navigation-bar {
      box-sizing: border-box;
      padding-left: 24rpx;
      width: 100vw;
      height: 100%;
      .back-icon {
        flex-shrink: 0;
        width: 44rpx;
        height: 44rpx;
        margin-right: 48rpx;
        position: relative;
        z-index: 10;
      }
      .icon-desc {
        flex-shrink: 0;
        // width: 40rpx;
        // height: 40rpx;
        margin-left: 36rpx;
        position: relative;
        z-index: 10;
      }
      .desc {
        color: #666666;
      }
      .navigation-bar__title {
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
      }
      .navigation-bar__complete {
        position: absolute;
        right: 36rpx;
      }
    }
    .page-header {
      width: 100vw;
      position: relative;
      padding: 0 32rpx;
      box-sizing: border-box;
      .desc {
        margin: 40rpx 0 64rpx 0;
        font-size: 36rpx;
        color: #333333;
      }
      .panel-title {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .title {
          color: #333333;
          font-weight: 500;
          font-size: 44rpx;
        }
        .text {
          font-size: 36rpx;
          color: #666666;
        }
      }
      .drag-item {
        margin-top: 18rpx;
        .list-item {
          height: 120rpx;
          display: flex;
          align-items: center;
          width: 100%;
          .icon-bank {
            width: 48rpx;
            height: 48rpx;
            margin-right: 12rpx;
          }
          .icon-drag {
            width: 30rpx;
            height: 30rpx;
            margin-left: auto;
          }
        }
      }
    }
    .page-desc {
      color: #999999;
      font-size: 32rpx;
      margin: 26rpx 32rpx;
      padding-bottom: 200rpx;
    }
  }
</style>
