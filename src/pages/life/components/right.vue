<template>
  <view class="hotel_top">
    <view class="menuBar">
      <view @click="selectItem(1)"
        >{{ cityName
        }}<image
          class="triangle-icon ml-12"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-triangle-downward-black.png"
      /></view>
      <view @click="selectItem(2)"
        >{{ eatName
        }}<image
          class="triangle-icon ml-12"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-triangle-downward-black.png"
      /></view>
      <view @click="selectItem(3)"
        >{{ weekName
        }}<image
          class="triangle-icon ml-12"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-triangle-downward-black.png"
      /></view>
    </view>
    <view class="hotel">
      <view v-if="list.length > 0">
        <view
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click.stop="goDetail(item)"
        >
          <view class="top">
            <view class="img_qy">
              <image :src="item.hotelPhoto" class="bgimg" mode="scaleToFill" />
            </view>
            <view class="top_c">
              <view class="name">{{ item.hotelName }}</view>
              <view class="price">
                <view>{{ item.address }}</view>
                <view class="right" @click.stop="goMap(item)">
                  <view class="li">|</view>
                  <view class="icon"
                    ><image
                      class="im"
                      src="https://ggllstatic.hpgjzlinfo.com/static/life/micon.png"
                      mode="scaleToFill"
                  /></view>
                  <view class="m">地图</view>
                </view>
              </view>
            </view>
          </view>
          <view
            class="item_bottom"
            v-for="(items, index) in item.hotelDTOList"
            :key="index"
          >
            <view class="line">
              <view class="name">餐厅名</view>
              <view class="addres_name">{{ items.hotelName }}</view>
            </view>
            <view class="line">
              <view class="name">餐段</view>
              <view class="addres_name">{{ items.eatTime }}</view>
            </view>
            <view class="line">
              <view class="name">适用星期</view>
              <view class="addres_name">{{ items.canUseTime }}</view>
            </view>
          </view>
        </view>
      </view>
      <block v-else>
        <view class="flex-v flex-c-c status-box2" v-if="loading === 1">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/common/business_loading.gif"
            mode="scaleToFill"
          />
        </view>

        <view class="flex-v flex-c-c status-box3" v-else>
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/common/status-none2x.png"
            mode="scaleToFill"
          />
          <view class="flex-c-c status-text">暂无适用酒店数据</view>
        </view>
      </block>
    </view>
    <uni-popup ref="notice" :maskClick="maskClick" type="bottom">
      <view class="panel">
        <view class="line_top">
          <view class="cancel" @click="cancel">取消</view>
          <view class="title">{{ showListValue.title }}</view>
          <view class="confirm" @click="confirm">确定</view>
        </view>
        <view v-if="type == 1" class="content">
          <view
            class="item"
            :class="{ colorItem: cityA == item.cityCode ? true : false }"
            @click="itemClick(item.cityCode, 1, item.cityName)"
            v-for="(item, index) in showListValue.selectList"
            :key="index"
            >{{ item.cityName }}</view
          >
        </view>
        <view v-if="type == 2" class="content">
          <view
            class="item"
            :class="{ colorItem: Bvalue == item.eatTime ? true : false }"
            @click="itemClick(item.eatTime, 2, item.eatTime)"
            v-for="(item, index) in showListValue.selectList"
            :key="index"
            >{{ item.eatTime }}</view
          >
        </view>
        <view v-if="type == 3" class="content">
          <view v-if="false">{{ demoType }}</view>
          <view
            class="item"
            :class="{ colorItem: resultMap[item] == 1 ? true : false }"
            @click="itemClick(item, 3, weekmap[item])"
            v-for="(item, index) in showListValue.selectList"
            :key="index"
            >{{ weekmap[item] }}</view
          >
          <view class="kong"></view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
export default {
  components: { uniPopup },
  data() {
    return {
      maskClick: false,
      name: "",
      loading: 1,
      selectType: "",
      cityName: "全部城市",
      eatName: "全部餐段",
      weekName: "全部星期",
      cityArray: [],
      eatTimeArray: [],
      result: [], // 单选结果
      resultMap: { all: 1 }, // 多选结果  this.selectType == 1 ? '' : (this.selectType == 2 ? '全部餐段' : 'all'),
      clickValue: "",
      demoType: "",
      type: 1,
      list: [],
      diskObject: {},
      showListValue: {},
      latitude: "",
      longitude: "",
      cityA: "",
      Bvalue: "全部餐段",
      weekmap: {
        all: "全部星期",
        Mon: "星期一",
        Tues: "星期二",
        Wed: "星期三",
        Thur: "星期四",
        Fri: "星期五",
        Sat: "星期六",
        Sun: "星期日",
      },
    };
  },
  props: {
    hotelDiscountId: {
      type: String,
      default: "",
    },
  },
  created() {
    this.getHotelDic();
    uni.getLocation({
      type: "gcj02",
      success: (res) => {
        this.latitude = res.latitude;
        this.longitude = res.longitude;
        this.dynamicQuery();
      },
      fail: (err) => {
        this.$uni.showToast(err);
      },
    });
  },
  methods: {
    goDetail(item) {
      const params = {
        address: item.address,
        hotelName: item.hotelName,
        hotelPhoto: item.hotelPhoto,
        lat: item.lat,
        lon: item.lon,
        distance: item.distance,
      };
      uni.redirectTo({
        url:
          "/pages/life/hotelHomeDetail?params=" +
          `${encodeURIComponent(JSON.stringify(params))}`,
      });
    },
    goMap(item) {
      const params = {
        name: item.hotelName,
        longitude: item.lon - 0,
        latitude: item.lat - 0,
        distance: item.distance,
        address: item.address,
        hotelPhoto: item.hotelPhoto,
      };
      uni.navigateTo({
        url:
          "/pages/life/mapShow?params=" +
          `${encodeURIComponent(JSON.stringify(params))}`,
      });
    },
    cancel() {
      this.result = [];
      // this.resultMap = {}
      this.$refs.notice.close();

      switch (this.type) {
        case 1:
          this.cityA = uni.getStorageSync("title");
          break;
        case 2:
          this.Bvalue = uni.getStorageSync("title");
          break;
        case 3:
          this.resultMap = uni.getStorageSync("title");
          break;
          return;
      }
    },
    confirm() {
      let week_name = "";
      const keys = Object.keys(this.resultMap);
      const end_keys = keys.filter((key, index) => {
        return this.resultMap[key] == 1;
      });
      if (end_keys.length === 1) {
        week_name = this.weekmap[end_keys[0]];
      } else {
        week_name = this.weekmap[end_keys[0]] + "...";
      }
      switch (this.type) {
        case 1:
          this.cityName = this.name;
          break;
        case 2:
          this.eatName = this.name;
          break;
        case 3:
          this.weekName = week_name;
          break;
          return;
      }
      this.dynamicQuery();
      this.$refs.notice.close();
    },
    itemClick(itemType, type, name) {
      this.selectType = type;
      this.name = name;
      this.demoType = itemType;
      if (type === 3) {
        // 多选择情况
        if (itemType == "all") {
          this.resultMap = {};
          this.resultMap[itemType] = 1;
          return;
        }
        if (!this.resultMap[itemType]) {
          this.resultMap[itemType] = 1;
          this.resultMap["all"] = 0;
        } else {
          this.resultMap[itemType] = 0;
          this.resultMap["all"] = 0;
        }
      } else {
        // 单选择情况
        if (!this.result.includes(itemType)) {
          this.clickValue = itemType;
          type == 1 ? (this.cityA = itemType) : (this.Bvalue = itemType);
          this.result = [];
          this.result.push(itemType);
        } else {
          this.result = [];
          this.clickValue = "";
          type == 1 ? (this.cityA = "") : (this.Bvalue = "");
        }
        type == 1
          ? (this.cityArray = this.result)
          : (this.eatTimeArray = this.result);
      }
    },
    selectItem(type) {
      this.type = type;
      const params = {
        1: {
          title: "城市选择",
          selectList: this.diskObject.cityDic,
          stashValue: this.cityA,
          name: this.cityName,
        },
        2: {
          title: "餐段",
          selectList: this.diskObject.locationDic,
          stashValue: this.Bvalue,
          name: this.eatName,
        },
        3: {
          title: "选择星期",
          selectList: this.diskObject.weekdayDic,
          stashValue: this.resultMap,
          name: this.weekName,
        },
      };
      this.showListValue = params[type];
      uni.setStorageSync("title", params[type]["stashValue"]);
      this.name = params[type]["name"];
      this.$refs.notice.open();
    },
    // 字典
    getHotelDic() {
      api.getHotelDic({
        data: { hotelDiscountId: this.hotelDiscountId },
        success: (res) => {
          const cityDic = res.cityDic;
          const locationDic = res.locationDic;
          const weekdayDic = res.weekdayDic;
          cityDic.unshift({ cityName: "全部城市", cityCode: "" });
          locationDic.unshift({ eatTime: "全部餐段" });
          weekdayDic.unshift("all");
          this.diskObject.cityDic = cityDic;
          this.diskObject.locationDic = locationDic;
          this.diskObject.weekdayDic = weekdayDic;
        },
        fail: (res) => {},
      });
    },
    dynamicQuery() {
      const keys = Object.keys(this.resultMap);
      this.cityCode = this.cityArray.length > 0 ? this.cityArray[0] : "";
      this.eatTime = this.eatTimeArray.length > 0 ? this.eatTimeArray[0] : "";
      if (keys.length > 0) {
        const keyArray = keys.filter((key, i) => {
          return this.resultMap[key] == 1;
        });
        this.canUseTime = keyArray.join(",");
      } else {
        this.canUseTime = "";
      }
      api.dynamicQuery({
        data: {
          hotelDiscountId: this.hotelDiscountId,
          cityCode: this.cityCode,
          eatTime: this.eatTime == "全部餐段" ? "" : this.eatTime,
          canUseTime: this.canUseTime == "all" ? "" : this.canUseTime,
          lat: this.latitude,
          lon: this.longitude,
        },
        success: (res) => {
          this.list = res;
          if (this.list.length == 0) {
            this.loading = 2;
          }
        },
        fail: (res) => {},
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.status-box2 {
  height: 100vh;
  background-color: #fff;
  image {
    width: 160rpx;
    height: 160rpx;
  }
}
.status-box3 {
  background-color: #fff;
  height: 100vh;
  image {
    width: 440rpx;
    height: 270rpx;
    margin-bottom: 24rpx;
  }
}
.panel {
  .line_top {
    height: 122rpx;
    line-height: 122rpx;
    display: flex;
    justify-content: space-between;
    padding-left: 30rpx;
    padding-right: 30rpx;
    .title {
      font-size: 44rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .cancel {
      font-size: 40rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
    .confirm {
      font-size: 40rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff5500;
    }
  }
  .content {
    padding: 40rpx 34rpx 40rpx 34rpx;
    display: flex;
    justify-content: space-around;
    max-height: 500rpx;
    overflow: auto;
    flex-wrap: wrap;
    text-align: center;
  }
  .item {
    border: 2rpx solid #f2f2f2;
    width: 200rpx;
    height: 66rpx;
    line-height: 66rpx;
    background: #f2f2f2;
    border-radius: 33rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    margin-bottom: 44rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-wrap: break-word;
    white-space: normal !important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .kong {
    width: 200rpx;
  }
  .colorItem {
    background: rgba(255, 85, 0, 0.1);
    border-radius: 33rpx;
    border: 2rpx solid #ff5500;
    font-weight: 400;
    color: #ff5500;
  }
}
.hotel_top {
  .menuBar {
    height: 65rpx;
    width: 100%;
    background-color: #fff;
    font-size: 36rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    display: flex;
    justify-content: space-around;
    color: #333333;
    .triangle-icon {
      @include size(18, 12);
      margin-bottom: 2rpx;
    }
  }
}
.hotel {
  background-color: #f2f2f2;
  padding-top: 32rpx;
  // height:100vh;
  .item {
    background: #ffffff;
    box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 16rpx;
    padding: 24rpx 24rpx 5rpx 24rpx;
    margin: 0rpx 32rpx 32rpx 32rpx;
    position: relative;
    .top {
      display: flex;
      justify-content: flex-start;
      .img_qy {
        width: 136rpx;
        height: 112rpx;
        margin-right: 18rpx;
        .bgimg {
          width: 100%;
          height: 100%;
        }
      }
      .top_c {
        display: flex;
        flex-direction: column;
        margin-bottom: 14rpx;
        .name {
          width: 484rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          margin-bottom: 14rpx;
        }
        .price {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          width: 324rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          height: 40rpx;
          line-height: 40rpx;
          .right {
            display: flex;
            position: absolute;
            right: 20rpx;
            top: 83rpx;
            width: 150rpx;
            justify-content: space-around;
            .li {
              width: 2rpx;
              height: 26rpx;
              color: #979797;
            }
            .icon {
              width: 28rpx;
              height: 32rpx;
              .im {
                width: 100%;
                height: 100%;
              }
            }
            .m {
              font-weight: 400;
              font-size: 36rpx;
              font-family: PingFangSC-Regular, PingFang SC;
            }
          }
        }
      }
    }
    .item_bottom {
      display: flex;
      flex-direction: column;
      background: #f2f2f2;
      padding: 24rpx;
      margin-bottom: 24rpx;
      margin-top: 24rpx;
      .line {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 68rpx;
        line-height: 68rpx;
        .name {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
        }
        .addres_name {
          font-size: 32rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
    }
  }
  .status-text {
    color: #666666;
  }
}
</style>
