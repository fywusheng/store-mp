<template>
  <view class="fillout-step-1">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1" />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :shows-back-button="true" :alpha="1" />
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <step-progress-bar :step="1" />
    <view class="section">
      <view class="section-header flex-h flex-c-s p-0-32">
        <image
          class="section-header__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-basic-info.png"
        />
        <text class="fs-44 c-black ml-16">基本信息</text>
      </view>
      <view class="form m-0-32">
        <view class="row flex-h flex-c-s p-20-0" v-if="type === 'input'">
          <text class="row__indicator">*</text>
          <text class="row__label fs-40 c-black">民族(必填)</text>
          <picker class="flex-1" :range="nations" @change="handleNationChange">
            <text
              class="fs-40 flex-1 ml-48"
              :class="{ 'c-lightgrey': !params.nation }"
            >
              {{ params.nation || "请选择民族" }}
            </text>
          </picker>
          <image
            class="row__accessory"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__indicator"></text>
          <text class="row__label fs-40 c-black">血型</text>
          <picker
            class="flex-1"
            :range="bloodTypes"
            @change="handleBloodTypeChange"
          >
            <text
              class="fs-40 c-black flex-1 ml-48"
              :class="{ 'c-lightgrey': params.bloodType === '' }"
            >
              {{ params.bloodType || "请选择血型" }}
            </text>
          </picker>
          <image
            class="row__accessory"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__indicator">*</text>
          <text class="row__label fs-40 c-black">现居住地址(必填)</text>
          <!-- #ifdef MP-ALIPAY -->
          <button @click="alipayChose" class="clickChose">
            {{ params.residentialCity || "请选择省、市、区" }}
          </button>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <uni-data-picker
            class="flex-1"
            popup-title="请选择省、市、区"
            :localdata="cities"
            v-slot:default="{ data, error, options }"
            @change="handleResidentialCityChange"
          >
            <view v-if="data.length > 0" class="selectValue"
              ><text v-for="(item, index) in data" :key="index">{{
                item.text
              }}</text></view
            >
            <text
              v-if="data.length == 0"
              class="city fs-40 c-black flex-1 ml-48"
              :class="{ 'c-lightgrey': data.length == 0 }"
            >
              请选择省、市、区
            </text>
          </uni-data-picker>
          <!-- #endif -->

          <image
            class="row__accessory"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__indicator"></text>
          <input
            v-model="params.residentialAddress"
            class="fs-40 c-black flex-1"
            placeholder="请输入详细地址：街道、路、小区"
            placeholder-class="placeholder"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__indicator">*</text>
          <text class="row__label--small fs-40 c-black"> 办证机构(必填) </text>
          <!-- <image class="row__illustration ml-12"
                 src="./static/icon-certificate-illustration.png" /> -->
          <picker
            class="flex-1"
            :range="institutions"
            @change="handleInstitutionChange"
          >
            <text
              class="fs-40 c-black flex-1 ml-36"
              :class="{ 'c-lightgrey': params.institution === '' }"
            >
              {{ params.institution || "请选择办证机构" }}
            </text>
          </picker>
          <image
            class="row__accessory"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0" v-if="type === 'input'">
          <text class="row__indicator">*</text>
          <text class="row__label fs-40 c-black">户籍地址(必填)</text>
          <!-- #ifdef MP-ALIPAY -->
          <button @click="localeChose" class="clickChose">
            {{ params.domicileCity || "请选择省、市、区" }}
          </button>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <uni-data-picker
            class="flex-1"
            popup-title="请选择省、市、区"
            :localdata="cities"
            v-slot:default="{ data, error, options }"
            @change="handleDomicileCityChange"
          >
            <!-- <view slot="picker">
              <text class="city fs-40 c-black flex-1 ml-48"
                    :class="{ 'c-lightgrey': params.domicileCity === '' }">
                {{ params.domicileCity || "请选择省、市、区" }}
              </text>
            </view> -->
            <view v-if="data.length > 0" class="selectValue"
              ><text v-for="(item, index) in data" :key="index">{{
                item.text
              }}</text></view
            >
            <text
              v-if="data.length == 0"
              class="city fs-40 c-black flex-1 ml-48"
              :class="{ 'c-lightgrey': data.length == 0 }"
            >
              请选择省、市、区
            </text>
          </uni-data-picker>
          <!-- #endif -->
          <image
            class="row__accessory"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0" v-if="type === 'input'">
          <text class="row__indicator"></text>
          <input
            v-model="params.domicileAddress"
            class="fs-40 c-black flex-1"
            placeholder="请输入详细地址：街道、路、小区"
            placeholder-class="placeholder"
          />
        </view>
      </view>
    </view>
    <view class="blank" style="height: 200rpx" />
    <view class="footer bg-white">
      <button class="button fs-44 c-white" @click="handleNextStepClick">
        下一步
      </button>
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import staticData from "@/utils/dataBase64.js";
import StepProgressBar from "./components/step-progress-bar.vue";
import NavigationBar from "../../components/common/navigation-bar.vue";
import { alipayCityChoose } from "@/utils/utils.js";
export default {
  components: { StepProgressBar, NavigationBar },
  data() {
    return {
      alipayCitys: [],
      // 导航栏高度
      //#ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      //#endif
      //#ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      //#endif
      // 录入方式  scan: 扫描  input: 输入
      type: "",
      // 民族选择器数据
      nations: staticData.nations,
      // 血型选择器数据
      bloodTypes: ["A型", "AB型", "AB型", "O型", "不明"],
      // 城市选择器数据
      cities: [],
      // 办证机构选择器数据
      institutions: ["北京市朝阳区"],
      // 表单数据
      params: {
        nation: "",
        bloodType: "",
        residentialCity: "",
        residentialAddress: "",
        institution: "",
        domicileCity: "",
        domicileAddress: "",
      },
    };
  },
  onLoad(e) {
    this.alipayHandler();
    this.getRegions();
    console.log("---load--", e);

    //#ifdef MP-ALIPAY
    let data = JSON.parse(decodeURIComponent(uni.getStorageSync("info")));
    uni.removeStorageSync("info");
    //#endif

    //#ifdef MP-WEIXIN
    let data = JSON.parse(decodeURIComponent(e.info));
    //#endif

    const typeChoice = uni.getStorageSync("typeChoice");
    this.type = typeChoice == "" ? "input" : typeChoice;

    console.log("----查看一下类型情况正式环境下可以直接识别---", data);
    console.log("====type---", this.type);
    // this.type = data.type;
    this.params = { ...this.params, ...data };
    console.log("====this.params---", this.params);
    //this.setData();

    uni.$on("didFilloutStepBack", this.handleFilloutStepBack);
  },
  methods: {
    //现居住地址
    alipayChose() {
      const params = {
        list: this.alipayCitys,
        success: (city) => {
          this.params.residentialCity = city;
        },
      };
      alipayCityChoose(params);
    },
    //户籍地址
    localeChose() {
      const params = {
        list: this.alipayCitys,
        success: (city) => {
          this.params.domicileCity = city;
        },
      };
      alipayCityChoose(params);
    },
    handleNavigationBack() {
      this.$uni.showConfirm({
        content: "您确定要中断申领电子老年人证吗?",
        confirmText: "继续申领",
        cancelText: "放弃申领",
        title: "",
        cancel: () => {
          uni.reLaunch({
            url: "/pages/certificate/electronic-card",
          });
        },
      });
    },
    handleFilloutStepBack(params) {
      this.params = params;
      console.log("获取的参数1params：", params);
    },
    /**
     * 民族选择器改变回调
     */
    handleNationChange(e) {
      this.params.nation = this.nations[e.detail.value];
    },
    /**
     * 血型选择器改变回调
     */
    handleBloodTypeChange(e) {
      this.params.bloodType = this.bloodTypes[e.detail.value];
    },
    /**
     * 现居住地址城市选择器改变回调
     */
    handleResidentialCityChange(e) {
      this.params.residentialCity = e.detail.value
        .map((item) => item.text)
        .join("");
    },
    /**
     * 办证机构改变回调
     */
    handleInstitutionChange(e) {
      this.params.institution = this.institutions[e.detail.value];
    },
    /**
     * 户籍地址城市选择器改变回调
     */
    handleDomicileCityChange(e) {
      this.params.domicileCity = e.detail.value
        .map((item) => item.text)
        .join("");
    },
    /**
     * 下一步点击事件
     */
    handleNextStepClick() {
      console.log("---第二步的时候传递的值--", this.params);
      if (!this.checkInput()) return;
      uni.navigateTo({
        url: "/pages/certificate/fillout-step-2",
        success: (res) => {
          res.eventChannel.emit("didOpenPageFinish", this.params);
        },
      });
    },
    /**
     * 设置数据  后续删除
     */
    setData() {
      /**
       * 上一个页面传过来的数据格式为
      {
        name: "",
        idCardNumber: "",
        gender: "",
        nation: "",
        birthday: "",
        city: "",
        address: "",
        faceImg: "",
      }
       */
      const eventChannel = this.getOpenerEventChannel();
      if (!eventChannel.on) return;
      eventChannel.on("didOpenPageFinish", (data) => {
        console.log("====会跑这个");
        this.type = uni.getStorageSync("typeChoice");
        console.log("----查看一下类型情况正式环境下可以直接识别---", data);
        this.params = { ...this.params, ...data };
      });
    },
    /**
     * 获取省市区数据
     */
    getRegions() {
      api.getRegions({
        success: (data) => {
          function map(array) {
            return array.map((item) => {
              return {
                text: item.regnName,
                value: item.regnCode,
                children: map(item.children),
              };
            });
          }
          this.cities = map(data);
        },
      });
    },
    alipayHandler() {
      api.getRegions({
        success: (data) => {
          function map(array) {
            return array.map((item) => {
              return {
                name: item.regnName,
                code: item.regnCode,
                subList: map(item.children),
              };
            });
          }
          this.alipayCitys = map(data);
        },
      });
    },
    /**
     * 输入信息校验
     */
    checkInput() {
      const isScan = this.type === "input";
      if (isScan && !this.params.nation) {
        this.$uni.showToast("请选择民族");
        return false;
      }
      if (!this.params.residentialCity) {
        this.$uni.showToast("请选择现居住地址所在地区");
        return false;
      }
      if (!this.params.residentialAddress) {
        this.$uni.showToast("请输入现居住地址详细地址");
        return false;
      }
      if (!this.params.institution) {
        this.$uni.showToast("请选择办证机构");
        return false;
      }
      if (isScan && !this.params.domicileCity) {
        this.$uni.showToast("请选择户籍地址所在地区");
        return false;
      }
      if (isScan && !this.params.domicileAddress) {
        this.$uni.showToast("请输入户籍地址详细地址");
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.fillout-step-1 {
  height: 100vh;
  background-color: #fff;
  //#ifdef MP-ALIPAY
  .clickChose {
    width: 70%;
  }
  //#endif
  .selectValue {
    width: 400rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 40rpx;
    text-align: center;
  }
  .section {
    &-header {
      height: 120rpx;
      &__icon {
        @include square(48);
      }
    }
    .form {
      .row {
        min-height: 120rpx;
        border-bottom: 2rpx solid $color-line;
        box-sizing: border-box;
        &__indicator {
          width: 24rpx;
          text-align: center;
          color: #eb3030;
        }
        &__label {
          width: 200rpx;
          &--small {
            width: 160rpx;
          }
        }
        &__illustration {
          @include square(36);
        }
        &__accessory {
          @include square(48);
        }
        .city {
          @include text-line(2);
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    z-index: 10;
    .button {
      @include size(686, 108);
      margin: 28rpx 32rpx 64rpx;
      line-height: 108rpx;
      border-radius: 54rpx;
      background: linear-gradient(to right, $color-secondary, $color-primary);
    }
  }
}
</style>
