<template>
	<div>
		<navigation-bar :alpha="1">
		  <view slot="title1">
		    <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
		      <image class="icon-desc"
		      @click="goHome"
		             src="http://192.168.1.187:10088/static/supermarket/icon-index.png"
		             mode="scaleToFill" />
		      <!-- <text class="icon-desc" @click="handleComplete">完成</text> -->
		
		      <text class="navigation-bar__title fs-44 c-black flex-1">
		        支付
		      </text>
		    </view>
		  </view>
		</navigation-bar>
		<view class="show-pay-code">
		    <view class="text_loading">{{text[loading]}}</view>
		    <button open-type="launchApp" app-parameter="wechat" class="agree-button  c-white"
		      type="primary" @click="goHome">点击返回</button>
		  </view>
	</div>
  </template>
<script>
import api from '@/apis/index.js'
import NavigationBar from '@/components/common/navigation-bar.vue';
export default {
  components: { NavigationBar },
  data() {
    return {
      url: '2',
      weixin_code: '',
      opentId: '',
      alipay_id: '',
      formData: {},
      text: { 1: '支付中...', 2: '支付成功', 3: '支付未完成' },
      loading: 1
    }
  },
  onLoad(e) {
    if (e.appData) {
      this.formData = JSON.parse(e.appData)
    } else {
      this.formData = JSON.parse(decodeURIComponent(e.info))
    }
    if (this.formData.payment == 2) {
      // alipay
      this.alipay_pay()
    } else if (this.formData.payment == 3) {
      this.weixin_pay()
    }
  },
  onShow() {

  },
  methods: {
	  
    goHome() {
      if (this.formData.phoneType == 'android' || this.formData.phoneType == 'ios') {

      } else {
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }
    },

    async alipay_pay() {
      uni.showLoading({ title: '加载中' })
      my.getAuthCode({
        scopes: ['auth_base'],
        success: (res) => {
          if (res.authCode) {
            console.log('====支付宝---', res.authCode)
            api.getALIUserIdByCode({
              data: res.authCode,
              success: async (data) => {
                console.log('====预下单data支付宝-----', data)
                const params = {
                  orderNo: this.formData.orderId,
                  productName: this.formData.supermarketName, // TODO 此时传入的品牌名称
                  paymentAmount: this.formData.payAmount,
                  userId: data,
                  channel: 'ALI_PUB'
                }
                const prePay = await this.toPaymentR(params)
                my.tradePay({
                  tradeNO: prePay.trade_no,
                  success: (res) => {
                    console.log('=====cg支付结果---', res)
                    uni.hideLoading()
                    if (res.resultCode === '6001') {
                      // 支付未完成
                      if (this.formData.orderSource === 0) {
                        // 优惠买单
                        uni.reLaunch({
                          url: '/pages/index/index'
                        })
                      } else {
                        this.loading = 3
                        const url = `https://api.hpgjzlinfo.com/#/checkstand?cashId=${this.formData.orderId}`
                        uni.navigateTo({
                          url: `/pages/common/webpage?url=${url}`
                        })
                      }
                      return
                    }
                    // 支付成功 9000
                    this.loading = 2
                    const params = {
                      orderNo: this.formData.orderId,
                      channel: 'ALI_PUB'
                    }
                    if (this.formData.phoneType == 'android' || this.formData.phoneType == 'ios') {

                    } else {
                      this.resultSkipUrl(params)
                    }
                  },
                  fail: (res) => {
                    uni.hideLoading()
                    this.loading = 3
                    console.log('=====未完成支付结果---', res)
                  }
                })
              }
            })
          }
        }
      })
    },
    async weixin_pay() {
      uni.showLoading({ title: '加载中' })
      wx.login({
        success: (res) => {
          if (res.code) {
            api.getOpenIdByCode({
              data: res.code,
              success: async (openid) => {
                const params = {
                  orderNo: this.formData.orderId,
                  productName: this.formData.supermarketName,
                  paymentAmount: this.formData.payAmount,
                  userId: openid,
                  channel: 'WX_PUB'
                }
                const prePay = await this.toPaymentR(params)
                console.log('====6666666666666---', prePay)
                wx.requestPayment(
                  {
                    'timeStamp': prePay.timeStamp,
                    'nonceStr': prePay.nonceStr,
                    'package': prePay.package,
                    'signType': prePay.signType,
                    'paySign': prePay.paySign,
                    'success': (res) => {
                      uni.hideLoading()
                      this.loading = 2
                      const params = {
                        orderNo: this.formData.orderId,
                        channel: 'WX_PUB'
                      }
                      console.log('----支付操作---', this.formData.phoneType)
                      if (this.formData.phoneType == 'android' || this.formData.phoneType == 'ios') {

                      } else {
                        this.resultSkipUrl(params)
                      }
                    },
                    'fail': (res) => {
                      uni.hideLoading()
                      console.log('===失败---', res)
                      if (this.formData.orderSource === 0) {
                        // 优惠买单
                        uni.reLaunch({
                          url: '/pages/index/index'
                        })
                      } else {
                        this.loading = 3
                        const url = this.formData.payUrl
                        uni.redirectTo({
                          url: `/pages/common/webpage?url=${encodeURIComponent(url)}`
                        })
                      }
                    }
                  }
                )
              },
              fail: (error) => {
                uni.hideLoading()
                uni.showToast(error.message)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    async resultSkipUrl(params) {
      const result = await this.paymentStatusQuery(params)
      switch (result) {
        case 'SUCCESS':
          this.formData.type = 0
          uni.redirectTo({
            url: '/pages/pay/pay-result?payInfo=' + encodeURIComponent(JSON.stringify(this.formData))
          })
          break
        case 'PROCESS':
          uni.redirectTo({
            url: '/pages/pay/error-tip'
          })
          break
        case 'FAILURE':
          this.formData.type = 1
          uni.redirectTo({
            url: '/pages/pay/pay-result?payInfo=' + encodeURIComponent(JSON.stringify(this.formData))
          })
          break
        default:
          break
      }
    },
    // 订单状态查询
    paymentStatusQuery(params) {
      return new Promise((resolve, reject) => {
        api.paymentStatusQuery({
          data: { orderNo: params.orderNo, channel: params.channel },
          success: (res) => {
            resolve(res)
          },
          fail: (error) => {
            uni.showToast(error.message)
            reject(error)
          }
        })
      })
    },
    // 预下单
    toPaymentR(params) {
      return new Promise((resolve, reject) => {
        api.toPayment({
          data: {
            orderNo: params.orderNo,
            productName: params.productName,
            paymentAmount: params.paymentAmount,
            userId: params.userId,
            channel: params.channel
          },
          success: (data) => {
            console.log('====success---', data)
            resolve(data)
          },
          fail: (erro) => {
            console.log('====错误---', erro)
            uni.showToast(erro.message)
            reject(erro)
          }
        })
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
	.navigation-bar {
	  box-sizing: border-box;
	  padding-left: 24rpx;
	  width: 100vw;
	  height: 100%;
	  // .back-icon {
	  //   flex-shrink: 0;
	  //   width: 44rpx;
	  //   height: 44rpx;
	  //   margin-right: 48rpx;
	  //   position: relative;
	  //   z-index: 10;
	  // }
	  .icon-desc {
	    flex-shrink: 0;
	    width: 40rpx;
	    height: 40rpx;
	    // margin-left: 54rpx;
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
.web {
  margin-top: 100px;
}
.show-pay-code{
	margin-top: 179rpx;
}
.agree-button {
  width: 95%;
  // background-color: #189316;
  height: 78rpx;
  line-height: 78rpx;
  margin: 0 auto;
  font-size: 33rpx;
}
.text_loading {
  width: 100%;
  text-align: center;
  font-size: 28rpx;
  padding: 5% 0 5% 0;
  font-weight: 600;
}
</style>
