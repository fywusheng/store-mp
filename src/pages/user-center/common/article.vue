<template>
  <view class="content">
    <view class="_padding">
      <block v-for="(artItem,artIndex) in list" :key="artIndex">
        <!-- 听文章没图片模块 -->
        <view :data-id="artItem.contId"
          :class="['content-noimg nopadding', artItem.play ? 'play' : '']"
          v-if="artItem.imgs === undefined && artItem.artiType === '0'">
          <view @click="goDetail(artItem)">
            <view class="_line">
              <view :class="['top',artItem.topFlag == 1 ? '_color' : '']">
                {{artItem.topFlag == 1 ? '置顶' :''}}</view>
              <view class="_time">{{artItem.topTime | dateFilter}}</view>
            </view>
            <view class="noimg-title">{{artItem.ttl}}</view>
          </view>
          <view class="noimg-bottom">
            <view class="_item" @click.stop="optionClick(0,artItem,artIndex)">
              <image class="icon" :src="icons[artItem.topFlag]" />
              <view class="_text">{{artItem.topFlag == 1 ? '取消置顶' :'置顶'}}</view>
            </view>
            <!-- <view class="_item" @click.stop="optionClick(1,artItem,artIndex)">
                           <image class="icon" src="@/pages/user-center/static/option.png" mode="scaleToFill" />
                           <view class="_text">分享</view>
                      </view> -->
            <view class="_item" @click.stop="optionClick(1,artItem,artIndex)">
              <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/user-center/del.png"
                mode="scaleToFill" />
              <view class="_text">取消收藏</view>
            </view>
          </view>
        </view>
        <!-- 听文章一张图片模块 -->
        <view :data-id="artItem.contId"
          :class="['content-oneimg content-noimg nopadding ', artItem.play ? 'play' : '']"
          v-else-if="artItem.imgs && artItem.imgs.length === 1 && artItem.artiType === '0'">
          <view @click="goDetail(artItem)">
            <view class="_line">
              <view :class="['top',artItem.topFlag == 1 ? '_color' : '']">
                {{artItem.topFlag == 1 ? '置顶' :''}}</view>
              <view class="_time">{{artItem.topTime | dateFilter}}</view>
            </view>
            <view class="oneimg-title">
              <text>{{artItem.ttl}}</text>
              <image :src="imgItem" mode="scaleToFill"
                @error="handleArticleImageLoadFail(index,artIndex,imgIndex,1)"
                v-for="(imgItem,imgIndex) in artItem.imgs" :key="imgIndex"></image>
            </view>
          </view>
          <view class="noimg-bottom">
            <view class="_item" @click.stop="optionClick(0,artItem,artIndex)">
              <image class="icon" :src="icons[artItem.topFlag]" mode="scaleToFill" />
              <view class="_text">{{artItem.topFlag == 1 ? '取消置顶' :'置顶'}}</view>
            </view>
            <!-- <view class="_item" @click.stop="optionClick(1,artItem,artIndex)">
                           <image class="icon" src="@/pages/user-center/static/option.png" mode="scaleToFill" />
                           <view class="_text">分享</view>
                      </view> -->
            <view class="_item" @click.stop="optionClick(1,artItem,artIndex)">
              <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/user-center/del.png"
                mode="scaleToFill" />
              <view class="_text">取消收藏</view>
            </view>
          </view>
        </view>
        <!-- 听文章多张图片显示模块 -->
        <view :data-id="artItem.contId"
          :class="['content-noimg nopadding', artItem.play ? 'play' : '']"
          v-else-if="artItem.imgs && artItem.imgs.length > 1 && artItem.artiType === '0'">
          <view @click="goDetail(artItem)">
            <view class="_line">
              <view :class="['top',artItem.topFlag == 1 ? '_color' : '']">
                {{artItem.topFlag == 1 ? '置顶' :''}}</view>
              <view class="_time">{{artItem.topTime | dateFilter}}</view>
            </view>
            <view class="noimg-title">{{artItem.ttl}}</view>
            <view class="img-center">
              <image :src="imgItem" mode="scaleToFill"
                @error="handleArticleImageLoadFail(index,artIndex,imgIndex,2)"
                v-for="(imgItem,imgIndex) in artItem.imgs" :key="imgIndex"></image>
            </view>
          </view>

          <view class="noimg-bottom">
            <view class="_item" @click.stop="optionClick(0,artItem,artIndex)">
              <image class="icon" :src="icons[artItem.topFlag]" mode="scaleToFill" />
              <view class="_text">{{artItem.topFlag == 1 ? '取消置顶' :'置顶'}}</view>
            </view>
            <!-- <view class="_item" @click.stop="optionClick(1,artItem,artIndex)">
                           <image class="icon" src="@/pages/user-center/static/option.png" mode="scaleToFill" />
                           <view class="_text">分享</view>
                      </view> -->
            <view class="_item" @click.stop="optionClick(1,artItem,artIndex)">
              <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/user-center/del.png"
                mode="scaleToFill" />
              <view class="_text">取消收藏</view>
            </view>
          </view>
        </view>
        <!-- 视频模块-->
        <view :data-id="artItem.contId" class="content-noimg nopadding"
          v-else-if="artItem.artiType === '1' ">
          <view>
            <view class="_line">
              <view :class="['top',artItem.topFlag == 1 ? '_color' : '']">
                {{artItem.topFlag == 1 ? '置顶' :''}}</view>
              <view class="_time">{{artItem.topTime | dateFilter}}</view>
            </view>
            <view class="audio-title">{{artItem.ttl}}</view>

            <view class="audio-center" @click="goVedio()">
              <image class="videoplay" :src="artItem.imgs[0]" mode="scaleToFill" />
              <image class="play" mode="scaleToFill"
                src="https://ggllstatic.hpgjzlinfo.com/static/find/audio2x.png"></image>
              <!-- <video class="videoplay" @play="saveplay('video'+artItem.contId)"
                :id="'video'+artItem.contId" :title="artItem.ttl" :src="artItem.mediaUrl"></video> -->
            </view>
          </view>

          <view class="noimg-bottom">
            <view class="_item" @click.stop="optionClick(0,artItem,artIndex)">
              <image class="icon" :src="icons[artItem.topFlag]" />
              <view class="_text">{{artItem.topFlag == 1 ? '取消置顶' :'置顶'}}</view>
            </view>
            <!-- <view class="_item" @click.stop="optionClick(1,artItem,artIndex)">
                           <image class="icon" src="@/pages/user-center/static/option.png" mode="scaleToFill" />
                           <view class="_text">分享</view>
                      </view> -->
            <view class="_item" @click.stop="optionClick(1,artItem,artIndex)">
              <image class="icon" src="https://ggllstatic.hpgjzlinfo.com/static/user-center/del.png"
                mode="scaleToFill" />
              <view class="_text">取消收藏</view>
            </view>
          </view>
        </view>
      </block>
    </view>
    <block v-if="list.length === 0">
      <view class="pad-top flex-v flex-c-c status-box">
        <image src="https://ggllstatic.hpgjzlinfo.com/static/common/status-none2x.png"
          mode="scaleToFill" class="imgStyle" />
        <view class="flex-c-c status-text">暂无内容</view>
      </view>
    </block>
    <uni-popup ref="confirmpop" type="center">
      <view class="modal-container showValue" @touchmove.stop @click.stop='close()'>
        <image src="https://ggllstatic.hpgjzlinfo.com/static/common/videoTip.png" mode="widthFix" />
      </view>
    </uni-popup>
    <uni-popup class="popup" ref="popup" type="bottom" :mask-click="true">
      <view class="share-pop pt-32">
        <view class="title fs-36">分享到</view>
        <view class="flex-h list fs-36">
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-wechat.png"
              mode="scaleToFill" />
            <text>微信好友</text>
          </button>
          <!-- #ifdef MP-ALIPAY -->
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-qq.png"
              mode="scaleToFill" />
            <text>QQ好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-alipay.png"
              mode="scaleToFill" />
            <text>支付宝好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-message.png"
              mode="scaleToFill" />
            <text>短信</text>
          </button>
          <!-- #endif -->
          <button class="item flex-v flex-c-c" @click="handleCopyClick">
            <image src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-link.png"
              mode="scaleToFill" />
            <text>复制链接</text>
          </button>
        </view>
        <view class="btn">
          <view @click="handleCloseClick" class="cancle bg-white flex-h flex-c-c fs-44">取消</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import api from '@/apis/index.js'
import dayjs from 'dayjs'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      article_id: '',
      icons: { '0': 'https://ggllstatic.hpgjzlinfo.com/static/user-center/topicon.png', '1': 'https://ggllstatic.hpgjzlinfo.com/static/user-center/cancel.png' }
    }
  },
  filters: {
    dateFilter: function (time) {
      if (!time) return ''
      return dayjs().format('YYYY-MM-DD')
    }
  },
  onLoad() { },
  methods: {
    close() {
      this.$refs.confirmpop.close()
    },
    // 点击播放
    saveplay(name) {
      console.log('点击播放视频：', name)
      // if (this.current && name != this.current) {
      //   // console.log('被暂停了')
      //   this.videoContext = uni.createVideoContext(this.current,this)
      //    console.log('被暂停了',this.videoContext)
      //   this.videoContext.pause()
      // }
    },
    // 关闭分享
    handleCloseClick() {
      this.$refs.popup.close()
    },
    // 点击复制链接
    handleCopyClick() {
      uni.setClipboardData({
        data: 'https://ggll.hpgjzlinfo.com/#/discovery/app-detail/' + this.article_id,
        success: (res) => {
          console.log(res)
          uni.getClipboardData({
            success: (resp) => {
              this.$refs.popup.close()
              console.log('resp:', resp)
              uni.showToast({
                title: '已复制到剪贴板'
              })
            }
          })
        }
      })
    },
    /**
     * 文章详情
     */
    goDetail(item) {
      const imgs = JSON.stringify(item.imgs)
      uni.navigateTo({ url: `/pages/find/article-detail?contId=` + item.colId + '&imgs=' + imgs })
    },
    /**
     * 视频详情
     */
    goVedio(item) {
      this.$refs.confirmpop.open()
      // uni.navigateTo({ url: `/pages/find/video-list?contId=` + item.colId })
    },
    optionClick(type, item, i_id) {
      this.article_id = item['contId']
      if (type == 0) {
        const id = item.contId || ''
        const topFlag = item.topFlag
        const flag = { 0: '1', 1: '0' }
        this.updateByid(id, flag[topFlag], '0', i_id, item, type)
      } else if (type == 1) {
        //  取消收藏
        const id = item['colId'] || ''
        this.updateByid(id, '0', '1', i_id, item, type)
      } else {
        // fengxiang
        if (!uni.getStorageSync('token')) {
          uni.navigateTo({
            url: '/pages/user-center/login'
          })
          return
        }
        this.$refs.popup.open()
      }
    },
    updateByid(colId, topFlag, delFlag, index, item, type) {
      const params = {
        colId: colId,
        topFlag: topFlag, // 置顶 1 ,0
        delFlag: delFlag// 取消 1  0
      }
      const param = {
        requestColSingleDTOList: [params]
      }
      api.updateCollect({
        data: param,
        success: (res) => {
          console.log('====更新情况--', res)
          if (res) {
            this.$emit('fresh', { index: index, item: item, type: type })
            this.$uni.showToast('操作成功')
          }
        },
        fail: (erro) => {
          this.$uni.showToast(erro.message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  background-color: #f2f2f2;
  .pad-top {
    padding-top: 300rpx;
    background-color: #fdfdfd;
    .imgStyle {
      width: 440rpx;
      height: 234rpx;
      margin-bottom: 24rpx;
    }
  }
  ._padding {
    // padding: 32rpx;
    // padding-top: 0;
    // padding-bottom: 0;
    margin-top: 78rpx;
  }
  ._line {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .top {
      width: 50%;
    }
    ._color {
      width: 80rpx;
      color: #fff;
      font-size: 32rpx;
      background-color: #ff9a00;
      font-weight: 400;
      text-align: center;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    ._time {
      width: 50%;
      text-align: right;
    }
  }

  .content-top {
    display: flex;
    width: 100%;
    border-bottom: 2rpx solid #f5f5f5;
    padding: 20rpx 0;
    .top-left {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100rpx;
      height: 60rpx;
      background: #ff9a00;
      border-radius: 8rpx;
      font-size: 36rpx;
      color: #fff;
    }
    .top-right {
      width: 100%;
      color: #323233;
      margin-left: 10rpx;
      font-size: 40rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .content-noimg {
    width: auto;
    margin-top: 13rpx;
    padding-bottom: 12rpx;
    border-bottom: 2rpx solid #f5f5f5;
    background-color: #fff;
    padding-top: 20rpx;
    padding-left: 34rpx;
    padding-right: 34rpx;
    height: auto;
    padding-bottom: 40rpx;
    &.play {
      .noimg-title {
        color: #ff5500;
      }
      .noimg-bottom {
        .right {
          border: 2rpx solid #ff5500;
          color: #ff5500;
        }
      }
    }
    .noimg-title {
      width: 100%;
      color: #333333;
      font-size: 40rpx;
    }
    .img-center {
      display: flex;
      width: 100%;
      height: 170rpx;
      image {
        flex: 1;
        height: 170rpx;
        margin: 20rpx 0rpx 0 10rpx;
        border-radius: 10rpx;
      }
    }
    .audio-title {
      width: 100%;
      color: #333333;
      font-size: 40rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .audio-center {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 380rpx;
      border-radius: 10rpx;
      // background: url("https://ggllstatic.hpgjzlinfo.com/static/logo.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 12rpx;
      overflow: hidden;
      .videoplay {
        width: 100%;
        height: 100%;
      }
      video {
        height: 100%;
        width: 100%;
      }
      .bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
      }
      .play {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 120rpx;
        height: 120rpx;
      }
    }
  }
  .content-oneimg {
    // padding: 30rpx 0 12rpx;
    border-bottom: 2rpx solid #f5f5f5;
    &.play {
      .oneimg-title {
        color: #ff5500;
      }
      .oneimg-bottom {
        .right {
          border: 2rpx solid #ff5500;
          color: #ff5500;
        }
      }
    }
    .oneimg-title {
      display: flex;
      width: 100%;
      color: #333333;
      font-size: 40rpx;
      text {
        width: 100%;
        display: block; /* Fallback for non-webkit */
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      image {
        flex-shrink: 0;
        width: 260rpx;
        height: 160rpx;
        border-radius: 10rpx;
      }
    }
  }
  .noimg-bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 96rpx;
    line-height: 96rpx;
    border-top: 2rpx solid #eeeeee;
    margin-top: 31rpx;
    ._item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 36rpx;
      .icon {
        width: 40rpx;
        height: 40rpx;
      }
      ._text {
        margin-left: 4rpx;
      }
    }
  }
  .nopadding {
    padding-bottom: 0;
  }
  .share-pop {
    background-color: #f2f2f2;
    border-radius: 16px 16px 0px 0px;
    color: #333333;
    .title {
      text-align: center;
      line-height: 50rpx;
    }
    .list {
      // #ifdef MP-ALIPAY
      justify-content: flex-start;
      // #endif
      // #ifdef MP-WEIXIN
      justify-content: center;
      // #endif
      align-items: center;
      padding: 24rpx 74rpx;
      flex-wrap: wrap;
      .item {
        height: 192rpx;
        flex-shrink: 0;
        width: 33.3%;
        margin-bottom: 28rpx;
        image {
          flex-shrink: 0;
          width: 134rpx;
          height: 134rpx;
          margin-bottom: 8rpx;
        }
        text {
          line-height: 50rpx;
        }
      }
    }
    .btn {
      padding: 24rpx 74rpx;
      box-sizing: border-box;
      .cancle {
        height: 108rpx;
        border-radius: 54rpx;
        color: #666;
        font-weight: 500;
      }
    }
  }
}
</style>

