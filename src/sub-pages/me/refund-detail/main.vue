<template>
  <div class="page-service-type">
    <ul class="info-list" v-if="dataForm.orderItem">
      <li class="item">
        <img
          class="item-logo"
          mode="scaleToFill"
          :lazy-load="true"
          :src="dataForm.orderItem.imgUrl"
        />
        <div class="title">{{ dataForm.orderItem.productName }}</div>
        <div class="desc">{{ dataForm.orderItem.skuName }}</div>
        <div class="price">¥{{ dataForm.orderItem.unitPrice }}</div>
      </li>
    </ul>
    <ul class="info-list">
      <li class="info">
        <div class="title">售后类型：</div>
        <view class="desc">
          {{ dataForm.returnsTypeLabel }}
        </view>
      </li>
      <li class="info" v-if="dataForm.returnsType == 2">
        <div class="title">货物状态：</div>
        <view class="desc">
          {{ dataForm.goodsState === 1 ? "未收到货" : "已收到货" }}
        </view>
      </li>
      <li class="info">
        <div class="title">申请原因：</div>
        <view class="desc">
          {{ dataForm.reasonTypeLabel }}
        </view>
      </li>
      <li class="info">
        <div class="title">退货数量：</div>
        <div class="money">{{ dataForm.num }}</div>
      </li>
      <li class="info" v-if="dataForm.returnsType != 3">
        <div class="title">退款金额：</div>
        <div class="money">¥{{ dataForm.returnsPrice }}</div>
      </li>
      <li class="info">
        <div class="title">售后说明：</div>
        <view class="desc">
          {{ dataForm.remark }}
        </view>
      </li>
      <li class="info">
        <div class="title">售后状态：</div>
        <div class="desc">{{ dataForm.returnsDesc }}</div>
      </li>
    </ul>
    <ul
      v-if="
        dataForm.returnsType == 2 &&
        dataForm.goodsState === 2 &&
        dataForm.returnsStatus >= 0
      "
      class="info-list"
    >
      <li class="info">
        <div class="title">退货地址：</div>
        <div class="desc">{{ dataForm.storeReturnsAddress }}</div>
      </li>
      <li class="info">
        <div class="title">快递公司：</div>
        <picker
          @change="changeExpress"
          mode="selector"
          :range="expressSuppliers"
          range-key="name"
        >
          <div class="desc" style="padding-left: 0; width: 500rpx">
            {{ dataForm.expressName || "请选择退单承运商..." }}
            <img
              class="icon-right"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-right.png"
            />
          </div>
        </picker>
      </li>
      <li class="info">
        <div class="title">快递单号：</div>
        <input
          class="remark"
          v-model="dataForm.expressNum"
          placeholder="请输入退货快递单号..."
        />
      </li>
      <li class="info">
        <div class="title">快递凭证：</div>
        <div class="upload-wrap">
          <div
            class="img-wrap"
            v-for="(preview, index) in previewList"
            :key="index"
          >
            <img class="img" mode="scaleToFill" :src="preview" />
            <img
              class="btn-delete"
              mode="scaleToFill"
              v-if="dataForm.returnsStatus == 0 && dataForm.expressStatus == 0"
              @click="remove(index)"
              src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-delete.png"
            />
          </div>
          <img
            class="btn-upload"
            mode="scaleToFill"
            v-if="dataForm.returnsStatus == 0 && dataForm.expressStatus == 0"
            @click="chooseImage"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/upload.png"
          />
        </div>
      </li>
    </ul>
    <div
      class="btn-submit"
      v-if="
        dataForm.returnsStatus != -3 &&
        dataForm.returnsStatus < 1 &&
        dataForm.expressStatus == 0
      "
      @click="cancel"
    >
      取消
    </div>
    <div
      class="btn-submit"
      v-if="dataForm.returnsStatus == 0 && dataForm.expressStatus == 0"
      @click="save"
    >
      提交
    </div>
    <canvas class="canvas" id="detail-canvas" canvas-id="detail-canvas" />
  </div>
</template>

<script>
import api from "@/apis/index.js";
import { getLessLimitSizeImage } from "@/utils/utils.js";
export default {
  data() {
    return {
      returnsTypeLabel: "",
      reasonType: "",
      // reasonTypeList: [],
      goodsTypeName: "已收到货",
      goodsTypes: [
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
      expressName: "",
      dataForm: {
        id: "",
        expressId: "",
        expressName: "",
        expressNum: "",
        returnsStatus: "",
        // 退换货状态：
        // -1待审核；
        // -2审核不通过；
        // -3已取消；
        // 0待收货；
        // 1处理中
        // 2处理完成
      },
      imgList: [],
      previewList: [],
      expressSuppliers: [],
    };
  },
  components: {},
  methods: {
    async cancel() {
      uni.showLoading({ title: "正在取消...", mask: true });
      const result = await Axios.post(
        "/aftersale/returns/cancel",
        this.dataForm
      );
      uni.hideLoading();
      if (result.code == 200) {
        uni.showToast({
          title: result.msg,
          icon: "none",
        });
        uni.reLaunch({
          url: "/pages/order/orderList",
        });
      } else {
        uni.showToast({
          title: result.msg,
          icon: "none",
        });
      }
    },
    async save() {
      if (!this.dataForm.expressId) {
        uni.showToast({
          title: "请选择退单承运商！",
          icon: "none",
        });
        return false;
      }
      if (!this.dataForm.expressNum) {
        uni.showToast({
          title: "请输入退货运单号！",
          icon: "none",
        });
        return false;
      }
      if (this.imgList.length != 0) {
        this.imgList.forEach((img, index) => {
          this.dataForm[`expressImg${index + 1}`] = img;
        });
      } else {
        uni.showToast({
          title: "请上传退货快递凭证！",
          icon: "none",
        });
        return false;
      }
      uni.showLoading({ title: "正在提交...", mask: true });
      const result = await Axios.post(
        "/aftersale/returns/update",
        this.dataForm
      );
      uni.hideLoading();
      if (result.code == 200) {
        uni.showToast({
          title: result.msg,
          icon: "none",
        });
        uni.navigateTo({
          url: `../refund-detail/main?orderId=${this.orderId}&productId=${this.productId}&skuId=${this.skuId}`,
        });
      } else {
        uni.showToast({
          title: result.msg,
          icon: "none",
        });
      }
    },
    changeExpress(e) {
      const index = e.mp.detail.value;
      this.dataForm.expressId = this.expressSuppliers[index].id;
      this.dataForm.expressName = this.expressSuppliers[index].name;
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
            "detail-canvas",
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
  onUnload() {
    this.dataForm = {
      remark: "",
      goodsState: 2,
    };
    this.imgList = [];
    this.previewList = [];
  },
  async mounted() {
    if (!Store.getters.isLogin) {
      await Store.dispatch("login");
    }
    this.dataForm.id = this.$scope.options.id;
    this.orderId = this.$scope.options.orderId;
    this.productId = this.$scope.options.productId;
    this.skuId = this.$scope.options.skuId;

    uni.showLoading({ title: "正在加载...", mask: true });
    const expressCompanies = await Axios.get("/express/provider/list", {});
    if (expressCompanies.code == 200) {
      this.expressSuppliers = expressCompanies.data;
    }
    const returnResult = await Axios.post("/aftersale/getReturns", {
      // id: this.dataForm.id,
      orderId: this.orderId,
      productId: this.productId,
      skuId: this.skuId,
    });
    uni.hideLoading();
    if (returnResult.code == 200) {
      this.dataForm.id = returnResult.data.id;
      const title = "售后申请";
      uni.setNavigationBarTitle({
        title: title,
      });
      this.dataForm = returnResult.data;
      for (let i = 0; i < 3; i++) {
        if (returnResult.data[`expressImg${i + 1}`]) {
          this.imgList.push(returnResult.data[`expressImg${i + 1}`]);
          this.previewList.push(returnResult.data[`expressImg${i + 1}`]);
        }
      }
    }
  },
};
</script>

<style lang="scss">
$light-black: #eee;
.canvas {
  position: absolute;
  top: -10000px;
  left: 0;
  width: 750px;
  height: 750px;
  opacity: 0;
}
.page-service-type {
  padding-bottom: 100rpx;
  min-height: 100vh;
  background: #f5f5f5;
  .info-list {
    border-top: rpx(1) solid$color-grey;
    margin-bottom: 24rpx;
    background: #ffffff;
    .item {
      position: relative;
      border-bottom: rpx(1) solid #d8d8d8;
      height: rpx(180);
      padding-left: rpx(220);
      padding-top: rpx(30);

      .item-logo {
        position: absolute;
        left: rpx(35);
        top: 50%;
        width: rpx(120);
        height: rpx(120);
        transform: translateY(-50%);
      }
      .title {
        line-height: rpx(40);
        font-size: rpx(36);
        width: 486rpx;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .desc {
        font-size: rpx(36);
        color: #999999;
      }
      .price {
        font-size: rpx(36);
        color: #999999;
      }
    }
    .info {
      display: flex;
      align-items: center;
      position: relative;
      border-bottom: rpx(1) solid$color-grey;

      .title {
        padding-left: rpx(32);
        height: rpx(100);
        line-height: rpx(100);
        font-size: rpx(36);
        width: rpx(242);
      }

      .money {
        margin-left: rpx(25);
        color: #ff5500;
        font-size: rpx(36);
      }

      .desc {
        display: flex;
        align-items: center;
        font-size: rpx(36);
        color: $color-black;
        width: 570rpx;
        padding-left: 25rpx;

        .icon-right {
          @include middle-center-y();
          right: 30rpx;
          margin-left: rpx(10);
          width: rpx(16);
          height: rpx(27);
        }
      }

      .remark {
        width: rpx(540);
        margin-left: rpx(25);
        height: rpx(80);
        line-height: rpx(80);
        font-size: rpx(28);
      }
    }
  }

  .upload-wrap {
    display: flex;
    padding-top: rpx(30);
    padding-left: rpx(10);
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
      width: rpx(150);
      height: rpx(150);
    }
  }

  .btn-submit {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100rpx;
    // height: calc(env(safe-area-inset-bottom) + 100rpx);
    line-height: rpx(100);
    text-align: center;
    font-size: rpx(40);
    background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
    color: #fff;
    z-index: 1000;
    // padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
