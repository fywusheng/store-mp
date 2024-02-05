<template>
  <view class="feature-service">
    <view class="bg"></view>
    <view class="card">
      <panel-card :show-header="false">
        <view class="top">健康管理</view>
        <view class="labels">
          <view v-for="(label, index) in labelList" :key="index" class="label-item">
            {{ label }}
          </view>
        </view>
        <view class="cont">
          建立并维护健康档案,由多学科团队为长辈进行定期评估,在健康状况发生变化时进行即时评估,根据评估结果制订或调整服务方案。为长辈组织每月健康教育讲座、不定期的义诊咨询、常态化的健康养生知识宣传栏等活动,宣导包括营养、运动、康复、慢病、心理等方面的健康知识。社区为居民提供健康体检与疫苗注射服务。通过慢病小组、健康讲座、定制服务等形式为长辈提供慢病管理宣教和指导。
        </view>
      </panel-card>
    </view>
    <view class="footer">
      <button class="btn">电话咨询/预约</button>
    </view>
  </view>
</template>
<script>
  // import api from '@/apis/index.js'
  export default {
    data() {
      return {
        labelList: [
          '健康档案',
          '有咖啡厅',
          '失能照料',
          '失能照料',
          '失能照料',
          '失能照料',
          '失能照料'
        ]
      }
    },
    created() {},
    onLoad() {},
    methods: {}
  }
</script>
<style lang="scss" scoped>
  .feature-service {
    position: relative;
    padding-top: 48rpx;
    padding-bottom: 176rpx;
    background: #f5f5f5;
    min-height: 100vh;
    font-family: PingFangSC-Medium, PingFang SC;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100vw;
      height: 514rpx;
      background: linear-gradient(
        180deg,
        #ffe3d5 0%,
        rgba(255, 229, 216, 0.93) 51%,
        rgba(255, 255, 255, 0) 100%
      );
    }
    .card {
      width: 686rpx;
      position: relative;
      z-index: 2;
      margin: 0 auto;
      margin-bottom: 32rpx;
    }
    .top {
      display: flex;
      align-items: center;
      font-size: 40rpx;
      font-weight: 500;
      color: #333333;
      margin-bottom: 20rpx;
    }

    .labels {
      display: flex;
      align-items: center;
      margin-bottom: 26rpx;
      flex-wrap: wrap;
      .label-item {
        height: 48rpx;
        border-radius: 4rpx;
        padding: 4rpx 8rpx;
        box-sizing: border-box;
        text-align: center;
        border: 2rpx solid #ff2600;
        color: #ff2600;
        margin-right: 16rpx;
        margin-bottom: 20rpx;
        flex-shrink: 0;
        &:last-child {
          margin-right: 0;
        }
      }
    }

    .cont {
      font-size: 32rpx;
      font-weight: 400;
      color: #333333;
      line-height: 44rpx;
    }

    .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100vw;
      height: 176rpx;
      background: #ffffff;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      .btn {
        width: 686rpx;
        height: 108rpx;
        line-height: 108rpx;
        background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
        border-radius: 54rpx;
        color: #ffffff;
        font-weight: 500;
        font-size: 44rpx;
      }
    }
  }
</style>
