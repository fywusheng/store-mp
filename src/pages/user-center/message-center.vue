<template>
  <view class="message-center">
    <view class="list" v-if="info.systemNotice">
      <view
        class="item flex-h flex-c-b p-0-32 bg-white"
        @click="handleItemClick(0)"
      >
        <image
          class="icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-announcement.png"
        />
        <view class="info flex-v m-0-32 flex-1">
          <text class="fs-36 c-black">
            {{ info.systemNotice.msgTypeName }}
          </text>
          <text class="fs-32 c-lightgrey mt-16 message">
            {{ info.systemNotice.latestMsgCont || "暂无最新消息" }}
          </text>
        </view>
        <text v-if="info.systemNotice.nreadCnt" class="unread fs-32 c-white">
          {{ info.systemNotice.nreadCnt }}
        </text>
        <image
          class="accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view
        class="item flex-h flex-c-b p-0-32 bg-white"
        @click="handleItemClick(1)"
      >
        <image
          class="icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-service-message.png"
        />
        <view class="info flex-v m-0-32 flex-1">
          <text class="fs-36 c-black">
            {{ info.serviceMessage.msgTypeName }}
          </text>
          <text class="fs-32 c-lightgrey mt-16 message">
            {{ info.serviceMessage.latestMsgCont || "暂无最新消息" }}
          </text>
        </view>
        <text v-if="info.serviceMessage.nreadCnt" class="unread fs-32 c-white">
          {{ info.serviceMessage.nreadCnt }}
        </text>
        <image
          class="accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view
        class="item flex-h flex-c-b p-0-32 bg-white"
        @click="handleItemClick(2)"
      >
        <image
          class="icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-system-notice.png"
        />
        <view class="info flex-v m-0-32 flex-1">
          <text class="fs-36 c-black">
            {{ info.systemMessage.msgTypeName }}
          </text>
          <text class="fs-32 c-lightgrey mt-16 message">
            {{ info.systemMessage.latestMsgCont || "暂无最新消息" }}
          </text>
        </view>
        <text v-if="info.systemMessage.nreadCnt" class="unread fs-32 c-white">
          {{ info.systemMessage.nreadCnt }}
        </text>
        <image
          class="accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
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
      // 最新消息
      info: {},
    };
  },
  onShow() {
    this.requestData();
    uni.$on("didMessageStateChanged", this.requestData);
  },
  // onLoad() {
  //   this.requestData()

  //   uni.$on('didMessageStateChanged', this.requestData)
  // },
  onUnload() {
    uni.$off("didMessageStateChanged");
  },
  methods: {
    handleItemClick(index) {
      // if (index === 0 && !this.info.systemNotice.latestMsgTime) return;
      // if (index === 1 && !this.info.serviceMessage.latestMsgTime) return;
      // if (index === 2 && !this.info.systemMessage.latestMsgTime) return;
      const titles = [
        this.info.systemNotice.msgTypeName,
        this.info.serviceMessage.msgTypeName,
        this.info.systemMessage.msgTypeName,
      ];
      const types = [3, 1, 2];
      uni.navigateTo({
        url: "/pages/user-center/message-list",
        success: (res) => {
          res.eventChannel.emit("didOpenPageFinish", {
            title: titles[index],
            type: types[index],
          });
        },
      });
    },
    /**
     * 请求数据
     */
    requestData() {
      api.getMessageInfo({
        success: (data) => {
          this.info = data || {};
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.message-center {
  min-height: 100vh;
  background: #fbf9f7;
  .list {
    .item {
      height: 156rpx;
      .icon {
        @include square(108);
      }
      .message {
        @include text-line(1);
        max-width: 400rpx;
      }
      .unread {
        padding: 0 12rpx;
        min-width: 24rpx;
        height: 48rpx;
        line-height: 48rpx;
        border-radius: 24rpx;
        background: #eb3030;
        text-align: center;
      }
      .accessory {
        @include square(48);
      }
    }
  }
}
</style>
