<template>
  <view class="topArea">
    <uni-collapse
      :tab-list="tabList"
      @tab-click="hanldTabClick"
      @resize="handleResize"
    ></uni-collapse>
    <view class="content" :style="{ 'margin-top': top }">
      <view class="doctor-list-item" v-for="item in doctorList" :key="item.id">
        <view class="top" @click="goDoctorPage(item.doctorUrl)">
          <view class="left">
            <image class="icon" :src="item.doctorFace" />
          </view>
          <view class="right">
            <view class="title m-b">
              <view class="name">{{ item.doctorName }}</view>
              <view>{{ item.doctorTitle }}</view>
              <view class="level">{{ item.level }}</view>
            </view>
            <view class="m-b"
              >{{ item.hospitalName }} {{ item.departmentName }}</view
            >
            <view class="precent m-b">
              <view class="col"
                >接诊率 <text class="count">{{ item.acceptsRate }}%</text></view
              >
              <view class="col"
                >好评率
                <text class="count">{{ item.feedbackRate }}%</text></view
              >
            </view>
            <view class="bk m-b t-2">擅长：{{ item.goodAt }}</view>
            <view class="label-wrapper m-b" v-if="item.adjustRecord">
              <view
                class="label"
                v-for="(el, ind) in item.adjustRecord.split(',')"
                :key="ind"
                >{{ el }}</view
              >
            </view>
            <view>
              平均回复：
              <text v-if="item.avgReply < 1999" class="bk"
                >{{ item.avgReply }}小时内</text
              >
              <text v-else class="bk">暂无</text>
            </view>
          </view>
        </view>
        <view class="bottom" v-if="item.picPrice > 0 || item.phonePrice > 0">
          <view class="right" v-if="item.phonePrice > 0">
            <image
              class="icon"
              src="https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/icon-phone.png"
            />
            <text>电话问诊费</text>
            <text class="price">¥{{ item.phonePrice }}</text>
          </view>
          <view class="left" v-if="item.picPrice > 0">
            <image
              class="icon"
              src="https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/icon-img.png"
            />
            <text>图文问诊费</text>
            <text class="price">¥{{ item.picPrice }}</text>
          </view>
        </view>
      </view>
    </view>
    <view v-if="showLoadMore" class="load-more">{{ loadTxt }}</view>
  </view>
</template>
<script>
import UniCollapse from "./components/uni-collapse.vue";
import api from "@/apis/index.js";
export default {
  components: { UniCollapse },
  data() {
    return {
      tabList: [
        //   {label: '全部', id: 0},
        //   {label: '心血管内科', id: 2},
        //   {label: '内分泌科', id: 3},
        //   {label: '消化内科', id: 4},
        //   {label: '感染内科', id: 5},
        //   {label: '骨科', id: 6},
        //   {label: '肿瘤科', id: 7},
        //   {label: '风湿免疫科', id: 8},
        //   {label: '肾内科', id: 9},
        //   {label: '神经内科', id: 10},
        //   {label: '血液内科', id: 11},
      ],
      doctorList: [],
      showLoadMore: false,
      loadTxt: "",
      top: 0,
      pageNum: 1,
    };
  },
  created() {
    this.userInfor = uni.getStorageSync("userInfo");
    this.getInquiryDepartList();
    this.getIDoctorList("全部");
  },
  onReachBottom() {
    console.log("滚动");
    this.pageNum++;
    this.getIDoctorList(this.name);
  },
  methods: {
    // 获取科室列表
    getInquiryDepartList() {
      api.getInquiryDepartList({
        data: {},
        success: (data) => {
          this.tabList = [{ departmentName: "全部" }].concat(data);
        },
      });
    },
    // 获取医生列表
    getIDoctorList(name) {
      this.name = name === "全部" ? "" : name;
      this.showLoadMore = true;
      this.loadTxt = "加载中";
      api.getIDoctorList({
        data: {
          departmentName: this.name,
          pageNum: this.pageNum,
          pageSize: 10,
        },
        success: (data) => {
          //   this.showLoadMore = false
          if (data.records && data.records.length) {
            this.showLoadMore = false;
            this.doctorList = this.doctorList.concat(data.records);
          } else {
            this.loadTxt = "无更多数据";
          }
          //   uni.hideLoading()
          //   console.log(this.doctorList)
        },
      });
    },
    // 医生详情
    goDoctorPage(src) {
      api.getInquiryReturnUrl({
        data: {
          ext_user_id: this.userInfor.uactId, // 用户id
          target: src,
          mobile: this.userInfor.tel,
        },
        success: (data) => {
          const url = data;
          uni.navigateTo({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
          });
        },
      });
    },
    handleResize(top) {
      this.top = top + "px";
    },
    hanldTabClick(index) {
      this.pageNum = 1;
      this.doctorList = [];
      uni.pageScrollTo({ scrollTop: 0 });
      this.getIDoctorList(this.tabList[index].departmentName);
    },
  },
};
</script>
<style lang="scss" scoped>
.topArea {
  position: relative;
  background-color: #f5f5f5;
  min-height: 100vh;
  .content {
    padding: 24rpx;
    transition: all 0.3s linear;
    // position: absolute;
    // left: 0;
    .doctor-list-item {
      width: 686rpx;
      background: #ffffff;
      margin: 0 auto;
      margin-bottom: 24rpx;
      &:last-child {
        margin-bottom: 0;
      }
      .top {
        padding: 24rpx;
        display: flex;
        .left {
          .icon {
            width: 140rpx;
            height: 140rpx;
            border-radius: 70rpx;
          }
        }
        .right {
          padding-left: 20rpx;
          font-size: 32rpx;
          color: #999999;
          .title {
            display: flex;
            align-items: center;
            font-size: 32rpx;
            color: #333333;
            .name {
              font-weight: 500;
              font-size: 36rpx;
              margin-right: 16rpx;
            }
            .level {
              font-size: 28rpx;
              font-weight: 400;
              color: #ff2600;
              border-radius: 4px;
              margin-left: 16rpx;
              height: 48rpx;
              padding: 0 8rpx;
              // width: 72rpx;
              line-height: 48rpx;
              text-align: center;
              border: 2rpx solid #ff2600;
            }
          }
          .precent {
            display: flex;
            .col {
              flex: 1;
            }
            .count {
              color: #1890ff;
              margin-left: 8rpx;
            }
          }
          .bk {
            color: #333333;
          }
          .label-wrapper {
            max-height: 104rpx;
            overflow: hidden;
            .label {
              display: inline-block;
              color: #1890ff;
              border-radius: 4px;
              border: 2rpx solid #1890ff;
              padding: 0 8rpx;
              margin-right: 8rpx;
              margin-bottom: 8rpx;
              height: 48rpx;
              line-height: 48rpx;
              box-sizing: border-box;
            }
          }
          .m-b {
            margin-bottom: 16rpx;
          }
          .t-2 {
            font-size: 32rpx;
            //#ifdef MP-ALIPAY
            line-height: 36rpx;
            max-height: 70rpx;
            //#endif
            display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
            -webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
            -webkit-line-clamp: 2; //限制行数
            overflow: hidden; //超出部分隐藏
            text-overflow: ellipsis;
          }
        }
      }
      .bottom {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        height: 96rpx;
        border-top: 2rpx solid #eeeeee;
        .icon {
          width: 36rpx;
          height: 32rpx;
          margin-right: 6rpx;
        }
        .left,
        .right {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50%;
          height: 100%;
        }
        .price {
          margin-left: 8rpx;
          font-size: 36rpx;
          font-weight: 500;
          color: #ff5500;
        }
        .unit {
          color: #999999;
        }
      }
    }
  }
  .load-more {
    font-size: 36rpx;
    color: #999999;
    width: 100%;
    text-align: center;
    height: 84rpx;
  }
}
</style>
