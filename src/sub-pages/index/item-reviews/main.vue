<style lang="scss">
  @import "~@/styles/base";

  .page-views {
    width: 100%;
    background: #fff;
    .comment-list {
      padding-bottom: rpx(100);
      padding-left: rpx(30);
      padding-right: rpx(30);

      .comment {
        position: relative;
        padding-left: rpx(95);
        padding-bottom: rpx(30);

        .user-logo {
          position: absolute;
          left: 0;
          top: rpx(30);
          width: rpx(70);
          height: rpx(70);
          border-radius: 50%;
          background: url(http://image.watsons.com.cn/upload/a15a18e8.png) center no-repeat;
          background-size: contain;
        }

        .user-name {
          position: relative;
          padding-top: rpx(35);
          font-size: rpx(30);
          line-height: rpx(42);
        }

        .content {
          padding-top: rpx(20);
          line-height: rpx(33);
          font-size: rpx(28);
          color: $extra-light-black;
        }

        .img-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .img {
            margin-top: rpx(20);
            margin-right: rpx(20);
            width: rpx(85);
            height: rpx(85);
            background: center no-repeat;
            background-size: contain;
          }
        }
      }
    }
    .empty {
      img {
        display: block;
        margin: rpx(200) auto rpx(30);
        width: rpx(200);
        height: rpx(200);
      }
      .desc {
        text-align: center;
        font-size: rpx(26);
        color: #25292D;
      }
    }
  }
</style>

<template>
  <div class="page-views">
    <ul class="comment-list">
      <li class="comment border-b" v-for="(comment,index) in dataList" :key="index">
        <div class="user-logo" :style="{backgroundImage: 'url('+comment.memberPicurl+')'}"></div>
        <div class="user-name">{{comment.nickName}}</div>
        <div class="content">{{comment.content}}</div>
        <ul class="img-list">
          <li class="img" :key="subIndex" v-for="(img,subIndex) in comment.imgs"
              :style="{backgroundImage: 'url('+img.imgUrl+')'}"></li>
        </ul>
      </li>
    </ul>
    <div class="empty" v-if="!loading && !dataList.length">
      <img src="https://ggllstatic.hpgjzlinfo.com/static/images/no-comment.png">
      <div class="desc">暂无评论</div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'COMMENT_LIST',
    props: {},
    data() {
      return {
        showPopup: true,
        dataList: [],
        pageNum: 1,
        pageSize: 10,
        disabled: true,
        loading: true,
      }
    },

    methods: {

      async loadData() {
        const result = await Axios.get('', {
          params: {
            method: 'product.getCommentList',
            productId: this.$root.$mp.query.id,
            pageNum: this.pageNum++,
            pageSize: this.pageSize,
          }
        })
        if (result.result.result == 1) {
          this.dataList = this.dataList.concat(result.data.result || []);
          this.disabled = result.data.pageNum >= result.data.totalPage;
        } else {
          wx.showToast(result.message)
        }
        this.loading = false;
      }
    },
    async mounted() {
      this.loadData();
    }
  }
</script>
