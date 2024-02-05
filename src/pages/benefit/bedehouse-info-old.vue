<template>
  <view class="bede-house-info">
    <view class="bg"></view>
    <!-- 机构详情 -->
    <view class="card">
      <panel-card :show-header="false">
        <view class="top">
          <image class="avatar" :src="img" mode="scaleToFill" />
          <text class="name">慈爱嘉专业居家养老（东直门店）</text>
        </view>
        <view class="imgs">
          <image
            v-for="(item, index) in imgList"
            :key="index"
            class="img-item"
            :src="item.url"
            mode="scaleToFill"
          />
        </view>
        <view class="labels">
          <view v-for="(label, index) in labelList" :key="index" class="label-item">
            {{ label }}
          </view>
        </view>
        <view class="time">
          <image
            class="icon-time"
            src="https://ggllstatic.hpgjzlinfo.com/static/benefit/time.png"
            mode="scaleToFill"
          />
          <text>营业时间：周一至周日 08:00-22:</text>
        </view>
        <view class="address">
          <image
            class="icon-address"
            src="https://ggllstatic.hpgjzlinfo.com/static/benefit/address.png"
            mode="scaleToFill"
          />
          <text>东直门街道东中街东环广场A座B1层</text>
        </view>
      </panel-card>
    </view>
    <!-- 特色服务 -->
    <view class="card">
      <panel-card title="特色服务">
        <view class="service">
          <view v-for="(label, index) in labelList" :key="index" class="service-item">
            <image
              class="icon-radio"
              src="https://ggllstatic.hpgjzlinfo.com/static/benefit/right-radio.png"
              mode="scaleToFill"
            />
            {{ label }}
          </view>
        </view>
      </panel-card>
    </view>
    <!-- 品牌介绍 -->
    <view class="card">
      <panel-card title="品牌介绍">
        <view class="brand-info">
          <image class="brand-img" :src="img" mode="scaleToFill" />
          <view class="info">
            <view class="name">泰康之家养老社区</view>
            <view class="brand-labels">
              <view v-for="(label, index) in labelList" :key="index" class="label-item">
                {{ label }}
              </view>
            </view>
          </view>
        </view>
      </panel-card>
    </view>
    <!-- 特色项目 -->
    <view class="card">
      <panel-card title="特色项目">
        <view class="feature-items">
          <swiper :indicator-dots="true" :current="0" indicator-active-color="#FF5500">
            <swiper-item>
              <view class="feature-item">
                <image class="icon" :src="img" mode="scaleToFill" />
                <view class="name">健身房</view>
                <view class="feature-labels">
                  <view v-for="(label, index) in labelList" :key="index" class="feature-label-item">
                    {{ label }}
                  </view>
                </view>
              </view>
            </swiper-item>
            <swiper-item class="feature-item">
              <view></view>
              <view>健身房</view>
              <view>健身房</view>
            </swiper-item>
          </swiper>
        </view>
      </panel-card>
    </view>
    <!-- 品牌分店 -->
    <view class="card">
      <panel-card title="品牌分店" :show-more="false">
        <brand-list :list="list"></brand-list>
      </panel-card>
    </view>
    <view class="footer">
      <button class="btn">电话咨询/预约</button>
    </view>
  </view>
</template>
<script>
  // import api from '@/apis/index.js'
  import BrandList from './components/brand-list.vue'
  export default {
    data() {
      return {
        img: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg',
        imgList: [
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          }
        ],
        labelList: ['健康档案', '有咖啡厅', '失能照料'],
        featureItems: [
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          }
        ],
        list: [
          {
            name: '慈爱嘉专业居家养老慈爱嘉专业居家养老…',
            address: '沈阳',
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            name: '慈爱嘉专业居家养老…',
            address: '沈阳',
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            name: '慈爱嘉专业居家养老…',
            address: '沈阳',
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            name: '慈爱嘉专业居家养老…',
            address: '沈阳',
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            name: '慈爱嘉专业居家养老…',
            address: '沈阳',
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          },
          {
            name: '慈爱嘉专业居家养老…',
            address: '沈阳',
            url: 'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0E/wKhLJ2NXmr6ASVktAAAmRMGSPs4823.jpg'
          }
        ]
      }
    },
    components: { BrandList },
    created() {},
    onLoad() {},
    methods: {}
  }
</script>
<style lang="scss" scoped>
  .bede-house-info {
    position: relative;
    padding-top: 48rpx;
    padding-bottom: 176rpx;
    background: #f5f5f5;
    min-height: 100vh;
    font-family: PingFangSC-Medium, PingFang SC;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100vw;
      height: 514rpx;
      background: linear-gradient(
        180deg,
        #ffe3d5 0%,
        rgba(255, 229, 216, 0.93) 51%,
        rgba(255, 255, 255, 0) 100%
      );
    }
    .card {
      width: 686rpx;
      position: relative;
      z-index: 2;
      margin: 0 auto;
      margin-bottom: 32rpx;
    }
    .top {
      display: flex;
      align-items: center;
      .avatar {
        width: 128rpx;
        height: 128rpx;
        border-radius: 64rpx;
        flex-shrink: 0;
        margin-right: 32rpx;
      }
      .name {
        font-size: 40rpx;
        font-weight: 500;
        color: #333333;
      }
    }
    .imgs {
      display: flex;
      width: 100%;
      align-items: center;
      overflow-x: scroll;
      margin: 36rpx 0;
      .img-item {
        width: 206rpx;
        height: 200rpx;
        border-radius: 16rpx;
        flex-wrap: nowrap;
        flex-shrink: 0;
        margin-right: 14rpx;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .labels {
      display: flex;
      align-items: center;
      margin-bottom: 26rpx;
      .label-item {
        height: 48rpx;
        border-radius: 4rpx;
        padding: 4rpx 8rpx;
        box-sizing: border-box;
        text-align: center;
        border: 2rpx solid #ff2600;
        color: #ff2600;
        margin-right: 16rpx;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .time,
    .address {
      font-size: 32rpx;
      font-weight: 400;
      color: #666666;
      display: flex;
      align-items: center;
      margin-bottom: 14rpx;
      .icon-time,
      .icon-address {
        width: 36rpx;
        height: 36rpx;
        margin-right: 16rpx;
      }
    }
    .service {
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto auto auto;
      margin-top: 28rpx;
      .service-item {
        font-size: 32rpx;
        color: #333333;
        font-weight: 400;
        display: flex;
        align-items: center;
        margin-bottom: 38rpx;
        // &:last-child {
        // margin-bottom: 0;
        // }
        .icon-radio {
          width: 36rpx;
          height: 36rpx;
          margin-right: 8rpx;
        }
      }
    }
    .brand-info {
      display: flex;
      align-items: center;
      margin-top: 24rpx;
      .brand-img {
        width: 150rpx;
        height: 150rpx;
        background: #ffe8a7;
        border-radius: 12rpx;
      }
      .info {
        margin-left: 24rpx;
        height: 150rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          font-size: 40rpx;
          font-weight: 500;
          color: #333333;
        }
        .brand-labels {
          display: flex;
          align-items: center;

          .label-item {
            border-radius: 4rpx;
            border: 2rpx solid #666666;
            font-weight: 400;
            color: #666666;
            padding: 4rpx 8rpx;
            box-sizing: border-box;
            margin-right: 16rpx;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
    .feature-items {
      margin-top: 24rpx;
      .feature-item {
        width: 646rpx;
        height: 400rpx;
        .icon {
          width: 100%;
          height: 200rpx;
        }
        .name {
          font-size: 40rpx;
          font-weight: 500;
          color: #ff5500;
          margin-top: 24rpx;
          margin-bottom: 36rpx;
        }
        .feature-labels {
          display: flex;
          align-items: center;
          .feature-label-item {
            font-size: 32rpx;
            font-weight: 400;
            color: #333333;
            margin-right: 20rpx;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 176rpx;
    background: #ffffff;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      width: 686rpx;
      height: 108rpx;
      line-height: 108rpx;
      background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
      border-radius: 54rpx;
      color: #ffffff;
      font-weight: 500;
      font-size: 44rpx;
    }
  }
</style>
