<template>
  <div class="page-logistics-info">
    <ul class="info-list" v-for="item in orderExpressModel" :key="item.id">
      <li class="info">
        快递公司: {{item.expressProviderName}}
      </li>
      <li class="info">
        快递单号: {{item.trackingNumber}}
      </li>
    </ul>
    <ul class="trace-list">
      <template v-if="logistics.senderInfoList">
        <li class="trace" :key="index" v-for="(senderInfo,index) in logistics.senderInfoList">
          <div class="line"></div>
          您的包裹正在派件,快递员({{senderInfo.personName}}),电话({{senderInfo.personTel}})
        </li>
      </template>
      <template v-if="logistics.traceList">
        <li class="trace" :key="index" v-for="(trace,index) in logistics.traceList">
          <div class="line"></div>
          您的包裹到达({{trace.acceptStation}}),时间({{senderInfo.acceptTime}})
        </li>
      </template>
      <template v-if="logistics.pickerInfoList">
        <li class="trace" :key="index" v-for="(pickerInfo,index) in logistics.pickerInfoList">
          <div class="line"></div>
          您的包裹正在等待收件,网点({{pickerInfo.stationName}}),收件员({{pickerInfo.personName}}),电话({{pickerInfo.personTel}})
        </li>
      </template>

    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderExpressModel: [],
      logistics: {
        pickerInfoList: [],
        senderInfoList: [],
        traceList: []
      }
    }
  },
  methods: {
    // async loadData() {
    //   wx.showLoading({ title: '正在获取数据...', mask: true })
    //   const orderResult = await wx.request({
    //     data: {
    //       method: 'order.show',
    //       orderId: this.id
    //     }
    //   })
    //   wx.hideLoading()
    //   if (orderResult.result.result != 1) {
    //     wx.showToast({
    //       title: orderResult.result.message,
    //       icon: 'none'
    //     })
    //     return false
    //   }
    //   if (orderResult.data.orderExpressModels && orderResult.data.orderExpressModels.length) {
    //     this.orderExpressModel = orderResult.data.orderExpressModels[0]
    //     const result = await wx.request({
    //       method: 'express.query',
    //       logisticCode: this.orderExpressModel.oddNumber,
    //       shipperCode: this.orderExpressModel.expressSign,
    //       orderId: this.id
    //     })
    //     if (result.result.result == 1) {
    //       this.logistics = result.data || {}
    //     } else {
    //       wx.showToast({
    //         title: result.result.message,
    //         icon: 'none'
    //       })
    //     }
    //   }
    // }
    async loadData() {
      this.loading = true
      uni.showLoading()
      const result = await Axios.post('/order/get', { orderId: this.id })
      uni.hideLoading()
      this.loading = false
      if (result.code == 200) {
        this.orderExpressModel = result.data.orderExpressList
      } else {
        uni.showToast(result.result.message)
      }
    }
  },
  onUnload() {
    this.order = {}
  },
  onPageScroll(e) {
    this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight)
  },
  async mounted() {
    uni.setNavigationBarTitle({
      title: '查看物流'
    })
    this.id = this.$root.$mp.query.id
    this.loadData()
  }
}
</script>

<style lang="scss">
.page-logistics-info {
  .info-list {
    padding-left: 30rpx;
    padding-right: 30rpx;
    border-bottom: 1rpx solid #f2f2f2;
    .info {
      padding-top: 30rpx;
      padding-bottom: 30rpx;
      font-size: 36rpx;
      color: #333;
    }
  }
  .trace-list {
    .trace {
      position: relative;
      padding-left: 30rpx;
      padding-top: 30rpx;
      font-size: 16rpx;
      color: #333;
      &:after {
        content: '';
        left: 0;
        bottom: 4rpx;
        position: absolute;
        width: 10rpx;
        height: 10rpx;
        background-color: #a8b2ba;
        border-radius: 50%;
      }
      &:first-child {
        color: #333;
        &:after {
          background-color: #fff;
        }
        .line {
          top: 38rpx;
        }
      }
      .line {
        position: absolute;
        left: 5rpx;
        top: 0;
        bottom: 0;
        border-left: 1px solid #f2f2f2;
      }
    }
  }
}
</style>
