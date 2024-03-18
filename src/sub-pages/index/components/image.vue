<template>
  <div class="topic-image">
    <img class="image" :style="{height: height+ 'rpx'}" @load="onLoad" :src="img" @tap="onTap">
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      height: 400
    }
  },
  computed: {
    img() {
      return this.content.image && XIU.getImgFormat(this.content.image, '/resize,w_750')
    }
  },
  methods: {
    onLoad(e) {
      this.height = parseInt(e.mp.detail.height / e.mp.detail.width * 750)
    },
    onTap() {
      XIU.genLink(this.content.link)
    }
  },
  async mounted() {

  }
}
</script>

<style lang="scss">
@import '@/styles/base';

.topic-image {
  .image {
    width: rpx(750);
  }
}
</style>
