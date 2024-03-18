<template>
    <div class="topic-brand-list" :name="common.name"  @click="onClick">
       <img style="display: block; width: 100%;" src="https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4C/AB/wKgupGK3HJOAc5d3AAFHGV1RHLU916.png">
    </div>
</template>

<script>

    export default {
        props: [ 'mode', 'instance_id', 'common', 'content' ],
        data() {
            return {
                timer: null,
                itemList: [],
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
    .topic-brand-list {
      margin-left:25rpx;
      margin-right: 25rpx;
        background-color: #fff;

    }
</style>
