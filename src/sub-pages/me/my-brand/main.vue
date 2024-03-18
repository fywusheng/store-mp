<template>
  <div class="page-brand-list">
    <ul class="brand-list">
      <li class="brand" @click="toBrand(brand)" v-for="(brand,index) in dataList" :key="index">
        <img class="brand-logo" mode="aspectFit" :lazy-load="true" :src="brand.brandLogo">
        <div class="brand-name">{{brand.brandName}}</div>
        <div class="btn-attention" @click.stop="remove(brand)">取消关注</div>
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
      toBrand(brand){
        wx.navigateTo({
          url: `/pages/brand/main?id=${brand.brandId}`
        })
      },
      async remove(brand) {
        const result = await wx.showModal({
          title: '',
          content: '确定要取消?',
          confirmColor: '#FB4769'
        })
        if (result.confirm) {
          wx.showLoading({ title: '正在提交...', mask: true });
          const delResult = await Axios.post('/brand/getConcernList', {
              brandId: brand.brandId,
            }
          )
          wx.hideLoading()
          if (delResult.code == 200) {
            wx.showToast({
              title: delResult.msg || '取消成功',
              icon: 'none'
            });
            this.loadData();
          } else {
            wx.showToast({
              title: delResult.result.message || '删除失败',
              icon: 'none'
            });
          }
        }
      },
      async loadData() {
        const result = await Axios.get('/brand/getConcernList', {params: {
            pageNo: 1,
            pageNum: 100,
        }})
        if (result.code == 200) {
          this.dataList = result.data.brands || [];
        } else {
          wx.showToast({
            title: result.msg || '获取数据失败',
            icon: 'none'
          });
        }
      }
    },
    async mounted() {
      if(!Store.getters.isLogin){
        await Store.dispatch('login')
      }
      wx.setNavigationBarTitle({
        title: '关注'
      })
      wx.showLoading({ title: '正在加载...', mask: true });
      await this.loadData()
      wx.hideLoading();
      this.pageLoad = true;
    },
  }
</script>

<style lang="scss">
  @import "~@/styles/base";

  .page-brand-list {
    padding-bottom: rpx(50);
    .brand-list {
      .brand {
        position: relative;
        display: flex;
        align-items: center;
        padding: rpx(25) rpx(30);
        border-bottom: rpx(1) solid $border;
        .brand-logo {
          width: rpx(60);
          height: rpx(60);
        }
        .brand-name {
          margin-left: rpx(30);
          font-size: rpx(28);
          font-weight: bold;
        }
        .btn-attention {
          @include middle-center-y();
          right: rpx(30);
          width: rpx(140);
          height: rpx(50);
          line-height: rpx(50);
          font-size: rpx(26);
          background-color: $main-color;
          color: #fff;
          border-radius: rpx(25);
          text-align: center;
        }
      }
    }
  }
</style>
