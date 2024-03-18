<template>
  <scroll-view scroll-x="true">
    <ul class="topic-item-list-h">
      <li class="item" @click="goItem(item)" v-for="(item,index) in list" :key="index">
        <img class="item-logo" mode="aspectFit" :lazy-load="true" :src="item.proPictDir">
        <div class="item-name">{{item.name}}</div>
        <div class="item-price">
          &yen;{{item.costPriceStr}}
        </div>
      </li>
    </ul>
  </scroll-view>
</template>

<script>
  export default {
    props: ['mode', 'instance_id', 'common', 'content'],
    data() {
      return {
        list: [],
      }
    },
    methods: {
      goItem(item) {
        XIU.goItem(item.id)
      },
      async loadData() {
        if (this.all_loaded) return;
        const params = {
          pageNum: 1,
          pageSize: 20,
        }
        switch (this.content.link.meta.itemType) {
          case 0:
            params.salesPlanId = this.content.link.id;
            break;
          case 1:
            params.brandIds = this.content.link.meta.objIds.join(',');
            break;
          case 2:
            params.dispId = this.content.link.meta.objIds.join(',');
            break;
        }
        this.loading = true;
        const result = await Axios.get(ENV.SEARCH, {
          params: params,
        })
        this.loading = false;
        if (result.esProducts) {
          const list = [];
          result.esProducts.forEach(data => {
            const tempData = _.pick(data, ['id', 'skuList', 'mainImgUrl', 'brandName', 'name', 'price', 'stockBlance', 'saleState']);
            let availableStock = 0, minMarkOffPrice = 0, maxMarkOffPrice = 0, minCostPrice = 0, maxCostPrice = 0;
            tempData.skuList && tempData.skuList.forEach(sku => {
              availableStock += sku.availableStock;
              if (minMarkOffPrice === 0 || minMarkOffPrice > sku.markOffPrice) {
                minMarkOffPrice = sku.markOffPrice
              }
              if (maxMarkOffPrice === 0 || maxMarkOffPrice < sku.markOffPrice) {
                maxMarkOffPrice = sku.markOffPrice
              }
              if (minCostPrice === 0 || minCostPrice >sku.sellingPrice) {
                minCostPrice =sku.sellingPrice
              }
              if (maxCostPrice === 0 || maxCostPrice <sku.sellingPrice) {
                maxCostPrice =sku.sellingPrice
              }
            })
            if(minMarkOffPrice !== maxMarkOffPrice){
              tempData.markOffPriceStr = `${minMarkOffPrice}-${maxMarkOffPrice}`
            }else{
              tempData.markOffPriceStr = minMarkOffPrice;
            }
            if(minCostPrice !== maxCostPrice){
              tempData.costPriceStr = `${minCostPrice}-${maxCostPrice}`
            }else{
              tempData.costPriceStr = minCostPrice;
            }
            tempData.availableStock = availableStock;
            tempData.proPictDir = XIU.getImgFormat(tempData.mainImgUrl, '/resize,w_750')
            list.push(tempData)
          })
          this.list = list;
        }
      }
    },
    async mounted() {
      if (this.content.link && this.content.link.id) {
        this.loadData();
      }
    }
  }
</script>

<style lang="scss">
  @import "@/styles/base";

  .topic-item-list-h {
    display: flex;
    align-items: center;
    padding-top: rpx(30);
    padding-bottom: rpx(30);
    .item {
      position: relative;
      padding-bottom: rpx(25);
      width: rpx(210);
      margin-right: rpx(20);
      box-shadow: rpx(1) rpx(2.598) rpx(7) 0 rgba(0, 0, 0, .1);
      .more {
        position: absolute;
        top: 0;
        right: 0;
        width: rpx(210);
        height: rpx(185);
        line-height: rpx(185);
        font-size: rpx(24);
        color: $extra-gray;
        text-align: center;
        background-color: rgba( 255, 255, 255,.502);
      }
      .item-logo {
        width: rpx(210);
        height: rpx(185);
      }
      .item-name {
        padding-left: rpx(30);
        padding-right: rpx(30);
        padding-top: rpx(10);
        font-size: rpx(26);
        color: #484848;
        @include ellipsis();
      }
      .item-price {
        padding-top: rpx(15);
        font-size: rpx(28);
        text-align: center;
      }
    }
  }
</style>
