// 门店
<template>
  <view class="pages">
    <view class="list" v-if="list.length > 0">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="_center">
          <view class="name">{{ item.storesName }}</view>
          <view class="_time"
            >营业时间: {{ item.startTime + "--" + item.endTime }}</view
          >
          <view class="address fs-36"
            >{{ item.distance + "km" }}｜{{ item.storesAddress }}</view
          >
        </view>
        <view class="bottom">
          <view class="left" @click.stop="telClick(item)">
            <image
              class="icon-line"
              src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/tel.png"
              mode="scaleToFill"
            />
            <span class="lable">联系商家</span>
          </view>
          <view class="right" @click.stop="handleLineClick(item)">
            <image
              class="icon-line"
              src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/path.png"
              mode="scaleToFill"
            />
            <span class="lable">路线</span>
          </view>
        </view>
      </view>
    </view>
    <view class="status-box flex-v flex-c-s" v-if="showEmpty">
      <image
        class="icon-img"
        src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/no-more.png"
        mode="scaleToFill"
      />
      <view>暂无其他门店</view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 商店列表
      list: [],
      // 当前页
      pageNum: 1,
      showEmpty: false,
      // 每页size
      pageSize: 15,
      // 城市信息
      city: {},
      supplierId: "", // 店铺id
      sceneid: "",
    };
  },
  onLoad(e) {
    if (e.supplierId) {
      this.supplierId = e.supplierId;
    }
    if (e.scene) {
      this.sceneid = e.scene;
    }
    console.log("----info:", e);
    // this.city = uni.getStorageSync('supermarketCity')
    this.getStoreList();
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.pageNum = 1;
    this.list = [];
    this.getStoreList();
  },
  // 上拉加载
  onReachBottom() {
    console.log("上拉加载");
    this.getStoreList();
  },
  methods: {
    telClick(item) {
      uni.makePhoneCall({
        phoneNumber: item.storesPhone,
      });
    },
    // 门店列表
    async getStoreList() {
      // TODO 本地位置获取替换北京
      const location = uni.getStorageSync("location");
      const city = uni.getStorageSync("city");
      const params = {
        supplierId: this.supplierId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryObject: {
          cusLt: location.longitude,
          cusLat: location.latitude,
        },
      };
      const params_c = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryObject: {
          cusLt: location.longitude,
          cusLat: location.latitude,
          storesAddress: city.name,
        },
      };
      const result = await Axios.post(
        "/srm/stores/listByPageNo",
        this.sceneid ? params_c : params
      );
      if (result.code == "200") {
        const data = result.data;
        const list = data.list || [];
        if (list.length > 0) {
          this.list = this.list.concat(list);
          this.pageNum = this.pageNum + 1;
        }
        if (this.list.length == 0) {
          this.showEmpty = true;
        }
      }
    },
    // 导航事件
    handleLineClick(item) {
      const data = {
        name: item.storesName,
        longitude: item.longitude,
        latitude: item.latitude,
        distance: item.distance,
        address: item.storesAddress,
      };
      uni.navigateTo({
        url:
          "/pages/map/direction?data=" +
          encodeURIComponent(JSON.stringify(data)),
        success: (res) => {
          res.eventChannel.emit("didOpenPageFinish", data);
        },
      });
    },
  },
  filters: {
    setDistance(item) {
      const s = Number(item) / 1000;
      if (s.toFixed(3) < 1) {
        return parseInt(s * 1000) + "m";
      } else {
        return s.toFixed(1) + "km";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  min-height: 100vh;
  background-color: #f2f2f2;
  .list {
    overflow: hidden;
    .item {
      margin: 24rpx 20rpx;
      border-radius: 16rpx;
      height: auto;
      background-color: #fff;
      box-sizing: border-box;
      color: #333;
      ._center {
        padding: 24rpx 42rpx 0rpx 24rpx;
        ._time {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          margin: 24rpx 0;
        }
        .name {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
        .address {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 24rpx;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 96rpx;
        line-height: 96rpx;
        border-top: 1px solid #eeeeee;
        .left {
          width: 50%;
          border-right: 1px solid #eeeeee;
          text-align: center;
          line-height: 96rpx;
          .icon-line {
            width: 48rpx;
            height: 48rpx;
            vertical-align: text-bottom;
            margin-right: 20rpx;
          }
          .lable {
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
        .right {
          width: 50%;
          text-align: center;
          line-height: 96rpx;
          .icon-line {
            width: 48rpx;
            height: 48rpx;
            vertical-align: text-bottom;
            margin-right: 8rpx;
          }
          .lable {
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
      }
    }
  }
  .status-box {
    padding-top: 300rpx;
    .icon-img {
      width: 440rpx;
      height: 234rpx;
      margin-bottom: 24rpx;
    }
    .status-text {
      height: 50rpx;
      color: $color-grey;
    }
  }
}
</style>
