//新版身份证扫描回显页面
<template>
  <view class="identity-info">
    <!-- #ifdef MP-ALIPAY -->
    <view class="top" v-if="showTop"></view>
    <view class="notop" v-else></view>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <view class="top" v-if="showTop">
      <image
        class="icon-back"
        @click="handleBack"
        src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-arrow-left.png"
        mode="scaleToFill"
      />
    </view>
    <view class="notop" v-else></view>
    <!-- #endif -->

    <view class="form f-s-40">
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">姓名(必填)</text>
        <input
          class="fs-40 c-black flex-1 p-r-48"
          placeholder="请输入姓名"
          placeholder-class="placeholder"
          v-model="params.name"
        />
        <view class="delete" v-if="params.name.length > 0" @click="clearName">
          <image
            class="icon-delete"
            src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-input-delete.png"
            @click="handleDel"
          />
        </view>
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">身份证号(必填)</text>
        <input
          class="fs-40 c-black flex-1 p-r-48"
          type="idcard"
          placeholder="请输入身份证号"
          placeholder-class="placeholder"
          v-model="params.idCardNumber"
          @input="handleIDCardNumberInputFinish"
        />
        <view
          class="delete"
          v-if="params.idCardNumber.length > 0"
          @click="clearNo"
        >
          <image
            class="icon-delete"
            src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-input-delete.png"
            @click="handleDel"
          />
        </view>
      </view>
      <view class="row flex-h flex-c-s p-20-0" v-if="scanInfor.type === 'scan'">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">性别(必填)</text>
        <radio-group class="flex-h flex-c-s flex-1" @change="radioChange">
          <label class="flex-h flex-c-s radio mr-64">
            <radio color="#ff5000" value="1" :checked="params.gender == '1'" />
            <text>男</text>
          </label>
          <label class="flex-h flex-c-s radio mr-64">
            <radio color="#ff5000" value="0" :checked="params.gender == '0'" />
            <text>女</text>
          </label>
        </radio-group>
      </view>
      <view class="row flex-h flex-c-s p-20-0" v-if="scanInfor.type === 'scan'">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">民族(必填)</text>
        <picker class="flex-1" :range="nations" @change="handleNationChange">
          <text
            class="fs-40 c-black flex-1"
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
      <view class="row flex-h flex-c-s p-20-0" v-if="scanInfor.type === 'scan'">
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
            class="fs-40 c-black flex-1"
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
      <view class="row flex-h flex-c-s p-20-0" v-if="scanInfor.type === 'scan'">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">户籍地址(必填)</text>
        <!-- #ifdef MP-ALIPAY -->
        <button @click="alipayChose" class="clickChose">
          {{ params.city || "请选择所在地区" }}
        </button>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <!-- <button @click="showPicker($event)" class="clickChose">{{params.city || '请选择所在地区'}}</button> -->
        <view class="content">
          <picker mode="region" @change="pickerCallback" v-model="region">
            <view class="picker fs-40">
              {{ params.city || "请选择所在地区" }}
            </view>
          </picker>
          <!-- <view class="aui-content" :style="{height: contentHeight}">
            <view class="aui-btn aui-btn-blue" @click.stop="showPicker($event)">
              {{params.city || '请选择所在地区'}}</view>
          </view> -->
          <!-- TODO  之前的uni-data-picker 不能正常使用了-->
          <!-- <area-picker ref="picker" :title="auiPicker.title" :layer="auiPicker.layer"
            :data="auiPicker.data" @callback="pickerCallback"></area-picker> -->
        </view>
        <!-- #endif -->
        <image
          class="row__accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view class="row flex-h flex-c-s p-20-0" v-if="scanInfor.type === 'scan'">
        <text class="row__indicator"></text>
        <input
          v-model="params.address"
          class="fs-40 c-black flex-1"
          placeholder="请输入详细地址"
          placeholder-class="placeholder"
        />
      </view>
    </view>
    <view
      class="rescan flex-h flex-c-c"
      v-if="scanInfor.type === 'scan'"
      @click="handleRescanClick"
    >
      <image
        class="rescan__icon"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-scan.png"
        @click="handleRescanClick"
      />
      <text class="rescan__text fs-44 ml-16">重新扫描</text>
    </view>
    <view
      class="next-step-button bg-primary fs-44 c-white"
      @click="handleNextStepClick"
    >
      下一步
    </view>

    <!-- #ifdef MP-ALIPAY -->
    <view class="next-step-button bg-cancel fs-44 c-white" @click="handleBack">
      关闭
    </view>
    <!-- #endif -->

    <show-points ref="showPoints" @success_flag="success_flag"></show-points>
  </view>
</template>

<script>
import dayjs from "dayjs";
import staticData from "@/utils/dataBase64.js";
import api from "@/apis/index.js";
import { startFacialRecognitionVerify } from "@/utils/utils.js";
import { validateIDCardNumber } from "@/utils/validation.js";
import { showPoints } from "@/pages/real-name-pop/showPoints.vue";
import { alipayCityChoose } from "@/utils/utils.js";
// import areaPicker from './area-picker.vue'
export default {
  components: { showPoints },
  props: {
    scanInfor: {
      type: Object,
      default: () => {},
    },
    showTop: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      auiPicker: {
        title: "请选择地区",
        layer: null,
        data: [],
      },
      region: [],
      repeatClick: "",
      isClick: true,
      alipayCitys: [],
      address: "",
      // 录入方式  scan: 扫描  input: 输入
      type: "",
      // 民族选择器数据
      nations: staticData.nations,
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
      realNmae: false,
      successFlag: "",
    };
  },
  created() {
    this.setData();
    this.getRegions();
    this.alipayHandler();
  },
  onUnload() {
    // 退出页面时销毁定时器
    if (this.successFlag) {
      console.log("执行onUnload");
      clearTimeout(this.successFlag);
      this.successFlag = null;
    }
  },
  destroyed() {
    console.log("页面销毁");
    clearTimeout();
  },
  methods: {
    showPicker(e) {
      this.$refs.picker.open().then(function () {
        console.log("picker打开");
      });
    },
    pickerCallback(e) {
      this.params.city = e.detail.value.join("");
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
    clearNo() {
      this.params.idCardNumber = "";
    },
    clearName() {
      this.params.name = "";
    },
    alipayChose() {
      const params = {
        list: this.alipayCitys,
        success: (city) => {
          this.params.city = city;
        },
      };
      alipayCityChoose(params);
    },
    success_flag(successFlag) {
      this.$emit("success_flag", successFlag);
    },
    radioChange(eve) {
      this.params.gender = eve.detail.value;
    },
    // 回退按钮事件
    handleBack() {
      this.$emit("closeModal");
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
      console.log(
        "===民族回调---",
        e.detail.value,
        this.nations[e.detail.value]
      );
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
     * 重新扫描点击事件
     */
    handleRescanClick() {
      uni.chooseImage({
        sourceType: ["camera"],
        success: (res) => {
          uni.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0],
            encoding: "base64",
            success: (rs) => {
              api.getIdentification({
                data: { image64: rs.data },
                showsLoading: true,
                success: (resinfo) => {
                  if (!resinfo.data) {
                    this.$uni.showToast("身份证识别失败");
                    return;
                  }
                  // 拍照完成后调用后端识别接口, 并将识别结果传入下个页面
                  const info = resinfo.data;
                  const data = {
                    name: info.name,
                    idCardNumber: info.id_num,
                    gender: info.sex,
                    birthday: info.birth,
                    nation: info.nation,
                    address: info.address,
                  };
                  this.backfillData(data);
                },
              });
            },
          });
        },
      });
    },
    /**
     * 身份证校验,是否实名认证  女2 -男1
     *  code:
     *  900005  message: "姓名或身份证号输入有误"
        0 正常
        900001  性别选择有误，请重新选择
        900002  出生日期选择有误，请重新选择
     */
    validateCardC() {
      const params = {
        idCard: this.params.idCardNumber,
        gend: this.params.gender == 0 ? 2 : 1,
        brdy: this.params.birthday,
        userName: this.params.name,
      };
      const inputparams = {
        idCard: this.params.idCardNumber,
        userName: this.params.name,
      };
      const pars = this.type == "input" ? inputparams : params;
      console.log("身份证校验params55599--:", pars);
      return new Promise((resolve, reject) => {
        api.validateCard({
          showsLoading: true,
          data: { ...pars },
          success: (res) => {
            if (res) {
              resolve(res);
            }
          },
          fail: (res) => {
            this.$uni.showToast(res.message);
            reject(false);
          },
        });
      });
    },
    // 查询卡状态  TODO
    getCertificateState(name, card) {
      return new Promise((resolve, reject) => {
        api.getCertificateState({
          data: {
            appId: "53928a083adb4a7dad2eecf05564873f",
            idType: "身份证",
            userName: name,
            idNo: card,
          },
          success: (data) => {
            resolve(data);
          },
          fail: (error) => {
            reject(error);
          },
        });
      });
    },

    /**
     * 下一步点击事件
     */

    async handleNextStepClick() {
      console.log("---点击事件--");
      const status = await this.chackInput();
      if (!status) {
        return;
      }

      const params = {
        name: this.params.name,
        idCard: this.params.idCardNumber,
        returnUrl: "",
      };
      params.success = () => {
        // 进行实名认证
        api.realPersonAuthenticate({
          data: {
            userName: this.params.name,
            idCard: this.params.idCardNumber,
          },
          showsLoading: true,
          success: (res) => {
            const userInfo = uni.getStorageSync("userInfo");
            api.checkLogOutUser({
              data: { uactId: userInfo.uactId },
              success: (data) => {
                console.log("===是否注销过---", data);
                if (!data) {
                  this.$refs.showPoints.showsCreditsPopup = true;
                } else {
                  this.$emit("success_flag", 1);
                  // uni.navigateTo({ url: `/pages/user-center/real-name-result2?back=${'/pages/index/index'}&index=4` })
                }
              },
            });
            //  this.successFlag = setTimeout(()=>{
            //     this.$emit("success_flag",1)
            //   },3000)
          },
          fail: (erro) => {
            console.log("===异常---", erro);
            this.isClick = true;
            this.$uni.showToast(erro.message);
          },
        });
      };
      params.fail = () => {
        console.log("唤起失败！！！！");
      };
      // 开启人脸识别
      startFacialRecognitionVerify(params);
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      api.getUserInfo({
        data: {
          accessToken: uni.getStorageSync("token"),
        },
        success: (data) => {
          const userinfor = data;
          uni.setStorageSync("userInfo", userinfor);
          uni.$emit("didLogin", data);
          // setTimeout(uni.navigateBack, 1500);
        },
      });
    },
    /**
     * 设置数据
     */
    setData() {
      // TODO 不处理
      console.log("===读取props中的数据---", this.scanInfor.type);
      //  this.scanInfor.type = this.type
      switch (this.scanInfor.type) {
        case "scan":
          this.backfillData(this.scanInfor.info);
          // this.$uni.setTitle('身份信息确认')
          break;
        case "input":
          // this.$uni.setTitle('身份信息')
          break;
      }
    },
    /**
     * 数据回填
     */
    backfillData(info) {
      this.params.name = info.name;
      this.params.idCardNumber = info.idCardNumber;
      this.params.gender = info.gender === "男" ? 1 : 0;
      this.params.nation = `${info.nation}族`;
      this.params.birthday = info.birthday
        .replace("年", "-")
        .replace("月", "-")
        .replace("日", "");
      const regex = /.+?(省|市|自治区|自治州|县|区)/g;
      const city = info.address.match(regex).join("");
      this.params.city = city;
      //  const address = info.address.replace(city, '')
      this.params.address = info.address;
      console.log("数据回填：", this.params);
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
                name: item.regnName,
                id: item.regnCode,
                children: map(item.children),
              };
            });
          }
          this.auiPicker.data = map(data);
        },
      });
    },
    /**
     * 输入信息校验
     */
    async chackInput() {
      const isScan = this.type === "scan";
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
      if (isScan && !(this.params.gender === 0 ? "女" : "男")) {
        this.$uni.showToast("请选择性别");
        return false;
      }
      if (isScan && !this.params.nation) {
        this.$uni.showToast("请选择民族");
        return false;
      }
      if (isScan && !this.params.birthday) {
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
      return await this.validateCardC();
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.bg-cancel {
  background: #ffffff;
  color: #999999;
}
.p-r-48 {
  padding-right: 66rpx;
}
.f-s-40 {
  font-size: 40rpx;
}
.delete {
  // z-index: 1000;
  width: 48rpx;
  height: 48rpx;
  position: absolute;
  // right: 36rpx;
  right: 0rpx;
  .icon-delete {
    width: 32rpx;
    height: 32rpx;
  }
}
.identity-info {
  // width:100%;
  width: 100vw;
  margin: 0 auto;
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
  .top {
    margin-top: 400rpx;
    position: relative;
    .icon-back {
      width: 36rpx;
      height: 47rpx;
      margin-left: 36rpx;
    }
  }
  .notop {
    position: relative;
    .icon-back {
      width: 36rpx;
      height: 47rpx;
      margin-left: 36rpx;
    }
  }
  .form {
    width: 88%;
    margin: 0 auto;
    position: relative;
    margin-bottom: 32rpx;
    .row {
      min-height: 120rpx;
      border-bottom: 2rpx solid $color-line;
      box-sizing: border-box;
      position: relative;
      &__indicator {
        width: 24rpx;
        text-align: center;
        color: #eb3030;
      }
      &__label {
        width: 200rpx;
      }
      &__accessory {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        @include square(48);
      }
      .city {
        @include text-line(2);
      }
    }
  }
  .rescan {
    &__icon {
      @include square(48);
    }
    &__text {
      color: #0097fe;
    }
  }
  .next-step-button {
    margin: 128rpx 32rpx 0 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    box-sizing: border-box;
    margin-top: 19rpx;
    text-align: center;
  }
}
</style>
