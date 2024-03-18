// 适老用品首页
<template>
  <view class="pro_bg">
    <view class="_head"></view>
    <view class="old_pro">
      <view class="bar">
        <view class="new-header" :style="{ paddingTop: navigationBarHeight + 'px' }">
          <view class="flex-h flex-c-b ml-32">
            <view class="left-view  flex-h flex-c-e" @click="handleCityClick">
              <text class="city-name fs-32">
                {{ city.name || "定位中" }}
              </text>
              <image class="city-icon ml-8" mode="scaleToFill"
                src="https://ggllstatic.hpgjzlinfo.com/static/home/up.png" />
            </view>
            <view class="search-bar flex-h flex-c-b flex-1 p-0-32 bg-white">
              <text class="search-bar__text fs-32 flex-1 c-lightgrey"
                @click="handleVoiceSearchClick">
                搜索商品
              </text>
              <template>
                <view class="search-bar__line" />
                <image class="search-bar__voice ml-16" mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/icon-home-voice.png"
                  @click="handleVoiceSearchClick" />
              </template>
            </view>
          </view>
        </view>
        <view class="_right">
          <view class="_block" @click="goPath(0)">
            <image class="city-icon ml-8" mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/images/store/card.png" />
            <view class="n">钱包</view>
          </view>
          <view class="_block" @click="goPath(1)">
            <image class="city-icon ml-8" mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/images/store/mess.png" />
            <view class="n">消息</view>
          </view>
        </view>
      </view>

      <view class="part">
        <view class="item" v-for="(v,i) in parts" :key="i" @click="typeList(v)">
          <image class="img" mode="scaleToFill" :src="v.modulePic" />
          <view class="name">{{v.moduleName}}</view>
        </view>
      </view>
      <!--轮播-->
      <view class="scroll">
        <swiper class="banner-swiper-life" :indicator-dots="true" :autoplay="true" :interval="4000"
          :duration="500" indicator-active-color="red" indicator-color="rgba(0,0,0, .2)">
          <swiper-item class="item" @click="goClick(item)" v-for="(item, index) in lifeList"
            :key="index">
            <image mode="scaleToFill" class="icon" :src="item.iconUrl" />
          </swiper-item>
        </swiper>
      </view>
      <!-- 超值购 -->
      <view class="buy">
        <view class="line" @click="superType(0)">
          <view class="_l">超值购<view class="prd">商品·服务</view>
          </view>
          <view class="_m">更多</view>
        </view>
        <view class="area">
          <view v-for="(v,i) in buyList" :key="i" class="_items" @click="superType(i+1)">
            <image mode="scaleToFill" class="icon" :src="v" />
          </view>
        </view>
      </view>
      <!-- 精选品牌 TODO 数据分类-->
      <view class="pp">
        <view class="_t">精选品牌</view>
        <view class="life">
          <swiper class="banner-swiper-life" :indicator-dots="true" :autoplay="false"
            :interval="4000" :duration="500" indicator-active-color="red"
            indicator-color="rgba(0,0,0, .2)">
            <swiper-item class="item" v-for="(item, index) in brandList" :key="index">
              <view class="_block">
                <view class="top_item" v-for="(v,i) in item" :key="i" @click="handlerClick(v)">
                  <image mode="scaleToFill" class="icon" :src="v.brandLogo" />
                  <text class="des">{{v.name}}</text>
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
      <view class="local" v-if="localList.length>0">
        <view class="_line" @click="localPath">
          <view class="_t">本地惠</view>
          <view class="_m">更多</view>
        </view>
        <view class="_c">
          <view v-for="(v,i) in localList" :key="i" class="_item" @click="localPath">
            <image mode="scaleToFill" class="icon" :src="v.mainImgUrl" />
            <view class="des">￥{{v.salePrice?v.salePrice:''}}<view class="yg">预估价</view>
            </view>
          </view>
        </view>
      </view>
      <view class="buy" v-if="aroundList.length >= 5">
        <view class="line" @click="storePage">
          <view class="_l">周边门店</view>
          <view class="_m">更多</view>
        </view>
        <view class="around">
          <view v-for="(v,i) in aroundList" :key="i" class="_items">
            <image mode="scaleToFill" class="icon" :src="v.storesPic" />
            <view class="name">{{v.storesName}}</view>
          </view>
        </view>
      </view>
      <!-- 商品推荐 TODO 下拉刷新-->
      <view class="recommed">
        <view class="_block" v-for="(v,i) in prodList" :key="i" @click="goItemClick(v)">
          <image mode="scaleToFill" class="icon" :src="v.mainImgUrl" />
          <view class="name">{{v.name}}</view>
          <!-- <view class="jf">积分抵扣￥<view class="prices">{{v.salePrice}}</view>
          </view> -->
          <view class="_p">￥{{v.salePrice}}</view>
        </view>
      </view>
    </view>

  </view>

</template>
<script>
import api from '@/apis/index.js'

export default ({
  data() {
    return {
      parts: [
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '家具用品' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '家具用品' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '家具用品' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '家具用品' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '家具用品' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '家具用品' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '家具用品' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '家具用品' }
      ],
      lifeList: [{ iconUrl: '' }],
      buyList: ['https://ggllstatic.hpgjzlinfo.com/static/home/chao_zhi1.png', 'https://ggllstatic.hpgjzlinfo.com/static/home/chao_zhi2.png', 'https://ggllstatic.hpgjzlinfo.com/static/home/chao_zhi3.png'],
      brandList: [
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '苹果' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '华为' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '索尼' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '苹果2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '华为2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '索尼2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '苹果2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '华为2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '索尼2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '苹果2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '华为2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '索尼2' }
      ],
      localList: [
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', price: '123.2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', price: '123.2' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', price: '123.2' }
      ],
      aroundList: [
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '叮当家政' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '环保' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '测试' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '测试' },
        { icon: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/49/AC/wKgupGHehVmAHLU4AANnPfVjZ2o826.png', name: '测试' }
      ],
      city: null,
      storeList: [],
      pageSize: 20,
      pageNum: 1,
      prodList: []
    }
  },
  created() {
    this.getLocation()
    this.getbrandList('4')// 品牌
    this.getbrandList('5')// 轮播
    this.getbrandList('8')// 分类
    this.getStoreList()
    this.getProdList()
  },
  mounted() {
    this.city = uni.getStorageSync('city')
  },
  methods: {
    goItemClick(v) {
      uni.navigateTo({
        url: `/sub-pages/index/item/main?id=${v.id}&sceneType=适老用品`
      })
    },
    goClick(item) {
      if (!item.targetUrl) return
      wx.navigateTo({
        url: item.targetUrl
      })
    },
    async getProdList() {
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        isCreditPoints: 0 // 适老推荐
      }
      const res = await Axios.post('/product/getProductSearchList', params)
      if (res.code == '200') {
        const data = res.data || {}
        const esProducts = data.esProducts || []
        if (esProducts.length > 0) {
          this.pageNum = this.pageNum + 1
          this.prodList = this.prodList.concat(esProducts)
        }
      }
    },
    // 本地惠列表
    async getLocalProdList() {
      const city = uni.getStorageSync('city')
      const params = {
        pageSize: 3,
        pageNum: 1
      }
      let add_param = {}
      // 后端要求，区没有传市  this.areaCode  110114
      if (!this.areaCode) {
        add_param = { cityCode: city.code }
      } else {
        add_param = { areaCode: this.areaCode }
      }
      Object.assign(params, add_param)
      const res = await Axios.post('/product/getProductSearchList', params)
      if (res.code == '200') {
        const data = res.data || {}
        const esProducts = data.esProducts || []
        this.localList = esProducts
      }
    },
    localPath() {
      wx.navigateTo({
        url: '/sub-pages/index/local-benefit/index'
      })
    },
    handlerClick(item) {
      wx.navigateTo({
        url: '/sub-pages/index/item-list/main?key=' + item.name
      })
    },
    superType(index) {
      wx.navigateTo({
        url: '/sub-pages/index/super-purchase/index?tabClickIndex=' + index
      })
    },
    typeList(item) {
      if (!item.moduleTargetUrl) return
      wx.navigateTo({
        url: item.moduleTargetUrl
      })
    },
    // 精选品牌4 轮播图5 分类-金刚区8
    async getbrandList(productType) {
      const params = { productType: productType }
      const list = await Axios.post('/product/getProductListByType', params)
      if (list.code == '200') {
        const data = list.data || []
        if (productType == '4') {
          this.brandList = this.splitArrayByNum(data, 9)
        }
        if (productType == '5') {
          this.lifeList = data
        }
        if (productType == '8') {
          this.parts = data
        }
      } else {
        uni.showToast(list.msg)
      }
    },
    // 数据分割
    splitArrayByNum(list = [], num = 3) {
      if (list.length == 0) return
      let line = list.length / num
      const yushu = list.length % num
      if (yushu !== 0) {
        line = line + 1
      }
      const newArray = []
      for (var i = 0; i <= line; i++) {
        const block = list.slice(i * num, num * (i + 1))
        if (block.length > 0) {
          newArray.push(block)
        }
      }
      return newArray
    },
    // 周边门店
    async getStoreList() {
      const location = uni.getStorageSync('location')
      const city = uni.getStorageSync('city')
      const params = {
        pageNum: 1,
        pageSize: 20,
        queryObject: {
          storesAddress: city.name,
          cusLt: location.longitude,
          cusLat: location.latitude
        }
      }
      const result = await Axios.post('/srm/stores/listByPageNo', params)
      if (result.code = '200') {
        const data = result.data
        this.aroundList = data.list || []
      }
    },
    storePage() {
      uni.navigateTo({
        url: '/sub-pages/index/shop/main?scene=' + 1
      })
    },
    handleVoiceSearchClick() {
      uni.navigateTo({
        url: '/sub-pages/index/search/main'
      })
    },
    // TODO  下拉刷新添加  分享添加
    goPath(flag) {
      const urls = [`/pages/pay/my-bank-card?back=${'/sub-pages/index/index/main'}`, '/pages/user-center/message-center']
      wx.navigateTo({ url: urls[flag] })
    },
    /**
     * 获取当前定位
     */
    getLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          uni.setStorageSync('location', res)
          // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
          api.regeoMap(
            {
              location: res.longitude + ',' + res.latitude
            },
            {
              success: (res) => {
                this.areaCode = res.regeocode.addressComponent.adcode
                this.getLocalProdList()// 本地惠
                let city = {}
                // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
                if (res.regeocode.addressComponent.city.length === 0) {
                  city = {
                    code:
                      res.regeocode.addressComponent.adcode.substr(0, 2) +
                      '0100',
                    name: res.regeocode.addressComponent.province,
                    realCode:
                      res.regeocode.addressComponent.adcode.substr(0, 2) +
                      '0000'
                  }
                } else {
                  city = {
                    code:
                      res.regeocode.addressComponent.adcode.substr(0, 4) + '00',
                    name: res.regeocode.addressComponent.city
                  }
                }
                // this.handleSelectCity(city)
              }
            }
          )
        },
        fail: () => {
          // 定位失败默认北京市
          const city = { code: 110100, name: '北京市' }
          this.handleSelectCity(city)
        }
      })
    },
    handleSelectCity(city) {
      this.city = city
      uni.setStorageSync('city', city)
      console.log('===222执行刺死')
    },
    handleCityClick() {
      uni.navigateTo({
        url: '/pages/common/city-picker'
      })
    }
  }
})
</script>
<style lang="scss" scoped>
.pro_bg {
  background: #f2f2f2;
  ._head {
    height: 402rpx;
    background: linear-gradient(180deg, #fff1d3 0%, #fef1d6 61%, #f2f2f2 100%);
  }
  .old_pro {
    .bar {
      display: flex;
      .new-header {
        background: #ffffff;
        box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.08);
        border-radius: 54rpx;
        height: 88rpx;
        line-height: 88rpx;
        margin-bottom: 32rpx;
        width: 67%;
        margin-left: 26rpx;
        .left-view,
        .right-view {
          flex-shrink: 0;
          max-width: 180rpx;
        }
        .city-name {
          @include text-line(1);
        }
        .city-icon {
          @include size(16, 10);
          margin-right: 20rpx;
          margin-left: 20rpx;
        }
        .search-bar {
          height: 80rpx;
          border-radius: 0 40rpx 40rpx 0;
          box-sizing: border-box;
          border-left: 2rpx solid #f5f5f5;
          &__icon {
            @include square(32);
            border-radius: 16rpx;
          }
          &__line {
            @include size(2, 24);
            background: #c9c9c9;
          }
          &__voice {
            @include square(48);
          }
        }
      }
      ._right {
        line-height: 30rpx;
        margin-left: 40rpx;
        display: flex;
        height: 87rpx;
        padding-top: 5rpx;
        ._block {
          margin-right: 32rpx;
          .city-icon {
            @include size(48, 44);
          }
          .n {
            font-size: 28rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
      }
    }
    margin-top: -347rpx;

    .part {
      height: 405rpx;
      overflow: auto;
      margin-top: 32rpx;
      width: 93%;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0rpx 4rpx 18rpx 0rpx rgba(0, 0, 0, 0.08);
      border-radius: 24rpx;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 24rpx 20rpx 0rpx 20rpx;
      .item {
        width: 25%;
        text-align: center;
        margin-bottom: 46rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        .img {
          width: 78rpx;
          height: 78rpx;
          margin-bottom: 16rpx;
        }
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
      }
    }
    .scroll {
      width: 93%;
      margin: 32rpx auto;
      height: 196rpx;
      .banner-swiper-life {
        height: 100% !important;
      }
      .icon {
        height: 196rpx;
        width: 100%;
      }
    }
    .buy {
      background: #ffffff;
      border-radius: 24rpx;
      padding: 24rpx 16rpx 24rpx 16rpx;
      width: 93%;
      margin: 0 auto;
      .line {
        display: flex;
        justify-content: space-between;
        ._l {
          display: flex;
          font-size: 40rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          .prd {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            margin-top: 7rpx;
            margin-left: 12rpx;
          }
        }
        ._m {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
      .area {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 18rpx;
        ._items {
          width: 32%;
          height: 236rpx;
          .icon {
            width: 100%;
            height: 100%;
            box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.08);
          }
        }
      }
      .around {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 24rpx;
        overflow-x: auto;
        width: 89vw;
        ._items {
          width: 192rpx;
          height: 244rpx;
          background: #f9f7f8;
          border-radius: 16rpx;
          text-align: center;
          margin-right: 16rpx;
          .icon {
            width: 192rpx;
            height: 142rpx;
          }
          .name {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            margin-top: 20rpx;
            margin-bottom: 26rpx;
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
    }
    .pp {
      background: #ffffff;
      border-radius: 24rpx;
      width: 93%;
      margin: 32rpx auto;
      height: 612rpx;
      overflow: auto;
      ._t {
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        padding: 24rpx 0 28rpx 28rpx;
      }
      .life {
        .banner-swiper-life {
          height: 497rpx;
        }
        ._block {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          width: 100%;
          .top_item {
            text-align: center;
            width: 33%;
            margin-bottom: 16rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            .icon {
              width: 180rpx;
              height: 80rpx;
              margin: 0 auto;
            }
            .des {
              font-size: 32rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
            }
          }
        }
      }
    }
    .local {
      width: 93%;
      margin: 32rpx auto;
      background-image: url('https://ggllstatic.hpgjzlinfo.com/static/home/bendi_hui.png');
      background-size: 100% 100%;
      ._line {
        display: flex;
        justify-content: space-between;
        padding: 24rpx 28rpx 10rpx 24rpx;
        ._t {
          font-size: 40rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
        }
        ._m {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
      ._c {
        display: flex;
        justify-content: space-evenly;
        padding-bottom: 16rpx;
        ._item {
          width: 30%;
          .icon {
            width: 162rpx;
            height: 162rpx;
            margin: 0 auto;
          }
          .des {
            font-size: 32rpx;
            font-family: SourceHanSansCN-Medium, SourceHanSansCN;
            font-weight: 500;
            color: #fd2b00;
            display: flex;
            height: 42rpx;
            line-height: 42rpx;
            width: 170rpx;
            margin: 0 auto;
            margin-top: 14rpx;
            .yg {
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fd2b00;
              margin-left: 6rpx;
            }
          }
        }
      }
    }
    .recommed {
      display: flex;
      justify-content: space-between;
      width: 91%;
      margin: 0rpx auto 32rpx auto;
      flex-wrap: wrap;
      padding-bottom: 300rpx;
      ._block {
        background: #ffffff;
        border-radius: 16px;
        width: 332rpx;
        margin-top: 32rpx;
        .icon {
          width: 332rpx;
          height: 342rpx;
        }
        .name {
          height: 97rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          margin-top: 18rpx;
          margin-left: 18rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .jf {
          display: flex;
          margin-left: 18rpx;
          width: 250rpx;
          height: 48rpx;
          border-radius: 4rpx;
          border: 2rpx solid #ff2600;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ff2600;
          margin-top: 50rpx;
          line-height: 48rpx;
          padding-left: 10rpx;
          .prices {
            width: 80rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }
        ._p {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff5500;
          margin: 8rpx 0;
          margin-left: 18rpx;
        }
      }
    }
  }
}
</style>
