<template>
  <view class="index">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar
      title="亲情账号"
      title-color="#ffffff"
      :alpha="1"
      background-color="linear-gradient(to right, #ff8800, #ff5000)"
    />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar
      title="亲情账号"
      title-color="#ffffff"
      background-color="linear-gradient(to right, #ff8800, #ff5000)"
      back-button-style="white"
      :alpha="1"
      :shows-back-button="true"
    />
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <!-- 亲情列表 -->
    <view class="list flex-h">
      <view
        class="item flex-v flex-c-s"
        v-for="(item, index) in list"
        :key="index"
        @click="changeFamily(index)"
      >
        <view class="img-box flex-h">
          <image
            class="avatar animated"
            src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-young-man2x.png"
            mode="scaleToFill"
            :class="{ 'avatar--selected': index === selectedAccountIndex }"
          />
        </view>
        <text class="relation fs-32 c-black br-4">{{
          item.relationRemark
        }}</text>
        <text class="name fs-36 c-white">
          {{ item.userName }}
        </text>
        <image
          v-if="index === selectedAccountIndex"
          class="triangle"
          src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-triangle2x.png"
          mode="scaleToFill"
        />
      </view>
      <!-- <view v-if="list.length=== 0" class="item flex-v flex-c-s" @click="handleAddIconClick">
        <image
          class="avatar"
          src="@/pages/family-account/static/icon-family-account-add.png"
        />
        <text class="name fs-36 c-white mt-12"></text>
      </view> -->
    </view>
    <view class="list-bottom"></view>

    <!-- 亮证，扫一扫，二维码 -->
    <view class="card br-16 flex-v">
      <!-- <image
        class="card-background"
        src="@/pages/family-account/static/bg-family-account-card.png"
      /> -->
      <template v-if="hasBinded">
        <view class="tab-bar flex-h flex-c-c">
          <text
            class="tab flex-1 fs-48 animated"
            :class="selectedTabIndex === 0 ? 'c-primary' : ''"
            @click="handleTabClick(0)"
          >
            亮证
          </text>
          <text
            class="tab flex-1 fs-48 animated"
            :class="selectedTabIndex === 1 ? 'c-primary' : ''"
            @click="handleTabClick(1)"
          >
            扫一扫
          </text>
          <text
            class="tab flex-1 fs-48 animated"
            :class="selectedTabIndex === 2 ? 'c-primary' : ''"
            @click="handleTabClick(2)"
          >
            老年码
          </text>
          <view
            class="tab-background br-36 bg-white animated"
            :class="tabBackgroundClass"
          />
        </view>

        <view
          class="electronic-certificate flex-v flex-c-c flex-1"
          v-if="selectedTabIndex === 0"
        >
          <!-- 已领卡 -->
          <view v-if="haveCard" class="oldcard">
            <view class="certificate-card">
              <image
                class="bg"
                mode="scaleToFill"
                src="https://ggllstatic.hpgjzlinfo.com/static/family-account/family-bg2x.png"
              />
              <view class="top flex-h flex-c-c">
                <image
                  class="emblem"
                  src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-emblem2x.png"
                  mode="scaleToFill"
                />
                <text class="title">中华人民共和国老年人证</text>
              </view>
              <view class="main flex-h">
                <view class="main-l flex-1">
                  <view class="main-l-item flex-h flex-c-s">
                    <view class="main-l-item-l">姓 名</view>
                    <view class="main-l-item-r">{{ info.name }}</view>
                  </view>
                  <view class="main-l-item flex-h flex-c-s">
                    <view class="main-l-item-l">出生日期</view>
                    <view class="main-l-item-r">{{
                      dateFilter(info.birthday)
                    }}</view>
                  </view>
                  <view class="main-l-item flex-h flex-c-s">
                    <view class="main-l-item-l">公民身份号码</view>
                    <view class="main-l-item-r">{{ info.psnNo }}</view>
                  </view>
                </view>
                <view class="main-r flex-1">
                  <view class="main-r-item flex-h flex-c-s">
                    <view class="main-r-item-l">性别</view>
                    <view class="main-r-item-r">{{ info.sex }}</view>
                  </view>
                  <view class="main-r-item flex-h flex-c-s">
                    <view class="main-r-item-l">血型</view>
                    <view class="main-r-item-r">{{ info.blood }}</view>
                  </view>
                </view>
                <image class="header" :src="avatar" mode="scaleToFill" />
              </view>
              <view class="main-bt flex-h flex-c-s">
                <view class="main-bt-left">居住地址</view>
                <view class="main-bt-right">
                  {{ info.residentialAddress }}</view
                >
              </view>
              <view class="number flex-h flex-c-e">
                <view class="number-text flex-h flex-c-b">
                  <text>编号</text>
                  <text class="num">{{ cardNumber }}</text>
                </view>
              </view>
            </view>

            <view class="certificate-card mt-24">
              <image
                class="bg"
                mode="scaleToFill"
                src="https://ggllstatic.hpgjzlinfo.com/static/family-account/family-bg2x.png"
              />
              <view class="main flex-h">
                <view class="main-l flex-1">
                  <view class="main-l-item flex-h flex-c-s">
                    <view class="main-l-item-l">紧急联系人</view>
                    <view class="main-l-item-r">
                      {{ info.emergencyContact }}</view
                    >
                  </view>
                  <view class="main-l-item flex-h flex-c-s">
                    <view class="main-l-item-l">联系电话</view>
                    <view class="main-l-item-r">{{ info.emergencyPhone }}</view>
                  </view>
                  <view class="main-l-item flex-h flex-c-s">
                    <view class="main-l-item-l">备 注</view>
                    <view class="main-l-item-r">{{ info.memo }}</view>
                  </view>
                </view>
              </view>
              <view class="main flex-h lastmain">
                <canvas
                  canvas-id="qr-code-copy"
                  id="qr-code-copy"
                  class="qr-code"
                />

                <view class="main-l flex-1"> </view>
                <view class="main-r">
                  <view class="main-r-item flex-h flex-c-s">
                    <view class="main-r-item-l">发证机关</view>
                    <view class="main-r-item-r">{{
                      info.licenceAuthority
                    }}</view>
                  </view>
                  <view class="main-r-item flex-h flex-c-s">
                    <view class="main-r-item-l">发证日期</view>
                    <view class="main-r-item-r">{{
                      dateFilter(info.licenceDate)
                    }}</view>
                  </view>
                </view>
              </view>
              <view class="made flex-h flex-c-e">
                <view class="made-text flex-h flex-c-b">
                  <text>中国老龄协会老年人才信息中心</text>
                  <text>制</text>
                </view>
              </view>
            </view>
          </view>
          <!-- 未领卡 -->
          <view
            v-if="!haveCard && authState == 3"
            class="nocard flex-v flex-c-c"
          >
            <image
              class="img"
              src="https://ggllstatic.hpgjzlinfo.com/static/family-account/no-card2x.png"
              mode="scaleToFill"
            />
            <view class="text">领取电子证照老年人证后可以使用更多功能</view>
            <view class="btn-box flex-h flex-c-c">
              <button
                class="add-button fs-40 c-white"
                @click="handleAddButtonClick"
              >
                立即领取
              </button>
            </view>
          </view>
          <view
            v-if="!haveCard && authState == 4"
            class="nocard flex-v flex-c-c"
          >
            <image
              class="img-card"
              src="https://ggllstatic.hpgjzlinfo.com/static/family-account/card-check.png"
              mode="scaleToFill"
            />
            <view class="fail-reason">
              <view class="flex-h flex-s-s mb-12 c-333"
                >您的电子老年人证正在审核中</view
              >
              <view class="flex-h flex-s-s">
                <view class="label c-666">申领时间:</view>
                <view class="c-333" v-if="submitTime">{{
                  dateFilter(submitTime)
                }}</view>
              </view>
            </view>
          </view>
          <view
            v-if="!haveCard && authState == 5"
            class="nocard failcard flex-v flex-c-c"
          >
            <image
              class="img-card"
              src="https://ggllstatic.hpgjzlinfo.com/static/family-account/card-fail.png"
              mode="scaleToFill"
            />
            <view class="fail-reason check-reason">
              <view class="flex-h flex-s-s mb-8">
                <view class="label c-666">申领时间:</view>
                <view class="c-333" v-if="submitTime">{{
                  dateFilter(submitTime)
                }}</view>
              </view>
              <view class="flex-h flex-s-s">
                <view class="label c-666">失败原因:</view>
                <view class="c-333">证件照未通过，请重新拍照并申请</view>
              </view>
            </view>
            <view class="btn-box flex-h mt-92 flex-c-c">
              <button
                class="add-button fs-40 c-white"
                @click="handleAddButtonClick"
              >
                立即领取
              </button>
            </view>
          </view>
          <view
            v-if="!haveCard && authState == 6"
            class="have-card flex-v flex-c-c"
          >
            <image
              class="img-card"
              src="https://ggllstatic.hpgjzlinfo.com/static/family-account/card-have.png"
              mode="scaleToFill"
            />
            <view class="btn-box mt-60 mb-32">
              <button
                class="agree-button fs-40 fw-bold c-white"
                @click="handleAgreeClick"
              >
                同意协议并授权
              </button>
            </view>
            <view class="arguments">
              查看<text class="c-blue" @click="handleUserAgreementClick(2)"
                >《用户授权协议》</text
              >
              <!-- <text class="c-blue">《电子老年人证用户协议》</text> -->
              <text class="c-blue" @click="handleUserAgreementClick(3)"
                >《人脸识别认证服务须知》</text
              >，授权电子老年人证获取你的姓名、手机号、身份证用于实名领卡，并经由国家老龄服务平台上传您的相片、姓名、社会保障号码信息以完成实人认证。
            </view>
          </view>
        </view>
        <view class="qr-code flex-1" v-if="selectedTabIndex === 2">
          <text class="row fs-40 fw-500 pl-40 mt-32">
            中华人民共和国老年人证
          </text>
          <text class="row fs-36 fw-400 pl-40 mt-32" v-if="codeInfo.userName">
            姓&nbsp;&nbsp;名：{{ nameFilter(codeInfo.userName) }}
          </text>
          <text class="row fs-36 fw-400 pl-40 mt-32" v-if="codeInfo.idNo">
            身份证：{{ idCardNumberFilter(codeInfo.idNo) }}
          </text>
          <view class="code-area flex-v flex-c-c bg-white br-16 p-32">
            <canvas
              canvas-id="bar-code"
              id="bar-code"
              class="bar-code-canvas"
              @click="showsBarCode = true"
            />
            <canvas
              canvas-id="qr-code"
              id="qr-code"
              class="qr-code-canvas"
              @click="showsQRCode = true"
            />
            <view class="flex-h flex-c-c">
              <text class="fs-40 c-lightgrey">每隔1分钟自动</text>
              <button
                class="button fs-40 c-primary ml-16"
                hover-class="none"
                @click="handleRefreshClick"
              >
                刷新
              </button>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="no-bind flex-v flex-c-c bg-white m-20">
          <text class="title fs-40 fw-500 c-black">
            该亲情账号尚未确认与您的绑定关系，你可以再重新发送绑定请求。
          </text>
          <view class="warning flex-h">
            <image
              class="warning-icon mt-4"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-warning.png"
            />
            <text class="fs-36 c-lightgrey flex-1 ml-12">
              平台将会以短信通知和站内消息的方式将您的绑定请求发送给被绑定人确认
            </text>
          </view>
          <button
            class="resend-button fs-40 fw-400 c-white"
            :class="{ 'resend-button--disabled': tips }"
            @click="sendMessage"
            :disabled="tips"
          >
            重新发送
          </button>
          <text class="tips fs-36 mt-8">{{ tips }}</text>
        </view>
      </template>
    </view>

    <!-- 管理绑定 -->
    <view class="manage flex-h flex-c-c">
      <view class="item manage-btn" @click="goList">管理</view>
      <view class="item bind-btn" @click="handleAddIconClick">绑定</view>
    </view>

    <view
      class="preview-bar-code bg-white flex-h flex-c-c"
      :style="{ display: showsBarCode ? 'flex' : 'none' }"
      @click="showsBarCode = false"
    >
      <canvas canvas-id="bar-code-big" id="bar-code-big" class="image" />
    </view>
    <view
      class="preview-qr-code bg-white flex-h flex-c-c"
      :style="{ display: showsQRCode ? 'flex' : 'none' }"
      @click="showsQRCode = false"
    >
      <canvas canvas-id="qr-code-big" id="qr-code-big" class="image" />
    </view>
    <show-points ref="showPoints" @success_flag="success_flag"></show-points>
  </view>
</template>

<script>
import generator from "uniapp-qrcode";
import api from "@/apis/index.js";
import dayjs from "dayjs";
import { showPoints } from "./components/showPoints.vue";
import { desensitizeName, desensitizeInfo } from "@/utils/desensitization.js";
import NavigationBar from "../../components/common/navigation-bar.vue";
import { startFacialRecognitionVerify } from "@/utils/utils.js";
// import staticData from '@/utils/dataBase64.js'
export default {
  components: { NavigationBar, showPoints },
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
      // 亲情账号列表
      list: [
        // {
        //   name: '赵*萌',
        //   relation: '待确认',
        // },
      ],
      // 页码
      pageNum: 1,
      // 显示条数
      pageSize: 5,
      // 是否已绑定
      hasBinded: true,
      // 重新发送提示语
      tips: "",
      // 重新发送倒计时
      seconds: 0,
      // 倒计时定时器
      timer: "",
      // 选中的亲情账号下标
      selectedAccountIndex: 0,
      // 选中的 TabBar 下标
      selectedTabIndex: 0,
      // 是否展示条形码大图
      showsBarCode: false,
      // 是否展示二维码大图
      showsQRCode: false,
      // 自动刷新定时器
      // timer: null,
      // 用户uactId，用于接口请求
      uactId: null,
      // 证件信息
      info: {},
      // 证件号码
      cardNumber: "",
      // 头像链接地址
      avatar: "",
      // 展码信息
      codeInfo: {},
      // 该亲友是否领卡
      haveCard: false,
      // 亲友卡状态
      authState: 0,
      // 申领时间
      submitTime: "",
    };
  },
  computed: {
    tabBackgroundClass() {
      const classes = [
        "tab-background--left",
        "tab-background--middle",
        "tab-background--right",
      ];
      return classes[this.selectedTabIndex];
    },
  },
  onLoad() {
    uni.setStorageSync("reflash", true);
    this.userInfo = uni.getStorageSync("userInfo");
    // 提取用户信息uactId
    // this.uactId = uni.getStorageSync('userInfo').uactId
  },
  onShow() {
    if (uni.getStorageSync("reflash")) {
      uni.setStorageSync("reflash", false);
      // 获取亲情账户列表
      this.findFamilyMemberList().then(() => {
        if (this.list.length > 0) {
          this.changeFamily(0);
          // this.handleTabClick(this.selectedTabIndex)
        }
      });
    }
  },
  onUnload() {
    // 退出页面时销毁定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.msgtimer) {
      clearInterval(this.msgtimer);
      this.msgtimer = null;
    }
  },
  methods: {
    // 日期过滤器, 用于格式化日期
    dateFilter(value) {
      console.log("value", value);
      return dayjs(value).format("YYYY年MM月DD日");
    },
    // 姓名过滤器, 用于姓名脱敏
    nameFilter(value) {
      return desensitizeName(value);
    },
    // 身份证号过滤器, 用于身份证号脱敏
    idCardNumberFilter(value) {
      return desensitizeInfo(value);
    },
    success_flag(successFlag) {
      // this.$emit("success_flag",successFlag)
    },
    handleUserAgreementClick(type) {
      const url = "https://ggll.hpgjzlinfo.com/#/agreement?type=" + type;
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    /**
     * 是否已添加过情亲
     */
    findUserIsAddSup() {
      const data = {
        selectType: "1",
      };
      api.findUserIsAddSup({
        data,
        success: (res) => {
          if (!res) {
            // 如果未添加过亲情账号, 重定向到添加页面
            uni.redirectTo({
              url: "/pages/family-account/select-type",
            });
          }
        },
      });
    },
    /**
     * 查询亲友的老龄卡是否领取
     */
    getCertificateState() {
      const item = this.list[this.selectedAccountIndex];
      return new Promise((resolve, reject) => {
        // 已绑定并且有证则请求老年证信息
        api.getCertificateState({
          data: {
            idNo: item.toIdCard,
            idType: "身份证",
            userName: item.userName,
            appId: "53928a083adb4a7dad2eecf05564873f",
          },
          success: (res) => {
            // 1：已授权已激活 2：未授权已激活 3：未激活 4.审核中 5.审核失败 6.其它渠道已经领取，在老龄委使用，需要进行用户授权
            this.authState = res.authState;
            // this.authState = 6
            if (res.authState === "1" || res.authState === "2") {
              this.haveCard = true;
              api.getAuthorizationCode({
                data: {
                  uactId: item.uactId,
                  psnName: item.userName,
                  certNo: item.toIdCard,
                  appId: "53928a083adb4a7dad2eecf05564873f",
                },
                showsLoading: true,
                success: (data) => {
                  // 卡状态为 2, 请求获取授权码接口
                  this.haveCard = true;
                  this.list[this.selectedAccountIndex].authCode = data.authCode;
                  resolve();
                },
              });
            } else {
              this.haveCard = false;
              if (res.submitTime) {
                this.submitTime = res.submitTime;
              }
            }
          },
        });
      });
    },
    /**
     * 获取亲情账号列表
     */
    findFamilyMemberList() {
      return new Promise((resolve, reject) => {
        const data = {
          uactId: this.userInfo.uactId,
          pageNum: 1,
          pageSize: 5,
        };
        uni.showLoading({
          title: "加载中",
        });
        api.findFamilyMemberList({
          data,
          showsLoading: true,
          success: (res) => {
            resolve();
            console.log("接口所得res：", res);
            if (res.list) {
              this.list = res.list;
            }

            //
          },
          fail: (err) => {
            reject();
            console.log("错误err：", err);
            uni.hideLoading();
            uni.showToast(err.message);
          },
        });
      });
    },

    /**
     *   切换亲人
     */
    changeFamily(index) {
      this.selectedAccountIndex = index;
      const item = this.list[this.selectedAccountIndex];
      // 清除定时器
      if (this.msgtimer) {
        clearInterval(this.msgtimer);
        this.msgtimer = null;
        this.tips = "";
      }
      console.log("亲人item:", item);
      // 是否已绑定(连接状态02 待确认 00 已关联)
      if (item.linkState === "02") {
        this.hasBinded = false;
        if (item.retryNum < 1) {
          this.tips = "今日次数已用尽";
        } else {
          // 判断短信
          // 重新发送倒计时
          this.tips = "";
          if (this.list[index].expireTime) {
            this.seconds = Math.ceil(
              60 - (Date.parse(new Date()) - this.list[index].expireTime) / 1000
            );
            this.msgtimer = setInterval(() => {
              this.tips = `请${this.seconds}s后重新尝试`;
              this.seconds -= 1;
              if (this.seconds < 0) {
                this.tips = "";
                clearInterval(this.msgtimer);
                console.log(
                  "this.list[index].retryNum:",
                  this.list[index].retryNum
                );
                if (this.list[index].retryNum < 1) {
                  this.tips = "今日次数已用尽";
                }
              }
            }, 1000);
          }
        }
        return;
      } else {
        this.hasBinded = true;
      }

      this.selectedTabIndex = 0;
      console.log("知悉");
      // 默认选择展证
      this.handleTabClick(this.selectedTabIndex);
    },
    /**
     * 电子老年证展证
     */
    getCertificateInfo() {
      const item = this.list[this.selectedAccountIndex];

      // 是否已领证（电子证授权码 非null代表已领卡
      // if (item.authCode === null) {
      //   this.haveCard = false
      //   return
      // } else {
      //   this.haveCard = true
      // }
      // 已绑定并且有证则请求老年证信息
      api.getCertificateInfo({
        data: {
          chnlId: "53928a083adb4a7dad2eecf05564873f",
          authCode: item.authCode,
        },
        success: (data) => {
          this.cardNumber = data.ecShowCardNo;
          this.avatar = data.ecCertPhoto;
          this.info = data.ecCertExtendDTO;
          // this.handleTabClick(this.selectedTabIndex)
          generator.qrcode("qr-code-copy", this.cardNumber, 112, 112);
        },
      });
    },
    /**
     * 请求展码数据
     */
    getQRCodeInfo() {
      const item = this.list[this.selectedAccountIndex];
      return new Promise((resolve, reject) => {
        api.getQRCodeInfo({
          showsLoading: false,
          data: {
            appId: "53928a083adb4a7dad2eecf05564873f",
            authCode: item.authCode,
          },
          success: (data) => {
            this.codeInfo = data;
            generator.barcode("bar-code", this.codeInfo.ecQrCode, 560, 128);
            generator.barcode(
              "bar-code-big",
              this.codeInfo.ecQrCode,
              1120,
              256
            );
            generator.qrcode("qr-code", this.codeInfo.ecQrCode, 400, 400);
            generator.qrcode("qr-code-big", this.codeInfo.ecQrCode, 720, 720);
            resolve();
          },
        });
      });
    },

    /**
     * 亲情账号列表末尾添加图标点击事件
     */
    handleAddIconClick() {
      uni.navigateTo({
        url: "/pages/family-account/select-type?family=1",
      });
    },
    /**
     * 点击管理按钮
     */
    goList() {
      uni.navigateTo({
        url: "/pages/family-account/family-list",
      });
    },
    handleAgreeClick() {
      const item = this.list[this.selectedAccountIndex];
      const params = {
        name: item.userName,
        idCard: item.toIdCard,
      };
      console.log("提交的参数params:", params);
      params.success = async () => {
        // 其他渠道授權接口
        api.executeActivation({
          data: {
            idNo: item.toIdCard,
            userName: item.userName,
          },
          showsLoading: true,
          success: (res) => {
            // this.$refs.showPoints.showsCreditsPopup = true
          },
        });

        // 进行实名认证 身份信息+头像
      };
      // this.demo();
      // 开启人脸识别
      startFacialRecognitionVerify(params);
    },

    // 点击返回
    handleNavigationBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    /**
     * TabBar 点击事件（亮证，扫描，老年码切换）
     */
    handleTabClick(index) {
      if (index == 2) return;
      const item = this.list[this.selectedAccountIndex];
      switch (index) {
        case 0:
          this.selectedTabIndex = index;
          // 获取该亲友的领证状态
          this.getCertificateState().then(() => {
            // 获取展证信息
            this.getCertificateInfo();
          });
          break;
        case 1:
          uni.scanCode({
            onlyFromCamera: true,
            scanType: ["qrCode"],
            success: (res) => {
              console.log(res);
            },
          });
          break;
        case 2:
          // 是否已绑定(连接状态02 待确认 00 已关联)
          if (item.linkState === "02") {
            return;
          }
          // 是否已领证（电子证授权码 非null代表已领卡
          if (item.authCode === null) {
            return;
          }
          this.selectedTabIndex = index;
          // 请求用户的展码数据
          this.getQRCodeInfo().then(() => {
            // 设置定时器
            // this.handleRefreshClick()
            this.setTimer();
          });
          break;
      }
    },
    /**
     * 刷新点击事件
     */
    handleRefreshClick() {
      // 清楚定时器
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.handleTabClick(2);
    },
    /**
     * 设置定时器
     */
    setTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = setInterval(() => {
        this.getQRCodeInfo();
      }, 60000);
    },
    /**
     * 发送短信
     */
    sendMessage() {
      const item = this.list[this.selectedAccountIndex];
      this.msgtimer = null;
      this.list[this.selectedAccountIndex].retryNum = item.retryNum - 1;
      api.retryFamilyInfo({
        data: {
          regChnl: "miniprogram",
          familyId: item.familyId,
          toUactId: item.uactId,
        },
        showsLoading: true,
        success: (res) => {
          if (res) {
            // 发送成功
            // 重新发送倒计时

            this.list[this.selectedAccountIndex].expireTime = Date.parse(
              new Date()
            );
            console.log(
              "this.list[this.selectedAccountIndex]:",
              this.list[this.selectedAccountIndex]
            );
            this.seconds = 60;
            this.msgtimer = setInterval(() => {
              this.tips = `请${this.seconds}s后重新尝试`;
              this.seconds -= 1;
              if (this.seconds < 0) {
                this.tips = "";
                clearInterval(this.msgtimer);

                if (this.list[this.selectedAccountIndex].retryNum < 1) {
                  this.tips = "今日次数已用尽";
                }
              }
            }, 1000);
          }
        },
      });
    },
    // 点击立即领取
    handleAddButtonClick() {
      this.$uni.showToast("当前所在地区功能开通中");
      return;
      // 未领 点击【返回】【知道了】按钮，进入【我的】页面
      const item = this.list[this.selectedAccountIndex];
      console.log("亲情关系---", item);
      const params = {
        name: item.userName,
        idCard: item.toIdCard,
        returnUrl: "",
      };
      const birthday = dayjs(item.toIdCard.substring(6, 14)).format(
        "YYYY-MM-DD"
      );
      // 人脸识别成功
      params.success = (getbase64) => {
        console.log("人脸识别成功：");

        // #ifdef MP-WEIXIN
        const data = {
          name: item.userName,
          uactId: item.uactId,
          idCardNumber: item.toIdCard,
          gender: item.toIdCard.substring(16, 17) % 2,
          nation: "",
          birthday: birthday,
          city: "",
          address: "",
        };
        const info = {
          ...data,
          faceImg: "",
        };
        uni.navigateTo({
          url: "/pages/certificate/avatar-confirm-other",
          success: (res) => {
            res.eventChannel.emit("didOpenPageFinish", info);
          },
        });
        // 改版结束
        // api.clearBg({
        //   data: { photoBase64: staticData.faceImg },
        //   showsLoading: true,
        //   success: (resInfo) => {
        //     // 保存第一次人脸识别图片
        //     uni.setStorageSync('other-first-face-img', JSON.stringify(resInfo))
        //     // 拿到头像图片
        //     // 进入帮领证流程
        //     let data = {
        //       name: item.userName,
        //       uactId: item.uactId,
        //       idCardNumber: item.toIdCard,
        //       gender: item.toIdCard.substring(16, 17) % 2,
        //       nation: '',
        //       birthday: birthday,
        //       city: '',
        //       address: '',
        //     }
        //     const info = {
        //       ...data,
        //       faceImg: staticData.faceImg,
        //     }
        //     // 去背景图片

        //     uni.navigateTo({
        //       url: '/pages/certificate/avatar-confirm-other',
        //       success: (res) => {
        //         res.eventChannel.emit('didOpenPageFinish', info)
        //       },
        //     })
        //   },
        // })
        // #endif

        // #ifdef MP-ALIPAY
        api.clearBg({
          data: { photoBase64: getbase64 },
          showsLoading: true,
          success: (resInfo) => {
            // 保存第一次人脸识别图片
            uni.setStorageSync("other-first-face-img", JSON.stringify(resInfo));
            // 拿到头像图片
            // 进入帮领证流程
            const data = {
              name: item.userName,
              uactId: item.uactId,
              idCardNumber: item.toIdCard,
              gender: item.toIdCard.substring(16, 17) % 2,
              nation: "",
              birthday: birthday,
              city: "",
              address: "",
            };
            const info = {
              ...data,
              faceImg: resInfo.photoBase64,
            };
            // 去背景图片

            uni.navigateTo({
              url: "/pages/certificate/avatar-confirm-other",
              success: (res) => {
                res.eventChannel.emit("didOpenPageFinish", info);
              },
            });
          },
        });
        // #endif
      };
      // 开启人脸识别
      console.log("开启人脸");
      startFacialRecognitionVerify(params);
    },
  },
  mounted() {
    generator.qrcode("qr-code-copy", `${new Date().getTime()}`, 110, 110);
  },
  watch: {
    list: {
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
.index {
  position: relative;
  .list {
    @include size(750, 236);
    background: linear-gradient(to right, $color-secondary, $color-primary);
    border-radius: 0 0 0rpx 0rpx;
    overflow-x: scroll;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
      color: transparent;
    }
    .item {
      position: relative;
      min-width: 22vw;
      &:nth-child(1) {
        padding-left: 2vw;
      }

      .img-box {
        flex-shrink: 0;
        @include size(128, 128);
        justify-content: center;
        align-items: flex-end;
        margin-bottom: 22rpx;
      }
      .avatar {
        @include square(100);
        &--selected {
          @include square(120);
        }
      }
      .relation {
        @include text-line(1);
        position: absolute;
        top: 90rpx;
        padding: 2rpx 8rpx;
        max-width: 120rpx;
        background: #ffe6d1;
      }
      .name {
        // position: absolute;
        // bottom: 12rpx;
        height: 50rpx;
        line-height: 50rpx;
      }
      .triangle {
        position: absolute;
        @include size(36, 22);
        bottom: 8rpx;
      }
    }
  }
  .list-bottom {
    position: absolute;
    @include size(750, 318);
    background: linear-gradient(to right, $color-secondary, $color-primary);
    border-radius: 0 0 100rpx 100rpx;
  }
  .card {
    width: 686rpx;
    // @include size(686, 1088);
    position: relative;
    overflow: hidden;
    margin: 0 32rpx 200rpx;
    background: #ffffff;
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
    // top: -350rpx;
    &-background {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .tab-bar {
      position: relative;
      height: 122rpx;
      color: #333333;
      border-bottom: 2rpx solid #eeeeee;
      .tab {
        line-height: 122rpx;
        text-align: center;
        z-index: 9;
      }
      .tab-background {
        @include size(84, 8, 5);
        background: #ff711a;
        position: absolute;
        bottom: 0rpx;
        &--left {
          left: calc(((686rpx / 3) - 84rpx) / 2);
        }
        &--middle {
          left: calc(((686rpx / 3) - 84rpx) / 2 + (686rpx / 3));
        }
        &--right {
          left: calc(((686rpx / 3) - 84rpx) / 2 + (686rpx / 3) * 2);
        }
      }
    }
    .electronic-certificate {
      position: relative;
      width: 100%;
      .oldcard {
        padding: 30rpx 0;
      }
      .certificate-card {
        position: relative;
        @include size(646, 408);
        .bg {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          @include size(646, 408);
        }
        .top {
          position: relative;
          z-index: 1;
          padding-top: 30rpx;
          .emblem {
            width: 86rpx;
            height: 90rpx;
            flex-shrink: 0;
            margin-right: 8rpx;
          }
          .title {
            font-size: 34rpx;
            font-weight: 500;
            color: #2860a6;
            line-height: 50rpx;
            letter-spacing: 3rpx;
          }
        }
        .main {
          display: flex;
          position: relative;
          z-index: 1;
          padding-top: 28rpx;
          .main-l {
            font-size: 19rpx;
            line-height: 18rpx;
            .main-l-item {
              margin: 18rpx 0;
              height: 18px;
              .main-l-item-l {
                flex-shrink: 0;
                width: 148rpx;
                color: #2860a6;
                text-align: right;
                margin-right: 14rpx;
              }
              .main-l-item-r {
                color: #333333;
                text-align: left;
              }
            }
          }
          .main-r {
            flex: 1;
            font-size: 19rpx;
            line-height: 18rpx;
            .main-r-item {
              margin: 18rpx 0;
              height: 18px;
            }
            .main-r-item-l {
              flex-shrink: 0;
              width: 70rpx;
              color: #2860a6;
              text-align: right;
              margin-right: 14rpx;
            }
            .main-r-item-r {
              color: #333333;
              text-align: left;
            }
          }
          .header {
            position: absolute;
            top: 4rpx;
            right: 24rpx;
            width: 112rpx;
            height: 156rpx;
          }
        }
        .main-bt {
          position: relative;
          z-index: 1;
          font-size: 19rpx;
          height: 18rpx;
          line-height: 18rpx;
          .main-bt-left {
            flex-shrink: 0;
            width: 148rpx;
            color: #2860a6;
            text-align: right;
            margin-right: 14rpx;
          }
          .main-bt-right {
            color: #333333;
            text-align: left;
          }
        }
        .lastmain {
          .main-r {
            flex-shrink: 0;
            width: 147rpx;
            margin-left: 46rpx;
            .main-r-item-l {
              flex-shrink: 0;
              width: 80rpx;
            }
          }
          .qr-code {
            position: absolute;
            left: 86rpx;
            bottom: 16rpx;
            width: 110rpx;
            height: 110rpx;
          }
        }
        .made {
          position: relative;
          z-index: 1;
          height: 16rpx;
          font-size: 15rpx;
          color: #2860a6;
          line-height: 24rpx;
          .made-text {
            flex-shrink: 1;
            width: 126rpx;
            padding-right: 52rpx;
          }
        }
        .number {
          position: relative;
          z-index: 1;
          height: 16rpx;
          font-size: 15rpx;
          line-height: 24rpx;
          color: #2860a6;
          padding-top: 20rpx;
          .number-text {
            flex-shrink: 1;
            width: 192rpx;
            padding-right: 44rpx;
            .num {
              color: #333;
            }
          }
        }
      }
      .nocard {
        padding-top: 100rpx;
        padding-bottom: 150rpx;
        &.failcard {
          padding-top: 56rpx;
          padding-bottom: 98rpx;
        }
        .img {
          width: 220rpx;
          height: 220rpx;
        }
        .text {
          width: 440rpx;
          height: 112rpx;
          font-size: 40rpx;
          color: #999999;
          line-height: 56rpx;
          text-align: center;
          margin: 32rpx 0px;
        }
        .btn-box {
          .add-button {
            flex-shrink: 0;
            @include size(520, 100, 50);
            background: linear-gradient(117deg, #ff8800 0%, #ff5000 100%);
            line-height: 100rpx;
          }
        }
        .img-card {
          flex-shrink: 0;
          width: 430rpx;
          height: 280rpx;
        }
        .fail-reason {
          width: 472rpx;
          margin: 0 auto;
          font-size: 36rpx;
          line-height: 50rpx;
          border-radius: 24rpx;
          &.check-reason {
            width: 574rpx;
          }
          .label {
            flex-shrink: 0;
            width: 160rpx;
          }
          .c-333 {
            color: #333;
          }
          .c-666 {
            color: #666;
          }
        }
      }
      .have-card {
        padding-top: 66rpx;
        padding-bottom: 32rpx;
        .img-card {
          flex-shrink: 0;
          width: 460rpx;
          height: 280rpx;
        }
        .btn-box {
          width: 100%;
          height: 100rpx;
          .agree-button {
            width: 520rpx;
            height: 100rpx;
            line-height: 100rpx;
            background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
            border-radius: 50rpx;
            margin: 0 auto;
          }
        }
        .arguments {
          box-sizing: border-box;
          padding: 0 34rpx;
          font-size: 32rpx;
          color: #333333;
          line-height: 44rpx;
          text-align: justify;
          .c-blue {
            color: #0059ff;
          }
        }
      }
    }
    .qr-code {
      position: relative;
      color: #333;
      .row {
        width: 100%;
        display: block;
        box-sizing: border-box;
      }
      .code-area {
        margin: 32rpx auto;
        @include size(582, 570);
        background-color: #f8f8f8;
        .bar-code-canvas {
          @include size(486, 110);
        }
        .qr-code-canvas {
          @include square(400);
        }
        .button {
          height: 40rpx;
          line-height: 40rpx;
        }
      }
    }
    .no-bind {
      position: relative;
      width: 646rpx;
      height: 100%;
      padding: 112rpx 0;
      .title {
        width: 500rpx;
        text-align: center;
      }
      .warning {
        margin: 164rpx 40rpx 40rpx;
        .warning-icon {
          @include square(40);
        }
      }
      .resend-button {
        width: 520rpx;
        height: 108rpx;
        line-height: 108rpx;
        border-radius: 54rpx;
        background: linear-gradient(to right, $color-secondary, $color-primary);
        &--disabled {
          color: white;
          opacity: 0.3;
        }
      }
      .tips {
        color: #ff2600;
      }
    }
  }

  .manage {
    height: 160rpx;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    padding-bottom: 12rpx;
    background-color: #fff;
    z-index: 10;
    box-shadow: 0px -2rpx 0px 0px #eeeeee;
    .item {
      @include size(320, 100, 50);
      font-size: 44rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      &.manage-btn {
        color: #ff5500;
        border: 2rpx solid #ff5500;
        margin-right: 28rpx;
      }
      &.bind-btn {
        background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
        color: #ffffff;
      }
    }
  }
  .preview-bar-code {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    .image {
      @include size(1120, 256);
      transform: rotate(90deg);
    }
  }
  .preview-qr-code {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    .image {
      @include square(720);
    }
  }
}
</style>
