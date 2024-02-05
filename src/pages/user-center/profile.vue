//个人中心
<template>
  <view class="profile">
    <view class="header bg-white flex-h flex-c-c">
      <image
        class="avatar"
        :src="avatarURL"
        @click="handleAvatarClick"
        mode="scaleToFill"
      />
      <image
        class="photo-picker"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-select-photo.png"
        @click="handlePhotoPickerClick"
      />
    </view>
    <view class="section mb-16">
      <view class="row flex-h flex-c-b p-0-32 bg-white">
        <text class="row__label flex-1 fs-40 c-grey">姓名</text>
        <text class="row__value fs-40 c-black">陈长生</text>
      </view>
      <view class="row flex-h flex-c-b p-0-32 bg-white">
        <text class="row__label flex-1 fs-40 c-grey">身份证号</text>
        <text class="row__value fs-40 c-black">35****************12</text>
      </view>
      <view class="row flex-h flex-c-b p-0-32 bg-white">
        <text class="row__label flex-1 fs-40 c-grey">手机号</text>
        <text class="row__value fs-40 c-black">18888888888</text>
        <image
          class="row__accessory ml-12"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
    </view>
    <view class="section mb-16">
      <view class="row flex-h flex-c-b p-0-32 bg-white">
        <text class="row__label flex-1 fs-40 c-grey">性别</text>
        <picker :range="genders" @change="handleGenderChange">
          <text
            class="row__value fs-40 c-black"
            :class="{ 'c-lightgrey': userInfo.gender === '' }"
          >
            {{ userInfo.gender || "请选择" }}
          </text>
        </picker>
        <image
          class="row__accessory ml-12"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view class="row flex-h flex-c-b p-0-32 bg-white">
        <text class="row__label flex-1 fs-40 c-grey">生日</text>
        <text class="row__value fs-40 c-black">1964-06-22</text>
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
          class="row__accessory ml-12"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view class="row flex-h flex-c-b p-0-32 bg-white">
        <text class="row__label flex-1 fs-40 c-grey">邮箱</text>
        <input
          class="row__input fs-40 c-black width-600"
          placeholder="请输入邮箱"
          placeholder-class="placeholder"
        />
      </view>
      <view class="row flex-h flex-c-b p-0-32 bg-white">
        <text class="row__label flex-1 fs-40 c-grey">常住地址</text>
        <uni-data-picker
          class="flex-1"
          popup-title="请选择所在地区"
          :localdata="cities"
          v-slot:default="{ data, error, options }"
          @change="handleCityChange"
        >
          <!-- <view>
             <text
            class="row__value fs-40 c-black"
            :class="{ 'c-lightgrey': userInfo.city === '' }"
          >
            {{ userInfo.city || "请选择" }}
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
        <image
          class="row__accessory ml-12"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view class="row flex-h flex-c-b p-0-32 bg-white">
        <text class="row__label flex-1 fs-40 c-grey">紧急联系电话</text>
        <input
          class="row__input fs-40 c-black width-400"
          placeholder="请输入紧急联系电话"
          placeholder-class="placeholder"
          type="number"
          maxlength="11"
        />
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";
export default {
  data() {
    return {
      // 性别选择器数据
      genders: ["男", "女"],
      // 城市选择器数据
      cities: [],
      // 用户信息
      userInfo: {
        avatar: "",
        gender: "",
        city: "",
      },
    };
  },
  computed: {
    // 头像地址
    avatarURL() {
      return (
        this.userInfo.avatar ||
        "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-default-avatar.png"
      );
    },
  },
  onLoad() {
    this.requestData();
  },
  methods: {
    /**
     * 头像点击事件
     */
    handleAvatarClick() {
      uni.previewImage({
        urls: [this.avatarURL],
      });
    },
    /**
     * 选取头像点击事件
     */
    handlePhotoPickerClick() {
      uni.chooseImage({
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0];
        },
      });
    },
    /**
     * 性别选择器改变回调
     */
    handleGenderChange(e) {
      this.userInfo.gender = this.genders[e.target.value];
    },
    /**
     * 城市选择器改变回调
     */
    handleCityChange(e) {
      this.userInfo.city = e.detail.value.map((item) => item.text).join("");
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
  },
};
</script>

<style>
.uni-data-tree-input {
  display: flex;
  justify-content: flex-end;
}
</style>
<style lang="scss" scoped>
.profile {
  min-height: 100vh;
  background: #fbf9f7;
  .selectValue {
    width: 400rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 40rpx;
    text-align: center;
  }
  .header {
    position: relative;
    height: 300rpx;
    .avatar {
      @include square(200);
    }
    .photo-picker {
      @include square(60);
      position: absolute;
      bottom: 50rpx;
      left: 400rpx;
    }
  }
  .section {
    .row {
      height: 120rpx;
      border-bottom: 2rpx solid $color-line;
      &__input {
        text-align: right;
      }
      &__value {
        @include text-line(2);
        text-align: right;
      }
      &__accessory {
        @include square(48);
      }
      .width-600 {
        width: 600rpx;
      }
      .width-400 {
        width: 400rpx;
      }
    }
  }
}
</style>
