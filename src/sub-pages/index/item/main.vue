<template>
  <view class="page-item" :class="{ isIphoneHair }" v-if="!loading" :disableScroll="true">
    <view class="fixHead" :class="fixTop ? '' : 'noshow'">
      <view class="shop" @click="point(1)" :class="actived == 1 ? 'aclass' : ''">商品</view>
      <view class="detail" @click="point(2)" :class="actived == 2 ? 'aclass' : ''">详情</view>
    </view>
    <view class="empty-wrap" v-if="product && product.saleState !== 5">
      <img class="tip" src="http://192.168.1.187:10088/static/images/item-detail/tip.png" />
      <view class="title">很抱歉，您查看的商品已无效！</view>
      <view class="desc">您可以选择浏览其他商品</view>
      <button type="button" class="btn-view" @click="toHome">看看其他商品</button>
    </view>

    <template v-else>
      <swiper
        class="banner-list"
        :circular="true"
        :autoplay="true"
        :duration="1000"
        @change="handleBannerChange"
      >
        <swiper-item v-for="(productImg, index) in productImgList" :key="index">
          <view
            class="banner"
            :style="{ backgroundImage: 'url(' + productImg + ')' }"
            @click="previewImg(index)"
          ></view>
        </swiper-item>
      </swiper>
      <view class="pointer">{{ currentIndex }}/{{ productImgList.length }}</view>
      <view class="area">
        <view class="product-info" :class="product.creditPoints ? 'margTop1' : ''">
          <view class="product-price">
            <view class="sell-price">
              <span class="span">
                ¥{{ member ? selectSize.memberPrice : selectSize.finalPrice }}
              </span>
            </view>

            <!-- 积分商城-到手价 -->
            <view v-if="sceneType === '积分兑换'" class="sell-price-label">兑换到手价</view>

            <!-- 商城项目-非会员到手价 -->
            <template v-if="sceneType === '商品购买'">
              <!-- 会员到手价 -->
              <template v-if="member">
                <view class="member-price-label">会员到手价</view>
              </template>
              <!-- 非会员到手价 -->
              <template v-else>
                <view class="sell-price-label">到手价</view>

                <image
                  class="member-price-icon"
                  src="http://192.168.1.187:10088/static/songhui/sub-item/member-price.png"
                  mode="scaleToFill"
                />
              </template>
            </template>

            <!-- <view class="market-price" v-if="selectSize.markOffPrice">
              ¥{{ selectSize.markOffPrice }}
            </view> -->
          </view>

          <!-- 商城项目-会员到手价 -->
          <view v-if="sceneType === '商品购买' && member" class="no-member-price">
            ¥{{ selectSize.finalPrice }} 非会员到手价
          </view>

          <view
            v-if="couponList && couponList.length"
            @click="showModal('couponList')"
            class="line_j"
          >
            <view class="f_w">
              <view class="pres">
                <view v-if="couponList[0].checkThreshold == 0">
                  {{ `无门槛${couponList[0].denominationStr}元` }}
                </view>
                <view v-else>
                  <span v-if="couponList[0].type == 0">
                    {{ `满${couponList[0].thresholdValue}减` + couponList[0].denominationStr }}元
                  </span>
                  <span v-else-if="couponList[0].type == 1">
                    {{ `满${couponList[0].thresholdValue}打` + couponList[0].denominationStr }}折
                  </span>
                </view>
              </view>
              <view class="pres _right" v-if="couponList && couponList.length >= 2">
                <view v-if="couponList[1].checkThreshold == 0">
                  {{ `无门槛${couponList[1].denominationStr}元` }}
                </view>
                <view v-else>
                  <span v-if="couponList[1].type == 0">
                    {{ `满${couponList[1].thresholdValue}减` + couponList[1].denominationStr }}元
                  </span>
                  <span v-else-if="couponList[1].type == 1">
                    {{ `满${couponList[1].thresholdValue}打` + couponList[1].denominationStr }}折
                  </span>
                </view>
              </view>
            </view>
            <view class="btn_page">
              领券
              <view class="right_icon">
                <!-- <image class="right_icon"
                src="http://192.168.1.187:10088/static/images/common/right-gray.png?a=1"> -->
              </view>
            </view>
          </view>

          <!-- 积分兑换计算 -->
          <view v-if="sceneType === '积分兑换'" class="getPrice">
            <img class="collected" src="http://192.168.1.187:10088/static/home/getP.png" />
            <view class="flex_line">
              <view class="item">
                <view class="g">到手价</view>
                <view class="g_n">
                  ￥{{ member ? selectSize.memberPrice : selectSize.finalPrice }}
                </view>
              </view>
              <view class="item_d">
                <view class="d">=</view>
              </view>
              <view class="item_p">
                <view class="g">原价</view>
                <view class="g_n">￥{{ selectSize.sellingPrice }}</view>
              </view>
              <view class="item_d">
                <view class="d">-</view>
              </view>
              <view class="item_p">
                <view class="g">积分抵扣</view>
                <view class="g_n">
                  ￥{{ member ? product.pointDiscountPoint : product.registerPoint }}
                </view>
              </view>
              <view v-if="product.couponAmount" class="item_d">
                <view class="d">-</view>
              </view>
              <view v-if="product.couponAmount" class="item_p">
                <view class="g">优惠券</view>
                <view class="g_n">￥{{ product.couponAmount ? product.discountAmount : 0 }}</view>
              </view>
            </view>
          </view>
          <!-- 商品购买计算 -->
          <view v-if="sceneType === '商品购买'" class="getPrice">
            <img class="collected" src="http://192.168.1.187:10088/static/home/getP.png" />
            <view class="flex_line">
              <view class="item">
                <view class="g">{{ member ? '会员到手价' : '到手价' }}</view>
                <view class="g_n">
                  ￥{{ member ? selectSize.memberPrice : selectSize.finalPrice }}
                </view>
              </view>
              <view class="item_d">
                <view class="d">=</view>
              </view>
              <view class="item_p">
                <view class="g">原价</view>
                <view class="g_n">￥{{ selectSize.sellingPrice }}</view>
              </view>

              <view v-if="member" class="item_d">
                <view class="d">-</view>
              </view>
              <view v-if="member" class="item_p">
                <view class="g">会员优惠</view>
                <view class="g_n">￥{{ product.discountAmount ? product.discountAmount : 0 }}</view>
              </view>

              <view v-if="product.couponAmount" class="item_d">
                <view class="d">-</view>
              </view>
              <view v-if="product.couponAmount" class="item_p">
                <view class="g">优惠券</view>
                <view class="g_n">￥{{ product.couponAmount ? product.discountAmount : 0 }}</view>
              </view>
            </view>
          </view>
          <view class="product-desc">
            {{ product.name ? product.name : '' }}
          </view>
          <view class="wuliu-info">
            <text class="m-r-24">发货地</text>
            <text class="m-r-24">
              {{ supplierDTO.actualCityName }}
              <!-- {{ product.deliveryRegion }} 预计
              <template v-if="product.deliveryMinDays < product.deliveryMaxDays">
                {{ product.deliveryMinDays }}-{{ product.deliveryMaxDays }}
              </template>
              <template v-else>{{ product.deliveryMinDays }}</template>
              个工作日送达 -->
            </text>
            <text class="m-r-24">|</text>
            <text class="m-r-24">运费</text>
            <!-- 全免包邮 -->
            <text v-if="freight.isPostage === 1 && freight.postage === 0" class="font_value">
              商家包邮
            </text>
            <!-- 满X元包邮 -->
            <text
              v-if="
                freight.isPostage === 1 && freight.postage > 0 && freight.templates[0].firstPrice
              "
              class="font_value freight"
            >
              店铺单笔订单不满{{ freight.postage }}元，收运费{{
                freight.templates[0].firstPrice
              }}元（请以提交订单时为准）
            </text>
            <!-- 不包邮 -->
            <text v-if="freight.isPostage === 0" class="font_value">
              {{ freight.templates[0].firstPrice }}元
            </text>
            <!-- 未设置运费模版 -->
            <text v-if="!freight" class="font_value">商家承担</text>
          </view>
          <view class="wuliu-info flex">
            <text class="m-r-24">参数</text>
            <text class="text-over">{{ attributeList[0].name + attributeList[0].value }}</text>
            <image
              class="icon-right"
              @click="toAttribute"
              src="http://192.168.1.187:10088/static/images/common/right-gray.png?a=1"
            />
          </view>
        </view>
      </view>
      <view class="line"></view>

      <!-- <view class="sku-list-wrap" v-if="colorList.length">
        <view class="title">{{ product.firstClassName }}</view>
        <view class="label-list">
          <view class="label"
            :class="selectColor.firstClassAttrId == color.firstClassAttrId ? 'active' : ''"
            v-for="(color, index) in colorList" :key="index"
            @click="changeSku('selectColor', color)">
            {{ color.firstClassAttrName }}
          </view>
        </view>
        <view class="title">{{ product.subClassName }}</view>
        <view class="label-list">
          <block v-for="(size, index) in sizeList" :key="index">
            <view v-if="size.availableStock == 0" class="condition disabled label">
              {{ size.subClassAttrName }}
            </view>
            <view v-else class="label"
              :class="selectSize.subClassAttrId == size.subClassAttrId ? 'active' : ''"
              @click="changeSku('selectSize', size)">
              {{ size.subClassAttrName }}
            </view>
          </block>
        </view>
      </view> -->
      <!-- <view class="line"></view> -->

      <view class="storeList" v-if="storeList.length > 0">
        <view class="_t">适用门店</view>
        <view class="_center">
          <img mode="scaleToFill" class="_img" :src="storeList[0].storesPic" />
          <view class="right">
            <view class="_n">
              <view class="n">{{ storeList[0].storesName }}</view>
              <view class="k" v-if="storeList[0].distance">距您{{ storeList[0].distance }}km</view>
            </view>
            <view class="_a">{{ storeList[0].storesAddress }}</view>
          </view>
        </view>
        <button class="btn" v-if="storeList.length > 1" @click="watchMore">查看更多</button>
      </view>
      <view class="line"></view>
      <view class="in-store">
        <view class="left">
          <img mode="scaleToFill" class="_img" :src="product.supplierDTO.supplierStorePicUrl" />
          <view class="_right">
            <view class="name">{{ product.supplierDTO.supplierStoreName }}</view>
            <view class="num">商品共{{ product.productNum }}件</view>
          </view>
        </view>
        <view class="right">
          <button class="btn-into" @click="goStoreDetail">进店逛逛</button>
        </view>
      </view>

      <view class="product-detail">
        <view class="left-line"></view>
        <view class="title">商品详情</view>
        <view class="right-line"></view>
      </view>
      <view class="detail-img-list">
        <rich-text
          class="rich-text"
          v-if="detailContents.length > 0"
          :nodes="detailContents"
        ></rich-text>
        <img
          mode="widthFix"
          :src="img"
          class="img"
          v-for="(img, index) in detailImageList"
          :key="index"
        />
      </view>

      <view class="footer">
        <view class="btn-service" @click="goStoreDetail">
          <img class="icon-img" src="http://192.168.1.187:10088/static/images/footer/home.png" />
          首页
        </view>
        <view class="btn-service" @click="toCart">
          <img
            class="icon-img"
            src="http://192.168.1.187:10088/static/images/item-detail/cart_new.png"
          />
          购物车
          <text class="count" v-if="cartCount > 0">{{ cartCount }}</text>
        </view>
        <view class="btn-add-cart" @click="addCart">加入购物车</view>
        <view class="btn-buy" @click="checkout">
          {{ sceneType === '积分兑换' ? '立即兑换' : '立即购买' }}
        </view>
      </view>
    </template>
    <select-sku
      ref="selectSku"
      :member="member"
      :selectSize="selectSize"
      :product="product"
      :selectColor="selectColor"
      :productImgList="productImgList"
      :colorList="colorList"
      :sizeList="sizeList"
    />
    <coupon-list ref="couponList" @loadCoupon="loadCoupon" :couponList="couponList" />
    <top ref="toTop" :bottom="isIphoneHair ? 264 : 200" :show-contact="showContact" />
  </view>
</template>

<script>
  import { mapState } from 'vuex';
  import Top from '@/sub-pages/index/components/top.vue';
  import SelectSku from './components/select-sku';
  import CouponList from './components/coupon-list';

  export default {
    data() {
      return {
        isIphoneHair: App.isIphoneHair,
        showContact: false,
        sceneType: '', // 场景类型：适老用品、积分兑换
        productId: '',
        freight: {}, // 运费模版
        product: null,
        supplierDTO: null, // 供应商
        productImgList: [],
        skuImg: {},
        colorList: [],
        saleTypeList: [
          { name: '预售', id: 1 },
          { name: '现货', id: 2 },
        ],
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
        actived: 1,
        currentIndex: 1,
      };
    },
    components: {
      Top,
      SelectSku,
      CouponList,
    },
    watch: {
      selectColor() {
        this.productImgList = [];
        this.sizeList = this.selectColor.skuAndPriceList;
        this.sizeList.some((size) => {
          if (size.availableStock) {
            this.selectSize = size;
            return true;
          }
        });
        // 如果首次属性子属性的库存都为0的话默认显示第一个子属性的sku
        const empt = this.sizeList.every((size) => {
          return size.availableStock == 0;
        });
        if (empt) {
          this.selectSize = this.sizeList[0];
        }
        this.$nextTick(() => {
          const list = [this.product.mainImgUrl];
          (this.selectColor.imgUrlList || []).forEach((img) => {
            list.push(img);
          });
          this.productImgList = list;
        });
      },
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
      }),
      // 是否会员
      member() {
        return this.userInfo && this.userInfo.memberStatus === '1';
      },
    },
    methods: {
      handleBannerChange(e) {
        this.currentIndex = e.detail.current + 1;
      },
      point(flag) {
        this.actived = flag;
        const flags = { 1: 0, 2: 1200 };
        uni.pageScrollTo({
          scrollTop: flags[flag],
        });
      },
      toAttribute() {
        uni.setStorageSync('attribute', this.attributeList);
        uni.navigateTo({
          url: '/sub-pages/index/item-attribute/main',
        });
      },
      toComment() {
        uni.navigateTo({
          url: '/sub-pages/index/item-reviews/main?id=' + this.productId,
        });
      },
      previewImg(index) {
        uni.previewImage({
          urls: this.productImgList,
          current: this.productImgList[index],
        });
      },
      toHome() {
        if (this.sceneType === '适老用品') {
          uni.navigateTo({
            url: '/sub-pages/index/index/main',
          });
        } else {
          uni.navigateTo({
            url: '/sub-pages/point/index/index',
          });
        }
      },
      // 门店列表
      async getStoreList() {
        const location = uni.getStorageSync('location');
        const params = {
          supplierId: this.product.supplierId,
          pageNum: 1,
          pageSize: 15,
          queryObject: {
            cusLt: location.longitude,
            cusLat: location.latitude,
          },
          ids: this.product.storeIds,
        };
        const result = await Axios.post('/srm/stores/listByPageNo', params);
        if (result.code == '200') {
          const data = result.data;
          this.storeList = data.list || [];
        } else {
          this.$uni.showToast(result.msg);
        }
      },
      async updateCart() {
        const result = await Axios.post('/cart/getNum', {
          sceneType: this.sceneType,
        });
        if (result.code == 200) {
          this.cartCount = result.data.cartNum;
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
            pId: this.productId,
          },
        });
        if (couponResult.code == 200) {
          this.couponList = couponResult.data || [];
        }
      },
      async changeAttention() {
        if (!Store.getters.isLogin) {
          uni.navigate({
            // url: '/sub-pages/index/login/main'
          });
          return false;
        }
        uni.showLoading('正在提交...');
        const result = await Axios.get(
          !this.isAttention ? 'brand/addconcern' : 'brand/delconcern',
          {
            params: {
              id: this.product.brand.id,
            },
          },
        );
        uni.hideLoading();
        if (result.code == 200) {
          this.isAttention = !this.isAttention;
          this.$uni.showToast(this.isAttention ? '收藏成功' : '取消成功');
        } else {
          this.$uni.showToast(result.msg || '操作失败');
        }
      },
      toCart() {
        if (!Store.getters.isLogin) {
          Store.dispatch('logout');
          uni.navigateTo({
            url: '/pages/user-center/login',
            // url: '/sub-pages/index/login/main''
          });
          return false;
        }
        uni.navigateTo({
          url: '/sub-pages/point/cart/main?sceneType=' + this.sceneType,
        });
        // if (this.sceneType === '积分兑换') {
        //   uni.navigateTo({
        //     url: '/sub-pages/point/cart/main?sceneType=' + this.sceneType,
        //   });
        // } else {
        //   uni.navigateTo({
        //     url: '/sub-pages/index/index/main?index=4&&sceneType' + this.sceneType,
        //   });
        // }
      },
      async changeFavor() {
        if (!Store.getters.isLogin) {
          uni.navigate({
            url: '/pages/user-center/login',
          });
          return false;
        }
        uni.showLoading('正在提交...');
        const result = await Axios.post(
          this.product.isCollected == 1 ? '/product/deleteFavorites' : '/product/addFavorites',
          {
            id: this.productId,
          },
        );
        uni.hideLoading();
        if (result.code == 200) {
          this.product.isCollected = this.product.isCollected == 1 ? 0 : 1;
          this.$uni.showToast(result.msg);
        } else {
          this.$uni.showToast(result.msg || '操作失败');
        }
      },
      showModal(name) {
        this.$refs[name].show(true, 1, this.sceneType);
      },
      changeSku(type, value) {
        this[type] = value;
      },
      goStoreDetail() {
        // 店铺详情
        uni.reLaunch({ url: '/pages/index/index' });
        // uni.navigateTo({
        //   url: '/sub-pages/index/store/main?supplierId=' + this.product.supplierId,
        // });
      },
      watchMore() {
        // 门店
        uni.navigateTo({
          url: '/sub-pages/index/shop/main?supplierId=' + this.product.supplierId,
        });
        // wx.navigateTo({url:'/pages/supermarket/other-market'})
      },
      addCart() {
        if (!Store.getters.isLogin) {
          Store.dispatch('logout');
          uni.navigateTo({
            url: '/pages/user-center/login',
            // url: '/sub-pages/index/login/main''
          });
          return false;
        }
        this.$refs.selectSku.show(true, 1, this.sceneType);
        // reportCmPV({ title: "加入购物车" });
      },
      checkout() {
        if (!Store.getters.isLogin) {
          Store.dispatch('logout');
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return false;
        }
        this.$refs.selectSku.show(true, 2, this.sceneType);
        // reportCmPV({ title: "立即购买" });
      },
      async loadData() {
        uni.showLoading();
        this.loading = true;
        const result = await Axios.post('/product/get', { id: this.productId });
        uni.hideLoading();
        this.loading = false;
        if (result.code == 200) {
          uni.setNavigationBarTitle({
            title: result.data.name,
          });
          if (result.data.productDetail) {
            const imgReg = /<img.*?(?:>|\/>)/gi; // 匹配src属性
            const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
            const detailImageList = [];
            (result.data.productDetail.match(imgReg) || []).map((imageTag) => {
              const img = imageTag.match(srcReg)[1];
              if (/^http/.test(img)) {
                // 获取图片地址
                detailImageList.push(imageTag.match(srcReg)[1]);
              }
            });
            this.detailImageList = detailImageList;
            if (this.detailImageList.length == 0) {
              this.detailContents = result.data.productDetail;
            }
          }
          result.data.firstClassName = result.data.firstClassName || '颜色';
          result.data.subClassName = result.data.subClassName || '尺码';
          this.product = result.data;
          this.isAttention = this.product.brand.isConcerned == 1;
          this.title = this.product.name;
          this.colorList = [];
          this.product.skuList &&
            this.product.skuList.forEach((skuPriceAndStock) => {
              this.colorList.push(skuPriceAndStock);
            });
          this.selectSaleType = this.saleTypeList[0];
          if (this.colorList.length) {
            this.selectColor = this.colorList[0];
            this.sizeList = this.colorList[0].skuAndPriceList;
            const list = [this.product.mainImgUrl];
            this.productImgList = list.concat(this.colorList[0].imgUrlList || []);
          }
          this.sizeList.some((size) => {
            if (size.availableStock) {
              this.selectSize = size;
              return true;
            }
          });
          // 如果首次属性子属性的库存都为0的话默认显示第一个子属性的sku
          const empt = this.sizeList.every((size) => {
            return size.availableStock == 0;
          });
          if (empt) {
            this.selectSize = this.sizeList[0];
          }
          this.attributeList = [];
          this.product.attributes &&
            this.product.attributes.forEach((attribute) => {
              this.attributeList.push({
                name: attribute.attrName,
                value: attribute.attrValContent,
              });
            });
          if (this.product.storeIds.length > 0) {
            this.getStoreList();
          }
          this.supplierDTO = result.data.supplierDTO;
          // 获取商家运费模版
          this.getTempBySupplierId(result.data.supplierId);
        } else {
          this.$uni.showToast(result.msg || '获取商品信息失败');
        }
        if (Store.getters.isLogin) {
          this.updateCart();
        }
        // TODO 等待后端处理，不需要登录就能使用  先注释
        this.loadCoupon();
      },
      // 获取商家运费模版
      async getTempBySupplierId(supplierId) {
        const result = await Axios.post('/freightTemplate/getTempBySupplierId', {
          supplierId,
        });
        if (result.code == 200) {
          this.freight = result.data;
        } else {
          this.$uni.showToast(result.msg);
        }
      },
    },
    onUnload() {
      this.$refs.selectSku.show(false);
      this.product = {};
      this.productImgList = [];
      this.detailImageList = [];
      this.colorList = [];
    },
    onShareAppMessage() {
      return {
        path: 'sub-pages/index/item/main?id=' + this.productId + '&sceneType=' + this.sceneType,
        title: this.product.name,
        imageUrl: this.product.mainImgUrl,
      };
    },
    onPageScroll(e) {
      var query = uni.createSelectorQuery();
      query.select('.sell-price').boundingClientRect();
      query.exec((res) => {
        if (res && res[0].top < 86) {
          this.fixTop = true;
        } else {
          this.fixTop = false;
        }
      });
      this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight);
    },
    async onShow() {
      console.info('query:', this);
      this.productId = this.$scope.options.id;
      this.sceneType = this.$scope.options.sceneType;
      this.loadData();
    },
  };
</script>

<style lang="scss">
  @import '~@/styles/base';
  .line {
    height: 18rpx;
  }

  .page-item {
    overflow-y: auto;
    padding-bottom: rpx(150);
    background: #f2f2f2;
    position: relative;

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
    .pointer {
      position: absolute;
      right: 22rpx;
      top: 676rpx;
      width: 108rpx;
      height: 52rpx;
      line-height: 52rpx;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 88rpx;
      font-weight: 400;
      color: #ffffff;
      font-size: 36rpx;
      text-align: center;
      font-family: PingFangSC-Regular, PingFang SC;
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
      padding-top: 32rpx;

      .getPrice {
        height: 138rpx;
        background-size: contain;
        margin: 0 auto;
        position: relative;

        .flex_line {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          position: absolute;
          top: 0rpx;
          bottom: 0;
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
        padding-left: rpx(24);
        padding-right: rpx(24);
        padding-bottom: 24rpx;
        text-align: left;
        width: 707rpx;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 24rpx;

        .product-name {
          @include multi-ellipsis();
          padding-right: rpx(50);
          color: $color-black;
          font-size: rpx(30);
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
          padding-top: rpx(26);
          padding-bottom: rpx(25);
          color: $color-black;
          font-size: rpx(44);
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }

        .wuliu-info {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 50rpx;
          margin-bottom: 24rpx;
          &.flex {
            display: flex;
            align-items: center;
          }
          .icon-right {
            float: right;
            margin-left: rpx(10);
            width: rpx(36);
            height: rpx(36);
          }
          .m-r-24 {
            margin-right: 24rpx;
          }
          .text-over {
            display: inline-block;
            width: 500rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        .no-member-price {
          height: 48rpx;
          font-size: 32rpx;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 500;
          color: #999999;
          line-height: 48rpx;
          margin-bottom: 26rpx;
        }

        .product-price {
          position: relative;
          display: flex;
          align-items: center;
          padding: 12rpx 0;

          .sell-price {
            color: #ff5500;
            font-weight: 500;
            font-size: 56rpx;
            position: relative;
            display: flex;
            align-items: center;
            // padding-left: rpx(20);
            line-height: 70rpx;

            .unit {
              position: absolute;
              left: 0;
              bottom: rpx(10);
              margin-right: rpx(5);
              font-size: rpx(26);
            }
            .span {
              font-size: rpx(54);
              font-weight: 500;
            }
          }

          .sell-price-label {
            height: 46rpx;
            font-size: 32rpx;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            color: #ff5500;
            line-height: 46rpx;
            margin-left: 10rpx;
          }

          .member-price-label {
            width: 178rpx;
            height: 48rpx;
            background: #fdf0d7;
            border-radius: 4rpx;
            font-size: 32rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #ba7934;
            line-height: 48rpx;
            margin-left: 20rpx;
            text-align: center;
          }

          .member-price-icon {
            width: 144rpx;
            height: 48rpx;
            margin-left: 12rpx;
          }

          .market-price {
            margin-left: rpx(20);
            color: $color-grey;
            font-size: rpx(28);
            text-decoration: line-through;
            margin-top: 14rpx;
          }
        }
      }
    }

    .line_j {
      margin-bottom: 26rpx;
      line-height: 112rpx;
      display: flex;
      justify-content: space-between;

      .f_w {
        display: flex;
        justify-content: flex-start;

        ._right {
          margin-left: 20rpx;
        }
      }

      .pres {
        border-radius: 4rpx;
        background: rgba(255, 85, 0, 0.1);
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
        @include ellipsis();
        position: relative;
        padding-left: rpx(128);
        padding-right: 0;
        // height: rpx(90);
        line-height: rpx(90);
        font-size: rpx(26);
        color: $color-grey;
        .title {
          @include middle-center-y();
          left: 0;
          color: $color-black;
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
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
          color: $color-grey;
          font-size: 32rpx;

          .img {
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

    .in-store {
      display: flex;
      align-items: center;
      width: 704rpx;
      height: 182rpx;
      background: #ffffff;
      border-radius: 24rpx;
      margin: 0 auto;
      padding: 24rpx;
      box-sizing: border-box;

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

    .product-detail {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 704rpx;
      margin: 32rpx auto;
      .left-line {
        width: 251rpx;
        height: 2rpx;
        border: 2rpx solid;
        border-image: linear-gradient(245deg, rgba(151, 151, 151, 1), rgba(200, 200, 200, 0)) 2 2;
      }
      .right-line {
        width: 251rpx;
        height: 2rpx;
        border: 2rpx solid;
        border-image: linear-gradient(245deg, rgba(151, 151, 151, 1), rgba(200, 200, 200, 0)) 2 2;
        transform: rotateY(180deg);
      }
      .title {
        height: 44rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #999999;
        line-height: 44rpx;
        flex: 1;
        text-align: center;
      }
    }

    .storeList {
      padding: 24rpx 32rpx 24rpx 32rpx;
      width: 704rpx;
      background: #ffffff;
      border-radius: 24rpx;
      box-sizing: border-box;
      margin: 0 auto;

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
        @include btn();
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
          color: $color-grey;
          border: rpx(2) solid #cdcdcd;

          &.active {
            color: $color-black;
            border-color: $color-black;

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
      border-bottom: rpx(1) solid #d8d8d8;

      .btn-right {
        display: flex;
        align-items: center;
        @include middle-center-y();
        right: rpx(30);
        color: #888888;
        font-size: rpx(36);

        .img {
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
        color: $color-black;
      }
    }

    .detail-img-list {
      margin-top: rpx(20);
      background-color: #fff;

      .title {
        display: block;
        padding: rpx(32) rpx(24) rpx(48);
        font-size: rpx(40);
        color: $color-black;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }

      .img {
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
      height: 164rpx;
      display: flex;
      align-items: center;
      width: rpx(750);
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
        // width: rpx(120);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 36rpx;

        line-height: rpx(47);
        .count {
          position: absolute;
          right: rpx(10);
          top: rpx(10);
          background-color: #ec202b;
          height: rpx(40);
          width: rpx(40);
          text-align: center;
          line-height: rpx(40);
          color: #fff;
          border-radius: 50%;
          @include ellipsis();
        }

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

        .i {
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
          background-color: #ec202b;
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
        width: rpx(234);
        border-radius: 0;
      }

      .btn-add-cart {
        @include btn();
        //background-color:$color-primary;
        border-top-left-radius: 47rpx;
        border-bottom-left-radius: 47rpx;
        border: 2rpx solid #ff711a;
        color: #ff5500;
        background: #fff;
        height: 95rpx;
        line-height: 95rpx;
        font-size: 36rpx;
        margin-left: 36rpx;
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
        color: $color-lightgrey;
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
