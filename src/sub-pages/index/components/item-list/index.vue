<template>
  <div>
    <ul class="topic-item-list">
      <li class="item" @click="goItem(item)" v-for="(item,index) in list" :key="index">
        <img class="item-logo" lazy-load mode="aspectFit" :src="item.proPictDir">
        <div class="brand-name">{{ item.brandName }}</div>
        <div class="item-name">{{ item.name }}</div>
        <div class="item-price">
          &yen;{{ item.costPriceStr }}
        </div>
        <div class="sale-out-wrap" v-if="item.saleState !== 5 || item.availableStock === 0">
          <img class="sale-out" src="https://ggllstatic.hpgjzlinfo.com/static/images/sale-out.png">
        </div>
      </li>
    </ul>
    <div class="load-tips" v-show="loading">加载中<span class="dots">...<i class="mask"></i></span>
    </div>
    <div id="loadMore" class="load-more"></div>
  </div>
</template>

<script>
export default {
  props: ['mode', 'instance_id', 'common', 'content'],
  data() {
    return {
      timer: null,
      pagination: {
        current: 1,
        size: 10
      },
      loading: true,
      all_loaded: false,
      list: []
    }
  },
  computed: {
    image() {
      return XIU.getImgFormat(this.content.image)
    },
    style() {
      return {
        color: this.content.color,
        backgroundColor: this.content.bg_color
      }
    }
  },
  components: {},
  methods: {
    goItem(item) {
      XIU.bridge.goItem(item.id)
    },
    async loadData() {
      if (this.all_loaded) return
      const params = {
        pageNum: this.pagination.current++,
        pageSize: this.pagination.size
      }
      switch (this.content.link.meta.itemType) {
        case 0:
          params.salesPlanId = this.content.link.id
          break
        case 1:
          params.brandIds = this.content.link.meta.objIds.join(',')
          break
        case 2:
          params.dispId = this.content.link.meta.objIds.join(',')
          break
      }
      this.loading = true
      const result = await Axios.get(ENV.SEARCH, {
        params: params
      })
      this.loading = false
      if (result.esProducts) {
        const list = []
        result.esProducts.forEach(data => {
          const tempData = _.pick(data, ['id', 'skuList', 'mainImgUrl', 'brandName', 'name', 'price', 'stockBlance', 'saleState'])
          let availableStock = 0; let minMarkOffPrice = 0; let maxMarkOffPrice = 0; let minCostPrice = 0; let maxCostPrice = 0
          tempData.skuList && tempData.skuList.forEach(sku => {
            availableStock += sku.availableStock
            if (minMarkOffPrice === 0 || minMarkOffPrice > sku.markOffPrice) {
              minMarkOffPrice = sku.markOffPrice
            }
            if (maxMarkOffPrice === 0 || maxMarkOffPrice < sku.markOffPrice) {
              maxMarkOffPrice = sku.markOffPrice
            }
            if (minCostPrice === 0 || minCostPrice > sku.sellingPrice) {
              minCostPrice = sku.sellingPrice
            }
            if (maxCostPrice === 0 || maxCostPrice < sku.sellingPrice) {
              maxCostPrice = sku.sellingPrice
            }
          })
          if (minMarkOffPrice !== maxMarkOffPrice) {
            tempData.markOffPriceStr = `${minMarkOffPrice}-${maxMarkOffPrice}`
          } else {
            tempData.markOffPriceStr = minMarkOffPrice
          }
          if (minCostPrice !== maxCostPrice) {
            tempData.costPriceStr = `${minCostPrice}-${maxCostPrice}`
          } else {
            tempData.costPriceStr = minCostPrice
          }
          tempData.availableStock = availableStock
          tempData.proPictDir = XIU.getImgFormat(tempData.mainImgUrl, '/resize,w_750')
          list.push(tempData)
        })
        this.list = this.list.concat(list)
        this.all_loaded = this.pagination.current > result.totalPage
      }
    }
  },
  async mounted() {
    uni.$on('pageScroll', async () => {
      if (this.all_loaded || this.loading) {
        return false
      }
      const viewport = await new Promise(resolve => {
        wx.createSelectorQuery().select('#loadMore').boundingClientRect().exec(res => {
          resolve(res[0])
        })
      })
      if (viewport.top < App.systemInfo.windowHeight + 100) {
        this.loadData()
      }
    })
    if (this.content.link && this.content.link.id) {
      this.loadData()
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/base';

.topic-item-list {
  @include item-list();
}

.load-tips {
  $bgc: #eee;
  $h: 70rpx;
  height: rpx($h);
  line-height: rpx($h);
  text-align: center;
  background: $bgc;
  color: #555;
  font-size: 15px;

  .dots {
    font-family: sans-serif;
    position: relative;
    height: $h;

    .mask {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 20;
      background-color: $bgc;
      width: 100%;
      height: 100%;
      animation: dotsAni 1.5s ease-out infinite forwards;
    }
  }
}

@keyframes dotsAni {
  0% {
    width: 100%;
  }
  70% {
    width: 0;
  }
  100% {
    width: 0;
  }
}
</style>
