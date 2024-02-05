<template>
  <view class="family-list">
    <view class="proportion">
      <text>我的亲情账户</text>
      <text class="num"></text>
      <text></text>
    </view>
    <view class="list">
      <view
        class="list-item flex-h flex-c-b"
        v-for="(item, index) in list"
        :key="index"
      >
        <view class="list-item-left flex-h flex-c-s">
          <image
            class="header"
            src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-young-man2x.png"
            mode="scaleToFill"
          />
          <view class="name">{{ item.userName }}</view>
          <view class="relations">{{ item.relationRemark }}</view>
        </view>
        <view class="list-item-right" @click="handleDeleteClick(index)"
          >解除绑定</view
        >
      </view>
    </view>

    <button
      class="add-button fs-44 fw-500 c-white"
      @click="handleAddButtonClick"
    >
      +添加亲友
    </button>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import { startFacialRecognitionVerify } from "@/utils/utils.js";

export default {
  components: {},
  data() {
    return {
      // 亲情账号列表
      list: [],
    };
  },
  watch: {},
  onLoad(option) {},
  onShow() {
    console.log("执行onshow");
    this.findFamilyMemberList();
  },
  onReachBottom() {},
  methods: {
    /**
     * 点击解除绑定按钮
     */
    handleDeleteClick(index) {
      uni.showModal({
        title: "",
        content: `是否解除与${this.list[index].userName}的关系`,
        cancelText: "取消",
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            const userInfo = uni.getStorageSync("userInfo");

            const params = {
              name: userInfo.psnName,
              idCard: userInfo.idCard,
              returnUrl: "",
            };
            // 人脸识别成功
            params.success = () => {
              console.log("人脸识别成功：");
              // uni.getFileSystemManager().readFile({
              //   filePath: require('./static/微信图片_20210727154757.jpg'),
              //   encoding: 'base64',
              //   success: (res) => {
              //     api.removeFamily({
              //       data:{
              //         familyId:this.list[index].familyId,//关系id
              //         userName:userInfo.psnName,//姓名
              //         idCard:userInfo.idCard,//身份证号码
              //         faceImg:res. staticData.faceImg,//图片人脸
              //       },
              //       showLoading:true,
              //       success:(rsp)=>{
              //         this.$uni.showToast("解绑成功")
              //          this.findFamilyMemberList()
              //       }
              //     })
              //   },
              // })
              api.removeFamily({
                data: {
                  familyId: this.list[index].familyId, // 关系id
                  userName: userInfo.psnName, // 姓名
                  idCard: userInfo.idCard, // 身份证号码
                  // faceImg: staticData.faceImg,//图片人脸
                },
                showLoading: true,
                success: (rsp) => {
                  this.$uni.showToast("解绑成功");
                  this.findFamilyMemberList();
                },
              });
            };

            // 开启人脸识别
            console.log("开启人脸");
            startFacialRecognitionVerify(params);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    /**
     * 解除绑定操作
     */
    removeFamily() {
      api.removeFamily({
        data: {},
        success: (res) => {},
      });
    },
    /**
     * 添加亲友
     */
    handleAddButtonClick() {
      uni.navigateTo({
        url: "/pages/family-account/select-type?family=1",
      });
    },
    /**
     * 获取亲情账号列表
     */
    findFamilyMemberList() {
      const data = {
        uactId: this.uactId,
        pageNum: 1,
        pageSize: 5,
      };

      api.findFamilyMemberList({
        data,
        showsLoading: true,
        success: (res) => {
          console.log("接口所得res：", res);
          uni.hideLoading();
          if (res.list) {
            this.list = res.list;
          } else {
            this.list = [];
          }

          //
        },
        fail: (err) => {
          console.log("错误err：", err);
          uni.hideLoading();
          uni.showToast(err.message);
        },
      });
    },
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log("触发refresh");
    this.findFamilyMemberList();
  },
};
</script>

<style lang="scss" scoped>
.family-list {
  padding: 52rpx 32rpx;
  .proportion {
    height: 56rpx;
    font-size: 40rpx;
    font-weight: 500;
    color: #333333;
    line-height: 56rpx;
    .num {
      color: #ff711a;
    }
  }
  .list {
    min-height: 400rpx;
    .list-item {
      height: 132rpx;
      .list-item-left {
        .header {
          width: 100rpx;
          height: 100rpx;
        }
        .name {
          font-size: 44rpx;
          color: #333;
          margin: 0 24rpx;
        }
        .relations {
          height: 50rpx;
          line-height: 50rpx;
          padding: 0 12rpx;
          background: #ffece3;
          border-radius: 8px;
          color: #ff5000;
          font-size: 36rpx;
          flex-shrink: 0;
          max-width: 200rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .list-item-right {
        height: 56rpx;
        font-size: 40rpx;
        color: #ff711a;
        line-height: 56rpx;
      }
    }
  }
  .add-button {
    margin-top: 120rpx;
    margin-bottom: 66rpx;
    width: 686rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>
