<template>
  <div class="page-item" :class="{isIphoneHair}" v-if="!loading" :disableScroll='true'>
    <view class="fixHead" :class="fixTop?'':'noshow'">
      <view class="shop" @click="point(1)" :class="actived == 1?'aclass':''">商品</view>
      <view class="detail" @click="point(2)" :class="actived == 2?'aclass':''">详情</view>
    </view>
    <div class="empty-wrap" v-if="product&&product.saleState !== 5">
      <img class="tip" src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/tip.png">
      <div class="title">很抱歉，您查看的商品已无效！</div>
      <div class="desc">您可以选择浏览其他商品</div>
      <button type="button" class="btn-view" @click="toHome">看看其他商品</button>
    </div>
    <template v-else>
      <swiper class="banner-list" :circular="true" :indicator-dots="true"
        indicator-active-color="#FF711A" :autoplay="true" :duration="1000">
        <swiper-item v-for="(productImg,index) in productImgList" :key="index">
          <div class="banner" :style="{backgroundImage: 'url('+productImg+')'}"
            @click="previewImg(index)"></div>
        </swiper-item>
      </swiper>
      <div class="area">
        <div class="getPrice" v-if="product.creditPoints && selectSize.presentPrice>=0">
          <img class="collected" src="https://ggllstatic.hpgjzlinfo.com/static/home/getP.png">
          <view class="flex_line">
            <view class="item">
              <view class="g">到手价</view>
              <view class="g_n">￥{{selectSize.presentPrice}}</view>
            </view>
            <view class="item_d">
              <view class="d">=</view>
            </view>
            <view class="item_p">
              <view class="g">原价</view>
              <view class="g_n">￥{{selectSize.sellingPrice}}</view>
            </view>
            <view class="item_d">
              <view class="d">-</view>
            </view>
            <view class="item_p">
              <view class="g">积分抵扣</view>
              <view class="g_n">￥{{product.creditPoints}}</view>
            </view>
          </view>
        </div>
        <div class="product-info" :class="product.creditPoints?'margTop':''">
          <div class="product-price">
            <div class="sell-price">
              <div class="unit">¥</div>
              <span>{{selectSize.sellingPrice}}</span>
            </div>
            <div class="market-price" v-if="selectSize.markOffPrice">
              ¥{{selectSize.markOffPrice}}
            </div>
          </div>
          <div class="product-desc">
            {{product.name?product.name:''}}
          </div>
          <!-- <div class="store-wrap" @click="changeFavor">
            <img v-if="product.isCollected == 1" class="collected"
              src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/store_h.png">
            <img v-else class="collected"
              src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/store_n.png">
          </div> -->
          <!-- <div class="product-desc" v-if="product.subName">{{product.subName}}</div> -->
        </div>
      </div>
      <div class="line"></div>
      <view v-if="couponList && couponList.length" @click="showModal('couponList')" class="line_j">
        <view class="f_w">
          <view class="pres">
            <!-- {{couponList[0].checkThreshold == 0?'无门槛':`满${couponList[0].thresholdValue}减`}}
            <span v-if="couponList[0].type==0">{{couponList[0].denominationStr}}元</span>
            <span v-else-if="couponList[0].type==1">打{{couponList[0].denominationStr}}折</span> -->
            <view v-if="couponList[0].checkThreshold == 0">
              {{`无门槛${couponList[0].denominationStr}元`}}</view>
            <view v-else>
              <span
                v-if="couponList[0].type==0">{{`满${couponList[0].thresholdValue}减`+ couponList[0].denominationStr}}元</span>
              <span
                v-else-if="couponList[0].type==1">{{`满${couponList[0].thresholdValue}打`+couponList[0].denominationStr}}折</span>
            </view>
          </view>
          <view class="pres _right" v-if="couponList && couponList.length>=2">
            <view v-if="couponList[1].checkThreshold == 0">
              {{`无门槛${couponList[1].denominationStr}元`}}</view>
            <view v-else>
              <span
                v-if="couponList[1].type==0">{{`满${couponList[1].thresholdValue}减`+ couponList[1].denominationStr}}元</span>
              <span
                v-else-if="couponList[1].type==1">{{`满${couponList[1].thresholdValue}打`+couponList[1].denominationStr}}折</span>
            </view>
            <!-- {{couponList[1].checkThreshold == 0?'无门槛':`满${couponList[1].thresholdValue}减`}}
            <span v-if="couponList[1].type==0">{{couponList[1].denominationStr}}元</span>
            <span v-else-if="couponList[1].type==1">打{{couponList[1].denominationStr}}折</span> -->
          </view>
        </view>
        <view class="btn_page">领券<view class="right_icon"></view>
        </view>
      </view>
      <!-- <div class="line"></div> -->
      <ul class="info-list">
        <li class="info border-b">
          <div class="title">货号</div>
          <view class="font_value">{{product.code}}</view>
        </li>
        <li class="info border-b">
          <div class="title">发货地</div>
          <view class="font_value">
            {{product.deliveryRegion}} 预计
            <template v-if="product.deliveryMinDays < product.deliveryMaxDays">
              {{product.deliveryMinDays}}-{{product.deliveryMaxDays}}
            </template>
            <template v-else>{{product.deliveryMinDays}}</template>
            个工作日送达
          </view>

        </li>
        <li class="info">
          <div class="title">运费</div>
          <!-- <view class="font_value"> {{product.tariffType == 0 ? '商家承担':'额外运费需用户承担'}}</view> -->

          <!-- 全免包邮 -->
          <view v-if="freight.isPostage === 1 && freight.postage === 0" class="font_value">商家包邮
          </view>
          <!-- 满X元包邮 -->
          <view
            v-if="freight.isPostage === 1 && freight.postage > 0 && freight.templates[0].firstPrice"
            class="font_value freight">
            店铺单笔订单不满{{freight.postage}}元，收运费{{freight.templates[0].firstPrice}}元（请以提交订单时为准）
          </view>
          <!-- 不包邮 -->
          <view v-if="freight.isPostage === 0" class="font_value">
            {{freight.templates[0].firstPrice}}元
          </view>
          <!-- 未设置运费模版 -->
          <view v-if="!freight" class="font_value">
            商家承担
          </view>

        </li>
      </ul>
      <div class="line"></div>
      <div class="sku-list-wrap" v-if="colorList.length">
        <div class="title">{{product.firstClassName}}</div>
        <div class="label-list">
          <div class="label"
            :class="selectColor.firstClassAttrId == color.firstClassAttrId ? 'active':''"
            v-for="(color,index) in colorList" :key="index" @click="changeSku('selectColor',color)">
            {{color.firstClassAttrName}}
          </div>
        </div>
        <div class="title">{{product.subClassName}}</div>
        <div class="label-list">
          <block v-for="(size,index) in sizeList" :key="index">
            <li v-if="size.availableStock == 0" class="condition disabled label">
              {{size.subClassAttrName}}
            </li>
            <div v-else class="label"
              :class="selectSize.subClassAttrId == size.subClassAttrId ? 'active':''"
              @click="changeSku('selectSize', size)">
              {{size.subClassAttrName}}
            </div>
          </block>
        </div>
      </div>
      <div class="line"></div>
      <ul class="info-list">
        <li class="info" @click="toAttribute">
          <div class="title">产品参数</div>
          <div class="btn-right">更多参数<img
              src="https://ggllstatic.hpgjzlinfo.com/static/images/common/right-gray.png"></div>
        </li>
        <!--        <li class="info border-b">-->
        <!--          <div class="title">评价</div>-->
        <!--          <div class="btn-right">查看全部评价<img src="https://ggllstatic.hpgjzlinfo.com/static/images/common/right-gray.png"></div>-->
        <!--        </li>-->
      </ul>
      <!-- <div class="line"></div> -->
      <div class="storeList" v-if="storeList.length>0">
        <div class="_t">适用门店</div>
        <div class="_center">
          <img mode="scaleToFill" class="_img" :src="storeList[0].storesPic" />
          <div class="right">
            <div class="_n">
              <div class="n">{{storeList[0].storesName}}</div>
              <div class="k" v-if="storeList[0].distance">距您{{storeList[0].distance}}km</div>
            </div>
            <div class="_a">{{storeList[0].storesAddress}}</div>
          </div>
        </div>
        <button class="btn" v-if="storeList.length>1" @click="watchMore">查看更多</button>
      </div>
      <div class="line"></div>
      <div class="inStore">
        <div class="left">
          <img mode="scaleToFill" class="_img" :src="product.supplierDTO.supplierStorePicUrl" />
          <div class="_right">
            <div class="name">{{product.supplierDTO.supplierStoreName}}</div>
            <div class="num">商品共{{product.productNum}}件</div>
          </div>
        </div>
        <div class="right">
          <button class="btn-into" @click="goStoreDetail">进店逛逛</button>
        </div>
      </div>

      <div class="line"></div>
      <!-- <div class="brand-container" v-if="product.brand">
        <div class="logo" :style="{backgroundImage: 'url('+product.brand.brandLogo+')'}"></div>
        <div class="name">{{product.brand.name}}</div>
        <div class="btn-collect" @click="changeAttention">{{isAttention ? '已收藏':'收藏'}}</div>
      </div>
      <div class="line"></div> -->
      <div class="detail-img-list">
        <div class="title shopDetail">商品详情</div>
        <rich-text class="rich-text" v-if="detailContents.length>0" :nodes="detailContents">
        </rich-text>
        <img mode="widthFix" :src="img" v-for="(img,index) in detailImageList" :key="index">
      </div>
      <div class="footer">
        <button class="btn-service" @click="goStoreDetail">
          <img class="icon-img"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/store.png">
          店铺
        </button>
        <div class="btn-cart" @click="toCart">
          <img class="icon-img"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/cart_new.png">
          购物车
          <span class="count" v-if="cartCount > 0">{{cartCount}}</span>
        </div>
        <div class="btn-add-cart" @click="addCart">加入购物车</div>
        <div class="btn-buy" @click="checkout">立即购买</div>

      </div>
    </template>
    <select-sku ref="selectSku" :selectSize="selectSize" :product="product"
      :selectColor="selectColor" :productImgList="productImgList" :colorList="colorList"
      :sizeList="sizeList"></select-sku>
    <coupon-list ref="couponList" @loadCoupon="loadCoupon" :couponList="couponList"></coupon-list>
    <top ref="toTop" :bottom="isIphoneHair ? 224 : 160" :show-contact="showContact"></top>
  </div>
</template>

<script>
import Top from '@/sub-pages/index/components/top.vue'
import SelectSku from './components/select-sku'
import CouponList from './components/coupon-list'

export default {
  data() {
    return {
      isIphoneHair: App.isIphoneHair,
      showContact: false,
      sceneType: '', // 场景类型：适老用品、积分兑换
      productId: '',
      freight: null, // 运费模版
      product: null,
      productImgList: [],
      skuImg: {},
      colorList: [],
      saleTypeList: [{ name: '预售', id: 1 }, { name: '现货', id: 2 }],
      sizeList: [],
      selectSaleType: {},
      selectColor: {},
      selectSize: {},
      detailContents: '',
      detailImageList: [],
      attributeList: [],
      couponList: [],
      isAttention: false,
      cartCount: 0,
      loading: true,
      storeList: [],
      fixTop: false,
      actived: 1
    }
  },
  components: {
    Top,
    SelectSku,
    CouponList
  },
  watch: {
    selectColor() {
      this.productImgList = []
      this.sizeList = this.selectColor.skuAndPriceList
      this.sizeList.some(size => {
        if (size.availableStock) {
          this.selectSize = size
          return true
        }
      })
      // 如果首次属性子属性的库存都为0的话默认显示第一个子属性的sku
      const empt = this.sizeList.every(size => {
        return size.availableStock == 0
      })
      if (empt) {
        this.selectSize = this.sizeList[0]
      }
      this.$nextTick(() => {
        const list = [XIU.getImgFormat(this.product.mainImgUrl, '/resize,w_750')];
        (this.selectColor.imgUrlList || []).forEach(img => {
          list.push(XIU.getImgFormat(img, '/resize,w_750'))
        })
        this.productImgList = list
      })
    }
  },
  created() {
  },
  methods: {
    point(flag) {
      this.actived = flag
      const flags = { 1: 0, 2: 1200 }
      uni.pageScrollTo({
        scrollTop: flags[flag]
      })
    },
    toAttribute() {
      uni.setStorageSync('attribute', this.attributeList)
      uni.navigateTo({
        url: '/sub-pages/index/item-attribute/main'
      })
    },
    toComment() {
      uni.navigateTo({
        url: '/sub-pages/index/item-reviews/main?id=' + this.productId
      })
    },
    previewImg(index) {
      uni.previewImage({
        urls: this.productImgList,
        current: this.productImgList[index]
      })
    },
    toHome() {
      if (this.sceneType === '适老用品') {
        uni.navigateTo({
          url: '/sub-pages/index/index/main'
        })
      } else {
        uni.navigateTo({
          url: '/sub-pages/point/index'
        })
      }
    },
    // 门店列表
    async getStoreList() {
      const location = uni.getStorageSync('location')
      const params = {
        supplierId: this.product.supplierId,
        pageNum: 1,
        pageSize: 15,
        queryObject: {
          cusLt: location.longitude,
          cusLat: location.latitude
        },
        ids: this.product.storeIds
      }
      const result = await Axios.post('/srm/stores/listByPageNo', params)
      if (result.code == '200') {
        const data = result.data
        this.storeList = data.list || []
      } else {
        this.$uni.showToast(result.msg)
      }
    },
    async updateCart() {
      const result = await Axios.post('/cart/getNum', { sceneType: this.sceneType })
      if (result.code == 200) {
        this.cartCount = result.data.cartNum
        // result.data > 0 ? wx.setTabBarBadge({
        //   index: 2,
        //   text: `${result.data.cartNum}`
        // }) : wx.removeTabBarBadge({
        //   index: 2
        // })
      }
    },
    async loadCoupon() {
      const couponResult = await Axios.get('/coupon/getByProduct', {
        params: {
          pId: this.productId
        }
      })
      if (couponResult.code == 200) {
        this.couponList = couponResult.data
      }
    },
    async changeAttention() {
      if (!Store.getters.isLogin) {
        uni.navigate({
          // url: '/sub-pages/index/login/main'
        })
        return false
      }
      uni.showLoading('正在提交...')
      const result = await Axios.get(!this.isAttention ? 'brand/addconcern' : 'brand/delconcern', {
        params: {
          id: this.product.brand.id
        }
      })
      uni.hideLoading()
      if (result.code == 200) {
        this.isAttention = !this.isAttention
        this.$uni.showToast(this.isAttention ? '收藏成功' : '取消成功')
      } else {
        this.$uni.showToast(result.msg || '操作失败')
      }
    },
    toCart() {
      if (!Store.getters.isLogin) {
        Store.dispatch('logout')
        uni.navigateTo({
          url: '/pages/user-center/login'
          // url: '/sub-pages/index/login/main''
        })
        return false
      }
      if (this.sceneType === '积分兑换') {
        uni.navigateTo({
          url: '/sub-pages/point/cart/main?sceneType=' + this.sceneType
        })
      } else {
        uni.navigateTo({
          url: '/sub-pages/index/index/main?index=4&&sceneType' + this.sceneType
        })
      }
    },
    async changeFavor() {
      if (!Store.getters.isLogin) {
        uni.navigate({
          url: '/pages/user-center/login'
        })
        return false
      }
      uni.showLoading('正在提交...')
      const result = await Axios.post(this.product.isCollected == 1 ? '/product/deleteFavorites' : '/product/addFavorites', {
        id: this.productId
      })
      uni.hideLoading()
      if (result.code == 200) {
        this.product.isCollected = this.product.isCollected == 1 ? 0 : 1
        this.$uni.showToast(result.msg)
      } else {
        this.$uni.showToast(result.msg || '操作失败')
      }
    },
    showModal(name) {
      this.$refs[name].show(true, 1, this.sceneType)
    },
    changeSku(type, value) {
      this[type] = value
    },
    goStoreDetail() {
      // 店铺详情
      uni.navigateTo({ url: '/sub-pages/index/store/main?supplierId=' + this.product.supplierId })
    },
    watchMore() {
      // 门店
      uni.navigateTo({ url: '/sub-pages/index/shop/main?supplierId=' + this.product.supplierId })
      // wx.navigateTo({url:'/pages/supermarket/other-market'})
    },
    addCart() {
      if (!Store.getters.isLogin) {
        Store.dispatch('logout')
        uni.navigateTo({
          url: '/pages/user-center/login'
          // url: '/sub-pages/index/login/main''
        })
        return false
      }
      this.$refs.selectSku.show(true, 1, this.sceneType)
    },
    checkout() {
      if (!Store.getters.isLogin) {
        Store.dispatch('logout')
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
        return false
      }
      this.$refs.selectSku.show(true, 2, this.sceneType)
    },
    async loadData() {
      uni.showLoading()
      this.loading = true
      const result = await Axios.post('/product/get', {
        // params: {
        id: this.productId
        // },
      })
      uni.hideLoading()
      this.loading = false
      if (result.code == 200) {
        uni.setNavigationBarTitle({
          title: result.data.name
        })
        if (result.data.productDetail) {
          const imgReg = /<img.*?(?:>|\/>)/gi// 匹配src属性
          const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
          const detailImageList = [];
          (result.data.productDetail.match(imgReg) || []).map((imageTag) => {
            const img = imageTag.match(srcReg)[1]
            if (/^http/.test(img)) {
              // 获取图片地址
              detailImageList.push(XIU.getImgFormat(imageTag.match(srcReg)[1], '/resize,w_750'))
            }
          })
          this.detailImageList = detailImageList
          if (this.detailImageList.length == 0) {
            this.detailContents = result.data.productDetail
          }
        }
        result.data.firstClassName = result.data.firstClassName || '颜色'
        result.data.subClassName = result.data.subClassName || '尺码'
        this.product = result.data
        this.isAttention = this.product.brand.isConcerned == 1
        this.title = this.product.name
        this.colorList = []
        this.product.skuList && this.product.skuList.forEach(skuPriceAndStock => {
          this.colorList.push(skuPriceAndStock)
        })
        this.selectSaleType = this.saleTypeList[0]
        if (this.colorList.length) {
          this.selectColor = this.colorList[0]
          this.sizeList = this.colorList[0].skuAndPriceList
          const list = [this.product.mainImgUrl]
          this.productImgList = list.concat(this.colorList[0].imgUrlList || [])
        }
        this.sizeList.some(size => {
          if (size.availableStock) {
            this.selectSize = size
            return true
          }
        })
        // 如果首次属性子属性的库存都为0的话默认显示第一个子属性的sku
        const empt = this.sizeList.every(size => {
          return size.availableStock == 0
        })
        if (empt) {
          this.selectSize = this.sizeList[0]
        }
        this.attributeList = []
        this.product.attributes && this.product.attributes.forEach(attribute => {
          this.attributeList.push({
            name: attribute.attrName,
            value: attribute.attrValContent
          })
        })
        if (this.product.storeIds.length > 0) {
          this.getStoreList()
        }
        // 获取商家运费模版
        this.getTempBySupplierId(result.data.supplierId)
      } else {
        this.$uni.showToast(result.msg || '获取商品信息失败')
      }
      if (Store.getters.isLogin) {
        this.updateCart()
      }
      // TODO 等待后端处理，不需要登录就能使用  先注释
      this.loadCoupon()
    },
    // 获取商家运费模版
    async getTempBySupplierId(supplierId) {
      const result = await Axios.post('/freightTemplate/getTempBySupplierId', { supplierId })
      if (result.code == 200) {
        this.freight = result.data
      } else {
        this.$uni.showToast(result.msg)
      }
    }
  },
  onUnload() {
    this.$refs.selectSku.show(false)
    this.product = {}
    this.productImgList = []
    this.detailImageList = []
    this.colorList = []
  },
  onShareAppMessage() {
    console.info('sub-pages/index/item/main?id=' + this.productId + '&sceneType=' + this.sceneType)
    return {
      path: 'sub-pages/index/item/main?id=' + this.productId + '&sceneType=' + this.sceneType,
      title: this.product.name,
      imageUrl: this.product.mainImgUrl
    }
  },
  onPageScroll(e) {
    var query = uni.createSelectorQuery()
    query.select('.sell-price').boundingClientRect()
    query.exec((res) => {
      if (res[0].top < 86) {
        this.fixTop = true
      } else {
        this.fixTop = false
      }
    })
    this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight)
  },
  async onShow() {
    console.info('query:', this.$root.$mp.query)
    // if (!Store.getters.isLogin) {
    //   await Store.dispatch('login')
    // }
    this.productId = this.$root.$mp.query.id
    this.sceneType = this.$root.$mp.query.sceneType
    this.loadData()
    // this.updateCart()
    // App.updateCartNum()
  }
}
</script>

<style lang="scss">
@import '~@/styles/base';
.line {
  height: 18rpx;
}
.page-item {
  overflow-y: auto;
  padding-bottom: rpx(150);
  background: #fff;
  .fixHead {
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    font-size: 40rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    height: 78rpx;
    line-height: 78rpx;
    background-color: #fff;
    width: 100%;
    justify-content: space-around;
    z-index: 3000;
    // .shop {
    // }
    .aclass {
      border-bottom: 8rpx solid #ff711a;
      font-size: 44rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
  }
  .noshow {
    display: none;
  }
  &.isIphoneHair {
    padding-bottom: rpx(214);
    .footer {
      padding-bottom: rpx(64);
    }
  }
  .banner-list {
    position: relative;
    height: rpx(750);
    background: #fff;

    .banner {
      width: rpx(750);
      height: rpx(750);
      @include background-image();
    }
  }
  .area {
    background: #ffffff;
    padding-bottom: 23rpx;
    padding-top: 32rpx;
    .getPrice {
      height: 216rpx;
      background-size: contain;
      width: 95%;
      margin: 0 auto;
      position: relative;
      .flex_line {
        display: flex;
        justify-content: space-evenly;
        position: absolute;
        top: 31rpx;
        text-align: center;
        width: 100%;
        .item {
          .g {
            font-size: 32rpx;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            font-weight: 400;
            color: #ffffff;
          }
          .g_n {
            font-size: 48rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
          }
        }
        .item_d {
          height: 100rpx;
          line-height: 148rpx;
          .d {
            font-size: 32rpx;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            font-weight: 400;
            color: #ffffff;
          }
        }
        .item_p {
          .g {
            font-size: 32rpx;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            font-weight: 400;
            color: #ffffff;
          }
          .g_n {
            font-size: 30rpx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            margin-top: 12rpx;
          }
        }
      }
    }
    .margTop {
      margin-top: -61rpx !important;
    }
    .product-info {
      position: relative;
      padding-left: rpx(30);
      padding-right: rpx(30);
      background-color: #fff;
      text-align: left;
      width: 95%;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0rpx 8rpx 24rpx 0rpx rgba(0, 0, 0, 0.12);
      border-radius: 24rpx;
      .product-name {
        padding-right: rpx(50);
        // padding-top: rpx(38);
        color: $black;
        font-size: rpx(30);
        @include multi-ellipsis();
        line-height: rpx(56);
      }

      .store-wrap {
        position: absolute;
        right: rpx(8);
        top: rpx(10);
        width: rpx(100);
        height: rpx(100);
        z-index: 100;

        .collected {
          @include middle-center();
          width: rpx(38);
          height: rpx(38);
        }
      }

      .product-desc {
        padding-top: rpx(20);
        padding-bottom: rpx(25);
        color: $extra-light-black;
        font-size: rpx(44);
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }

      .product-price {
        position: relative;
        display: flex;
        /*padding-top: rpx(20);*/
        // padding-bottom: rpx(20);
        align-items: center;

        .sell-price {
          padding-top: 12rpx;
          color: #ff5500;
          position: relative;
          display: flex;
          align-items: center;
          padding-left: rpx(20);
          line-height: 70rpx;
          /*font-weight: 500;*/

          .unit {
            position: absolute;
            left: 0;
            bottom: rpx(10);
            margin-right: rpx(5);
            font-size: rpx(26);
          }

          span {
            font-size: rpx(54);
            font-weight: 500;
          }
        }

        .market-price {
          margin-left: rpx(20);
          color: $light-black;
          font-size: rpx(28);
          text-decoration: line-through;
          margin-top: 14rpx;
        }
      }
    }
  }
  .line_j {
    background-color: #ffffff;
    height: 112rpx;
    line-height: 112rpx;
    display: flex;
    justify-content: space-between;
    padding: 20rpx 32rpx 32rpx 50rpx;
    .f_w {
      display: flex;
      justify-content: flex-start;
      ._right {
        margin-left: 20rpx;
      }
    }
    .pres {
      border-radius: 4rpx;
      border: 2rpx solid #ff2600;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff2600;
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 8rpx;
    }
    .btn_page {
      margin-top: 5rpx;
      position: relative;
      width: 162rpx;
      height: 48rpx;
      background: #ff711a;
      border-radius: 8rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      line-height: 48rpx;
      .right_icon {
        width: 0rpx;
        height: 0rpx;
        border-left: 10rpx solid #fff;
        border-top: 11rpx solid transparent;
        border-bottom: 8rpx solid transparent;
        position: absolute;
        top: 15rpx;
        right: 26rpx;
      }
    }
  }
  .info-list {
    padding-left: rpx(30);
    padding-right: rpx(30);
    background-color: #fff;
    .info {
      position: relative;
      padding-left: rpx(128);
      padding-right: 0;
      // height: rpx(90);
      line-height: rpx(90);
      font-size: rpx(26);
      color: $light-black;
      @include ellipsis();
      .title {
        @include middle-center-y();
        left: 0;
        color: $black;
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        /*font-weight: 500;*/
      }
      .font_value {
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        margin-left: 40rpx;
        &.freight {
          width: 504rpx;
          line-height: normal;
          word-break: break-all;
          white-space: pre-wrap;
        }
      }
      .btn-right {
        display: flex;
        align-items: center;
        float: right;
        color: $light-black;
        font-size: 32rpx;
        img {
          margin-left: rpx(10);
          width: rpx(36);
          height: rpx(36);
        }
      }
      .more {
        @include middle-center-y();
        right: 0;
        width: rpx(42);
        height: rpx(12);
      }
    }
  }
  .inStore {
    padding: 14rpx 20rpx 12rpx 30rpx;
    display: flex;
    align-items: center;
    .left {
      display: flex;
      width: 86%;
      ._img {
        width: 136rpx;
        height: 136rpx;
        margin-right: 16rpx;
        background: #d6b172;
        border-radius: 12rpx;
        border: 2rpx solid #f5f5f5;
      }
      ._right {
        .name {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .num {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          margin-top: 30rpx;
        }
      }
    }
    .right {
      width: 30%;
      .btn-into {
        width: 162rpx;
        height: 62rpx;
        line-height: 62rpx;
        background: #ff711a;
        border-radius: 8rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
  .storeList {
    padding: 24rpx 32rpx 24rpx 32rpx;
    ._t {
      font-size: 40rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    ._center {
      display: flex;
      margin-top: 40rpx;
      ._img {
        width: 128rpx;
        height: 128rpx;
      }
      .right {
        margin-left: 24rpx;
        width: 78%;
        ._n {
          display: flex;
          justify-content: space-between;
          .n {
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            width: 278rpx;
          }
          .k {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
        ._a {
          margin-top: 32rpx;
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
    .btn {
      width: 100%;
      height: 84rpx;
      line-height: 80rpx;
      background: #ffffff;
      border-radius: 42rpx;
      border: 2px solid #ff5500;
      margin-top: 32rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ff5500;
    }
  }
  .sku-list-wrap {
    padding: rpx(45) rpx(30) rpx(1);
    background-color: #fff;

    .title {
      font-size: rpx(36);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }

    .label-list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: rpx(45);

      .label {
        position: relative;
        margin-top: rpx(30);
        margin-right: rpx(25);
        padding-left: rpx(5);
        padding-right: rpx(5);
        min-width: rpx(110);
        max-width: rpx(210);
        height: rpx(64);
        line-height: rpx(64);
        text-align: center;
        font-size: rpx(36);
        @include ellipsis();
        color: $light-black;
        border: rpx(2) solid #cdcdcd;

        &.active {
          color: $black;
          border-color: $black;

          &:after {
            content: '';
            position: absolute;
            right: -6px;
            bottom: -6px;
            width: 12px;
            height: 12px;
            background: #111;
            transform: rotate(-45deg);
          }
        }

        &.disabled {
          border: 1px dotted #cdcdcd;
          color: #aaaaaa;
          cursor: not-allowed;
        }
      }
    }
  }

  .comment-container {
    position: relative;
    padding-left: rpx(28);
    height: rpx(100);
    line-height: rpx(100);
    font-size: rpx(30);
    background-color: #fff;
    border-bottom: rpx(1) solid $border;
    .btn-right {
      display: flex;
      align-items: center;
      @include middle-center-y();
      right: rpx(30);
      color: #888888;
      font-size: rpx(36);

      img {
        margin-left: rpx(10);
        width: rpx(26);
        height: rpx(26);
      }
    }
  }

  .brand-container {
    position: relative;
    background-color: #fff;
    min-height: rpx(140);
    padding: rpx(40) rpx(140) rpx(30) rpx(154);

    .logo {
      @include middle-center-y();
      left: rpx(30);
      @include background-image();
      width: rpx(100);
      height: rpx(100);
      background-size: contain;
    }

    .name {
      @include middle-center-y();
      font-size: rpx(30);
    }

    .number {
      padding-top: rpx(20);
      font-size: rpx(22);
      color: #888;
    }

    .btn-collect {
      @include middle-center-y();
      right: rpx(30);
      border: 1px solid #050505;
      padding: rpx(6) rpx(30);
      text-align: center;
      font-size: rpx(24);
      color: $extra-light-black;
    }
  }

  .detail-img-list {
    margin-top: rpx(20);
    background-color: #fff;

    .title {
      display: block;
      padding: rpx(32) rpx(24) rpx(48);
      font-size: rpx(40);
      color: $black;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
    img {
      display: block;
      width: 100%;
    }
    .rich-text {
      line-height: 1.5;
      padding: rpx(30);
      font-size: rpx(26);

      .img {
        display: block;
        width: 100%;
      }
    }
  }

  .footer {
    position: fixed;
    width: 100%;
    bottom: 0;
    background-color: #fff;
    box-shadow: 0px -1px 0px 0px rgba(238, 237, 237, 1);
    // height: 144rpx;
    display: flex;
    align-items: center;
    width: rpx(750);
    padding-right: 22rpx;
    padding-top: 12rpx;
    padding-bottom: 12rpx;
    // @include middle-center-x(fixed);

    .btn-block-buy {
      display: block;
      width: 100%;
      @include btn();
    }

    .btn-service,
    .btn-cart {
      position: relative;
      font-size: rpx(32);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #606266;
      text-align: center;
      width: rpx(120);

      line-height: rpx(47);
      .icon-img {
        display: block;
        // margin: rpx(10) auto rpx(5);
        width: rpx(48);
        height: rpx(48);
        margin: 0 auto;
      }
    }

    .btn-cart {
      padding-right: rpx(20);
      width: rpx(130);
      position: relative;

      i {
        position: relative;

        &:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: rpx(10);
          height: rpx(10);
          border-radius: 50%;
        }
      }

      .count {
        position: absolute;
        right: rpx(20);
        top: rpx(5);
        background-color: $red;
        height: rpx(40);
        width: rpx(40);
        text-align: center;
        line-height: rpx(40);
        color: #fff;
        border-radius: 50%;
        @include ellipsis();
      }
    }

    .btn-add-cart,
    .btn-buy {
      width: rpx(250);
      border-radius: 0;
    }

    .btn-add-cart {
      @include btn();
      //background-color: $main-color;
      border-top-left-radius: 47rpx;
      border-bottom-left-radius: 47rpx;
      border: 2rpx solid #ff711a;
      color: #ff5500;
      background: #fff;
      height: 95rpx;
      line-height: 95rpx;
      font-size: 36rpx;
    }

    .btn-buy {
      @include btn();
      border-top-right-radius: 47rpx;
      border-bottom-right-radius: 47rpx;
      height: 95rpx;
      line-height: 95rpx;
      font-size: 36rpx;
    }
  }

  .empty-wrap {
    min-height: 80vh;
    padding-left: rpx(100);
    padding-right: rpx(100);
    text-align: center;

    .tip {
      display: block;
      margin: rpx(152) auto rpx(53);
      width: rpx(245);
      height: rpx(245);
    }

    .title {
      font-size: rpx(36);
      line-height: rpx(50);
      color: $extra-black;
    }

    .desc {
      padding-top: rpx(16);
      font-size: rpx(30);
      line-height: rpx(40);
    }

    .btn-view {
      margin-top: rpx(215);
      @include btn-block();
    }
  }
}
</style>
