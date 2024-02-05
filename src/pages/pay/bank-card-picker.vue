<template>
  <view class="bank-card-picker">
    <!-- 导航栏 -->
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view
          class="navigation-bar flex-h flex-c-s"
          :style="{ height: '44px' }"
        >
          <!-- <view class="back-icon"></view>
          <image class="icon-desc"
          @click="handleHomeBack"
                 src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-index.png"
                 mode="scaleToFill" /> -->

          <text class="navigation-bar__title fs-44 c-black flex-1">{{
            title
          }}</text>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view
          class="navigation-bar flex-h flex-c-s"
          :style="{ height: '44px' }"
        >
          <image
            class="back-icon"
            @click="handleNavBack"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-arrow-left.png"
            mode="scaleToFill"
          />
          <text class="navigation-bar__title fs-44 c-black flex-1">{{
            title
          }}</text>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="search-panel">
      <image
        class="icon-search"
        src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-search.png"
      />
      <input class="search-input" placeholder="请输入银行名称" />
      <text class="search-txt">搜索</text>
    </view>

    <scroll-view
      class="list"
      :style="{ height: scrollViewHeight + 'px' }"
      :scroll-y="true"
      :scroll-into-view="viewToScroll"
      @scroll="handleScrollViewScroll"
    >
      <view
        v-for="(section, sectionIndex) in list"
        class="section"
        :id="'section-' + section.index"
        :key="sectionIndex"
      >
        <view
          class="section-header flex-h flex-c-s p-0-32"
          v-if="!searchResult"
        >
          <text class="section-header__text">{{ section.index }}</text>
        </view>
        <view
          v-for="(city, cityIndex) in section.items"
          class="row flex-h flex-c-s ml-32 pr-32"
          :key="cityIndex"
          @click="handleCityClick(city)"
        >
          <image
            class="icon-bank"
            src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-search.png"
          />
          <text class="row__text fs-36 c-black">{{ city.name }}</text>
        </view>
      </view>
    </scroll-view>
    <view
      class="index-list flex-v flex-c-c"
      v-if="!searchResult"
      :style="{ top: navigationBarHeight + 60 + 'px' }"
    >
      <text
        v-for="(item, index) in indexes"
        class="item fs-32 animated"
        :class="item === selectedIndex ? 'c-primary' : 'c-grey'"
        :key="index"
        @click.stop="handleIndexClick(item)"
      >
        {{ item }}
      </text>
    </view>
  </view>
</template>

<script>
import NavigationBar from "@/components/common/navigation-bar.vue";
import api from "@/apis/index.js";
export default {
  components: { NavigationBar },
  data() {
    const windowHeight = uni.getSystemInfoSync().windowHeight;
    const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    return {
      // 导航栏高度
      navigationBarHeight: statusBarHeight + 44,
      // 列表高度
      scrollViewHeight: windowHeight - statusBarHeight - 44,
      title: "一键绑卡",
      // 滚动到顶部的视图
      viewToScroll: "",
      // 每个 section 的高度
      heights: [],
      // 最后一次点击的时间戳
      clickTimestamp: 0,
      // 最后一次滚动的时间戳
      scrollTimestamp: 0,
      // 当前高亮的下标
      selectedIndex: "",
      // 搜索结果
      searchResult: null,
      // 城市列表
      cities: {
        location: null,
        recent: uni.getStorageSync("citySearchHistories") || [],
        hot: [
          { name: "北京市", code: "110100" },
          { name: "上海市", code: "310100" },
          { name: "厦门市", code: "350200" },
          { name: "深圳市", code: "440300" },
          { name: "杭州市", code: "330100" },
          { name: "成都市", code: "510100" },
        ],
        list: [],
      },
    };
  },
  computed: {
    // 要显示的城市列表, 如果有搜索结果则显示搜索结果, 否则显示全部
    list() {
      return this.searchResult || this.cities.list;
    },
    // 右侧索引栏数据
    indexes() {
      return this.cities.list.map((item) => item.index);
    },
  },
  onLoad() {
    this.getLocation();
    this.requestData();
  },
  methods: {
    // 返回上一页
    handleNavBack() {
      uni.navigateBack();
    },
    /**
     * 输入框改变回调
     */
    handleInputChange(e) {
      if (e.detail.value) {
        const result = [];
        this.cities.list.forEach((item) => {
          if (
            item.items
              .map((item) => item.name)
              .join()
              .indexOf(e.detail.value) !== -1
          ) {
            result.push({
              ...item,
              items: item.items.filter((item) => {
                return item.name.indexOf(e.detail.value) !== -1;
              }),
            });
          }
        });
        this.searchResult = result;
      } else {
        this.searchResult = null;
      }
    },
    /**
     * 清除最近访问城市点击事件
     */
    handleClearClick() {
      this.$uni.showConfirm({
        content: "是否清除最近访问记录",
        confirm: () => {
          uni.removeStorageSync("citySearchHistories");
          this.cities.recent = [];
        },
      });
    },
    /**
     * 城市点击事件
     */
    handleCityClick(city) {
      if (this.cities.location.name !== city.name) {
        const array = [...this.cities.recent];
        array.unshift(city);
        this.cities.recent = Array.from(new Set(array)).slice(0, 5);
        uni.setStorageSync("recentCities", this.cities.recent);
      }
      uni.$emit("didSelectCity", city);
      uni.navigateBack();
    },
    /**
     * 右侧索引栏点击事件
     */
    handleIndexClick(id) {
      this.selectedIndex = id;
      this.viewToScroll = `section-${id}`;
      this.clickTimestamp = new Date().getTime();
    },
    /**
     * scrollview 滚动回调
     */
    handleScrollViewScroll(e) {
      const timestamp = new Date().getTime();
      if (
        timestamp - this.scrollTimestamp < 100 ||
        timestamp - this.clickTimestamp < 500
      ) {
        return;
      }
      this.scrollTimestamp = timestamp;

      const scrollTop = e.detail.scrollTop;
      const scrollHeight = e.detail.scrollHeight;
      const scrollViewHeight = uni.getSystemInfoSync().windowHeight - 128;
      // uni.upx2px(128);
      if (scrollTop < 0 || scrollTop > scrollHeight - scrollViewHeight) return;

      console.log(scrollTop);
      const index = this.heights.findIndex(
        (value, index, array) =>
          value <= scrollTop && scrollTop < array[index + 1]
      );
      this.selectedIndex = this.indexes[index];
    },
    /**
     * 获取当前定位
     */
    getLocation() {
      uni.getLocation({
        type: "gcj02",
        success: (res) => {
          // 调用百度地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
          uni.request({
            url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=Q8zDDVDgBOYUCSYykREHmlydkSobm9Gf&output=json&coordtype=gcj02ll&location=${res.latitude},${res.longitude}`,
            success: (response) => {
              this.cities.location = {
                code: response.data.result.addressComponent.adcode,
                name: response.data.result.addressComponent.city,
              };
            },
          });
        },
        fail: (err) => {},
      });
    },
    /**
     * 请求数据
     */
    requestData() {
      api.getCities({
        success: (data) => {
          const mappedCities = data.map((item) => {
            return {
              code: item.regnCode,
              name: item.regnName,
              index: item.dataDscr.substring(0, 1),
            };
          });
          const indexes = new Set(mappedCities.map((item) => item.index));
          this.cities.list = [];
          indexes.forEach((index) => {
            this.cities.list.push({
              index: index,
              items: mappedCities.filter((item) => {
                return item.index === index;
              }),
            });
          });

          // 刷新数据后计算各个 section 高度
          this.calculateSectionHeights();
        },
      });
    },
    /**
     * 计算 scrollview 中各个 section 的高度
     */
    calculateSectionHeights() {
      setTimeout(() => {
        uni
          .createSelectorQuery()
          .selectAll(".section")
          .boundingClientRect((rects) => {
            this.heights = rects.map((item) => item.top - 128);
            console.log(this.heights, uni.upx2px(128));
          })
          .exec();
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.bank-card-picker {
  .navigation-bar {
    box-sizing: border-box;
    padding-left: 24rpx;
    width: 100vw;
    height: 100%;
    .back-icon {
      flex-shrink: 0;
      width: 44rpx;
      height: 44rpx;
      margin-right: 48rpx;
      position: relative;
      z-index: 10;
    }
    .icon-desc {
      flex-shrink: 0;
      // width: 40rpx;
      // height: 40rpx;
      margin-left: 24rpx;
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
  .search-panel {
    width: 100%;
    height: 120rpx;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 16rpx 0 32rpx;
    .search-input {
      width: 592rpx;
      height: 88rpx;
      padding-left: 96rpx;
      padding-right: 40rpx;
      border-radius: 44rpx;
      font-size: 40rpx;
      box-sizing: border-box;
      background: #f5f5f5;
    }
    .icon-search {
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      top: 40rpx;
      left: 64rpx;
    }
    .search-txt {
      font-size: 40rpx;
      color: #333333;
      margin-left: 22rpx;
    }
  }
  .search-bar {
    margin: 0 200rpx 0 100rpx;
    height: 72rpx;
    background: #f5f5f5;
    &__icon {
      @include square(36);
    }
  }
  .list {
    .section {
      &-header {
        height: 60rpx;
        color: #999999;
        background: #eeeeee;
      }
    }
    .items {
      .item {
        width: calc((100vw - 144rpx) / 3);
        height: 72rpx;
        border: 2rpx solid $color-line;
        box-sizing: border-box;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &:nth-last-child(-n + 3) {
          margin-bottom: 0;
        }
        &__icon {
          @include size(24, 32);
        }
        &__text {
          @include text-line(1);
        }
      }
    }
    .row {
      height: 88rpx;
      border-bottom: 2rpx solid $uni-bg-color-grey;
      .icon-bank {
        width: 46rpx;
        height: 46rpx;
        margin-right: 14rpx;
      }
    }
  }
  .index-list {
    position: fixed;
    top: 0;
    right: 20rpx;
    width: 32rpx;
    // height: 100vh;
    .item {
      line-height: 48rpx;
    }
  }
}
</style>
