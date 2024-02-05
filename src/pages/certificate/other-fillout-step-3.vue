<template>
  <view class="fillout-step-3">
    <step-progress-bar :step="3" />
    <view class="section">
      <view class="section-header flex-h flex-c-s p-0-32">
        <image
          class="section-header__icon"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-material-info.png"
        />
        <text class="fs-44 c-black ml-16">上传证明材料</text>
      </view>
      <view class="form">
        <view
          class="item p-0-32"
          v-for="(item, index) in params.materials"
          :key="index"
        >
          <view class="row flex-h flex-c-s p-20-0">
            <text class="row__indicator"></text>
            <text class="row__label--small fs-40 c-black"> 材料类型 </text>
            <image
              class="row__illustration ml-12"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-illustration.png"
            />
            <picker
              class="flex-1"
              :id="index"
              :range="materialTypes"
              @change="handleMaterialTypeChange"
            >
              <text
                class="fs-40 c-black flex-1 ml-36"
                :class="{ 'c-lightgrey': item.type === '' }"
              >
                {{ item.type || "请选择材料类型" }}
              </text>
            </picker>
            <image
              class="row__accessory"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
            />
          </view>
          <view class="row flex-h flex-c-b">
            <text class="fs-40 c-black">上传图片</text>
            <button
              class="see-example fs-36"
              hover-class="none"
              @click="handleSeeExampleClick(index)"
            >
              查看示例
            </button>
          </view>
          <image
            v-if="item.url"
            mode="scaleToFill"
            class="photo mb-32"
            :src="item.url"
            @click="handlePhotoPickerClick(index)"
          />
          <view
            v-else
            class="photo-picker flex-v flex-c-c mb-32"
            @click="handlePhotoPickerClick(index)"
          >
            <image
              class="photo-picker__icon"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-select-photo.png"
            />
            <text class="photo-picker__text fs-32 c-black mt-16">
              点击上传图片
            </text>
          </view>
          <button
            v-if="params.materials.length > 1"
            class="delete-button fs-40"
            hover-class="none"
            @click="handleDeleteMaterialClick(index)"
          >
            删除
          </button>
        </view>
      </view>
    </view>
    <button
      v-if="params.materials.length < materialTypes.length"
      class="add-button fs-40 c-primary"
      hover-class="none"
      @click="handleAddMaterialClick"
    >
      添加更多证明材料
    </button>
    <view style="width: 100vw; height: 336rpx"></view>
    <view class="footer bg-white">
      <view class="tips">
        <text class="fs-36" style="color: #424141">我承诺</text>
        <text class="fs-36" style="color: #0097fe">
          以上填写信息为真实有效信息具有法律效益
        </text>
      </view>
      <view class="actions flex-h flex-c-b mt-32">
        <button
          class="action fs-44 c-primary bg-white border"
          @click="handlePreviousStepClick"
        >
          上一步
        </button>
        <button
          class="action fs-44 c-white bg-primary"
          @click="handleSubmitClick"
        >
          提交审核
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import StepProgressBar from "./components/step-progress-bar.vue";
import dayjs from "dayjs";
import api from "@/apis/index.js";
import NavigationBar from "../../components/common/navigation-bar.vue";
// TODO 引入写死图片base64
import staticData from "@/utils/dataBase64.js";
export default {
  components: { StepProgressBar, NavigationBar },
  data() {
    return {
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 材料类型选择器数据
      materialTypes: ["A证", "B证", "C证"],
      // 表单数据
      params: {
        materials: [{ type: "", url: "" }],
      },
    };
  },
  onLoad() {
    this.setData();
  },
  methods: {
    // 返回上一页
    handleNavigationBack() {
      this.$uni.showConfirm({
        content: "您确定要中断申领电子老年人证吗?",
        confirmText: "继续申领",
        cancelText: "放弃申领",
        title: "",
        cancel: () => {
          uni.navigateBack({
            delta: 1,
          });
        },
      });
    },
    /**
     * 材料类型改变回调
     */
    handleMaterialTypeChange(e) {
      const type = this.materialTypes[e.detail.value];
      const selectedTypes = this.params.materials
        .filter((item, index) => {
          return Number(index) !== Number(e.target.id);
        })
        .map((item) => item.type);
      if (selectedTypes.indexOf(type) !== -1) {
        this.$uni.showToast(`不可重复选择${type}`);
        return;
      }
      this.params.materials[e.target.id].type = type;
    },
    /**
     * 查看示例点击事件
     */
    handleSeeExampleClick(index) {
      uni.previewImage({
        urls: ["https://xueyinonline.com/images/portal/certificate/myzs01.png"],
      });
    },
    /**
     * 选择图片点击事件
     */
    handlePhotoPickerClick(index) {
      uni.chooseImage({
        success: (res) => {
          this.params.materials[index].url = res.tempFilePaths[0];
        },
      });
    },
    /**
     * 删除材料点击事件
     */
    handleDeleteMaterialClick(index) {
      this.params.materials.splice(index, 1);
    },
    /**
     * 添加更多证明材料点击事件
     */
    handleAddMaterialClick() {
      this.params.materials.push({ type: "", url: "" });
    },
    /**
     * 上一步点击事件
     */
    handlePreviousStepClick() {
      uni.$emit("didFilloutStepBack", this.params);
      uni.navigateBack();
    },
    /**
     * 提交审核点击事件
     */
    handleSubmitClick() {
      const params = this.params;
      const userInfo = uni.getStorageSync("userInfo");
      const domicileCity = params.city || params.domicileCity;
      const domicileAddress = params.address || params.domicileAddress;
      const residentialCity = params.residentialCity;
      const residentialAddress = params.residentialAddress;
      console.log("===最后提交的数据---", params);

      api.getCertificateState({
        data: {
          appId: "53928a083adb4a7dad2eecf05564873f",
          idType: "身份证",
          userName: params.name,
          idNo: params.idCardNumber,
        },
        showsLoading: true,
        success: (data) => {
          const authState = data.authState;
          // 判断卡状态
          if (
            authState === "1" ||
            authState === "2" ||
            authState === "4" ||
            authState === "6"
          ) {
            // 卡状态为 1, 无需操作
            this.$uni.showToast("提交失败，该实名用户已在其他平台提交申请");
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/index/index",
              });
            }, 3000);
          } else if (authState === "2") {
            // 卡状态为 2, 请求获取授权码接口

            console.log("请求获取授权码接口data", {
              uactId: params.uactId,
              psnName: params.name,
              certNo: params.idCardNumber,
              appId: "53928a083adb4a7dad2eecf05564873f",
            });
            api.getAuthorizationCode({
              data: {
                uactId: params.uactId,
                psnName: params.name,
                certNo: params.idCardNumber,
                appId: "53928a083adb4a7dad2eecf05564873f",
              },
              showsLoading: true,
              success: (res) => {
                this.$uni.showToast("提交失败，该实名用户已在其他平台提交申请");
                setTimeout(() => {
                  uni.reLaunch({
                    url: "/pages/index/index",
                  });
                }, 3000);
              },
            });
          } else if (authState === "3" || authState === "5") {
            const data = {
              appId: "53928a083adb4a7dad2eecf05564873f",
              idNo: params.idCardNumber,
              idType: "身份证",
              name: params.name,
              ecCertPhoto: staticData.faceImg, // params.faceImg,
              dataOr: "0",
              nwaFlag: "1",
              ecCertExtendDTO: {
                birthday: params.birthday,
                psnNo: params.idCardNumber,
                name: params.name,
                sex: params.gender == 1 ? "男" : "女",
                nation: params.nation,
                blood: params.bloodType,
                residentialAddress: residentialCity + residentialAddress,
                emergencyContact: params.contactList[0].name,
                emergencyPhone: params.contactList[0].phoneNumber,
                memo: "",
                licenceAuthority: params.institution,
                licenceDate: dayjs().format("YYYY-MM-DD"),
                permanentAddress: domicileCity + domicileAddress,
              },
              ecCertAttachDTOS: [
                {
                  // psnNo: userInfo.psnId,
                  attachFileName: "军官证",
                  attachFilePath: "证件图片地址",
                },
              ],
            };
            console.log("===最后提交的数据---data", data);
            // 接口TODO
            api.saveCard({
              data: data,
              showsLoading: true,
              success: () => {
                uni.reLaunch({
                  url: "/pages/certificate/other-submit-result",
                });
              },
            });
          }
        },
      });
      // #ifdef MP-WEIXIN
      // uni.getFileSystemManager().readFile({
      //   filePath: require('./static/05f08ce3a4c8ce77b5c0af61c35619c.jpg'),
      //   encoding: 'base64',
      //   showsLoading: true,
      //   success: (res) => {

      //   },
      // })
      // #endif

      // #ifdef MP-ALIPAY
      // const data = {
      //   appId: '53928a083adb4a7dad2eecf05564873f',
      //   idNo: params.idCardNumber,
      //   idType: '身份证',
      //   name: params.name,
      //   ecCertPhoto: staticData.faceImg, // params.faceImg,
      //   dataOr: '0',
      //   nwaFlag: '1',
      //   ecCertExtendDTO: {
      //     birthday: params.birthday,
      //     psnNo: params.idCardNumber,
      //     name: params.name,
      //     sex: params.gender == 1 ? '男' : '女',
      //     nation: params.nation,
      //     blood: params.bloodType,
      //     residentialAddress: residentialCity + residentialAddress,
      //     emergencyContact: params.contactList[0].name,
      //     emergencyPhone: params.contactList[0].phoneNumber,
      //     memo: '',
      //     licenceAuthority: params.institution,
      //     licenceDate: dayjs().format('YYYY-MM-DD'),
      //     permanentAddress: domicileCity + domicileAddress,
      //   },
      //   ecCertAttachDTOS: [
      //     {
      //       // psnNo: userInfo.psnId,
      //       attachFileName: '军官证',
      //       attachFilePath: '证件图片地址',
      //     },
      //   ],
      // }
      // console.log('===最后提交的数据---data', data)
      // 接口TODO
      // api.saveCard({
      //   data: data,
      //   showsLoading: true,
      //   success: () => {
      //     api.getCertificateState({
      //       data: {
      //         appId: '53928a083adb4a7dad2eecf05564873f',
      //         idType: '身份证',
      //         userName: params.name,
      //         idNo: params.idCardNumber,
      //       },
      //       showsLoading: true,
      //       success: (data) => {
      //         const authState = data.authState
      //         // 判断卡状态
      //         if (authState === '1') {
      //           // 卡状态为 1, 无需操作
      //           uni.reLaunch({
      //             url: '/pages/certificate/other-submit-result',
      //           })
      //         } else if (authState === '2') {
      //           // 卡状态为 2, 请求获取授权码接口
      //           console.log('请求获取授权码接口data', {
      //             uactId: params.uactId,
      //             psnName: params.name,
      //             certNo: params.idCardNumber,
      //             appId: '53928a083adb4a7dad2eecf05564873f',
      //           })
      //           api.getAuthorizationCode({
      //             data: {
      //               uactId: params.uactId,
      //               psnName: params.name,
      //               certNo: params.idCardNumber,
      //               appId: '53928a083adb4a7dad2eecf05564873f',
      //             },
      //             showsLoading: true,
      //             success: (res) => {
      //               uni.reLaunch({
      //                 url: '/pages/certificate/other-submit-result',
      //               })
      //             },
      //           })
      //         }
      //       },
      //     })
      //   },
      // })

      // #endif
    },
    /**
     * 设置数据
     */
    setData() {
      const eventChannel = this.getOpenerEventChannel();
      if (!eventChannel.on) return;
      eventChannel.on("didOpenPageFinish", (data) => {
        this.params = { ...this.params, ...data };
        console.log("获取的参数3params：", this.params);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fillout-step-3 {
  background-color: #fff;
  height: 100vh;
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
        .see-example {
          color: #0097fe;
        }
      }
      .item {
        border-bottom: 16rpx solid #f5f5f5;
        .photo {
          display: block;
          width: 100%;
          height: 200rpx;
        }
        .photo-picker {
          height: 200rpx;
          border: 2rpx dashed #cecece;
          box-sizing: border-box;
          &__icon {
            @include square(92);
          }
        }
        .delete-button {
          margin: 16rpx auto;
          color: #eb3030;
          line-height: 80rpx;
        }
      }
    }
  }
  .add-button {
    @include size(440, 72);
    margin: 32rpx auto;
    line-height: 72rpx;
    border-radius: 36rpx;
    border: 2rpx solid $color-primary;
    box-sizing: border-box;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: calc(100vw - 64rpx);
    padding: 32rpx 32rpx 64rpx;
    border-top: 2rpx solid $color-line;
    z-index: 100;
    .actions {
      .action {
        @include size(328, 108);
        line-height: 108rpx;
        border-radius: 54rpx;
      }
      .border {
        border: 2rpx solid $color-primary;
        box-sizing: border-box;
      }
    }
  }
}
</style>
