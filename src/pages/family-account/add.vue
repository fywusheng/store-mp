<template>
  <view class="add">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :title="'添加亲情账号'" title-color="#ffffff" />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar
      :title="'添加亲情账号'"
      title-color="#ffffff"
      back-button-style="white"
      :shows-back-button="true"
    />
    <!-- #endif -->
    <image
      class="background"
      mode="scaleToFill"
      src="https://ggllstatic.hpgjzlinfo.com/static/family-account/bg-support-bind-success.png"
    />
    <view class="blank" style="height: 430rpx" />
    <view class="card bg-white m-0-32 br-24">
      <!-- 有手机号绑定 -->
      <template v-if="hasPhoneNumber">
        <text class="title fs-40 fw-400 c-black">请选择您要绑定的亲友</text>
        <template v-if="canBind">
          <text class="fs-40 fw-400 c-black mt-36">赡养人</text>
          <view
            class="account flex-h mt-16 br-8"
            v-for="(item, index) in list1"
            :key="index"
          >
            <image
              class="state-icon"
              @click="changeList(1, index)"
              :src="item.checked === true ? checked : unChecked"
            />
            <view class="flex-v ml-55">
              <text class="name fs-44 fw-500 c-black mb-32">{{
                item.supportName
              }}</text>
              <view class="row flex-h">
                <text class="fs-36 c-lightgrey">赡养关系：</text>
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
            <image
              class="stamp"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-support-stamp-1.png"
            />
          </view>
          <view
            class="add-view p-32-0 flex-h flex-c-c"
            v-if="list1.length === 0"
          >
            <button
              class="add-button fs-36 c-primary"
              @click="jumpSupport"
              hover-class="none"
            >
              +添加赡养人
            </button>
          </view>
          <text class="fs-40 fw-400 c-black mt-36">扶养人</text>
          <view
            class="account flex-h mt-16 br-8"
            v-for="(item, index) in list2"
            :key="index"
          >
            <image
              class="state-icon"
              mode="scaleToFill"
              @click="changeList(2, index)"
              :src="item.checked === true ? checked : unChecked"
            />
            <view class="flex-v ml-12">
              <text class="name fs-44 fw-500 c-black mb-32">{{
                item.supportName
              }}</text>
              <view class="row flex-h">
                <text class="fs-36 c-lightgrey">扶养关系：</text>
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
            <image
              class="stamp"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-support-stamp-1.png"
            />
          </view>
          <view
            class="add-view p-32-0 flex-h flex-c-c"
            v-if="list2.length === 0"
          >
            <button
              class="add-button fs-36 c-primary"
              @click="jumpSupport"
              hover-class="none"
            >
              +添加扶养人
            </button>
          </view>
        </template>
        <view class="flex-v flex-c-c m-80-0" v-else>
          <view class="tips fs-36 c-black">
            您还没有添加赡养扶养关系，添加后才可绑定亲友
          </view>
          <view
            class="add-button fs-36 c-primary mt-32"
            @click="jumpSupport"
            hover-class="none"
          >
            添加赡养扶养关系
          </view>
        </view>
      </template>
      <template v-else>
        <text class="title fs-40 fw-400 c-black mb-64">确认亲友身份信息</text>
        <view class="row unphone flex-h flex-c-s">
          <text class="title fs-40 fw-400 c-black">姓名</text>
          <input
            class="flex-1 fs-40 c-black"
            placeholder="请输入姓名"
            placeholder-class="placeholder"
            v-model="params.name"
          />
        </view>
        <view class="row unphone flex-h flex-c-s">
          <text class="title fs-40 fw-400 c-black">身份证号</text>
          <input
            class="flex-1 fs-40 c-black"
            placeholder="请输入身份证号"
            placeholder-class="placeholder"
            type="idcard"
            maxlength="18"
            v-model="params.idCardNumber"
          />
        </view>
        <view class="row unphone flex-h flex-c-s">
          <text class="title fs-40 fw-400 c-black">选择关系</text>
          <picker
            class="flex-1"
            :range="relations"
            :value="tenantIndex"
            :range-key="'relationName'"
            @change="handleRelationChange"
          >
            <text
              class="fs-40"
              :class="params.relation ? 'c-black' : 'c-lightgrey'"
            >
              {{ params.relation || "请选择亲友关系" }}
            </text>
          </picker>
          <image
            class="accessory"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
        <button
          class="next-step-button fs-44 fw-500 c-white mt-48"
          @click="handleNextStepClick"
        >
          下一步
        </button>
      </template>
    </view>
    <!-- 无手机号绑定 -->
    <template v-if="hasPhoneNumber">
      <view class="blank" style="height: 200rpx" />
      <view class="footer bg-white">
        <button
          class="add-button fs-44 fw-500 c-white m-0-32"
          @click="handleBindClick"
        >
          绑定
        </button>
      </view>
    </template>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import NavigationBar from "../../components/common/navigation-bar.vue";
import { validateIDCardNumber } from "@/utils/validation.js";
import { startFacialRecognitionVerify } from "@/utils/utils.js";
import { hidePhone, desensitizeInfo } from "@/utils/desensitization.js";
import { showLoading, hideLoading, showToast } from "@/utils/uni";
import staticData from "@/utils/dataBase64.js";
import { debounce } from "@/utils/utils.js";
export default {
  components: { NavigationBar },
  data() {
    return {
      // 被绑定人是否有手机号
      hasPhoneNumber: false,
      // 是否绑定过赡养抚养
      canBind: false,
      // 赡养人列表
      list1: [],
      // 扶养人列表
      list2: [],
      // 关系列表
      relations: [],
      // 表单数据
      params: {
        name: "",
        idCardNumber: "",
        // 关系名称
        relation: "",
      },
      // 选择亲情关系的下标
      tenantIndex: -1,
      // 未选择
      unChecked:
        "https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-unselect.png",
      // 已选择
      checked:
        "https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-selected.png",
    };
  },
  onLoad(options) {
    console.log("头像", options);

    this.hasPhoneNumber = true;
    // 是否添加过赡养抚养
    this.findUserIsAddSup();
    // 获取赡养抚养列表
    this.findFamilyUser();

    // 被绑定人是否有手机号
    // if (options.type === '1') {
    //   this.hasPhoneNumber = false
    // } else if (options.type === '0') {
    //   this.hasPhoneNumber = true
    //   // 是否添加过赡养抚养
    //   this.findUserIsAddSup()
    //   // 获取赡养抚养列表
    //   this.findFamilyUser()
    // }

    // (01-我赡养的 02-赡养我的 11-我抚养的 12-抚养我的 ,不穿是全部)
    this.relationListByParam();
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
    /**
     * 更改选中状态
     */
    changeList(list, index) {
      if (list === 1) {
        this.list1[index].checked = !this.list1[index].checked;
      } else {
        this.list2[index].checked = !this.list2[index].checked;
      }
      console.log("list2:", this.list2);
    },
    /**
     * 绑定点击事件
     */
    handleBindClick() {
      const arr = [];
      let names = "";
      this.list1.map((item, index) => {
        if (item.checked) {
          arr.push({
            supportName: item.supportName,
            idCard: item.idCard,
            phone: item.phone,
            relationId: item.relationId,
            supRelName: item.supRelName,
            supType: item.supType,
          });
          names = names ? names + "," + item.supportName : item.supportName;
        }
      });
      this.list2.map((item, index) => {
        if (item.checked) {
          arr.push({
            supportName: item.supportName,
            idCard: item.idCard,
            phone: item.phone,
            relationId: item.relationId,
            supRelName: item.supRelName,
            supType: item.supType,
          });
          names = names ? names + "," + item.supportName : item.supportName;
        }
      });
      if (this.canBind && this.list1.length === 0 && this.list2.length === 0) {
        showToast("暂无可绑定对象");
        return;
      } else if (
        (this.list1.length !== 0 || this.list2.length !== 0) &&
        arr.length === 0
      ) {
        showToast("请选择要绑定的亲友");
        return;
      } else if (arr.length > 0) {
        const data = {
          regChnl: "wechat",
          supList: arr,
        };
        api.addFamilyInfoByTel({
          data,
          showsLoading: true,
          success: (res) => {
            if (res) {
              const info = JSON.stringify({
                names: names,
              });
              // 有手机号（赡养抚养）需要短信确认
              // #ifdef MP-WEIXIN
              uni.reLaunch({
                url: "/pages/family-account/add-success?info=" + info,
              });
              // #endif
              // #ifdef MP-ALIPAY
              uni.reLaunch({
                url: "/pages/family-account/add-success?info=" + info,
              });
              // #endif
            }
          },
        });
      }
    },
    /**
     * 关系列表选择回调
     */
    handleRelationChange(e) {
      this.tenantIndex = e.detail.value;
      this.params.relation = this.relations[e.detail.value]["relationName"];
      // this.params.relation = this.relations[e.detail.value]['relationName'];
    },
    /**
     * 根据条件获取所有亲情关系：关系类型 (01-我赡养的 02-赡养我的 11-我抚养的 12-抚养我的),
     */
    relationListByParam() {
      const data = {};
      const self = this;
      api.relationListByParam({
        data,
        success: (res) => {
          this.relations = res;
        },
      });
    },
    /**
     * 是否已添加过赡养
     */
    findUserIsAddSup() {
      const data = {
        selectType: "0",
      };
      api.findUserIsAddSup({
        data,
        success: (res) => {
          this.canBind = res;
        },
      });
    },
    /**
     * 赡养抚养人列表
     */
    findFamilyUser() {
      const data = {};
      const self = this;
      api.findFamilyUser({
        data,
        success: (res) => {
          this.list1 = res.supList.map((item, index) => {
            return Object.assign(item, { checked: false });
          });
          this.list2 = res.rearList.map((item, index) => {
            return Object.assign(item, { checked: false });
          });
          // if( this.list1.length === 0 &&  this.list2.length === 0 ){
          //   this.canBind = false
          // }else{
          //   this.canBind = true
          // }
          console.log("赡养抚养人列表list1:", this.list1);
          console.log("赡养抚养人列表list2:", this.list2);
          console.log("赡养抚养人列表list2:", this.list2);
        },
      });
    },

    /**
     * 下一步点击事件
     */
    handleNextStepClick: debounce(function () {
      if (!this.checkInput()) return;
      const params = {
        name: this.params.name,
        idCard: this.params.idCardNumber,
        returnUrl: "",
      };

      // 人脸识别成功
      params.success = (getbase64) => {
        console.log("人脸识别成功：");
        const userInfo = uni.getStorageSync("userInfo");
        // #ifdef MP-WEIXIN
        api.addIdCardFamily({
          data: {
            data: {
              faceImg: "", // TODO  添加亲情账号人脸识别照片提供--微信暂无
              fromUactId: userInfo.uactId,
              fromName: userInfo.psnName,
              toName: this.params.name,
              idCard: this.params.idCardNumber,
              regChnl: "miniprogram",
              relationId: this.relations[this.tenantIndex].relationId,
              relationCertWay: "00", // 固定写法
              supType: this.relations[this.tenantIndex].supType,
            },
          },
          showsLoading: true,
          success: (resp) => {
            api.getCertificateState({
              data: {
                appId: "53928a083adb4a7dad2eecf05564873f",
                idType: "身份证",
                userName: this.params.name,
                idNo: this.params.idCardNumber,
              },
              showsLoading: true,
              success: (data) => {
                const authState = data.authState;
                // 判断卡状态
                if (
                  authState === "1" ||
                  authState === "2" ||
                  authState === "4" ||
                  authState === "6"
                ) {
                  // 直接绑定成功，可以帮忙领证
                  console.log("绑定成功:无手机号");
                  const info = JSON.stringify({
                    name: this.params.name,
                    uactId: resp.uactId,
                    isReceive: "1",
                    isItgl: resp.isItgl,
                    idCard: this.params.idCardNumber,
                  });

                  // #ifdef MP-WEIXIN
                  uni.reLaunch({
                    url: "/pages/family-account/add-success?info=" + info,
                  });
                  // #endif
                  // #ifdef MP-ALIPAY
                  uni.reLaunch({
                    url: "/pages/family-account/add-success?info=" + info,
                  });
                  // #endif
                } else if (authState === "3" || authState === "5") {
                  // 直接绑定成功，可以帮忙领证
                  console.log("绑定成功:无手机号");
                  const info = JSON.stringify({
                    name: this.params.name,
                    uactId: resp.uactId,
                    isReceive: "0",
                    isItgl: resp.isItgl,
                    idCard: this.params.idCardNumber,
                  });

                  // #ifdef MP-WEIXIN
                  uni.reLaunch({
                    url: "/pages/family-account/add-success?info=" + info,
                  });
                  // #endif
                  // #ifdef MP-ALIPAY
                  uni.reLaunch({
                    url: "/pages/family-account/add-success?info=" + info,
                  });
                  // #endif
                }
              },
            });
          },
        });
        // uni.getFileSystemManager().readFile({
        //   filePath: require('./static/05f08ce3a4c8ce77b5c0af61c35619c.jpg'),
        //   encoding: 'base64',
        //   success: (res) => {

        //   },
        // })
        // #endif

        // 备注：支付宝只能给自己人脸识别认证，不能给三方人人脸认证
        // #ifdef MP-ALIPAY
        console.log("==alipay--", getbase64);
        api.addIdCardFamily({
          data: {
            data: {
              faceImg: getbase64, // 后期替换
              fromUactId: userInfo.uactId,
              fromName: userInfo.psnName,
              toName: this.params.name,
              idCard: this.params.idCardNumber,
              regChnl: "miniprogram",
              relationId: this.relations[this.tenantIndex].relationId,
              relationCertWay: "00", // 固定写法
              supType: this.relations[this.tenantIndex].supType,
            },
          },
          showsLoading: true,
          success: (resp) => {
            // 直接绑定成功，可以帮忙领证
            console.log("绑定成功:无手机号");
            const info = JSON.stringify({
              name: this.params.name,
              uactId: resp.uactId,
              isReceive: resp.isReceive,
              isItgl: resp.isItgl,
              idCard: this.params.idCardNumber,
            });

            uni.reLaunch({
              url: "/pages/family-account/add-success?info=" + info,
            });
          },
        });
        // #endif
      };

      // 开启人脸识别
      startFacialRecognitionVerify(params);
      // this.$uni.showConfirm({
      //   title: '提示',
      //   content: `请 ${this.params.name} 进行人脸认证`,
      //   confirm: () => {
      //     const url = `http://120.42.37.86:10013/#/?psnName=${this.params.name}&idCard=${this.params.idCardNumber}&url=/pages/common/face-recognition-result&platform=miniProgram`
      //     console.log(url)
      //     uni.navigateTo({
      //       url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      //     })
      //   },
      // })

      // wx.startFacialRecognitionVerify({
      //   name: this.params.name, // 姓名
      //   idCardNumber: this.params.idCardNumber, // 身份证号码
      //   // checkAliveType: "", 人脸核验的交互方式，默认读数字（见表1）
      //   success: (data) => {
      //     console.log(data, 'sucess')
      //     // errCode为0时表示人脸通过完成
      //     if (data.errCode == 0) {

      //     }
      //   },
      //   fail: (err) => {
      //     console.log(err, 'err')
      //   },
      // })
    }, 200),
    /**
     * 设置关系列表
     */
    setRelations() {
      this.relations = [
        "父母",
        "养父母",
        "继父母",
        "祖父母",
        "外祖父母",
        "婚/非婚生子女",
        "养子女",
        "继子女",
        "孙子女",
        "外孙子女",
        "亲属",
        "街坊邻居",
        "其他",
      ];
    },
    /**
     * 亲友账号是否选中的图标路径
     */
    getStateIconURL(index) {
      return "https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-unselect.png";
    },
    /**
     * 亲友账号是否选中的图标路径
     */
    jumpSupport() {
      uni.navigateTo({
        url: "/pages/support/index",
      });
    },
    /**
     * 输入校验
     */
    checkInput() {
      if (!this.params.name) {
        this.$uni.showToast("请输入姓名");
        return false;
      }
      if (!/^[\u4E00-\u9FA5]+$/.test(this.params.name)) {
        this.$uni.showToast("请输入真实姓名");
        return false;
      }
      if (!this.params.idCardNumber) {
        this.$uni.showToast("请输入身份证号");
        return false;
      }
      if (!validateIDCardNumber(this.params.idCardNumber)) {
        this.$uni.showToast("身份证号码格式不正确");
        return false;
      }
      if (!this.params.relation) {
        this.$uni.showToast("请选择与被绑定人关系");
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.add {
  .background {
    @include size(750, 676);
    position: absolute;
    top: 0;
  }
  .card {
    position: relative;
    padding: 50rpx 32rpx;
    text {
      display: block;
    }
    .account {
      position: relative;
      padding: 28rpx 20rpx;
      border: 2rpx solid $color-primary;
      .state-icon {
        position: absolute;
        @include square(48);
      }
      .ml-55 {
        margin-left: 55rpx;
      }
      .name {
        line-height: 48rpx;
      }
      .stamp {
        @include size(168, 160);
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .add-view {
      width: 100%;
      background: #f9f9f9;
      border-radius: 8rpx;
      margin-top: 16rpx;
    }
    .add-button {
      padding: 0 24rpx;
      height: 56rpx;
      line-height: 56rpx;
      border-radius: 28rpx;
      border: 2rpx solid $color-primary;
    }
    .tips {
      max-width: 484rpx;
      text-align: center;
    }
    .row {
      height: 50rpx;
      line-height: 50rpx;
      // display: flex;
      // align-items: center;
      &.unphone {
        height: 100rpx;
        line-height: 100rpx;
        border-bottom: 2rpx solid #ebedf0;
        .c-lightgrey {
          width: 300rpx;
        }
      }
      .title {
        width: 200rpx;
      }
      .c-lightgrey {
        width: 188rpx;
      }
      .accessory {
        @include square(48);
        transform: rotate(90deg);
      }
    }
    .next-step-button {
      width: 622rpx;
      height: 108rpx;
      line-height: 108rpx;
      border-radius: 54rpx;
      background: linear-gradient(to right, $color-secondary, $color-primary);
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
