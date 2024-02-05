<template>
  <view class="electronic-certificate">
    <view class="front-side m-32">
      <image
        class="national-emblem"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/show-qrcode/icon-certificate-national-emblem.png"
      />
      <text class="title fs-36">中华人民共和国老年人证</text>
      <text class="name-title fs-20">
        姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名
      </text>
      <text class="name-value fs-20 c-black">{{ info.name }}</text>
      <text class="birthday-title fs-20">出生日期</text>
      <text class="birthday-value fs-20 c-black">
        {{ dateFilter(info.birthday) }}
      </text>
      <text class="id-card-number-title fs-20">公民身份号码</text>
      <text class="id-card-number-value fs-20 c-black">{{ info.psnNo }}</text>
      <text class="address-title fs-20">居住地址</text>
      <text class="address-value fs-20 c-black">
        {{ info.residentialAddress }}
      </text>
      <text class="gender-title fs-20">性别</text>
      <text class="gender-value fs-20 c-black">{{ info.sex }}</text>
      <text class="blood-type-title fs-20">血型</text>
      <text class="blood-type-value fs-20 c-black">{{ info.blood }}</text>
      <text class="card-number-title fs-16">编号</text>
      <text class="card-number-value fs-16 c-black">{{ cardNumber }}</text>
      <image class="avatar" :src="avatar" mode="scaleToFill" />
    </view>
    <view class="back-side m-32">
      <text class="contact-title fs-20">紧急联系人</text>
      <text class="contact-value fs-20 c-black">
        {{ info.emergencyContact }}
      </text>
      <text class="phone-number-title fs-20">联系电话</text>
      <text class="phone-number-value fs-20 c-black">
        {{ info.emergencyPhone }}
      </text>
      <text class="remark-title fs-20">
        备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注
      </text>
      <text class="organization-title fs-20">发证机关</text>
      <text class="organization-value fs-20 c-black">
        {{ info.licenceAuthority }}
      </text>
      <text class="date-title fs-20">发证日期</text>
      <text class="date-value fs-20 c-black">
        {{ dateFilter(info.licenceDate) }}
      </text>
      <text class="remark-value fs-20 c-black">{{ info.memo }}</text>
      <text class="copyright fs-16">
        中国老龄协会老年人才信息中心&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制
      </text>
      <canvas canvas-id="qr-code" id="qr-code" class="qr-code" />
    </view>
    <button
      class="manage-button fs-44 c-white"
      @click="handleManageButtonClick"
    >
      证照管理
    </button>
    <action-sheet
      ref="actionSheet"
      :items="actionSheetItems"
      @click="handleActionSheetItemClick"
    />
  </view>
</template>

<script>
import api from "@/apis/index.js";
import dayjs from "dayjs";
import generator from "uniapp-qrcode";
export default {
  data() {
    return {
      // 电子证号
      cardNumber: "",
      // 头像
      avatar: "",
      // 电子证信息
      info: {},
      // 弹窗选项
      actionSheetItems: [],
    };
  },
  onLoad() {
    this.requestData();
  },
  methods: {
    // 日期过滤器, 用于格式化日期
    dateFilter(value) {
      return dayjs(value).format("YYYY年MM月DD日");
    },
    /**
     * 证件管理点击事件
     */
    handleManageButtonClick() {
      this.actionSheetItems = [
        "证照信息变更",
        "更改绑定手机号",
        "添加赡养扶养人关系",
      ];
      this.$refs.actionSheet.open();
    },
    /**
     * action sheet 弹窗点击回调
     */
    handleActionSheetItemClick(index) {
      switch (this.actionSheetItems[index]) {
        case "证照信息变更":
          this.$uni.showToast("功能建设中，敬请期待。");
          break;
        case "更改绑定手机号":
          uni.navigateTo({
            url: "/pages/user-center/modify-phone-number",
          });
          break;
        case "添加赡养扶养人关系":
          uni.navigateTo({
            url: "/pages/support/index",
          });
          break;
      }
    },
    /**
     * 请求数据
     */
    requestData() {
      const userInfo = uni.getStorageSync("userInfo");
      api.getCertificateInfo({
        data: {
          chnlId: "53928a083adb4a7dad2eecf05564873f",
          authCode: userInfo.authCode,
        },
        success: (data) => {
          this.cardNumber = data.ecShowCardNo;
          this.avatar = data.ecCertPhoto;
          this.info = data.ecCertExtendDTO;
          generator.qrcode("qr-code", this.cardNumber, 112, 112);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.electronic-certificate {
  padding-bottom: 30rpx;
  .front-side,
  .back-side {
    @include size(686, 434);
    position: relative;
    // background: url("./static//bg-certificate-card.png");
    .national-emblem {
      @include size(90, 94);
      position: absolute;
      top: 34rpx;
      left: 54rpx;
    }
    .title {
      position: absolute;
      top: 62rpx;
      left: 152rpx;
      color: #2860a6;
      letter-spacing: 8rpx;
    }
    .name-title {
      position: absolute;
      top: 158rpx;
      left: 0;
      width: 152rpx;
      text-align: right;
      color: #2860a6;
    }
    .name-value {
      position: absolute;
      top: 158rpx;
      left: 164rpx;
    }
    .birthday-title {
      position: absolute;
      top: 214rpx;
      left: 0;
      width: 152rpx;
      text-align: right;
      color: #2860a6;
    }
    .birthday-value {
      position: absolute;
      top: 214rpx;
      left: 164rpx;
    }
    .id-card-number-title {
      position: absolute;
      top: 270rpx;
      left: 0;
      width: 152rpx;
      text-align: right;
      color: #2860a6;
    }
    .id-card-number-value {
      position: absolute;
      top: 270rpx;
      left: 164rpx;
    }
    .address-title {
      position: absolute;
      top: 324rpx;
      left: 0;
      width: 152rpx;
      text-align: right;
      color: #2860a6;
    }
    .address-value {
      position: absolute;
      top: 324rpx;
      left: 164rpx;
    }
    .gender-title {
      position: absolute;
      top: 158rpx;
      left: 384rpx;
      color: #2860a6;
    }
    .gender-value {
      position: absolute;
      top: 158rpx;
      left: 434rpx;
    }
    .blood-type-title {
      position: absolute;
      top: 216rpx;
      left: 384rpx;
      color: #2860a6;
    }
    .blood-type-value {
      position: absolute;
      top: 216rpx;
      left: 434rpx;
    }
    .card-number-title {
      position: absolute;
      top: 394rpx;
      left: 434rpx;
      color: #2860a6;
    }
    .card-number-value {
      position: absolute;
      top: 394rpx;
      left: 482rpx;
    }
    .avatar {
      @include size(120, 164);
      position: absolute;
      top: 132rpx;
      left: 520rpx;
    }
    .contact-title {
      position: absolute;
      top: 48rpx;
      left: 0;
      width: 152rpx;
      text-align: right;
      color: #2860a6;
    }
    .contact-value {
      position: absolute;
      top: 48rpx;
      left: 164rpx;
    }
    .phone-number-title {
      position: absolute;
      top: 102rpx;
      left: 0;
      width: 152rpx;
      text-align: right;
      color: #2860a6;
    }
    .phone-number-value {
      position: absolute;
      top: 102rpx;
      left: 164rpx;
    }
    .remark-title {
      position: absolute;
      top: 156rpx;
      left: 0;
      width: 152rpx;
      text-align: right;
      color: #2860a6;
    }
    .remark-value {
      position: absolute;
      top: 156rpx;
      left: 164rpx;
      max-width: 512rpx;
    }
    .organization-title {
      position: absolute;
      top: 290rpx;
      left: 342rpx;
      color: #2860a6;
    }
    .organization-value {
      position: absolute;
      top: 290rpx;
      left: 436rpx;
    }
    .date-title {
      position: absolute;
      top: 342rpx;
      left: 342rpx;
      color: #2860a6;
    }
    .date-value {
      position: absolute;
      top: 342rpx;
      left: 436rpx;
    }
    .qr-code {
      @include square(112);
      position: absolute;
      top: 248rpx;
      left: 92rpx;
    }
    .copyright {
      position: absolute;
      top: 390rpx;
      left: 496rpx;
      color: #2860a6;
    }
  }
  .manage-button {
    @include size(686, 108);
    position: fixed;
    bottom: 64rpx;
    margin: 0 32rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>
