<template>
  <view class="filter-drawer">
    <uni-drawer ref="showRight" mode="right" :mask-click="true">
      <scroll-view class="scroll-view" scroll-y="true">
        <view class="area">
          所在区域：
          <text class="city-name">{{ city.name }}</text>
        </view>

        <view class="filter-type">
          <view class="title">床位数量</view>
          <view class="filter-items">
            <uni-grid :column="3" :showBorder="false" :square="false">
              <uni-grid-item v-for="(item, index) in typeList1" :key="index">
                <view
                  class="filter-item"
                  :class="{ active: type1 === item.value }"
                  :key="index"
                  @click="handleItemLClick(item, 'type1')"
                >
                  <text class="txt">{{ item.name }}</text>
                </view>
              </uni-grid-item>
            </uni-grid>
          </view>
        </view>
        <view class="filter-type">
          <view class="title">收费标准</view>
          <view class="filter-items">
            <uni-grid :column="3" :showBorder="false" :square="false">
              <uni-grid-item v-for="(item, index) in typeList2" :key="index">
                <view
                  class="filter-item"
                  :class="{ active: type2 === item.value }"
                  :key="index"
                  @click="handleItemLClick(item, 'type2')"
                >
                  <text class="txt">{{ item.name }}</text>
                </view>
              </uni-grid-item>
            </uni-grid>
          </view>
        </view>
        <view class="filter-type">
          <view class="title">机构类型</view>
          <view class="filter-items">
            <uni-grid :column="3" :showBorder="false" :square="false">
              <uni-grid-item v-for="(item, index) in typeList3" :key="index">
                <view
                  class="filter-item"
                  :class="{ active: type3 === item.value }"
                  :key="index"
                  @click="handleItemLClick(item, 'type3')"
                >
                  <text class="txt">{{ item.name }}</text>
                </view>
              </uni-grid-item>
            </uni-grid>
          </view>
        </view>
        <view class="filter-type">
          <view class="title">收住对象</view>
          <view class="filter-items">
            <uni-grid :column="3" :showBorder="false" :square="false">
              <uni-grid-item v-for="(item, index) in typeList4" :key="index">
                <view
                  class="filter-item"
                  :class="{ active: type4 === item.value }"
                  :key="index"
                  @click="handleItemLClick(item, 'type4')"
                >
                  <text class="txt">{{ item.name }}</text>
                </view>
              </uni-grid-item>
            </uni-grid>
          </view>
        </view>
        <view class="filter-type">
          <view class="title">特色服务</view>
          <view class="filter-items">
            <uni-grid :column="3" :showBorder="false" :square="false">
              <uni-grid-item v-for="(item, index) in typeList5" :key="index">
                <view
                  class="filter-item"
                  :class="{ active: type5 === item.value }"
                  :key="index"
                  @click="handleItemLClick(item, 'type5')"
                >
                  <text class="txt">{{ item.name }}</text>
                </view>
              </uni-grid-item>
            </uni-grid>
          </view>
        </view>
        <!-- <view class="_block"></view> -->
        <view class="footer">
          <view class="btn" @click="reset">重置</view>
          <view class="btn" @click="handleConfirm">确定</view>
        </view>
      </scroll-view>
    </uni-drawer>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type1: 0,
      type2: 0,
      type3: "",
      type4: "",
      type5: "",
      // 床位数量
      typeList1: [
        { name: "不限", value: 0 },
        { name: "50张以内", value: 1 },
        { name: "51-100张", value: 2 },
        { name: "101-200张", value: 3 },
        { name: "200以上", value: 4 },
      ],
      // 收费标准
      typeList2: [
        { name: "不限", value: 0 },
        { name: "1000以下", value: 1 },
        { name: "1001-3000", value: 2 },
        { name: "3001-6000", value: 3 },
        { name: "6001-9000", value: 4 },
        { name: "9001-12000", value: 5 },
        { name: "12000以上", value: 6 },
      ],
      // 机构类型
      typeList3: [
        { name: "不限", value: "" },
        { name: "综合养老院", value: "综合养老院" },
        { name: "社会福利中心", value: "社会福利中心" },
        { name: "养老照料中心", value: "养老照料中心" },
        { name: "老年公寓", value: "老年公寓" },
        { name: "敬老院", value: "敬老院" },
        { name: "护理院", value: "护理院" },
        { name: "养老社区", value: "养老社区" },
        { name: "其他", value: "其他" },
      ],
      // 收住对象
      typeList4: [
        { name: "不限", value: "" },
        { name: "自理", value: "自理" },
        { name: "半自理", value: "半自理" },
        { name: "不能自理", value: "不能自理" },
        { name: "特护", value: "特护" },
        { name: "专护", value: "专护" },
        { name: "失能失智", value: "失能失智" },
        { name: "其他", value: "其他" },
      ],
      // 特色服务
      typeList5: [
        { name: "不限", value: "" },
        { name: "医保定点", value: "医保定点" },
        { name: "临终关怀", value: "临终关怀" },
        { name: "接受异地", value: "接受异地" },
        { name: "试住体验", value: "试住体验" },
        { name: "医疗康复", value: "医疗康复" },
        { name: "居家养老", value: "居家养老" },
        { name: "旅居", value: "旅居" },
        { name: "其他", value: "其他" },
      ],
      city: {},
    };
  },
  mounted() {
    this.city = uni.getStorageSync("city");
  },
  methods: {
    handleConfirm() {
      this.close();
      const params = {
        bedCode: this.type1, // 床位数
        priceCode: this.type2, // 收费标准
        homeType: this.type3, // 机构类型
        residents: this.type4, // 收住对象
        distinctiveService: this.type5, // 特色服务
      };
      this.$emit("confirm", params);
    },
    reset() {
      this.type1 = 0;
      this.type2 = 0;
      this.type3 = "";
      this.type4 = "";
      this.type5 = "";
      this.handleConfirm();
    },
    handleItemLClick(item, typeName) {
      this[typeName] = item.value;
    },
    open() {
      this.$refs.showRight.open();
    },
    close() {
      this.$refs.showRight.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-drawer {
  ::v-deep .uni-drawer__content {
    width: 698rpx !important;
  }
  .scroll-view {
    height: 100%;
    width: 698rpx;
    position: relative;
    padding-bottom: 136rpx;
    .area {
      margin: 24rpx 0 32rpx 24rpx;
      height: 50rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 50rpx;
      .city-name {
        color: #ff5000;
      }
    }
    .filter-type {
      .title {
        height: 50rpx;
        font-size: 36rpx;
        font-weight: 400;
        color: #333333;
        line-height: 50rpx;
        margin: 0 24rpx;
      }
      .filter-items {
        padding: 24rpx 24rpx;
        .filter-item {
          width: 200rpx;
          height: 80rpx;
          margin: 12rpx 0;
          background: #eeeeee;
          border-radius: 40rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          &.active {
            color: #ff5500;
            font-weight: 500;
            background: rgba(255, 73, 0, 0.11);
          }
          .txt {
            width: 200rpx;
            padding: 0 22rpx;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            text-align: center;
          }
        }
      }
    }
    ._block {
      width: 100%;
      height: 136rpx;
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 136rpx;
      width: 100%;
      background: #ffffff;
      border-radius: 0rpx 0rpx 16rpx 16rpx;
      .btn {
        width: 268rpx;
        height: 80rpx;
        border: 2rpx solid #ff711a;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        &:first-child {
          border-radius: 47rpx 0 0 47rpx;
          color: #ff5500;
          line-height: 50rpx;
        }
        &:last-child {
          color: #ffffff;
          border-radius: 0 47rpx 47rpx 0;
          background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
        }
      }
    }
  }
}
</style>
