<template>
  <view class="modify-phone-number">
    <view class="tips flex-v flex-c-c p-44-0 bg-white">
      <image class="icon" mode="scaleToFill"
             src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-exclamation-mark.png" />
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
               src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png" />
      </view>
    </view>
    <view class="section flex-v">
      <view class="section-header flex-h flex-c-s">
        <text class="fs-32 c-grey ml-48">原手机号不可用</text>
      </view>
      <view class="row flex-h flex-c-b bg-white"
            @click="handleRealPersonAuthenticationClick">
        <text class="fs-36 c-black ml-48">实人认证</text>
        <image class="icon mr-32" mode="scaleToFill"
               src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png" />
      </view>
    </view>
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
      userInfo: uni.getStorageSync('userInfo'),
      showTop:false
    }
  },
  onLoad() {},
  methods: {
     /**
     * 获取用户信息 
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        api.getUserInfo({
          data: {
            accessToken: uni.getStorageSync('token'),
          },
          success: (data) => {
            resolve(data)
          },
          fail: (error) => {
            reject(error)
          },
        })
      })
    },
    async succFlag(flag){
      console.log("---1111111----")
      //TODO 进行测试
      if(flag == 1){
        const userinfor = await this.getUserInfo()
        uni.setStorageSync('userInfo', userinfor)
        this.userInfo = userinfor
        this.$refs.realpop.close()
        uni.navigateTo({url: `/pages/user-center/real-name-result2?back=${'/pages/index/index'}`})
      }
    } ,
    /**
     * 短信验证点击事件
     */
    handleSMSValidationClicK() {
      uni.navigateTo({
        url: '/pages/user-center/modify-by-phone-number?type=2',
      })
    },
    /**
     * 实人认证点击事件
     */
    handleRealPersonAuthenticationClick() {

      if (this.userInfo.crtfStas === '0') {
        // 弹出实名弹框
         this.$refs.realpop.open()
      } else {
         const params = {
          name: this.userInfo.psnName,
          idCard: this.userInfo.idCard,
          returnUrl: '',
        }
        params.success = () =>{
            //type :1实名修改；2短信验证码修改
          uni.navigateTo({
             url: '/pages/user-center/set-phone-number?type=1',
           })
        }
        startFacialRecognitionVerify(params)
      }
    }
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
