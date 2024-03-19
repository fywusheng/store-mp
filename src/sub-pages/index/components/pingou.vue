<template>
  <div class="pingou">
    <div class="pingou-bg"
         :style="{
                paddingBottom: height,
                backgroundImage: content.bg.image ? `url(${XIU.getImgFormat(content.bg.image, '/interlace,1/resize,w_750')})` : ''
            }">
    </div>
    <div class="pingou-area">
      <div class="pingou-area-a"
           v-for="(item, index) in content.area"
           :key="index"
           :style="style.area[index]"
           :data-type="item.link.type"
           :data-desc="item.link.desc"
           @click="onAreaClick(item, index)"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['instance_id', 'common', 'content'],
    data(){
      return {
        style: {
          area: []
        }
      }
    },
    computed: {
      height(){
        return this.content.bg.total_height / this.bgSize.w * 100 + '%'
      },
      bgSize(){
        return {
          w: this.content.bg.total_width,
          h: this.content.bg.total_height,
          c: this.content.bg.cell_height
        }
      },
      bgCellsCount(){
        return Math.ceil(this.bgSize.h / this.bgSize.c)
      },
      bgStyle(){
        return XIU.o2s({
          backgroundImage: this.content.bg.image ? `url(${XIU.getImgFormat(this.content.bg.image, '/interlace,1/resize,w_750/quality,q_1')})` : ''
        })
      },
      bgCellImage(){
        return _.map(new Array(this.bgCellsCount), (n, i) => {
          return XIU.getImgFormat(this.content.bg.image, '/resize,w_750/indexcrop,y_' + Math.ceil(this.content.bg.cell_height) + ',i_' + i)
        })
      },
      cellHeight(){
        return `height:${this.bgSize.c / this.bgSize.w * 750}rpx`
      },
      lastCellHeight(){
        return `height:${((this.bgSize.h % this.bgSize.c) || this.bgSize.c) / this.bgSize.w * 750}rpx`
      }
    },
    methods: {
      initAreaStyle(){
        this.style.area = _.map(this.content.area, n => {
          return XIU.o2s({
            left  : n.rect.x * 100 + '%',
            top   : n.rect.y * 100 + '%',
            width : n.rect.w * 100 + '%',
            height: n.rect.h * 100 + '%'
          })
        })
      },
      onAreaClick(area){
        XIU.genLink(area.link)
      }
    },
    mounted(){
      this.initAreaStyle()
    }
  }
</script>

<style lang="scss" scoped>
  .pingou{
    position:relative;overflow:hidden;

    &-bg{
      pointer-events:none;background:no-repeat center top;background-size:100%;

      &-cell{display:block;width:100%;}
    }
    &-area{
      position:absolute;top:0;left:0;width:100%;

      &::before{content:'';display:block;overflow:hidden;width:100%;height:0;padding-bottom:100%;pointer-events:none;}

      &-a{position:absolute;-webkit-tap-highlight-color:transparent;}

      .inner-box{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto;}
    }
  }
</style>
