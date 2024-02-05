<template>
  <view class="city-picker">
    <scroll-view
      class="list"
      :style="{ height: scrollViewHeight + 'px' }"
      :scroll-y="true"
      :scroll-into-view="viewToScroll"
      @scroll="handleScrollViewScroll"
    >
      <view class="section" v-if="!searchResult">
        <view class="section-header flex-h flex-c-b p-0-32">
          <text class="section-header__text fs-36 c-black">定位/最近访问</text>
          <button
            v-if="cities.recent.length > 0"
            class="fs-36 c-grey"
            hover-class="none"
            @click="handleClearClick"
          >
            清除
          </button>
        </view>
        <view class="items flex-h flex-wrap ml-32 mr-72">
          <view
            v-if="cities.location"
            class="item flex-h flex-c-c mr-20 mb-20 p-0-8"
            @click="handleCityClick(cities.location)"
          >
            <image
              class="item__icon mr-8"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-location.png"
            />
            <text class="item__text fs-36 c-black">
              {{ cities.location.name }}
            </text>
          </view>
          <view
            v-for="(item, index) in cities.recent"
            class="item flex-h flex-c-c mr-20 mb-20 p-0-16"
            :key="index"
            @click="handleCityClick(item)"
          >
            <text class="item__text fs-36 c-black">{{ item.name }}</text>
          </view>
        </view>
      </view>
      <view class="section" v-if="!searchResult">
        <view class="section-header flex-h flex-c-s p-0-32">
          <text class="section-header__text fs-36 c-black">热门城市</text>
        </view>
        <view class="items flex-h flex-wrap ml-32 mr-72">
          <view
            v-for="(item, index) in cities.hot"
            class="item flex-h flex-c-c mr-20 mb-20"
            :key="index"
            @click="handleCityClick(item)"
          >
            <text class="item__text fs-36 c-black">{{ item.name }}</text>
          </view>
        </view>
      </view>
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
          class="row flex-h flex-c-s pl-32 pr-32"
          :key="cityIndex"
          @click="handleCityClick(city)"
        >
          <text class="row__text fs-36 c-black">{{ city.name }}</text>
        </view>
      </view>
    </scroll-view>
    <view class="index-list flex-v flex-c-c" v-if="!searchResult">
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
// import NavigationBar from "../../components/common/navigation-bar.vue";
import api from "@/apis/index.js";
export default {
  components: {},
  data() {
    const windowHeight = uni.getSystemInfoSync().windowHeight;
    const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    return {
      // 导航栏高度
      navigationBarHeight: statusBarHeight + 44,
      // 列表高度
      scrollViewHeight: windowHeight,
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
        recent:
          uni.getStorageSync("citySearchHistories") ||
          uni.getStorageSync("recentCities") ||
          [],
        hot: [
          { name: "北京市", code: "110100", realCode: "110000" },
          { name: "上海市", code: "310100", realCode: "310000" },
          { name: "厦门市", code: "350200", realCode: "350200" },
          { name: "深圳市", code: "440300", realCode: "440300" },
          { name: "杭州市", code: "330100", realCode: "330100" },
          { name: "成都市", code: "510100", realCode: "510100" },
        ],
        // hot: [
        //   { name: '北京市', code: '110100' },
        //   { name: '上海市', code: '310100' },
        //   { name: '厦门市', code: '350200' },
        //   { name: '深圳市', code: '440300' },
        //   { name: '杭州市', code: '330100' },
        //   { name: '成都市', code: '510100' }
        // ],
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
      console.log("===点击选中city--", city, this.cities);
      uni.setStorageSync("current_city", city);
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
      const scrollViewHeight = uni.getSystemInfoSync().windowHeight;
      if (scrollTop < 0 || scrollTop > scrollHeight - scrollViewHeight) return;
      let index = this.heights.findIndex(
        (value, index, array) =>
          value <= scrollTop && scrollTop < array[index + 1]
      );

      if (index === -1) {
        index = this.indexes.length + 1;
      } else if (index < 2) {
        index = 2;
      }
      this.selectedIndex = this.indexes[index - 2];
    },
    /**
     * 获取当前定位
     */
    getLocation() {
      my.getLocation({
        type: 1, // 获取经纬度和省市区县数据
        success: (res) => {
          console.log(res);
          const city = {
            code: res.cityAdcode,
            name: res.city,
          };
          this.cities.location = city;
        },
        fail: (res) => {
          // 用户拒绝
          // 定位失败默认北京市
          const city = { code: 110100, name: "北京市", realCode: "110000" };
          this.cities.location = city;
          // if (res.error === 2001) {
          //   // 用户拒绝
          //   // 定位失败默认北京市
          //   const city = { code: 110100, name: '北京市', realCode: '110000' }
          //   this.cities.location = city
          // } else if (res.error === 2002 || res.error === 2003) {
          //   // 用户之前已经拒绝授权且勾选了“总是保持以上选择，不再询问”
          //   my.confirm({
          //     title: '温馨提示',
          //     content: '为了更好的服务，请开启定位',
          //     confirmButtonText: '开启定位',
          //     cancelButtonText: '取消',
          //     success: (result) => {
          //       my.openSetting({
          //         success: (res) => {
          //           /*
          //              * res.authSetting = {
          //              *   "userInfo": true,
          //              *   "location": true,
          //              *   ...
          //              * }
          //              */
          //         }
          //       })
          //     }
          //   })
          // }
        },
        complete: () => {},
      });
      return;
      uni.getLocation({
        type: "gcj02",
        success: (res) => {
          uni.setStorageSync("location", res);
          // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
          api.regeoMap(
            {
              location: res.longitude + "," + res.latitude,
              // location: '116.3,39.9'
            },
            {
              success: (res) => {
                let city = {};
                // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
                if (res.regeocode.addressComponent.city.length === 0) {
                  city = {
                    code:
                      res.regeocode.addressComponent.adcode.substr(0, 2) +
                      "0100",
                    name: res.regeocode.addressComponent.province,
                    realCode:
                      res.regeocode.addressComponent.adcode.substr(0, 2) +
                      "0000",
                  };
                } else {
                  city = {
                    code:
                      res.regeocode.addressComponent.adcode.substr(0, 4) + "00",
                    name: res.regeocode.addressComponent.city,
                  };
                }
                this.cities.location = city;
                console.log("===job高德定位---", city);
              },
            }
          );
        },
        fail: () => {
          // 定位失败默认北京市
          const city = { code: 110100, name: "北京市", realCode: "110000" };
          this.cities.location = city;
        },
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
            this.heights = rects.map((item) => item.top);
          })
          .exec();
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.city-picker {
  background: #f5f5f5;
  .search-bar {
    margin: 0 200rpx 0 100rpx;
    height: 72rpx;
    background: #f5f5f5;
    &__icon {
      @include square(36);
    }
  }
  .list {
    z-index: 100;
    .section {
      &-header {
        height: 120rpx;
      }
    }
    .items {
      .item {
        width: calc((100vw - 144rpx) / 3);
        height: 72rpx;
        border: 2rpx solid $color-line;
        box-sizing: border-box;
        background: #ffffff;
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
      background: #ffffff;
    }
  }
  .index-list {
    position: fixed;
    top: 0;
    right: 20rpx;
    width: 32rpx;
    height: 100vh;
    .item {
      line-height: 48rpx;
    }
  }
}
</style>
