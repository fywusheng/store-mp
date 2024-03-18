<template>
  <scroll-view class="topic-banner2" scroll-x v-if="list">
    <div class="brand-list">
      <div class="banner-wrap" v-for="(data,index) in list" :key="index">
        <img class="banner" :style="{height: data.height+ 'rpx'}"  :src="data.image_url" @load="onLoad($event, data)" @tap="onTap(data)">
      </div>
    </div>
  </scroll-view>
</template>

<script>
  export default {
    props: {
      content: {
        type: Object,
        default: {},
      }
    },
    data() {
      return {
        height: 750,
        list: [],
      }
    },
    methods: {
      onLoad(e, data) {
        data.height = e.mp.detail.height / e.mp.detail.width * 275;
        this.height = data.height;
      },
      onTap(data) {
        XIU.genLink(data.link)
      }
    },
    async mounted() {
      console.info(this.content)
      if (this.content.list) {
        this.content.list.forEach(data => {
          data.height = 400;
          data.image_url = XIU.getImgFormat(data.image_url,  '/resize,w_750')
        })
      }
      this.list = this.content.list || [];
    }
  }
</script>

<style lang="scss">
  @import "@/styles/base";

  .topic-banner2 {
    padding-left: rpx(30);
    box-sizing: border-box;
    width: rpx(750);
    .brand-list {
      display: flex;
      align-items: center;
      .banner-wrap {
        margin-right: rpx(30);
        width: rpx(275) !important;
        .banner {
          width: rpx(275) !important;
        }
      }
    }
  }
</style>
