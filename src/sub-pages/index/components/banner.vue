<template>
  <div class="topic-banner">
    <swiper class="banner-list" :style="{height: height+ 'rpx'}" :circular="true"
            :indicator-dots="list.length > 1"
            :autoplay="true" :skip-hidden-item-layout="true"
            indicator-color="#FFFFFF" indicator-active-color="#25292D"
            :interval="6000" :duration="500" v-if="list">
      <swiper-item v-for="(data,index) in list" :key="index">
        <img class="banner" :style="{height: data.height+ 'rpx'}" @load="onLoad($event, data)" :src="data.image_url"
             @tap="onTap(data.topic_link)">
      </swiper-item>
    </swiper>
  </div>
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
    watch: {
      'content.code': {
        handler() {
          this.getData()
        }
      }
    },
    methods: {
      onLoad(e, data) {
        data.height = e.mp.detail.height / e.mp.detail.width * 750;
        this.height = data.height;
      },
      onTap(link) {
        XIU.genLink(link)
      },
      async getData(){
        if(this.content.code){
          const result = await Axios.get(`${ENV.CMS}/operationContent/getByCode?code=${this.content.code}`)
          if(result.code === 200){
            result.data.contentList.forEach(content => {
              content.image_url = XIU.getImgFormat(content.image_url,  '/resize,w_750')
            })
            this.list = result.data.contentList;
          }
        }
      }
    },
    async mounted() {
      this.getData();
    }
  }
</script>

<style lang="scss">
  @import "@/styles/base";

  .topic-banner {
    .banner-list {
      display: flex;
      .banner {
        width: rpx(750);
        height: rpx(400);
      }
    }
  }
</style>
