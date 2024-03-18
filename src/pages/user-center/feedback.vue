<template>
  <view class="feedback">
    <view class="section bg-white">
      <section-header title="反馈问题详情"></section-header>
      <view class="line m-0-32"></view>
      <textarea v-model="content" class="textarea fs-40 c-black m-32"
        placeholder="请输入您需要反馈的内容(500字以内)" placeholder-class="placeholder"
        maxlength="500"></textarea>
    </view>
    <view class="section bg-white">
      <section-header title="上传图片"></section-header>
      <view class="line m-0-32"></view>
      <view class="images flex-h flex-wrap m-32">
        <view class="item mr-32 mb-32" v-for="(item, index) in images" :key="index">
          <image class="image" :src="item" mode="scaleToFill" />
          <image class="delete" mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-input-clear.png"
            @click="handleDeletePhotoClick(index)" />
        </view>
        <view class="item mr-32 mb-32" v-if="images.length < 9">
          <image class="image" mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-add-photo.png"
            @click="handlePhotoPickerClick" />
        </view>
      </view>
    </view>
    <view class="section bg-white">
      <section-header title="联系方式">
        <input v-model="contact" class="input fs-40 c-black" placeholder="请输入"
          placeholder-class="placeholder" />
      </section-header>
    </view>
    <view class="tips fs-36 c-lightgrey">
      请留下您的联系方式(微信号/QQ/邮箱)，反馈的相关问题我们会第一时间为您解答。
    </view>
    <button class="submit-button fs-44 c-white" @click="handleSubmitClick">
      提交
    </button>
  </view>
</template>

<script>
import SectionHeader from '../../components/common/section-header.vue'
import api from '@/apis/index.js'
export default {
  components: { SectionHeader },
  data() {
    return {
      // 输入的文字
      content: '',
      // 选中的图片
      images: [],
      // 上传后的文件地址
      imageURLs: '',
      // 联系方式
      contact: ''
    }
  },
  onLoad() {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo) this.contact = userInfo.tel
  },
  methods: {
    /**
     * 选取照片点击事件
     */
    handlePhotoPickerClick() {
      uni.chooseImage({
        count: 9 - this.images.length,
        success: (res) => {
          res.tempFilePaths.forEach((item) => {
            uni.getFileSystemManager().readFile({
              filePath: item,
              encoding: 'base64',
              success: (res) => {
                const data = 'data:image/jpeg;base64,' + res.data
                this.images.push(data)
              }
            })
          })
        }
      })
    },
    /**
     * 删除照片点击事件
     */
    handleDeletePhotoClick(index) {
      this.images.splice(index, 1)
    },
    /**
     * 提交点击事件
     */
    handleSubmitClick() {
      // uni.navigateBack();
      this.images.length > 0 ? this.upload() : this.submit()
    },
    /**
     * 上传文件
     */
    upload() {
      api.uploadImages({
        data: {
          base64Strings: this.images,
          fileExt: 'png'
        },
        success: (data) => {
          this.imageURLs = data.absoluteUrl
          this.submit()
        }
      })
    },
    /**
     * 提交
     */
    submit() {
      if (!this.content) {
        this.$uni.showToast('请输入反馈内容')
        return
      }
      if (!this.contact) {
        this.$uni.showToast('请输入联系方式')
        return
      }
      api.feedback({
        data: {
          prbDscr: this.content,
          img: this.imageURLs,
          crterMob: this.contact
        },
        success: (data) => {
          this.$uni.showToast('提交成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.feedback {
  min-height: 100vh;
  background: #fbf9f7;
  .section {
    .line {
      @include line(686, 2);
    }
    .textarea {
      width: calc(100vw - 64rpx);
      height: 320rpx;
    }
    .images {
      .item {
        position: relative;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .image {
          @include square(202);
        }
        .delete {
          @include square(32);
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
    .input {
      // text-align: right;
      width: 50%;
      padding-top: 20rpx;
      text-align: right;
      margin-right: 68rpx;
    }
  }
  .tips {
    margin: 16rpx 32rpx;
  }
  .submit-button {
    margin: 72rpx 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>
