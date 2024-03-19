<template>
  <div class="topic-store-list" :name="common.name" @click="onClick">
    <img style="display: block; width: 100%;"
         src="https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4C/AB/wKgupGK3HaSAXZORAAFAfsyABqk940.png">
  </div>
</template>

<script>
export default {
  props: ['mode', 'instance_id', 'common', 'content'],
  data() {
    return {
      timer: null,
      itemList: [],
    }
  },
  computed: {
    image() {
      return XIU.getAliImg(this.content.image)
    },
    itemStyle() {
      return this.itemList ? {width: `${this.itemList.length * 2.66667 + 0.4}rem`} : {};
    }
  },
  methods: {
    onClick() {
      XIU.genLink(this.content.link)
    },
  },
  mounted() {
  }
}
</script>

<style lang="scss">
$black: #000;
.topic-store-list {
  background-color: #fff;
  margin-left: 25rpx;
  margin-right: 25rpx;
}
</style>
