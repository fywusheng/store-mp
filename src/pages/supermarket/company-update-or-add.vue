<template>
  <view class="pages">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :title="title" :alpha="1" />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :title="title" :shows-back-button="true" :alpha="1" />
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view
      class="tip flex-h flex-c-s"
      :style="{ top: navigationBarHeight + 'px' }"
    >
      <image
        class="img"
        src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-tip.png"
        mode="scaleToFill"
      />
      <view class="fs-32 lh-40">请认真核对开票信息</view>
    </view>
    <view class="form">
      <view class="top"></view>
      <view class="base box">
        <view class="item flex-h flex-c-b">
          <view class="label">抬头类型</view>
          <view class="check-group input">
            <view
              class="check-item flex-h flex-c-s"
              @click="changeInvoiceType('0')"
            >
              <image
                class="icon-check"
                v-if="params.invoiceType === '1'"
                src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-unselect.png"
                mode="scaleToFill"
              />
              <image
                class="icon-check"
                v-if="params.invoiceType === '0'"
                src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-selected.png"
                mode="scaleToFill"
              />
              <view>个人</view>
            </view>
            <view
              class="check-item flex-h flex-c-s"
              @click="changeInvoiceType('1')"
            >
              <image
                class="icon-check"
                v-if="params.invoiceType === '0'"
                src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-unselect.png"
                mode="scaleToFill"
              />
              <image
                class="icon-check"
                v-if="params.invoiceType === '1'"
                src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-selected.png"
                mode="scaleToFill"
              />
              <view>单位</view>
            </view>
          </view>
        </view>
        <view class="item flex-h flex-c-b">
          <view class="need">*</view>
          <view class="label">发票抬头</view>
          <view class="input">
            <input
              class="input-t"
              v-model="params.invoiceHeaderName"
              placeholder-class="placehlder"
              placeholder="请填写抬头名称"
              type="text"
            />
          </view>
        </view>
        <view class="item flex-h flex-c-b" v-if="params.invoiceType === '1'">
          <view class="need">*</view>
          <view class="label">发票税号</view>
          <image
            class="icon-tip"
            @click="showTaxNoPop"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-tip-grey.png"
            mode="scaleToFill"
          />
          <view class="input">
            <input
              class="input-t"
              v-model="params.taxNo"
              placeholder-class="placehlder"
              placeholder="请填写纳税人识别号"
              type="text"
            />
          </view>
        </view>
      </view>

      <view class="bank box" v-if="params.invoiceType === '1'">
        <view class="item flex-h flex-c-b">
          <view class="need"></view>
          <view class="label">银行名称</view>
          <view class="input">
            <input
              class="input-t"
              v-model="params.bankName"
              placeholder-class="placehlder"
              placeholder="可选填"
              type="text"
            />
          </view>
        </view>
        <view class="item flex-h flex-c-b">
          <view class="need"></view>
          <view class="label">银行账户</view>
          <view class="input">
            <input
              class="input-t"
              v-model="params.bankAccount"
              placeholder-class="placehlder"
              placeholder="可选填"
              type="text"
            />
          </view>
        </view>
        <view class="item flex-h flex-c-b">
          <view class="need"></view>
          <view class="label">注册电话</view>
          <view class="input">
            <input
              class="input-t"
              v-model="params.registeredPhone"
              placeholder-class="placehlder"
              placeholder="可选填"
              type="text"
            />
          </view>
        </view>
        <view class="item flex-h flex-c-b">
          <view class="need"></view>
          <view class="label">注册地址</view>
          <view class="input">
            <input
              class="input-t"
              v-model="params.registeredAddress"
              placeholder-class="placehlder"
              placeholder="可选填"
              type="text"
            />
          </view>
        </view>
      </view>
      <view class="receive box">
        <view class="item flex-h flex-c-b">
          <view class="need">*</view>
          <view class="label">收票人姓名</view>
          <view class="input">
            <input
              class="input-t"
              v-model="params.payeeName"
              placeholder-class="placehlder"
              placeholder="请填写收票人姓名"
              type="text"
            />
          </view>
        </view>
        <view class="item flex-h flex-c-b">
          <view class="need">*</view>
          <view class="label">收票人手机号</view>
          <view class="input">
            <input
              class="input-t"
              v-model="params.payeePhone"
              placeholder-class="placehlder"
              placeholder="请填写收票人手机号"
              type="text"
            />
          </view>
        </view>
        <view class="item flex-h flex-c-b">
          <view class="need">*</view>
          <view class="label">收票人邮箱</view>
          <view class="input">
            <input
              class="input-t"
              v-model="params.payeeEmail"
              placeholder-class="placehlder"
              placeholder="请填写收票人邮箱"
              type="text"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="btn-box">
      <button class="btn" @click="handleAddClick">
        {{ invoiceHeaderId ? "修改" : "添加" }}
      </button>
    </view>

    <!-- 发票税号说明弹框 -->
    <modal
      ref="taxNoPop"
      title="发票税号说明"
      cancelText=" "
      confirmStyle="font-size:44rpx;font-weight:400;color:#333;"
      confirmText="我知道了"
      @confirm="checkConfirm"
    >
      <template v-slot:text>
        <view class="tip-content">
          <scroll-view scroll-y="true" class="confirm-main">
            <view class="content">
              什么是纳税人识别号/统一社会信用代码?纳税人识别号，通常简称为税号，就是税务登记证上的号，每个企业的识别号都是唯一的，相当于税务局发给企业的“身份证号。统一社会信用代码，是一组长度为18位的用于法人和其他组织身份识别的代码。统一社会信用代码由国家标准委发布。2015年10月1日起，国家启动将企业依次申请的工商营业执照、组织机构代码证和税务登记证三证合发
            </view>
          </scroll-view>
          <view class="mask-leaner"></view>
        </view>
      </template>
    </modal>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import { validateEmail, validatePhoneNumber } from "@/utils/validation.js";
import Modal from "@/components/common/modal.vue";
import NavigationBar from "../../components/common/navigation-bar.vue";

export default {
  components: { Modal, NavigationBar },
  data() {
    return {
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 状态栏高度
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      params: {
        invoiceHeaderName: "", // 发票抬头名称
        invoiceType: "0", // 类型（个人为0、单位为1）
        taxNo: "", // 发票税号（类型为单位时传）
        bankName: "", // 银行名称
        bankAccount: "", // 银行账户
        registeredAddress: "", // 注册地址
        registeredPhone: "", //	注册电话
        payeeName: "", //	收票人姓名
        payeePhone: "", //	收票人手机号
        payeeEmail: "", //	收票人邮箱
      },
      invoiceHeaderId: undefined,
      // 标题
      title: "",
      isClick: true,
      timer: "",
    };
  },
  watch: {},
  onLoad(e) {
    if (e.info) {
      const info = JSON.parse(e.info);
      console.log("info:", info);
      this.params.invoiceHeaderName = info.invoiceHeaderName || "";
      this.params.invoiceType = info.invoiceType === "C" ? "0" : "1";
      this.params.taxNo = info.taxNo || "";
      this.params.bankName = info.bankName || "";
      this.params.bankAccount = info.bankAccount || "";
      this.params.registeredAddress = info.registeredAddress || "";
      this.params.registeredPhone = info.registeredPhone || "";
      this.params.payeeName = info.payeeName || "";
      this.params.payeePhone = info.payeePhone || "";
      this.params.payeeEmail = info.payeeEmail || "";
      this.invoiceHeaderId = info.invoiceHeaderId || undefined;
      this.title = "编辑发票抬头";
      // this.$uni.setTitle('编辑发票抬头')
    } else {
      this.title = "添加发票抬头";
      // this.$uni.setTitle('添加发票抬头')
    }
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    // 更改发票类型
    changeInvoiceType(type) {
      this.params.invoiceType = type;
      // if(this.title === '编辑发票抬头'){
      //   return
      // }
      // this.params.invoiceHeaderName = ''
      // this.params.taxNo = ''
      // this.params.bankName = ''
      // this.params.bankAccount = ''
      // this.params.registeredAddress = ''
      // this.params.registeredPhone = ''
      // this.params.payeeName = ''
      // this.params.payeePhone = ''
      // this.params.payeeEmail = ''
    },
    // 点击返回上一页
    handleNavigationBack() {
      if (this.title === "添加发票抬头") {
        uni.navigateBack({
          delta: 1,
        });
        return;
      }
      this.$uni.showConfirm({
        content: "是否保存本次编辑结果?",
        confirmText: "保存",
        cancelText: "不保存",
        title: "",
        confirm: () => {
          this.handleAddClick();
        },
        cancel: () => {
          uni.navigateBack({
            delta: 1,
          });
        },
      });
    },
    // 发票税号说明弹框，点击我知道了
    checkConfirm() {
      this.$refs.taxNoPop.close();
    },
    // 发票税号说明弹框
    showTaxNoPop() {
      this.$refs.taxNoPop.open();
    },
    /**
     * 输入校验
     */
    checkInput() {
      if (!this.params.invoiceHeaderName) {
        this.$uni.showToast("请填写发票抬头");
        return false;
      }
      if (!this.params.taxNo && this.params.invoiceType === "1") {
        this.$uni.showToast("请填写发票税号");
        return false;
      }
      if (
        this.params.registeredPhone &&
        !validatePhoneNumber(this.params.registeredPhone)
      ) {
        this.$uni.showToast("注册电话格式不正确");
        return false;
      }

      if (!this.params.payeeName) {
        console.log(this.params.payeeName);
        this.$uni.showToast("请填写收票人姓名");
        return false;
      }
      // if (!/^[\u4E00-\u9FA5]+$/.test(this.params.payeeName)) {
      //   console.log(this.params.payeeName)
      //   this.$uni.showToast('请填写收票人姓名')
      //   return false
      // }

      if (!this.params.payeePhone) {
        this.$uni.showToast("请填写收票人手机号");
        return false;
      }
      if (!validatePhoneNumber(this.params.payeePhone)) {
        this.$uni.showToast("收票人手机号格式不正确");
        return false;
      }

      if (!this.params.payeeEmail) {
        this.$uni.showToast("请填写收票人邮箱");
        return false;
      }
      if (!validateEmail(this.params.payeeEmail)) {
        this.$uni.showToast("邮箱格式不正确");
        return false;
      }
      return true;
    },
    /**
     * 确定点击事件
     */
    handleAddClick() {
      if (this.isClick) {
        if (!this.checkInput()) return;
        this.isClick = false;
        const data = {
          invoiceHeaderId: this.invoiceHeaderId || "",
          invoiceType: this.params.invoiceType === "0" ? "C" : "P",

          typeName: this.params.invoiceType === "0" ? "个人" : "单位",
          invoiceHeaderName: this.params.invoiceHeaderName,
          taxNo: this.params.invoiceType === "1" ? this.params.taxNo : "",
          bankName: this.params.invoiceType === "1" ? this.params.bankName : "",
          bankAccount:
            this.params.invoiceType === "1" ? this.params.bankAccount : "",
          registeredAddress:
            this.params.invoiceType === "1"
              ? this.params.registeredAddress
              : "",
          registeredPhone:
            this.params.invoiceType === "1" ? this.params.registeredPhone : "",
          payeeName: this.params.payeeName,
          payeePhone: this.params.payeePhone,
          payeeEmail: this.params.payeeEmail,
        };
        api.handleUpdateOrAddHeader({
          showsLoading: true,
          data,
          success: (res) => {
            console.log("添加成功:", res);
            if (this.invoiceHeaderId) {
              this.$uni.showToast({ title: "发票抬头内容修改成功" });
            } else {
              this.$uni.showToast({ title: "添加成功" });
            }

            setTimeout(() => {
              uni.$emit("didAddInvoice", true);
              uni.navigateBack();
            }, 1500);
          },
          fail: (err) => {
            console.log("添加失败：", err);
            this.$uni.showToast(err.message);
          },
        });
        this.timer = setTimeout(() => {
          this.isClick = true;
        }, 3000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  min-height: 100vh;
  background: #eeeeee;
  .tip {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 80rpx;
    padding-left: 32rpx;
    box-sizing: border-box;
    background: #fffbe8;
    color: #323233;
    z-index: 100;
    .img {
      flex-shrink: 0;
      width: 36rpx;
      height: 36rpx;
      margin-right: 16rpx;
    }
  }
  .form {
    overflow: hidden;
    padding-bottom: 152rpx;
    .box {
      box-sizing: border-box;
      padding: 0 32rpx;
      background-color: #fff;
      margin-bottom: 24rpx;
      .item {
        height: 120rpx;
        width: 100%;
        border-bottom: 2rpx solid #ebedf0;
        position: relative;
        font-size: 40rpx;
        &:nth-last-child(1) {
          border-bottom: none;
        }
        .need {
          position: absolute;
          left: 0;
          top: 0;
          width: 28rpx;
          height: 120rpx;
          text-align: center;
          color: #eb3030;
          line-height: 120rpx;
        }
        .label {
          padding-left: 28rpx;
          flex: 1;
          margin-right: 20rpx;
        }
        .icon-tip {
          position: absolute;
          top: 42rpx;
          left: 196rpx;
          width: 36rpx;
          height: 36rpx;
        }
        .input {
          flex-shrink: 0;
          width: 368rpx;
          color: #323233;
        }
        .check-group {
          display: flex;
          align-items: center;
          .check-item {
            margin-right: 22rpx;
          }
          .icon-check {
            flex-shrink: 0;
            width: 40rpx;
            height: 40rpx;
            margin-right: 18rpx;
          }
        }
        .placehlder {
          font-size: 40rpx;
          color: #999999;
        }
      }
    }
    .base {
      margin-top: 104rpx;
      width: 100vw;
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
    z-index: 100;
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
  //modal弹框
  .tip-content {
    position: relative;
    .mask-leaner {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 96rpx;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 100%
      );
    }
  }
  .confirm-main {
    width: 502rpx;
    margin: 0 auto;
    height: 556rpx;
    text-align: justify;
    font-size: 36rpx;
    line-height: 54rpx;
    // overflow: auto;
    position: relative;
    & ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
      display: none;
    }
    .content {
      height: auto;
    }
  }
}
</style>
