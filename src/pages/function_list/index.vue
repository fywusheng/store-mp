<!-- author by liushuag -->
<!-- date:2.15 -->
<!-- update:3.8 -->
<template>
  <view class="main_content">
    <!-- 门店管理-功能列表 -->
    <view class="top">
      <view class="zt_icon">{{ storeInfo.storeSatus == 1 ? '合作中' : '已到期' }}</view>
      <!-- <image src="http://192.168.1.187:10088/static/store-mp/zt-bg.png" mode="widthFix" class="zt_icon"></image> -->
      <view class="main">
        <view class="title">{{ storeInfo.storeName || '' }}</view>
        <view class="date">{{ storeInfo.periodEndValidity || '' }}合作到期</view>
        <view class="flex_r_h db_content">
          <view class="name flex_r_h">
            <image src="http://192.168.1.187:10088/static/store-mp/yg-icon.png" mode="widthFix" class="icon"></image>
            <view>
              登录员工：
              <text>{{ userInfo.name || '' }}</text>
            </view>
          </view>
          <view class="name flex_r_h">
            <image src="http://192.168.1.187:10088/static/store-mp/dz-icon.png" mode="widthFix" class="icon"></image>
            <view>
              店长：
              <text>{{ storeInfo.storeManagerName || '' }}</text>
            </view>
            <image src="http://192.168.1.187:10088/static/store-mp/dh-icon.png" mode="widthFix" class="dh_icon" @click="makeCall"></image>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom flex_r_h">
      <!-- <navigator url="/pages/order/index"  class="item">
				<view class="title">订单管理</view>
				<view class="go flex_r_h">立即前往<image src="http://192.168.1.187:10088/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="http://192.168.1.187:10088/static/store-mp/ddgl.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/store-management/user/index" class="item item3">
				<view class="title">用户管理</view>
				<view class="go flex_r_h">立即前往<image src="http://192.168.1.187:10088/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="http://192.168.1.187:10088/static/store-mp/yhgl.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/store-management/rebate/reconciliation" class="item item4">
				<view class="title">财务对账</view>
				<view class="go flex_r_h">立即前往<image src="http://192.168.1.187:10088/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="http://192.168.1.187:10088/static/store-mp/cwdz.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/activity/index" class="item item5">
				<view class="title">活动通知</view>
				<view class="go flex_r_h">立即前往<image src="http://192.168.1.187:10088/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="http://192.168.1.187:10088/static/store-mp/hdtz.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/report/index" class="item">
				<view class="title">综合报表</view>
				<view class="go flex_r_h">立即前往<image src="http://192.168.1.187:10088/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="http://192.168.1.187:10088/static/store-mp/zhbb.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/store-management/account_role/index" class="item item7">
				<view class="title">店员管理</view>
				<view class="go flex_r_h">立即前往<image src="http://192.168.1.187:10088/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="http://192.168.1.187:10088/static/store-mp/dygl.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/store-management/info/index" class="item item8">
				<view class="title">基本信息</view>
				<view class="go flex_r_h">立即前往<image src="http://192.168.1.187:10088/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="http://192.168.1.187:10088/static/store-mp/jbxx.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/user-center/message-center" class="item item9">
				<view class="title">系统提醒</view>
				<view class="go flex_r_h">立即前往<image src="http://192.168.1.187:10088/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="http://192.168.1.187:10088/static/store-mp/xttx.png" mode="widthFix" class="img"></image>
			</navigator> -->
      <!-- :url="item.path" -->
      <view
        :class="'item' + ' ' + 'item_' + item.id"
        v-for="(item, index) in functionList"
        :key="index"
        @click="goToPage(item.path, item.id)"
        v-if="item.id != 4"
      >
        <view class="title">{{ item.pemissonName }}</view>
        <view class="go flex_r_h">
          立即前往
          <image :src="staticUrl + '/store-mp/qw-icon.png'" mode="widthFix" class="icon"></image>
        </view>
        <image :src="staticUrl + item.iconUrl" mode="widthFix" class="img"></image>
      </view>
    </view>
    <view class="footer" @click="callPhone">{{ phone }}</view>
  </view>
</template>
<script>
  import api from '@/apis/index.js';
  export default {
    components: {},
    data() {
      return {
        userInfo: Store.getters.UserInfo, //登录用户信息
        storeInfo: Store.getters.StoreInfo, //门店信息
        functionList: [],
        staticUrl: '',
        phone: '400-8888-666',
        role: 1,
      };
    },
    watch: {},
    mounted() {},
    onLoad(options) {
      this.getFunctionList(options?.id);
      this.staticUrl = ENV.ASSETS;
      this.role = uni.getStorageSync('userRole');
    },
    onShow() {},
    methods: {
      //
      goToPage(path, id) {
        if (id != 8) {
          if (this.storeInfo.storeSatus == 1) {
            uni.navigateTo({
              url: path,
            });
          }
        } else {
          uni.navigateTo({
            url: path,
          });
        }
        // uni.navigateTo({
        // 	url:path
        // })
      },
      // 打电话
      makeCall() {
        uni.makePhoneCall({
          phoneNumber: this.storeInfo.contactPhone, //仅为示例
        });
      },
      callPhone() {
        uni.makePhoneCall({
          phoneNumber: this.phone, //仅为示例
        });
      },
      getFunctionList(id) {
        api.getFunctionList({
          data: {
            id: id,
          },
          success: (res) => {
            const filteredArr = res.permissonList.filter((item) => item.id != 1);
            this.functionList = filteredArr;
          },
        });
      },
    },
  };
</script>
<style>
  page {
    display: flex;
    flex-direction: column;
    height: 100%;
    /* #ifdef H5 */
    background-color: #fff;
    /* #endif */
  }
</style>
<style lang="scss">
  .flex_r_h {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .flex_c_h {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .main_content {
    width: 750rpx;
    height: 1190rpx;
    background: linear-gradient(180deg, #fe5a08 0%, rgba(254, 89, 6, 0) 100%);
    position: relative;
    .top {
      padding: 24rpx 32rpx;
      position: relative;
      .zt_icon {
        position: absolute;
        right: 32rpx;
        top: 24rpx;
        width: 120rpx;
        border-radius: 0 16rpx 0 16rpx;
        height: 50rpx;
        line-height: 50rpx;
        background: #00b47c;
        color: #ffffff;
        text-align: center;
      }
      .main {
        background: linear-gradient(180deg, #ffe6d9 0%, #ffffff 100%);
        border-radius: 16rpx;
        border: 2rpx solid #ffffff;
        padding: 28rpx 28rpx;
      }
      .icon {
        width: 28rpx;
        margin-right: 10rpx;
      }
      .dh_icon {
        width: 32rpx;
        margin-left: 10rpx;
      }
      .db_content {
        margin-top: 48rpx;
        justify-content: space-between;
        .name {
          view {
            flex: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 28rpx;
            color: #999999;
            text {
              color: #333;
            }
          }
        }
        .dz_name {
          margin-right: 5rpx;
        }
      }
      .title {
        font-size: 40rpx;
        font-weight: 500;
        color: #333;
      }
      .date {
        font-size: 24rpx;
        color: #999999;
        margin-top: 8rpx;
      }
    }
    .bottom {
      padding: 24rpx 32rpx;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        box-sizing: border-box;
        position: relative;
        width: 332rpx;
        height: 200rpx;
        padding: 32rpx;
        background: linear-gradient(180deg, #deebfe 0%, #ffffff 100%);
        border-radius: 16rpx;
        border: 2rpx solid #ffffff;
        margin-bottom: 24rpx;
        .img {
          width: 156rpx;
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
      .item_3 {
        background: linear-gradient(180deg, #e6eaff 0%, #ffffff 100%) !important;
      }
      .item_8 {
        background: linear-gradient(180deg, #e6eaff 0%, #ffffff 100%) !important;
      }
      .item_4 {
        background: linear-gradient(180deg, #ffefe0 0%, #ffffff 100%) !important;
      }
      .item_9 {
        background: linear-gradient(180deg, #ffefe0 0%, #ffffff 100%) !important;
      }
      .item_5 {
        background: linear-gradient(180deg, #dbf9ed 0%, #ffffff 100%) !important;
      }
      .item_7 {
        background: linear-gradient(180deg, #ffeff2 0%, #ffffff 100%);
      }
      .title {
        font-size: 32rpx;
        font-weight: 500;
        color: #521b00;
      }
      .go {
        font-size: 20rpx;
        color: #999999;
        margin-top: 16rpx;
        .icon {
          width: 16rpx;
          margin-left: 10rpx;
        }
      }
    }
    .footer {
      width: 100vw;
      text-align: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #303133;
      line-height: 34rpx;
      font-style: normal;
      margin-top: 124rpx;
      margin-bottom: 100rpx;
    }
  }
</style>
