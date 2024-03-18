<template>
  <div class="topic-rich-text" :style="{backgroundColor: content.color}">
    <rich-text class="rich-text" :nodes="content.text"></rich-text>
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
        list: [],
      }
    },
    methods: {
      goItem(data) {
        wx.navigateTo({
          url: '/pages/item/main?id=' + data.productSid
        })
      }
    },
    async mounted() {
      this.content.text = this.content.text.replace(/<img/ig, '<img class="img"')
    }
  }
</script>

<style lang="scss">
  @import "@/styles/base";

  .topic-rich-text {
    line-height: 1.5;
    padding: rpx(30);
    font-size: rpx(26);
    .img {
      display: block;
      width: 100%;
    }
  }
</style>
