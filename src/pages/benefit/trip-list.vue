<!-- 出行旅游 -->
<template>
  <view class="trip-list">
    <view
      v-for="item in dataList"
      :key="item.rid"
      class="list-item"
      @click="goTripInfo(item)"
    >
      <image class="top-img" :src="item.tourismPic" mode="scaleToFill" />
      <view class="bot">
        <view class="title">{{ item.tourismName }}</view>
        <view class="info">
          <view class="l">
            <view class="price">
              <text>{{ item.discountAmount }}</text>
              <text class="unit">元/人</text>
              <image
                class="price-label"
                src="https://ggllstatic.hpgjzlinfo.com/static/benefit/price-label.png"
                mode="scaleToFill"
              />
            </view>
          </view>
          <view class="r">原价:{{ item.amount }}元/人</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import api from "@/apis/index.js";
import { onBeforeMount, ref } from "vue";
let dataList = ref([]);

onBeforeMount(() => {
  getList();
});

const getList = () => {
  api.getTriplist({
    data: { pageNum: 1, pageSize: 10 },
    success: (res) => {
      dataList.value = res.records;
      console.log("dataList: ", dataList);
    },
  });
};
const goTripInfo = (item) => {
  if (item.tourismId === "1") {
    uni.navigateTo({ url: `/pages/benefit/trip-info?id=${item.tourismId}` });
  }
  if (item.tourismId === "2") {
    uni.navigateTo({
      url: `/pages/benefit/trip-info-russia?id=${item.tourismId}`,
    });
  }
};
</script>
<style lang="scss" scoped>
.trip-list {
  min-height: 100vh;
  padding: 30rpx 32rpx;
  background: #f5f5f5;
  .list-item {
    width: 686rpx;
    height: 482rpx;
    background: #ffffff;
    border-radius: 16rpx;
    position: relative;
    margin-bottom: 32rpx;
    .top-img {
      width: 686rpx;
      height: 272rpx;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 16rpx;
    }
    .bot {
      position: absolute;
      top: 272rpx;
      left: 0;
      padding: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title {
        width: 646rpx;
        height: 100rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 50rpx;
      }
      .info {
        width: 646rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 8rpx;
        .l {
          display: flex;
          align-items: center;
          .price {
            font-size: 48rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ff5500;
            display: flex;
            align-items: center;
            .unit {
              font-size: 32rpx;
              font-weight: 400;
              color: #999999;
              margin-left: 8rpx;
            }
            .price-label {
              width: 122rpx;
              height: 44rpx;
              margin-left: 16rpx;
            }
          }
        }
        .r {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 44rpx;
        }
      }
    }
  }
}
</style>
