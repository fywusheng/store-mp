<template>
  <div class="page-address-list" :class="{ select: type === 1 }">
    <ul class="delivery-list" v-if="loading || dataList.length">
      <li class="delivery" v-for="(delivery, index) in dataList" :key="index">
        <div class="checkbox" v-if="type === 1">
          <img
            v-if="delivery.id == addressId"
            src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png"
          />
          <img
            @click="selectAddress(delivery)"
            v-else
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_n.png"
          />
        </div>
        <div class="name-wrap">
          <div class="name">{{ delivery.deliveryName }}</div>
          <div class="phone">{{ delivery.deliveryPhone }}</div>
        </div>
        <div class="address">
          {{ delivery.provinceName || "" }}{{ delivery.cityName || ""
          }}{{ delivery.areaName || "" }}{{ delivery.address }}
        </div>
        <div class="btn-edit" v-if="type === 1" @click.stop="toEdit(delivery)">
          <img
            src="https://ggllstatic.hpgjzlinfo.com/static/images/address/icon-edit.png"
          />
        </div>
        <div class="delivery-fb" v-if="type !== 1" @tap.stop="">
          <img
            class="checkbox"
            v-if="delivery.isDefault"
            src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png"
          />
          <img
            class="checkbox"
            @click="setDefault(delivery)"
            v-else
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/select_n.png"
          />
          <div class="desc">默认地址</div>
          <div class="btn-wrap">
            <div class="btn-edit" @click.stop="toEdit(delivery)">
              <img
                class="icon-opr"
                src="https://ggllstatic.hpgjzlinfo.com/static/images/address/icon-edit.png"
              />编辑
            </div>
            <div class="btn-edit" @click.stop="toDelete(delivery)">
              <img
                class="icon-opr"
                src="https://ggllstatic.hpgjzlinfo.com/static/images/address/icon-delete.png"
              />删除
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="empty" v-if="empty">
      <img
        src="https://ggllstatic.hpgjzlinfo.com/static/images/common/empty.png"
      />
      暂无收货地址
      <div class="btn-home" @click="add">新建收货地址</div>
    </div>
    <button
      v-else
      type="button"
      class="btn-bottom-fixed"
      :class="{ isIphoneHair }"
      @click="add"
    >
      +添加新的收货地址
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isIphoneHair: App.isIphoneHair,
      dataList: [],
      pageLoad: false,
      empty: false,
      type: 2,
      addressId: "",
    };
  },
  components: {},
  methods: {
    async toDelete(delivery) {
      uni.showModal({
        title: "",
        content: "确定删除该地址?",
        success: async (res) => {
          if (!res.confirm) {
            return false;
          }
          uni.showLoading();
          const result = await Axios.post(
            "/address/delete",
            {
              id: delivery.id,
            },
            {
              headers: {
                "content-type": "application/json;charset=utf-8",
              },
            }
          );
          uni.hideLoading();
          if (result.code == 200) {
            this.$uni.showToast("删除成功");
            this.loadData();
          } else {
            this.$uni.showToast(result.msg);
          }
        },
      });
    },
    toEdit(address) {
      uni.navigateTo({
        url: `/sub-pages/me/address-add/main?address=${JSON.stringify(
          address
        )}`,
      });
    },
    add() {
      uni.navigateTo({
        url: `/sub-pages/me/address-add/main?type=${this.type == 1 ? 3 : 1}`,
      });
    },
    async setDefault(address) {
      if (address.isDefault == 1) {
        return false;
      }
      uni.showLoading("正在提交...");
      const result = await Axios.post(
        "/address/setDefault",
        {
          id: address.id,
        },
        {
          headers: {
            "content-type": "application/json;charset=utf-8",
          },
        }
      );
      uni.hideLoading();
      if (result.code == 200) {
        this.$uni.showToast(result.msg || "设置成功");
        this.dataList.forEach((data) => {
          if (data.isDefault == 1) {
            data.isDefault = 0;
          }
        });
        address.isDefault = 1;
      } else {
        this.$uni.showToast(result.msg || "设置失败");
      }
    },
    async selectAddress(address) {
      Store.commit(VUEX.CHECKOUT.SET_ADDRESS, address.id);
      Store.dispatch("getCheckoutData", true);
      uni.navigateBack();
    },
    async remove(address) {
      const result = await uni.showModal({
        title: "",
        content: "确定要删除?",
        confirmColor: "#FB4769",
      });
      if (result.confirm) {
        uni.showLoading({ title: "正在提交...", mask: true });
        const delResult = await Axios.post("/address/delete", {
          id: address.id,
        });
        uni.hideLoading();
        if (delResult.code == 200) {
          uni.showToast({
            title: delResult.msg || "删除成功",
            icon: "none",
          });
          setTimeout(
            function () {
              this.loadData();
            }.bind(this),
            1000
          );
        } else {
          uni.showToast({
            title: delResult.msg || "删除失败",
            icon: "none",
          });
        }
      }
    },
    async loadData() {
      uni.showLoading();
      this.loading = true;
      const result = await Axios.get("/address/list");
      uni.hideLoading();
      if (result.code == 200) {
        this.dataList = result.data || [];
        this.empty = !this.dataList.length;
      } else {
        uni.showToast(result.msg);
      }
      this.loading = false;
    },
  },
  async onShow() {
    if (!Store.getters.isLogin) {
      await Store.dispatch("login");
    }
    await this.loadData();
  },
  async mounted() {
    this.type = parseInt(this.$scope.options.type || 0);
    this.addressId =
      this.$scope.options.addressId || Store.state.checkout.addressId;
    if (this.type === 1) {
      uni.setNavigationBarTitle({
        title: "选择地址",
      });
    }
  },
};
</script>

<style lang="scss">
.page-address-list {
  padding-bottom: rpx(150);
  background-color: #f7f7f7;
  min-height: 100vh;
  .delivery-list {
    .delivery {
      position: relative;
      margin-bottom: rpx(20);
      padding-right: 64rpx;
      padding: rpx(30) rpx(30) 0;
      background-color: #fff;
      .name-wrap {
        position: relative;
        display: flex;
        align-items: center;
        font-size: rpx(36);
        font-weight: bold;
        color: $color-black;
        .name {
          max-width: rpx(300);
          @include ellipsis();
        }

        .phone {
          margin-left: rpx(50);
        }
      }

      .address {
        padding-top: rpx(30);
        font-size: rpx(36);
        color: $color-black;
        @include multi-ellipsis();
      }

      .delivery-fb {
        position: relative;
        display: flex;
        align-items: center;
        margin-top: rpx(30);
        height: rpx(80);
        line-height: rpx(80);
        border-top: rpx(1) solid #d8d8d8;

        .checkbox {
          width: 35rpx;
          height: 35rpx;
        }

        .desc {
          margin-left: rpx(20);
          font-size: rpx(26);
          color: $color-black;
        }

        .btn-wrap {
          display: flex;
          align-items: center;
          @include middle-center-y();
          right: 0;

          .btn-edit {
            display: flex;
            align-items: center;
            font-size: rpx(26);
            color: $color-black;
            margin-left: rpx(50);
            width: rpx(30);
            height: rpx(30);

            .icon-opr {
              margin-right: rpx(15);
              width: rpx(30);
              height: rpx(30);
            }
          }
        }
      }
      .checkbox {
        width: 35rpx;
        height: 35rpx;
      }
    }
  }
  &.select {
    background-color: #fff;
    .delivery-list {
      padding-left: rpx(30);
      .delivery {
        position: relative;
        padding-right: 64rpx;
        padding-left: rpx(62);
        margin-bottom: 0;
        padding-bottom: rpx(30);
        border-bottom: rpx(1) solid #d8d8d8;
        .checkbox {
          @include middle-center-y();
          left: 0;
          .img {
            width: 35rpx;
            height: 35rpx;
          }
        }
        .btn-edit {
          @include middle-center-y();
          right: rpx(30);
          width: rpx(30);
          height: rpx(30);
          .img {
            width: rpx(30);
            height: rpx(30);
          }
        }
      }
    }
  }
  .empty-wrap {
    font-size: rpx(26);
    text-align: center;
    padding-top: rpx(330);
    .img {
      display: block;
      width: rpx(210);
      height: rpx(172);
      margin: 0 auto rpx(30);
    }
  }
}
</style>
