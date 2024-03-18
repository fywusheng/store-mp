<template>
  <div class="page-order-list">
    <ul class="tab-list">
      <li class="tab" @click="changeStatus(0)" :class="status === 0 ? 'active':''">
        <div class="name">全部</div>
      </li>
      <li class="tab" @click="changeStatus(10)" :class="status === 10 ? 'active':''">
        <div class="name">待付款</div>
      </li>
      <li class="tab" @click="changeStatus(20)" :class="status === 20 ? 'active':''">
        <div class="name">待发货</div>
      </li>
      <li class="tab" @click="changeStatus(30)" :class="status === 30 ? 'active':''">
        <div class="name">待收货</div>
      </li>
      <li class="tab" @click="changeStatus(40)" :class="status === 40 ? 'active':''">
        <div class="name">待评价</div>
      </li>
    </ul>
    <ul class="order-list">
      <li class="order" @click="toDetail(order)" v-for="(order,parentIndex) in orderList"
        :key="parentIndex">
        <div class="order-header" @click.stop="goStoreDetail(order)">
          <image class="icon-logo"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/no-order.png" mode="" />
          <text>{{order.storeName}}</text>
          <image class="icon-right"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/me/right.png" mode="" />
          <div class="status" :class="{red: order.status === 10}">{{order.orderStatusLabel}}</div>
        </div>

        <template v-if="order.itemList&&order.itemList.length < 2">
          <ul class="item-list">
            <li class="item" :key="itemIndex" v-for="(item,itemIndex) in order.itemList">
              <img class="item-logo" mode="aspectFit" :lazy-load="true" :src="item.imgUrl">
              <div class="item-name">{{item.productName}}</div>
              <div class="sku-name">{{item.skuName}}</div>
              <div class="item-price">¥{{item.sellingPrice | formatDate}} <div class="item-qty">
                  X{{item.skuQuantity}}</div>
              </div>
            </li>
          </ul>
        </template>
        <template v-else>
          <ul class="item-img-list">
            <li class="img-item" :key="itemIndex" v-for="(item,itemIndex) in order.itemList">
              <img class="item-logo" mode="" :lazy-load="true" :src="item.imgUrl">
            </li>
          </ul>
        </template>

        <div class="order-footer">
          共计{{order.totalQuantity}}个
          <span class="total-price">合计：¥{{order.payableAmount | formatDate}}</span>
        </div>
        <div class="footer-btn" @click.stop="">
          <div class="btn-active" @click="confirm(order)" v-if="order.orderStatus === 30">确认收货</div>
          <div class="btn-active" @click="toPay(order)" v-if="order.orderStatus === 10">付款</div>
          <!-- <div class="btn-link" @click="remove(order)" v-if="order.orderStatus < 30">取消订单</div> -->
          <div class="btn-link" @click="logistics(order)"
            v-if="order.orderStatus > 20 && order.orderStatus < 90 && order.orderStatus !== 60">查看物流
          </div>
          <div class="btn-link" @click="toDetail(order)">查看详情</div>
        </div>
      </li>
    </ul>
    <div class="empty" v-if="!loading && !orderList.length">
      <img src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/no-order.png">
      暂无订单数据
      <div class="btn-home" @click="toHome">逛逛更多好货</div>
    </div>
  </div>
</template>

<script>
import wx from 'utils/wx'

export default {
  data() {
    return {
      orderList: [],
      sceneType: '适老用品',
      status: 0,
      pageNum: 1,
      loading: true
    }
  },
  components: {},
  filters: {
    formatDate(price) {
      return Number(price).toFixed(2)
    }
  },
  methods: {
    // 店铺详情
    goStoreDetail(item) {
      uni.navigateTo({ url: '/sub-pages/index/store/main?supplierId=' + item.storeId })
    },
    toHome() {
      XIU.bridge.goHome()
    },
    logistics(order) {
      wx.navigateTo({
        url: '/sub-pages/me/logistics/main?id=' + order.orderId
      })
    },
    toService(item, order) {
      App.currentOrder = order
      if (order.status == 20 || item.status > 1) {
        wx.navigateTo({
          url: `../refund-detail/main?type=1&itemId=${item.itemId}&num=${item.skuQty}`
        })
      } else {
        wx.navigateTo({
          url: `../service-type/main?itemId=${item.itemId}&num=${item.skuQty}`
        })
      }
    },
    async toPay(order) {
      // const {code} = await wx.login();
      wx.showLoading({ title: '正在获取...', mask: true })
      const result = await Axios.post('/payment/sign', {
        orderId: order.orderId,
        paymentMethodCode: 'nepsp_pay',
        code: new Date().getTime()
      })
      wx.hideLoading()
      if (result.code == 200) {
        // 去收银台支付
        uni.reLaunch({
          url: '/pages/common/webpage?url=' + encodeURIComponent(result.data.payUrl)
        })
      } else {
        wx.showToast({
          title: result.msg || '获取失败',
          icon: 'none'
        })
      }
    },
    async remove(order) {
      const result = await wx.showModal({
        title: '',
        content: '确定要取消?'
      })
      if (result.confirm) {
        wx.showLoading({ title: '正在提交...', mask: true })
        const delResult = await Axios.post('/order/cancel', {
          orderId: order.orderId
        })
        wx.hideLoading()
        if (delResult.code == 200) {
          setTimeout(() => {
            wx.showToast({
              title: delResult.msg || '操作成功',
              icon: 'none'
            })
          }, 1500)
          this.changeStatus(this.status)
        } else {
          wx.showToast({
            title: delResult.msg || '操作失败',
            icon: 'none'
          })
        }
      }
    },
    async confirm(order) {
      const result = await wx.showModal({
        title: '',
        content: '确定已收货?'
      })
      if (result.confirm) {
        wx.showLoading('正在提交...')
        const delResult = await Axios.post('/order/confirm', {
          orderId: order.orderId
        })
        wx.hideLoading()
        if (delResult.code == 200) {
          setTimeout(() => {
            wx.showToast({
              title: delResult.msg || '确认成功',
              icon: 'none'
            })
          }, 1500)
          this.changeStatus(this.status)
        } else {
          wx.showToast(delResult.msg || '确认失败')
        }
      }
    },
    changeStatus(status) {
      this.status = status
      this.all_loaded = false
      this.orderList = []
      this.pageNum = 1
      this.loadData()
    },
    async loadData() {
      if (this.all_loaded) {
        return false
      }
      const params = {
        pageNum: this.pageNum++,
        numPerPage: 10,
        sceneType: this.sceneType
      }
      if (this.status > 0) {
        params.status = this.status
      }
      this.loading = true
      wx.showLoading()
      const result = await Axios.post('/order/list', params)
      wx.hideLoading()
      if (result.code == 200) {
        (result.data.list || []).forEach(data => {
          const itemList = []
          data.storeOrderItems.forEach(orderItemModel => {
            orderItemModel.items.forEach(item => {
              item.imgUrl = XIU.getImgFormat(item.imgUrl, '/resize,w_400')
              itemList.push(_.pick(item, ['imgUrl', 'productId', 'productName', 'skuName', 'sellingPrice', 'skuQuantity', 'payableAmount']))
            })
          })
          const tempData = _.pick(data, ['orderId', 'orderStatus', 'totalQuantity', 'orderType', 'orderAmount', 'orderStatusLabel', 'payableAmount', 'storeName', 'storeId'])
          tempData.itemList = itemList
          this.orderList.push(tempData)
          console.log(this.orderList)
        })
        this.all_loaded = result.data.pageNum >= result.data.totalPage
      } else {
        wx.showToast(result.msg)
      }
      this.loading = false
    },
    toDetail(data) {
      uni.navigateTo({
        url: `/sub-pages/me/order-detail/main?id=${data.orderId}`
      })
    },
    toItem(item) {
      wx.navigateTo({
        url: `/pages/item/main?id=${item.productId}`
      })
    }
  },
  onReachBottom() {
    this.loadData()
  },
  async mounted() {
    if (!Store.getters.isLogin) {
      await Store.dispatch('login')
    }
    this.status = parseInt(this.$root.$mp.query.status || 0)
    this.changeStatus(this.status)
  }
}
</script>

<style lang="scss">
@import '~@/styles/base';

.page-order-list {
  padding-top: rpx(88);
  padding-bottom: 95rpx;
  background-color: $gray;
  min-height: 100vh;
  .tab-list {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #fff;
    z-index: 1000;

    .tab {
      position: relative;
      flex: 1;
      text-align: center;

      .name {
        display: inline-block;
        height: rpx(88);
        line-height: rpx(88);
        padding-left: rpx(18);
        padding-right: rpx(18);
        font-size: 18px;
        color: #999;
        border-bottom: rpx(6) solid transparent;
      }

      &.active {
        .name {
          color: #333;
          font-weight: 500;
          border-bottom-color: #ff5500;
        }
      }
    }
  }

  .order-list {
    .order {
      position: relative;
      margin-top: rpx(20);
      padding: 0 rpx(30);
      background-color: #fff;

      .order-header {
        position: relative;
        height: rpx(85);
        line-height: rpx(85);
        font-size: rpx(36);
        color: $black;
        border-bottom: rpx(2) solid #f5f5f5;
        display: flex;
        align-items: center;
        .icon-logo {
          width: 40rpx;
          height: 40rpx;
          margin-right: 8rpx;
        }
        .icon-right {
          width: 15rpx;
          height: 28rpx;
          margin-left: 14rpx;
        }
        .status {
          @include middle-center-y();
          right: rpx(30);
          color: #ff5500;
          font-weight: 400;
          &.red {
            color: $red;
          }
        }
      }

      .item-list {
        .item {
          position: relative;
          padding: rpx(30) rpx(30) rpx(20) rpx(180);
          .item-logo {
            position: absolute;
            top: rpx(30);
            left: 0;
            width: rpx(159);
            height: rpx(159);
            border: rpx(1) solid $border;
          }

          .item-name {
            font-size: rpx(36);
            font-weight: 400;
            @include ellipsis;
          }

          .sku-name {
            padding-top: rpx(12);
            font-size: rpx(32);
            color: $light-black;
          }

          .item-price {
            position: relative;
            font-size: rpx(36);
            color: #999999;
            font-weight: 400;
            .item-qty {
              @include middle-center-y();
              right: rpx(30);
              font-size: rpx(36);
              color: #999999;
            }
          }
          .btn-link {
            position: absolute;
            bottom: rpx(30);
            right: rpx(30);
            font-size: rpx(32);
            text-decoration: underline;
            color: $extra-black;
          }
        }
      }
      .item-img-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        overflow-x: auto;
        &::before {
          display: block;
          content: '';
          height: 100%;
          width: 66rpx;
          position: absolute;
          right: 0;
          top: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.76) 61%,
            #ffffff 100%
          );
        }
        .img-item {
          // background: #ff5500;
          .item-logo {
            width: 152rpx;
            height: 152rpx;
            border-radius: 8rpx;
            margin-right: 24rpx;
          }
        }
      }

      .order-footer {
        text-align: right;
        padding: rpx(20) rpx(30) rpx(30);
        font-size: rpx(32);
        color: $extra-black;
        .total-price {
          margin-left: rpx(10);
          color: $black;
          font-weight: 500;
          font-size: 40rpx;
        }
      }

      .footer-btn {
        display: flex;
        flex-direction: row-reverse;
        padding: rpx(30);
        border-top: rpx(2) solid #f5f5f5;
        .btn-link,
        .btn-active {
          display: inline-block;
          margin-left: rpx(20);
          height: rpx(68);
          line-height: rpx(68);
          border-radius: rpx(128);
          text-align: center;
          width: rpx(180);
          font-size: rpx(32);
          color: $black;
          border: rpx(1) solid $border;
        }

        .btn-active {
          color: #ff711a;
          background: #ffffff;
          border: 2rpx solid #ff711a;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
