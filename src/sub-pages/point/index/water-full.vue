<template>
  <view style="padding: 0 10rpx">
    <view class="handle">
      <button class="btn" type="default" @click="add()">增加数据</button>
      <button class="btn" type="default" @click="changeColumn(1)">
        +列数({{ column }})
      </button>
      <button class="btn" type="default" @click="changeColumn(0)">
        -列数({{ column }})
      </button>
      <button class="btn" type="default" @click="reset()">刷新数据</button>
    </view>
    <waterfalls-flow
      ref="waterfallsFlowRef"
      :value="data.list"
      :column="column"
      :columnSpace="1.5"
      :seat="2"
      @wapperClick="wapperClick"
      @imageClick="imageClick"
      @loaded="loaded"
    >
      <template v-slot:default="{ item }">
        <view class="item">
          <view class="title">{{ item.title }}</view>
          <view class="desc">{{ item.desc }}</view>
        </view>
      </template>
    </waterfalls-flow>
  </view>
</template>
<script setup>
// #ifdef VUE3
import { reactive, ref, onMounted } from "vue";
const data = reactive({
  list: [
    {
      image: "https://via.placeholder.com/200x500.png/ff0000",
      title: "我是标题1",
      desc: "描述描述描述描述描述描述描述描述1",
    },
    {
      image: "https://via.placeholder.com/200x200.png/2878ff",
      title: "我是标题2",
      desc: "描述描述描述描述描述描述描述描述2",
    },
    {
      image: "https://via.placeholder.com/200x100.png/FFB6C1",
      title: "我是标题3",
      desc: "描述描述描述描述描述描述描述描述3",
    },
    {
      image: "https://via.placeholder.com/200x300.png/9400D3",
      title: "我是标题4",
      desc: "描述描述描述描述描述描述描述描述4",
    },
    {
      image: "https://via.placeholder.com/100x240.png/B0E0E6",
      title: "我是标题5",
      desc: "描述描述描述描述描述描述描述描述5",
    },
    {
      image: "https://via.placeholder.com/140x280.png/7FFFAA",
      title: "我是标题6",
      desc: "描述描述描述描述描述描述描述描述6",
    },
    {
      image: "https://via.placeholder.com/40x60.png/EEE8AA",
      title: "我是标题7",
      desc: "描述描述描述描述描述描述描述描述7",
    },
  ],
});
const column = ref(3);

function add() {
  const newArr = [
    {
      image: "https://via.placeholder.com/58x100.png/FF7F50",
      title: "我是标题8",
      desc: "描述描述描述描述描述描述描述描述8",
    },
    {
      image: "https://via.placeholder.com/59x100.png/C0C0C0",
      title: "我是标题9",
      desc: "描述描述描述描述描述描述描述描述9",
    },
    {
      image: "https://via.placeholder.com/60x100.png/FAEBD7",
      title: "我是标题10",
      desc: "描述描述描述描述描述描述描述描述10",
    },
  ];
  data.list = data.list.concat(newArr);
}

function changeColumn(h) {
  column.value = !h ? column.value - 1 : column.value + 1;
}

function loaded() {
  console.log("加载完成");
}

function wapperClick(item) {
  console.log("单项点击事件", item);
}

function imageClick(item) {
  console.log("图片点击事件", item);
}
const waterfallsFlowRef = ref(null);

function reset() {
  data.list = [
    {
      image: "https://via.placeholder.com/200x500.png/ff0000",
      title: "我是标题1",
      desc: "描述描述描述描述描述描述描述描述1",
    },
  ];
  waterfallsFlowRef.value.refresh();
}
// #endif
</script>
<style>
page {
  background-color: #f2f5f9;
}
</style>
<style lang="scss" scoped>
.handle {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
  padding: 10rpx;

  .btn {
    margin: 20rpx 10rpx;
    padding: 0 20rpx;
    background: #2878ff;
    font-size: 28rpx;
    color: #fff;

    &::after {
      border: 0;
    }
  }
}

.item {
  padding: 10rpx 10rpx 20rpx;

  .title {
    line-height: 48rpx;
    font-size: 28rpx;
    color: #222;
  }

  .desc {
    font-size: 24rpx;
    color: #666;
  }
}
</style>
