//老页面之后要去掉
<template>
  <view class="additional-info">
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
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__indicator">*</text>
          <text class="row__label fs-40 c-black">血型(必填)</text>
          <picker
            class="flex-1 ml-48"
            :range="bloodTypes"
            @change="handleBloodTypeChange"
          >
            <text
              class="fs-40 c-black"
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
          <uni-data-picker
            class="flex-1 ml-48"
            popup-title="请选择所在地区"
            :localdata="cities"
            v-slot:default="{ data, error, options }"
            @change="handleCityChange"
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
              请选择所在地区
            </text>
          </uni-data-picker>
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
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__indicator">*</text>
          <text class="row__label--small fs-40 c-black"> 办证机构(必填) </text>
          <image
            class="row__illustration ml-12"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-illustration.png"
          />
          <picker
            class="flex-1 ml-36"
            :range="institutions"
            @change="handleInstitutionChange"
          >
            <text
              class="fs-40 c-black"
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
      </view>
    </view>
    <view class="section">
      <view class="section-header flex-h flex-c-s p-0-32">
        <image
          class="section-header__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-contact-info.png"
        />
        <text class="fs-44 c-black ml-16">紧急联系人</text>
      </view>
      <view class="form m-0-32">
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
          <text class="row__label fs-40 c-black mr-48">联系电话(必填)</text>
          <input
            class="fs-40 c-black flex-1"
            type="number"
            maxlength="11"
            placeholder="请输入联系电话"
            placeholder-class="placeholder"
            v-model="params.phoneNumber"
          />
        </view>
      </view>
    </view>
    <view v-if="needsMaterial" class="section">
      <view class="section-header flex-h flex-c-s p-0-32">
        <image
          class="section-header__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-material-info.png"
        />
        <text class="fs-44 c-black ml-16">上传证明材料</text>
      </view>
      <view class="form m-0-32">
        <view
          class="item"
          v-for="(item, index) in params.materials"
          :key="index"
        >
          <view class="row flex-h flex-c-s p-20-0">
            <text class="row__indicator">*</text>
            <text class="row__label--small fs-40 c-black"> 材料类型 </text>
            <image
              class="row__illustration ml-12"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-illustration.png"
            />
            <picker
              class="flex-1 ml-36"
              :id="index"
              :range="materialTypes"
              @change="handleMaterialTypeChange"
            >
              <text
                class="fs-40 c-black"
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
            class="photo mb-32"
            :src="item.url"
            mode="scaleToFill"
            @click="handlePhotoPickerClick(index)"
          />
          <view
            v-else
            class="photo-picker flex-v flex-c-c"
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
        <button
          v-if="params.materials.length < materialTypes.length"
          class="add-button fs-40 c-primary"
          hover-class="none"
          @click="handleAddMaterialClick"
        >
          添加更多证明材料
        </button>
      </view>
    </view>
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
import api from "@/apis/index.js";
import dayjs from "dayjs";
import { validatePhoneNumber } from "@/utils/validation.js";
export default {
  components: { UniDataPicker },
  data() {
    return {
      // 血型选择器数据
      bloodTypes: ["A型", "B型", "AB型", "O型", "不清楚"],
      // 城市选择器数据
      cities: [],
      // 办证机构选择器数据
      institutions: ["中国老龄协会老年人才信息中心"],
      // 是否需要上传材料
      needsMaterial: false,
      // 材料类型选择器数据
      materialTypes: ["残疾证"],
      // 上一个页面传过来的数据
      info: {},
      // 表单数据
      params: {
        bloodType: "",
        city: "",
        address: "",
        institution: "",
        name: "",
        phoneNumber: "",
        materials: [{ type: "", url: "" }],
      },
    };
  },
  onLoad(e) {
    this.info = JSON.parse(e.info);

    this.requestData();
  },
  methods: {
    /**
     * 血型选择器改变回调
     */
    handleBloodTypeChange(e) {
      this.params.bloodType = this.bloodTypes[e.detail.value];
    },
    /**
     * 城市选择器改变回调
     */
    handleCityChange(e) {
      this.params.city = e.detail.value.map((item) => item.text).join("");
      this.needsMaterial = this.params.city.indexOf("北京") !== -1;
    },
    /**
     * 办证机构改变回调
     */
    handleInstitutionChange(e) {
      this.params.institution = this.institutions[e.detail.value];
    },
    /**
     * 材料类型改变回调
     */
    handleMaterialTypeChange(e) {
      const type = this.materialTypes[e.detail.value];
      const selectedTypes = this.params.materials.map((item) => item.type);
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
      if (this.params.materials.length === this.materialTypes.length) return;
      this.params.materials.push({ type: "", url: "" });
    },
    /**
     * 上一步点击事件
     */
    handlePreviousStepClick() {
      uni.navigateBack();
    },
    /**
     * 提交审核点击事件
     */
    handleSubmitClick() {
      if (!this.checkInput()) return;

      const userInfo = uni.getStorageSync("userInfo");
      const data = {
        appId: "53928a083adb4a7dad2eecf05564873f",
        idNo: this.info.idCardNumber,
        idType: "身份证",
        name: this.info.name,
        ecCertPhoto: this.info.faceImg,
        ecCertExtendDTO: {
          birthday: this.info.birthday,
          psnNo: this.info.idCardNumber,
          name: this.info.name,
          sex: this.info.gender === 1 ? "男" : "女",
          nation: this.info.nation,
          blood: this.params.bloodType,
          residentialAddress: this.params.city + this.params.address,
          emergencyContact: this.params.name,
          emergencyPhone: this.params.phoneNumber,
          memo: "",
          licenceAuthority: this.params.institution,
          licenceDate: dayjs().format("YYYY-MM-DD"),
          permanentAddress: this.info.city + this.info.address,
        },
        ecCertAttachDTOS: [
          {
            psnNo: userInfo.psnId,
            attachFileName: "军官证",
            attachFilePath: "证件图片地址",
          },
        ],
      };
      api.applyCertificate({
        data: data,
        success: () => {
          uni.reLaunch({
            url: "/pages/certificate/submit-result",
          });
        },
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
    /**
     * 输入信息校验
     */
    checkInput() {
      if (!this.params.bloodType) {
        this.$uni.showToast("请选择血型");
        return false;
      }
      if (!this.params.city) {
        this.$uni.showToast("请选择现居住地址所在地区");
        return false;
      }
      if (!this.params.address) {
        this.$uni.showToast("请输入现居住地址详细地址");
        return false;
      }
      if (!this.params.institution) {
        this.$uni.showToast("请选择办证机构");
        return false;
      }
      const userInfo = { ...uni.getStorageSync("userInfo"), ...this.info };
      if (!this.params.name) {
        this.$uni.showToast("请输入紧急联系人姓名");
        return false;
      }
      if (this.params.name === userInfo.name) {
        this.$uni.showToast({
          title: "不能添加本人为紧急联系人，请重新输入",
          duration: 3000,
        });
        return false;
      }
      if (!this.params.phoneNumber) {
        this.$uni.showToast("请输入紧急联系人联系电话");
        return false;
      }
      if (!validatePhoneNumber(this.params.phoneNumber)) {
        this.$uni.showToast("紧急联系人联系电话格式错误，请重新输入");
        return false;
      }
      if (this.params.phoneNumber === userInfo.phoneNumber) {
        this.$uni.showToast({
          title: "不能使用本人电话作为紧急联系人电话，请重新输入",
          duration: 3000,
        });
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.additional-info {
  .selectValue {
    width: 400rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 40rpx;
    text-align: center;
  }
  .section {
    border-bottom: 16rpx solid $color-line;
    &-header {
      height: 88rpx;
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
        border-bottom: 2rpx solid #ebedf0;
        .photo {
          width: 100%;
          height: 200rpx;
        }
        .photo-picker {
          height: 200rpx;
          border: 2rpx dashed #cecece;
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
      .add-button {
        @include size(440, 72);
        margin: 32rpx auto;
        line-height: 72rpx;
        border-radius: 36rpx;
        border: 2rpx solid $color-primary;
        box-sizing: border-box;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: calc(100vw - 64rpx);
    padding: 32rpx 32rpx 64rpx;
    border-top: 2rpx solid $color-line;
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
