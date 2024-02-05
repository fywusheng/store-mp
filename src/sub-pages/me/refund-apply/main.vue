<template>
  <div class="page-service-type">
    <ul class="info-list" v-if="dataForm.returnsItem">
      <li class="item">
        <img
          class="item-logo"
          mode="scaleToFill"
          :lazy-load="true"
          :src="dataForm.returnsItem.imgUrl"
        />
        <div class="title">{{ dataForm.returnsItem.productName }}</div>
        <div class="desc">{{ dataForm.returnsItem.skuName }}</div>
        <div class="price">¥{{ dataForm.returnsItem.sellingPrice }}</div>
      </li>
      <li class="info">
        <div class="title">售后类型</div>
        <div class="desc">{{ returnsTypeLabel }}</div>
      </li>
      <li class="info" v-if="returnsType == 2">
        <div class="title">货物状态</div>
        <picker @change="changeType" :range="goodsStates" range-key="name">
          <div class="desc">
            {{ goodsStateName || "请选择货物状态" }}
            <!-- <img class="icon-right" v-if="operateType == 2" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-right.png"> -->
          </div>
        </picker>
      </li>
      <li class="info">
        <div class="title">售后原因</div>
        <picker
          @change="changeReason"
          mode="selector"
          :range="reasonTypeList"
          range-key="name"
        >
          <div class="desc">
            {{ reasonTypeName || "请选择售后原因" }}
            <!-- <img class="icon-right" v-if="operateType == 2" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-right.png"> -->
          </div>
        </picker>
      </li>
      <li class="info">
        <div class="title">退货数量</div>
        <div class="money">{{ dataForm.num }}</div>
      </li>
      <li class="info m-b-24" v-if="returnsType != 3">
        <div class="title">退款金额</div>
        <div class="money">¥{{ dataForm.price }}</div>
      </li>
      <li class="info cont m-b-24">
        <div class="title">问题描述</div>
        <textarea
          class="new-remark"
          v-model="dataForm.remark"
          placeholder="请描述申请退款/推货退款的原因"
          placeholder-class="placeholder1"
        />
      </li>
      <li class="info cont m-b-24" v-if="returnsType != 1">
        <div class="title">上传凭证 <text class="more">最多三张</text></div>
        <div class="upload-wrap">
          <img
            class="btn-upload"
            @click="chooseImage"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-camera.png"
          />
          <div
            class="img-wrap"
            v-for="(preview, index) in previewList"
            :key="index"
          >
            <img class="img" mode="scaleToFill" :src="preview" />
            <img
              class="btn-delete"
              @click="remove(index)"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-delete.png"
            />
          </div>
        </div>
      </li>
      <li class="info">
        <div class="title">退款方式</div>
        <div class="desc text-right">原支付方式返回</div>
      </li>
      <li class="info" style="border: none" v-if="returnsType == 2">
        <div class="title">退货方式</div>
        <div class="desc text-right">送货至商家</div>
      </li>
      <li class="info m-b-24" v-if="returnsType == 2">
        <div class="address-desc">*寄回地址将在审核通过后获取</div>
      </li>
      <li class="tips m-b-24">
        <image
          class="icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-warning.png"
        />
        <view class="txt">提交后将进行人工审核,请耐心等待</view>
      </li>
    </ul>
    <div class="btn-submit" @click="save">
      <view class="btn">提交</view>
    </div>
    <canvas class="canvas" id="apply-canvas" canvas-id="apply-canvas" />
  </div>
</template>

<script>
import api from "@/apis/index.js";
import { getLessLimitSizeImage } from "@/utils/utils.js";
export default {
  data() {
    return {
      returnsItem: "",
      returnsType: 1,
      returnsTypeLabel: "",
      reasonTypeName: "",
      reasonTypeList: [],
      goodsStateName: "",
      goodsStates: [
        {
          id: 1,
          name: "未收到货",
        },
        {
          id: 2,
          name: "已收到货",
        },
      ],
      price: 0,
      returnTransferPrice: 0,
      dataForm: {
        remark: "",
        goodsState: 2,
      },
      imgList: [],
      previewList: [],
    };
  },
  components: {},
  methods: {
    async save() {
      if (!this.dataForm.goodsState) {
        uni.showToast({
          title: "请选择货物状态！",
          icon: "none",
        });
        return false;
      }
      if (!this.dataForm.reasonType) {
        uni.showToast({
          title: "请选择退货原因",
          icon: "none",
        });
        return false;
      }
      this.imgList.forEach((img, index) => {
        this.dataForm[`img${index + 1}`] = img;
      });
      uni.showLoading({ title: "正在提交数据...", mask: true });
      const result = await Axios.post(
        "/aftersale/returns/submit",
        this.dataForm
      );
      uni.hideLoading();
      if (result.code == 200) {
        uni.showModal({
          title: "提交成功",
          content: "等待系统审核",
          showCancel: false,
          success: () => {
            // uni.navigateBack();
            uni.navigateTo({
              url: `../refund-detail/main?productId=${this.$scope.options.productId}&skuId=${this.$scope.options.skuId}&orderId=${this.$scope.options.orderId}`,
            });
          },
        });
      } else {
        uni.showToast({
          title: result.msg,
          icon: "none",
        });
      }
    },
    changeType(e) {
      const index = e.mp.detail.value;
      this.goodsStateName = this.goodsStates[index].name;
      this.dataForm.goodsState = this.goodsStates[index].id;
    },
    changeReason(e) {
      const index = e.mp.detail.value;
      this.reasonTypeName = this.reasonTypeList[index].name;
      this.dataForm.reasonType = this.reasonTypeList[index].id;
    },
    remove(index) {
      this.imgList.splice(index, 1);
      this.previewList.splice(index, 1);
    },
    async chooseImage() {
      if (this.imgList.length == 3) {
        uni.showToast({
          title: "最多只能上传3张图片",
          icon: "none",
        });
        return false;
      }

      uni.chooseImage({
        sourceType: ["camera", "album"],
        success: (res) => {
          const file = res.tempFilePaths[0];
          // 名称
          const imageName = res.tempFilePaths[0].split("/").pop();
          const arr = imageName.split(".");
          // 后缀
          const imageExt = arr[arr.length - 1];
          getLessLimitSizeImage(
            "apply-canvas",
            file,
            0.1,
            750,
            (imagePath) => {
              console.log(imagePath);

              uni.getFileSystemManager().readFile({
                filePath: imagePath,
                encoding: "base64",
                success: (rs) => {
                  api.imgUpload({
                    data: {
                      base64String: rs.data,
                      imageName,
                      imageExt,
                    },
                    showsLoading: true,
                    success: (imgres) => {
                      this.previewList.push(imgres.absoluteUrl);
                      this.imgList.push(imgres.absoluteUrl);
                    },
                  });
                  console.log("---图片---", rs.data);
                },
                fail: (erro) => {
                  console.log("---异常拿到---", erro);
                },
              });
            },
            this
          );
        },
      });
    },
  },
  // onUnload() {
  //   this.dataForm = {
  //     remark: '',
  //     goodsType: 2,
  //   }
  //   this.imgList = [];
  //   this.previewList = [];
  // },
  async mounted() {
    if (!Store.getters.isLogin) {
      await Store.dispatch("login");
    }
    this.dataForm.orderItemId = this.$scope.options.itemId;
    this.dataForm.num = this.$scope.options.num;
    this.dataForm.returnsType = this.$scope.options.type;
    this.returnsType = parseInt(this.$scope.options.type);
    this.dataForm.orderId = this.$scope.options.orderId;
    this.status = this.$scope.options.status;
    const title = "售后申请";
    switch (this.returnsType) {
      case 1:
        this.returnsTypeLabel = "仅退款";
        break;
      case 2:
        this.returnsTypeLabel = "退货退款";
        break;
      case 3:
        this.returnsTypeLabel = "换货";
        break;
    }
    uni.setNavigationBarTitle({
      title: title,
    });
    const result = await Axios.get("/aftersale/returns/apply", {
      params: {
        orderItemId: this.dataForm.orderItemId,
        orderId: this.dataForm.orderId,
        num: this.dataForm.num,
        returnsType: this.dataForm.returnsType,
      },
    });
    uni.hideLoading();
    if (result.code == 200) {
      Object.keys(result.data.reasonType).forEach((key) => {
        this.reasonTypeList.push({
          id: key,
          name: result.data.reasonType[key],
        });
      });
      this.dataForm.orderItemId = result.data.orderItemId;
      this.dataForm.orderId = result.data.orderId;
      this.dataForm.price = result.data.price;
      this.dataForm.transferPrice = result.data.returnTransferPrice;
      this.dataForm.returnsItem = result.data.skuItem;
      this.goodsStateName = "";
      this.reasonTypeName = "";
    } else {
      uni.showToast({
        title: result.result.message,
        icon: "none",
      });
    }
  },
};
</script>

<style lang="scss">
@import "../../../styles/base";
.canvas {
  position: absolute;
  top: -10000px;
  left: 0;
  width: 750px;
  height: 750px;
  opacity: 0;
}
.page-service-type {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 187rpx;
  .info-list {
    .item {
      position: relative;
      height: rpx(218);
      padding-left: rpx(220);
      padding-top: rpx(30);
      margin-bottom: 24rpx;
      background: #fff;

      .item-logo {
        position: absolute;
        left: rpx(35);
        top: 50%;
        width: rpx(152);
        height: rpx(152);
        transform: translateY(-50%);
      }
      .title {
        line-height: rpx(40);
        font-size: rpx(40);
        color: #333333;
        padding-right: 32rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .desc {
        margin-top: rpx(10);
        font-size: rpx(36);
        color: $color-grey;
      }
      .price {
        margin-top: rpx(10);
        font-size: rpx(30);
        color: $color-black;
      }
    }
    .info {
      display: flex;
      align-items: center;
      position: relative;
      border-bottom: rpx(1) solid #e5e5e5;
      background: #fff;
      &.cont {
        align-items: unset;
        flex-direction: column;
      }
      .title {
        height: rpx(100);
        line-height: rpx(100);
        font-size: rpx(36);
        color: #333;
        margin-left: 32rpx;
        .more {
          font-size: 32rpx;
          color: #999999;
          margin-left: 8rpx;
        }
      }
      .money {
        color: #ff5500;
        font-size: rpx(36);
        display: flex;
        align-items: center;
        @include middle-center-y();
        right: rpx(30);
      }
      .desc {
        display: flex;
        align-items: center;
        @include middle-center-y();
        // width: rpx(500);
        right: rpx(30);
        font-size: rpx(36);
        color: $color-grey;
        .icon-right {
          @include middle-center-y();
          right: 0;
          width: rpx(16);
          height: rpx(27);
        }
      }
      .address-desc {
        margin-left: 32rpx;
        padding-bottom: 24rpx;
        font-size: 32rpx;
        color: #999999;
      }
      .remark {
        width: rpx(540);
        margin-left: rpx(40);
        height: rpx(80);
        line-height: rpx(80);
        font-size: rpx(36);
      }
    }
  }
  .upload-wrap {
    display: flex;
    padding-left: rpx(32);
    padding-bottom: rpx(30);
    flex-wrap: wrap;
    .img-wrap {
      position: relative;
      width: rpx(150);
      height: rpx(150);
      margin-left: rpx(20);
      margin-bottom: 30rpx;
      .btn-delete {
        position: absolute;
        right: 0;
        top: 0;
        width: rpx(27);
        height: rpx(29);
      }

      .img {
        width: rpx(150);
        height: rpx(150);
      }
    }

    .btn-upload {
      // margin-left: rpx(20);
      width: rpx(150);
      height: rpx(150);
    }
  }
  .btn-submit {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 187rpx;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      @include btn();
      width: 90%;
      line-height: rpx(100);
      height: 100rpx;
      text-align: center;
      font-size: rpx(36);
      background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
      color: #fff;
      z-index: 1000;
      border-radius: 64rpx;
    }
  }
  .tips {
    display: flex;
    align-items: center;
    .icon {
      width: 36rpx;
      height: 36rpx;
      margin: 0 32rpx;
    }
    .txt {
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
      line-height: 52rpx;
    }
  }
  .m-b-24 {
    margin-bottom: 24rpx;
  }
  .new-remark {
    margin-left: 36rpx;
  }
  .text-right {
    text-align: right;
  }
}
</style>
