<template>
  <div class="topic-space" :style="style"></div>
</template>

<script>
  export default {
    props: {
      content: {
        type: Object,
        default: {},
      }
    },
    computed: {
      style(){
        const radio = 750/wx.getSystemInfoSync().windowWidth;
        return `height: ${this.content.height*radio}rpx;background-color:${this.content.color}`
      }
    },
    data() {
      return {}
    },
    methods: {},
    async mounted() {
      console.info(this.content)
    }
  }
</script>

<style lang="scss">
  @import "@/styles/base";

  .topic-title {
  }
</style>
