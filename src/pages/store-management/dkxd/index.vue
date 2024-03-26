<!-- author by liushuag -->
<!-- date：2.14 -->
<template>
  <view class="index_content">
    <!-- 代客下单-客户关联 -->
    <image
      src="http://192.168.1.187:10088/static/store-mp/index_bg.png"
      mode="widthFix"
      class="bg_img"
    />
    <view class="main">
      <view class="top">
        <view class="info flex_r_h">
          <view class="shp_name">{{ storeInfo.storeName || ''}}</view>
          <view class="shp_tag">{{ storeInfo.storeSatus == 1 ? '合作中' : '已到期' }}</view>
          <view class="shp_date">{{ storeInfo.periodEndValidity || ''}}到期</view>
        </view>
        <image
          src="http://192.168.1.187:10088/static/store-mp/set-icon.png"
          mode="widthFix"
          class="set_img"
          @click="setAccout"
        />
      </view>
      <view class="dl_info flex_r_h">
        <view class="info flex_r_h">
          <view class="yg_name">登录员工 ： {{ userInfo.name || ''}}</view>
          <view class="h-icon">|</view>
          <view class="">店长：{{ storeInfo.corporateAccount || ''}}</view>
        </view>
        <image
          src="http://192.168.1.187:10088/static/store-mp/call-icon.png"
          mode="widthFix"
          class="set_img"
          @click="makeCall"
        />
      </view>
      <view class="xs_count_content">
        <image
          src="http://192.168.1.187:10088/static/store-mp/dk_cbg.png"
          mode="widthFix"
          class="xs_bg_img"
        />
        <view class="content">
          <view class="input_content flex_r_h">
            <input placeholder="手机号或身份证号" placeholder-class="placeh" v-model="mobile" />
          </view>
          <view class="confirm-btn" @click="customLogin">确定</view>
        </view>
      </view>
      <!-- 门店客户订单管理-->
      <navigator url="/pages/order/kh_order" class="md_main flex_r_h">
        <image
          src="http://192.168.1.187:10088/static/store-mp/mddd_icon.png"
          mode="widthFix"
          class="icon_img"
        />
        <view>门店客户订单管理</view>
      </navigator>
    </view>
    <view class="footer">门店支持电话：400-8888-666</view>
    <!-- 门店客户信息展示 -->
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog
        :type="msgType"
        cancelText="取消下单"
        confirmText="代客下单"
        title=" "
        content=" "
        @confirm="dkOrder"
        @close="dialogClose"
      >
        <view class="row slot-content">
          <view class="col flex_r_h">
            <view class="left">姓名:</view>
            <view class="right">{{ kgUserInfo.psnName }}</view>
          </view>
          <view class="col flex_r_h">
            <view class="left">电话:</view>
            <view class="right">{{ kgUserInfo.phone }}</view>
          </view>
          <view class="col flex_r_h">
            <view class="left">类型:</view>
            <view class="right">{{ kgUserInfo.type }}</view>
          </view>
          <view class="col flex_r_h">
            <view class="left">所属门店:</view>
            <view class="right">{{ storeInfo.storeName }}</view>
          </view>
          <view class="col flex_r_h">
            <view class="left">门店编号:</view>
            <view class="right">{{ storeInfo.storeNo }}</view>
          </view>
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>
<script>
  import api from '@/apis/index.js';
  import { validatePhoneNumber } from '@/utils/validation.js';
  export default {
    components: {},
    data() {
      return {
        mobile: '',
        userInfoShow: true,
        userInfo: Store.getters.UserInfo, //登录用户信息
        storeInfo: Store.getters.StoreInfo, //门店信息
        kgUserInfo: null,
      };
    },
    watch: {},
    methods: {
      // 账号设置
      setAccout() {
        uni.navigateTo({
          url: '/pages/user-center/setting',
        });
      },
      // 打电话
      makeCall() {
        uni.makePhoneCall({
          phoneNumber: '114', //仅为示例
        });
      },
      // 代客下单 用户查询登录
      customLogin() {
        if (!this.mobile) {
          this.$uni.showToast('请输入手机号');
          return;
        }
        if (!validatePhoneNumber(this.mobile)) {
          this.$uni.showToast('手机号格式错误，请重新输入');
          return;
        }
        api.customLogin({
          data: {
            mobile: this.mobile,
            storeNo: uni.getStorageSync('storeNo'),
          },
          success: (res) => {
            this.kgUserInfo = res;
            uni.setStorageSync('khUserInfo', res);
            Store.dispatch('setUserInfo', res);
            this.$refs.alertDialog.open();
            this.getSessionId();
          },
        });
      },
      async getSessionId() {
        const res = await Axios.post(`/user/login`, {});
        uni.setStorageSync('sessionId', res.data.sessionId);
      },

      // 代客下单 18310253558
      dkOrder() {
        uni.navigateTo({
          url: '/pages/store-management/dkxd/pro_search',
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
  .index_content {
    position: relative;
    .bg_img {
      width: 100%;
      position: absolute;
      z-index: -1;
    }
    .main {
      padding: 32rpx;
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 44rpx;
      .info {
        view {
          color: #fff;
          font-size: 24rpx;
        }
        .shp_name {
          font-size: 32rpx;
          font-weight: 500;
        }
        .shp_tag {
          padding: 2rpx 8rpx;
          border-radius: 6rpx;
          border: 1rpx solid #fff;
          margin: 0 16rpx;
        }
      }
    }
    .dl_info {
      margin-top: 24rpx;
      .info {
        margin-right: 18rpx;
        view {
          color: #fff;
          font-size: 28rpx;
        }
        .h-icon {
          margin: 0 16rpx;
        }
      }
    }
    .set_img {
      width: 40rpx;
    }
    .xs_count_content {
      margin-top: 36rpx;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .xs_bg_img {
        width: 100%;
      }
      .content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: absolute;
        top: 100rpx;
        .input_content {
          width: 622rpx;
          height: 96rpx;
          line-height: 96rpx;
          background: rgba(255, 255, 255, 0.23);
          border-radius: 48rpx;
          border: 2rpx solid #ff5500;
          input {
            color: #fff;
            font-size: 28rpx;
            padding: 10rpx 32rpx;
            flex: 1;
          }
          .placeh {
            color: #fff;
          }
        }
        .confirm-btn {
          width: 332rpx;
          height: 88rpx;
          line-height: 88rpx;
          text-align: center;
          background: linear-gradient(135deg, #ff8800 0%, #ff5500 100%);
          border-radius: 44rpx;
          color: #fff;
          font-size: 28rpx;
          margin-top: 48rpx;
        }
      }
    }
    .md_main {
      height: 148rpx;
      background: #ffffff;
      box-shadow: 0rpx 4rpx 28rpx 0rpx rgba(0, 0, 0, 0.09);
      border-radius: 16rpx;
      justify-content: center;
      .icon_img {
        width: 100rpx;
      }
      view {
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
        margin-left: 28rpx;
      }
    }
    .footer {
      position: fixed;
      bottom: 40rpx;
      text-align: center;
      width: 100%;
      font-size: 24rpx;
      color: #303133;
    }
  }
  .row {
    // padding:32rpx;
    width: 500rpx;
    .col {
      margin-bottom: 16rpx;
      color: #303133;
      font-size: 28rpx;
      font-weight: 400;
    }
    .col-100 {
      width: 100%;
    }
  }
</style>
