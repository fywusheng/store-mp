<template>
  <view class="bede-house-info">
    <view class="bg"></view>
    <!-- 机构详情 -->
    <view class="card">
      <panel-card :show-header="false">
        <view class="top">
          <image class="avatar" :src="pageInfo.mainPic" mode="scaleToFill" />
          <text class="name">{{ pageInfo.name }}</text>
        </view>
        <view class="line"></view>
        <view class="top-price">床位费：{{ pageInfo.price }}</view>
        <view class="labels">
          <view
            v-for="(label, index) in residents"
            :key="index"
            class="label-item"
          >
            {{ label }}
          </view>
        </view>
        <view class="top-info">
          <view class="label">
            床位：
            <text class="txt">{{ pageInfo.bed }}</text>
          </view>
          <view class="col-line"></view>
          <view class="label">
            类型：
            <text class="txt">{{ pageInfo.homeType }}</text>
          </view>
        </view>

        <view class="address">
          <image
            class="icon-address"
            src="https://ggllstatic.hpgjzlinfo.com/static/benefit/address.png"
            mode="scaleToFill"
          />
          <text>{{ pageInfo.address }}</text>
        </view>
        <view class="top-info">
          <view class="label">
            成立日期：
            <text class="txt">{{ pageInfo.createDate }}</text>
          </view>
        </view>
        <view class="feature-title">特色服务：</view>
        <view class="service">
          <view
            v-for="(label, index) in distinctiveService"
            :key="index"
            class="service-item"
          >
            <image
              class="icon-radio"
              src="https://ggllstatic.hpgjzlinfo.com/static/benefit/right-radio.png"
              mode="scaleToFill"
            />
            {{ label }}
          </view>
        </view>
      </panel-card>
    </view>
    <view class="tab">
      <me-tabs
        :tabs="tabs"
        v-model="select"
        font-size="36rpx"
        @change="hanleTabsChange"
      ></me-tabs>
    </view>

    <!-- 机构简介 -->
    <view class="jg-jj">
      <view v-if="description" class="rich" id="cd0">
        <view class="title">{{ pageInfo.name }}怎么样</view>
        <rich-text :nodes="description"></rich-text>
      </view>
      <view v-if="serviceContent" class="rich" id="cd1">
        <view class="title">{{ pageInfo.name }}服务内容</view>
        <rich-text :nodes="serviceContent"></rich-text>
      </view>
      <view v-if="serviceNote" class="rich" id="cd2">
        <view class="title">{{ pageInfo.name }}的价格/收费/入住通知</view>
        <rich-text :nodes="serviceNote"></rich-text>
      </view>
      <view v-if="contact" class="rich" id="cd3">
        <view class="title">{{ pageInfo.name }}的电话/地址</view>
        <rich-text :nodes="contact"></rich-text>
      </view>
    </view>

    <!-- 附近养老院 -->
    <view class="card n-p">
      <panel-card title="附近养老院" :show-more="false">
        <brand-list :list="nearbyList" @goDetail="goDetail"></brand-list>
      </panel-card>
    </view>
    <!-- 养老院推荐 -->
    <view class="card n-p">
      <panel-card title="北京养老院推荐" :show-more="false">
        <brand-list :list="recommendList" @goDetail="goDetail"></brand-list>
      </panel-card>
    </view>
    <view class="footer">
      <button class="btn" @click="callPhone">电话咨询/预约参观</button>
    </view>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import BrandList from "./components/brand-list.vue";
export default {
  data() {
    return {
      identity: 0,
      tabs: [],
      tabMap: {
        description: "机构简介",
        serviceContent: "服务内容",
        serviceNote: "收费及入住通知",
        contact: "联系我们",
      },
      pageInfo: {},
      distinctiveService: [],
      description: "",
      serviceContent: "",
      serviceNote: "",
      contact: "",
      select: 0,
      residents: [],
      nearbyList: [],
      recommendList: [],
    };
  },
  components: { BrandList },
  created() {},
  onLoad(options) {
    this.identity = options.identity;
    // this.identity = "2633" || options.identity;
    this.getInfo();
  },
  methods: {
    hanleTabsChange(v, index) {
      this.scrollToContent(index);
    },
    // 电话预约
    callPhone() {
      if (!this.pageInfo.phone.length) {
        this.$uni.showToast("【抱歉，暂时没有电话】");
        return;
      }
      if (this.pageInfo.phone.length === 1) {
        uni.makePhoneCall({
          phoneNumber: this.pageInfo.phone[0],
        });
        return;
      }
      uni.showActionSheet({
        itemList: this.pageInfo.phone,
        success: (res) => {
          uni.makePhoneCall({
            phoneNumber: this.pageInfo.phone[res.tapIndex],
          });
        },
        fail: function (res) {
          console.log(res.errMsg);
        },
      });
    },
    // 获取机构详情
    getInfo() {
      api.getBedeHouseInfo({
        data: { identity: this.identity },
        success: (data) => {
          this.pageInfo = data;
          this.pageInfo.phone = this.formatStringToNum(this.pageInfo.phone);
          this.pageInfo.price = this.pageInfo.price.replace("元", "");
          this.distinctiveService = data.distinctiveService
            ? this.trimAll(data.distinctiveService).split("|")
            : [];
          console.log("this.distinctiveService: ", this.distinctiveService);
          this.residents = this.trimAll(data.residents).split("|");
          this.nearbyList = data.nearbyList;
          this.recommendList = data.recommendList;
          this.description = data.description
            .replace(/figure/g, "div")
            .replace(/<img/g, '<img style="width:100%" mode="scaleToFill"');
          this.serviceContent = data.serviceContent
            .replace(/figure/g, "div")
            .replace(/<img/g, '<img style="width:100%" mode="scaleToFill"');
          this.serviceNote = data.serviceNote
            .replace(/figure/g, "div")
            .replace(/<img/g, '<img style="width:100%" mode="scaleToFill"');
          this.contact = data.contact
            .replace(/figure/g, "div")
            .replace(/<img/g, '<img style="width:100%" mode="scaleToFill"');
          this.handleTabs(data);
        },
      });
    },
    handleTabs(data) {
      for (const key in this.tabMap) {
        if (Object.hasOwnProperty.call(data, key)) {
          const element = data[key];
          if (element) {
            this.tabs.push(this.tabMap[key]);
          }
        }
      }
    },
    // 转换电话号码
    formatStringToNum(str) {
      if (!str) return [];
      let phoneList = str.split("<br>");
      phoneList = phoneList.map((item) => {
        item = item.replace("-", "").replace("/", "");
        if (item.includes("转")) {
          item = item.split("转")[0];
        }
        return item;
      });
      return phoneList;
    },
    // 滚动至指定区域
    scrollToContent(index) {
      uni
        .createSelectorQuery()
        .selectAll(".rich")
        .boundingClientRect((res) => {
          // console.log("res: ", res);
          uni.pageScrollTo({
            offsetTop: -60,
            selector: "#" + res[index].id, // string 选择器
          });
        })
        .exec();
    },
    trimAll(ele) {
      if (typeof ele === "string") {
        return ele.split(/[\t\r\f\n\s]*/g).join("");
      } else {
        console.error(
          `${typeof ele} is not the expected type, but the string type is expected`
        );
      }
    },
    goDetail({ nearbyIdentity, recommendIdentity }) {
      const id = nearbyIdentity || recommendIdentity;
      uni.redirectTo({
        url: `/pages/benefit/bedehouse-info?identity=${id}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.bede-house-info {
  position: relative;
  padding-top: 48rpx;
  padding-bottom: 176rpx;
  background: #f5f5f5;
  min-height: 100vh;
  font-family: PingFangSC-Medium, PingFang SC;
  .tab {
    overflow: hidden;
    margin-bottom: 24rpx;
    border-radius: 16rpx 16rpx 0rpx 0rpx;
    position: sticky;
    left: 0;
    top: 0;
    z-index: 3;
  }
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: 514rpx;
    background: linear-gradient(
      180deg,
      #ffe3d5 0%,
      rgba(255, 229, 216, 0.93) 51%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .card {
    width: 686rpx;
    position: relative;
    z-index: 2;
    margin: 0 auto;
    margin-bottom: 32rpx;
    &.n-p {
      width: unset;
    }
  }
  .top {
    display: flex;
    align-items: center;
    .avatar {
      width: 128rpx;
      height: 128rpx;
      border-radius: 64rpx;
      flex-shrink: 0;
      margin-right: 32rpx;
    }
    .name {
      font-size: 40rpx;
      font-weight: 500;
      color: #333333;
    }
  }
  .line {
    width: 686rpx;
    height: 2rpx;
    background: #eeeeee;
    margin: 24rpx 0;
    margin-left: -24rpx;
  }
  .top-price {
    height: 56rpx;
    font-size: 40rpx;
    font-weight: 500;
    color: #ff5500;
    line-height: 56rpx;
    margin-bottom: 24rpx;
  }
  .top-info {
    display: flex;
    align-items: center;
    height: 44rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 44rpx;
    margin-bottom: 24rpx;
    .txt {
      color: #999999;
    }
    .col-line {
      width: 2rpx;
      height: 32rpx;
      background: #eeeeee;
      margin: 0 24rpx;
    }
  }
  .feature-title {
    height: 44rpx;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 44rpx;
    margin-bottom: 16rpx;
  }
  .labels {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .label-item {
      height: 48rpx;
      border-radius: 4rpx;
      padding: 4rpx 8rpx;
      box-sizing: border-box;
      text-align: center;
      border: 2rpx solid #ff2600;
      color: #ff2600;
      margin-right: 36rpx;
      margin-bottom: 16rpx;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .time,
  .address {
    font-size: 32rpx;
    font-weight: 400;
    color: #666666;
    display: flex;
    align-items: center;
    margin-bottom: 14rpx;
    .icon-time,
    .icon-address {
      width: 36rpx;
      height: 36rpx;
      margin-right: 16rpx;
      flex-shrink: 0;
    }
  }
  .service {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto auto;
    // display: flex;
    // align-items: center;
    // flex-wrap: wrap;
    background: #f9f9f9;
    padding: 28rpx 24rpx 12rpx;
    .service-item {
      font-size: 32rpx;
      color: #333333;
      font-weight: 400;
      display: flex;
      align-items: center;
      // margin-right: 16rpx;
      margin-bottom: 16rpx;
      .icon-radio {
        width: 36rpx;
        height: 36rpx;
        margin-right: 8rpx;
      }
    }
  }
  .jg-jj {
    background: #ffffff;
    margin-bottom: 24rpx;
    padding: 16rpx 32rpx;
    font-size: 32rpx;
    color: #333333;
    line-height: 48rpx;
    .rich {
      font-family: PingFangSC-Regular, PingFang SC;
      .title {
        font-size: 40rpx;
        font-weight: 500;
        color: #333333;
        line-height: 56rpx;
        display: flex;
        margin-bottom: 16rpx;
        // align-items: center;
        &::before {
          content: "";
          display: inline-block;
          width: 8rpx;
          height: 38rpx;
          margin-top: 8rpx;
          background: #ff5500;
          border-radius: 4rpx;
          margin-right: 16rpx;
        }
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 176rpx;
    background: #ffffff;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      width: 686rpx;
      height: 108rpx;
      line-height: 108rpx;
      background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
      border-radius: 54rpx;
      color: #ffffff;
      font-weight: 500;
      font-size: 44rpx;
    }
  }
}
</style>
