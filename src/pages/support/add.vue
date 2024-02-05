<template>
  <view class="add">
    <!-- #ifdef MP-ALIPAY -->
    <!-- <navigation-bar :title="title"  :alpha="1" background-color="#fff" subtitle-color="#333"/> -->
    <!-- #endif -->
    <view class="row flex-h flex-c-s m-0-32">
      <text class="title fs-40 fw-400 c-black">姓名</text>
      <!-- #ifdef MP-WEIXIN -->
      <input
        class="flex-1 fs-40"
        placeholder="请输入姓名"
        placeholder-class="placeholder"
        v-model="params.supportName"
        :class="isEditable ? 'c-black' : 'color-lightgrey'"
        :disabled="!isEditable"
        :focus="true"
        @focus="currentFocus = 0"
        @blur="currentFocus = -1"
      />
      <image
        class="clear"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-input-clear.png"
        v-if="params.supportName && currentFocus === 0"
        @click="params.supportName = ''"
      />
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <input
        class="flex-1 fs-40"
        placeholder="请输入姓名"
        placeholder-class="placeholder"
        v-model="params.supportName"
        :class="isEditable ? 'c-black' : 'color-lightgrey'"
        :disabled="!isEditable"
        @focus="showIcon = true"
      />
      <image
        class="clear"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-input-clear.png"
        v-if="showIcon"
        @click="clearName"
      />
      <!-- #endif -->
    </view>
    <view class="row flex-h flex-c-s m-0-32">
      <text class="title fs-40 fw-400 c-black">身份证号</text>
      <input
        class="flex-1 fs-40"
        placeholder="请输入身份证号"
        placeholder-class="placeholder"
        type="idcard"
        maxlength="18"
        v-model="params.idCard"
        :class="isEditable ? 'c-black' : 'color-lightgrey'"
        :disabled="!isEditable"
        @focus="currentFocus = 1"
        @blur="currentFocus = -1"
      />
      <image
        class="clear"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-input-clear.png"
        v-if="params.idCard && currentFocus === 1"
        @click="params.idCard = ''"
      />
    </view>
    <view class="row flex-h flex-c-s m-0-32">
      <text class="title fs-40 fw-400 c-black">联系电话</text>
      <input
        class="flex-1 fs-40 c-black"
        placeholder="请输入联系电话"
        placeholder-class="placeholder"
        type="number"
        maxlength="11"
        v-model="params.phone"
        @focus="currentFocus = 2"
        @blur="currentFocus = -1"
      />
      <image
        class="clear"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-input-clear.png"
        v-if="params.phone && currentFocus === 2"
        @click="params.phone = ''"
      />
    </view>
    <view class="row flex-h flex-c-s m-0-32">
      <text class="title fs-40 fw-400 c-black">选择关系</text>
      <view class="types flex-h flex-c-b p-0-8">
        <text
          v-for="(item, index) in relations"
          class="type flex-1 fs-36 c-grey animated"
          :class="{ 'type--selected': index === selectedIndex }"
          :key="index"
          @click="selectedIndex = index"
        >
          {{ item.title }}
        </text>
        <view
          class="highlight bg-white animated"
          :class="selectedIndex === 0 ? 'highlight--left' : 'highlight--right'"
        />
      </view>
    </view>
    <view class="relations flex-h flex-wrap m-32">
      <text
        class="item bg-white fs-36 c-black p-0-24 mr-48 mb-24 animated"
        v-for="(item, index) in relations[selectedIndex].items"
        :class="{ 'item--selected': index === selectedItemIndex }"
        :key="index"
        @click="selectedItemIndex = index"
      >
        {{ item.relationName }}
      </text>
    </view>
    <view class="footer bg-white">
      <button
        class="add-button fs-44 fw-500 c-white m-0-32"
        @click="handleAddClick"
      >
        确定
      </button>
    </view>
  </view>
</template>

<script>
import {
  validateIDCardNumber,
  validatePhoneNumber,
} from "@/utils/validation.js";
import api from "@/apis/index.js";
import NavigationBar from "../../components/common/navigation-bar.vue";
export default {
  components: { NavigationBar },
  data() {
    return {
      isClick: true,
      timer: null,
      title: "",
      // 赡养还是扶养, 0: 赡养 1: 扶养
      index: 0,
      // 当前正在输入的输入框
      currentFocus: -1,
      // 姓名和身份证号输入框是否可编辑
      isEditable: true,
      // 选择关系选中的下标
      selectedIndex: 0,
      // 关系选项选中的下标
      selectedItemIndex: -1,
      // 赡养扶养关系
      relations: [],
      // 表单数据
      params: {
        supportName: "",
        idCard: "",
        phone: "",
      },
      // 列表Id(编辑时使用)
      supportId: "",
      prop: {},
      showIcon: false,
    };
  },
  onLoad(e) {
    console.log("获取传入数据33333----", e.index, e.info);
    if (e.index == "1") {
      this.relations = [
        {
          title: "扶养我的",
        },
        {
          title: "我扶养的",
        },
      ];
    } else {
      this.relations = [
        {
          title: "赡养我的",
        },
        {
          title: "我赡养的",
        },
      ];
    }
    // #ifdef MP-ALIPAY
    this.index = e.index;
    if (e.info) {
      const info = JSON.parse(decodeURIComponent(e.info));
      if (info.supportId) {
        this.supportId = info.supportId;
        this.prop = { info: info, index: this.index };
      }
    }
    this.setRelations();
    // #endif
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("didOpenPageFinish", (data) => {
      console.log("获取传入数据22----", data);
      if (data.index == "1") {
        this.relations = [
          {
            title: "扶养我的",
          },
          {
            title: "我扶养的",
          },
        ];
      } else {
        this.relations = [
          {
            title: "赡养我的",
          },
          {
            title: "我赡养的",
          },
        ];
      }
      this.supportId = data.info.supportId;
      this.index = data.index;
      this.setRelations();
      this.prop = data;
      console.log("类型111111111----", this.supportId);
    });
  },
  created() {
    // #ifdef MP-ALIPAY
    //  const relation_index = uni.getStorageSync('relation_index')
    //  this.index = relation_index
    //  this.setRelations()
    console.log("====点击---");
    // #endif
    // console.log("====支付宝不执行---",relation_index)
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    clearName() {
      this.params.supportName = "";
      this.showIcon = false;
    },
    /**
     * 根据条件获取所有亲情关系：关系类型 (01-我赡养的 02-赡养我的 11-我抚养的 12-抚养我的),
     */
    relationListByParam(type) {
      console.log("====进来了---", type);
      const data = {
        relationType: type,
      };
      // let this = this
      api.relationListByParam({
        data,
        success: (res) => {
          let list = [];
          list = res.map((item) => {
            return item;
          });
          if (type === "01") {
            // relations[1] = {
            //   title: '我赡养的',
            //   items: list,
            //   type: '01',
            // }
            this.$set(this.relations, 1, {
              title: "我赡养的",
              items: list,
              type: "01",
            });
          } else if (type === "02") {
            // relations[0] = {
            //   title: '赡养我的',
            //   items: list,
            //   type: '02',
            // }
            this.$set(this.relations, 0, {
              title: "赡养我的",
              items: list,
              type: "02",
            });
          } else if (type === "11") {
            // relations[1] = {
            //   title: '我扶养的',
            //   items: list,
            //   type: '11',
            // }
            this.$set(this.relations, 1, {
              title: "我扶养的",
              items: list,
              type: "11",
            });
          } else if (type === "12") {
            // relations[0] = {
            //   title: '扶养我的',
            //   items: list,
            //   type: '12',
            // }
            this.$set(this.relations, 0, {
              title: "扶养我的",
              items: list,
              type: "12",
            });
          }
          console.log("-----关系00----", this.relations);
          if (this.relations.length === 2) {
            console.log("this.prop：", this.prop);
            if (this.prop.info && this.prop.info.supportId) {
              this.isEditable = false;
              this.params.supportName = this.prop.info.supportName;
              this.params.idCard = this.prop.info.idCard;
              this.params.phone = this.prop.info.phone;
              this.supportId = this.prop.info.supportId;
              console.log("类型：", this.relations);
              this.relations.map((item, index) => {
                if (item.type === this.prop.info.supType) {
                  console.log("index1:", index);
                  this.selectedIndex = index;
                }
              });
              console.log("类型222：", this.relations[this.selectedIndex]);
              this.relations[this.selectedIndex].items.map((item, index) => {
                if (this.prop.info.relationId === item.relationId) {
                  console.log("index2:", index);
                  this.selectedItemIndex = index;
                }
              });
            }
          }
          console.log("this.relations:", this.relations);
          setTimeout(() => {
            this.copyObj = this.relations;
            this.relations = [];
            this.relations = [].concat(this.copyObj);
          }, 2000);
          // this.$forceUpdate()
        },
      });
    },
    /**
     * 确定点击事件
     */
    handleAddClick() {
      if (this.isClick) {
        this.isClick = false;
        if (!this.checkInput()) {
          this.isClick = true;
          return;
        }
        const data = {
          supportId: this.supportId,
          supportName: this.params.supportName,
          idCard: this.params.idCard,
          phone: this.params.phone,
          supType: this.relations[this.selectedIndex].type,
          relationId:
            this.relations[this.selectedIndex].items[this.selectedItemIndex]
              .relationId,
          supRelName:
            this.relations[this.selectedIndex].items[this.selectedItemIndex]
              .relationName,
        };
        api.addUserSupport({
          data,
          success: (res) => {
            console.log("添加成功:", res);
            // 是否领取到赡养抚养积分( '0' 不是 '1'是)
            if (this.supportId) {
              this.$uni.showToast({ icon: "success", title: "修改成功" });
            } else {
              this.$uni.showToast({ icon: "success", title: "添加成功" });
            }

            setTimeout(() => {
              uni.$emit("didAddSupport", res.isSupItgl);
              uni.navigateBack();
            }, 1500);
          },
          fail: (err) => {
            console.log("添加失败：", err);
            this.$uni.showToast(err.message);
          },
        });
        this.timer = setTimeout(() => {
          this.isClick = true;
        }, 3000);
      }
    },
    /**
     * 根据添加赡养人/添加扶养人的不同设置可选择的关系列表 (01-我赡养的 02-赡养我的 11-我抚养的 12-抚养我的),
     */
    setRelations() {
      console.log(
        "33333333333333---:",
        this.supportId,
        "index----",
        this.index
      );
      const titles = { 0: "赡养人", 1: "抚养人" };
      if (this.supportId) {
        // #ifdef MP-ALIPAY
        this.title = "编辑" + titles[this.index];
        // #endif
        // #ifdef MP-WEIXIN
        this.$uni.setTitle("编辑" + titles[this.index]);
        // #endif
      } else {
        // #ifdef MP-ALIPAY
        this.title = "添加" + titles[this.index];
        // #endif
        // #ifdef MP-WEIXIN
        this.$uni.setTitle("添加" + titles[this.index]);
        // #endif
      }
      switch (this.index + "") {
        case "0":
          this.relationListByParam("02");
          this.relationListByParam("01");
          break;
        case "1":
          this.relationListByParam("12");
          this.relationListByParam("11");
          break;
        default:
          break;
      }
    },
    /**
     * 输入校验
     */
    checkInput() {
      if (!this.params.supportName) {
        this.$uni.showToast("请输入姓名");
        return false;
      }
      if (!/^[\u4E00-\u9FA5]+$/.test(this.params.supportName)) {
        this.$uni.showToast("请输入真实姓名");
        return false;
      }
      if (!this.params.idCard) {
        this.$uni.showToast("请输入身份证号");
        return false;
      }
      if (!validateIDCardNumber(this.params.idCard)) {
        this.$uni.showToast("身份证号码格式不正确");
        return false;
      }
      if (!this.params.phone) {
        this.$uni.showToast("请输入联系电话");
        return false;
      }
      if (!validatePhoneNumber(this.params.phone)) {
        this.$uni.showToast("联系电话格式不正确");
        return false;
      }
      if (this.selectedItemIndex === -1) {
        this.$uni.showToast("请选择与持卡人关系");
        return false;
      }
      return true;
    },
  },
  watch: {
    relations: {
      // immediate:true,
      handler(n, o) {
        console.log("新数据的长度：", n.length);
        console.log("旧数据的长度：", o.length);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.add {
  height: 100vh;
  background-color: #fff;
  .row {
    height: 118rpx;
    border-bottom: 2rpx solid #ebedf0;
    .color-lightgrey {
      color: #100f0f;
    }
    .title {
      width: 244rpx;
    }
    .clear {
      position: relative;
      z-index: 1;
      @include square(32);
    }
    .types {
      position: relative;
      width: 370rpx;
      height: 72rpx;
      background: #f2f2f2;
      border-radius: 36rpx;
      .type {
        z-index: 9;
        text-align: center;
        &--selected {
          color: $color-primary;
        }
      }
      .highlight {
        position: absolute;
        width: 190rpx;
        height: 64rpx;
        border-radius: 32rpx;
        &--left {
          left: 4rpx;
        }
        &--right {
          left: 192rpx;
        }
      }
    }
  }
  .relations {
    .item {
      height: 72rpx;
      line-height: 72rpx;
      border-radius: 36rpx;
      border: 2rpx solid #dcdee0;
      box-sizing: border-box;
      &--selected {
        color: $color-primary;
        border: 2rpx solid $color-primary;
      }
    }
  }
  .footer {
    position: fixed;
    width: 100vw;
    bottom: 0;
    display: flex;
    justify-content: center;
    .add-button {
      margin-bottom: 66rpx;
      width: 686rpx;
      height: 108rpx;
      line-height: 108rpx;
      border-radius: 54rpx;
      background: linear-gradient(to right, $color-secondary, $color-primary);
    }
  }
}
</style>
