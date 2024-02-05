<template>
  <view class="maintenance-and-support">
    <view class="header flex-h flex-c-s">
      <text class="fs-44 c-black ml-32">赡养扶养人信息</text>
    </view>
    <view class="form">
      <view
        class="item p-0-32"
        v-for="(item, index) in params.relations"
        :key="index"
      >
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__label fs-40 c-black mr-48">姓名</text>
          <input
            class="fs-40 c-black flex-1"
            placeholder="请输入姓名"
            placeholder-class="placeholder"
            v-model="item.name"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__label fs-40 c-black mr-48">身份证号</text>
          <input
            class="fs-40 c-black flex-1"
            type="idCard"
            maxlength="18"
            placeholder="请输入身份证号"
            placeholder-class="placeholder"
            v-model="item.idCardNumber"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__label fs-40 c-black mr-48">联系电话</text>
          <input
            class="fs-40 c-black flex-1"
            type="number"
            maxlength="11"
            placeholder="请输入联系电话"
            placeholder-class="placeholder"
            v-model="item.phoneNumber"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__label fs-40 c-black mr-48">与持证人关系</text>
          <picker
            class="flex-1"
            :id="index"
            :range="relationTypes"
            @change="handleRelationTypeChange"
          >
            <text
              class="fs-40 c-black"
              :class="{ 'c-lightgrey': item.relation === '' }"
            >
              {{ item.relation || "请选择" }}
            </text>
          </picker>
          <image
            class="row__accessory"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
        <button
          class="delete-button fs-40"
          hover-class="none"
          @click="handleDeleteButtonClick(index)"
        >
          删除
        </button>
      </view>
      <view
        v-if="params.relations.length < 5"
        class="add-button flex-h flex-c-c"
        @click="handleAddButtonClick"
      >
        <text class="add-button__text fs-40 c-primary">+ 添加</text>
      </view>
    </view>
    <view style="width: 100vw; height: 172rpx" />
    <view class="save flex-h flex-c-c bg-white">
      <button class="button fs-44 c-white" @click="handleSaveButtonClick">
        保存
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
export default {
  data() {
    return {
      // 与持证人关系列表
      relationTypes: [
        "配偶",
        "子、女/媳",
        "孙子女/外孙子女",
        "兄弟姐妹",
        "其他",
      ],
      // 表单数据
      params: {
        relations: [],
      },
    };
  },
  onLoad() {
    this.requestData();
  },
  methods: {
    /**
     * 删除点击事件
     */
    handleDeleteButtonClick(index) {
      this.$uni.showConfirm({
        content: "是否删除该条赡养扶养关系",
        confirm: () => {
          const supportId = this.params.relations[index].supportId;
          if (supportId) {
            api.deleteSuppertRelation({
              data: { supportId: supportId },
              success: () => {
                this.params.relations.splice(index, 1);
              },
            });
          } else {
            this.params.relations.splice(index, 1);
          }
        },
      });
    },
    /**
     * 添加点击事件
     */
    handleAddButtonClick() {
      this.params.relations.push({
        name: "",
        idCardNumber: "",
        phoneNumber: "",
        relation: "",
      });
    },
    /**
     * 与持证人关系改变回调
     */
    handleRelationTypeChange(e) {
      const index = e.target.id;
      const relation = this.relationTypes[e.detail.value];
      this.params.relations[index].relation = relation;
    },
    /**
     * 保存点击事件
     */
    handleSaveButtonClick() {
      const flag = this.params.relations.every((item) => {
        if (!item.name) {
          this.$uni.showToast("请输入姓名");
          return false;
        }
        if (!item.idCardNumber) {
          this.$uni.showToast("请输入身份证号");
          return false;
        }
        if (!validateIDCardNumber(item.idCardNumber)) {
          this.$uni.showToast("身份证号格式错误，请重新输入");
          return false;
        }
        if (!item.phoneNumber) {
          this.$uni.showToast("请输入手机号");
          return false;
        }
        if (!validatePhoneNumber(item.phoneNumber)) {
          this.$uni.showToast("手机号格式错误，请重新输入");
          return false;
        }
        if (!item.relation) {
          this.$uni.showToast("请选择与持证人关系");
          return false;
        }
        return true;
      });
      if (!flag) return;
      const data = this.params.relations
        .filter((item) => !item.supportId)
        .map((item) => {
          return {
            supportName: item.name,
            idCard: item.idCardNumber,
            phone: item.phoneNumber,
            supRelName: item.relation,
          };
        });
      if (data.length === 0) return;
      api.addSuppertRelations({
        data: { list: data },
        success: () => {
          this.$uni.showToast("保存成功");
        },
      });
    },
    /**
     * 请求数据
     */
    requestData() {
      api.getSuppertRelations({
        success: (data) => {
          this.params.relations = data.map((item) => {
            return {
              ...item,
              name: item.supportName,
              idCardNumber: item.idCard,
              phoneNumber: item.phone,
              relation: item.supRelName,
            };
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.maintenance-and-support {
  .header {
    height: 108rpx;
  }
  .form {
    .item {
      border-bottom: 16rpx solid #f5f5f5;
      &:last-child {
        border-bottom: none;
      }
      .row {
        min-height: 120rpx;
        border-bottom: 2rpx solid $color-line;
        box-sizing: border-box;
        &__label {
          width: 240rpx;
        }
        &__accessory {
          @include square(48);
        }
        .city {
          @include text-line(2);
        }
      }
    }
    .delete-button {
      margin: 16rpx auto;
      color: #eb3030;
      line-height: 80rpx;
    }
    .add-button {
      margin: 32rpx auto;
      width: 200rpx;
      height: 72rpx;
      border-radius: 36rpx;
      border: 2rpx solid $color-primary;
      box-sizing: border-box;
    }
  }
  .save {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 172rpx;
    z-index: 9;
    .button {
      width: 686rpx;
      height: 108rpx;
      line-height: 108rpx;
      border-radius: 54rpx;
      background: linear-gradient(to right, $color-secondary, $color-primary);
    }
  }
}
</style>
