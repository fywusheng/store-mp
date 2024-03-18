<template>
  <div class="page-path-list">
    <ul class="item-list">
      <li class="item" @click="toItem(item)" v-for="(item,index) in dataList" :key="index">
        <img class="btn-delete" @click.stop="remove(item)" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-delete.png">
        <img class="item-logo" mode="aspectFit" :lazy-load="true" :src="item.mainImgUrl">
        <div class="item-body">
          <div class="item-name">{{item.name}}</div>
          <div class="item-name">编码：{{item.code}}</div>
          <div v-if="item.saleState==5" class="item-name">状态：在售中</div>
          <div v-else class="item-name">状态：已下架</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        dataList: [],
        pageLoad: false,
      }
    },
    components: {},
    methods: {
      toItem(item){
        if(item.saleState!=5){
          wx.showToast('该商品已下架无法预览详情！');
          return;
        }
        wx.navigateTo({
          url: `/pages/item/main?id=${item.id}`
        })
      },
      async remove(item) {
        const result = await wx.showModal({
          title: '',
          content: '确定要删除该关注记录?',
          confirmColor: '#FB4769'
        })
        if (result.confirm) {
          wx.showLoading({ title: '正在提交...', mask: true });
          const delResult = await Axios.post('/product/deleteFavorites', {
              id: item.id,
          })
          wx.hideLoading()
          if (delResult.code == 200) {
            wx.showToast({
              title: delResult.msg || '删除成功',
              icon: 'none'
            });
            this.loadData();
          } else {
            wx.showToast({
              title: delResult.msg || '删除失败',
              icon: 'none'
            });
          }
        }
      },
      async loadData() {
        const result = await Axios.post('/product/listFavorites', {params: {
          data: {
            pageNo: 1,
            pageSize: 100,
          }
        }})
        if (result.code == 200) {
          this.dataList = result.data.list || [];
        } else {
          wx.showToast({
            title: result.msg || '获取数据失败',
            icon: 'none'
          });
        }
      }
    },
    async mounted() {
      wx.setNavigationBarTitle({
        title: '收藏'
      })
      if(!Store.getters.isLogin){
        await Store.dispatch('login')
      }
      wx.showLoading({ title: '正在加载...', mask: true });
      await this.loadData()
      this.pageLoad = true;
      wx.hideLoading();
    },
  }
</script>

<style lang="scss">
  @import "~@/styles/base";

  .page-path-list {
    padding-bottom: rpx(50);
    .item-list {
      .item {
        position: relative;
        display: flex;
        padding: rpx(30);
        border-bottom: rpx(1) solid $border;
        .btn-delete {
          position: absolute;
          right: rpx(50);
          top: rpx(30);
          width: rpx(27);
          height: rpx(29);
        }
        .item-logo {
          width: rpx(142);
          height: rpx(142);
        }
        .item-body {
          width: rpx(430);
          padding-left: rpx(20);
          .item-name {
            font-size: rpx(28);
            @include multi-ellipsis();
          }
          .item-price {
            margin-top: rpx(30);
            font-size: rpx(32);
            color: $main-color;
            .market-price {
              margin-left: rpx(10);
              color: $gray;
              text-decoration: line-through;
              font-size: rpx(28);
            }
          }
        }
      }
    }
    .btn-add {
      @include middle-center-x(fixed);
      bottom: rpx(80);
      width: rpx(340);
      height: rpx(80);
      line-height: rpx(80);
      font-size: rpx(32);
      background-color: $main-color;
      color: #fff;
      text-align: center;
      border-radius: rpx(8);
    }
  }
</style>
