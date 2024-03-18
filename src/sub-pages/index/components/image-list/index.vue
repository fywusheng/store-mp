<template>
  <div class="topic-image-list" v-if="dataList && dataList.length">
    <ul class="img-list" :style="{marginLeft: space_height}" v-for="(imgList,index) in dataList" :key="index">
      <div class="img-wrap" :style="{marginRight: space_height, marginBottom: space_height}" v-for="(data,subIndex) in imgList" :key="subIndex">
        <img class="image" lazy-load mode="widthFix" :src="data.image_url" @click="onClick(data.topic_link)">
        <div class='text'>{{data.text}}</div>
      </div>
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'Banner',
    props: ['mode', 'instance_id', 'common', 'content'],
    data() {
      return {
        dataList: [],
        feature: {},
        space_height: '30rpx'
      }
    },
    watch: {
      'content.code': {
        handler() {
          this.getData()
        }
      }
    },
    methods: {
      async getData() {
        if (this.content.code) {
          const result = await Axios.get(`${ENV.CMS}/operationContent/getByCode?code=${this.content.code}`)
          if(result.code === 200){
            this.space_height = (result.data.operation.space_height || 30) + 'rpx'
            let number = 1;
            const dataList = [];
            switch (result.data.operation.style) {
              case 'column1':
                number = 1;
                break;
              case 'column2':
                number = 2;
                break;
              case 'column3':
                number = 3;
                break;
              case 'column4':
                number = 4;
                break;
              case 'column5':
                number = 5;
                break;

            }
            result.data.contentList.forEach(content => {
              content.image_url = XIU.getImgFormat(content.image_url, '/resize,w_750')
            })
            while (result.data.contentList.length) {
              dataList.push(result.data.contentList.splice(0, number))
            }
            this.dataList = dataList;
          }
        }
      },
      onClick(data) {
        XIU.genLink(data)
      }
    },
    components: {},
    mounted() {
      this.getData();
    },
  }
</script>
<style lang="scss" scoped>
  @import "~@/styles/base";
  .topic-image-list {
    .img-list {
      display: flex;
      align-content: space-between;

      .img-wrap {
        flex: 1;
        padding: 0 rpx(20);
        &:last-child {
          margin-right: 0;
        }

        .image {
          display: block;
          width: 100%;
        }
        .text {
          font-size: rpx(22);
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #000000;
          line-height: rpx(37);
          text-align: center;
        }

      }
    }
  }
</style>
