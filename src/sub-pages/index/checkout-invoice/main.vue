<style lang="scss">
@import '~@/styles/base';

.page-invoice {
  background-color: #f3f3f6;
  min-height: 100vh;
  padding-bottom: rpx(120);
  &.isIphoneHair {
    padding-bottom: rpx(184);
    .btn {
      padding-bottom: rpx(64);
    }
  }
  .info-wrap {
    padding: rpx(30) 0 rpx(48) rpx(30);
    background-color: #fff;

    .title {
      font-size: rpx(28);
      font-weight: 500;
    }

    .invoice-type {
      display: flex;
      align-items: center;
      padding-top: rpx(30);
      .type {
        position: relative;
        margin-right: rpx(30);
        padding-left: rpx(30);
        padding-right: rpx(30);
        height: rpx(55);
        line-height: rpx(55);
        border: 1px solid #cdcdcd;
        border-radius: rpx(5);
        font-size: rpx(26);
        color: #666666;
        overflow: hidden;
        &:last-child {
          margin-right: 0;
        }

        &.active {
          border-color: $black;
          color: $black;
          &:after {
            content: '';
            position: absolute;
            right: 0;
            bottom: 0;
            width: rpx(12);
            height: rpx(12);
            background-color: $black;
            transform: rotate(45deg) translateX(rpx(6));
          }
        }
      }
    }

    .invoice-title {
      display: flex;
      align-items: center;
      padding-bottom: rpx(30);
      border-bottom: 1px solid #f1f1f1;
    }
    .taker-info-title {
      padding-top: rpx(50);
      padding-bottom: rpx(10);
    }
    .company-info {
      padding-top: rpx(30);
    }
    &.invoice-title-wrap {
      padding-bottom: 0;
    }
    .form-control {
      height: rpx(90);
      line-height: rpx(90);
      font-size: rpx(26);
      border-bottom: rpx(1) solid #f1f1f1;

      &:last-child {
        border-bottom: none;
      }
    }
    .invoice-content {
      padding-top: rpx(30);
      li {
        display: flex;
        align-items: center;
        height: rpx(75);
        line-height: rpx(75);
        font-size: rpx(26);
        border-bottom: rpx(1) solid #f1f1f1;
        &:last-child {
          border-bottom: none;
        }
        img {
          margin-right: rpx(18);
          width: rpx(32);
          height: rpx(32);
        }
      }
    }
  }
  .btn {
    @include middle-center-x(fixed);
    @include btn-block();
    bottom: 0;
    width: 100%;
  }
}
</style>

<template>
  <div class="page-invoice" :class="{isIphoneHair}">
    <div class="info-wrap">
      <!-- <div class="title">发票类型</div> -->
      <ul class="invoice-type">
        <li class="type" @tap="changeInvoiceType(0)"
          :class="invoice.invoiceType == 0 ? 'active':''">电子普通发票
        </li>
        <li class="type" @tap="changeInvoiceType(1)"
          :class="invoice.invoiceType == 1 ? 'active':''">增值专用发票
        </li>
      </ul>
    </div>
    <div class="line"></div>
    <div class="info-wrap invoice-title-wrap">
      <div class="title">发票抬头</div>
      <template v-if="invoice.invoiceType == 0">
        <ul class="invoice-type">
          <li class="type" @tap="changeApplicantType(0)"
            :class="{active: invoice.applicantType == 0}">个人
          </li>
          <li class="type" @tap="changeApplicantType(1)"
            :class="{active: invoice.applicantType == 1}">公司
          </li>
        </ul>
      </template>
      <div class="company-info" v-if="invoice.applicantType == 0">
        <input type="text" v-model="invoice.invoiceTitle" maxlength="64" class="form-control"
          placeholder="请输入纳税人名称，默认‘个人’...">
      </div>
      <div class="company-info" v-if="invoice.applicantType== 1 || invoice.invoiceType == 1">
        <input type="text" v-model="invoice.invoiceTitle" maxlength="64" class="form-control"
          placeholder="请输入纳税单位名称...">
        <input type="text" v-model="invoice.identifyingCode" maxlength="20" class="form-control"
          placeholder="请输入纳税单位识别码...">
      </div>
      <template v-if="invoice.invoiceType == 1">
        <input type="text" v-model="invoice.bankName" maxlength="32" class="form-control"
          placeholder="请输入纳税单位开户银行名称...">
        <input type="text" v-model="invoice.bankAccount" maxlength="20" class="form-control"
          placeholder="请输入纳税单位银行开户账号...">
        <input type="text" v-model="invoice.registrationAddress" maxlength="64" class="form-control"
          placeholder="请输入纳税单位注册地址...">
        <input type="text" v-model="invoice.registrationPhone" maxlength="11" class="form-control"
          placeholder="请输入纳税单位电话号码...">
      </template>
      <template v-if="invoice.invoiceType == 0">
        <div class="title taker-info-title">收票人信息</div>
        <input type="text" v-model="invoice.recipientPhone" maxlength="11" class="form-control"
          placeholder="请输入收票人手机号码...">
        <input type="text" v-model="invoice.recipientEmail" maxlength="200" class="form-control"
          placeholder="请输入收票人电子邮箱...">
      </template>
    </div>
    <div class="line"></div>
    <div class="info-wrap">
      <div class="title">发票内容</div>
      <ul class="invoice-content" v-model="invoice.invoiceContent">
        <li @click="changeInvoiceContent(1)">
          <img v-if="invoice.invoiceContent == 1"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_h.png">
          <img v-else src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_n.png">
          服饰、鞋帽
        </li>
        <li @click="changeInvoiceContent(2)">
          <img v-if="invoice.invoiceContent == 2"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_h.png">
          <img v-else src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_n.png">
          箱包
        </li>
        <li @click="changeInvoiceContent(3)">
          <img v-if="invoice.invoiceContent == 3"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_h.png">
          <img v-else src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_n.png">
          礼品、办公用品
        </li>
        <li @click="changeInvoiceContent(4)">
          <img v-if="invoice.invoiceContent == 4"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_h.png">
          <img v-else src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_n.png">
          订单商品明细
        </li>
      </ul>
    </div>
    <div class="btn" @click="save">确定</div>
  </div>
</template>

<script>
import wx from 'utils/wx'
export default {
  name: 'Invoice',
  data() {
    return {
      isIphoneHair: App.isIphoneHair,
      invoice: {
        invoiceType: 0, // 0-电子普通发票；1-增值税专用发票
        applicantType: 0, // 0-个人；1-公司
        invoiceTitle: '', // 个人或公司名称
        identifyingCode: '', // 公司识别码(企业统一识别码)
        recipientPhone: '', // 接收电话
        recipientEmail: '', // 接收邮件
        invoiceContent: 4, // 发票内容
        // 以下字段对增值税专用发票有效。
        bankName: '', // 开户银行名称
        bankAccount: '', // 开户账号
        registrationAddress: '', // 注册地址
        registrationPhone: ''// 联系电话
      }
    }
  },
  computed: {},
  filters: {},
  components: {},
  methods: {
    changeInvoiceType(type) {
      this.invoice.invoiceType = type
      if (type == 1) {
        this.invoice.applicantType = 1
      } else {
        this.invoice.applicantType = 0
      }
    },
    changeInvoiceContent(content) {
      this.invoice.invoiceContent = content
    },
    changeApplicantType(value) {
      this.invoice.applicantType = value
    },
    async save() {
      if (this.invoice.invoiceType === 0) {
        if (this.invoice.applicantType == 0) {
          if (!this.invoice.invoiceTitle) {
            wx.showToast('纳税人名称不能为空，请输入！')
            return false
          }
        } else {
          if (!this.invoice.invoiceTitle) {
            wx.showToast('纳税单位名称不能为空，请输入！')
            return false
          }
          if (!this.invoice.identifyingCode) {
            wx.showToast('纳税单位识别号不能为空，请输入！')
            return false
          }
          if (this.invoice.identifyingCode.length !== 15 && this.invoice.identifyingCode.length !== 18 && this.invoice.identifyingCode.length !== 20) {
            wx.showToast('请输入正确的纳税识别号！')
            return false
          }
        }

        if (!this.invoice.recipientPhone) {
          wx.showToast('请输入收票人手机号码！')
          return false
        }
        if (!/^[0-9]?\d{11}$/.test(this.invoice.recipientPhone)) {
          wx.showToast('请输入正确的收票人手机号码！')
          return false
        }
        if (!this.invoice.recipientEmail) {
          wx.showToast('请输入收票人电子邮箱！')
          return false
        }
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.invoice.recipientEmail)) {
          wx.showToast('请输入正确的电子邮箱！')
          return false
        }
      }

      if (this.invoice.invoiceType == 1) {
        if (!this.invoice.invoiceTitle) {
          wx.showToast('纳税单位名称不能为空，请输入！')
          return false
        }
        if (!this.invoice.identifyingCode) {
          wx.showToast('纳税单位识别号不能为空，请输入！')
          return false
        }
        if (this.invoice.identifyingCode.length !== 15 && this.invoice.identifyingCode.length !== 18 && this.invoice.identifyingCode.length !== 20) {
          wx.showToast('请输入正确的纳税识别号！')
          return false
        }
        if (!this.invoice.bankName) {
          wx.showToast('纳税单位开户银行名称不能为空，请输入！')
          return false
        }
        if (!this.invoice.bankAccount) {
          wx.showToast('纳税单位银行开户账号不能为空，请输入！')
          return false
        }
        if (!this.invoice.registrationAddress) {
          wx.showToast('纳税单位注册地址不能为空，请输入！')
          return false
        }
        if (!this.invoice.registrationPhone) {
          wx.showToast('纳税单位电话号码不能为空，请输入！')
          return false
        }
      }
      Store.commit(VUEX.CHECKOUT.SET_INVOICE, this.invoice)// Object.assign({id: result.data.memberInvoiceInfoId}, this.invoice))
      wx.navigateBack()
      // wx.showLoading('正在提交...')
      // const result = await Axios.post('', Object.assign({
      //   method: 'user.saveInvoiceInfo',
      // }, this.invoice))
      // wx.hideLoading();
      // if (result.result.result == 1) {
      //   Store.commit(VUEX.CHECKOUT.SET_INVOICE, Object.assign({id: result.data.memberInvoiceInfoId}, this.invoice))
      //   wx.navigateBack()
      // } else {
      //   wx.showToast(result.result.message)
      // }
    }
  }
  // async onShow() {
  //   const result = await Axios.get('', {params: {
  //     method: 'user.get',
  //   }});
  //   if (result.result.result == 1) {
  //     this.invoice.memberId = result.data.id;
  //   }
  //   const invoiceResult = await Axios.get('', {params: {
  //     memberId: this.invoice.memberId,
  //     method: 'user.findInvoiceInfo',
  //   }})
  //   if (invoiceResult.result.result == 1 && invoiceResult.data && invoiceResult.data.length) {
  //     this.invoice = invoiceResult.data[0];
  //   }
  // }
}
</script>
