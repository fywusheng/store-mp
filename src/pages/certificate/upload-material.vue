<template>
  <view class="upload-material">
    <view class="form m-0-32">
      <view class="item" v-for="(item, index) in params.materials" :key="index">
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
    <button
      class="submit-button bg-primary fs-44 c-white"
      @click="handleSubmitClick"
    >
      下一步
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 材料类型选择器数据
      materialTypes: ["残疾证", "居住证"],
      // 表单数据
      params: {
        materials: [{ type: "", url: "" }],
      },
    };
  },
  methods: {
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
     * 提交点击事件
     */
    handleSubmitClick() {
      const materials = this.params.materials.filter((item) => item.type);
      const flag = materials.every((item) => {
        if (item.url) {
          return true;
        } else {
          this.$uni.showToast(`请上传${item.type}或删除该材料`);
          return false;
        }
      });
      if (!flag) return;
      console.log("upload");
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-material {
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
  .submit-button {
    margin: 128rpx 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    box-sizing: border-box;
  }
}
</style>
