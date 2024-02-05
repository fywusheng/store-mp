<template>
  <view class="index supportName">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar title="赡养扶养关系" :alpha="1" />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar title="赡养扶养关系" :alpha="1" :shows-back-button="true" />
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="tab-bar">
      <tab-bar
        :tabs="tabs"
        :initialIndex="selectedIndex"
        @change="handleTabChange"
      />
    </view>

    <view class="blank" style="height: 136rpx" />
    <view v-if="list.length > 0" class="list">
      <view
        v-for="(item, index) in list"
        class="item flex-v br-8 m-32"
        :key="index"
      >
        <text class="name fs-44 fw-500 c-black">{{ item.supportName }}</text>
        <view class="info mt-36 pb-16">
          <view class="row flex-h">
            <text class="fs-36 c-lightgrey">
              {{ selectedIndex === 0 ? "赡养" : "扶养" }}关系：
            </text>
            <text class="fs-36 c-black">{{ item.supRelName }}</text>
          </view>
          <view class="row flex-h">
            <text class="fs-36 c-lightgrey">身份证号：</text>
            <text class="fs-36 c-black">{{
              idCardNumberFilter(item.idCard)
            }}</text>
          </view>
          <view class="row flex-h">
            <text class="fs-36 c-lightgrey">联系电话：</text>
            <text class="fs-36 c-black">{{ phoneFilter(item.phone) }}</text>
          </view>
        </view>
        <view class="actions flex-h flex-c-e">
          <button
            class="common-button fs-36 c-black ml-24"
            hover-class="none"
            @click="handleDeleteClick(item)"
          >
            删除
          </button>
          <button
            class="common-button fs-36 c-black ml-24"
            hover-class="none"
            @click="handleEditClick(index)"
          >
            编辑
          </button>
          <button
            v-if="item.isFamillyShip != '1'"
            class="bind-button fs-36 c-primary ml-24"
            hover-class="none"
            @click="handleBindClick(item)"
          >
            绑定亲情账号
          </button>
        </view>
        <image
          class="stamp"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/support/icon-support-stamp-1.png"
        />
      </view>
    </view>
    <view v-else class="no-data flex-v flex-c-s">
      <image
        class="icon"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/support/icon-support-no-data.png"
      />
      <text class="fs-36 c-grey mt-24">
        暂无{{ tabs[selectedIndex] }}信息
      </text>
      <image
        class="instruction"
        src="https://ggllstatic.hpgjzlinfo.com/static/support/image-support-instruction.png"
        mode="widthFix"
      />
    </view>
    <view class="blank" style="height: 200rpx" />
    <view class="footer bg-white">
      <button
        class="add-button fs-44 fw-500 c-white m-0-32"
        @click="handleAddClick"
      >
        添加{{ tabs[selectedIndex] }}
      </button>
    </view>
    <view
      class="credits-popup flex-v flex-c-c"
      v-if="showsCreditsPopup"
      @touchmove.stop="touchmove"
    >
      <image
        class="credits-image"
        mode="scaleToFill"
        @click="detailSupport"
        src="https://ggllstatic.hpgjzlinfo.com/static/support/image-common-credits2-100.png"
      />
      <image
        class="close-icon mt-32"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-popup-close.png"
        @click="showsCreditsPopup = false"
      />
    </view>
    <modal
      ref="popup"
      :cancelText="modal.cancelText"
      :confirmText="modal.confirmText"
      @cancel="cancel"
      @confirm="confirm"
    >
      <template v-slot:text>
        <view class="main" v-if="type === '1'">
          <text>您确定不添加赡养抚养关系吗？</text>
          <text class="warn">这将会影响您在本平台享有的权益和服务</text>
        </view>
        <view class="main" v-if="type === '2'">
          <text>您还可以绑定您的【亲情账号】，再拿100积分！</text>
          <text class="warn">积分可以兑换各种惠老服务哦</text>
        </view>
      </template>
    </modal>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import NavigationBar from "../../components/common/navigation-bar.vue";
import TabBar from "./components/tab-bar.vue";
import Modal from "@/components/common/modal.vue";
import { hidePhone, desensitizeInfo } from "@/utils/desensitization.js";
export default {
  components: { NavigationBar, TabBar, Modal },
  data() {
    return {
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 所有 tab 信息
      tabs: ["赡养人", "扶养人"],
      // tab bar 选中的下标
      selectedIndex: 0,
      // 赡养人列表
      list1: [],
      // 扶养人列表
      list2: [],
      // 是否显示积分弹窗
      showsCreditsPopup: false,

      list: [],
      // 自定义弹框内容
      modal: {
        cancelText: "放弃添加",
        confirmText: "立即添加",
      },
      // 赡养抚养'1'和亲情'2'
      type: "1",
    };
  },
  computed: {
    // list() {
    //   console.log('[this.list1, this.list2]:', [this.list1, this.list2])
    //   return [this.list1, this.list2][this.selectedIndex]
    // },
  },
  onLoad() {
    uni.$on("didAddSupport", this.handleAddSupport);

    // this.findUserSupport(this.selectedIndex)
  },
  methods: {
    // 手机号码脱敏
    phoneFilter(value) {
      return hidePhone(value);
    },
    // 身份证号过滤器, 用于身份证号脱敏
    idCardNumberFilter(value) {
      return desensitizeInfo(value);
    },
    detailSupport() {
      uni.navigateTo({ url: "/pages/user-center/my-points" });
    },
    /**
     * 获取赡养抚养列表
     */
    findUserSupport(type) {
      const data = {
        relationType: type,
      };
      api.findUserSupport({
        data,
        success: (res) => {
          console.log("赡养抚养列表:", res);
          this.list = [];
          if (type === 1 && res && res.length > 0) {
            this.list = res;
            // this.list2 = []
            this.list2 = res;
          } else if (type === 0 && res && res.length > 0) {
            this.list = res;
            // this.list1 = []
            this.list1 = res;
          }
          console.log("this.list:", this.list);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },

    touchmove() {},
    /**
     * 添加成功回调
     */
    handleAddSupport(data) {
      // 首次添加显示积分弹窗, 2s 后消失
      // 是否领取到赡养抚养积分( '0' 不是 '1'是)
      if (data === "1") {
        const userInfo = uni.getStorageSync("userInfo");
        api.checkLogOutUser({
          data: { uactId: userInfo.uactId },
          success: (data) => {
            console.log("===是否注销过---", data);
            if (!data) {
              this.showsCreditsPopup = true;
            }
          },
        });
        setTimeout(() => {
          this.showsCreditsPopup = false;
        }, 2000);
      }
      this.findUserSupport(this.selectedIndex);
    },
    /**
     * 自定义导航栏返回点击事件
     */
    handleNavigationBack() {
      api.findUserIsAddSup({
        data: {
          selectType: "0",
        },
        success: (res) => {
          // 已添加过返回true ,未添加返回false
          console.log("是否已添加过赡养:", res);
          if (!res) {
            this.type = "1";
            this.modal = {
              cancelText: "放弃添加",
              confirmText: "立即添加",
            };
            this.$refs.popup.open();
          } else {
            api.findUserIsAddSup({
              data: {
                selectType: "1",
              },
              success: (resp) => {
                // 如果未添加过亲情账号, 到添加页面
                // uni.redirectTo({
                //   url: '/pages/family-account/select-type',
                // })
                // 已添加过返回true ,未添加返回false
                console.log("是否已添加过亲情:", resp);
                if (!resp) {
                  this.type = "2";
                  this.modal = {
                    cancelText: "放弃绑定",
                    confirmText: "立即绑定",
                  };
                  this.$refs.popup.open();
                } else {
                  uni.navigateBack();
                }
              },
            });
          }
        },
      });
    },
    // 点击立即添加
    confirm(msg) {
      this.$refs.popup.close();
      if (this.type === "2") {
        uni.navigateTo({
          url: "/pages/family-account/select-type",
        });
      }
    },
    // 点击放弃添加 TODO test
    cancel(msg) {
      this.$refs.popup.close();
      uni.navigateBack();
      // uni.redirectTo({
      //      url: '/pages/family-account/add?type=0'
      //   });
      console.log("---放弃添加---");
    },
    /**
     * tab bar 点击回调
     */
    handleTabChange(index) {
      this.selectedIndex = index;
      // 获取赡养抚养列表
      this.findUserSupport(index);
    },
    /**
     * 删除点击事件
     */
    handleDeleteClick(item) {
      this.$uni.showConfirm({
        content: "是否删除该条赡养扶养关系",
        confirm: () => {
          const data = {
            supportId: item.supportId,
            supportName: item.supportName,
            idCard: item.idCard,
            phone: item.phone,
            supType: item.supType,
            relationId: item.relationId,
            supRelName: item.supRelName,
            dataStas: "1",
          };
          api.addUserSupport({
            data,
            success: (res) => {
              console.log("删除成功:", res);
              this.findUserSupport(this.selectedIndex);
            },
            fail: (err) => {
              console.log("删除失败：", err);
              this.$uni.showToast(err.message);
            },
          });
        },
      });
    },
    /**
     * 编辑点击事件
     */
    handleEditClick(index) {
      console.log(index);
      const list =
        this.selectedIndex === 0 ? this.list1[index] : this.list2[index];
      const info = encodeURIComponent(JSON.stringify(list));
      uni.navigateTo({
        url: "/pages/support/add?index=" + this.selectedIndex + "&info=" + info,
        success: (res) => {
          res.eventChannel.emit("didOpenPageFinish", {
            index: this.selectedIndex,
            info:
              this.selectedIndex === 0 ? this.list1[index] : this.list2[index],
          });
        },
      });
    },
    /**
     * 绑定亲情账号点击事件
     */
    handleBindClick(item) {
      api.addFamilyInfoByTel({
        data: {
          regChnl: "miniprogram",
          supList: [
            {
              supportName: item.supportName,
              idCard: item.idCard,
              phone: item.phone,
              supRelName: item.supRelName,
              relationId: item.relationId,
              supType: item.supType,
            },
          ],
        },
        showsLoading: true,
        success: (res) => {
          uni.hideLoading();
          if (res) {
            uni.navigateTo({
              url: "/pages/support/bind-success?names=" + item.supportName,
              complete: (res) => {
                console.log("res:", res);
              },
            });
          } else {
            // uni.showToast({
            //   title: ',
            //   duration: 2000
            // });
          }
        },
      });
      console.log(item);
    },
    /**
     * 添加点击事件
     */
    handleAddClick() {
      uni.navigateTo({
        url: "/pages/support/add?index=" + this.selectedIndex,
        success: (res) => {
          res.eventChannel.emit("didOpenPageFinish", {
            index: this.selectedIndex,
            info: {},
          });
          // #ifdef MP-ALIPAY
          // const params = {
          //   index: this.selectedIndex
          // }
          // uni.setStorageSync('relation_index', JSON.stringify(params))
          // #endif
        },
      });
    },
  },
  onShow() {},
};
</script>

<style lang="scss" scoped>
.index {
  height: 100vh;
  background-color: #fff;
  .tab-bar {
    position: fixed;
    width: 100vw;
    z-index: 999;
  }
  .list {
    .item {
      position: relative;
      padding: 20rpx 20rpx 0;
      box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.15);
      .info {
        border-bottom: 2rpx solid #eeeeee;
      }
      .actions {
        height: 106rpx;
        .common-button {
          @include size(160, 60);
          line-height: 60rpx;
          border-radius: 30rpx;
          border: 2rpx solid #999999;
          box-sizing: border-box;
        }
        .bind-button {
          @include size(278, 60);
          line-height: 60rpx;
          border-radius: 30rpx;
          border: 2rpx solid $color-primary;
          box-sizing: border-box;
        }
      }
      .stamp {
        @include size(168, 160);
        position: absolute;
        top: 16rpx;
        right: 0;
      }
    }
  }
  .no-data {
    padding-top: 120rpx;
    .icon {
      @include size(440, 234);
    }
    .instruction {
      margin-top: 114rpx;
      width: 100%;
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
  .credits-popup {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    .credits-image {
      @include size(604, 808);
    }
    .close-icon {
      @include square(72);
    }
  }
  .main {
    text-align: center;
    // width: 552rpx;
    font-size: 40rpx;
    margin: 0 54rpx;
    color: #333333;
    line-height: 50rpx;
    .warn {
      color: #ff5500;
    }
  }
}
</style>
