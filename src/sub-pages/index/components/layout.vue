<template>
  <div class="topic-layout">
    <div v-for="(layout,index) in layoutList" :key="index">
      <banner v-if="layout.name === 'banner'" :content="layout.content" :instance_id="layout.instance_id"></banner>
      <t-image v-if="layout.name === 'image'" :content="layout.content" :instance_id="layout.instance_id"></t-image>
      <t-image-list v-if="layout.name === 'image-list'" :content="layout.content" :instance_id="layout.instance_id"></t-image-list>
      <pingou v-if="layout.name === 'pingou'" :content="layout.content" :instance_id="layout.instance_id"></pingou>
      <item-list-h v-if="layout.name === 'item-hscroll'" :content="layout.content" :instance_id="layout.instance_id"></item-list-h>
      <t-title v-if="layout.name === 'title'" :content="layout.content" :instance_id="layout.instance_id"></t-title>
      <space v-if="layout.name === 'space'" :content="layout.content" :instance_id="layout.instance_id"></space>
      <item-list v-if="layout.name === 'item-list'" :content="layout.content" :instance_id="layout.instance_id"></item-list>
      <cms-rich-text v-if="layout.name === 'richtext'" :content="layout.content" :instance_id="layout.instance_id"></cms-rich-text>
      <brand-list v-if="layout.name === 'brand-list'" :content="layout.content" :instance_id="layout.instance_id"></brand-list>
      <store-list v-if="layout.name === 'store-list'" :content="layout.content" :instance_id="layout.instance_id"></store-list>
    </div>
  </div>
</template>
<script>
  import banner from './banner'
  import tImage from './image'
  import tImageList from './image-list'
  import pingou from './pingou'
  import itemListH from './item-list-h'
  import itemList from './item-list/index'
  import tTitle from './title'
  import space from './space'
  import cmsRichText from './rict-text'
  import brandList from "./brand-list";
  import storeList from "./store-list";

  export default {
    props: {
      pageId: {
        type: String,
        default: ''
      }
    },
    components: {
      tImage,
      banner,
      pingou,
      itemListH,
      tTitle,
      space,
      itemList,
      cmsRichText,
      tImageList,
      brandList,
      storeList,
    },
    data() {
      return {
        layoutList: [],
      }
    },
    watch: {
      pageId() {
        this.loadData();
      }
    },
    methods: {
      changeView(data) {
        this.$emit('changeView', data)
      },
      async refresh() {
        await this.loadData();
      },
      reset() {
        this.layoutList = [];
      },
      async loadData() {
        console.log(this.pageId, 'id----')
        if (!this.pageId) {
          return;
        }
        //wx.showLoading({ title: '正在获取数据...', mask: true });
        const result = await Axios.get(`${ENV.CMS}/topic/getLayout`, {
          params: {id: this.pageId}
        })
        //wx.hideLoading()
        console.info(result)
        if (result.code === 200) {
          this.layoutList = result.data.layout;
          this.$emit('change', result.data)
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    },
    async mounted() {
      this.loadData();
    }
  }
</script>

<style lang="scss">
  @import "@/styles/base";

  .topic-layout {
    padding-bottom: rpx(50);
  }
</style>
