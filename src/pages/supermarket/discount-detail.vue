<template>
  <view class="detail">
    <view class="detail-content mt-32 ml-32 mr-32 mb-64 br-16 bg-white">
      <view class="text-content">
        本栏目是由上海银商电子商务有限公司联合各大商超及品牌商共同推出的，为国家老龄服务平台app用户提供的优惠平台。
      </view>
      <view class="text-title">1、我实际支付多少钱？</view>
      <view class="text-content">
        在交易限额内，您实际扣除的金额等于您购物金额乘以对应的折扣。如在某商户购买100元的商品，折扣98折，那您实际扣除的金额为98元。
      </view>
      <view class="text-title">2.如何开具发票?发票开具的品类?</view>
      <view class="text-content">
       返回商家列表，点击右下角“订单”，找到需要开票的订单详情；在订单详情页，点击页面下方的“申请开票”功申请电子发票；发票开具内容固定为“预付卡销售与充值”，不支持开具其他品类的发票，开票金额为用户支付时的实际扣款金额；
      </view>
      <view class="text-title">3.如何查询我的交易记录?</view>
      <view class="text-content">
        返回商家列表，点击右下角“订单”或进入我的，点击“我的订单”查看交易记录，点击每一条的交易记录即可查看交易详情;
      </view>
      <view class="text-title">4.购物发生的退货，退款怎么处理?</view>
      <view class="text-content">顾客使用买单优惠购买商品后如需退货，需要持消费交易纸质凭证及退货码去商家柜台办理退货交易；退货码可在消费记录的订单详情页面中查看，对应的支付金额将退至原卡、或退新的购物卡、或直接退现金，具体以商户门店指引为准，折扣部分不予退回。</view>
      <view class="text-title">5.为什么之前**商户折扣为97折，今天变为98折了?</view>
      <view class="text-content-special">商户折扣以当前页面为准。</view>

      <view class="text-p mt-20 mb-20">该服务由上海银商电子商务有限公司提供，中国银联仅提供使用渠道，用户在使用的过程中，如有任何疑问请联系上海银商电子商务有限公司。</view>
      <view class="text-p">客服电话4000-610-600，工作日:(9:00-17:00)</view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  onLoad() {},
  methods: {},
}
</script>

<style  lang="scss" scoped>
.detail {
  background-color: #f2f2f2;
  overflow: hidden;
  &-content {
    padding: 30rpx 22rpx 32rpx 24rpx;
    .text-content {
      color: #333;
      font-size: 36rpx;
      line-height: 60rpx;
      text-indent: 3em;
      text-align: justify;
    }
    .text-title {
      color: #333;
      font-size: 40rpx;
      line-height: 60rpx;
      font-weight: bold;
      margin-top: 20rpx;
      margin-bottom: 20rpx;
    }
    .text-content-special {
      color: #333;
      font-size: 36rpx;
      line-height: 60rpx;
    }
    .text-p {
      font-size: 32rpx;
      color: #666666;
      line-height: 60rpx;
      text-align: justify;
    }
  }
}
</style>