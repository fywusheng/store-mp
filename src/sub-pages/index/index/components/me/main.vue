<style lang="scss">
  @import "~@/styles/base";

  body {
    padding-bottom: rpx(50);
    // background-color: $extra-light-gray;
  }
  .app {
    background: #F2F2F2;
  }

  .top-banner {
    padding: rpx(20) rpx(16);
    background-color: #fff;
    position: relative;

    .user-info {
      position: relative;
      padding: rpx(36);
      box-sizing: border-box;
      height: rpx(280);
      width: rpx(718);
      background: url(https://ggllstatic.hpgjzlinfo.com/static/images/me/face-bg.png) center no-repeat;
      background-size: cover;
      color: #fff;
      border-top-left-radius: rpx(16);
      border-top-right-radius: rpx(16);
      display: flex;
      align-items: center;

      .user-name {
        padding-left: rpx(25);
        font-size: rpx(34);
        line-height: rpx(48);
        height: rpx(48);
      }

      .mobile, .login-btn {
        padding-left: rpx(124);
        font-size: rpx(24);
        line-height: rpx(33);
      }

      .login-btn {
        display: flex;
        align-content: center;
        font-size: rpx(22);

        // img {
        //   margin-top: rpx(10);
        //   margin-left: rpx(15);
        //   width: rpx(12);
        //   height: rpx(22);
        // }
      }

      .head-menu-list {
        display: flex;
        padding-top: rpx(60);

        .menu {
          flex: 1;
          font-size: rpx(20);
          line-height: rpx(28);
          text-align: center;
          image{
            width: 30rpx;
            height: 30rpx;
          }

          .value {
            font-size: rpx(30);
            line-height: rpx(42);
          }
        }
      }

      .user-icon {
        // position: absolute;
        // left: rpx(30);
        // top: rpx(40);

        .img {
          width: rpx(150);
          height: rpx(150);
          border-radius: 50%;
          @include background-image();
          background-size: cover;
          background-image: url(https://ggllstatic.hpgjzlinfo.com/static/images/me/face.png);
        }
      }
    }
    .top-bg {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 32rpx;
      background: #F2F2F2;
      border-radius: 56rpx 56rpx 0 0;
    }
  }

  .menu-list {
    margin-top: rpx(20);
    padding: 20rpx 16rpx;
    background-color: #F2F2F2;

    .menu {
      position: relative;
      height: rpx(104);
      line-height: rpx(104);
      font-size: rpx(40);
      color: #323233;
      background-color: #fff;
      text-align: left;
      padding: rpx(32) rpx(40);
      margin-bottom: 32rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 16rpx;

      .icon-right {
        width: 15rpx;
        height: 30rpx;
      }

      .contact-btn {
        height: rpx(104);
        line-height: rpx(104);
        color: #323233;
        background-color: #fff;
        text-align: left;
        font-size: 40rpx;
      }

      img {
        // position: absolute;
        // top: rpx(34);
        // right: 0;
        width: rpx(15);
        height: rpx(27);
      }
    }
  }

  .panel {
    background: #FFFFFF;
    border-radius: 16rpx;
    padding: 24rpx;
    margin: rpx(32) rpx(16);
    .panel-header {
      display: flex;
      justify-content: space-between;
      .panel-header-title {
        font-size: 36rpx;
        font-weight: 500;
        color: #333333;
        line-height: 50rpx;
        display: flex;
        align-items: center;
        &::before {
          content: "";
          display: inline-block;
          width: 8rpx;
          height: 38rpx;
          margin-right: 16rpx;
          background: #FF9500;
          border-radius: 4rpx;
        }
      }
      .panel-header-right {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        font-weight: 400;
        color: #999999;
        line-height: 44rpx;
        .panel-header-icon-right {
          width: 38rpx;
          height: 38rpx;
        }
      }
    }
    .panel-body {
      .flex-list {
        width: auto;
        display: flex;
        align-items: center;
        .item {
          width: 33.33%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 30rpx;
          .icon {
            width: 64rpx;
            height: 64rpx;
            margin-bottom: 8rpx;
          }
          .item-text {
            height: 44rpx;
            font-size: 32rpx;
            font-weight: 400;
            color: #333333;
            line-height: 44rpx;
            &.qrcode-color {
              color: #999999;
            }
          }
          .count {
            font-size: 48rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 66rpx;
            &.warn {
              color: #FF5500;
            }
          }
        }
      }
    }
  }

  .panel-header-icon-right {
    width: 15rpx;
    height: 27rpx;
  }
  .m-t-0 {
    margin-top: 0;
  }
</style>

<template>
  <div class="app">
    <div class="top-banner">
      <div class="user-info">
        <div class="user-icon">
          <div class="img" v-if="userInfo.picUrl" :style="{backgroundImage: 'url('+userInfo.picUrl+')'}"></div>
          <div class="img" v-else></div>
        </div>
        <div class="user-name">{{userInfo.nickName || '-'}}</div>
        <div v-if="!userInfo.phone" class="mobile" @tap="login">
          <div>尚未绑定手机号,点击绑定</div>
        </div>
        <!-- <div v-else class="mobile">{{userInfo.phone}}</div> -->
      </div>
      <view class="top-bg"></view>
    </div>


    
    <!-- 我的订单 -->
    <view class="panel m-t-0">
      <view class="panel-header">
        <view class="panel-header-title">我的订单</view>
        <view class="panel-header-right" @click="toOrder(0)">
          <view>查看全部</view>
          <image
            style="width:15rpx;height:30rpx;margin-left:6rpx"
            class="panel-header-icon-right"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/me/right.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="panel-body">
        <view class="flex-list">
          <view class="item" @click="toOrder(10)">
            <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/images/me/wait-zhifu.png" mode="" />
            <view class="item-text">待付款</view>
          </view>
           <view class="item" @click="toOrder(20)">
            <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/images/me/wait-fahuo.png" mode="" />
            <view class="item-text">待发货</view>
          </view>
           <view class="item" @click="toOrder(30)">
            <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/images/me/wait-shouhuo.png" mode="" />
            <view class="item-text">待收货</view>
          </view>
        </view>
        <view class="flex-list">
          <view class="item" @click="toOrder(40)">
            <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/images/me/wait-pingjia.png" mode="" />
            <view class="item-text">待评价</view>
          </view>
          <view class="item" @click="toOrder(999)">
            <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/images/me/shouhou.png" mode="" />
            <view class="item-text">售后服务</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 我的卡券 -->
     <view class="panel">
      <view class="panel-header" @click="toMenu('my-coupon')">
        <view class="panel-header-title">我的卡券</view>
      </view>
      <view class="panel-body">
        <view class="flex-list">
          <view class="item" @click="toMyCoupop(0)">
            <view class="count warn">{{cardStatus.unUse}}</view>
            <view class="item-text qrcode-color">未使用</view>
          </view>
           <view class="item" @click="toMyCoupop(1)">
             <view class="count">{{cardStatus.used}}</view>
            <view class="item-text qrcode-color">已使用</view>
          </view>
           <view class="item" @click="toMyCoupop(2)">
             <view class="count">{{cardStatus.expired}}</view>
            <view class="item-text qrcode-color">已过期</view>
          </view>
        </view>
      </view>
    </view>
   
    <ul class="menu-list">
      <li class="menu" @click="toAddress">
        收货地址
        <img class="icon-right" src="https://ggllstatic.hpgjzlinfo.com/static/images/me/right.png">
      </li>
      <!-- <li class="menu" @click="toMenu('my-point')">
        我的积分
        <img class="icon-right" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/right.png">
      </li> -->
      <li class="menu" @click="toMenu('my-collect')">
        收藏关注
        <img class="icon-right" src="https://ggllstatic.hpgjzlinfo.com/static/images/me/right.png">
      </li>
      <li class="menu">
        <button class="contact-btn" open-type="contact"> 联系客服</button>
        <img class="icon-right" src="https://ggllstatic.hpgjzlinfo.com/static/images/me/right.png">
      </li>
      <!-- <li class="menu" @click="toTopic('help_app')">
        帮助中心
        <img class="icon-right" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/right.png">
      </li> -->
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'USER_CENTER',
    data() {
      return {
        userInfo: {},
        points: 0,
        balance: 0,
        orderResult: {},
        cardStatus: {
          expired: 0,
          unUse: 0,
          used: 0
        }
      }
    },
    computed: {
      isLogin(){
        return Store.getters.isLogin;
      }
    },
    components: {},
    methods: {
      toMyCoupop(status) {
        uni.navigateTo({
          url: `/sub-pages/me/my-coupon/main?status=${status}`
        })
      },
      toAddress() {
        wx.navigateTo({
          url: '/sub-pages/me/address-list/main?type=2'
        })
      },
      toHome() {
        XIU.bridge.goHome()
      },
      toTopic(id) {
        XIU.bridge.goTopic(id)
      },
      login() {
        wx.navigateTo({
          // url: '/sub-pages/index/login/main''
        })
      },
      toOrder(status) {
        if(status === 999){
          wx.navigateTo({
            url: '/sub-pages/me/refund-list/main'
          })
        }else{
          wx.navigateTo({
            url: '/sub-pages/me/order-list/main?status=' + status || 0
          })
        }
      },
      toMenu(name) {
        if(!Store.getters.isLogin){
          wx.navigateTo({
           // url: '/sub-pages/index/login/main''
          })
          return false;
        }
        wx.navigateTo({
          url: `/sub-pages/me/${name}/main`
        })
      },
    },
    async created() {
      if(!Store.getters.isLogin){
        await Store.dispatch('login')
      }
      const orderResult = await Axios.post('/order/get.count')
      if (orderResult.code == 200) {
        this.orderResult = orderResult.data;
      }
      const result = await Axios.post('/member/get.userinfo', {}, {
        headers: {
          'content-type': 'application/json;charset=utf-8',
        }
      })
      if (result.code == 200) {
        this.userInfo = result.data;
      }
      const pointResult = await Axios.post('/member/points.accumulation')
      if (pointResult.code == 200) {
        this.points = pointResult.data.points;
      }
      const cardStatusResult = await Axios.post('/coupon/count', {
        pageNum: 1,
        pageSize: 100,
        queryObject: {
          sessionId: uni.getStorageSync('sessionId')
        }
      })
      this.cardStatus = cardStatusResult.data

      // const walletAccount = await Axios.post('/member/wallet/getTotalBalance')
      // if (walletAccount.code == 200) {
      //   this.balance = walletAccount.data.balance;
      // }
    }
  }
</script>
