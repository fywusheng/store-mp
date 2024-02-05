<template>
  <view class="pay-way-list">
    <uni-popup ref="popup" type="bottom" :mask-click="showsCancel">
      <view class="popup bg-white">
        <view class="popup-header">
          <image
            class="icon-back"
            :src="icon.back"
            @click="handleCancelClick"
          />
          <text class="title">请选中支付方式</text>
        </view>
        <view class="popup-content">
          <view
            v-for="(item, index) in list"
            :key="item.recordId"
            class="list-item"
            @click="handleItemClick(index)"
          >
            <image class="icon-bank" :src="item.bankIcon" />
            <text class="item-back-name"
              >{{ item.bankName }}({{ item.encryptCardNum }})</text
            >
            <image
              v-if="index === selectIndex"
              class="icon-checked"
              :src="icon.checked"
            />
          </view>
          <!-- <view class="list-item" @click="handleItemClick">
                <image class="icon-bank" :src="icon.balance" />
                <text class="item-balance">余额(剩余23元)</text>
                <image class="icon-checked" :src="icon.checked" />
            </view> -->
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import UniPopup from "@/components/uni-popup/uni-popup.vue";
export default {
  components: { UniPopup },
  props: {
    title: {
      type: String,
      default: "",
    },
    showsCancel: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    selectIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      icon: {
        back: "https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-arrow-left.png",
        balance:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-balance.png",
        checked:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-checked.png",
      },
    };
  },
  methods: {
    /**
     * 取消点击事件
     */
    handleCancelClick() {
      this.$refs.popup.close();
      this.$emit("back");
    },
    /**
     * 选中支付方式
     */
    handleItemClick(index) {
      this.$refs.popup.close();
      this.$emit("select", index);
    },
    /**
     * 给外部调用的方法
     */
    open() {
      this.$refs.popup.open();
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-way-list {
  .popup {
    border-radius: 16rpx 16rpx 0 0;
    .popup-header {
      height: 150rpx;
      line-height: 150rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-bottom: 2rpx solid #eeeeee;
      .icon-back {
        width: 44rpx;
        height: 44rpx;
        position: absolute;
        left: 18rpx;
        top: 54rpx;
      }
      .title {
        color: #222121;
        font-size: 40rpx;
      }
    }
    .popup-content {
      display: block;
      text-align: center;
      padding-bottom: 62rpx;
      .list-item {
        display: flex;
        align-items: center;
        height: 120rpx;
        padding: 0 38rpx 0 30rpx;
        border-bottom: 2rpx solid #eeeeee;
        .icon-bank {
          width: 48rpx;
          height: 48rpx;
          margin-right: 14rpx;
        }
        .icon-checked {
          width: 36rpx;
          height: 24rpx;
          margin-left: auto;
        }
        .item-balance {
          color: #999999;
        }
      }
    }
  }
}
</style>
