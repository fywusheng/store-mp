<template>
  <view class="modify-phone-number">
    <view class="tips flex-v flex-c-c p-44-0 bg-white">
      <image class="icon" mode="scaleToFill"
             src="http://192.168.1.187:10088/static/user-center/icon-user-center-exclamation-mark.png" />
      <text class="mt-20 fs-36 fw-bold c-black">提示</text>
      <text class="text mt-12 fs-32 c-lightgrey">
        您正在进行手机号修改操作，此操作会同步修改登入账号以及短信通知预留手机号
      </text>
    </view>
    <view class="section flex-v">
      <view class="section-header flex-h flex-c-s">
        <text class="fs-32 c-grey ml-48">原手机号可用</text>
      </view>
      <view class="row flex-h flex-c-b bg-white"
            @click="handleSMSValidationClicK">
        <text class="fs-36 c-black ml-48">短信验证</text>
        <image class="icon mr-32" mode="scaleToFill"
               src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png" />
      </view>
    </view>
   <!-- <view class="section flex-v">
      <view class="section-header flex-h flex-c-s">
        <text class="fs-32 c-grey ml-48">原手机号不可用</text>
      </view>
      <view class="row flex-h flex-c-b bg-white"
            @click="handleRealPersonAuthenticationClick">
        <text class="fs-36 c-black ml-48">实人认证</text>
        <image class="icon mr-32" mode="scaleToFill"
               src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png" />
      </view>
    </view> -->
    <real-name-pop ref="realpop" :showTop="showTop"  @succFlag="succFlag" /> 
  </view>
</template>

<script>
import api from '@/apis/index.js'
import RealNamePop from '@/pages/real-name-pop/real-name-pop.vue'
import { startFacialRecognitionVerify } from '@/utils/utils.js'

export default {
  components:{RealNamePop},
  
  data() {
    return {
      userInfo: uni.getStorageSync('userLoginPhone'),
      showTop:false
    }
  },
  onLoad() {},
  methods: {
    /**
     * 短信验证点击事件
     */
    handleSMSValidationClicK() {
      uni.navigateTo({
        url: '/pages/user-center/modify-by-phone-number?type=2',
      })
    },
    
  },
}
</script>

<style lang="scss" scoped>
.modify-phone-number {
  min-height: 100vh;
  background: #fbf9f7;
  .tips {
    .icon {
      @include square(160);
    }
    .text {
      max-width: 620rpx;
    }
  }
  .section {
    &-header {
      height: 88rpx;
    }
    .row {
      height: 124rpx;
      .icon {
        @include square(48);
      }
    }
  }
}
</style>
