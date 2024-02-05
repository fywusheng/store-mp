<template>
  <view class="brand-list">
    <view v-for="item in showList" :key="item.identity" class="item" @click="goDetail(item)">
      <image class="icon" :src="item.mainPic" mode="scaleToFill" />
      <view class="right">
        <view class="name">{{ item.name }}</view>
        <view class="address">
          <view>{{ item.price }}</view>
          <view>{{ item.distance }}</view>
        </view>
      </view>
      <view class="line"></view>
    </view>
    <view v-if="showLookAll" class="look-all" @click="hanldeClickMore">
      <text>{{ arrow === 'bottom' ? '查看全部分店' : '收起' }}</text>
      <image
        class="arrow"
        :class="arrow === 'bottom' ? '' : 'top'"
        src="https://ggllstatic.hpgjzlinfo.com/static/benefit/arrow-bottom.png"
        mode="scaleToFill"
      />
    </view>
  </view>
</template>
<script>
  export default {
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        arrow: 'bottom'
      }
    },
    computed: {
      showList() {
        // let resList = null
        // if (this.arrow === 'bottom' && this.list && this.list.length > 3) {
        //   resList = this.list.slice(0, 3)
        // } else {
        //   resList = this.list.slice(0, this.list.length + 1)
        // }
        // console.log('showList', resList)
        return this.list
      },
      showLookAll() {
        return false
        // return this.list && this.list.length > 3
      }
    },
    methods: {
      goDetail(item) {
        this.$emit('go-detail', item)
      },
      hanldeClickMore() {
        // this.arrow = 'top'
        this.arrow = this.arrow === 'top' ? 'bottom' : 'top'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .brand-list {
    margin-top: 24rpx;
    transition: all 1s linear;
    .item {
      display: flex;
      width: 100%;
      align-items: center;
      // margin-bottom: ;
      padding: 24rpx 0;
      border-bottom: 2rpx solid #eeeeee;
      &:last-child {
        border: none;
      }
      .icon {
        width: 214rpx;
        height: 176rpx;
        border-radius: 16rpx;
        flex-shrink: 0;
      }
      .right {
        margin-left: 16rpx;
        height: 176rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          font-size: 40rpx;
          width: 440rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-weight: 500;
          color: #333333;
        }
        .address {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 36rpx;
          font-weight: 500;
          color: #ff5500;
        }
      }
    }
    .look-all {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 400;
      font-size: 36rpx;
      color: #666666;
      margin-top: 24rpx;
      .arrow {
        margin-left: 10rpx;
        width: 36rpx;
        height: 36rpx;
        transform: rotate(0deg);
        transition: all 0.2s linear;
        &.top {
          transform: rotate(180deg);
        }
      }
    }
  }
</style>
