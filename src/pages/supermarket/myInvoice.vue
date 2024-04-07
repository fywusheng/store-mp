<template>
  <view class="pages">
    <view class="page-main">
      <view class="nav uni-nav bg-white">
        <view
          class="nav-item"
          :class="currentIndex == index ? 'nav-item-act' : ''"
          :key="index"
          v-for="(item, index) in classList"
          @click="taggleNav(index)"
        >
          {{ item.label }}({{ item.num }}张)
        </view>
        <view class="nav-line" :style="style"></view>
      </view>
      <view class="swiper">
        <view class="recommend-content" v-if="list.length > 0">
          <view
            class="recommend-item bg-white"
            v-for="(item, index) in list"
            :key="index"
            @click="handleInfoClick(item)"
          >
            <view class="content-all-top flex-h flex-c-b">
              <view class="left flex-h flex-c-s">
                <view class="ticket">电子发票</view>
                <view class="status orange" v-if="item.status === '0'">开票中</view>
                <view class="status green" v-if="item.status === '1'">已开票</view>
              </view>
              <view class="right">{{ item.applicationTime | dateFilter }}</view>
            </view>
            <view class="content-all-mid flex-h flex-c-s">
              <view class="num">¥{{ item.invoiceAmount | formaterMoney }}</view>
              <image
                class="icondetail"
                src="http://192.168.1.187:10088/static/supermarket/icon-detail.png"
                mode="scaleToFill"
              />
            </view>
            <view class="content-all-bot">
              <button class="btn" @click.stop="handleSendEmail(index)">发送邮箱</button>
            </view>
          </view>
          <bottom-tips ref="bottomTips" :bottomTips="bottomTips"></bottom-tips>
        </view>
        <block v-if="list.length === 0">
          <view class="flex-v flex-c-c status-box">
            <image
              src="http://192.168.1.187:10088/static/common/status-none2x.png"
              mode="scaleToFill"
            />
            <view class="flex-c-c status-text">暂无发票</view>
          </view>
        </block>
      </view>
      <view class="btn-box">
        <button class="btn" @click="HandleInvoiceClick">抬头管理</button>
      </view>
    </view>
    <input-modal
      ref="inputModal"
      cancelText="取消"
      confirmText="发送"
      @cancel="modalPopCancel"
      @confirm="modalPopConfirm"
      title="请确定邮箱地址"
    >
      <view slot="text">
        <view class="mainMin">
          <view class="content">
            <input type="text" class="email" v-model="email" placeholder=" " />
            <image
              class="icon"
              @click="email = ''"
              v-if="email"
              src="http://192.168.1.187:10088/static/supermarket/icon-close.png"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>
    </input-modal>
  </view>
</template>

<script>
  import api from '@/apis/index.js';
  import bottomTips from './components/bottom-tips';
  import inputModal from './components/input-modal.vue';
  import { validateEmail, validatePhoneNumber } from '@/utils/validation.js';
  import dayjs from 'dayjs';
  export default {
    components: { bottomTips, inputModal },
    data() {
      return {
        // 用户信息
        userInfo: {},
        // 分类列表
        classList: [
          {
            label: '全部',
            num: '0',
            invoiceFlag: null,
          },
          {
            label: '已开票',
            num: '0',
            invoiceFlag: '1',
          },
          {
            label: '开票中',
            num: '0',
            invoiceFlag: '0',
          },
        ],
        // 数据列表
        list: [],
        //当前页码列表的tab页下标
        currentIndex: 0,
        // 每页条数
        pageSize: 10,
        // 页码
        pageNum: 1,

        // 提示信息
        bottomTips: '',

        //邮箱
        email: '',
        // 当前选中的发票index
        ticketIndex: -1,
      };
    },
    mounted() {
      // this.$refs.inputModal.open()
    },
    onLoad(e) {
      this.userInfo = uni.getStorageSync('userInfo');
      this.getInvoiceNum();
      this.getInvoiceList(this.currentIndex);
    },
    // 下拉刷新
    onPullDownRefresh() {
      console.log('下拉刷新');
      this.pageNum = 1;
      // this.nomore = false
      this.getInvoiceList(this.currentIndex);
    },
    // 上拉加载
    onReachBottom() {
      console.log('上拉加载');
      this.getInvoiceList(this.currentIndex);
    },
    methods: {
      // 点击发送邮箱
      handleSendEmail(index) {
        // 当前选中的发票index
        this.ticketIndex = index;
        this.$refs.inputModal.open();
        this.email = this.list[index].payeeEmail;
      },
      // 点击发送按钮
      modalPopConfirm() {
        if (!this.email) {
          this.$uni.showToast('请填写邮箱');
          return false;
        }
        if (!validateEmail(this.email)) {
          this.$uni.showToast('邮箱格式不正确');
          return false;
        }
        api.sendMailbox({
          data: {
            pdfUrl: this.list[this.ticketIndex].pdfUrl,
            mailBox: this.email,
          },
          showsLoading: true,
          success: (res) => {
            this.$uni.showToast('发送成功');
            this.$refs.inputModal.close();
          },
        });
      },
      // 点击取消按钮
      modalPopCancel() {
        this.$refs.inputModal.close();
      },
      /**
       * 获取发票数量
       */
      getInvoiceNum() {
        this.list = [];
        api.getInvoiceNum({
          data: {
            uactId: this.userInfo.memberId,
          },
          showsLoading: true,
          success: (res) => {
            console.log('票数量:', res);
            this.classList.map((item, index) => {
              if (item.label === '全部') {
                item.num = res.totalNum;
              } else if (item.label === '已开票') {
                item.num = res.invoicePass;
              } else if (item.label === '开票中') {
                item.num = res.invoiceProcessOn;
              }
            });
          },
        });
      },
      //下拉刷新函数
      refreshList(index) {
        console.log(this.classList[index].serviceId);
        const data = {
          orgOfficeTypeFirstClass: this.serviceId,
          orgOfficeTypeSecondClass: this.classList[index].serviceId,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        };
        console.log('接口参数：', data);
        api.getOfficeByTypeWithPage({
          data,
          success: (res) => {
            if (res.list && res.list.length > 0) {
              let arry = [];
              res.list.map((items, indexs) => {
                let obj = items;
                obj['score'] = items.score;
                if (items.orgOfficeInfoDetail) {
                  // console.err("items.orgOfficeInfoDetail:",items.orgOfficeInfoDetail)
                  const area = JSON.parse(items.orgOfficeInfoDetail.replace(/\s/g, ' '));
                  // console.log("area:",area)
                  obj['hospital_level'] = area.hospital_level ? area.hospital_level : '';
                  obj['hospital_clinic'] = area.hospital_clinic ? area.hospital_clinic : '';
                  obj['scenic_service_rank'] = area.scenic_service_rank;
                  obj['scenic_service_opentime'] = area.scenic_service_opentime;
                  obj['scenic_service_intro'] = area.scenic_service_intro
                    ? area.scenic_service_intro
                    : area.hospital_intro;
                  if (area.social_service_photos) {
                    obj['social_service_photos'] = area.social_service_photos.split(',')[0];
                  }
                }
                // console.log('item:', obj)
                arry.push(obj);
              });
              this.list = arry;
              this.pageNum = this.pageNum + 1;
              this.nomore = false;
            } else {
              this.list = [];
              this.nomore = true;
            }
            uni.stopPullDownRefresh();

            //
          },
          fail: (err) => {
            uni.showToast(err.message);
            uni.stopPullDownRefresh();
          },
        });
      },

      //加载数据接口（分页接口）
      getInvoiceList(index) {
        const data = {
          uactId: this.userInfo.memberId,
          invoiceFlag: this.classList[index].invoiceFlag,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        };
        // this.bottomTips = 'loading'
        api.getInvoiceList({
          data,
          showsLoading: true,
          success: (res) => {
            console.log('加载数据：', res);
            if (res.list && res.list.length > 0) {
              res.list.map((items, indexs) => {
                this.list.push(items);
              });
              this.pageNum = this.pageNum + 1;
              this.nomore = false;
            } else {
              // this.bottomTips = 'nomore'
              this.nomore = true;
            }
            console.log('加载结束：', this.pageNum);
            //
          },
        });
      },

      // 点击导航切换swiper
      taggleNav(val) {
        this.currentIndex = val;
        this.pageNum = 1;
        this.list = [];
        this.getInvoiceList(this.currentIndex);
      },
      /**
       * 点击查看详情
       */
      handleInfoClick(item) {
        uni.navigateTo({
          url: '/pages/supermarket/invoice-info?invoiceId=' + item.invoiceId,
        });
      },
      /**
       * 抬头管理
       */
      HandleInvoiceClick(item) {
        uni.navigateTo({
          url: `/pages/supermarket/company-list?select=0`,
        });
      },
    },
    onShow() {},
    onUnload() {},
    watch: {},
    computed: {},
    filters: {
      formaterMoney(v) {
        return (v / 100).toFixed(2);
      },
      // 日期过滤器, 用于格式化日期
      dateFilter(value) {
        var time = new Date(Number(value));
        function add0(m) {
          return m < 10 ? '0' + m : m;
        }
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .pages {
    min-height: 100vh;
    background-color: #f2f2f2;
    .page-main {
      .nav {
        white-space: nowrap;
        position: relative;
        height: 88rpx;
        box-sizing: border-box;
        padding: 0 16rpx;
        .nav-item {
          display: inline-block;
          width: 33%;
          height: 88rpx;
          line-height: 88rpx;
          // margin: 0 16rpx;
          text-align: center;
          transition: color 0.3s ease;
          font-size: 36rpx;
          color: #333;
        }
        .nav-item-act {
          color: #333;
          font-size: 40rpx;
          font-weight: bold;
          position: relative;
          &::after {
            content: '';
            display: block;
            position: absolute;
            left: 50%;
            bottom: 0rpx;
            transform: translateX(-50%);
            width: 70rpx;
            height: 10rpx;
            background: #ff711a;
            border-radius: 5rpx;
          }
        }
        .nav-line {
          // position: absolute;
          // bottom: 0;
          // height: 10rpx;
          // border-radius: 10rpx;
          // background-color: #ff711a;
          // transition: left 0.3s ease;
        }
      }
      .swiper {
        position: relative;
        .recommend-content {
          padding: 24rpx 32rpx 152rpx 32rpx;
          .recommend-item {
            width: 686rpx;
            min-height: 280rpx;
            background: #ffffff;
            border-radius: 16rpx;
            margin-bottom: 28rpx;
            box-sizing: border-box;
            padding: 24rpx;
            .content-all-top {
              height: 50rpx;
              .left {
                .ticket {
                  color: #333;
                  font-size: 40rpx;
                  margin-right: 24rpx;
                }
                .status {
                  width: 112rpx;
                  height: 40rpx;
                  background: #ffffff;
                  border-radius: 4rpx;
                  font-size: 32rpx;
                  text-align: center;
                  box-sizing: border-box;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  &.orange {
                    border: 2rpx solid #ff5500;
                    color: #ff5500;
                  }
                  &.green {
                    border: 2rpx solid #12b362;
                    color: #12b362;
                  }
                }
              }
              .right {
                font-size: 36rpx;
                color: #999999;
              }
            }
            .content-all-mid {
              margin-top: 16rpx;
              margin-bottom: 24rpx;
              .num {
                font-size: 64rpx;
                font-weight: bold;
                color: #ff5500;
                line-height: 88rpx;
                margin-right: 16rpx;
              }
              .icondetail {
                flex-shrink: 0;
                width: 32rpx;
                height: 32rpx;
              }
            }
            .content-all-bot {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              .btn {
                width: 230rpx;
                height: 72rpx;
                background: #ffffff;
                border-radius: 36rpx;
                border: 2rpx solid #dcdee0;
                line-height: 72rpx;
                text-align: center;
                box-sizing: border-box;
              }
            }
          }
        }
        .status-box {
          background-color: #f5f5f5;
          padding-top: 300rpx;
          image {
            width: 440rpx;
            height: 234rpx;
            margin-bottom: 24rpx;
          }
          .status-text {
            height: 50rpx;
            color: $color-grey;
          }
        }
      }
      .btn-box {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100vw;
        height: 152rpx;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
          width: 686rpx;
          height: 108rpx;
          background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
          border-radius: 54rpx;
          text-align: center;
          line-height: 108rpx;
          font-size: 44rpx;
          color: #fff;
        }
      }
    }
    .mainMin {
      padding-bottom: 170rpx;
      .content {
        width: 526rpx;
        height: 100rpx;
        background: #f2f2f2;
        border-radius: 16rpx;
        margin: 0 auto;
        position: relative;
        .email {
          display: block;
          width: 100%;
          height: 100%;
          font-size: 44rpx;
          font-weight: bold;
          color: #323233;
          padding: 0 80rpx 0 24rpx;
          box-sizing: border-box;
        }
        .icon {
          position: absolute;
          top: 34rpx;
          right: 24rpx;
          width: 32rpx;
          height: 32rpx;
        }
      }
    }
  }
</style>
