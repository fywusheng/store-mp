<template>
  <view class="pages">
    <view class="list">
      <view
        class="item flex-h flex-c-b"
        v-for="(item, index) in list"
        :key="index"
      >
        <view class="left flex-h" @click="handleSelect(index)">
          <view class="check-box" v-if="select !== '0'">
            <image
              class="img"
              v-if="current == index"
              src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-checked.png"
              mode="scaleToFill"
            />
          </view>
          <view class="main">
            <view class="company">{{ item.invoiceHeaderName }}</view>
            <view class="name">{{ item.typeName }}</view>
          </view>
        </view>
        <view class="right flex-h flex-c-c">
          <image
            class="img"
            v-if="select === '0' || select == '1'"
            @click.stop="handleUpdateOrAddClick(item)"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-edited.png"
            mode="scaleToFill"
          />
          <image
            class="img"
            v-if="select === '0'"
            @click.stop="handleDeleteClick(item)"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-delete.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="bottomTips" v-if="bottomTips">
        <view class="loading" v-if="bottomTips == 'loading'">
          <text class="list-item"></text>
          <text class="list-item"></text>
          <text class="list-item"></text>
          <text class="list-item"></text>
          <text class="list-item"></text>
          <text class="list-item"></text>
          <text class="list-item"></text>
          <text class="list-item"></text>
        </view>
        <view>{{ judgeBottomTips(bottomTips) }}</view>
      </view>
      <block v-if="list.length === 0">
        <view class="flex-v flex-c-c status-box">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/no-header.png"
            mode="scaleToFill"
          />
          <view class="flex-c-c status-text">您目前还没有发票抬头记录</view>
        </view>
      </block>
    </view>
    <view class="btn-box">
      <button class="btn" @click="handleAddClick">添加发票抬头</button>
      <!-- <button class="btn"  @click="handleAddClick">添加发票抬头</button> -->
      <!-- <button class="btn" v-if="select=='1' & list.length>0"  @click="handleApplyClick">确认</button> -->
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";

export default {
  components: {},
  data() {
    return {
      list: [],
      pageNum: 1, // 当前页数
      pageSize: 20, // 每页条数
      current: 0, // 选中的抬头
      userInfo: {}, // 用户的信息
      select: "0", // 0普通列表；1.选择抬头
      invoiceHeaderId: "", // 选中的发票id
      // 您看完了，已无更多发票抬头信息
      bottomTips: "",
    };
  },
  watch: {},
  onLoad(e) {
    uni.$on("didAddInvoice", this.refrenshData);
    console.log("errrrr", e);
    this.select = e.select;
    this.invoiceHeaderId = e.invoiceHeaderId || "";
    this.current = e.invoiceHeaderId === "undefined" ? 0 : -1;
    //  console.log("e.invoiceHeaderId",e.invoiceHeaderId)
    //  console.log("e.invoiceHeaderId",typeof(e.invoiceHeaderId))
    this.userInfo = uni.getStorageSync("userInfo");
    this.getList();
  },
  onReachBottom() {
    // 页面上拉触底事件的处理函数
    this.getList();
  },
  methods: {
    // 选中抬头
    handleSelect(index) {
      if (this.select !== "0") {
        this.current = index;
        this.invoiceHeaderId = this.list[index].invoiceHeaderId;
        uni.$emit("didSelectHeader", this.list[index]);
        Store.commit(VUEX.CHECKOUT.SET_INVOICE, this.list[index]);
        uni.navigateBack();
      }
    },
    // 刷新列表
    refrenshData() {
      this.pageNum = 1;
      // this.current = 0
      this.list = [];
      this.getList();
    },
    // 获取抬头列表
    getList() {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        uactId: this.userInfo.uactId,
      };
      // uni.showLoading({
      //   title: '加载中',
      // })
      // if(this.pageNum>1){
      //     this.bottomTips = "loading"
      // }
      if (this.list.length >= 10) {
        this.bottomTips = "loading";
        // setTimeout(()=>{
        //     this.bottomTips = ""
        // },2000)
      } else {
        this.bottomTips = "";
      }

      api.getCompanyList({
        data,
        showsLoading: this.list.length < 10,
        success: (res) => {
          // uni.hideLoading()
          console.log("成功：", res);
          if (res.list && res.list.length > 0) {
            res.list.map((items, indexs) => {
              if (
                this.invoiceHeaderId &&
                items.invoiceHeaderId == this.invoiceHeaderId
              ) {
                this.current = indexs;
              }
              this.list.push(items);
            });
            this.pageNum = this.pageNum + 1;
            this.bottomTips = "";
          } else {
            if (this.list.length >= 10) {
              this.bottomTips = "nomore";
              // setTimeout(()=>{
              //     this.bottomTips = ""
              // },2000)
            } else {
              this.bottomTips = "";
            }
          }

          //
        },
        fail: (err) => {
          this.bottomTips = "";
          console.log("错误err：", err);
          uni.showToast(err.message);
        },
      });
    },
    // 添加
    handleAddClick() {
      uni.navigateTo({
        url: "/pages/supermarket/company-update-or-add",
      });
    },
    // 修改
    handleUpdateOrAddClick(item) {
      const info = JSON.stringify(item);
      uni.navigateTo({
        url: "/pages/supermarket/company-update-or-add?info=" + info,
      });
    },
    // 删除
    handleDeleteClick(item) {
      uni.showModal({
        title: "",
        content: `删除该发票抬头`,
        cancelText: "取消",
        confirmText: "删除",
        success: (res) => {
          if (res.confirm) {
            api.deleteInvoiceHeader({
              data: {
                invoiceHeaderId: item.invoiceHeaderId,
              },
              showsLoading: true,
              success: (res) => {
                this.$uni.showToast("删除成功");
                this.refrenshData();
              },
            });
          } else if (res.cancel) {
            console.log(res);
          }
        },
      });
    },
    // 点击确认
    // handleApplyClick(){
    //   if(this.list.length > 0){

    //   }

    // }
  },
  // 判断底部提示文字
  judgeBottomTips(type) {
    switch (type) {
      case "nomore":
        return "您看完了，已无更多发票抬头信息";
      // break
      case "loading":
        return "正在努力加载";
      // break
      case "more":
        return "上拉加载更多";
      // break
      default:
        break;
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log("触发refresh");
    this.pageNum = 1;
    this.list = [];
    this.getList();
    // setTimeout(() => {
    //   uni.stopPullDownRefresh()
    // })
  },
};
</script>

<style lang="scss" scoped>
.pages {
  min-height: 100vh;
  background: #eeeeee;

  .list {
    overflow: hidden;
    // min-height: calc(100vh - 296rpx);
    // padding: 0 32rpx;
    padding-bottom: 152rpx;
    .item {
      width: 686rpx;
      min-height: 172rpx;
      color: #323233;
      font-size: 32rpx;
      margin: 24rpx auto;
      padding: 32rpx 32rpx 24rpx 26rpx;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 16rpx;
      .left {
        align-items: flex-start;
        .check-box {
          flex-shrink: 0;
          width: 48rpx;
          margin-right: 22rpx;
          line-height: 56rpx;
          font-size: 0;
          padding-top: 10rpx;
          .img {
            width: 48rpx;
            height: 48rpx;
          }
        }
        .main {
          flex-shrink: 0;
          width: 430rpx;
          font-size: 40rpx;
          font-weight: bold;
          color: #333333;
          line-height: 56rpx;
          .name {
            font-size: 32rpx;
            color: #999;
            font-weight: 400;
            line-height: 44rpx;
            margin-top: 16rpx;
          }
        }
        margin-right: 14rpx;
      }
      .right {
        .img {
          width: 48rpx;
          height: 48rpx;
          margin-left: 32rpx;
        }
      }
    }
    .status-box {
      padding-top: 300rpx;
      image {
        width: 440rpx;
        height: 214rpx;
        margin-bottom: 44rpx;
      }
      .status-text {
        height: 50rpx;
        color: #666666;
      }
    }
    .bottomTips {
      width: 100%;
      height: 80rpx;
      font-size: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-shrink: 0;
      .loading {
        width: 110rpx;
        height: 110rpx;
        position: relative;
        transform: scale(0.4);
        margin-right: -20rpx;
        .list-item {
          width: 15rpx;
          height: 15rpx;
          border-radius: 30rpx;
          background: #090909;
          position: absolute;

          animation: opaticyAnimation linear 0.7s infinite;
          -webkit-animation: opaticyAnimation linear 0.7s infinite;
        }
        .list-item:nth-child(1) {
          left: 24px;
          top: 2px;
          animation-delay: 0s;
        }
        .list-item:nth-child(2) {
          left: 40px;
          top: 8px;
          animation-delay: 0.1s;
        }
        .list-item:nth-child(3) {
          left: 47px;
          top: 24px;
          animation-delay: 0.2s;
        }
        .list-item:nth-child(4) {
          left: 40px;
          top: 40px;
          animation-delay: 0.3s;
        }
        .list-item:nth-child(5) {
          left: 24px;
          top: 47px;
          animation-delay: 0.4s;
        }
        .list-item:nth-child(6) {
          left: 8px;
          top: 40px;
          animation-delay: 0.5s;
        }
        .list-item:nth-child(7) {
          left: 2px;
          top: 24px;
          animation-delay: 0.6s;
        }
        .list-item:nth-child(8) {
          left: 8px;
          top: 8px;
          animation-delay: 0.7s;
        }
        @keyframes opaticyAnimation {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      }
    }
  }
  .btn-box {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 152rpx;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      width: 686rpx;
      height: 108rpx;
      background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
      border-radius: 54rpx;
      text-align: center;
      line-height: 108rpx;
      font-size: 44rpx;
      color: #fff;
    }
  }
}
</style>
