<style lang="scss">
.modal-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.modal {
  position: relative;
  display: block;
  width: 100%;
  border-bottom: 1px solid#f7f7f7;

  .modal-close {
    position: absolute;
    right: rpx(20);
    top: rpx(20);
    font-size: rpx(40);
    color: $color-lightgrey;
  }

  .modal-title {
    padding: rpx(25);
    font-size: rpx(32);
    text-align: center;

    .line {
      margin: rpx(10) auto 0;
      width: rpx(36);
      height: 1px;
      background-color: $color-black;
    }
  }

  .scroll-container {
    max-height: rpx(1028);
    min-height: rpx(600);
  }

  .attribute-list {
    border-top: 1px solid #f1f1f1;

    .attribute {
      display: flex;
      align-items: center;
      position: relative;
      color: $color-black;
      font-size: rpx(28);
      border-bottom: 1px solid #f1f1f1;

      .content {
        flex: 1;
        height: rpx(65);
        line-height: rpx(65);
        padding-left: rpx(115);

        &:last-child {
          border-left: 1px solid #f1f1f1;
        }
      }
    }
  }
}
</style>

<template>
  <div v-if="showPopup" class="modal-wrap">
    <div class="modal">
      <i @click="show(false)" class="modal-close iconfont icon-guanbi"></i>
      <div class="modal-title">
        规格参数
        <div class="line"></div>
      </div>
      <div class="scroll-container" ref="scrollContainer">
        <ul class="attribute-list">
          <li class="attribute" v-for="(data, index) in dataList" :key="index">
            <div class="content">{{ data.name }}</div>
            <div class="content">{{ data.value }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ATTRIBUTE_LIST",
  props: {
    dataList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      showPopup: false,
    };
  },
  components: {},
  methods: {
    show(flag) {
      this.showPopup = flag;
    },
  },
  async mounted() {},
};
</script>
