<template>
  <view class="applicant-info">
    <view class="form m-32">
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">姓名(必填)</text>
        <input
          class="fs-40 c-black flex-1"
          placeholder="请输入姓名"
          :adjust-position="false"
          placeholder-class="placeholder"
          v-model="params.name"
        />
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">身份证号(必填)</text>
        <input
          class="fs-40 c-black flex-1"
          type="idcard"
          :adjust-position="false"
          placeholder="请输入身份证号"
          placeholder-class="placeholder"
          v-model="params.idCardNumber"
          @blur="handleIDCardNumberInputFinish"
        />
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">性别(必填)</text>
        <radio-group class="flex-h flex-c-s flex-1">
          <label class="flex-h flex-c-s radio mr-64">
            <radio color="#ff5000" value="0" :checked="params.gender === 1" />
            <text>男</text>
          </label>
          <label class="flex-h flex-c-s radio mr-64">
            <radio color="#ff5000" value="1" :checked="params.gender === 0" />
            <text>女</text>
          </label>
        </radio-group>
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">民族(必填)</text>
        <picker class="flex-1" :range="nations" @change="handleNationChange">
          <text
            class="fs-40 c-black"
            :class="{ 'c-lightgrey': params.nation === '' }"
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
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">出生日期(必填)</text>
        <picker
          class="flex-1"
          mode="date"
          :end="validDate"
          :value="params.birthday"
          @change="handleBirthdayChange"
        >
          <text
            class="fs-40 c-black"
            :class="{ 'c-lightgrey': params.birthday === '' }"
          >
            {{ params.birthday || "请选择出生日期" }}
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
        <text class="row__label fs-40 c-black mr-48">户籍地址(必填)</text>
        <!-- #ifdef MP-ALIPAY -->
        <button @click="localeChose" class="clickChose">
          {{ params.city || "请选择所在地区" }}
        </button>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <uni-data-picker
          class="flex-1"
          popup-title="请选择所在地区"
          :localdata="cities"
          @change="handleCityChange"
          v-slot:default="{ data, error, options }"
        >
          <!-- <view >
               <text
            class="city fs-40 c-black"
            :class="{ 'c-lightgrey': params.city === '' }"
          >
            {{ params.city || "请选择所在地区" }}
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
            请选择所在地区
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
          v-model="params.address"
          class="fs-40 c-black flex-1"
          placeholder="请输入详细地址"
          placeholder-class="placeholder"
        />
      </view>
    </view>
    <button
      class="next-step-button bg-primary fs-44 c-white"
      @click="handleNextStepClick"
    >
      下一步
    </button>
  </view>
</template>

<script>
import dayjs from "dayjs";
import api from "@/apis/index.js";
import { validateIDCardNumber } from "@/utils/validation.js";
import staticData from "@/utils/dataBase64.js";
import { alipayCityChoose } from "@/utils/utils.js";
export default {
  data() {
    return {
      alipayCitys: [],
      // 民族选择器数据
      nations: staticData.nations,
      // 城市选择器数据
      cities: [],
      // 出生日期选择器最大可选有效时间
      validDate: dayjs().subtract(60, "year").format("YYYY-MM-DD"),
      // 表单数据
      params: {
        name: "",
        idCardNumber: "",
        gender: "",
        nation: "",
        birthday: "",
        city: "",
        address: "",
      },
    };
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("didOpenPageFinish", (data) => {
      console.log("回填数据：", data);
      // 数据回填
      this.params.name = data.name;
      this.params.idCardNumber = data.idCardNumber;
      this.params.gender = data.gender === "男" ? 1 : 0;
      this.params.nation = `${data.nation}族`;
      this.params.birthday = data.birthday;
      // .replace("年", "-")
      // .replace("月", "-")
      // .replace("日", "");
      const regex = /.+?(省|市|自治区|自治州|县|区)/g;
      const city = data.address.match(regex).join("");
      this.params.city = city;
      const address = data.address.replace(city, "");
      this.params.address = address;
    });

    this.requestData();
    this.alipayHandler();
    uni.$on("faceRecognitionFinished", this.handleFaceRecognitionFinish);
  },
  onShow() {
    // 如果用户已实人, 则读取用户实人信息
    const userInfo = uni.getStorageSync("userInfo");
    const isAuthenticated = userInfo && userInfo.crtfStas !== "0";
    if (isAuthenticated) {
      this.params.name = userInfo.psnName;
      this.params.idCardNumber = userInfo.idCard;
      this.handleIDCardNumberInputFinish();
    }

    // 人脸认证结束后回填预先保存的信息
    const applicantInfo = uni.getStorageSync("applicantInfo");
    if (applicantInfo) {
      this.params = applicantInfo;
      uni.removeStorageSync("applicantInfo");
    }
  },
  onUnload() {
    uni.$off("faceRecognitionFinished");
  },
  methods: {
    localeChose() {
      const params = {
        list: this.alipayCitys,
        success: (city) => {
          this.params.city = city;
        },
      };
      alipayCityChoose(params);
    },
    /**
     * 人脸认证结果回调
     */
    handleFaceRecognitionFinish(result) {
      // 人脸认证结束后处理结果
      const { ismatch, img } = result;
      if (ismatch) {
        const userInfo = uni.getStorageSync("userInfo");
        const isAuthenticated = userInfo && userInfo.crtfStas !== "0";
        // 若用户已实人则调用 userPen 接口, 该接口不修改用户认证状态
        // 若用户未实人则调用 bindBankAcct 接口, 该接口会修改用户认证状态
        const request = isAuthenticated
          ? api.getFaceRecognitionResult
          : api.realPersonAuthenticate;
        request({
          data: {
            userName: this.params.name,
            idCard: this.params.idCardNumber,
            faceImg: `data:image/jpg;base64,${decodeURIComponent(img)}`,
          },
          success: () => {
            const info = {
              ...this.params,
              faceImg: `data:image/jpg;base64,${decodeURIComponent(img)}`,
            };
            // uni.navigateTo({
            //   url: `/pages/certificate/additional-info?info=${info}`,
            // });

            uni.navigateTo({
              url: "/pages/certificate/avatar-confirm",
              success: (res) => {
                res.eventChannel.emit("didOpenPageFinish", info);
              },
            });
          },
        });
      }
    },
    /**
     * 身份证号输入完成事件
     */
    handleIDCardNumberInputFinish() {
      const birthday = this.params.idCardNumber.substring(6, 14);
      this.params.birthday = dayjs(birthday).format("YYYY-MM-DD");
      this.params.gender = this.params.idCardNumber.substring(16, 17) % 2;
    },
    /**
     * 民族选择器改变回调
     */
    handleNationChange(e) {
      this.params.nation = this.nations[e.detail.value];
    },
    /**
     * 出生日期选择器改变回调
     */
    handleBirthdayChange(e) {
      this.params.birthday = e.target.value;
    },
    /**
     * 城市选择器改变回调
     */
    handleCityChange(e) {
      this.params.city = e.detail.value.map((item) => item.text).join("");
    },
    /**
     * 下一步点击事件
     */
    handleNextStepClick() {
      if (!this.chackInput()) return;

      // // 人脸识别
      wx.startFacialRecognitionVerify({
        name: this.params.name, // 姓名
        idCardNumber: this.params.idCardNumber, // 身份证号码
        // checkAliveType: "", 人脸核验的交互方式，默认读数字（见表1）
        success: (data) => {
          console.log(data, "sucess");
          // errCode为0时表示人脸通过完成
          if (data.errCode == 0) {
            api.authAcct({
              data: {
                userName: this.params.name,
                idCard: this.params.idCardNumber,
              },
              success: (res) => {
                const info = JSON.stringify({
                  ...this.params,
                  faceImg: staticData.faceImg,
                });
                uni.navigateTo({
                  url: `/pages/certificate/local-upload?info=${info}`,
                });
              },
            });
          }
        },
        fail: (err) => {
          console.log(err, "err");
        },
      });
      uni.setStorageSync("applicantInfo", this.params);
      return;
      const url = `http://120.42.37.86:10013/#/?psnName=${this.params.name}&idCard=${this.params.idCardNumber}&url=/pages/common/face-recognition-result&platform=miniProgram`;
      console.log(url);
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    /**
     * 请求数据
     */
    requestData() {
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
    chackInput() {
      if (!this.params.name) {
        this.$uni.showToast("请输入姓名");
        return false;
      }
      if (!this.params.idCardNumber) {
        this.$uni.showToast("请输入身份证号");
        return false;
      }
      if (!validateIDCardNumber(this.params.idCardNumber)) {
        this.$uni.showToast("身份证号格式错误，请重新输入");
        return false;
      }
      if (!this.params.gender) {
        this.$uni.showToast("请选择性别");
        return false;
      }
      if (!this.params.nation) {
        this.$uni.showToast("请选择民族");
        return false;
      }
      if (!this.params.birthday) {
        this.$uni.showToast("请选择出生日期");
        return false;
      }
      // const today = dayjs();
      // const birthday = dayjs(this.params.birthday);
      // if (today.diff(birthday, "year") < 60) {
      //   this.$uni.showAlert({
      //     content: "您未满60周岁，不满足申请条件",
      //   });
      //   return false;
      // }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.applicant-info {
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
      }
      &__accessory {
        @include square(48);
      }
      .city {
        @include text-line(2);
      }
    }
  }
  .next-step-button {
    margin: 128rpx 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    box-sizing: border-box;
  }
}
</style>
