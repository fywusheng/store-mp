<template>
	<view class="drag-box">
		<view 
			v-for="(item,index) in dataList"
			:key="index"
			:style="{top: item.top +'px',
				height: (itemHeight - 1)+'rpx'}"
			class="drag-item"
			:class="{'drag-active': item.isActive}"
			@longtap="longtap(item)"
			@touchstart="touchstart"
			@touchmove.stop.prevent="touchmove"
			@touchend="touchend(item)">
				<slot name="item" :item="item"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
		  list: {
		    type: Array,
		    default: () => ([])
		  },
		  itemHeight: {
		    type: [Number],
		    default: 70
		  }
		},
		data() {
			return {
				activeItem: null,
				isDrag: false,
				dragTargetY: 0,
				dataList: [],
				sortIndexList: [],
			}
		},
		watch: {
		  list: {
		    immediate: true,
		    deep: true,
		    handler (list) {
		      this.setList(list)
		    }
		  }
		},
		methods: {
			touchstart(e){
				this.dragTargetY = e.touches[0].pageY;
			},
			longtap(item){
				this.activeItem = item;
				this.isDrag = true;
				item.isActive = true;
			},
			touchmove(e){
				if(!this.isDrag){
					return
				}
				let newY = e.touches[0].pageY;
				let d = newY - this.dragTargetY;
				this.activeItem.top += d;
				
				let prevIndex = this.sortIndexList[this.activeItem.index] - 1;
				let nextIndex = this.sortIndexList[this.activeItem.index] + 1;
				if (prevIndex >= 0 && d < 0){
					let item = this.getItemByIndex(prevIndex);
					if (this.activeItem.top < item.top){
						this.swapArray(item);
					}
				}else if (nextIndex < this.list.length && d > 0) {
					let item = this.getItemByIndex(nextIndex);
					if (this.activeItem.top > item.top){
						this.swapArray(item);
					}
				}
				this.dragTargetY = newY;
			},
			touchend(item){
				if(!this.isDrag){
					return
				}
				this.isDrag = false;
				item.isActive = false;
				this.activeItem.top = this.sortIndexList[this.activeItem.index] * this.rowHeight;
				let sortList = [];
				Array(this.dataList.length).fill(0).forEach((v,index)=>{
					let tempObj = this.deepClone(this.getItemByIndex(index));
					delete tempObj.isActive;
					delete tempObj.top;
					delete tempObj.index;
					sortList.push(tempObj);
				});
				this.$emit('change', sortList);
			},
			getItemByIndex(index){
				for (let i = 0;i < this.sortIndexList.length;i++){
					if (this.sortIndexList[i] === index){
						return this.dataList[i];
					}
				}
				return null;
			},
			swapArray(item) {//列表中两个元素交换位置
				let index = this.sortIndexList[this.activeItem.index];
				this.sortIndexList[this.activeItem.index] = this.sortIndexList[item.index];
				this.sortIndexList[item.index] = index;
				item.top = index * this.rowHeight;
				this.count = 0;
			},
			setList(list){
				this.dataList = list.map((item, index) => {
				  this.sortIndexList.push(index);
				  return {
				    ...item,
				    isActive: false,
					top: index * this.rowHeight,
					index: index
				  }
				})
			},
			deepClone(obj){
			    let result={},oClass=this.isClass(obj);
				console.log(oClass)
				for(let key in obj){
					let copy=obj[key];
					if(this.isClass(copy)=="Object"){
						result[key]=arguments.callee(copy);
					}else if(this.isClass(copy)=="Array"){
						result[key]=arguments.callee(copy);
					}else{
						result[key]=obj[key];
					}
				}
				return result;
			},
			isClass(o){
			    if(o===null) return "Null";
				if(o===undefined) return "Undefined";
				return Object.prototype.toString.call(o).slice(8,-1);
			}
		},
		mounted() {
		},
		computed:{
			rowHeight(){
				const res = uni.getSystemInfoSync();
				let screenWidth = res.screenWidth;
				if (this.itemHeight){
					return this.itemHeight*screenWidth/750;
				}else{
					return 0;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.drag-box{
		width: 100%;
		height: 100%;
		position: relative;
		.drag-item{
			width: 100%;
			text-align: center;
			transition: all 0.5s;
			background-color: #fff;
			z-index: 1;
			border-bottom: 1rpx solid #F5F5F5;
			position: absolute;
		}
	}
	.drag-active{
		box-shadow: 0 8px 20px 0 #e6e6e6;
		transform: scale(1.1);
		z-index: 9 !important;
		transition:  box-shadow .5s, transform .5s, top 0s !important;
	}
</style>