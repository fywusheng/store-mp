<style lang="scss">
@import '~@/styles/base';

.page-views {
  width: 100%;
  background: #fff;
  .attribute-list {
    padding: rpx(32);
    .attribute {
      padding-top: rpx(34);
      padding-bottom: rpx(33);
      border-bottom: rpx(1) solid #e4e4e4;
      .name {
        font-size: rpx(30);
        font-weight: bold;
      }
      .content {
        padding-top: rpx(25);
        font-size: rpx(26);
        color: #333333;
      }
    }
  }
  .empty {
    img {
      display: block;
      margin: rpx(200) auto rpx(30);
      width: rpx(200);
      height: rpx(200);
    }
    .desc {
      text-align: center;
      font-size: rpx(26);
      color: #25292d;
    }
  }
}
</style>

<template>
  <div class="page-views">
    <ul class="attribute-list">
      <li class="attribute" v-if="data.value" v-for="(data,index) in dataList" :key="index">
        <div class="name">{{data.name}}:</div>
        <div class="content">{{data.value || '无'}}</div>
      </li>
    </ul>
    <div class="empty" v-if="!dataList.length">
      <img src="https://ggllstatic.hpgjzlinfo.com/static/images/no-comment.png">
      <div class="desc">暂无属性</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ATTRIBUTE_LIST',
  data() {
    return {
      dataList: []
    }
  },

  methods: {

  },
  async mounted() {
    this.dataList = wx.getStorageSync('attribute')
  }
}
</script>
