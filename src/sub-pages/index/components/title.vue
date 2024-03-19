<template>
  <div class="topic-title" :style="style">
    {{content.text}}
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    style() {
      const radio = 750 / wx.getSystemInfoSync().windowWidth
      const size = radio * (this.content.size || 0)
      const top = radio * (this.content.top || 0)
      const bottom = radio * (this.content.bottom || 0)
      const left = radio * (this.content.left || 0)
      const right = radio * (this.content.right || 0)
      return `text-align: ${this.content.align};font-size: ${size}rpx;padding-top: ${top}rpx;padding-left:${left}rpx;padding-right:${right}rpx;padding-bottom:${bottom}rpx;`
    }
  },
  data() {
    return {}
  },
  methods: {},
  async mounted() { }
}
</script>

<style lang="scss">
@import '@/styles/base';

// .topic-title {
// }
</style>
