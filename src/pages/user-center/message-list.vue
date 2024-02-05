<template>
  <view class="message-list">
    <template v-if="list.length > 0">
      <view class="list">
        <view
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="handleItemClick(index)"
        >
          <view class="time flex-h flex-c-c">
            <text class="fs-32 c-grey">{{ item.time }}</text>
          </view>
          <view class="flex-v bg-white br-8 m-0-32">
            <view class="header flex-h flex-c-b p-0-24">
              <text class="fs-40 fw-bold c-black">{{ item.ttl }}</text>
              <view class="unread ml-16" v-if="item.readStas === 0" />
              <view class="flex-1" />
              <image
                class="accessory"
                mode="scaleToFill"
                src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
              />
            </view>
            <text class="content fs-32 c-grey m-32">{{ item.cont }}</text>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="no-data flex-v flex-c-c">
        <image
          class="no-data__image"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/status-none2x.png"
        />
        <text class="fs-36 c-grey mt-24">暂无数据</text>
      </view>
    </template>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import dayjs from "dayjs";
export default {
  data() {
    return {
      // 消息类型
      type: null,
      // 消息列表
      list: [],
    };
  },
  onLoad(e) {
    if (e.type) {
      this.$uni.setTitle(e.title);
      this.type = e.type;
      this.requestData();
    } else {
      this.getOpenerEventChannel().on("didOpenPageFinish", (data) => {
        const { title, type } = data;
        this.$uni.setTitle(title);
        this.type = type;
        this.requestData();
      });
    }
  },
  onPullDownRefresh() {
    this.requestData();
  },
  onReachBottom() {
    if (this.list.length % 10 === 0) {
      this.requestData(this.list.length / 10 + 1);
    }
  },
  methods: {
    /**
     * 消息点击事件
     */
    handleItemClick(index) {
      const item = this.list[index];
      uni.navigateTo({
        url: `/pages/user-center/message-detail?id=${item.msgId}`,
        success: () => {
          // 手动调用已读单条消息接口
          api.changeMessageState({
            showsLoading: false,
            data: {
              msgId: item.msgId,
              channel: "app",
            },
            success: () => {
              // 调用成功后手动刷新当前页面数据并通知上一页面刷新数据
              this.list.splice(index, 1, { ...item, readStas: 1 });
              uni.$emit("didMessageStateChanged");
            },
          });
        },
      });
    },
    /**
     * 请求数据
     */
    requestData(page = 1) {
      api.getMessageList({
        data: {
          msgType: this.type,
          channel: "app",
          pageNo: page,
          pageSize: "10",
        },
        success: (data) => {
          this.list = page === 1 ? data.list : this.list.concat(data.list);
          if (this.list.length > 0) {
            this.list.forEach((item) => {
              item.time = dayjs(item.sendTime).format("YYYY-MM-DD HH:mm:ss");
            });
          }
        },
        complete: () => {
          uni.stopPullDownRefresh();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.message-list {
  min-height: 100vh;
  background: #fbf9f7;
  box-sizing: border-box;
  .no-data {
    padding-top: 154rpx;
    &__image {
      @include size(440, 234);
    }
  }
  .list {
    .item {
      .time {
        height: 92rpx;
      }
      .header {
        height: 120rpx;
        border-bottom: 2rpx solid #e5e5e5;
        .unread {
          @include square(12);
          border-radius: 6rpx;
          background: #eb3030;
        }
        .accessory {
          @include square(48);
        }
      }
      .content {
        @include text-line(2);
      }
    }
  }
}
</style>
