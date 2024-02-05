//新版身份证扫描回显页面
<template>
  <view class="identity-info">
    <view class="form">
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">姓名(必填)</text>
        <input
          class="fs-40 c-black flex-1"
          placeholder="请输入姓名"
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
          placeholder="请输入身份证号"
          placeholder-class="placeholder"
          v-model="params.idCardNumber"
          @blur="handleIDCardNumberInputFinish"
        />
      </view>
      <view class="row flex-h flex-c-s p-20-0" v-if="type === 'scan'">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">性别(必填)</text>
        <radio-group class="flex-h flex-c-s flex-1" @change="radioChange">
          <label class="flex-h flex-c-s radio mr-64">
            <radio color="#ff5000" value="1" :checked="params.gender == 1" />
            <text>男</text>
          </label>
          <label class="flex-h flex-c-s radio mr-64">
            <radio color="#ff5000" value="0" :checked="params.gender == 0" />
            <text>女</text>
          </label>
        </radio-group>
      </view>
      <view class="row flex-h flex-c-s p-20-0" v-if="type === 'scan'">
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
      <view class="row flex-h flex-c-s p-20-0" v-if="type === 'scan'">
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
      <view class="row flex-h flex-c-s p-20-0" v-if="type === 'scan'">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">户籍地址(必填)</text>
        <!-- #ifdef MP-ALIPAY -->
        <button @click="localeChose" class="clickChose">
          {{ params.city || "请选择省、市、区" }}
        </button>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <picker mode="region" @change="pickerCallback" v-model="region">
          <view class="picker fs-40">
            {{ params.city || "请选择所在地区" }}
          </view>
        </picker>
        <!-- <uni-data-picker class="flex-1" popup-title="请选择所在地区" :localdata="cities"
          v-slot:default="{data, error, options}" @change="handleCityChange">
          <view v-if="data.length > 0" class="selectValue"><text v-for="(item,index) in data"
              :key="index">{{item.text}}</text></view>
          <text v-if="data.length == 0" class="city fs-40 c-black flex-1 ml-48"
            :class="{ 'c-lightgrey': data.length == 0 }">
            请选择所在地区
          </text>
        </uni-data-picker> -->
        <!-- #endif -->
        <image
          class="row__accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view class="row flex-h flex-c-s p-20-0" v-if="type === 'scan'">
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
      class="rescan flex-h flex-c-c mt-64"
      v-if="type === 'scan'"
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
    <button
      class="next-step-button bg-primary fs-44 c-white"
      @click="handleNextStepClick"
    >
      下一步
    </button>
    <show-points ref="showPoints" @success_flag="success_flag"></show-points>
  </view>
</template>

<script>
import dayjs from "dayjs";
import staticData from "@/utils/dataBase64.js";
import api from "@/apis/index.js";
import { startFacialRecognitionVerify } from "@/utils/utils.js";
import { validateIDCardNumber } from "@/utils/validation.js";
import { showPoints } from "./components/showPoints.vue";
import { alipayCityChoose } from "@/utils/utils.js";
export default {
  components: { showPoints },
  data() {
    return {
      alipayCitys: [],
      // 录入方式  scan: 扫描  input: 输入
      type: "",
      // 民族选择器数据
      nations: staticData.nations,
      // 城市选择器数据
      cities: [],
      region: [],
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
      value: [],
      realNmae: false,
    };
  },
  onLoad() {
    this.setData();
    this.getRegions();
    this.alipayHandler();
  },
  methods: {
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
    localeChose() {
      const params = {
        list: this.alipayCitys,
        success: (city) => {
          this.params.city = city;
        },
      };
      alipayCityChoose(params);
    },
    success_flag(successFlag) {
      // this.$emit("success_flag",successFlag)
    },
    radioChange(eve) {
      this.params.gender = eve.detail.value;
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
      const status = await this.chackInput();
      if (!status) return;

      const params = {
        name: this.params.name,
        idCard: this.params.idCardNumber,
        returnUrl: "",
      };
      console.log("提交的参数params:", params);
      // TODO 在没有接入亮证流程时，暂时实名操作只做实名认证操作 即：只要实名认证成功就跳实名认证成功页面 不在进入领证流程实名认证跳转入口

      params.success = async () => {
        console.log("认证成功------this.realName", this.realName);
        // 进行实名认证 身份信息+头像
        api.realPersonAuthenticate({
          data: {
            userName: this.params.name,
            idCard: this.params.idCardNumber,
            // faceImg: staticData.faceImg, //TODO图片base64为什么是写死的
          },
          showsLoading: true,
          success: async () => {
            // 实名操做
            uni.reLaunch({
              url: "/pages/user-center/real-name-result",
            });

            return;
            // ////////////////////////////////////后续操作等待接入领证流程后在放开//////////////////////////////
            if (this.realName) {
              // 实名操做
              uni.reLaunch({
                url: "/pages/user-center/real-name-result",
              });
            } else {
              // 领卡操作
              const cardState = await this.getCertificateState(
                this.params.name,
                this.params.idCardNumber
              );
              if (cardState.authState === "1" || cardState.authState === "2") {
                this.$uni.showToast("已经领取过卡了");
                uni.reLaunch({ url: "/pages/index/index" });
                // uni.reLaunch({ url: '/pages/certificate/electronic-card' })
                return;
              } else if (cardState.authState === "6") {
                // 其他渠道授權接口
                uni.redirectTo({
                  url: `/pages/certificate/platform-authorization?idCard=${this.params.idCardNumber}&name=${this.params.name}`,
                });

                return;
              } else {
                // const process_type = uni.getStorageSync('process_type')
                this.getUserInfo();
                this.clearBgImg(staticData.faceImg);
                const info = {
                  ...this.params,
                  faceImg: staticData.faceImg,
                  type: this.type,
                };
                console.log("---将要传递给人脸识别的上一级参数---", info);

                // if (process_type == '3') {

                // } else {
                uni.navigateTo({
                  url: "/pages/certificate/avatar-confirm",
                  success: (res) => {
                    console.log("====我来行---", info);
                    res.eventChannel.emit("didOpenPageFinish", info);
                  },
                });
                // }
              }
            }
          },
        });
      };
      // this.demo();
      // 开启人脸识别
      startFacialRecognitionVerify(params);
      // 调用活体检测, 各平台自带的或者大数据提供的, 成功后跳转到头像确认页面
      uni.setStorageSync("applicantInfo", this.params);
    },
    // 去背景图片
    clearBgImg(photoBase64) {
      api.clearBg({
        data: { photoBase64 },
        showsLoading: true,
        success: (resInfo) => {
          // 保存第一次人脸识别图片
          uni.setStorageSync("first-face-img", JSON.stringify(resInfo));
        },
      });
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
          uni.$emit("didLogin", data);
          // setTimeout(uni.navigateBack, 1500);
        },
      });
    },
    scanWatchData(data) {
      this.realName = data.realName;
      this.type = data.type;
      switch (this.type) {
        case "scan":
          // this.$uni.setTitle('身份信息确认')
          this.backfillData(data.info);
          break;
        case "input":
          // this.$uni.setTitle('身份信息')
          break;
      }
    },
    /**
     * 设置数据
     */
    setData() {
      // #ifdef MP-ALIPAY
      const data = uni.getStorageSync("scanData");
      this.scanWatchData(data);
      // #endif
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on("didOpenPageFinish", (data) => {
        this.scanWatchData(data);
        // console.log('身份证数据data:', data)
        // this.realName = data.realName
        // this.type = data.type
        // console.log('this.realName',this.realName)
        // console.log('this.type',this.type)
        // switch (this.type) {
        //   case 'scan':
        //     this.$uni.setTitle('身份信息确认')
        //     this.backfillData(data.info)
        //     break
        //   case 'input':
        //     this.$uni.setTitle('身份信息')
        //     break
        // }
      });
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
      const address = info.address.replace(city, "");
      this.params.address = address;
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
.identity-info {
  background-color: #fff;
  height: 100vh;
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
    padding: 32rpx;
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
        top: 50%;
        right: 0;
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
    margin: 128rpx 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    box-sizing: border-box;
  }
}
</style>
