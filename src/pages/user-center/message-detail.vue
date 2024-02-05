<template>
  <view class="message-detail flex-v p-32">
    <text class="title fs-44 c-black">{{ info.ttl }}</text>
    <text class="time fs-36 c-lightgrey mt-8">{{ info.time }}</text>
    <text class="content fs-36 c-black mt-32" user-select>{{ info.cont }}</text>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import dayjs from "dayjs";
export default {
  data() {
    return {
      // 消息详细
      info: {},
    };
  },
  onLoad(e) {
    if (e.id) this.requestData(e.id);
  },
  methods: {
    /**
     * 请求数据
     */
    requestData(id) {
      api.getMessageDetail({
        data: { msgId: id },
        success: (data) => {
          // 将时间戳转化为格式化日期
          data.time = dayjs(data.sendTime).format("YYYY-MM-DD HH:mm:ss");
          this.info = data;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.message-detail {
  .content {
    width: 686rpx;
    word-break: break-all;
  }
}
</style>
