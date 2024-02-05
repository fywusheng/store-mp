<template>
  <view class="topArea">
    <view class="select">
      <!-- <view class="pd" @click="clickItem(1)">
                <view  :class="{'select_name': type == 1?true:false}">西医</view>
                <view class="bottom_line" v-if="type == 1"></view>
            </view>
            <view class="pd" @click="clickItem(2)">
                <view :class="{'select_name': type == 2?true:false}">中医</view>
                <view class="bottom_line" v-if="type == 2"></view>
            </view> -->
    </view>
    <view>
      <!-- v-if="type == 1" -->
      <view>
        <view class="bg">
          <image
            class="topIcon"
            src="https://ggllstatic.hpgjzlinfo.com/static/life/doc_bg_top4.png"
            mode="scaleToFill"
          />
        </view>
        <view class="_position">
          <view class="_top">
            <view
              class="top_item"
              v-for="(item, index) in items"
              :key="index"
              @click="handlerClick(item)"
            >
              <image mode="scaleToFill" class="icon" :src="item.icon" />
              <text class="des">{{ item.name }}</text>
            </view>
          </view>
        </view>
        <view class="next">
          <view class="special">
            <view class="left_line"></view>
            <view class="text">临床科室</view>
          </view>
          <view class="_top _item">
            <view v-for="(item, index) in centerList" :key="index" class="_row">
              <view
                class="top_item no_top"
                @click="goDetail(v)"
                v-for="(v, i) in item"
                :key="i"
              >
                <image mode="scaleToFill" class="icon_samll" :src="v.icon" />
                <text class="des_samll">{{ v.menuName }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- <view v-if="type == 1"></view> -->
    </view>
    <modal-know ref="notice"></modal-know>
    <!-- <uni-popup ref="detail" type="center">
            <view>
                <rich-text type="text" class="_center" :nodes="str"></rich-text>
            </view>
        </uni-popup> -->
  </view>
</template>
<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import modalKnow from "@/pages/life/components/modal-know.vue";
import api from "@/apis/index.js";
import parse from "mini-html-parser2";
export default {
  components: { modalKnow, uniPopup },
  data() {
    return {
      type: 1,
      items: [
        {
          name: "门诊挂号",
          type: "1",
          src: "https://ggllstatic.hpgjzlinfo.com/static/home/home-quanyi-item1.png",
        },
        {
          name: "在线问诊",
          type: "2",
          src: "https://ggllstatic.hpgjzlinfo.com/static/home/home-quanyi-item1.png",
        },
        {
          name: "医院介绍",
          type: "3",
          src: "https://ggllstatic.hpgjzlinfo.com/static/home/home-quanyi-item1.png",
        },
      ],
      centerList: [[]],
      detailData: "",
    };
  },
  created() {
    this.getHospitialData();
  },
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
  },
  methods: {
    clickItem(type) {
      this.type = type;
      if (type == 2) {
        this.type = 1;
        this.$refs.notice.open();
      }
    },
    goDetail(item) {
      console.log("====content---", item.content);
      uni.navigateTo({
        url: "/pages/life/seeDocotorDetail?menuName=" + item.menuName,
      });
      //     uni.navigateTo({
      //         url: `/pages/common/webpage?url=${encodeURIComponent('https://ggll.hpgjzlinfo.com/#/'+`${item.route}`)}`,
      //    });
    },
    handlerClick(item) {
      if (item.route) {
        uni.navigateTo({
          url: "/pages/life/seeDocotorDetail?menuName=" + item.menuName,
        });
        //    uni.navigateTo({
        //     url: `/pages/common/webpage?url=${encodeURIComponent('https://ggll.hpgjzlinfo.com/#/'+`${item.route}`)}`,
        //   });
        return;
      }
      this.$refs.notice.open();
    },
    getHospitialData() {
      api.getInfos({
        data: {},
        success: (data) => {
          console.log("---医院数据---", data);
          this.items = data.hospital_home || [];
          const parsData = data.hospital_departs || [];
          // this.centerList  =  data.hospital_departs || []
          if (parsData.length > 0) {
            const arrayList = [];
            for (var i = 0, len = parsData.length; i < len; i += 3) {
              arrayList.push(parsData.slice(i, i + 3));
            }
            this.centerList = arrayList;
          } else {
            this.centerList = [[]];
          }
          this.centerList[this.centerList.length - 1].push({}, {});
          console.log("----最后的值---", this.centerList);
        },
        fail: (error) => {},
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.topArea {
  position: relative;
  background-color: #f5f5f5;
  margin-top: -2.6%;
  .select {
    margin-bottom: 0.32rem;
    background-color: #fff;
    font-size: 36rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 72rpx;
    display: flex;
    padding-left: 34rpx;
    margin-top: 20rpx;
    justify-content: space-around;
    .pd {
      margin-right: 34rpx;
      display: flex;
      flex-direction: column;
      height: 100rpx;
      align-items: center;
      .select_name {
        font-size: 40rpx;
        font-weight: 500;
      }
      .bottom_line {
        width: 70rpx;
        height: 10rpx;
        background: linear-gradient(90deg, #ff7936 0%, #ff5121 100%);
        border-radius: 5rpx;
      }
    }
  }
  .bg {
    width: 100%;
    height: 458rpx;
    .topIcon {
      width: 100%;
      height: 100%;
    }
  }
  ._position {
    position: absolute;
    top: 10%;
    left: 4%;
    width: 686rpx;
    height: 226rpx;
    background-image: url(https://ggllstatic.hpgjzlinfo.com/static/life/doc_bg_icon.png);
    background-size: cover;
  }
  ._top {
    display: flex;
    justify-content: space-evenly;
    .top_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 44rpx;
      .icon {
        width: 100rpx;
        height: 100rpx;
      }
      .icon_samll {
        width: 80rpx;
        height: 80rpx;
      }
      .des {
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 50rpx;
      }
      .des_samll {
        font-size: 32rpx;
        line-height: 44rpx;
      }
    }
    .no_top {
      margin-top: 0rpx;
      flex: 30%;
      margin-bottom: 60rpx;
    }
  }
  ._item {
    width: 100%;
    flex-wrap: wrap;
    ._row {
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: space-around;
    }
  }
  .next {
    background-color: #fff;
    border-radius: 16rpx;
    margin-left: 32rpx;
    margin-right: 32rpx;
    .special {
      padding-top: 26rpx;
      display: flex;
      height: 70rpx;
      line-height: 38rpx;
      margin-left: 36rpx;
      .text {
        font-size: 36rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
      .left_line {
        width: 8rpx;
        height: 38rpx;
        background: #ff9500;
        border-radius: 4rpx;
        margin-right: 20rpx;
      }
    }
  }
}
</style>
