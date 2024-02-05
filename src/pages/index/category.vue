<template>
  <div class="page-category">
    <view class="panel" v-for="(top, index) in categoryList" :key="index">
      <view class="panel-header">
        <view class="left-line"></view>
        <view class="panel-header-title">{{ top.name }}</view>
      </view>
      <view class="panel-body">
        <view class="img-list">
          <view
            class="item"
            v-for="item in top.children"
            :key="item.id"
            @click="toCategory(item)"
          >
            <image
              class="icon-img"
              :src="item.iconUrl"
              mode="scaleToFill"
              @error="handleImgLoadFail(item)"
            />
            <view class="txt">{{ item.name }}</view>
          </view>
        </view>
      </view>
    </view>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import ENV from "@/config/env";

let categoryList = ref([]);

// 加载数据
onMounted(() => {
  loadData();
});

// 设定tabbar索引
onShow(() => {
  const curPages = getCurrentPages()[0];
  if (typeof curPages.getTabBar === "function" && curPages.getTabBar()) {
    curPages.getTabBar().setData({
      tabIndex: 2,
    });
  }
});

// 请求数据
async function loadData() {
  const { data, code, msg } = await Axios.post("/category/getCategoryList", {
    type: 2,
  });
  if (code === "200") {
    categoryList.value = data;
  } else {
    this.uni.showToast(msg);
  }
}

// 去列表页
function toCategory(cate) {
  uni.navigateTo({ url: `/sub-pages/index/category/main?code=${cate.code}` });
}

function handleImgLoadFail(item) {
  item.iconUrl = ENV.IMG_DEFAULT;
}
</script>

<style lang="scss" scoped>
.page-category {
  padding-bottom: 226rpx;
  .panel {
    padding: 16rpx 38rpx;
    .panel-header {
      display: flex;
      align-items: center;
      .left-line {
        margin-right: 16rpx;
        width: 8rpx;
        height: 38rpx;
        border-radius: 4rpx;
        background: #ff9500;
      }
      .panel-header-title {
        font-size: 44rpx;
        font-weight: 500;
        color: #333333;
        line-height: 60rpx;
      }
    }
    .panel-body {
      .img-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 144rpx;
          margin: 20rpx 0;
          margin-right: 30rpx;
          &:nth-child(4n) {
            margin-right: 0;
          }
          .icon-img {
            width: 120rpx;
            height: 120rpx;
            margin-bottom: 8rpx;
          }
          .txt {
            font-size: 36rpx;
            text-align: center;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
