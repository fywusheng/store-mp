<template>
  <view class="bede-house">
    <!-- banner -->
    <view class="banner-wrapper">
      <swiper
        class="banner-swiper"
        :indicator-dots="banners.length"
        :autoplay="true"
        :interval="4000"
        :duration="500"
        indicator-active-color="#FDFDFD"
        indicator-color="#FDFDFD"
      >
        <swiper-item class="item" v-for="(item, index) in banners" :key="index">
          <image
            class="image"
            mode="scaleToFill"
            :src="item.bannerUrl"
            @click="handleBannerClick(item)"
          />
        </swiper-item>
      </swiper>
    </view>
    <!-- filter -->
    <view class="filter">
      <view
        class="filter-item"
        :class="{ active: active === 0 }"
        @click="hanldeFilterItem(0)"
      >
        <text>全部</text>
        <view class="arrow-wrap">
          <image
            class="arrow"
            mode="widthFix"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png"
          />
        </view>
      </view>
      <view
        class="filter-item"
        :class="{ active: active === 1 }"
        @click="hanldeFilterItem(1)"
      >
        <text>价格</text>
        <view class="arrow-wrap">
          <image
            v-if="priceType === 'asc'"
            class="arrow"
            mode="widthFix"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_h@2x.png"
          />
          <image
            v-else
            class="arrow"
            mode="widthFix"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png"
          />
          <image
            v-if="priceType === 'desc'"
            class="arrow"
            mode="widthFix"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_h@2x.png"
          />
          <image
            v-else
            class="arrow"
            mode="widthFix"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png"
          />
        </view>
      </view>
    </view>
    <view class="content">
      <view>
        <view v-if="list.length > 0">
          <view
            class="item"
            v-for="(item, index) in list"
            :key="index"
            @click="hostDetail(item)"
          >
            <view class="top">
              <view class="img_qy">
                <image :src="item.mainPic" class="bgimg" mode="scaleToFill" />
              </view>
              <view class="top_c">
                <view class="name">{{ item.name }}</view>
                <view class="price">
                  <view class="icon">
                    <image
                      class="im"
                      src="https://ggllstatic.hpgjzlinfo.com/static/life/micon.png"
                      mode="scaleToFill"
                    />
                  </view>
                  <view class="addres">{{ item.address }}</view>
                </view>
                <view class="label">
                  <view
                    v-for="label in item.residents"
                    :key="label"
                    class="label-item"
                  >
                    {{ label }}
                  </view>
                </view>
              </view>
            </view>
            <view class="bottom">
              <!-- ¥ -->
              <text class="price">{{ item.price }}/床</text>
            </view>
          </view>
          <uni-load-more :status="status" />
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
            <view class="flex-c-c status-text">暂无内容</view>
          </view>
        </block>
      </view>
    </view>

    <filter-drawer ref="filter" @confirm="handleConfirm"></filter-drawer>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import FilterDrawer from "./components/filter-drawer.vue";
export default {
  data() {
    return {
      // tab索引
      active: 0,
      // 价格排序规格 asc:升序  desc: 降序
      priceType: "",
      status: "more",
      // 查询条件
      params: {
        city: "", // 城市
        bedCode: "", // 床位数
        priceCode: "", // 收费标准
        homeType: "", // 机构类型
        residents: "", // 收住对象
        distinctiveService: "", // 特色服务
        sort: 0, // 排序
        pageNum: 1,
        pageSize: 20,
      },
      loading: 1,
      list: [],
      banners: [],
    };
  },
  components: { FilterDrawer },
  created() {
    this.getLocation();
    this.getBanners();
  },
  onLoad(option) {},
  onReachBottom() {
    if (this.status === "noMore") return;
    this.params.pageNum++;
    this.getList();
  },
  methods: {
    /**
     * 获取当前定位
     */
    getLocation() {
      if (!uni.getStorageSync("city")) {
        my.getLocation({
          type: 1, // 获取经纬度和省市区县数据
          success: (res) => {
            const city = {
              code: res.cityAdcode,
              name: res.city,
            };
            uni.setStorageSync("city", city);
            this.params.city = city.name;
            this.getList();
          },
          fail: (res) => {
            console.log("定位识别结果：", res);
            // 用户拒绝
            // 定位失败默认北京市
            const city = { code: 110100, name: "北京市" };
            uni.setStorageSync("city", city);
            this.params.city = city.name;
            this.getList();
            // if (res.error === 2001) {
            //   // 用户拒绝
            //   // 定位失败默认北京市
            //   const city = { code: 110100, name: '北京市' }
            //   this.handleSelectCity(city)
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
            //            * res.authSetting = {
            //            *   "userInfo": true,
            //            *   "location": true,
            //            *   ...
            //            * }
            //            */
            //         }
            //       })
            //     },
            //   });

            // }
          },
          complete: () => {},
        });
      } else {
        this.params.city = uni.getStorageSync("city").name;
        this.getList();
      }

      return;
      uni.getLocation({
        type: "gcj02",
        success: (res) => {
          uni.setStorageSync("location", res);
          // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
          api.regeoMap(
            {
              location: res.longitude + "," + res.latitude,
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
                this.handleSelectCity(city);
              },
            }
          );
        },
        fail: () => {
          // 定位失败默认北京市
          const city = { code: 110100, name: "北京市" };
          this.handleSelectCity(city);
        },
      });
    },
    handleConfirm({
      bedCode,
      priceCode,
      homeType,
      residents,
      distinctiveService,
    }) {
      this.params = {
        ...this.params,
        bedCode,
        priceCode,
        homeType,
        residents,
        distinctiveService,
        pageNum: 1,
      };
      this.list = [];
      this.getList();
    },
    setSort(nv) {
      if (nv === "") {
        this.params.sort = 0;
      } else if (nv === "asc") {
        this.params.sort = 1;
      } else if (nv === "desc") {
        this.params.sort = 2;
      }
    },
    // 获取机构列表
    getList() {
      this.status = "loading";
      this.setSort(this.priceType);
      api.getBedeHouseList({
        showsLoading: true,
        data: this.params,
        success: (res) => {
          if (res.list && res.list.length > 0) {
            res.list.map((item) => {
              item.price = item.price.replace("元", "");
              item.residents = this.handleLabes(item.residents);
            });
            this.list = [...this.list, ...res.list];
            this.status = res.hasNextPage ? "more" : "noMore";
          }
          if (this.list.length == 0) {
            this.loading = 2;
            this.status = "noMore";
          }
        },
        fail: (res) => {},
      });
    },
    trimAll(ele) {
      if (typeof ele === "string") {
        return ele.split(/[\t\r\f\n\s]*/g).join("");
      } else {
        console.error(
          `${typeof ele} is not the expected type, but the string type is expected`
        );
      }
    },
    handleLabes(distinctiveService) {
      distinctiveService = this.trimAll(distinctiveService);
      // console.log('distinctiveService: ', distinctiveService)
      let result = [];
      const preList = distinctiveService.split("|");
      const len = preList.length;

      if (len >= 3) {
        // 如果机构拥有 ≥ 3个标签，则选择标签字数≤4个字的3个标签展示在列表页，
        result = preList.filter((el) => el.length < 5);
        // 若满足条件的标签数量＜3个，则有多少展示多少。
        if (result.length > 3) {
          result = result.splice(0, 3);
        }
      } else {
        // 若机构拥有＜3个标签，则优先展示标签字数≤4个字的标签，
        result = preList.filter((el) => el.length < 5);
        if (result.length === 0) {
          // 若满足条件的标数量=0时，则展示标签字数＞4个字的标签，且只展示一个标签字数＞4个字的标签。
          result = preList.filter((el) => el.length > 4);
          if (result.length > 1) result = [result[0]];
        }
      }

      return result;
    },
    getSortType(type) {
      if (type === "asc") {
        return "desc";
      } else {
        return "asc";
      }
    },
    hanldeFilterItem(index) {
      if (index === 0) {
        this.active = index;
        this.priceType = "";
        this.$refs.filter.open();
      } else {
        // 点击价格
        if (index === this.active) {
          // 切换排序规则
          this.priceType = this.getSortType(this.priceType);
        } else {
          // 切换排序规则
          if (this.priceType === "") {
            this.priceType = "asc";
          }
          this.active = index;
        }
        this.list = [];
        this.params.pageNum = 1;
        this.getList();
      }
    },
    // 获取banner
    getBanners() {
      api.getBanners({
        data: { bannerType: "13", status: "1" },
        success: (data) => {
          this.banners = data;
        },
      });
    },
    // 详情
    hostDetail({ identity }) {
      uni.navigateTo({
        url: `/pages/benefit/bedehouse-info?identity=${identity}`,
      });
    },
    handleBannerClick(item) {
      if (item.jumpUrl) {
        uni.navigateTo({
          url: item.jumpUrl,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.bede-house {
  background-color: #f5f5f5;
  margin-top: -2.6%;
  .select {
    margin-bottom: 0.32rem;
    background-color: #fff;
    font-size: 36rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 72rpx;
    display: flex;
    padding-left: 34rpx;
    margin-top: 20rpx;
    justify-content: space-around;
    .pd {
      margin-right: 34rpx;
      display: flex;
      flex-direction: column;
      height: 100rpx;
      align-items: center;
      .select_name {
        font-size: 40rpx;
        font-weight: 600;
      }
      .bottom_line {
        width: 70rpx;
        height: 10rpx;
        background: linear-gradient(90deg, #ff7936 0%, #ff5121 100%);
        border-radius: 5rpx;
      }
    }
  }
  // banner
  .banner-wrapper {
    height: 264rpx;
    padding-top: 24rpx;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .banner-swiper {
      height: 224rpx;
      width: 686rpx;
    }
    .item {
      height: 224rpx;
      width: 686rpx;
      .image {
        width: 100%;
        height: 100%;
        border-radius: 16rpx;
      }
    }
  }
  // filter样式
  .filter {
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0rpx 32rpx;
    font-size: 36rpx;
    color: #999999;
    .filter-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 84rpx;
      position: relative;
      &.active::after {
        content: "";
        display: block;
        width: 64rpx;
        height: 8rpx;
        background: #ff711a;
        border-radius: 5rpx;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .arrow-wrap {
        margin-left: 10rpx;
        height: 28rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        .arrow {
          width: 17rpx;
        }
      }
    }
  }
  // list样式
  .content {
    margin-top: 24rpx;
    .hotel {
      background-color: #f2f2f2;
      padding-top: 32rpx;
    }
    .item {
      background: #ffffff;
      box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
      border-radius: 16rpx;
      margin: 0rpx 32rpx 24rpx 32rpx;
      padding: 20rpx 20rpx 18rpx 20rpx;
      .top {
        display: flex;
        justify-content: flex-start;
        .img_qy {
          width: 214rpx;
          height: 176rpx;
          margin-right: 16rpx;
        }
        .top_c {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .name {
            font-size: 40rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            width: 390rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .price {
            display: flex;
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            height: 40rpx;
            line-height: 40rpx;
            .icon {
              width: 28rpx;
              height: 32rpx;
              margin-right: 11rpx;
              .im {
                width: 100%;
                height: 100%;
              }
            }
            .addres {
              width: 390rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              word-wrap: break-word;
              white-space: normal !important;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
          }
          .label {
            display: flex;
            align-items: center;
            .label-item {
              // height: 48rpx;
              font-size: 28rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ff2600;
              line-height: 40rpx;
              border-radius: 4rpx;
              border: 2rpx solid #ff2600;
              margin-right: 16rpx;
              padding: 0rpx 8rpx;
              box-sizing: border-box;
              &:last-child {
                margin-right: 0;
              }
            }
          }
        }
        .bgimg {
          width: 100%;
          height: 100%;
          border-radius: 8rpx;
        }
      }
      .bottom {
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff5500;
        line-height: 40rpx;
        display: flex;
        align-items: center;
        margin-top: 20rpx;
        margin-left: 230rpx;
        .price {
          font-size: 40rpx;
          font-weight: 500;
          color: #ff5500;
          line-height: 56rpx;
        }
      }
    }
  }
  .status-box2 {
    height: 100vh;
    background-color: #fff;
    image {
      width: 160rpx;
      height: 160rpx;
    }
  }
  .status-box3 {
    height: 100vh;
    background-color: #fff;
    margin-top: -20%;
    image {
      width: 440rpx;
      height: 270rpx;
      margin-bottom: 24rpx;
    }
  }
}
</style>
